import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import ProjectsSection from '../ProjectsSection.vue'
import type { Project, ProjectCategory } from '@/types'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      home: {
        projectsSection: {
          title: 'Featured Projects',
          allCategories: 'All Categories',
          featuredOnly: 'Featured Only',
          featured: 'Featured',
          technologies: 'Technologies',
          challenges: 'Challenges',
          outcomes: 'Outcomes',
          viewLive: 'View Live',
          viewCode: 'View Code',
          noProjects: 'No projects found for the selected filters.',
        },
      },
    },
  },
})

const mockCategories: ProjectCategory[] = [
  { id: 'web-app', name: 'Web Development', color: '#4FC08D' },
  { id: 'api', name: 'APIs & Backend', color: '#339933' },
]

function createMockProjects(): Project[] {
  return [
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce solution',
      technologies: ['Vue.js', 'Node.js', 'TypeScript'],
      images: [],
      liveUrl: 'https://example.com',
      repositoryUrl: 'https://github.com/example',
      role: 'Lead Developer',
      challenges: ['Real-time inventory'],
      outcomes: ['50% conversion increase'],
      category: { id: 'web-app', name: 'Web Development', color: '#4FC08D' },
      featured: true,
    },
    {
      id: '2',
      title: 'Task API',
      description: 'RESTful task management API',
      technologies: ['Node.js', 'Express', 'MongoDB'],
      images: [],
      repositoryUrl: 'https://github.com/example/api',
      role: 'Backend Developer',
      challenges: ['Schema design'],
      outcomes: ['1000+ users'],
      category: { id: 'api', name: 'APIs & Backend', color: '#339933' },
      featured: false,
    },
  ]
}

let mockProjects: Project[] = []

vi.mock('@/stores/portfolio', () => ({
  usePortfolioStore: () => ({
    projects: mockProjects,
    portfolioData: {
      projects: {
        categories: mockCategories,
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

  return mount(ProjectsSection, {
    global: {
      plugins: [pinia, i18n],
    },
  })
}

describe('ProjectsSection', () => {
  beforeEach(() => {
    mockProjects = createMockProjects()
  })

  describe('uses AppSection wrapper', () => {
    it('renders AppSection with correct props', () => {
      const wrapper = mountSection()

      const appSection = wrapper.findComponent({ name: 'AppSection' })
      expect(appSection.exists()).toBe(true)
      expect(appSection.props('sectionId')).toBe('projects')
      expect(appSection.props('background')).toBe('primary')
      expect(appSection.props('title')).toBe('Featured Projects')
    })
  })

  describe('BEM class names', () => {
    it('renders controls with .projects-section__controls', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.projects-section__controls').exists()).toBe(true)
    })

    it('renders category buttons with .projects-section__category-btn', () => {
      const wrapper = mountSection()

      const buttons = wrapper.findAll('.projects-section__category-btn')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('renders project cards with .projects-section__card', () => {
      const wrapper = mountSection()

      const cards = wrapper.findAll('.projects-section__card')
      expect(cards.length).toBeGreaterThan(0)
    })

    it('renders tech tags with .projects-section__tech-tag', () => {
      const wrapper = mountSection()

      const tags = wrapper.findAll('.projects-section__tech-tag')
      expect(tags.length).toBeGreaterThan(0)
    })
  })

  describe('empty state', () => {
    it('shows empty state with icon, title, and description when no projects match filters', () => {
      mockProjects = []
      const wrapper = mountSection()

      const emptyState = wrapper.find('.projects-section__empty')
      expect(emptyState.exists()).toBe(true)

      const icon = wrapper.find('.projects-section__empty-icon')
      expect(icon.exists()).toBe(true)
      expect(icon.find('svg').exists()).toBe(true)

      const title = wrapper.find('.projects-section__empty-title')
      expect(title.exists()).toBe(true)

      const description = wrapper.find('.projects-section__empty-description')
      expect(description.exists()).toBe(true)
    })

    it('does not show empty state when projects exist', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.projects-section__empty').exists()).toBe(false)
    })
  })
})
