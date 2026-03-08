import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLanguageStore, SUPPORTED_LANGUAGES } from '../language'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

Object.defineProperty(window, 'navigator', {
  value: {
    language: 'en-US'
  }
})

Object.defineProperty(document, 'documentElement', {
  value: {
    setAttribute: vi.fn(),
    classList: {
      add: vi.fn(),
      remove: vi.fn()
    }
  }
})

describe('Language Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
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
    localStorageMock.getItem.mockReturnValue('pt')
    
    const store = useLanguageStore()
    store.initializeLanguage()
    
    expect(store.currentLanguage).toBe('pt')
    expect(localStorageMock.getItem).toHaveBeenCalledWith('portfolio-language')
  })

  it('should detect browser language when no saved preference', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const store = useLanguageStore()
    store.initializeLanguage()
    
    expect(store.currentLanguage).toBe('en')
  })

  it('should persist language preference', async () => {
    const store = useLanguageStore()
    
    await store.setLanguage('pt')
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('portfolio-language', 'pt')
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
    
    store.isChanging = true
    
    const originalLanguage = store.currentLanguage
    await store.setLanguage('pt')
    
    expect(store.currentLanguage).toBe(originalLanguage)
  })

  it('should not change to same language', async () => {
    const store = useLanguageStore()
    
    const setItemSpy = vi.spyOn(localStorageMock, 'setItem')
    
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
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })
    
    const store = useLanguageStore()
    
    expect(() => store.initializeLanguage()).not.toThrow()
    expect(store.currentLanguage).toBe('en')
  })

  it('should handle setLanguage errors gracefully', async () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })
    
    const store = useLanguageStore()
    
    await expect(store.setLanguage('pt')).resolves.not.toThrow()
    expect(store.currentLanguage).toBe('pt')
  })
})