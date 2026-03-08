<template>
  <section class="companies-section" id="companies">
    <div class="companies-section__container">
      <div class="companies-section__header">
        <h2 class="companies-section__title">
          {{ t('home.companiesSection.title') }}
        </h2>
        <p class="companies-section__subtitle">
          {{ t('home.companiesSection.subtitle') }}
        </p>
        
        <div class="companies-section__controls" v-if="companies.length > 0">
          <div class="companies-section__display-toggle">
            <button 
              class="companies-section__toggle-btn"
              :class="{ 'active': displayMode === 'timeline' }"
              @click="setDisplayMode('timeline')"
            >
              {{ t('home.companiesSection.displayMode.timeline') }}
            </button>
            <button 
              class="companies-section__toggle-btn"
              :class="{ 'active': displayMode === 'grid' }"
              @click="setDisplayMode('grid')"
            >
              {{ t('home.companiesSection.displayMode.grid') }}
            </button>
          </div>
        </div>
      </div>

      <div class="companies-section__content" v-if="sortedCompanies.length > 0">
        <div 
          v-if="displayMode === 'timeline'" 
          class="companies-section__timeline"
        >
          <div class="companies-section__timeline-line"></div>
          <div 
            v-for="(company, index) in sortedCompanies" 
            :key="company.id"
            class="companies-section__timeline-item"
            :class="{ 'companies-section__timeline-item--alternate': index % 2 === 1 }"
          >
            <div class="companies-section__timeline-marker"></div>
            <div class="companies-section__company-card companies-section__company-card--timeline">
              <CompanyCard 
                :company="company" 
                :view-mode="'timeline'"
              />
            </div>
          </div>
        </div>

        <div 
          v-else 
          class="companies-section__grid"
        >
          <div 
            v-for="company in sortedCompanies" 
            :key="company.id"
            class="companies-section__company-card companies-section__company-card--grid"
          >
            <CompanyCard 
              :company="company" 
              :view-mode="'grid'"
            />
          </div>
        </div>
      </div>

      <div v-else class="companies-section__empty">
        <p class="companies-section__empty-text">
          No companies to display yet.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import { useNavigationStore } from '@/stores/navigation'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import CompanyCard from './CompanyCard.vue'
import type { Company } from '@/types'

const { t } = useI18n()
const portfolioStore = usePortfolioStore()
const navigationStore = useNavigationStore()

const { companies, portfolioData } = storeToRefs(portfolioStore)

const displayMode = ref<'timeline' | 'grid'>('timeline')

const sortedCompanies = computed(() => {
  return [...companies.value].sort((a, b) => {
    const aStart = a.period.start.getTime()
    const bStart = b.period.start.getTime()
    return bStart - aStart
  })
})

const setDisplayMode = (mode: 'timeline' | 'grid') => {
  displayMode.value = mode
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  })
}

const formatPeriod = (company: Company): string => {
  const start = formatDate(company.period.start)
  const end = company.period.end ? formatDate(company.period.end) : t('home.companiesSection.company.current')
  return `${start} - ${end}`
}

onMounted(() => {
  const sectionElement = document.getElementById('companies')
  if (sectionElement) {
    navigationStore.registerSection({
      id: 'companies',
      label: t('navigation.companies'),
      order: 3,
      visible: true,
      element: sectionElement
    })
  }

  if (portfolioData.value?.companies?.displayMode) {
    displayMode.value = portfolioData.value.companies.displayMode
  }
})
</script>

<style scoped lang="scss">
.companies-section {
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

  &__subtitle {
    font-size: 20px;
    color: var(--color-text-secondary);
    margin: 0 0 40px 0;
  }

  &__controls {
    display: flex;
    justify-content: center;
  }

  &__display-toggle {
    display: flex;
    background: var(--color-surface);
    border-radius: 8px;
    padding: 4px;
    border: 1px solid var(--color-border);
  }

  &__toggle-btn {
    padding: 12px 24px;
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: var(--color-text);
    }

    &.active {
      background: var(--color-primary);
      color: white;
    }
  }

  &__content {
    position: relative;
  }

  &__timeline {
    position: relative;
    max-width: 900px;
    margin: 0 auto;

    &-line {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--color-border);
      transform: translateX(-50%);
    }

    &-item {
      position: relative;
      margin-bottom: 60px;
      display: flex;
      align-items: center;

      &:last-child {
        margin-bottom: 0;
      }

      justify-content: flex-end;
      
      .companies-section__company-card {
        margin-right: 60px;
        max-width: 400px;
      }

      &--alternate {
        justify-content: flex-start;
        
        .companies-section__company-card {
          margin-right: 0;
          margin-left: 60px;
        }

        .companies-section__timeline-marker {
          order: -1;
        }
      }
    }

    &-marker {
      position: absolute;
      left: 50%;
      width: 20px;
      height: 20px;
      background: var(--color-primary);
      border: 4px solid var(--color-background);
      border-radius: 50%;
      transform: translateX(-50%);
      z-index: 2;
      box-shadow: 0 0 0 4px var(--color-border);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 32px;
  }

  &__company-card {
    &--timeline {
      width: 100%;
    }

    &--grid {
      width: 100%;
    }
  }

  &__empty {
    text-align: center;
    padding: 80px 20px;

    &-text {
      font-size: 18px;
      color: var(--color-text-secondary);
      margin: 0;
    }
  }
}

@media (max-width: 1024px) {
  .companies-section {
    padding: 60px 20px;

    &__title {
      font-size: 40px;
    }

    &__subtitle {
      font-size: 18px;
    }

    &__timeline {
      &-line {
        left: 30px;
      }

      &-item {
        justify-content: flex-start !important;
        
        .companies-section__company-card {
          margin-right: 0 !important;
          margin-left: 60px !important;
          max-width: calc(100% - 80px);
        }
      }

      &-marker {
        left: 30px;
      }
    }

    &__grid {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
  }
}

@media (max-width: 768px) {
  .companies-section {
    padding: 40px 16px;

    &__title {
      font-size: 32px;
    }

    &__subtitle {
      font-size: 16px;
    }

    &__display-toggle {
      flex-direction: column;
      width: 200px;
    }

    &__toggle-btn {
      padding: 10px 20px;
      font-size: 13px;
    }

    &__timeline {
      &-item {
        margin-bottom: 40px;
        
        .companies-section__company-card {
          margin-left: 50px !important;
          max-width: calc(100% - 60px);
        }
      }

      &-marker {
        left: 20px;
        width: 16px;
        height: 16px;
      }

      &-line {
        left: 20px;
      }
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
}
</style>