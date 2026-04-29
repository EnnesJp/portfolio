import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { useEntranceAnimation } from '../useEntranceAnimation'

describe('useEntranceAnimation', () => {
  let observeMock: ReturnType<typeof vi.fn>
  let disconnectMock: ReturnType<typeof vi.fn>
  let intersectionCallback: IntersectionObserverCallback | null = null
  let originalIntersectionObserver: typeof IntersectionObserver

  beforeEach(() => {
    observeMock = vi.fn()
    disconnectMock = vi.fn()
    intersectionCallback = null

    originalIntersectionObserver = globalThis.IntersectionObserver

    globalThis.IntersectionObserver = vi.fn((callback, options) => {
      intersectionCallback = callback
      return {
        observe: observeMock,
        disconnect: disconnectMock,
        unobserve: vi.fn(),
        root: null,
        rootMargin: options?.rootMargin ?? '0px',
        thresholds: [options?.threshold ?? 0],
        takeRecords: vi.fn(() => []),
      }
    }) as unknown as typeof IntersectionObserver

    // Default: no reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver
    vi.restoreAllMocks()
  })

  function createTestComponent(options = {}) {
    return defineComponent({
      setup() {
        const { sectionRef, isVisible } = useEntranceAnimation(options)
        return { sectionRef, isVisible }
      },
      template: '<div ref="sectionRef">{{ isVisible }}</div>',
    })
  }

  describe('IntersectionObserver-based scroll detection', () => {
    it('should initialize isVisible as false', () => {
      const TestComponent = createTestComponent()
      const wrapper = mount(TestComponent)

      expect(wrapper.vm.isVisible).toBe(false)
    })

    it('should create IntersectionObserver with default threshold 0.1', async () => {
      const TestComponent = createTestComponent()
      mount(TestComponent)
      await nextTick()

      expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.1,
        rootMargin: '0px',
      })
    })

    it('should accept custom threshold and rootMargin options', async () => {
      const TestComponent = createTestComponent({ threshold: 0.5, rootMargin: '10px' })
      mount(TestComponent)
      await nextTick()

      expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.5,
        rootMargin: '10px',
      })
    })

    it('should observe the sectionRef element', async () => {
      const TestComponent = createTestComponent()
      mount(TestComponent)
      await nextTick()

      expect(observeMock).toHaveBeenCalledWith(expect.any(Object))
    })

    it('should set isVisible to true when element intersects', async () => {
      const TestComponent = createTestComponent()
      const wrapper = mount(TestComponent)
      await nextTick()

      expect(wrapper.vm.isVisible).toBe(false)

      // Simulate intersection
      intersectionCallback!(
        [
          { isIntersecting: true, target: wrapper.element },
        ] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      )

      expect(wrapper.vm.isVisible).toBe(true)
    })

    it('should not set isVisible to true when element is not intersecting', async () => {
      const TestComponent = createTestComponent()
      const wrapper = mount(TestComponent)
      await nextTick()

      intersectionCallback!(
        [
          { isIntersecting: false, target: wrapper.element },
        ] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      )

      expect(wrapper.vm.isVisible).toBe(false)
    })

    it('should disconnect observer after first intersection (fires once)', async () => {
      const TestComponent = createTestComponent()
      const wrapper = mount(TestComponent)
      await nextTick()

      intersectionCallback!(
        [
          { isIntersecting: true, target: wrapper.element },
        ] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      )

      expect(disconnectMock).toHaveBeenCalledTimes(1)
    })

    it('should disconnect observer on component unmount', async () => {
      const TestComponent = createTestComponent()
      const wrapper = mount(TestComponent)
      await nextTick()

      wrapper.unmount()

      expect(disconnectMock).toHaveBeenCalled()
    })
  })

  describe('prefers-reduced-motion check', () => {
    it('should set isVisible to true immediately when reduced motion is preferred', async () => {
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn((query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
        writable: true,
        configurable: true,
      })

      const TestComponent = createTestComponent()
      const wrapper = mount(TestComponent)
      await nextTick()

      expect(wrapper.vm.isVisible).toBe(true)
    })

    it('should not create IntersectionObserver when reduced motion is preferred', async () => {
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn((query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
        writable: true,
        configurable: true,
      })

      const constructorSpy = vi.fn()
      globalThis.IntersectionObserver = vi.fn((...args) => {
        constructorSpy(...args)
        return {
          observe: observeMock,
          disconnect: disconnectMock,
          unobserve: vi.fn(),
          root: null,
          rootMargin: '0px',
          thresholds: [0],
          takeRecords: vi.fn(() => []),
        }
      }) as unknown as typeof IntersectionObserver

      const TestComponent = createTestComponent()
      mount(TestComponent)
      await nextTick()

      expect(constructorSpy).not.toHaveBeenCalled()
    })
  })

  describe('IntersectionObserver fallback', () => {
    it('should set isVisible to true immediately when IntersectionObserver is unavailable', async () => {
      // Remove IntersectionObserver
      ;(globalThis as any).IntersectionObserver = undefined

      const TestComponent = createTestComponent()
      const wrapper = mount(TestComponent)
      await nextTick()

      expect(wrapper.vm.isVisible).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should set isVisible to true if sectionRef element is not available on mount', async () => {
      // Component that doesn't bind sectionRef to a DOM element
      const TestComponent = defineComponent({
        setup() {
          const { sectionRef, isVisible } = useEntranceAnimation()
          // Intentionally not binding sectionRef to template
          return { sectionRef, isVisible }
        },
        template: '<div>{{ isVisible }}</div>',
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(wrapper.vm.isVisible).toBe(true)
    })
  })
})
