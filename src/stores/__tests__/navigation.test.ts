import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { fc, test } from '@fast-check/vitest'
import { useNavigationStore } from '../navigation'
import type { NavigationSection } from '@/types'

const scrollIntoViewMock = vi.fn()

Object.defineProperty(globalThis, 'window', {
  value: {
    scrollY: 0,
    innerHeight: 800,
  },
  writable: true,
})

describe('Navigation Store', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia({
      createSpy: vi.fn,
    }))
    
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test.prop([
    fc.array(
      fc.record({
        id: fc.string({ minLength: 1, maxLength: 20 }),
        label: fc.string({ minLength: 1, maxLength: 50 }),
        order: fc.integer({ min: 0, max: 10 }),
        visible: fc.boolean(),
      }),
      { minLength: 1, maxLength: 5 }
    )
  ])('should navigate to sections correctly and update navigation state', (sectionsData) => {
    const store = useNavigationStore()
    
    const sections: NavigationSection[] = sectionsData.map(data => ({
      ...data,
      element: {
        scrollIntoView: scrollIntoViewMock,
        getBoundingClientRect: () => ({
          top: 100,
          bottom: 200,
          left: 0,
          right: 0,
          width: 0,
          height: 100,
        }),
      } as any,
    }))
    
    sections.forEach(section => {
      store.registerSection(section)
    })
    
    expect(store.sections.length).toBe(sections.length)
    
    const visibleSections = sections.filter(s => s.visible)
    
    if (visibleSections.length > 0) {
      const targetSection = visibleSections[0]
      
      store.scrollToSection(targetSection.id)
      
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      })
      
      expect(store.isScrolling).toBe(true)
    }
    
    const expectedVisibleSections = sections
      .filter(s => s.visible)
      .sort((a, b) => a.order - b.order)
    
    expect(store.visibleSections).toEqual(expectedVisibleSections)
  })

  test.prop([
    fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }),
      label: fc.string({ minLength: 1, maxLength: 50 }),
      order: fc.integer({ min: 0, max: 10 }),
      visible: fc.boolean(),
    })
  ])('should register sections correctly', (sectionData) => {
    const store = useNavigationStore()
    
    const section: NavigationSection = {
      ...sectionData,
      element: document.createElement('div'),
    }
    
    store.registerSection(section)
    
    expect(store.sections).toContainEqual(section)
    
    const updatedSection = { ...section, label: 'Updated Label' }
    store.registerSection(updatedSection)
    
    const matchingSections = store.sections.filter(s => s.id === section.id)
    expect(matchingSections).toHaveLength(1)
    expect(matchingSections[0].label).toBe('Updated Label')
  })

  test.prop([
    fc.float({ min: 0, max: 1000 }),
    fc.integer({ min: 500, max: 2000 })
  ])('should update scroll progress correctly', (scrollY, windowHeight) => {
    const store = useNavigationStore()
    
    Object.defineProperty(globalThis, 'document', {
      value: {
        documentElement: {
          scrollHeight: 2000,
        },
      },
      writable: true,
    })
    
    Object.defineProperty(globalThis, 'window', {
      value: {
        scrollY,
        innerHeight: windowHeight,
      },
      writable: true,
    })
    
    store.updateCurrentSection()
    
    const documentHeight = 2000 - windowHeight
    const expectedProgress = Math.min(scrollY / documentHeight, 1)
    
    expect(store.scrollProgress).toBe(expectedProgress)
  })
})