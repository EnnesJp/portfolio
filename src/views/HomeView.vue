<template>
  <main>
    <presentation-section />
    <about-section />
    <companies-section />
    <certifications-section />
    <hard-skills-section />
    <projects-section />
    <contact-section />
    
    <div 
      class="scroll-progress"
      :style="{ width: `${scrollProgress * 100}%` }"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { 
  PresentationSection,
  AboutSection, 
  CompaniesSection,
  CertificationsSection,
  HardSkillsSection, 
  ProjectsSection,
  ContactSection 
} from '@components'

const navigationStore = useNavigationStore()

const scrollProgress = computed(() => navigationStore.scrollProgress)

const handleScroll = () => {
  navigationStore.updateCurrentSection()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  navigationStore.updateCurrentSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  z-index: 1000;
  transition: width 0.1s ease-out;
}
</style>