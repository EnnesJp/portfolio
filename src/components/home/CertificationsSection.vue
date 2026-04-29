<template>
  <AppSection
    section-id="certifications"
    background="surface"
    :title="t('home.certificationsSection.title')"
  >
    <div class="certifications-section__content" v-if="certifications.length > 0">
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
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3 class="certifications-section__empty-title">
        {{ t('home.certificationsSection.empty.title') }}
      </h3>
      <p class="certifications-section__empty-description">
        {{ t('home.certificationsSection.empty.description') }}
      </p>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import { useNavigationStore } from '@/stores/navigation'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import CertificationCard from './CertificationCard.vue'
import AppSection from '@/components/shared/AppSection.vue'

const { t } = useI18n()
const portfolioStore = usePortfolioStore()
const navigationStore = useNavigationStore()

const { certifications } = storeToRefs(portfolioStore)

const sortedCertifications = computed(() => {
  return [...certifications.value].sort((a, b) => {
    return b.date.getTime() - a.date.getTime()
  })
})

onMounted(() => {
  const sectionElement = document.getElementById('certifications')
  if (sectionElement) {
    navigationStore.registerSection({
      id: 'certifications',
      label: t('navigation.certifications'),
      order: 4,
      visible: true,
      element: sectionElement,
    })
  }
})
</script>

<style scoped lang="scss">
.certifications-section {
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
    &__grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
  }
}

@media (max-width: 768px) {
  .certifications-section {
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
