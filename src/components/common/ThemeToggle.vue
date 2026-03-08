<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :aria-label="t('common.toggleTheme')"
    :disabled="isTransitioning"
  >
    <div class="theme-toggle__icon">
      <svg
        v-if="currentTheme === 'light'"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73A8.15 8.15 0 0 1 9.08 5.49a8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05Zm-9.5 6.69A8.14 8.14 0 0 1 7.08 5.22v.27A10.15 10.15 0 0 0 17.22 15.63a9.79 9.79 0 0 0 2.1-.22A8.11 8.11 0 0 1 12.14 19.69Z"
          fill="currentColor"
        />
      </svg>
      <svg
        v-else
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const themeStore = useThemeStore()
const { currentTheme, isTransitioning } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>

<style scoped lang="scss">
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover:not(:disabled) {
    background-color: var(--color-surface);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &:hover:not(:disabled) &__icon {
    transform: rotate(20deg) scale(1.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle {
    transition: none;

    &__icon {
      transition: none;
    }

    &:hover:not(:disabled) {
      transform: none;
    }

    &:hover:not(:disabled) &__icon {
      transform: none;
    }
  }
}
</style>
