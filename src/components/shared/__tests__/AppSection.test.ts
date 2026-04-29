import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import AppSection from '../AppSection.vue'

vi.mock('@/composables/useEntranceAnimation', () => ({
  useEntranceAnimation: () => ({
    sectionRef: ref(null),
    isVisible: ref(true),
  }),
}))

function mountAppSection(
  props: {
    title: string
    subtitle?: string
    sectionId: string
    background?: 'primary' | 'surface'
  },
  slotContent?: string,
) {
  return mount(AppSection, {
    props,
    slots: {
      default: slotContent || '<div class="test-slot-content">Slot content</div>',
    },
  })
}

describe('AppSection', () => {
  describe('structure', () => {
    it('renders a <section> element with the correct id from sectionId prop', () => {
      const wrapper = mountAppSection({ title: 'Test Title', sectionId: 'my-section' })

      const section = wrapper.find('section')
      expect(section.exists()).toBe(true)
      expect(section.attributes('id')).toBe('my-section')
    })

    it('renders title in an h2 element', () => {
      const wrapper = mountAppSection({ title: 'My Title', sectionId: 'test' })

      const h2 = wrapper.find('h2')
      expect(h2.exists()).toBe(true)
      expect(h2.text()).toBe('My Title')
    })

    it('renders subtitle when provided', () => {
      const wrapper = mountAppSection({
        title: 'Title',
        subtitle: 'A subtitle',
        sectionId: 'test',
      })

      const subtitle = wrapper.find('.app-section__subtitle')
      expect(subtitle.exists()).toBe(true)
      expect(subtitle.text()).toBe('A subtitle')
    })

    it('does NOT render subtitle when not provided', () => {
      const wrapper = mountAppSection({ title: 'Title', sectionId: 'test' })

      expect(wrapper.find('.app-section__subtitle').exists()).toBe(false)
    })

    it('has max-width container with class app-section__container', () => {
      const wrapper = mountAppSection({ title: 'Title', sectionId: 'test' })

      const container = wrapper.find('.app-section__container')
      expect(container.exists()).toBe(true)
    })

    it('renders slot content inside app-section__content', () => {
      const wrapper = mountAppSection(
        { title: 'Title', sectionId: 'test' },
        '<p class="my-content">Hello</p>',
      )

      const content = wrapper.find('.app-section__content')
      expect(content.exists()).toBe(true)
      expect(content.find('.my-content').exists()).toBe(true)
      expect(content.find('.my-content').text()).toBe('Hello')
    })
  })

  describe('background prop', () => {
    it('applies app-section--primary class when background="primary"', () => {
      const wrapper = mountAppSection({
        title: 'Title',
        sectionId: 'test',
        background: 'primary',
      })

      const section = wrapper.find('section')
      expect(section.classes()).toContain('app-section--primary')
    })

    it('applies app-section--surface class when background="surface"', () => {
      const wrapper = mountAppSection({
        title: 'Title',
        sectionId: 'test',
        background: 'surface',
      })

      const section = wrapper.find('section')
      expect(section.classes()).toContain('app-section--surface')
    })

    it('defaults to primary background when background prop is not provided', () => {
      const wrapper = mountAppSection({ title: 'Title', sectionId: 'test' })

      const section = wrapper.find('section')
      expect(section.classes()).toContain('app-section--primary')
    })
  })

  describe('entrance animation', () => {
    it('applies app-section--visible class when entrance animation triggers (isVisible: true)', () => {
      const wrapper = mountAppSection({ title: 'Title', sectionId: 'test' })

      const section = wrapper.find('section')
      expect(section.classes()).toContain('app-section--visible')
    })
  })
})
