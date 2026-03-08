import { ref, onMounted, readonly } from 'vue'
import { useUIStore } from '@/stores/ui'

interface PreloadOptions {
  priority?: boolean
  sizes?: string
  media?: string
  crossorigin?: 'anonymous' | 'use-credentials'
}

interface PreloadedImage {
  src: string
  loaded: boolean
  error: boolean
  element?: HTMLLinkElement
}

export function useImagePreloader() {
  const uiStore = useUIStore()
  const preloadedImages = ref<Map<string, PreloadedImage>>(new Map())
  const isPreloading = ref(false)
  
  const preloadImage = (src: string, options: PreloadOptions = {}): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (preloadedImages.value.has(src)) {
        const existing = preloadedImages.value.get(src)!
        if (existing.loaded) {
          resolve()
          return
        } else if (existing.error) {
          reject(new Error(`Image failed to preload: ${src}`))
          return
        }
      }
      
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      
      if (options.sizes) {
        link.setAttribute('imagesizes', options.sizes)
      }
      if (options.media) {
        link.media = options.media
      }
      if (options.crossorigin) {
        link.crossOrigin = options.crossorigin
      }
      
      const imageConfig = uiStore.generateResponsiveImageConfig(src, '', {
        deviceOptimization: true
      })
      if (imageConfig.srcSet) {
        link.setAttribute('imagesrcset', imageConfig.srcSet)
      }
      
      const preloadedImage: PreloadedImage = {
        src,
        loaded: false,
        error: false,
        element: link
      }
      
      link.onload = () => {
        preloadedImage.loaded = true
        preloadedImages.value.set(src, preloadedImage)
        resolve()
      }
      
      link.onerror = () => {
        preloadedImage.error = true
        preloadedImages.value.set(src, preloadedImage)
        reject(new Error(`Failed to preload image: ${src}`))
      }
      
      document.head.appendChild(link)
      preloadedImages.value.set(src, preloadedImage)
    })
  }

  const preloadImages = async (
    images: Array<{ src: string; options?: PreloadOptions }>
  ): Promise<void> => {
    isPreloading.value = true
    
    try {
      const promises = images.map(({ src, options }) => 
        preloadImage(src, options).catch(error => {
          console.warn(`Failed to preload image: ${src}`, error)
          return null
        })
      )
      
      await Promise.allSettled(promises)
    } finally {
      isPreloading.value = false
    }
  }
  
  const preloadCriticalImages = async (images: string[]): Promise<void> => {
    const criticalImages = images.map(src => ({
      src,
      options: { priority: true }
    }))
    
    return preloadImages(criticalImages)
  }
  
  const preloadOnHover = (src: string): void => {
    if (!preloadedImages.value.has(src)) {
      preloadImage(src).catch(error => {
        console.warn(`Hover preload failed for: ${src}`, error)
      })
    }
  }

  const preloadAdjacentImages = (
    currentIndex: number, 
    images: string[], 
    lookahead: number = 2
  ): void => {
    const toPreload: string[] = []
    
    for (let i = 1; i <= lookahead; i++) {
      const nextIndex = currentIndex + i
      if (nextIndex < images.length) {
        toPreload.push(images[nextIndex])
      }
    }
    
    for (let i = 1; i <= lookahead; i++) {
      const prevIndex = currentIndex - i
      if (prevIndex >= 0) {
        toPreload.push(images[prevIndex])
      }
    }
    
    toPreload.forEach(src => {
      if (!preloadedImages.value.has(src)) {
        preloadImage(src).catch(error => {
          console.warn(`Adjacent image preload failed: ${src}`, error)
        })
      }
    })
  }
  
  const cleanup = (): void => {
    preloadedImages.value.forEach(({ element }) => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element)
      }
    })
    preloadedImages.value.clear()
  }

  const getPreloadStatus = (src: string) => {
    return preloadedImages.value.get(src) || { loaded: false, error: false }
  }
  
  const isImagePreloaded = (src: string): boolean => {
    const status = preloadedImages.value.get(src)
    return status?.loaded || false
  }
  
  return {
    preloadedImages: readonly(preloadedImages),
    isPreloading: readonly(isPreloading),
    preloadImage,
    preloadImages,
    preloadCriticalImages,
    preloadOnHover,
    preloadAdjacentImages,
    cleanup,
    getPreloadStatus,
    isImagePreloaded
  }
}

export function useSmartImagePreloader() {
  const uiStore = useUIStore()
  const { preloadImages } = useImagePreloader()
  
  const shouldPreload = (): boolean => {
    if (uiStore.connectionType === 'slow-2g' || uiStore.connectionType === '2g') {
      return false
    }
    
    if (uiStore.prefersReducedData) {
      return false
    }
    
    if (uiStore.isMobile && uiStore.connectionType === '3g') {
      return false
    }
    
    return true
  }
  
  const smartPreload = async (images: string[]): Promise<void> => {
    if (!shouldPreload()) {
      return
    }
    
    const imagesToPreload = images.map(src => ({ src }))
    return preloadImages(imagesToPreload)
  }
  
  return {
    shouldPreload,
    smartPreload
  }
}