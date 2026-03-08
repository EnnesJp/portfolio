<template>
  <main>
    <presentation-section />
    <companies-section />
    <certifications-section />
    <hard-skills-section />
    <projects-section />
    <contact-section />
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import {
  PresentationSection,
  CompaniesSection,
  CertificationsSection,
  HardSkillsSection,
  ProjectsSection,
  ContactSection,
} from '@components'

const navigationStore = useNavigationStore()

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

<style scoped></style>
