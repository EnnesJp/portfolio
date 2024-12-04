<template>
  <div class="about-section">
    <div class="about-section-main">
      <div class="about-section-main__info">
        <div class="about-section-main__info--hello">
          <div class="about-section-main__info--hello-dash" />

          <span class="about-section-main__info--hello-text">
            {{ t('home.aboutSection.hello') }}
          </span>
        </div>

        <span class="about-section-main__info--name" v-html="t('home.aboutSection.name')" />

        <span class="about-section-main__info--resume">
          {{ t('home.aboutSection.resume') }}
        </span>

        <span class="about-section-main__info--learn-more">
          {{ t('home.aboutSection.scrollForMoreInfo') }}
        </span>
      </div>

      <div class="about-section-main__img" />
    </div>

    <div class="about-section-bottom">
      <div class="about-section-bottom__social-medias">
        <img src="@assets/images/icons/linkedin.svg" alt="Linkedin" />
      </div>

      <div class="about-section-bottom__scroll">
        <span>SCROLL</span>

        <arrow />
      </div>

      <div />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Arrow } from '@components'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.about-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &-main {
    display: flex;
    justify-content: center;
    gap: 71px;

    &__info {
      display: flex;
      flex-direction: column;
      gap: 20px;

      &--hello {
        display: flex;
        align-items: center;
        gap: 10px;

        &-dash {
          width: 25px;
          height: 3px;
          background-color: var(--color-text);
        }

        &-text {
          font-size: 24px;
          font-weight: 700;
        }
      }

      &--name {
        font-size: 54px;
        font-weight: 400;

        &-highlight {
          font-weight: 500;
        }
      }

      &--resume {
        font-size: 26px;
        font-weight: 400;
      }

      &--learn-more {
        font-size: 16px;
        font-weight: 400;
      }
    }

    &__img {
      background-image: url('@assets/images/self-img.jpeg');
      background-position: bottom center;
      background-size: cover;
      width: 650px;
      height: 500px;
    }
  }

  &-bottom {
    display: flex;
    margin-top: 56px;
    justify-content: space-between;
    width: 100%;

    &__social-medias {
      display: flex;
      gap: 32px;

      img {
        width: 20px;
        height: 20px;
      }
    }

    &__scroll {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      span {
        font-size: 18px;
        font-weight: 300;
      }
    }
  }
}
</style>
