<template>
  <div
    ref="selectorRef"
    class="language-selector"
    @click="handleOpenOptions"
    :class="{ changing: languageStore.isChanging }"
  >
    <div class="language-selector-lang">
      <img
        class="language-selector-lang__icon"
        :src="`/portfolio/images/flags/${languageStore.currentLanguageConfig.flag}`"
        :alt="`${languageStore.currentLanguageConfig.name} flag`"
      />

      <span class="language-selector-lang__text">
        {{ languageStore.currentLanguageConfig.name }}
      </span>
    </div>
    <small-arrow class="language-selector-arrow" :class="{ up: openOptions }" />

    <div
      ref="dropdownRef"
      class="language-selector-wrapper"
      v-if="openOptions"
      :style="dropdownStyle"
    >
      <div
        class="language-selector-option"
        v-for="lang in languageStore.availableLanguages"
        :key="lang.code"
        @click="changeLang(lang.code)"
        :class="{ active: lang.code === languageStore.currentLanguage }"
      >
        <img
          class="language-selector-option__icon"
          :src="`/portfolio/images/flags/${lang.flag}`"
          :alt="`${lang.name} flag`"
        />

        <span class="language-selector-option__text">
          {{ lang.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SmallArrow } from '@components'
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import type { SupportedLanguage } from '@/stores/language'

const languageStore = useLanguageStore()
const openOptions = ref(false)
const selectorRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()

const dropdownStyle = computed(() => {
  if (!openOptions.value || !selectorRef.value) return {}

  const rect = selectorRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth

  const spaceAbove = rect.top
  const spaceBelow = viewportHeight - rect.bottom

  const optionHeight = 44
  const dropdownPadding = 16
  const estimatedDropdownHeight =
    languageStore.availableLanguages.length * optionHeight + dropdownPadding

  const shouldShowAbove =
    spaceBelow < estimatedDropdownHeight && spaceAbove > estimatedDropdownHeight

  const dropdownWidth = 160
  let left = 0

  if (rect.right > viewportWidth - dropdownWidth) {
    left = rect.width - dropdownWidth
  }

  const style: Record<string, string> = {
    position: 'absolute',
    width: '160px',
    zIndex: '1001',
  }

  if (shouldShowAbove) {
    style.bottom = '100%'
    style.marginBottom = '12px'
  } else {
    style.top = '100%'
    style.marginTop = '12px'
  }

  if (left !== 0) {
    style.right = '0'
  } else {
    style.left = '0'
  }

  return style
})

const handleOpenOptions = async () => {
  if (languageStore.isChanging) return

  openOptions.value = !openOptions.value

  if (openOptions.value) {
    await nextTick()
    if (dropdownRef.value) {
      const activeOption = dropdownRef.value.querySelector(
        '.language-selector-option.active',
      ) as HTMLElement
      if (activeOption) {
        activeOption.focus()
      }
    }
  }
}

const changeLang = async (lang: SupportedLanguage) => {
  if (languageStore.isChanging || lang === languageStore.currentLanguage) {
    return
  }

  try {
    await languageStore.setLanguage(lang)
    openOptions.value = false
  } catch (error) {
    console.error('Failed to change language:', error)
  }
}

const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (selectorRef.value && !selectorRef.value.contains(target)) {
    openOptions.value = false
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && openOptions.value) {
    openOptions.value = false
    selectorRef.value?.focus()
  }
}

const handleKeyNavigation = (event: KeyboardEvent) => {
  if (!openOptions.value) return

  const options = Array.from(dropdownRef.value?.querySelectorAll('.language-selector-option') || [])
  const currentIndex = options.findIndex((option) => option.classList.contains('active'))

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
      ;(options[nextIndex] as HTMLElement)?.focus()
      break
    case 'ArrowUp':
      event.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
      ;(options[prevIndex] as HTMLElement)?.focus()
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      const focusedOption = document.activeElement as HTMLElement
      if (focusedOption && focusedOption.classList.contains('language-selector-option')) {
        focusedOption.click()
      }
      break
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
  document.addEventListener('keydown', handleKeyNavigation)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
  document.removeEventListener('keydown', handleKeyNavigation)
})
</script>

<style scoped lang="scss">
.language-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  gap: 12px;
  min-width: 140px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background-color: transparent;

  &.changing {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(.changing) {
    background-color: var(--color-surface);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &-lang {
    display: flex;
    align-items: center;
    gap: 8px;

    &__icon {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      object-fit: cover;
      flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    &__text {
      color: var(--color-text);
      font-size: 15px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
      white-space: nowrap;
      transition: color 0.3s ease;
    }
  }

  &-arrow {
    width: 10px;
    height: 10px;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    flex-shrink: 0;
    opacity: 0.7;

    &.up {
      transform: rotate(180deg);
    }
  }

  &-wrapper {
    background-color: var(--color-background);
    padding: 8px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--color-border);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    animation: dropdownFadeIn 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    position: absolute;
    z-index: 1001;
    min-width: 160px;
  }

  &-option {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 10px 12px;
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    outline: none;

    &:hover,
    &:focus {
      background-color: var(--color-surface);
      transform: translateX(2px);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: -2px;
    }

    &.active {
      background-color: var(--color-primary);

      .language-selector-option__text {
        color: white;
        font-weight: 600;
      }

      &:hover,
      &:focus {
        background-color: var(--color-accent);
        transform: translateX(2px);
      }
    }

    &__icon {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      object-fit: cover;
      flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    &__text {
      color: var(--color-text);
      font-size: 15px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
      transition: color 0.2s ease;
      white-space: nowrap;
    }
  }
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// Mobile responsive behavior
@media screen and (max-width: 820px) {
  .language-selector {
    display: none;
  }
}

// High contrast mode support
@media (prefers-contrast: high) {
  .language-selector {
    &-wrapper {
      border-width: 2px;
    }

    &-option {
      &:focus-visible {
        outline-width: 3px;
      }
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .language-selector {
    &-arrow {
      transition: none;
    }

    &-wrapper {
      animation: none;
    }

    &-option {
      transition: none;
    }
  }
}
</style>
