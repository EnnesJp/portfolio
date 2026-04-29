<template>
  <section
    :id="sectionId"
    class="app-section"
    :class="[`app-section--${background}`, { 'app-section--visible': isVisible }]"
    ref="sectionRef"
  >
    <div class="app-section__container">
      <header class="app-section__header">
        <h2 class="app-section__title">{{ title }}</h2>
        <p v-if="subtitle" class="app-section__subtitle">{{ subtitle }}</p>
      </header>
      <div class="app-section__content">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useEntranceAnimation } from '@/composables/useEntranceAnimation'

interface AppSectionProps {
  title: string
  subtitle?: string
  sectionId: string
  background?: 'primary' | 'surface'
}

withDefaults(defineProps<AppSectionProps>(), {
  background: 'primary',
})

const { sectionRef, isVisible } = useEntranceAnimation({ threshold: 0.1 })
</script>

<style scoped lang="scss">
.app-section {
  width: 100%;
  padding: 80px 24px;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 600ms ease-out,
    transform 600ms ease-out;

  &--primary {
    background-color: var(--color-background);
  }

  &--surface {
    background-color: var(--color-surface);
  }

  &--visible {
    opacity: 1;
    transform: translateY(0);
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
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

  &__content {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .app-section {
    padding: 60px 20px;

    &__title {
      font-size: 40px;
    }
  }
}

@media (max-width: 768px) {
  .app-section {
    padding: 40px 16px;

    &__title {
      font-size: 32px;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-section {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
