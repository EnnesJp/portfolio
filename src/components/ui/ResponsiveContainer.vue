<template>
  <div
    :class="[
      'responsive-container',
      `responsive-container--${size}`,
      {
        'responsive-container--fluid': fluid,
        'responsive-container--centered': centered
      }
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full'
  fluid?: boolean
  centered?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'lg',
  fluid: false,
  centered: true
})
</script>

<style scoped lang="scss">
.responsive-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
  
  &--xs {
    max-width: 480px;
  }
  
  &--sm {
    max-width: 640px;
  }
  
  &--md {
    max-width: 768px;
  }
  
  &--lg {
    max-width: 1024px;
  }
  
  &--xl {
    max-width: 1200px;
  }
  
  &--xxl {
    max-width: 1400px;
  }
  
  &--full {
    max-width: none;
  }
  
  &--fluid {
    max-width: none;
    padding-left: 0;
    padding-right: 0;
  }
  
  &--centered {
    margin-left: auto;
    margin-right: auto;
  }
  
  @media screen and (max-width: 768px) {
    padding-left: 1rem;
    padding-right: 1rem;
    
    &--fluid {
      padding-left: 0;
      padding-right: 0;
    }
  }
  
  @media screen and (max-width: 480px) {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    
    &--fluid {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>