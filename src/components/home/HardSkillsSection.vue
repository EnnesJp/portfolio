<template>
  <app-section
    class="hard-skills-section"
    :title="t('home.hardSkillsSection.title')"
  >
    <div class="hard-skills-section-cards">
      <hard-skills-card
        v-for="(card, index) in hardSkills"
        :key="index"
        :title="card.title"
        :description="card.description"
        :link="card.link"
      /> 
    </div>

  </app-section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { AppSection, HardSkillsCard } from '@components'
import { ref } from 'vue'

const { t } = useI18n()
const hardSkills = ref([
  {
    title: 'home.hardSkillsSection.skills.frontend.title',
    description: 'home.hardSkillsSection.skills.frontend.description',
    link: '/frontend'
  },
  {
    title: 'home.hardSkillsSection.skills.backend.title',
    description: 'home.hardSkillsSection.skills.backend.description',
    link: '/backend'
  },
  {
    title: 'home.hardSkillsSection.skills.devops.title',
    description: 'home.hardSkillsSection.skills.devops.description',
    link: '/devops'
  }
])
</script>

<style scoped lang="scss">
.hard-skills-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &-cards {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 60px;
  }
}
</style>
