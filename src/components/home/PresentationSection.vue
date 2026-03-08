<template>
  <section class="presentation-section" id="presentation">
    <div class="presentation-section__background">
      <div class="presentation-section__background-gradient"></div>
      <div class="presentation-section__background-particles">
        <div 
          v-for="i in 20" 
          :key="i" 
          class="presentation-section__background-particle"
          :style="{ 
            '--delay': `${i * 0.2}s`,
            '--duration': `${3 + (i % 3)}s`,
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`
          }"
        ></div>
      </div>
    </div>

    <div class="presentation-section__content">
      <div class="presentation-section__main">
        <div class="presentation-section__text">
          <div class="presentation-section__greeting">
            <div class="presentation-section__greeting-line"></div>
            <span class="presentation-section__greeting-text">
              {{ t('home.presentationSection.greeting') }}
            </span>
          </div>

          <h1 class="presentation-section__name">
            <span 
              ref="nameElement"
              class="presentation-section__name-text"
            >
              {{ presentationData?.name || t('home.presentationSection.name') }}
            </span>
            <span class="presentation-section__name-cursor" :class="{ 'blinking': isTypingComplete }">|</span>
          </h1>

          <h2 class="presentation-section__title">
            {{ presentationData?.title || t('home.presentationSection.title') }}
          </h2>

          <p class="presentation-section__summary">
            {{ presentationData?.summary || t('home.presentationSection.summary') }}
          </p>

          <div class="presentation-section__cta">
            <button 
              class="presentation-section__cta-button presentation-section__cta-button--primary"
              @click="scrollToSection('projects')"
            >
              {{ t('home.presentationSection.cta.viewWork') }}
            </button>
            <button 
              class="presentation-section__cta-button presentation-section__cta-button--secondary"
              @click="scrollToSection('contact')"
            >
              {{ t('home.presentationSection.cta.getInTouch') }}
            </button>
          </div>
        </div>

        <div class="presentation-section__image">
          <div class="presentation-section__image-container">
            <img 
              :src="personalInfo?.avatar || defaultAvatar" 
              :alt="personalInfo?.name || 'Profile'"
              class="presentation-section__image-photo"
            />
            <div class="presentation-section__image-glow"></div>
          </div>
        </div>
      </div>

      <div class="presentation-section__scroll">
        <div class="presentation-section__scroll-indicator">
          <span class="presentation-section__scroll-text">{{ t('common.scroll') }}</span>
          <div class="presentation-section__scroll-arrow">
            <arrow />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Arrow } from '@components'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import { useNavigationStore } from '@/stores/navigation'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'

const { t } = useI18n()
const portfolioStore = usePortfolioStore()
const navigationStore = useNavigationStore()

const { personalInfo, portfolioData } = storeToRefs(portfolioStore)

const nameElement = ref<HTMLElement>()
const isTypingComplete = ref(false)

const presentationData = computed(() => portfolioData.value?.presentation)
const defaultAvatar = computed(() => new URL('@/assets/images/self-img.jpeg', import.meta.url).href)

const scrollToSection = (sectionId: string) => {
  navigationStore.scrollToSection(sectionId)
}

const startTypingAnimation = async () => {
  await nextTick()
  if (!nameElement.value) return

  const text = nameElement.value.textContent || ''
  nameElement.value.textContent = ''
  
  let i = 0
  const typeInterval = setInterval(() => {
    if (i < text.length) {
      nameElement.value!.textContent += text.charAt(i)
      i++
    } else {
      clearInterval(typeInterval)
      isTypingComplete.value = true
    }
  }, 100)
}

onMounted(() => {
  const sectionElement = document.getElementById('presentation')
  if (sectionElement) {
    navigationStore.registerSection({
      id: 'presentation',
      label: t('navigation.presentation'),
      order: 1,
      visible: true,
      element: sectionElement
    })
  }

  setTimeout(startTypingAnimation, 500)
})
</script>

<style scoped lang="scss">
.presentation-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-background);

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;

    &-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(
        ellipse at center,
        rgba(59, 130, 246, 0.1) 0%,
        rgba(59, 130, 246, 0.05) 50%,
        transparent 100%
      );
    }

    &-particles {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    &-particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--color-primary);
      border-radius: 50%;
      opacity: 0.3;
      left: var(--x);
      top: var(--y);
      animation: float var(--duration) ease-in-out infinite var(--delay);

      &:nth-child(3n) {
        background: var(--color-accent);
      }

      &:nth-child(5n) {
        background: var(--color-secondary);
      }
    }
  }

  &__content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
  }

  &__main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 80px;
    width: 100%;
  }

  &__text {
    flex: 1;
    max-width: 600px;
  }

  &__greeting {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    opacity: 0;
    animation: slideInLeft 0.8s ease-out 0.2s forwards;

    &-line {
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      border-radius: 2px;
    }

    &-text {
      font-size: 18px;
      font-weight: 500;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }

  &__name {
    font-size: 72px;
    font-weight: 700;
    color: var(--color-text);
    line-height: 1.1;
    margin: 0 0 16px 0;
    opacity: 0;
    animation: slideInLeft 0.8s ease-out 0.4s forwards;

    &-text {
      background: linear-gradient(135deg, var(--color-text), var(--color-primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    &-cursor {
      color: var(--color-primary);
      animation: blink 1s infinite;

      &.blinking {
        animation: blink 1s infinite;
      }
    }
  }

  &__title {
    font-size: 32px;
    font-weight: 400;
    color: var(--color-primary);
    margin: 0 0 32px 0;
    opacity: 0;
    animation: slideInLeft 0.8s ease-out 0.6s forwards;
  }

  &__summary {
    font-size: 20px;
    font-weight: 400;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0 0 48px 0;
    opacity: 0;
    animation: slideInLeft 0.8s ease-out 0.8s forwards;
  }

  &__cta {
    display: flex;
    gap: 24px;
    opacity: 0;
    animation: slideInLeft 0.8s ease-out 1s forwards;

    &-button {
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;

      &--primary {
        background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
        color: white;
        border: 2px solid transparent;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
        }
      }

      &--secondary {
        background: transparent;
        color: var(--color-text);
        border: 2px solid var(--color-border);

        &:hover {
          background: var(--color-surface);
          border-color: var(--color-primary);
          transform: translateY(-2px);
        }
      }
    }
  }

  &__image {
    flex-shrink: 0;
    opacity: 0;
    animation: slideInRight 0.8s ease-out 0.6s forwards;

    &-container {
      position: relative;
      width: 400px;
      height: 500px;
      border-radius: 20px;
      overflow: hidden;
    }

    &-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 20px;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    &-glow {
      position: absolute;
      top: -20px;
      left: -20px;
      right: -20px;
      bottom: -20px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      border-radius: 30px;
      z-index: -1;
      opacity: 0.2;
      filter: blur(20px);
      animation: pulse 3s ease-in-out infinite;
    }
  }

  &__scroll {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    animation: fadeIn 0.8s ease-out 1.2s forwards;

    &-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-4px);
      }
    }

    &-text {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    &-arrow {
      animation: bounce 2s infinite;
    }
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.05);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@media (max-width: 1024px) {
  .presentation-section {
    &__main {
      gap: 60px;
    }

    &__name {
      font-size: 60px;
    }

    &__title {
      font-size: 28px;
    }

    &__summary {
      font-size: 18px;
    }

    &__image {
      &-container {
        width: 350px;
        height: 450px;
      }
    }
  }
}

@media (max-width: 768px) {
  .presentation-section {
    &__content {
      padding: 0 20px;
    }

    &__main {
      flex-direction: column;
      gap: 60px;
      text-align: center;
    }

    &__text {
      max-width: 100%;
    }

    &__name {
      font-size: 48px;
    }

    &__title {
      font-size: 24px;
    }

    &__summary {
      font-size: 16px;
    }

    &__cta {
      justify-content: center;
      flex-wrap: wrap;

      &-button {
        padding: 14px 28px;
        font-size: 14px;
      }
    }

    &__image {
      &-container {
        width: 300px;
        height: 380px;
      }
    }
  }
}

@media (max-width: 480px) {
  .presentation-section {
    &__content {
      padding: 0 16px;
    }

    &__name {
      font-size: 36px;
    }

    &__title {
      font-size: 20px;
    }

    &__summary {
      font-size: 14px;
      margin-bottom: 32px;
    }

    &__cta {
      gap: 16px;

      &-button {
        padding: 12px 24px;
        font-size: 13px;
        flex: 1;
        min-width: 140px;
      }
    }

    &__image {
      &-container {
        width: 250px;
        height: 320px;
      }
    }

    &__greeting {
      &-line {
        width: 40px;
      }

      &-text {
        font-size: 14px;
      }
    }
  }
}
</style>