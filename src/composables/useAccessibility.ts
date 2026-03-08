import { ref, onMounted, onUnmounted, nextTick, readonly } from 'vue'

interface FocusableElement extends HTMLElement {
  focus(): void
  blur(): void
}

interface KeyboardNavigationOptions {
  enableArrowKeys?: boolean
  enableHomeEnd?: boolean
  enableTypeAhead?: boolean
  wrap?: boolean
  orientation?: 'horizontal' | 'vertical' | 'both'
}

interface FocusTrapOptions {
  initialFocus?: string | HTMLElement
  returnFocus?: boolean
  allowOutsideClick?: boolean
}

export function useAccessibility() {
  const announcements = ref<string[]>([])
  const currentFocus = ref<HTMLElement | null>(null)
  
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    announcements.value.push(message)
    
    let liveRegion = document.getElementById('sr-live-region')
    if (!liveRegion) {
      liveRegion = document.createElement('div')
      liveRegion.id = 'sr-live-region'
      liveRegion.setAttribute('aria-live', priority)
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.style.position = 'absolute'
      liveRegion.style.left = '-10000px'
      liveRegion.style.width = '1px'
      liveRegion.style.height = '1px'
      liveRegion.style.overflow = 'hidden'
      document.body.appendChild(liveRegion)
    }
    
    if (liveRegion.getAttribute('aria-live') !== priority) {
      liveRegion.setAttribute('aria-live', priority)
    }
    
    liveRegion.textContent = ''
    setTimeout(() => {
      liveRegion!.textContent = message
    }, 100)
  }

  const getFocusableElements = (container: HTMLElement): FocusableElement[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'audio[controls]',
      'video[controls]',
      'iframe',
      'object',
      'embed',
      'area[href]',
      'summary'
    ].join(', ')
    
    const elements = Array.from(container.querySelectorAll(focusableSelectors)) as FocusableElement[]
  
    return elements.filter(element => {
      const style = window.getComputedStyle(element)
      const tabIndex = element.getAttribute('tabindex')
      
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        tabIndex !== '-1' &&
        !element.hasAttribute('disabled') &&
        !element.hasAttribute('aria-hidden')
      )
    })
  }
  
  const createFocusTrap = (container: HTMLElement, options: FocusTrapOptions = {}) => {
    const {
      initialFocus,
      returnFocus = true,
      allowOutsideClick = false
    } = options
    
    let previouslyFocusedElement: HTMLElement | null = null
    let focusableElements: FocusableElement[] = []
    
    const updateFocusableElements = () => {
      focusableElements = getFocusableElements(container)
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      
      updateFocusableElements()
      
      if (focusableElements.length === 0) {
        event.preventDefault()
        return
      }
      
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
    
    const handleClick = (event: MouseEvent) => {
      if (!allowOutsideClick && !container.contains(event.target as Node)) {
        event.preventDefault()
        event.stopPropagation()
        
        updateFocusableElements()
        if (focusableElements.length > 0) {
          focusableElements[0].focus()
        }
      }
    }
    
    const activate = () => {
      previouslyFocusedElement = document.activeElement as HTMLElement
      
      updateFocusableElements()
      
      if (initialFocus) {
        const target = typeof initialFocus === 'string' 
          ? container.querySelector(initialFocus) as HTMLElement
          : initialFocus
        
        if (target && focusableElements.includes(target as FocusableElement)) {
          target.focus()
        } else if (focusableElements.length > 0) {
          focusableElements[0].focus()
        }
      } else if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
      
      document.addEventListener('keydown', handleKeyDown)
      if (!allowOutsideClick) {
        document.addEventListener('click', handleClick, true)
      }
    }
    
    const deactivate = () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClick, true)
      
      if (returnFocus && previouslyFocusedElement) {
        previouslyFocusedElement.focus()
      }
    }
    
    return {
      activate,
      deactivate,
      updateFocusableElements
    }
  }
  
  const addKeyboardNavigation = (
    container: HTMLElement,
    options: KeyboardNavigationOptions = {}
  ) => {
    const {
      enableArrowKeys = true,
      enableHomeEnd = true,
      enableTypeAhead = false,
      wrap = true,
      orientation = 'vertical'
    } = options
    
    let typeAheadString = ''
    let typeAheadTimeout: number
    
    const getNavigableElements = (): HTMLElement[] => {
      return Array.from(container.querySelectorAll('[role="menuitem"], [role="option"], [role="tab"], button, a[href]'))
        .filter(el => {
          const style = window.getComputedStyle(el as HTMLElement)
          return style.display !== 'none' && style.visibility !== 'hidden'
        }) as HTMLElement[]
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
      const elements = getNavigableElements()
      const currentIndex = elements.indexOf(event.target as HTMLElement)
      
      if (currentIndex === -1) return
      
      let nextIndex = currentIndex
      let handled = false
      
      switch (event.key) {
        case 'ArrowDown':
          if (enableArrowKeys && (orientation === 'vertical' || orientation === 'both')) {
            nextIndex = wrap ? (currentIndex + 1) % elements.length : Math.min(currentIndex + 1, elements.length - 1)
            handled = true
          }
          break
          
        case 'ArrowUp':
          if (enableArrowKeys && (orientation === 'vertical' || orientation === 'both')) {
            nextIndex = wrap ? (currentIndex - 1 + elements.length) % elements.length : Math.max(currentIndex - 1, 0)
            handled = true
          }
          break
          
        case 'ArrowRight':
          if (enableArrowKeys && (orientation === 'horizontal' || orientation === 'both')) {
            nextIndex = wrap ? (currentIndex + 1) % elements.length : Math.min(currentIndex + 1, elements.length - 1)
            handled = true
          }
          break
          
        case 'ArrowLeft':
          if (enableArrowKeys && (orientation === 'horizontal' || orientation === 'both')) {
            nextIndex = wrap ? (currentIndex - 1 + elements.length) % elements.length : Math.max(currentIndex - 1, 0)
            handled = true
          }
          break
          
        case 'Home':
          if (enableHomeEnd) {
            nextIndex = 0
            handled = true
          }
          break
          
        case 'End':
          if (enableHomeEnd) {
            nextIndex = elements.length - 1
            handled = true
          }
          break
          
        default:
          if (enableTypeAhead && event.key.length === 1 && /[a-zA-Z0-9]/.test(event.key)) {
            clearTimeout(typeAheadTimeout)
            typeAheadString += event.key.toLowerCase()
            
            const matchingIndex = elements.findIndex((el, index) => {
              if (index <= currentIndex) return false
              const text = el.textContent?.toLowerCase() || ''
              return text.startsWith(typeAheadString)
            })
            
            if (matchingIndex !== -1) {
              nextIndex = matchingIndex
              handled = true
            }
            
            typeAheadTimeout = window.setTimeout(() => {
              typeAheadString = ''
            }, 1000)
          }
          break
      }
      
      if (handled) {
        event.preventDefault()
        elements[nextIndex]?.focus()
        currentFocus.value = elements[nextIndex]
      }
    }
    
    container.addEventListener('keydown', handleKeyDown)
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      clearTimeout(typeAheadTimeout)
    }
  }
  
  const manageFocusForModal = (modalElement: HTMLElement, options: FocusTrapOptions = {}) => {
    const focusTrap = createFocusTrap(modalElement, options)
    
    modalElement.setAttribute('role', 'dialog')
    modalElement.setAttribute('aria-modal', 'true')
    
    const backgroundElements = document.querySelectorAll('body > *:not([aria-hidden])')
    backgroundElements.forEach(el => {
      if (el !== modalElement && !modalElement.contains(el)) {
        el.setAttribute('aria-hidden', 'true')
      }
    })
    
    focusTrap.activate()
    
    return () => {
      focusTrap.deactivate()
      
      backgroundElements.forEach(el => {
        el.removeAttribute('aria-hidden')
      })
    }
  }
  
  const addSkipLinks = (targets: Array<{ label: string; target: string }>) => {
    const skipLinksContainer = document.createElement('div')
    skipLinksContainer.className = 'skip-links'
    skipLinksContainer.setAttribute('aria-label', 'Skip navigation links')
    
    targets.forEach(({ label, target }) => {
      const link = document.createElement('a')
      link.href = `#${target}`
      link.textContent = label
      link.className = 'skip-link'
      
      link.addEventListener('click', (event) => {
        event.preventDefault()
        const targetElement = document.getElementById(target)
        if (targetElement) {
          targetElement.focus()
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      })
      
      skipLinksContainer.appendChild(link)
    })
    
    document.body.insertBefore(skipLinksContainer, document.body.firstChild)
    
    return skipLinksContainer
  }
  
  const enhanceFormAccessibility = (form: HTMLFormElement) => {
    const inputs = form.querySelectorAll('input, select, textarea')
    
    inputs.forEach(input => {
      const inputElement = input as HTMLInputElement
      
      if (!inputElement.getAttribute('aria-label') && !inputElement.getAttribute('aria-labelledby')) {
        const label = form.querySelector(`label[for="${inputElement.id}"]`)
        if (label) {
          inputElement.setAttribute('aria-labelledby', label.id || `label-${inputElement.id}`)
          if (!label.id) {
            label.id = `label-${inputElement.id}`
          }
        }
      }
      
      const errorElement = form.querySelector(`[data-error-for="${inputElement.id}"]`)
      if (errorElement) {
        inputElement.setAttribute('aria-describedby', errorElement.id || `error-${inputElement.id}`)
        if (!errorElement.id) {
          errorElement.id = `error-${inputElement.id}`
        }
      }
      
      if (inputElement.hasAttribute('required')) {
        inputElement.setAttribute('aria-required', 'true')
      }
    })
  }
  
  const prefersReducedMotion = (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  
  const prefersHighContrast = (): boolean => {
    return window.matchMedia('(prefers-contrast: high)').matches
  }

  const getColorSchemePreference = (): 'light' | 'dark' | 'no-preference' => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }
    return 'no-preference'
  }
  
  return {
    announcements: readonly(announcements),
    currentFocus: readonly(currentFocus),
    announce,
    getFocusableElements,
    createFocusTrap,
    addKeyboardNavigation,
    manageFocusForModal,
    addSkipLinks,
    enhanceFormAccessibility,
    prefersReducedMotion,
    prefersHighContrast,
    getColorSchemePreference
  }
}

export function useAriaLiveRegion() {
  const liveRegion = ref<HTMLElement | null>(null)
  
  const createLiveRegion = (priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegion.value) return liveRegion.value
    
    const region = document.createElement('div')
    region.setAttribute('aria-live', priority)
    region.setAttribute('aria-atomic', 'true')
    region.style.position = 'absolute'
    region.style.left = '-10000px'
    region.style.width = '1px'
    region.style.height = '1px'
    region.style.overflow = 'hidden'
    
    document.body.appendChild(region)
    liveRegion.value = region
    
    return region
  }
  
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const region = createLiveRegion(priority)
    
    region.textContent = ''
    setTimeout(() => {
      region.textContent = message
    }, 100)
  }
  
  const cleanup = () => {
    if (liveRegion.value && liveRegion.value.parentNode) {
      liveRegion.value.parentNode.removeChild(liveRegion.value)
      liveRegion.value = null
    }
  }
  
  onUnmounted(() => {
    cleanup()
  })
  
  return {
    liveRegion: readonly(liveRegion),
    createLiveRegion,
    announce,
    cleanup
  }
}