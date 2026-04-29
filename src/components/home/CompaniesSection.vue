<template>
  <AppSection
    section-id="companies"
    background="surface"
    :title="t('home.companiesSection.title')"
    :subtitle="t('home.companiesSection.subtitle')"
  >
    <div class="companies-section__controls" v-if="companies.length > 0">
      <div class="companies-section__display-toggle">
        <div
          class="companies-section__toggle-slider"
          :class="{ 'companies-section__toggle-slider--grid': displayMode === 'grid' }"
        ></div>
        <button
          class="companies-section__toggle-btn"
          :class="{ active: displayMode === 'timeline' }"
          @click="setDisplayMode('timeline')"
        >
          {{ t('home.companiesSection.displayMode.timeline') }}
        </button>
        <button
          class="companies-section__toggle-btn"
          :class="{ active: displayMode === 'grid' }"
          @click="setDisplayMode('grid')"
        >
          {{ t('home.companiesSection.displayMode.grid') }}
        </button>
      </div>
    </div>

    <div class="companies-section__content" v-if="sortedCompanies.length > 0">
      <div v-if="displayMode === 'timeline'" class="companies-section__timeline">
        <div class="companies-section__timeline-line"></div>
        <div
          v-for="(company, index) in sortedCompanies"
          :key="company.id"
          class="companies-section__timeline-item"
          :class="{ 'companies-section__timeline-item--alternate': index % 2 === 1 }"
        >
          <div class="companies-section__timeline-marker"></div>
          <div class="companies-section__company-card companies-section__company-card--timeline">
            <CompanyCard :company="company" :view-mode="'timeline'" />
          </div>
        </div>
      </div>

      <div v-else class="companies-section__grid">
        <div
          v-for="company in sortedCompanies"
          :key="company.id"
          class="companies-section__company-card companies-section__company-card--grid"
        >
          <CompanyCard :company="company" :view-mode="'grid'" />
        </div>
      </div>
    </div>

    <div v-else class="companies-section__empty">
      <p class="companies-section__empty-text">No companies to display yet.</p>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import { useNavigationStore } from '@/stores/navigation'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import CompanyCard from './CompanyCard.vue'
import AppSection from '@/components/shared/AppSection.vue'
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

onMounted(() => {
  const sectionElement = document.getElementById('companies')
  if (sectionElement) {
    navigationStore.registerSection({
      id: 'companies',
      label: t('navigation.companies'),
      order: 3,
      visible: true,
      element: sectionElement,
    })
  }

  if (portfolioData.value?.companies?.displayMode) {
    displayMode.value = portfolioData.value.companies.displayMode
  }
})
</script>

<style scoped lang="scss">
.companies-section {
  &__controls {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  }

  &__display-toggle {
    display: flex;
    background: var(--color-background);
    border-radius: 8px;
    padding: 4px;
    border: 1px solid var(--color-border);
    position: relative;
  }

  &__toggle-slider {
    position: absolute;
    top: 4px;
    left: 4px;
    height: calc(100% - 8px);
    width: calc(50% - 4px);
    background: var(--color-primary);
    border-radius: 6px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;

    &--grid {
      transform: translateX(100%);
    }
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
    transition: color 0.2s ease;
    position: relative;
    z-index: 1;
    flex: 1;

    &:hover {
      color: var(--color-text);
    }

    &.active {
      color: white;
    }
  }

  &__content {
    position: relative;
  }

  &__timeline {
    position: relative;
    max-width: 1100px;
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
      margin-bottom: 100px;
      display: flex;
      align-items: center;

      &:last-child {
        margin-bottom: 0;
      }

      justify-content: flex-end;

      .companies-section__company-card {
        margin-right: 70px;
        max-width: 450px;
      }

      &--alternate {
        justify-content: flex-start;

        .companies-section__company-card {
          margin-right: 0;
          margin-left: 120px;
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
    &__timeline {
      &-line {
        left: 30px;
      }

      &-item {
        justify-content: flex-start !important;
        margin-bottom: 70px;

        .companies-section__company-card {
          margin-right: 0 !important;
          margin-left: 80px !important;
          max-width: calc(100% - 100px);
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
    &__display-toggle {
      flex-direction: column;
      width: 200px;
    }

    &__toggle-slider {
      width: calc(100% - 8px);
      height: calc(50% - 4px);

      &--grid {
        transform: translateY(100%);
      }
    }

    &__toggle-btn {
      padding: 10px 20px;
      font-size: 13px;
    }

    &__timeline {
      &-item {
        margin-bottom: 60px;

        .companies-section__company-card {
          margin-left: 70px !important;
          max-width: calc(100% - 85px);
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
