<template>
  <div class="certification-card">
    <div class="certification-card__header">
      <h3 class="certification-card__name">{{ certification.name }}</h3>
      <span class="certification-card__category">{{ certification.category.name }}</span>
    </div>

    <div class="certification-card__details">
      <span class="certification-card__issuer">
        {{ t('home.certificationsSection.certification.issuer') }}: {{ certification.issuer }}
      </span>
      <span class="certification-card__date">
        {{ t('home.certificationsSection.certification.date') }}:
        {{ formatDate(certification.date) }}
      </span>
    </div>

    <a
      v-if="certification.verificationUrl"
      :href="certification.verificationUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="certification-card__link"
    >
      {{ t('home.certificationsSection.certification.verify') }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Certification } from '@/types'

interface Props {
  certification: Certification
}

defineProps<Props>()
const { t } = useI18n()

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped lang="scss">
.certification-card {
  background: var(--color-background);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-surface);
  }

  &__header {
    margin-bottom: 16px;
  }

  &__name {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 8px 0;
    line-height: 1.3;
  }

  &__category {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  &__details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__issuer,
  &__date {
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  &__link {
    font-size: 14px;
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    margin-top: auto;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  }
}

@media (max-width: 768px) {
  .certification-card {
    padding: 20px;

    &__name {
      font-size: 16px;
    }

    &__category {
      font-size: 12px;
    }

    &__issuer,
    &__date {
      font-size: 13px;
    }

    &__link {
      font-size: 13px;
    }
  }
}
</style>
