<template>
  <section class="about-section" id="about">
    <div class="about-section-main">
      <div class="about-section-main__info">
        <div class="about-section-main__info--hello">
          <div class="about-section-main__info--hello-dash" />
          <span class="about-section-main__info--hello-text">
            {{ t('home.aboutSection.hello') }}
          </span>
        </div>

        <div
          class="about-section-main__info--name"
          v-html="personalInfo?.name ? t('home.aboutSection.name') : t('home.aboutSection.name')"
        />

        <span class="about-section-main__info--resume">
          {{ personalInfo?.title || t('home.aboutSection.resume') }}
        </span>

        <span class="about-section-main__info--learn-more">
          {{ t('home.aboutSection.scrollForMoreInfo') }}
        </span>
      </div>

      <div class="about-section-main__img">
        <LazyImage
          :src="personalInfo?.avatar || defaultAvatar"
          :alt="personalInfo?.name || 'Profile'"
          class="about-section-main__img--photo"
          :width="380"
          :height="500"
          object-fit="cover"
          :priority="true"
          :quality="90"
          placeholder-color="#f0f0f0"
        />
      </div>
    </div>

    <div class="about-section-journey" v-if="aboutData?.professionalJourney?.length">
      <h3 class="about-section-journey__title">{{ t('home.aboutSection.journey.title') }}</h3>
      <div class="about-section-journey__timeline">
        <div
          v-for="item in aboutData.professionalJourney"
          :key="item.id"
          class="about-section-journey__item"
          :class="`about-section-journey__item--${item.type}`"
        >
          <div class="about-section-journey__item-marker"></div>
          <div class="about-section-journey__item-content">
            <div class="about-section-journey__item-date">{{ item.date }}</div>
            <h4 class="about-section-journey__item-title">{{ item.title }}</h4>
            <p class="about-section-journey__item-description">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="about-section-values" v-if="aboutData?.values?.length">
      <h3 class="about-section-values__title">{{ t('home.aboutSection.values.title') }}</h3>
      <div class="about-section-values__grid">
        <div
          v-for="(value, index) in aboutData.values"
          :key="index"
          class="about-section-values__item"
        >
          <div class="about-section-values__item-icon">
            <div class="about-section-values__item-icon-circle"></div>
          </div>
          <span class="about-section-values__item-text">{{ value }}</span>
        </div>
      </div>
    </div>

    <div class="about-section-interests" v-if="aboutData?.interests?.length">
      <h3 class="about-section-interests__title">{{ t('home.aboutSection.interests.title') }}</h3>
      <div class="about-section-interests__tags">
        <span
          v-for="(interest, index) in aboutData.interests"
          :key="index"
          class="about-section-interests__tag"
        >
          {{ interest }}
        </span>
      </div>
    </div>

    <div class="about-section-bottom">
      <div class="about-section-bottom__social-medias">
        <LazyImage
          src="@assets/images/icons/linkedin.svg"
          alt="Linkedin"
          :width="24"
          :height="24"
          loading="lazy"
          @click="goToSocialMedia(LINKEDIN_URL)"
          class="social-icon"
        />
        <LazyImage
          src="@assets/images/icons/github.svg"
          alt="Github"
          :width="24"
          :height="24"
          loading="lazy"
          @click="goToSocialMedia(GITHUB_URL)"
          class="social-icon"
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
  </section>
</template>

<script setup lang="ts">
import { Arrow } from '@components'
import { LazyImage } from '@/components/ui'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import { useNavigationStore } from '@/stores/navigation'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const { t } = useI18n()
const portfolioStore = usePortfolioStore()
const navigationStore = useNavigationStore()

const { personalInfo, portfolioData } = storeToRefs(portfolioStore)

const aboutData = computed(() => portfolioData.value?.about)
const defaultAvatar = computed(() => new URL('@/assets/images/self-img.jpeg', import.meta.url).href)

const LINKEDIN_URL = 'https://www.linkedin.com/in/joao-pedro-ennes/'
const GITHUB_URL = 'https://github.com/EnnesJp'

const goToSocialMedia = (url: string) => {
  window.open(url, '_blank')
}

onMounted(() => {
  const sectionElement = document.getElementById('about')
  if (sectionElement) {
    navigationStore.registerSection({
      id: 'about',
      label: t('navigation.about'),
      order: 2,
      visible: true,
      element: sectionElement,
    })
  }
})
</script>

