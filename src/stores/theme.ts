import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { ThemeConfig, ColorPalette, TypographyConfig, ShadowConfig, SpacingConfig, ThemeAnimationConfig } from '@/types'

const typography: TypographyConfig = {
  fontFamilyPrimary: "'Inter', system-ui, -apple-system, sans-serif",
  fontFamilySecondary: "'JetBrains Mono', monospace",
  fontSizeBase: '1rem',
  fontSizeSmall: '0.875rem',
  fontSizeLarge: '1.125rem',
  fontSizeXLarge: '1.25rem',
  lineHeightBase: '1.5',
  lineHeightTight: '1.25',
  lineHeightLoose: '1.75',
  fontWeightNormal: '400',
  fontWeightMedium: '500',
  fontWeightBold: '700'
}

const shadows: ShadowConfig = {
  light: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  heavy: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  colored: '0 4px 14px 0 rgb(59 130 246 / 0.15)'
}

const spacing: SpacingConfig = {
  borderRadius: '0.5rem',
  borderRadiusSmall: '0.25rem',
  borderRadiusLarge: '0.75rem'
}

const animations: ThemeAnimationConfig = {
  transitionFast: '150ms ease-in-out',
  transitionMedium: '300ms ease-in-out',
  transitionSlow: '500ms ease-in-out',
  easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easingBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}

const lightTheme: ColorPalette = {
  primary: '#3b82f6',
  secondary: '#64748b',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  accent: '#06b6d4',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
}

const darkTheme: ColorPalette = {
  primary: '#60a5fa',
  secondary: '#94a3b8',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  accent: '#22d3ee',
  border: '#334155',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa'
}

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeConfig['name']>('light')
  const isTransitioning = ref(false)
  
  const themeConfig = computed((): ThemeConfig => ({
    name: currentTheme.value,
    colors: currentTheme.value === 'light' ? lightTheme : darkTheme,
    typography,
    animations,
    shadows,
    spacing
  }))
  
  const toggleTheme = () => {
    isTransitioning.value = true
    document.body.classList.add('theme-transition')
    
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    applyTheme()
    persistTheme()
    
    setTimeout(() => { 
      isTransitioning.value = false
      document.body.classList.remove('theme-transition')
    }, 300)
  }
  
  const setTheme = (theme: ThemeConfig['name']) => {
    if (theme !== currentTheme.value) {
      currentTheme.value = theme
      applyTheme()
      persistTheme()
    }
  }
  
  const applyTheme = () => {
    const config = themeConfig.value
    const root = document.documentElement
    
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    Object.entries(config.typography).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      root.style.setProperty(`--${cssKey}`, value)
    })
    
    Object.entries(config.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })
    
    Object.entries(config.spacing).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      root.style.setProperty(`--${cssKey}`, value)
    })
    
    Object.entries(config.animations).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      root.style.setProperty(`--${cssKey}`, value)
    })
    
    root.setAttribute('data-theme', currentTheme.value)
  }
  
  const persistTheme = () => {
    localStorage.setItem('portfolio-theme', currentTheme.value)
  }
  
  const initializeTheme = () => {
    const saved = localStorage.getItem('portfolio-theme') as ThemeConfig['name']
    if (saved && ['light', 'dark'].includes(saved)) {
      setTheme(saved)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
    applyTheme()
  }
  
  const getThemeAwareColor = (lightColor: string, darkColor: string) => {
    return currentTheme.value === 'light' ? lightColor : darkColor
  }
  
  return {
    currentTheme: readonly(currentTheme),
    isTransitioning: readonly(isTransitioning),
    themeConfig,
    toggleTheme,
    setTheme,
    initializeTheme,
    getThemeAwareColor
  }
})