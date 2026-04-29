import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'
import HardSkillsSection from '../HardSkillsSection.vue'
import type { Skill } from '@/types'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      home: {
        hardSkillsSection: {
          title: 'Technical Skills',
          noSkills: 'No skills found for the selected category.',
          empty: {
            title: 'No skills found',
            description: 'No skills match the selected filters.',
          },
        },
      },
    },
  },
})

function createMockSkills(): Skill[] {
  return [
    {
      id: '1',
      name: 'Vue.js',
      category: { id: 'frontend', name: 'Frontend', color: '#4FC08D' },
      proficiency: 5,
      yearsOfExperience: 4,
      projects: 12,
      icon: '/images/icons/vue.svg',
    },
    {
      id: '2',
      name: 'TypeScript',
      category: { id: 'frontend', name: 'Frontend', color: '#4FC08D' },
      proficiency: 4,
      yearsOfExperience: 3,
      projects: 10,
      icon: '/images/icons/typescript.svg',
    },
    {
      id: '3',
      name: 'Python',
      category: { id: 'backend', name: 'Backend', color: '#339933' },
      proficiency: 3,
      yearsOfExperience: 2,
      projects: 5,
      icon: '/images/icons/python.svg',
    },
  ]
}

let mockSkills: Skill[] = []

vi.mock('@/stores/portfolio', () => ({
  usePortfolioStore: () => ({
    skills: mockSkills,
    loadPortfolioData: vi.fn(),
  }),
}))

vi.mock('@/composables/useEntranceAnimation', () => ({
  useEntranceAnimation: () => ({
    sectionRef: { value: null },
    isVisible: { value: true },
  }),
}))

function mountSection() {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(HardSkillsSection, {
    global: {
      plugins: [pinia, i18n],
    },
  })
}

describe('HardSkillsSection', () => {
  beforeEach(() => {
    mockSkills = createMockSkills()
  })

  describe('uses AppSection wrapper', () => {
    it('renders AppSection with correct props', () => {
      const wrapper = mountSection()

      const appSection = wrapper.findComponent({ name: 'AppSection' })
      expect(appSection.exists()).toBe(true)
      expect(appSection.props('sectionId')).toBe('hard-skills')
      expect(appSection.props('background')).toBe('primary')
      expect(appSection.props('title')).toBe('Technical Skills')
    })
  })

  describe('renders skills with BEM-scoped class names', () => {
    it('renders all skills from the store', () => {
      const wrapper = mountSection()

      const skillItems = wrapper.findAll('.hard-skills-section__skill-item')
      expect(skillItems).toHaveLength(3)
    })

    it('renders skill names with BEM class', () => {
      const wrapper = mountSection()

      const names = wrapper.findAll('.hard-skills-section__skill-name')
      expect(names[0].text()).toBe('Vue.js')
      expect(names[1].text()).toBe('TypeScript')
      expect(names[2].text()).toBe('Python')
    })

    it('renders skill categories with BEM class', () => {
      const wrapper = mountSection()

      const categories = wrapper.findAll('.hard-skills-section__skill-category')
      expect(categories[0].text()).toBe('Frontend')
      expect(categories[2].text()).toBe('Backend')
    })

    it('renders 5 proficiency dots per skill', () => {
      const wrapper = mountSection()

      const skillItems = wrapper.findAll('.hard-skills-section__skill-item')
      skillItems.forEach((item) => {
        const dots = item.findAll('.hard-skills-section__skill-dot')
        expect(dots).toHaveLength(5)
      })
    })

    it('fills correct number of dots based on proficiency (3 out of 5)', () => {
      mockSkills = [
        {
          id: '1',
          name: 'Python',
          category: { id: 'backend', name: 'Backend', color: '#339933' },
          proficiency: 3,
          yearsOfExperience: 2,
          projects: 5,
        },
      ]
      const wrapper = mountSection()

      const dots = wrapper.findAll('.hard-skills-section__skill-dot')
      const filledDots = wrapper.findAll('.hard-skills-section__skill-dot--filled')
      expect(dots).toHaveLength(5)
      expect(filledDots).toHaveLength(3)
    })

    it('fills correct number of dots for proficiency=5 (all filled)', () => {
      mockSkills = [
        {
          id: '1',
          name: 'Vue.js',
          category: { id: 'frontend', name: 'Frontend', color: '#4FC08D' },
          proficiency: 5,
          yearsOfExperience: 4,
          projects: 12,
        },
      ]
      const wrapper = mountSection()

      const filledDots = wrapper.findAll('.hard-skills-section__skill-dot--filled')
      expect(filledDots).toHaveLength(5)
    })

    it('has aria-label on proficiency dots container', () => {
      mockSkills = [
        {
          id: '1',
          name: 'Python',
          category: { id: 'backend', name: 'Backend', color: '#339933' },
          proficiency: 3,
          yearsOfExperience: 2,
          projects: 5,
        },
      ]
      const wrapper = mountSection()

      const proficiency = wrapper.find('.hard-skills-section__skill-proficiency')
      expect(proficiency.attributes('aria-label')).toBe('3 out of 5')
    })
  })

  describe('empty state', () => {
    it('shows empty state with icon, title, and description when skills array is empty', () => {
      mockSkills = []
      const wrapper = mountSection()

      const emptyState = wrapper.find('.hard-skills-section__empty')
      expect(emptyState.exists()).toBe(true)

      const icon = wrapper.find('.hard-skills-section__empty-icon')
      expect(icon.exists()).toBe(true)
      expect(icon.find('svg').exists()).toBe(true)

      const title = wrapper.find('.hard-skills-section__empty-title')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('No skills found')

      const description = wrapper.find('.hard-skills-section__empty-description')
      expect(description.exists()).toBe(true)
      expect(description.text()).toBe('No skills match the selected filters.')
    })

    it('does not show grid when skills are empty', () => {
      mockSkills = []
      const wrapper = mountSection()

      expect(wrapper.find('.hard-skills-section__grid').exists()).toBe(false)
    })
  })

  describe('does NOT render removed elements', () => {
    it('does not render display mode toggle', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.hard-skills-section__display-modes').exists()).toBe(false)
      expect(wrapper.find('.hard-skills-section__mode-btn').exists()).toBe(false)
    })

    it('does not render category filter buttons', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.hard-skills-section__filters').exists()).toBe(false)
      expect(wrapper.find('.hard-skills-section__filter-btn').exists()).toBe(false)
    })
  })
})