<style scoped lang="scss">
.about-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;

  &-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 71px;
    width: 100%;
    margin-bottom: 80px;

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
          background-color: var(--color-primary);
        }

        &-text {
          font-size: 30px;
          font-weight: 700;
          color: var(--color-text);
        }
      }

      &--name {
        font-size: 60px;
        font-weight: 300;
        color: var(--color-text);
        line-height: 1.1;
      }

      &--resume {
        font-size: 26px;
        font-weight: 400;
        color: var(--color-text-secondary);
        line-height: 1.4;
      }

      &--learn-more {
        font-size: 16px;
        font-weight: 400;
        color: var(--color-text-secondary);
        margin-top: 20px;
      }
    }

    &__img {
      position: relative;
      width: 380px;
      height: 500px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

      &--photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
  }

  &-journey {
    width: 100%;
    margin-bottom: 80px;

    &__title {
      font-size: 32px;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 40px;
      text-align: center;
    }

    &__timeline {
      position: relative;
      max-width: 800px;
      margin: 0 auto;

      &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--color-border);
        transform: translateX(-50%);
      }
    }

    &__item {
      position: relative;
      margin-bottom: 40px;
      display: flex;
      align-items: center;

      &:nth-child(odd) {
        flex-direction: row;

        .about-section-journey__item-content {
          margin-left: 60px;
          text-align: left;
        }
      }

      &:nth-child(even) {
        flex-direction: row-reverse;

        .about-section-journey__item-content {
          margin-right: 60px;
          text-align: right;
        }
      }

      &-marker {
        position: absolute;
        left: 50%;
        width: 16px;
        height: 16px;
        background: var(--color-primary);
        border: 3px solid var(--color-background);
        border-radius: 50%;
        transform: translateX(-50%);
        z-index: 2;
      }

      &--experience &-marker {
        background: var(--color-primary);
      }

      &--education &-marker {
        background: var(--color-secondary);
      }

      &--achievement &-marker {
        background: var(--color-accent);
      }

      &-content {
        flex: 1;
        max-width: 45%;
        background: var(--color-surface);
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &-date {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-primary);
        margin-bottom: 8px;
      }

      &-title {
        font-size: 20px;
        font-weight: 600;
        color: var(--color-text);
        margin-bottom: 8px;
      }

      &-description {
        font-size: 16px;
        color: var(--color-text-secondary);
        line-height: 1.5;
        margin: 0;
      }
    }
  }

  &-values {
    width: 100%;
    margin-bottom: 80px;

    &__title {
      font-size: 32px;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 40px;
      text-align: center;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
      max-width: 800px;
      margin: 0 auto;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: var(--color-surface);
      border-radius: 12px;
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }

      &-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;

        &-circle {
          width: 12px;
          height: 12px;
          background: var(--color-primary);
          border-radius: 50%;
        }
      }

      &-text {
        font-size: 18px;
        font-weight: 500;
        color: var(--color-text);
      }
    }
  }

  &-interests {
    width: 100%;
    margin-bottom: 80px;

    &__title {
      font-size: 32px;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 40px;
      text-align: center;
    }

    &__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      max-width: 800px;
      margin: 0 auto;
    }

    &__tag {
      padding: 12px 24px;
      background: var(--color-surface);
      color: var(--color-text);
      border: 2px solid var(--color-border);
      border-radius: 24px;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        background: var(--color-primary);
        color: var(--color-background);
        border-color: var(--color-primary);
        transform: translateY(-2px);
      }
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

      .social-icon {
        cursor: pointer;
        width: 24px;
        height: 24px;
        transition:
          transform 0.2s ease,
          opacity 0.2s ease;

        &:hover {
          transform: scale(1.2);
          opacity: 0.8;
        }
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
        color: var(--color-text-secondary);
      }
    }
  }
}

@media (max-width: 1024px) {
  .about-section {
    padding: 60px 20px;

    &-main {
      gap: 40px;
      margin-bottom: 60px;

      &__info {
        max-width: 55%;

        &--name {
          font-size: 48px;
        }

        &--resume {
          font-size: 22px;
        }
      }

      &__img {
        width: 320px;
        height: 420px;
      }
    }

    &-journey {
      margin-bottom: 60px;

      &__timeline::before {
        left: 30px;
      }

      &__item {
        &:nth-child(odd),
        &:nth-child(even) {
          flex-direction: row;

          .about-section-journey__item-content {
            margin-left: 60px;
            margin-right: 0;
            text-align: left;
          }
        }

        &-marker {
          left: 30px;
        }

        &-content {
          max-width: calc(100% - 80px);
        }
      }
    }

    &-values {
      margin-bottom: 60px;

      &__grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 24px;
      }
    }

    &-interests {
      margin-bottom: 60px;
    }
  }
}

@media (max-width: 768px) {
  .about-section {
    padding: 40px 16px;

    &-main {
      flex-direction: column;
      gap: 40px;
      margin-bottom: 40px;

      &__info {
        max-width: 100%;
        text-align: center;

        &--name {
          font-size: 36px;
        }

        &--resume {
          font-size: 18px;
        }

        &--hello-text {
          font-size: 24px;
        }
      }

      &__img {
        width: 280px;
        height: 350px;
      }
    }

    &-journey {
      margin-bottom: 40px;

      &__title {
        font-size: 28px;
        margin-bottom: 30px;
      }

      &__item-content {
        padding: 20px;
      }

      &__item-title {
        font-size: 18px;
      }

      &__item-description {
        font-size: 14px;
      }
    }

    &-values {
      margin-bottom: 40px;

      &__title {
        font-size: 28px;
        margin-bottom: 30px;
      }

      &__grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      &__item {
        padding: 20px;

        &-text {
          font-size: 16px;
        }
      }
    }

    &-interests {
      margin-bottom: 40px;

      &__title {
        font-size: 28px;
        margin-bottom: 30px;
      }

      &__tag {
        padding: 10px 20px;
        font-size: 14px;
      }
    }

    &-bottom {
      flex-direction: column;
      gap: 30px;

      &__social-medias {
        position: static;
        justify-content: center;
      }
    }
  }
}
</style>
