<template>
  <section class="certifications-section" id="certifications">
    <div class="certifications-section__container">
      <div class="certifications-section__header">
        <h2 class="certifications-section__title">
          {{ t('home.certificationsSection.title') }}
        </h2>
        <p class="certifications-section__subtitle">
          {{ t('home.certificationsSection.subtitle') }}
        </p>
      </div>

      <div class="certifications-section__filters" v-if="categories.length > 0">
        <div class="certifications-section__filter-group">
          <button 
            class="certifications-section__filter-btn"
            :class="{ 'active': selectedCategory === null }"
            @click="setSelectedCategory(null)"
          >
            {{ t('home.certificationsSection.filters.all') }}
          </button>
          <button 
            v-for="category in categories" 
            :key="category.id"
            class="certifications-section__filter-btn"
            :class="{ 'active': selectedCategory === category.id }"
            :style="{ '--category-color': category.color }"
            @click="setSelectedCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <div class="certifications-section__content" v-if="filteredCertifications.length > 0">
        <div class="certifications-section__grid">
          <CertificationCard 
            v-for="certification in sortedCertifications" 
            :key="certification.id"
            :certification="certification"
          />
        </div>
      </div>

      <div v-else class="certifications-section__empty">
        <div class="certifications-section__empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="certifications-section__empty-title">
          {{ t('home.certificationsSection.empty.title') }}
        </h3>
        <p class="certifications-section__empty-description">
          {{ selectedCategory ? t('home.certificationsSection.empty.description') : 'No certifications available yet.' }}
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
import CertificationCard from './CertificationCard.vue'
import type { Certification, CertificationCategory } from '@/types'

const { t } = useI18n()
const portfolioStore = usePortfolioStore()
const navigationStore = useNavigationStore()

const { certifications, portfolioData } = storeToRefs(portfolioStore)

const selectedCategory = ref<string | null>(null)

const categories = computed(() => {
  return portfolioData.value?.certifications?.categories || []
})

const filteredCertifications = computed((): Certification[] => {
  if (!selectedCategory.value) {
    return certifications.value
  }
  return certifications.value.filter(cert => cert.category.id === selectedCategory.value)
})

const sortedCertifications = computed((): Certification[] => {
  return [...filteredCertifications.value].sort((a, b) => {
    return b.date.getTime() - a.date.getTime()
  })
})

const setSelectedCategory = (categoryId: string | null) => {
  selectedCategory.value = categoryId
}

onMounted(() => {
  const sectionElement = document.getElementById('certifications')
  if (sectionElement) {
    navigationStore.registerSection({
      id: 'certifications',
      label: t('navigation.certifications'),
      order: 4,
      visible: true,
      element: sectionElement
    })
  }
})
</script>

<style scoped lang="scss">
.certifications-section {
  padding: 80px 24px;
  background: var(--color-surface);

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
    margin: 0;
  }

  &__filters {
    margin-bottom: 60px;
    display: flex;
    justify-content: center;
  }

  &__filter-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    max-width: 800px;
  }

  &__filter-btn {
    padding: 12px 24px;
    border: 2px solid var(--color-border);
    background: var(--color-background);
    color: var(--color-text);
    border-radius: 25px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: var(--color-primary);
      transform: translateY(-2px);
    }

    &.active {
      background: var(--category-color, var(--color-primary));
      color: white;
      border-color: var(--category-color, var(--color-primary));
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    &:hover::before {
      left: 100%;
    }
  }

  &__content {
    position: relative;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 32px;
  }

  &__empty {
    text-align: center;
    padding: 80px 20px;
    color: var(--color-text-secondary);

    &-icon {
      margin-bottom: 24px;
      color: var(--color-border);

      svg {
        width: 64px;
        height: 64px;
      }
    }

    &-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--color-text);
      margin: 0 0 12px 0;
    }

    &-description {
      font-size: 16px;
      margin: 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}

@media (max-width: 1024px) {
  .certifications-section {
    padding: 60px 20px;

    &__title {
      font-size: 40px;
    }

    &__subtitle {
      font-size: 18px;
    }

    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
  }
}

@media (max-width: 768px) {
  .certifications-section {
    padding: 40px 16px;

    &__title {
      font-size: 32px;
    }

    &__subtitle {
      font-size: 16px;
    }

    &__filter-group {
      gap: 8px;
    }

    &__filter-btn {
      padding: 10px 20px;
      font-size: 13px;
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    &__empty {
      padding: 60px 16px;

      &-icon svg {
        width: 48px;
        height: 48px;
      }

      &-title {
        font-size: 20px;
      }

      &-description {
        font-size: 14px;
      }
    }
  }
}
</style>