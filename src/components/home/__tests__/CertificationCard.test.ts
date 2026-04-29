import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import CertificationCard from '../CertificationCard.vue'
import type { Certification } from '@/types'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      home: {
        certificationsSection: {
          certification: {
            issuer: 'Issued by',
            date: 'Date',
            verify: 'Verify Credential',
          },
        },
      },
    },
  },
})

function createCertification(overrides: Partial<Certification> = {}): Certification {
  return {
    id: '1',
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: new Date('2023-06-15T12:00:00'),
    credentialId: 'AWS-SAA-123456',
    verificationUrl: 'https://aws.amazon.com/verification',
    badge: '/images/badges/aws-saa.png',
    category: {
      id: 'cloud',
      name: 'Cloud Computing',
      color: '#FF9900',
    },
    ...overrides,
  }
}

function mountCard(certification: Certification) {
  return mount(CertificationCard, {
    props: { certification },
    global: {
      plugins: [i18n],
    },
  })
}

describe('CertificationCard', () => {
  describe('renders essential information', () => {
    it('renders certification name', () => {
      const cert = createCertification()
      const wrapper = mountCard(cert)

      expect(wrapper.find('.certification-card__name').text()).toBe(
        'AWS Certified Solutions Architect',
      )
    })

    it('renders issuer', () => {
      const cert = createCertification()
      const wrapper = mountCard(cert)

      expect(wrapper.find('.certification-card__issuer').text()).toContain('Amazon Web Services')
    })

    it('renders formatted date', () => {
      const cert = createCertification({ date: new Date('2023-06-15T12:00:00') })
      const wrapper = mountCard(cert)

      const dateText = wrapper.find('.certification-card__date').text()
      expect(dateText).toContain('June')
      expect(dateText).toContain('2023')
    })

    it('renders category as plain text', () => {
      const cert = createCertification()
      const wrapper = mountCard(cert)

      const category = wrapper.find('.certification-card__category')
      expect(category.exists()).toBe(true)
      expect(category.text()).toBe('Cloud Computing')
      expect(category.element.tagName.toLowerCase()).toBe('span')
    })
  })

  describe('does NOT render removed elements', () => {
    it('does not render badge image', () => {
      const cert = createCertification()
      const wrapper = mountCard(cert)

      expect(wrapper.find('img').exists()).toBe(false)
      expect(wrapper.find('.certification-card__badge').exists()).toBe(false)
    })

    it('does not render status indicator', () => {
      const cert = createCertification()
      const wrapper = mountCard(cert)

      expect(wrapper.find('.certification-card__status').exists()).toBe(false)
      expect(wrapper.text()).not.toContain('Valid')
      expect(wrapper.text()).not.toContain('Expired')
    })

    it('does not render credentialId', () => {
      const cert = createCertification({ credentialId: 'AWS-SAA-123456' })
      const wrapper = mountCard(cert)

      expect(wrapper.text()).not.toContain('AWS-SAA-123456')
      expect(wrapper.find('.certification-card__credential-id').exists()).toBe(false)
    })
  })

  describe('conditional verification link', () => {
    it('renders verification link when verificationUrl is provided', () => {
      const cert = createCertification({
        verificationUrl: 'https://aws.amazon.com/verification',
      })
      const wrapper = mountCard(cert)

      const link = wrapper.find('.certification-card__link')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe('https://aws.amazon.com/verification')
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toContain('noopener')
      expect(link.text()).toBe('Verify Credential')
    })

    it('does NOT render verification link when verificationUrl is absent', () => {
      const cert = createCertification({
        verificationUrl: undefined,
      })
      const wrapper = mountCard(cert)

      expect(wrapper.find('.certification-card__link').exists()).toBe(false)
      expect(wrapper.find('a').exists()).toBe(false)
    })
  })
})
