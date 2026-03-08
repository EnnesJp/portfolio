import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import { i18n } from '@/langs'
import { useThemeStore, usePortfolioStore, useUIStore, useLanguageStore } from '@/stores'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

const themeStore = useThemeStore()
const portfolioStore = usePortfolioStore()
const uiStore = useUIStore()
const languageStore = useLanguageStore()

languageStore.initializeLanguage()
themeStore.initializeTheme()
portfolioStore.loadPortfolioData()

uiStore.initializeResponsiveSystem()

let isUsingKeyboard = false

const handleFirstTab = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation-active')
    isUsingKeyboard = true
    window.removeEventListener('keydown', handleFirstTab)
  }
}

const handleMouseDown = () => {
  if (isUsingKeyboard) {
    document.body.classList.remove('keyboard-navigation-active')
    isUsingKeyboard = false
    window.addEventListener('keydown', handleFirstTab)
  }
}

window.addEventListener('keydown', handleFirstTab)
window.addEventListener('mousedown', handleMouseDown)

app.mount('#app')
