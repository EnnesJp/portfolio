<template>
  <div class="company-card" :class="`company-card--${viewMode}`">
    <div class="company-card__header">
      <div class="company-card__logo" v-if="company.logo">
        <LazyImage 
          :src="company.logo" 
          :alt="`${company.name} logo`"
          class="company-card__logo-img"
          :width="60"
          :height="60"
          object-fit="contain"
          loading="lazy"
          :quality="90"
          placeholder-color="#f8f9fa"
        />
      </div>
      <div class="company-card__info">
        <h3 class="company-card__name">{{ company.name }}</h3>
        <p class="company-card__position">{{ company.position }}</p>
        <p class="company-card__period">{{ formatPeriod(company) }}</p>
      </div>
    </div>

    <div class="company-card__description">
      <p class="company-card__description-text">{{ company.description }}</p>
    </div>

    <div class="company-card__achievements" v-if="company.achievements.length > 0">
      <h4 class="company-card__achievements-title">
        {{ t('home.companiesSection.company.achievements') }}
      </h4>
      <ul class="company-card__achievements-list">
        <li 
          v-for="(achievement, index) in company.achievements" 
          :key="index"
          class="company-card__achievement-item"
        >
          {{ achievement }}
        </li>
      </ul>
    </div>

    <div class="company-card__technologies" v-if="company.technologies.length > 0">
      <h4 class="company-card__technologies-title">
        {{ t('home.companiesSection.company.technologies') }}
      </h4>
      <div class="company-card__tech-tags">
        <span 
          v-for="tech in company.technologies" 
          :key="tech"
          class="company-card__tech-tag"
        >
          {{ tech }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LazyImage } from '@/components/ui'
import type { Company } from '@/types'

interface Props {
  company: Company
  viewMode: 'timeline' | 'grid'
}

const props = defineProps<Props>()
const { t } = useI18n()

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
</script>

<style scoped lang="scss">
.company-card {
  background: var(--color-surface);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 24px;
  }

  &__logo {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    border-radius: 12px;
    overflow: hidden;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;

    &-img {
      width: 100%;
      height: 100%;
      padding: 8px;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 8px 0;
    line-height: 1.2;
  }

  &__position {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-primary);
    margin: 0 0 4px 0;
  }

  &__period {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-secondary);
    margin: 0;
  }

  &__description {
    margin-bottom: 24px;

    &-text {
      font-size: 16px;
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin: 0;
    }
  }

  &__achievements {
    margin-bottom: 24px;

    &-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text);
      margin: 0 0 12px 0;
    }

    &-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }

  &__achievement-item {
    position: relative;
    padding-left: 20px;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.5;

    &:last-child {
      margin-bottom: 0;
    }

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--color-primary);
      font-weight: bold;
    }
  }

  &__technologies {
    &-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text);
      margin: 0 0 12px 0;
    }
  }

  &__tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tech-tag {
    padding: 6px 12px;
    background: var(--color-background);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }
  }

  &--timeline {
    max-width: 400px;
  }

  &--grid {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .company-card {
    padding: 24px;

    &__header {
      gap: 16px;
      margin-bottom: 20px;
    }

    &__logo {
      width: 50px;
      height: 50px;
    }

    &__name {
      font-size: 20px;
    }

    &__position {
      font-size: 16px;
    }

    &__period {
      font-size: 13px;
    }

    &__description {
      margin-bottom: 20px;

      &-text {
        font-size: 14px;
      }
    }

    &__achievements {
      margin-bottom: 20px;

      &-title {
        font-size: 14px;
      }
    }

    &__achievement-item {
      font-size: 13px;
    }

    &__technologies {
      &-title {
        font-size: 14px;
      }
    }

    &__tech-tag {
      padding: 4px 10px;
      font-size: 11px;
    }
  }
}

@media (max-width: 480px) {
  .company-card {
    padding: 20px;

    &__header {
      flex-direction: column;
      gap: 12px;
      text-align: center;
    }

    &__logo {
      align-self: center;
    }

    &__name {
      font-size: 18px;
    }

    &__position {
      font-size: 15px;
    }
  }
}
</style>