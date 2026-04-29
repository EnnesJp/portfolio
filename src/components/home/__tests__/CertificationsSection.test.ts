import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import CertificationsSection from '../CertificationsSection.vue'
import type { Certification } from '@/types'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      navigation: {
        certifications: 'Certifications',
      },
      home: {
        certificationsSection: {
          title: 'Certifications & Credentials',
          certification: {
            issuer: 'Issued by',
            date: 'Date',
            verify: 'Verify Credential',
          },
          empty: {
            title: 'No certifications found',
            description: 'No certifications match the selected filters.',
          },
        },
      },
    },
  },
})

function createMockCertifications(): Certification[] {
  return [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: new Date('2023-06-15T12:00:00'),
      credentialId: 'AWS-SAA-123456',
      verificationUrl: 'https://aws.amazon.com/verification',
      badge: '/images/badges/aws-saa.png',
      category: { id: 'cloud', name: 'Cloud Computing', color: '#FF9900' },
    },
    {
      id: '2',
      name: 'Vue.js Certified Developer',
      issuer: 'Vue.js Foundation',
      date: new Date('2023-03-20T12:00:00'),
      credentialId: 'VUE-DEV-789012',
      verificationUrl: 'https://vuejs.org/verification',
      badge: '/images/badges/vue-certified.png',
      category: { id: 'frontend', name: 'Software Development', color: '#4FC08D' },
    },
    {
      id: '3',
      name: 'Professional Scrum Master I',
      issuer: 'Scrum.org',
      date: new Date('2022-11-10T12:00:00'),
      credentialId: 'PSM-345678',
      verificationUrl: 'https://scrum.org/verification',
      badge: '/images/badges/psm-1.png',
      category: { id: 'management', name: 'Project Management', color: '#0066CC' },
    },
  ]
}

const mockCertificationsRef = ref<Certification[]>([])

vi.mock('@/stores/portfolio', () => ({
  usePortfolioStore: () => ({
    certifications: mockCertificationsRef,
    loadPortfolioData: vi.fn(),
  }),
}))

vi.mock('@/stores/navigation', () => ({
  useNavigationStore: () => ({
    registerSection: vi.fn(),
  }),
}))

function mountSection() {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(CertificationsSection, {
    global: {
      plugins: [pinia, i18n],
    },
  })
}

describe('CertificationsSection', () => {
  beforeEach(() => {
    mockCertificationsRef.value = createMockCertifications()
  })

  describe('section structure', () => {
    it('renders using AppSection with correct props', () => {
      const wrapper = mountSection()

      const appSection = wrapper.findComponent({ name: 'AppSection' })
      expect(appSection.exists()).toBe(true)
      expect(appSection.props('sectionId')).toBe('certifications')
      expect(appSection.props('background')).toBe('surface')
      expect(appSection.props('title')).toBe('Certifications & Credentials')
    })

    it('does not render its own section header or title elements', () => {
      const wrapper = mountSection()

      expect(wrapper.find('.certifications-section__header').exists()).toBe(false)
      expect(wrapper.find('.certifications-section__title').exists()).toBe(false)
    })
  })

  describe('renders all certifications', () => {
    it('renders all certifications from the store without filtering', () => {
      const wrapper = mountSection()

      const cards = wrapper.findAllComponents({ name: 'CertificationCard' })
      expect(cards).toHaveLength(3)
    })

    it('renders certification names in the cards', () => {
      const wrapper = mountSection()

      const text = wrapper.text()
      expect(text).toContain('AWS Certified Solutions Architect')
      expect(text).toContain('Vue.js Certified Developer')
      expect(text).toContain('Professional Scrum Master I')
    })

    it('renders certifications sorted by date (newest first)', () => {
      const wrapper = mountSection()

      const cards = wrapper.findAllComponents({ name: 'CertificationCard' })
      const names = cards.map((card) => card.props('certification').name)
      expect(names[0]).toBe('AWS Certified Solutions Architect')
      expect(names[1]).toBe('Vue.js Certified Developer')
      expect(names[2]).toBe('Professional Scrum Master I')
    })
  })

  describe('empty state', () => {
    it('shows empty state when certifications array is empty', () => {
      mockCertificationsRef.value = []
      const wrapper = mountSection()

      const emptyState = wrapper.find('.certifications-section__empty')
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.text()).toContain('No certifications found')
    })

    it('empty state follows standard pattern with icon, title, and description', () => {
      mockCertificationsRef.value = []
      const wrapper = mountSection()

      expect(wrapper.find('.certifications-section__empty-icon').exists()).toBe(true)
      expect(wrapper.find('.certifications-section__empty-title').exists()).toBe(true)
      expect(wrapper.find('.certifications-section__empty-description').exists()).toBe(true)
    })

    it('does not show grid when certifications are empty', () => {
      mockCertificationsRef.value = []
      const wrapper = mountSection()

      expect(wrapper.find('.certifications-section__grid').exists()).toBe(false)
    })
  })
})
