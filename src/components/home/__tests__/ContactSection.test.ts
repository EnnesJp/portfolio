import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import ContactSection from '../ContactSection.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      home: {
        contactSection: {
          title: 'Hire Me For Your Next Amazing Project',
          description: "Let's make something new and meaningful!",
          contactMethods: {
            title: 'Get In Touch',
            email: 'Email',
            phone: 'Phone',
          },
          socialLinks: {
            title: 'Follow Me',
          },
          socialInfos: {
            location: 'Belo Horizonte, MG, Brazil',
          },
          availability: {
            available: 'Available for new projects',
            busy: 'Currently busy',
            unavailable: 'Not available',
          },
          form: {
            title: 'Send me a message',
            subtitle: "I'll get back to you as soon as possible",
          },
          fields: {
            name: 'Your name',
            email: 'Your email address',
            budget: 'Your budget (Optional)',
            description: 'Your project description',
            send: 'Send Message',
          },
          budgetRanges: {
            small: 'Under $5,000',
            medium: '$5,000 - $15,000',
            large: '$15,000 - $50,000',
            enterprise: '$50,000+',
            discuss: "Let's discuss",
          },
          validation: {},
        },
      },
    },
  },
})

vi.mock('@/stores/portfolio', () => ({
  usePortfolioStore: () => ({
    portfolioData: {
      contact: {
        contactMethods: [
          { id: 'email', type: 'email', label: 'Email', value: 'test@example.com' },
          { id: 'phone', type: 'phone', label: 'Phone', value: '+55 31 99999-9999' },
        ],
        socialLinks: [
          { id: 'linkedin', platform: 'LinkedIn', url: 'https://linkedin.com/in/test' },
          { id: 'github', platform: 'GitHub', url: 'https://github.com/test' },
        ],
        availability: 'available',
      },
    },
    loadPortfolioData: vi.fn(),
  }),
}))

vi.mock('@/composables/useEntranceAnimation', () => ({
  useEntranceAnimation: () => ({
    sectionRef: ref(null),
    isVisible: ref(true),
  }),
}))

function mountSection() {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(ContactSection, {
    global: {
      plugins: [pinia, i18n],
      stubs: {
        'contact-form': {
          template: '<div class="contact-form-stub"></div>',
        },
      },
    },
  })
}

describe('ContactSection', () => {
  describe('uses AppSection wrapper', () => {
    it('renders AppSection with correct props', () => {
      const wrapper = mountSection()

      const appSection = wrapper.findComponent({ name: 'AppSection' })
      expect(appSection.exists()).toBe(true)
      expect(appSection.props('sectionId')).toBe('contact')
      expect(appSection.props('background')).toBe('surface')
      expect(appSection.props('title')).toBe('Hire Me For Your Next Amazing Project')
    })
  })

  describe('BEM class names', () => {
    it('renders contact methods with .contact-section__contact-method', () => {
      const wrapper = mountSection()

      const methods = wrapper.findAll('.contact-section__contact-method')
      expect(methods.length).toBeGreaterThan(0)
    })

    it('renders social links with .contact-section__social-link', () => {
      const wrapper = mountSection()

      const links = wrapper.findAll('.contact-section__social-link')
      expect(links.length).toBeGreaterThan(0)
    })

    it('renders availability status with .contact-section__availability-status', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.contact-section__availability-status').exists()).toBe(true)
    })

    it('renders location info with .contact-section__location-info', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.contact-section__location-info').exists()).toBe(true)
    })
  })
})
