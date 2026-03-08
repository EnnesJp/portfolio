<template>
  <div
    ref="containerRef"
    class="lazy-image-container"
    :class="{
      'lazy-image-container--loading': isLoading,
      'lazy-image-container--loaded': isLoaded,
      'lazy-image-container--error': hasError,
      'lazy-image-container--intersecting': isIntersecting,
    }"
    :style="containerStyle"
  >
    <div
      v-if="blurDataUrl && !isLoaded"
      class="lazy-image-blur-placeholder"
      :style="{ backgroundImage: `url(${blurDataUrl})` }"
    />

    <div
      v-else-if="placeholderColor && !isLoaded"
      class="lazy-image-color-placeholder"
      :style="{ backgroundColor: placeholderColor }"
    />

    <div v-else-if="!isLoaded && !hasError" class="lazy-image-skeleton-placeholder" />

    <ResponsiveImage
      v-if="shouldRender"
      :src="srcUrl"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :sizes="sizes"
      :srcSet="srcSet"
      :objectFit="objectFit"
      :aspectRatio="aspectRatio"
      :priority="priority"
      :quality="quality"
      :format="format"
      :deviceOptimization="deviceOptimization"
      class="lazy-image"
      @load="handleLoad"
      @error="handleError"
    />

    <div v-if="hasError" class="lazy-image-error">
      <div class="lazy-image-error__icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
          />
        </svg>
      </div>
      <div class="lazy-image-error__text">
        {{ errorMessage || t('common.imageLoadError') }}
      </div>
      <button v-if="allowRetry" class="lazy-image-error__retry" @click="retry">
        {{ t('common.retry') }}
      </button>
    </div>

    <div v-if="isLoading && showLoadingIndicator" class="lazy-image-loading">
      <div class="lazy-image-loading__spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores/ui'
import ResponsiveImage from './ResponsiveImage.vue'

interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  sizes?: string
  srcSet?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none'
  aspectRatio?: string
  blurDataUrl?: string
  placeholderColor?: string
  priority?: boolean
  quality?: number
  format?: 'webp' | 'avif' | 'auto'
  deviceOptimization?: boolean
  rootMargin?: string
  threshold?: number
  showLoadingIndicator?: boolean
  allowRetry?: boolean
  errorMessage?: string
  fadeInDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  objectFit: 'cover',
  priority: false,
  quality: 85,
  format: 'auto',
  deviceOptimization: true,
  rootMargin: '50px',
  threshold: 0.1,
  showLoadingIndicator: true,
  allowRetry: true,
  fadeInDuration: 300,
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
  intersect: [isIntersecting: boolean]
  retry: []
}>()

const { t } = useI18n()

const containerRef = ref<HTMLElement>()
const intersectionObserver = ref<IntersectionObserver>()
const retryCount = ref(0)

const isLoading = ref(true)
const hasError = ref(false)
const isLoaded = ref(false)
const isIntersecting = ref(false)
const shouldRender = ref(props.priority || props.loading === 'eager')

const srcUrl = computed(() => new URL(props.src, import.meta.url).href)
const containerStyle = computed(() => ({
  aspectRatio: props.aspectRatio,
  width: props.width ? `${props.width}px` : undefined,
  height: props.height ? `${props.height}px` : undefined,
  '--fade-duration': `${props.fadeInDuration}ms`,
}))

const handleLoad = (event: Event) => {
  isLoading.value = false
  isLoaded.value = true
  hasError.value = false
  retryCount.value = 0
  emit('load', event)
}

const handleError = (event: Event) => {
  isLoading.value = false
  hasError.value = true
  isLoaded.value = false
  emit('error', event)
}

const retry = () => {
  if (retryCount.value < 3) {
    retryCount.value++
    hasError.value = false
    isLoading.value = true
    shouldRender.value = false

    nextTick(() => {
      shouldRender.value = true
    })

    emit('retry')
  }
}

const setupIntersectionObserver = () => {
  if (!containerRef.value || props.loading === 'eager' || props.priority) {
    shouldRender.value = true
    return
  }

  intersectionObserver.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isIntersecting.value = entry.isIntersecting
        emit('intersect', entry.isIntersecting)

        if (entry.isIntersecting && !shouldRender.value) {
          shouldRender.value = true
          intersectionObserver.value?.disconnect()
        }
      })
    },
    {
      rootMargin: props.rootMargin,
      threshold: props.threshold,
    },
  )

  intersectionObserver.value.observe(containerRef.value)
}

watch(
  () => props.src,
  () => {
    if (shouldRender.value) {
      isLoading.value = true
      isLoaded.value = false
      hasError.value = false
      retryCount.value = 0
    }
  },
)

onMounted(() => {
  nextTick(() => {
    setupIntersectionObserver()
  })
})

onUnmounted(() => {
  intersectionObserver.value?.disconnect()
})
</script>

<style scoped lang="scss">
.lazy-image-container {
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius, 8px);
  background: var(--color-surface);

  &--loading {
    .lazy-image {
      opacity: 0;
    }
  }

  &--loaded {
    .lazy-image {
      opacity: 1;
    }

    .lazy-image-blur-placeholder,
    .lazy-image-color-placeholder,
    .lazy-image-skeleton-placeholder {
      opacity: 0;
    }
  }

  &--error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }
}

.lazy-image {
  width: 100%;
  height: 100%;
  transition: opacity var(--fade-duration, 300ms) ease;
}

.lazy-image-blur-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(20px);
  transform: scale(1.1);
  transition: opacity var(--fade-duration, 300ms) ease;
}

.lazy-image-color-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: opacity var(--fade-duration, 300ms) ease;
}

.lazy-image-skeleton-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    var(--color-border) 50%,
    var(--color-surface) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  transition: opacity var(--fade-duration, 300ms) ease;
}

.lazy-image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;

  &__spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--color-border);
    border-top: 3px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.lazy-image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: var(--color-text-secondary);
  text-align: center;

  &__icon {
    opacity: 0.5;

    svg {
      width: 48px;
      height: 48px;
    }
  }

  &__text {
    font-size: 0.875rem;
    line-height: 1.4;
  }

  &__retry {
    padding: 0.5rem 1rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: var(--color-primary-dark, var(--color-primary));
      opacity: 0.9;
    }
  }
}

@keyframes skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lazy-image,
  .lazy-image-blur-placeholder,
  .lazy-image-color-placeholder,
  .lazy-image-skeleton-placeholder {
    transition: none;
  }

  .lazy-image-skeleton-placeholder {
    animation: none;
    background: var(--color-border);
  }

  .lazy-image-loading__spinner {
    animation: none;
    border-top-color: var(--color-border);
  }
}

@media (prefers-contrast: high) {
  .lazy-image-container {
    border: 1px solid var(--color-border);
  }

  .lazy-image-error {
    border: 2px solid var(--color-text);
    background: var(--color-background);
  }
}
</style>
