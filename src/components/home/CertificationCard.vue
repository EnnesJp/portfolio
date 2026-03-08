<template>
  <div class="certification-card">
    <div class="certification-card__badge" v-if="certification.badge">
      <img 
        :src="certification.badge" 
        :alt="`${certification.name} badge`"
        class="certification-card__badge-img"
        @error="handleImageError"
      />
    </div>
    <div v-else class="certification-card__badge certification-card__badge--placeholder">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
      </svg>
    </div>

    <div class="certification-card__content">
      <div class="certification-card__header">
        <h3 class="certification-card__name">{{ certification.name }}</h3>
        <div class="certification-card__category" :style="{ '--category-color': certification.category.color }">
          {{ certification.category.name }}
        </div>
      </div>

      <div class="certification-card__details">
        <div class="certification-card__issuer">
          <span class="certification-card__label">{{ t('home.certificationsSection.certification.issuer') }}:</span>
          <span class="certification-card__value">{{ certification.issuer }}</span>
        </div>
        
        <div class="certification-card__date">
          <span class="certification-card__label">{{ t('home.certificationsSection.certification.date') }}:</span>
          <span class="certification-card__value">{{ formatDate(certification.date) }}</span>
        </div>

        <div class="certification-card__credential" v-if="certification.credentialId">
          <span class="certification-card__label">{{ t('home.certificationsSection.certification.credentialId') }}:</span>
          <span class="certification-card__value certification-card__value--credential">{{ certification.credentialId }}</span>
        </div>
      </div>

      <div class="certification-card__actions" v-if="certification.verificationUrl">
        <a 
          :href="certification.verificationUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="certification-card__verify-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15L15.19 9.81L13.78 8.4L10 12.18L8.22 10.4L6.81 11.81L10 15ZM12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L19 6.5C18.9 6.1 18.7 5.7 18.5 5.4L19.2 3.5L17.5 1.8L15.6 2.5C15.3 2.3 14.9 2.1 14.5 2L14 0H10L9.5 2C9.1 2.1 8.7 2.3 8.4 2.5L6.5 1.8L4.8 3.5L5.5 5.4C5.3 5.7 5.1 6.1 5 6.5L3 7V9L5 9.5C5.1 9.9 5.3 10.3 5.5 10.6L4.8 12.5L6.5 14.2L8.4 13.5C8.7 13.7 9.1 13.9 9.5 14L10 16H14L14.5 14C14.9 13.9 15.3 13.7 15.6 13.5L17.5 14.2L19.2 12.5L18.5 10.6C18.7 10.3 18.9 9.9 19 9.5L21 9Z" fill="currentColor"/>
          </svg>
          {{ t('home.certificationsSection.certification.verify') }}
        </a>
      </div>
    </div>

    <div class="certification-card__status" :class="{ 'certification-card__status--valid': isValid }">
      <div class="certification-card__status-dot"></div>
      <span class="certification-card__status-text">
        {{ isValid ? t('home.certificationsSection.certification.valid') : t('home.certificationsSection.certification.expired') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import type { Certification } from '@/types'

interface Props {
  certification: Certification
}

const props = defineProps<Props>()
const { t } = useI18n()

const isValid = computed(() => {
  return true
})

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const placeholder = img.parentElement?.nextElementSibling
  if (placeholder) {
    img.parentElement!.style.display = 'none'
    placeholder.classList.remove('hidden')
  }
}
</script>

<style scoped lang="scss">
.certification-card {
  background: var(--color-background);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--category-color, var(--color-primary));
  }

  &__badge {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    border-radius: 16px;
    overflow: hidden;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &--placeholder {
      color: var(--category-color, var(--color-primary));
      background: rgba(var(--category-color-rgb, 59, 130, 246), 0.1);
      border-color: var(--category-color, var(--color-primary));
    }

    &-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 12px;
    }
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__header {
    text-align: center;
    margin-bottom: 24px;
  }

  &__name {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 12px 0;
    line-height: 1.3;
  }

  &__category {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(var(--category-color-rgb, 59, 130, 246), 0.1);
    color: var(--category-color, var(--color-primary));
    border: 1px solid var(--category-color, var(--color-primary));
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__details {
    flex: 1;
    margin-bottom: 24px;
  }

  &__issuer,
  &__date,
  &__credential {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__label {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__value {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text);

    &--credential {
      font-family: 'Courier New', monospace;
      background: var(--color-surface);
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid var(--color-border);
      font-size: 12px;
    }
  }

  &__actions {
    margin-top: auto;
  }

  &__verify-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--category-color, var(--color-primary));
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    width: 100%;
    justify-content: center;

    &:hover {
      background: var(--category-color, var(--color-primary));
      opacity: 0.9;
      transform: translateY(-2px);
    }

    svg {
      flex-shrink: 0;
    }
  }

  &__status {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(220, 38, 38, 0.1);
    color: #dc2626;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &--valid {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    &-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    &-text {
      white-space: nowrap;
    }
  }
}

@media (max-width: 768px) {
  .certification-card {
    padding: 24px;

    &__badge {
      width: 60px;
      height: 60px;
      margin-bottom: 20px;
    }

    &__name {
      font-size: 18px;
    }

    &__category {
      font-size: 11px;
      padding: 4px 12px;
    }

    &__details {
      margin-bottom: 20px;
    }

    &__label {
      font-size: 11px;
    }

    &__value {
      font-size: 13px;

      &--credential {
        font-size: 11px;
        padding: 6px 10px;
      }
    }

    &__verify-btn {
      padding: 10px 16px;
      font-size: 13px;
    }

    &__status {
      top: 12px;
      right: 12px;
      padding: 4px 8px;
      font-size: 10px;

      &-dot {
        width: 4px;
        height: 4px;
      }
    }
  }
}

@media (max-width: 480px) {
  .certification-card {
    padding: 20px;

    &__badge {
      width: 50px;
      height: 50px;
      margin-bottom: 16px;
    }

    &__name {
      font-size: 16px;
    }

    &__header {
      margin-bottom: 20px;
    }

    &__details {
      margin-bottom: 16px;
    }
  }
}
</style>