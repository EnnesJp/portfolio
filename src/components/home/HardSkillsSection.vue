<template>
  <section class="hard-skills-section" id="hard-skills">
    <div class="hard-skills-section__container">
      <div class="hard-skills-section__header">
        <h2 class="hard-skills-section__title">
          {{ t('home.hardSkillsSection.title') }}
        </h2>
      </div>

      <div class="hard-skills-controls">
        <div class="category-filter">
          <button
            v-for="category in allCategories"
            :key="category.id"
            :class="['category-btn', { active: selectedCategory === category.id }]"
            :style="{ '--category-color': category.color }"
            @click="setSelectedCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>

        <div class="display-mode-toggle">
          <button
            v-for="mode in displayModes"
            :key="mode.value"
            :class="['mode-btn', { active: displayMode === mode.value }]"
            @click="setDisplayMode(mode.value)"
            :title="mode.label"
          >
            <component :is="mode.icon" />
          </button>
        </div>
      </div>

      <div :class="['skills-container', `skills-${displayMode}`]">
        <div
          v-for="skill in filteredSkills"
          :key="skill.id"
          class="skill-item"
          :style="{ '--category-color': skill.category.color }"
        >
          <template v-if="displayMode !== 'chart'">
            <div class="skill-header">
              <div class="skill-icon" v-if="skill.icon">
                <img :src="skill.icon" :alt="skill.name" />
              </div>
              <div class="skill-info">
                <h3 class="skill-name">{{ skill.name }}</h3>
                <span class="skill-category">{{ skill.category.name }}</span>
              </div>
            </div>

            <div class="skill-details">
              <div class="proficiency-bar">
                <div class="proficiency-label">
                  {{ t('home.hardSkillsSection.proficiency') }}
                </div>
                <div class="proficiency-track">
                  <div
                    class="proficiency-fill"
                    :style="{ width: `${(skill.proficiency / 5) * 100}%` }"
                  ></div>
                </div>
                <span class="proficiency-text">{{ skill.proficiency }}/5</span>
              </div>

              <div class="skill-stats">
                <div class="stat">
                  <span class="stat-value">{{ skill.yearsOfExperience }}</span>
                  <span class="stat-label">{{ t('home.hardSkillsSection.years') }}</span>
                </div>
                <div class="stat" v-if="skill.projects">
                  <span class="stat-value">{{ skill.projects }}</span>
                  <span class="stat-label">{{ t('home.hardSkillsSection.projects') }}</span>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="chart-skill">
              <div class="chart-bar" :style="{ height: `${(skill.proficiency / 5) * 100}%` }">
                <div class="chart-value">{{ skill.proficiency }}</div>
              </div>
              <div class="chart-label">{{ skill.name }}</div>
            </div>
          </template>
        </div>
      </div>

      <div v-if="filteredSkills.length === 0" class="empty-state">
        <p>{{ t('home.hardSkillsSection.noSkills') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import type { SkillCategory } from '@/types'

const GridIcon = {
  template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="1" width="6" height="6" rx="1"/>
    <rect x="9" y="1" width="6" height="6" rx="1"/>
    <rect x="1" y="9" width="6" height="6" rx="1"/>
    <rect x="9" y="9" width="6" height="6" rx="1"/>
  </svg>`,
}

const ListIcon = {
  template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="2" width="14" height="2" rx="1"/>
    <rect x="1" y="7" width="14" height="2" rx="1"/>
    <rect x="1" y="12" width="14" height="2" rx="1"/>
  </svg>`,
}

const ChartIcon = {
  template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="8" width="3" height="7" rx="1"/>
    <rect x="6" y="4" width="3" height="11" rx="1"/>
    <rect x="11" y="1" width="3" height="14" rx="1"/>
  </svg>`,
}

const { t } = useI18n()
const portfolioStore = usePortfolioStore()

const selectedCategory = ref<string>('all')
const displayMode = ref<'grid' | 'list' | 'chart'>('grid')

const displayModes = [
  { value: 'grid' as const, label: 'Grid View', icon: GridIcon },
  { value: 'list' as const, label: 'List View', icon: ListIcon },
  { value: 'chart' as const, label: 'Chart View', icon: ChartIcon },
]

const skills = computed(() => portfolioStore.skills)
const skillCategories = computed(() => portfolioStore.portfolioData?.skills?.categories || [])

const allCategories = computed(() => [
  { id: 'all', name: t('home.hardSkillsSection.allCategories'), color: '#666666' },
  ...skillCategories.value,
])

const filteredSkills = computed(() => {
  if (selectedCategory.value === 'all') {
    return skills.value
  }
  return skills.value.filter((skill) => skill.category.id === selectedCategory.value)
})

const setSelectedCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const setDisplayMode = (mode: 'grid' | 'list' | 'chart') => {
  displayMode.value = mode
}
</script>

<style scoped lang="scss">
.hard-skills-section {
  padding: 80px 24px;
  background: var(--color-background);

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: 60px;
  }

  &__title {
    font-size: 48px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 16px 0;
  }
}

.hard-skills-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--category-color);
  background: transparent;
  color: var(--category-color);
  border-radius: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--category-color);
    color: white;
  }

  &.active {
    background: var(--category-color);
    color: white;
  }
}

.display-mode-toggle {
  display: flex;
  gap: 0.25rem;
  background: var(--color-surface);
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.mode-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background);
    color: var(--color-text);
  }

  &.active {
    background: var(--color-primary);
    color: white;
  }
}

.skills-container {
  width: 100%;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skills-chart {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 1rem;
  min-height: 300px;
  padding: 2rem;
  background: var(--color-surface);
  border-radius: 1rem;
}

.skill-item {
  background: var(--color-surface);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--category-color);
    transform: translateY(-2px);
  }

  .skills-list & {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem 1.5rem;

    .skill-header {
      flex-direction: row;
      align-items: center;
      margin-bottom: 0;
    }

    .skill-details {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 2rem;
    }
  }
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.skill-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.skill-info {
  flex: 1;
}

.skill-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 0.25rem 0;
}

.skill-category {
  font-size: 0.875rem;
  color: var(--category-color);
  font-weight: 500;
}

.skill-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.proficiency-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.proficiency-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  min-width: 80px;
}

.proficiency-track {
  flex: 1;
  height: 8px;
  background: var(--color-background);
  border-radius: 4px;
  overflow: hidden;
}

.proficiency-fill {
  height: 100%;
  background: var(--category-color);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.proficiency-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  min-width: 40px;
}

.skill-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--category-color);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chart-skill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.chart-bar {
  width: 60px;
  background: var(--category-color);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  transition: height 0.3s ease;
}

.chart-value {
  position: absolute;
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.875rem;
}

.chart-label {
  font-size: 0.875rem;
  color: var(--color-text);
  text-align: center;
  max-width: 80px;
  word-wrap: break-word;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);

  p {
    font-size: 1.125rem;
    margin: 0;
  }
}

@media (max-width: 1024px) {
  .hard-skills-section {
    padding: 60px 20px;

    &__title {
      font-size: 40px;
    }
  }
}

@media (max-width: 768px) {
  .hard-skills-section {
    padding: 40px 16px;

    &__title {
      font-size: 32px;
    }
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .skills-chart {
    flex-wrap: wrap;
    min-height: 200px;
  }

  .skill-stats {
    gap: 1rem;
  }

  .proficiency-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .proficiency-label {
    min-width: auto;
  }
}
</style>
