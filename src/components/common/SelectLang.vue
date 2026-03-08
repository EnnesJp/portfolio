<template>
  <div
    class="language-selector"
    @click="handleOpenOptions"
    :class="{ 'changing': languageStore.isChanging }"
  >
    <div class="language-selector-lang">
      <img
        class="language-selector-lang__icon"
        :src="`/portfolio/images/flags/${languageStore.currentLanguageConfig.flag}`"
        :alt="`${languageStore.currentLanguageConfig.name} flag`"
      >
      
      <span class="language-selector-lang__text">
        {{ languageStore.currentLanguageConfig.name }}
      </span>
    </div>
    <small-arrow 
      class="language-selector-arrow"
      :class="{ 'up': openOptions }"
    />
  </div>

  <div
    class="language-selector-wrapper"
    v-if="openOptions"
  >
    <div
      class="language-selector-option"
      v-for="lang in languageStore.availableLanguages"
      :key="lang.code"
      @click="changeLang(lang.code)"
      :class="{ 'active': lang.code === languageStore.currentLanguage }"
    >
      <img
        class="language-selector-option__icon"
        :src="`/portfolio/images/flags/${lang.flag}`"
        :alt="`${lang.name} flag`"
      >

      <span class="language-selector-option__text">
        {{ lang.name }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SmallArrow } from '@components'
import { ref } from 'vue'
import { useLanguageStore } from '@/stores/language'
import type { SupportedLanguage } from '@/stores/language'

const languageStore = useLanguageStore()
const openOptions = ref(false)

const handleOpenOptions = () => {
  if (languageStore.isChanging) return
  
  openOptions.value = !openOptions.value
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
  if (!target.closest('.language-selector')) {
    openOptions.value = false
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>

<style scoped lang="scss">
.language-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px 10px;
  border-radius: 10px;
  gap: 20px;
  min-width: 160px;
  position: relative;
  transition: all 0.3s ease;

  &.changing {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(.changing) {
    color: var(--color-nav-text);
    line-height: 24px;
    text-decoration-line: underline;
  }

  &-lang {
    display: flex;
    align-items: center;
    gap: 10px;

    &__icon {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      object-fit: cover;
    }

    &__text {
      color: var(--color-nav-text);
      text-shadow: 0px 8px 16px 0px var(--color-nav-text-shadow);
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
  }

  &-arrow {
    width: 10px;
    height: 10px;
    transition: transform 0.3s ease;

    &.up {
      transform: rotate(180deg);
    }
  }

  &-wrapper {
    background-color: var(--color-background);
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 8px;
    padding: 8px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    width: 160px;
    box-shadow: var(--shadow-medium);
    border: 1px solid var(--color-border);
    z-index: 1000;
  }

  &-option {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--color-surface);
    }

    &.active {
      background-color: var(--color-primary);
      
      .language-selector-option__text {
        color: white;
        font-weight: 600;
      }
    }

    &__icon {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      object-fit: cover;
    }

    &__text {
      color: var(--color-text);
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
      transition: color 0.2s ease;
    }
  }
}

@media screen and (max-width: 820px) {
  .language-selector {
    display: none;
  }
}
</style>