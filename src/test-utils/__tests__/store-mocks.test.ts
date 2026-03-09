import { describe, it, expect, beforeEach } from 'vitest'
import { createMockPinia, createWritableStore, setupStoreMocks } from '../store-mocks'
import { defineStore } from 'pinia'

describe('Store Mocking Utilities', () => {
  describe('createMockPinia', () => {
    it('should return valid Pinia instance', () => {
      const pinia = createMockPinia()

      expect(pinia).toBeDefined()
      expect(pinia.install).toBeDefined()
    })
  })

  describe('createWritableStore', () => {
    it('should allow setting readonly properties', () => {
      const pinia = createMockPinia()

      const useTestStore = defineStore('test', {
        state: () => ({
          readonlyValue: 'initial',
        }),
      })

      const store = useTestStore(pinia)
      const writableStore = createWritableStore(store)

      writableStore.readonlyValue = 'updated'

      expect(store.readonlyValue).toBe('updated')
    })
  })

  describe('setupStoreMocks', () => {
    it('should provide all required store mocks', () => {
      const mocks = setupStoreMocks()

      expect(mocks.pinia).toBeDefined()
      expect(mocks.navigationStore).toBeDefined()
      expect(mocks.themeStore).toBeDefined()
      expect(mocks.languageStore).toBeDefined()
      expect(mocks.uiStore).toBeDefined()

      expect(mocks.navigationStore.sections).toEqual([])
      expect(mocks.navigationStore.scrollToSection).toBeDefined()

      expect(mocks.themeStore.currentTheme).toBe('light')
      expect(mocks.themeStore.toggleTheme).toBeDefined()

      expect(mocks.languageStore.currentLanguage).toBe('en')
      expect(mocks.languageStore.setLanguage).toBeDefined()

      expect(mocks.uiStore.isMobile).toBe(false)
      expect(mocks.uiStore.toggleMobileMenu).toBeDefined()
    })
  })
})
