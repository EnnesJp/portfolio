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

        <div class="about-section-main__info--name" v-html="t('home.aboutSection.name')" />

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
        <img
          src="@assets/images/icons/linkedin.svg"
          alt="Linkedin"
          @click="goToSocialMedia(LINKEDIN_URL)"
        />
        <img
          src="@assets/images/icons/github.svg"
          alt="Github"
          @click="goToSocialMedia(GITHUB_URL)"
        />
      </div>

      <div class="about-section-bottom__scroll">
        <span>
          {{ t('common.scroll') }}
        </span>

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
const LINKEDIN_URL = 'https://www.linkedin.com/in/joao-pedro-ennes/'
const GITHUB_URL = 'https://github.com/EnnesJp'

const goToSocialMedia = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style scoped lang="scss">
.about-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &-main {
    display: flex;
    justify-content: space-between;
    gap: 71px;

    &__info {
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 60%;

      &--hello {
        display: flex;
        align-items: center;
        gap: 10px;

        &-dash {
          width: 30px;
          height: 3px;
          background-color: var(--color-text);
        }

        &-text {
          font-size: 30px;
          font-weight: 700;
        }
      }

      &--name {
        font-size: 60px;
        font-weight: 300;
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
      width: 380px;
      height: 500px;
    }
  }

  &-bottom {
    display: flex;
    margin-top: 56px;
    justify-content: center;
    width: 100%;
    position: relative;

    &__social-medias {
      display: flex;
      gap: 32px;
      position: absolute;
      left: 0;

      img {
        cursor: pointer;
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
        font-size: 14px;
        font-weight: 300;
      }
    }
  }
}
</style>
