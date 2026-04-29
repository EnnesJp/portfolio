import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionTitle from '../SectionTitle.vue'

function mountSectionTitle(props: { title: string; subtitle?: string }) {
  return mount(SectionTitle, { props })
}

describe('SectionTitle', () => {
  describe('rendering', () => {
    it('renders the title text', () => {
      const wrapper = mountSectionTitle({ title: 'My Section' })

      expect(wrapper.find('.section-title__text').text()).toBe('My Section')
    })

    it('renders title as an h2 element', () => {
      const wrapper = mountSectionTitle({ title: 'Heading' })

      const titleEl = wrapper.find('.section-title__text')
      expect(titleEl.element.tagName.toLowerCase()).toBe('h2')
    })

    it('renders subtitle when provided', () => {
      const wrapper = mountSectionTitle({
        title: 'Title',
        subtitle: 'A subtitle description',
      })

      const subtitle = wrapper.find('.section-title__subtitle')
      expect(subtitle.exists()).toBe(true)
      expect(subtitle.text()).toBe('A subtitle description')
    })

    it('does not render subtitle element when subtitle prop is not provided', () => {
      const wrapper = mountSectionTitle({ title: 'Title Only' })

      expect(wrapper.find('.section-title__subtitle').exists()).toBe(false)
    })

    it('does not render subtitle element when subtitle is empty string', () => {
      const wrapper = mountSectionTitle({ title: 'Title', subtitle: '' })

      expect(wrapper.find('.section-title__subtitle').exists()).toBe(false)
    })

    it('renders subtitle as a p element', () => {
      const wrapper = mountSectionTitle({
        title: 'Title',
        subtitle: 'Subtitle text',
      })

      const subtitle = wrapper.find('.section-title__subtitle')
      expect(subtitle.element.tagName.toLowerCase()).toBe('p')
    })
  })

  describe('structure', () => {
    it('has a root element with section-title class', () => {
      const wrapper = mountSectionTitle({ title: 'Test' })

      expect(wrapper.find('.section-title').exists()).toBe(true)
    })

    it('contains title inside the section-title wrapper', () => {
      const wrapper = mountSectionTitle({ title: 'Nested Title' })

      const root = wrapper.find('.section-title')
      expect(root.find('.section-title__text').exists()).toBe(true)
    })
  })
})
