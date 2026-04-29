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

  describe('section title', () => {
    it('renders section title using i18n key', () => {
      const wrapper = mountSection()

      const title = wrapper.find('.hard-skills-section__title')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Technical Skills')
    })
  })

  describe('does NOT render removed elements', () => {
    it('does not render display mode toggle', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.hard-skills-section__display-modes').exists()).toBe(false)
      expect(wrapper.find('.hard-skills-section__mode-btn').exists()).toBe(false)
      expect(wrapper.findAll('svg').length).toBe(0)
    })

    it('does not render category filter buttons', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.hard-skills-section__filters').exists()).toBe(false)
      expect(wrapper.find('.hard-skills-section__filter-btn').exists()).toBe(false)
    })

    it('does not render proficiency bar', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.skill-item__bar').exists()).toBe(false)
      expect(wrapper.find('.skill-item__progress').exists()).toBe(false)
      expect(wrapper.find('.skill-item__bar-track').exists()).toBe(false)
      expect(wrapper.find('.skill-item__bar-fill').exists()).toBe(false)
    })

    it('does not render stats counters (years, projects)', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.skill-item__stats').exists()).toBe(false)
    })

    it('does not render chart view', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.hard-skills-section__chart').exists()).toBe(false)
    })
  })

  describe('renders skills with proficiency dots', () => {
    it('renders all skills from the store', () => {
      const wrapper = mountSection()

      const skillItems = wrapper.findAll('.skill-item')
      expect(skillItems).toHaveLength(3)
    })

    it('renders skill names', () => {
      const wrapper = mountSection()

      const names = wrapper.findAll('.skill-item__name')
      expect(names[0].text()).toBe('Vue.js')
      expect(names[1].text()).toBe('TypeScript')
      expect(names[2].text()).toBe('Python')
    })

    it('renders 5 proficiency dots per skill', () => {
      const wrapper = mountSection()

      const skillItems = wrapper.findAll('.skill-item')
      skillItems.forEach((item) => {
        const dots = item.findAll('.skill-item__dot')
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

      const dots = wrapper.findAll('.skill-item__dot')
      const filledDots = wrapper.findAll('.skill-item__dot--filled')
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

      const filledDots = wrapper.findAll('.skill-item__dot--filled')
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

      const proficiency = wrapper.find('.skill-item__proficiency')
      expect(proficiency.attributes('aria-label')).toBe('3 out of 5')
    })
  })

  describe('empty state', () => {
    it('shows empty state when skills array is empty', () => {
      mockSkills = []
      const wrapper = mountSection()

      const emptyState = wrapper.find('.hard-skills-section__empty')
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.text()).toContain('No skills found')
    })

    it('does not show grid when skills are empty', () => {
      mockSkills = []
      const wrapper = mountSection()

      expect(wrapper.find('.hard-skills-section__grid').exists()).toBe(false)
    })
  })
})
