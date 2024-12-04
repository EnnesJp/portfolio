<template>
  <div
    class="language-selector"
    @click="handleOpenOptions"
  >
    <div class="language-selector-lang">
      <img
        class="language-selector-lang__icon"
        :src="`src/assets/images/langs/${locale}.png`"
        alt="flag"
      >
      
      <span class="language-selector-lang__text">
        {{ t(`lang.${locale}`) }}
      </span>
    </div>
    <!-- <Arrow class="language-selector-arrow"/> -->
  </div>

  <div
    class="language-selector-wrapper"
    v-if="openOptions"
  >
    <div
      class="language-selector-option"
      v-for="(lang, index) in langs"
      :key="index"
      @click="changeLang(lang)"
    >
      <img
        class="language-selector-option__icon"
        :src="`src/assets/images/langs/${lang}.png`"
        alt="flag"
      >

      <span class="language-selector-option__text">
        {{ t(`lang.${lang}`) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const openOptions = ref(false)
const langs = ref(['en', 'pt'])

const handleOpenOptions = () => {
  // const arrow = document.querySelector('.language-selector-arrow')
  // arrow.classList.toggle('up')
  openOptions.value = !openOptions.value
}

const changeLang = (lang) => {
  locale.value = lang
  handleOpenOptions()
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

  &:hover {
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
    transition: .5s;
  }

  &-wrapper {
    background-color: var(--color-background-soft);
    position: absolute;
    right: 0;
    padding: 5px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    transform: translateY(80%);
    width: 160px;
  }

  &-option {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 5px 15px;
    border-radius: 10px;

    &:hover {
      background-color: var(--color-background-hover);
    }

    &__icon {
      width: 20px;
      height: 20px;
    }

    &__text {
      color: var(--color-text);
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
  }
}

@media screen and (max-width: 820px) {
  .language-selector {
    display: none;
  }
}
</style>