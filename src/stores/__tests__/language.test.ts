import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLanguageStore, SUPPORTED_LANGUAGES } from '../language'
import { setupDOMMocks, resetDOMMocks } from '@/test-utils'

describe('Language Store', () => {
  let mocks: ReturnType<typeof setupDOMMocks>

  beforeEach(() => {
    setActivePinia(createPinia())
    mocks = setupDOMMocks()

    Object.defineProperty(window, 'navigator', {
      value: {
        language: 'en-US',
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    resetDOMMocks()
  })

  it('should initialize with default language', () => {
    const store = useLanguageStore()

    expect(store.currentLanguage).toBe('en')
    expect(store.currentLanguageConfig).toEqual(SUPPORTED_LANGUAGES.en)
    expect(store.isChanging).toBe(false)
  })

  it('should provide available languages', () => {
    const store = useLanguageStore()

    expect(store.availableLanguages).toEqual(Object.values(SUPPORTED_LANGUAGES))
    expect(store.availableLanguages).toHaveLength(2)
  })

  it('should initialize language from localStorage', () => {
    mocks.localStorageMock.getItem.mockReturnValue('pt')

    const store = useLanguageStore()
    store.initializeLanguage()

    expect(store.currentLanguage).toBe('pt')
    expect(mocks.localStorageMock.getItem).toHaveBeenCalledWith('portfolio-language')
  })

  it('should detect browser language when no saved preference', () => {
    mocks.localStorageMock.getItem.mockReturnValue(null)

    const store = useLanguageStore()
    store.initializeLanguage()

    expect(store.currentLanguage).toBe('en')
  })

  it('should persist language preference', async () => {
    const store = useLanguageStore()

    await store.setLanguage('pt')

    expect(mocks.localStorageMock.setItem).toHaveBeenCalledWith('portfolio-language', 'pt')
    expect(store.currentLanguage).toBe('pt')
  })

  it('should toggle between languages', async () => {
    const store = useLanguageStore()

    expect(store.currentLanguage).toBe('en')

    await store.toggleLanguage()
    expect(store.currentLanguage).toBe('pt')

    await store.toggleLanguage()
    expect(store.currentLanguage).toBe('en')
  })

  it('should not change language if already changing', async () => {
    const store = useLanguageStore()

    const changePromise = store.setLanguage('pt')

    const originalLanguage = store.currentLanguage
    await store.setLanguage('en')

    await changePromise

    expect(store.currentLanguage).toBe('pt')
  })

  it('should not change to same language', async () => {
    const store = useLanguageStore()

    const setItemSpy = vi.spyOn(mocks.localStorageMock, 'setItem')

    await store.setLanguage('en')

    expect(setItemSpy).not.toHaveBeenCalled()
  })

  it('should apply directionality for RTL languages', () => {
    const store = useLanguageStore()

    expect(store.isRTL).toBe(false)

    store.initializeLanguage()

    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'ltr')
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('rtl')
  })

  it('should handle localStorage errors gracefully', () => {
    mocks.localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })

    const store = useLanguageStore()

    expect(() => store.initializeLanguage()).not.toThrow()
    expect(store.currentLanguage).toBe('en')
  })

  it('should handle setLanguage errors gracefully', async () => {
    mocks.localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })

    const store = useLanguageStore()

    await expect(store.setLanguage('pt')).resolves.not.toThrow()
    expect(store.currentLanguage).toBe('pt')
  })
})
