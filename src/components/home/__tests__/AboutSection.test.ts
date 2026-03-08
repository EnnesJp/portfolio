import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createI18n } from 'vue-i18n'
import { test } from '@fast-check/vitest'
import * as fc from 'fast-check'
import AboutSection from '../AboutSection.vue'
import { usePortfolioStore } from '@/stores/portfolio'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      navigation: {
        about: 'About',
      },
      common: {
        scroll: 'SCROLL',
      },
      home: {
        aboutSection: {
          hello: 'Hello',
          name: "I'm John Doe",
          resume: 'A Full Stack Developer',
          scrollForMoreInfo: 'Scroll for more info',
          journey: {
            title: 'Professional Journey',
          },
          values: {
            title: 'Core Values',
          },
          interests: {
            title: 'Interests & Hobbies',
          },
        },
      },
    },
  },
})

const personalInfoArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  location: fc.string({ minLength: 1, maxLength: 50 }),
  email: fc.emailAddress(),
  avatar: fc.webUrl(),
  phone: fc.option(fc.string({ minLength: 10, maxLength: 15 })),
  website: fc.option(fc.webUrl()),
  resume: fc.option(fc.webUrl()),
})

const journeyItemArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  date: fc.date().map(d => d.toISOString().split('T')[0]),
  type: fc.constantFrom('education', 'experience', 'achievement'),
})

const aboutDataArb = fc.record({
  personalInfo: personalInfoArb,
  professionalJourney: fc.array(journeyItemArb, { minLength: 0, maxLength: 10 }),
  values: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 8 }),
  interests: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 15 }),
})

