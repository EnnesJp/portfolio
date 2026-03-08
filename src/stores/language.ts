import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { i18n } from '@/langs'

export type SupportedLanguage = 'en' | 'pt'

export interface LanguageConfig {
  code: SupportedLanguage
  name: string
  flag: string
  rtl: boolean
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    flag: 'en.png',
    rtl: false
  },
  pt: {
    code: 'pt',
    name: 'Português',
    flag: 'pt.png',
    rtl: false
  }
}

export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = ref<SupportedLanguage>('en')
  const isChanging = ref(false)
  const preservedState = ref<Record<string, any>>({})
  
  const currentLanguageConfig = computed(() => SUPPORTED_LANGUAGES[currentLanguage.value])
  const availableLanguages = computed(() => Object.values(SUPPORTED_LANGUAGES))
  const isRTL = computed(() => currentLanguageConfig.value.rtl)
  
  const setLanguage = async (language: SupportedLanguage) => {
    if (language === currentLanguage.value || isChanging.value) {
      return
    }
    
    isChanging.value = true
    
    try {
      preserveCurrentState()
      
      currentLanguage.value = language
      
      i18n.global.locale.value = language
      
      persistLanguage()
      
      applyDirectionality()
      
      await restorePreservedState()
      
    } catch (error) {
      console.error('Error changing language:', error)
    } finally {
      isChanging.value = false
    }
  }
  
  const toggleLanguage = async () => {
    const nextLanguage: SupportedLanguage = currentLanguage.value === 'en' ? 'pt' : 'en'
    await setLanguage(nextLanguage)
  }
  
  const preserveCurrentState = () => {
    preservedState.value.scrollPosition = {
      x: window.scrollX,
      y: window.scrollY
    }
    
    const forms = document.querySelectorAll('form')
    const formStates: Record<string, any> = {}
    
    forms.forEach((form, index) => {
      const formData = new FormData(form)
      const formState: Record<string, any> = {}
      
      for (const [key, value] of formData.entries()) {
        formState[key] = value
      }
      
      if (Object.keys(formState).length > 0) {
        formStates[`form_${index}`] = formState
      }
    })
    
    if (Object.keys(formStates).length > 0) {
      preservedState.value.forms = formStates
    }
    
    const activeModal = document.querySelector('[data-modal-active]')
    if (activeModal) {
      preservedState.value.activeModal = activeModal.getAttribute('data-modal-id')
    }
    
    const currentSection = document.querySelector('[data-section-active]')
    if (currentSection) {
      preservedState.value.currentSection = currentSection.getAttribute('data-section-id')
    }
  }
  
  const restorePreservedState = async () => {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    if (preservedState.value.scrollPosition) {
      window.scrollTo(
        preservedState.value.scrollPosition.x,
        preservedState.value.scrollPosition.y
      )
    }
    
    if (preservedState.value.forms) {
      const forms = document.querySelectorAll('form')
      
      forms.forEach((form, index) => {
        const formState = preservedState.value.forms[`form_${index}`]
        if (formState) {
          Object.entries(formState).forEach(([key, value]) => {
            const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement
            if (input) {
              input.value = value as string
            }
          })
        }
      })
    }
    
    if (preservedState.value.activeModal) {
      const modal = document.querySelector(`[data-modal-id="${preservedState.value.activeModal}"]`)
      if (modal) {
        modal.setAttribute('data-modal-active', 'true')
      }
    }

    preservedState.value = {}
  }
  
  const applyDirectionality = () => {
    const htmlElement = document.documentElement
    if (isRTL.value) {
      htmlElement.setAttribute('dir', 'rtl')
      htmlElement.classList.add('rtl')
    } else {
      htmlElement.setAttribute('dir', 'ltr')
      htmlElement.classList.remove('rtl')
    }
  }
  
  const persistLanguage = () => {
    try {
      localStorage.setItem('portfolio-language', currentLanguage.value)
    } catch (error) {
      console.warn('Failed to persist language preference:', error)
    }
  }
  
  const initializeLanguage = () => {
    try {
      const savedLanguage = localStorage.getItem('portfolio-language') as SupportedLanguage
      
      if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
        currentLanguage.value = savedLanguage
      } else {
        const browserLanguage = navigator.language.split('-')[0] as SupportedLanguage
        if (SUPPORTED_LANGUAGES[browserLanguage]) {
          currentLanguage.value = browserLanguage
        }
      }
      
      i18n.global.locale.value = currentLanguage.value
      
      applyDirectionality()
      
    } catch (error) {
      console.warn('Failed to initialize language:', error)
      currentLanguage.value = 'en'
      i18n.global.locale.value = 'en'
    }
  }
  
  const getTranslation = (key: string, fallback?: string): string => {
    try {
      return i18n.global.t(key)
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`)
      return fallback || key
    }
  }
  
  return {
    currentLanguage: readonly(currentLanguage),
    isChanging: readonly(isChanging),
    
    currentLanguageConfig,
    availableLanguages,
    isRTL,
    
    setLanguage,
    toggleLanguage,
    initializeLanguage,
    getTranslation
  }
})