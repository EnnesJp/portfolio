import { computed, onMounted, onUnmounted } from 'vue'
import { useUIStore, type Breakpoint, BREAKPOINTS } from '@/stores/ui'

export function useResponsive() {
  const uiStore = useUIStore()
  
  let cleanup: (() => void) | undefined
  
  onMounted(() => {
    cleanup = uiStore.initializeResponsiveSystem()
  })
  
  onUnmounted(() => {
    cleanup?.()
  })
  
  const isMobile = computed(() => uiStore.isMobile)
  const isTablet = computed(() => uiStore.isTablet)
  const isDesktop = computed(() => uiStore.isDesktop)
  const isLargeScreen = computed(() => uiStore.isLargeScreen)
  const isSmallScreen = computed(() => uiStore.isSmallScreen)
  const isTouchDevice = computed(() => uiStore.isTouchDevice)
  const currentBreakpoint = computed(() => uiStore.currentBreakpoint)
  const screenWidth = computed(() => uiStore.screenWidth)
  const screenHeight = computed(() => uiStore.screenHeight)
  const orientation = computed(() => uiStore.orientation)
  const prefersReducedMotion = computed(() => uiStore.prefersReducedMotion)
  
  const matchesBreakpoint = (breakpoint: Breakpoint, direction: 'up' | 'down' = 'up') => {
    return uiStore.matchesBreakpoint(breakpoint, direction)
  }
  
  const getResponsiveColumns = (desktop = 4, tablet = 2, mobile = 1) => {
    return uiStore.getResponsiveColumns(desktop, tablet, mobile)
  }
  
  const getResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>, fallback: T): T => {
    const breakpoint = currentBreakpoint.value
    
    if (values[breakpoint] !== undefined) {
      return values[breakpoint]!
    }
    
    const breakpointOrder: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']
    const currentIndex = breakpointOrder.indexOf(breakpoint)
    
    for (let i = currentIndex + 1; i < breakpointOrder.length; i++) {
      const bp = breakpointOrder[i]
      if (values[bp] !== undefined) {
        return values[bp]!
      }
    }
    
    return fallback
  }
  
  const getResponsiveSpacing = (
    base: number,
    multipliers: Partial<Record<Breakpoint, number>> = {}
  ): string => {
    const multiplier = getResponsiveValue(multipliers, 1)
    return `${base * multiplier}rem`
  }
  
  const getResponsiveClasses = (
    baseClass: string,
    breakpointClasses: Partial<Record<Breakpoint, string>> = {}
  ): string[] => {
    const classes = [baseClass]
    
    Object.entries(breakpointClasses).forEach(([bp, className]) => {
      if (matchesBreakpoint(bp as Breakpoint)) {
        classes.push(className)
      }
    })
    
    return classes
  }
  
  const generateResponsiveImageConfig = (src: string, alt: string, options = {}) => {
    return uiStore.generateResponsiveImageConfig(src, alt, options)
  }
  
  const getOptimizedImageSrc = (src: string, width?: number) => {
    return uiStore.getOptimizedImageSrc(src, width)
  }
  
  const shouldShowMobileLayout = computed(() => isMobile.value)
  const shouldShowTabletLayout = computed(() => isTablet.value)
  const shouldShowDesktopLayout = computed(() => isDesktop.value)
  
  const getGridColumns = computed(() => {
    if (isDesktop.value) return 'repeat(auto-fit, minmax(300px, 1fr))'
    if (isTablet.value) return 'repeat(auto-fit, minmax(250px, 1fr))'
    return '1fr'
  })
  
  const getContainerPadding = computed(() => {
    if (isSmallScreen.value) return '0.75rem'
    if (isMobile.value) return '1rem'
    return '1.5rem'
  })
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    isSmallScreen,
    isTouchDevice,
    currentBreakpoint,
    screenWidth,
    screenHeight,
    orientation,
    prefersReducedMotion,
    
    shouldShowMobileLayout,
    shouldShowTabletLayout,
    shouldShowDesktopLayout,
    getGridColumns,
    getContainerPadding,
    
    matchesBreakpoint,
    getResponsiveColumns,
    getResponsiveValue,
    getResponsiveSpacing,
    getResponsiveClasses,
    
    generateResponsiveImageConfig,
    getOptimizedImageSrc,
    
    BREAKPOINTS
  }
}

export function useResponsiveNavigation() {
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const uiStore = useUIStore()
  
  const shouldShowMobileMenu = computed(() => isMobile.value)
  const shouldShowDesktopMenu = computed(() => isDesktop.value)
  const shouldCollapseNavigation = computed(() => isMobile.value || isTablet.value)
  const shouldShowMobileLayout = computed(() => isMobile.value)
  
  const toggleMobileMenu = () => uiStore.toggleMobileMenu()
  const closeMobileMenu = () => uiStore.closeMobileMenu()
  
  const isMobileMenuOpen = computed(() => uiStore.isMobileMenuOpen)
  
  return {
    shouldShowMobileMenu,
    shouldShowDesktopMenu,
    shouldCollapseNavigation,
    shouldShowMobileLayout,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu
  }
}

export function useResponsiveTypography() {
  const { currentBreakpoint, getResponsiveValue } = useResponsive()
  
  const getFontSize = (
    sizes: Partial<Record<Breakpoint, string>>,
    fallback = '1rem'
  ) => {
    return computed(() => getResponsiveValue(sizes, fallback))
  }
  
  const getLineHeight = (
    heights: Partial<Record<Breakpoint, string>>,
    fallback = '1.5'
  ) => {
    return computed(() => getResponsiveValue(heights, fallback))
  }
  
  const getSpacing = (
    spacings: Partial<Record<Breakpoint, string>>,
    fallback = '1rem'
  ) => {
    return computed(() => getResponsiveValue(spacings, fallback))
  }
  
  return {
    currentBreakpoint,
    getFontSize,
    getLineHeight,
    getSpacing
  }
}