describe('AboutSection', () => {
  let wrapper: any
  let portfolioStore: any

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })

    wrapper = mount(AboutSection, {
      global: {
        plugins: [pinia, i18n],
        stubs: {
          'arrow': true,
        },
      },
    })

    portfolioStore = usePortfolioStore()
  })

  describe('Basic Rendering', () => {
    it('should render the about section with basic structure', () => {
      expect(wrapper.find('.about-section').exists()).toBe(true)
      expect(wrapper.find('.about-section-main').exists()).toBe(true)
      expect(wrapper.find('.about-section-bottom').exists()).toBe(true)
    })

    it('should render social media links', () => {
      const socialLinks = wrapper.findAll('.about-section-bottom__social-medias img')
      expect(socialLinks).toHaveLength(2)
      expect(socialLinks[0].attributes('alt')).toBe('Linkedin')
      expect(socialLinks[1].attributes('alt')).toBe('Github')
    })
  })

  describe('Property-Based Tests', () => {
    test.prop([aboutDataArb])('should display all provided about data fields when available', (aboutData) => {
      portfolioStore.portfolioData = {
        personal: aboutData.personalInfo,
        about: aboutData,
      }

      wrapper.vm.$nextTick(() => {
        if (aboutData.personalInfo.name) {
          const nameElement = wrapper.find('.about-section-main__info--name')
          expect(nameElement.exists()).toBe(true)
        }

        if (aboutData.personalInfo.title) {
          const titleElement = wrapper.find('.about-section-main__info--resume')
          expect(titleElement.exists()).toBe(true)
        }

        if (aboutData.personalInfo.avatar) {
          const avatarElement = wrapper.find('.about-section-main__img--photo')
          expect(avatarElement.exists()).toBe(true)
          expect(avatarElement.attributes('src')).toBe(aboutData.personalInfo.avatar)
        }

        if (aboutData.professionalJourney && aboutData.professionalJourney.length > 0) {
          const journeySection = wrapper.find('.about-section-journey')
          expect(journeySection.exists()).toBe(true)
          
          const journeyItems = wrapper.findAll('.about-section-journey__item')
          expect(journeyItems.length).toBe(aboutData.professionalJourney.length)

          aboutData.professionalJourney.forEach((item, index) => {
            const journeyItem = journeyItems[index]
            expect(journeyItem.find('.about-section-journey__item-title').text()).toBe(item.title)
            expect(journeyItem.find('.about-section-journey__item-description').text()).toBe(item.description)
            expect(journeyItem.find('.about-section-journey__item-date').text()).toBe(item.date)
          })
        }

        if (aboutData.values && aboutData.values.length > 0) {
          const valuesSection = wrapper.find('.about-section-values')
          expect(valuesSection.exists()).toBe(true)
          
          const valueItems = wrapper.findAll('.about-section-values__item-text')
          expect(valueItems.length).toBe(aboutData.values.length)

          aboutData.values.forEach((value, index) => {
            expect(valueItems[index].text()).toBe(value)
          })
        }

        if (aboutData.interests && aboutData.interests.length > 0) {
          const interestsSection = wrapper.find('.about-section-interests')
          expect(interestsSection.exists()).toBe(true)
          
          const interestTags = wrapper.findAll('.about-section-interests__tag')
          expect(interestTags.length).toBe(aboutData.interests.length)

          aboutData.interests.forEach((interest, index) => {
            expect(interestTags[index].text()).toBe(interest)
          })
        }
      })
    })

    test.prop([personalInfoArb])('should handle missing optional personal info fields gracefully', (personalInfo) => {
      const minimalPersonalInfo = {
        name: personalInfo.name,
        title: personalInfo.title,
        location: personalInfo.location,
        email: personalInfo.email,
        avatar: personalInfo.avatar,
      }

      portfolioStore.portfolioData = {
        personal: minimalPersonalInfo,
        about: {
          personalInfo: minimalPersonalInfo,
          professionalJourney: [],
          values: [],
          interests: [],
        },
      }

      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('.about-section-main').exists()).toBe(true)
        expect(wrapper.find('.about-section-main__info--name').exists()).toBe(true)
        
        expect(wrapper.find('.about-section-journey').exists()).toBe(false)
        expect(wrapper.find('.about-section-values').exists()).toBe(false)
        expect(wrapper.find('.about-section-interests').exists()).toBe(false)
      })
    })

    test.prop([fc.array(journeyItemArb, { minLength: 1, maxLength: 5 })])('should render journey items with correct type classes', (journeyItems) => {
      portfolioStore.portfolioData = {
        personal: {
          name: 'Test User',
          title: 'Developer',
          location: 'Test City',
          email: 'test@example.com',
          avatar: 'test-avatar.jpg',
        },
        about: {
          personalInfo: {
            name: 'Test User',
            title: 'Developer',
            location: 'Test City',
            email: 'test@example.com',
            avatar: 'test-avatar.jpg',
          },
          professionalJourney: journeyItems,
          values: [],
          interests: [],
        },
      }

      wrapper.vm.$nextTick(() => {
        const journeyItemElements = wrapper.findAll('.about-section-journey__item')
        
        journeyItems.forEach((item, index) => {
          const itemElement = journeyItemElements[index]
          expect(itemElement.classes()).toContain(`about-section-journey__item--${item.type}`)
        })
      })
    })
  })

  describe('Social Media Interaction', () => {
    it('should open social media links in new tab when clicked', () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      
      const linkedinLink = wrapper.find('.about-section-bottom__social-medias img[alt="Linkedin"]')
      const githubLink = wrapper.find('.about-section-bottom__social-medias img[alt="Github"]')
      
      linkedinLink.trigger('click')
      expect(windowOpenSpy).toHaveBeenCalledWith('https://www.linkedin.com/in/joao-pedro-ennes/', '_blank')
      
      githubLink.trigger('click')
      expect(windowOpenSpy).toHaveBeenCalledWith('https://github.com/EnnesJp', '_blank')
      
      windowOpenSpy.mockRestore()
    })
  })

  describe('Navigation Integration', () => {
    it('should register section with navigation store on mount', () => {
      const mockElement = document.createElement('section')
      mockElement.id = 'about'
      document.body.appendChild(mockElement)
      
      wrapper.unmount()
      wrapper = mount(AboutSection, {
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn }), i18n],
          stubs: { 'arrow': true },
        },
      })
      
      const navigationStore = useNavigationStore()
      expect(navigationStore.registerSection).toHaveBeenCalledWith({
        id: 'about',
        label: 'About',
        order: 2,
        visible: true,
        element: mockElement,
      })
      
      document.body.removeChild(mockElement)
    })
  })
})