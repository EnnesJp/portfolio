import { defineStore } from 'pinia'
import type { NavigationSection } from '@/types'

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    currentSection: '',
    sections: [] as NavigationSection[],
    isScrolling: false,
    scrollProgress: 0
  }),
  
  getters: {
    visibleSections: (state) => 
      state.sections.filter(s => s.visible).sort((a, b) => a.order - b.order),
    
    currentSectionIndex: (state) => 
      state.sections.filter(s => s.visible).sort((a, b) => a.order - b.order)
        .findIndex(s => s.id === state.currentSection)
  },
  
  actions: {
    scrollToSection(sectionId: string) {
      const section = this.sections.find(s => s.id === sectionId)
      if (section?.element) {
        this.isScrolling = true
        section.element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
        setTimeout(() => { this.isScrolling = false }, 1000)
      }
    },
    
    registerSection(section: NavigationSection) {
      const existing = this.sections.findIndex(s => s.id === section.id)
      if (existing >= 0) {
        this.sections[existing] = section
      } else {
        this.sections.push(section)
      }
    },
    
    updateCurrentSection() {
      if (this.isScrolling) return
      
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      for (const section of this.visibleSections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect()
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            this.currentSection = section.id
            break
          }
        }
      }
      
      // Update scroll progress
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      this.scrollProgress = Math.min(scrollY / documentHeight, 1)
    }
  }
})