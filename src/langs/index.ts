import { createI18n } from 'vue-i18n'
import en from './en'
import pt from './pt'

const messages = {
  en,
  pt,
}

const getInitialLocale = (): string => {
  try {
    const savedLanguage = localStorage.getItem('portfolio-language')
    if (savedLanguage && messages[savedLanguage as keyof typeof messages]) {
      return savedLanguage
    }
    
    const browserLanguage = navigator.language.split('-')[0]
    if (messages[browserLanguage as keyof typeof messages]) {
      return browserLanguage
    }
  } catch (error) {
    console.warn('Failed to get initial locale:', error)
  }
  
  return 'en'
}

export const i18n = createI18n({
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages,
  legacy: false,
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false,
})
