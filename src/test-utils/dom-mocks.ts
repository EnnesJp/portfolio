import { vi } from 'vitest'

/**
 * Sets up complete DOM mocks for language store tests
 */
export function setupDOMMocks() {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  })

  // Mock document.querySelectorAll to return empty NodeList
  const querySelectorAllMock = vi.fn(() => [])
  Object.defineProperty(document, 'querySelectorAll', {
    value: querySelectorAllMock,
    writable: true,
    configurable: true,
  })

  // Mock document.querySelector to return null
  const querySelectorMock = vi.fn(() => null)
  Object.defineProperty(document, 'querySelector', {
    value: querySelectorMock,
    writable: true,
    configurable: true,
  })

  // Mock document.documentElement
  const documentElementMock = {
    setAttribute: vi.fn(),
    getAttribute: vi.fn(),
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      toggle: vi.fn(),
    },
    style: {
      setProperty: vi.fn(),
      getPropertyValue: vi.fn(() => ''),
    },
    scrollHeight: 2000,
  }

  Object.defineProperty(document, 'documentElement', {
    value: documentElementMock,
    writable: true,
    configurable: true,
  })

  // Mock document.body
  const documentBodyMock = {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      toggle: vi.fn(),
    },
  }

  Object.defineProperty(document, 'body', {
    value: documentBodyMock,
    writable: true,
    configurable: true,
  })

  // Mock window properties
  Object.defineProperty(window, 'scrollY', {
    value: 0,
    writable: true,
    configurable: true,
  })

  Object.defineProperty(window, 'scrollX', {
    value: 0,
    writable: true,
    configurable: true,
  })

  Object.defineProperty(window, 'innerHeight', {
    value: 800,
    writable: true,
    configurable: true,
  })

  Object.defineProperty(window, 'innerWidth', {
    value: 1200,
    writable: true,
    configurable: true,
  })

  window.scrollTo = vi.fn()

  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn((query) => ({
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

  return {
    localStorageMock,
    querySelectorAllMock,
    querySelectorMock,
    documentElementMock,
    documentBodyMock,
  }
}

export function resetDOMMocks() {
  vi.clearAllMocks()
}
