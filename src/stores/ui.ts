import { defineStore } from 'pinia'
import { ref, readonly, computed } from 'vue'
import type { Notification } from '@/types'

// Responsive breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1200,
  xxl: 1400
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

export interface ResponsiveImageConfig {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  loading?: 'lazy' | 'eager'
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'auto'
  deviceOptimization?: boolean
}

export const useUIStore = defineStore('ui', () => {
  const isMobileMenuOpen = ref(false)
  const activeModal = ref<string | null>(null)
  const isPageLoading = ref(false)
  const notifications = ref<Notification[]>([])
  
  // Enhanced responsive state
  const screenWidth = ref(window.innerWidth)
  const screenHeight = ref(window.innerHeight)
  const orientation = ref<'portrait' | 'landscape'>('portrait')
  const pixelRatio = ref(window.devicePixelRatio || 1)
  
  // Network and device capabilities
  const connectionType = ref<'slow-2g' | '2g' | '3g' | '4g' | 'unknown'>('unknown')
  const supportsWebP = ref(false)
  const supportsAVIF = ref(false)
  const prefersReducedData = ref(false)
  
  // Computed breakpoint states
  const currentBreakpoint = computed((): Breakpoint => {
    const width = screenWidth.value
    if (width >= BREAKPOINTS.xxl) return 'xxl'
    if (width >= BREAKPOINTS.xl) return 'xl'
    if (width >= BREAKPOINTS.lg) return 'lg'
    if (width >= BREAKPOINTS.md) return 'md'
    if (width >= BREAKPOINTS.sm) return 'sm'
    return 'xs'
  })
  
  const isMobile = computed(() => screenWidth.value < BREAKPOINTS.md)
  const isTablet = computed(() => screenWidth.value >= BREAKPOINTS.md && screenWidth.value < BREAKPOINTS.lg)
  const isDesktop = computed(() => screenWidth.value >= BREAKPOINTS.lg)
  const isLargeScreen = computed(() => screenWidth.value >= BREAKPOINTS.xl)
  const isSmallScreen = computed(() => screenWidth.value < BREAKPOINTS.sm)
  
  const isTouchDevice = computed(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0)
  
  const prefersReducedMotion = ref(false)
  
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
    
    if (isMobileMenuOpen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
  
  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
    document.body.style.overflow = ''
  }
  
  const openModal = (modalId: string) => {
    activeModal.value = modalId
    document.body.style.overflow = 'hidden'
  }
  
  const closeModal = () => {
    activeModal.value = null
    document.body.style.overflow = ''
  }
  
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    notifications.value.push({ ...notification, id })
    
    if (notification.autoClose !== false) {
      setTimeout(() => removeNotification(id), notification.duration || 5000)
    }
  }
  
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index >= 0) {
      notifications.value.splice(index, 1)
    }
  }
  
  const updateBreakpoints = () => {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
    orientation.value = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    pixelRatio.value = window.devicePixelRatio || 1
  }
  
  const initializeResponsiveSystem = () => {
    updateBreakpoints()
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches
    
    const reducedDataQuery = window.matchMedia('(prefers-reduced-data: reduce)')
    prefersReducedData.value = reducedDataQuery.matches
    
    detectImageFormatSupport()
    
    detectNetworkConnection()
    
    mediaQuery.addEventListener('change', (e) => {
      prefersReducedMotion.value = e.matches
    })
    
    reducedDataQuery.addEventListener('change', (e) => {
      prefersReducedData.value = e.matches
    })
    
    let resizeTimeout: number
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = window.setTimeout(updateBreakpoints, 100)
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', () => {
      setTimeout(updateBreakpoints, 100)
    })
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      connection.addEventListener('change', detectNetworkConnection)
    }
    
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        connection.removeEventListener('change', detectNetworkConnection)
      }
    }
  }
  
  const detectImageFormatSupport = async () => {
    try {
      const webpTestImage = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
      const webpImg = new Image()
      webpImg.onload = () => { supportsWebP.value = true }
      webpImg.onerror = () => { supportsWebP.value = false }
      webpImg.src = webpTestImage
    } catch {
      supportsWebP.value = false
    }
    
    try {
      const avifTestImage = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
      const avifImg = new Image()
      avifImg.onload = () => { supportsAVIF.value = true }
      avifImg.onerror = () => { supportsAVIF.value = false }
      avifImg.src = avifTestImage
    } catch {
      supportsAVIF.value = false
    }
  }
  
  const detectNetworkConnection = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      const effectiveType = connection.effectiveType
      
      switch (effectiveType) {
        case 'slow-2g':
        case '2g':
        case '3g':
        case '4g':
          connectionType.value = effectiveType
          break
        default:
          connectionType.value = 'unknown'
      }
    }
  }
  
  const getOptimizedImageSrc = (
    baseSrc: string, 
    width?: number, 
    options: {
      quality?: number
      format?: 'webp' | 'avif' | 'auto'
      deviceOptimization?: boolean
    } = {}
  ): string => {
    const { quality = 85, format = 'auto', deviceOptimization = true } = options
    
    let optimizedSrc = baseSrc
    
    if (width && baseSrc.includes('.')) {
      const lastDotIndex = baseSrc.lastIndexOf('.')
      const name = baseSrc.substring(0, lastDotIndex)
      const ext = baseSrc.substring(lastDotIndex + 1)
      optimizedSrc = `${name}_w${width}.${ext}`
    }
    
    if (deviceOptimization) {
      const params = new URLSearchParams()
      
      if (pixelRatio.value > 2) {
        params.set('q', Math.max(quality - 10, 60).toString())
      } else {
        params.set('q', quality.toString())
      }
      
      if (format === 'auto') {
        if (supportsWebP.value) {
          params.set('f', 'webp')
        } else if (supportsAVIF.value) {
          params.set('f', 'avif')
        }
      } else {
        params.set('f', format)
      }
      
      if (connectionType.value === 'slow-2g' || connectionType.value === '2g') {
        params.set('q', '60')
      }
      
      if (params.toString()) {
        const separator = optimizedSrc.includes('?') ? '&' : '?'
        optimizedSrc += separator + params.toString()
      }
    }
    
    return optimizedSrc
  }
  
  const generateResponsiveImageConfig = (
    baseSrc: string, 
    alt: string, 
    options: Partial<ResponsiveImageConfig> = {}
  ): ResponsiveImageConfig => {
    const { 
      quality = 85, 
      format = 'auto', 
      deviceOptimization = true,
      ...restOptions 
    } = options
    
    const config: ResponsiveImageConfig = {
      src: baseSrc,
      alt,
      loading: 'lazy',
      quality,
      format,
      deviceOptimization,
      ...restOptions
    }
    
    const srcSetEntries: string[] = []
    
    const responsiveSizes = [320, 480, 768, 1024, 1200, 1600, 1920]
    
    responsiveSizes.forEach(size => {
      srcSetEntries.push(
        `${getOptimizedImageSrc(baseSrc, size, { quality, format, deviceOptimization })} ${size}w`
      )
      
      if (size <= 1200 && pixelRatio.value > 1) {
        const highDpiSize = size * Math.min(pixelRatio.value, 2)
        srcSetEntries.push(
          `${getOptimizedImageSrc(baseSrc, highDpiSize, { quality, format, deviceOptimization })} ${highDpiSize}w`
        )
      }
    })
    
    config.srcSet = srcSetEntries.join(', ')
    
    const sizeQueries = [
      `(max-width: ${BREAKPOINTS.sm}px) 100vw`,
      `(max-width: ${BREAKPOINTS.md}px) 50vw`,
      `(max-width: ${BREAKPOINTS.lg}px) 33vw`,
      '25vw'
    ]
    
    if (connectionType.value === 'slow-2g' || connectionType.value === '2g') {
      sizeQueries.unshift('(max-width: 9999px) 50vw')
    }
    
    config.sizes = sizeQueries.join(', ')
    
    config.src = getOptimizedImageSrc(baseSrc, 800, { quality, format, deviceOptimization })
    
    return config
  }
  
  const matchesBreakpoint = (breakpoint: Breakpoint, direction: 'up' | 'down' = 'up'): boolean => {
    const breakpointValue = BREAKPOINTS[breakpoint]
    return direction === 'up' 
      ? screenWidth.value >= breakpointValue
      : screenWidth.value < breakpointValue
  }
  
  const getResponsiveColumns = (
    desktop: number = 4, 
    tablet: number = 2, 
    mobile: number = 1
  ): number => {
    if (isDesktop.value) return desktop
    if (isTablet.value) return tablet
    return mobile
  }
  
  return {
    isMobileMenuOpen: readonly(isMobileMenuOpen),
    activeModal: readonly(activeModal),
    isPageLoading: readonly(isPageLoading),
    notifications: readonly(notifications),
    screenWidth: readonly(screenWidth),
    screenHeight: readonly(screenHeight),
    orientation: readonly(orientation),
    pixelRatio: readonly(pixelRatio),
    prefersReducedMotion: readonly(prefersReducedMotion),
    connectionType: readonly(connectionType),
    supportsWebP: readonly(supportsWebP),
    supportsAVIF: readonly(supportsAVIF),
    prefersReducedData: readonly(prefersReducedData),
    
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    isSmallScreen,
    isTouchDevice,
    
    toggleMobileMenu,
    closeMobileMenu,
    openModal,
    closeModal,
    addNotification,
    removeNotification,
    updateBreakpoints,
    initializeResponsiveSystem,
    generateResponsiveImageConfig,
    getOptimizedImageSrc,
    matchesBreakpoint,
    getResponsiveColumns
  }
})