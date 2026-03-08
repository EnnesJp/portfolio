<template>
  <div
    :class="[
      'responsive-grid',
      `responsive-grid--${currentLayout}`,
      {
        'responsive-grid--auto-fit': autoFit,
        'responsive-grid--equal-height': equalHeight
      }
    ]"
    :style="gridStyles"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'

interface Props {
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    xxl?: number
  }
  gap?: string | number
  minItemWidth?: string
  maxItemWidth?: string
  autoFit?: boolean
  equalHeight?: boolean
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  justifyItems?: 'start' | 'center' | 'end' | 'stretch'
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => ({
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 4
  }),
  gap: '1rem',
  autoFit: false,
  equalHeight: false,
  alignItems: 'stretch',
  justifyItems: 'stretch'
})

const uiStore = useUIStore()

const currentLayout = computed(() => {
  const breakpoint = uiStore.currentBreakpoint
  return props.columns[breakpoint] || props.columns.lg || 3
})

const gridStyles = computed(() => {
  const gap = typeof props.gap === 'number' ? `${props.gap}rem` : props.gap
  
  let gridTemplateColumns: string
  
  if (props.autoFit && props.minItemWidth) {
    const maxWidth = props.maxItemWidth || '1fr'
    gridTemplateColumns = `repeat(auto-fit, minmax(${props.minItemWidth}, ${maxWidth}))`
  } else {
    gridTemplateColumns = `repeat(${currentLayout.value}, minmax(0, 1fr))`
  }
  
  return {
    display: 'grid',
    gridTemplateColumns,
    gap,
    alignItems: props.alignItems,
    justifyItems: props.justifyItems,
    ...(props.equalHeight && { gridAutoRows: '1fr' })
  }
})
</script>

<style scoped lang="scss">
.responsive-grid {
  width: 100%;
  
  &--auto-fit {
    grid-template-columns: var(--grid-template-columns);
  }
  
  &--equal-height {
    > * {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}

.grid-item {
  &--span-2 {
    grid-column: span 2;
  }
  
  &--span-3 {
    grid-column: span 3;
  }
  
  &--span-full {
    grid-column: 1 / -1;
  }
  
  @media screen and (max-width: 768px) {
    &--span-2,
    &--span-3 {
      grid-column: span 1;
    }
  }
}
</style>