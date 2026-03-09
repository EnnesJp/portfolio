import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { fc, test } from '@fast-check/vitest'
import { useNavigationStore } from '../navigation'
import type { NavigationSection } from '@/types'
import { setupDOMMocks, resetDOMMocks, navigationSection, validNumber } from '@/test-utils'

const scrollIntoViewMock = vi.fn()

describe('Navigation Store', () => {
  let store: ReturnType<typeof useNavigationStore>

  beforeEach(() => {
    setupDOMMocks()

    setActivePinia(
      createTestingPinia({
        createSpy: vi.fn,
        stubActions: false,
      }),
    )

    vi.clearAllMocks()

    store = useNavigationStore()
    store.$reset()
    store.sections = []
  })

  afterEach(() => {
    resetDOMMocks()
    vi.restoreAllMocks()
  })

  test.prop([fc.array(navigationSection(), { minLength: 1, maxLength: 5 })])(
    'should navigate to sections correctly and update navigation state',
    (sectionsData) => {
      store.sections = []
      store.currentSection = ''
      store.isScrolling = false
      store.scrollProgress = 0

      const sections: NavigationSection[] = sectionsData.map((data) => ({
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

      sections.forEach((section) => {
        store.registerSection(section)
      })

      expect(store.sections.length).toBeGreaterThanOrEqual(sections.length)

      const visibleSections = sections.filter((s) => s.visible)

      if (visibleSections.length > 0) {
        const targetSection = visibleSections[0]

        store.scrollToSection(targetSection.id)

        expect(scrollIntoViewMock).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start',
        })

        expect(store.isScrolling).toBe(true)
      }

      const expectedVisibleSections = sections
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order)

      expect(store.visibleSections.length).toBe(expectedVisibleSections.length)
    },
  )

  test.prop([navigationSection()])('should register sections correctly', (sectionData) => {
    store.sections = []
    store.currentSection = ''
    store.isScrolling = false
    store.scrollProgress = 0

    const section: NavigationSection = {
      ...sectionData,
      element: document.createElement('div'),
    }

    store.registerSection(section)

    const matchingSections = store.sections.filter((s) => s.id === section.id)
    expect(matchingSections.length).toBeGreaterThan(0)

    const updatedSection = { ...section, label: 'Updated Label' }
    store.registerSection(updatedSection)

    const updatedMatchingSections = store.sections.filter((s) => s.id === section.id)
    expect(updatedMatchingSections).toHaveLength(1)
    expect(updatedMatchingSections[0].label).toBe('Updated Label')
  })

  test.prop([
    fc.oneof(fc.constant(0), validNumber({ min: 1, max: 1000 })),
    fc.integer({ min: 500, max: 2000 }),
  ])('should update scroll progress correctly', (scrollY, windowHeight) => {
    Object.defineProperty(document, 'documentElement', {
      value: {
        ...document.documentElement,
        scrollHeight: 2000,
      },
      writable: true,
      configurable: true,
    })

    Object.defineProperty(window, 'scrollY', {
      value: scrollY,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(window, 'innerHeight', {
      value: windowHeight,
      writable: true,
      configurable: true,
    })

    store.updateCurrentSection()

    const documentHeight = 2000 - windowHeight
    const expectedProgress = documentHeight > 0 ? Math.min(scrollY / documentHeight, 1) : 0

    expect(store.scrollProgress).toBe(expectedProgress)
  })
})
