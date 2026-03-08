<template>
  <div 
    class="responsive-image-container"
    :class="{
      'responsive-image-container--loading': isLoading,
      'responsive-image-container--error': hasError,
      'responsive-image-container--loaded': isLoaded
    }"
    :style="containerStyle"
  >
    <div 
      v-if="isLoading && placeholder" 
      class="responsive-image-placeholder"
      :style="{ backgroundImage: `url(${placeholder})` }"
    />
    
    <img
      ref="imageRef"
      :src="imageConfig.src"
      :srcset="imageConfig.srcSet"
      :sizes="imageConfig.sizes"
      :alt="imageConfig.alt"
      :loading="imageConfig.loading"
      :width="imageConfig.width"
      :height="imageConfig.height"
      :class="[
        'responsive-image',
        {
          'responsive-image--loading': isLoading,
          'responsive-image--error': hasError,
          'responsive-image--loaded': isLoaded,
          'responsive-image--lazy': imageConfig.loading === 'lazy'
        }
      ]"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
    />
    
    <div v-if="hasError" class="responsive-image-error">
      <div class="responsive-image-error__icon">🖼️</div>
      <div class="responsive-image-error__text">{{ t('common.imageLoadError') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores/ui'
import type { ResponsiveImageConfig } from '@/stores/ui'

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
  placeholder?: string
  blurDataUrl?: string
  priority?: boolean
  quality?: number
  format?: 'webp' | 'avif' | 'auto'
  deviceOptimization?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  objectFit: 'cover',
  priority: false,
  quality: 85,
  format: 'auto',
  deviceOptimization: true
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
  intersect: [isIntersecting: boolean]
}>()

const { t } = useI18n()
const uiStore = useUIStore()

const imageRef = ref<HTMLImageElement>()
const intersectionObserver = ref<IntersectionObserver>()

const isLoading = ref(true)
const hasError = ref(false)
const isLoaded = ref(false)
const isIntersecting = ref(false)
const shouldLoad = ref(props.priority || props.loading === 'eager')

const imageConfig = computed((): ResponsiveImageConfig => {
  if (props.srcSet || props.sizes) {
    return {
      src: shouldLoad.value ? props.src : (props.blurDataUrl || ''),
      srcSet: shouldLoad.value ? props.srcSet : undefined,
      sizes: props.sizes,
      alt: props.alt,
      loading: props.loading,
      width: props.width,
      height: props.height
    }
  }
  
  return uiStore.generateResponsiveImageConfig(
    shouldLoad.value ? props.src : (props.blurDataUrl || ''), 
    props.alt, 
    {
      loading: props.loading,
      width: props.width,
      height: props.height,
      quality: props.quality,
      format: props.format,
      deviceOptimization: props.deviceOptimization
    }
  )
})

const containerStyle = computed(() => ({
  aspectRatio: props.aspectRatio,
  width: props.width ? `${props.width}px` : undefined,
  height: props.height ? `${props.height}px` : undefined
}))

const imageStyle = computed(() => ({
  objectFit: props.objectFit,
  filter: isLoading.value && props.blurDataUrl ? 'blur(10px)' : undefined,
  transition: 'filter 0.3s ease, opacity 0.3s ease'
}))

const handleLoad = (event: Event) => {
  isLoading.value = false
  isLoaded.value = true
  hasError.value = false
  emit('load', event)
}

const handleError = (event: Event) => {
  isLoading.value = false
  hasError.value = true
  isLoaded.value = false
  emit('error', event)
}

const setupIntersectionObserver = () => {
  if (!imageRef.value || props.loading === 'eager' || props.priority) {
    return
  }

  intersectionObserver.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isIntersecting.value = entry.isIntersecting
        emit('intersect', entry.isIntersecting)
        
        if (entry.isIntersecting && !shouldLoad.value) {
          shouldLoad.value = true
          intersectionObserver.value?.disconnect()
        }
      })
    },
    {
      rootMargin: '50px',
      threshold: 0.1
    }
  )

  intersectionObserver.value.observe(imageRef.value)
}

const preloadImage = () => {
  if (props.priority && props.src) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = props.src
    if (imageConfig.value.srcSet) {
      link.setAttribute('imagesrcset', imageConfig.value.srcSet)
    }
    if (imageConfig.value.sizes) {
      link.setAttribute('imagesizes', imageConfig.value.sizes)
    }
    document.head.appendChild(link)
  }
}

watch(() => props.src, () => {
  if (shouldLoad.value) {
    isLoading.value = true
    isLoaded.value = false
    hasError.value = false
  }
})

watch(shouldLoad, (newValue) => {
  if (newValue && imageRef.value) {
    nextTick(() => {
      const img = imageRef.value
      if (img?.complete && img.naturalWidth > 0) {
        handleLoad(new Event('load'))
      }
    })
  }
})

onMounted(() => {
  preloadImage()
  
  nextTick(() => {
    setupIntersectionObserver()
  })
  
  if (imageRef.value?.complete && imageRef.value.naturalWidth > 0) {
    handleLoad(new Event('load'))
  }
})

onUnmounted(() => {
  intersectionObserver.value?.disconnect()
})
</script>

<style scoped lang="scss">
.responsive-image-container {
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius);
  background: var(--color-surface);
  
  &--loading {
    .responsive-image {
      opacity: 0;
    }
  }
  
  &--loaded {
    .responsive-image {
      opacity: 1;
    }
    
    .responsive-image-placeholder {
      opacity: 0;
    }
  }
  
  &--error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    background: var(--color-surface);
  }
}

.responsive-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: v-bind(objectFit);
  transition: opacity var(--transition-medium), filter var(--transition-medium);
  
  @supports (aspect-ratio: 1) {
    aspect-ratio: v-bind(aspectRatio);
  }
  
  &--loading {
    opacity: 0;
  }
  
  &--loaded {
    opacity: 1;
  }
  
  &--error {
    display: none;
  }
  
  &--lazy {
    transition: opacity var(--transition-slow), filter var(--transition-medium);
  }
}

.responsive-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(10px);
  transform: scale(1.1);
  transition: opacity var(--transition-medium);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: skeleton-loading 1.5s infinite;
  }
}

.responsive-image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: var(--color-text-secondary);
  
  &__icon {
    font-size: 3rem;
    opacity: 0.5;
  }
  
  &__text {
    font-size: 0.875rem;
    text-align: center;
  }
}

@keyframes skeleton-loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.responsive-image {
  transform: translateZ(0);
  backface-visibility: hidden;
  
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  
  @supports (content-visibility: auto) {
    content-visibility: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .responsive-image,
  .responsive-image-placeholder {
    transition: none;
    animation: none;
  }
  
  .responsive-image-placeholder::before {
    animation: none;
  }
}

@media (prefers-contrast: high) {
  .responsive-image-container {
    border: 1px solid var(--color-border);
  }
  
  .responsive-image-error {
    border: 2px solid var(--color-text);
    background: var(--color-background);
  }
}

@media print {
  .responsive-image {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
  
  .responsive-image-placeholder {
    display: none;
  }
}
</style>