<template>
  <footer class="footer">
    <div class="footer__content">
      <div class="footer__main">
        <div class="footer__section">
          <h3 class="footer__section-title">{{ t('footer.contact.title') }}</h3>
          <div class="footer__contact">
            <div 
              v-for="method in contactMethods" 
              :key="method.id"
              class="footer__contact-item"
            >
              <Email 
                v-if="method.type === 'email'"
                class="footer__contact-icon"
              />
              <Phone 
                v-else-if="method.type === 'phone'"
                class="footer__contact-icon"
              />
              <span class="footer__contact-text">{{ method.value }}</span>
            </div>
          </div>
        </div>

        <div class="footer__section">
          <h3 class="footer__section-title">{{ t('footer.social.title') }}</h3>
          <div class="footer__social">
            <a 
              v-for="link in socialLinks" 
              :key="link.id"
              :href="link.url"
              :aria-label="`${t('footer.social.visitProfile')} ${link.platform}`"
              class="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub 
                v-if="link.platform.toLowerCase() === 'github'"
                class="footer__social-icon"
              />
              <LinkedIn 
                v-else-if="link.platform.toLowerCase() === 'linkedin'"
                class="footer__social-icon"
              />
            </a>
          </div>
        </div>

        <div class="footer__section">
          <h3 class="footer__section-title">{{ t('footer.navigation.title') }}</h3>
          <nav class="footer__nav">
            <button 
              v-for="section in visibleSections" 
              :key="section.id"
              @click="scrollToSection(section.id)"
              class="footer__nav-link"
              :class="{ 'footer__nav-link--active': section.id === currentSection }"
            >
              {{ section.label }}
            </button>
          </nav>
        </div>

        <div class="footer__section">
          <h3 class="footer__section-title">{{ t('footer.availability.title') }}</h3>
          <div class="footer__availability">
            <div 
              class="footer__availability-status"
              :class="`footer__availability-status--${availability}`"
            >
              <div class="footer__availability-indicator"></div>
              <span class="footer__availability-text">
                {{ t(`footer.availability.status.${availability}`) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <div class="footer__copyright">
          <p>{{ t('footer.copyright', { year: currentYear, name: personalInfo?.name }) }}</p>
        </div>

        <button 
          @click="scrollToTop"
          class="footer__back-to-top"
          :aria-label="t('footer.backToTop')"
        >
          <Arrow class="footer__back-to-top-icon" />
          <span class="footer__back-to-top-text">{{ t('footer.backToTop') }}</span>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import { useNavigationStore } from '@/stores/navigation'
import { storeToRefs } from 'pinia'
import { Arrow, Email, Phone, GitHub, LinkedIn } from '@components'

const { t } = useI18n()
const portfolioStore = usePortfolioStore()
const navigationStore = useNavigationStore()

const { personalInfo, portfolioData } = storeToRefs(portfolioStore)
const { currentSection, visibleSections } = storeToRefs(navigationStore)

const contactData = computed(() => portfolioData.value?.contact)
const contactMethods = computed(() => contactData.value?.contactMethods || [])
const socialLinks = computed(() => contactData.value?.socialLinks || [])
const availability = computed(() => contactData.value?.availability || 'available')
const currentYear = computed(() => new Date().getFullYear())

const scrollToSection = (sectionId: string) => {
  navigationStore.scrollToSection(sectionId)
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped lang="scss">
.footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  margin-top: 80px;

  &__content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 24px 24px;
  }

  &__main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-bottom: 40px;
  }

  &__section {
    &-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  &__contact {
    display: flex;
    flex-direction: column;
    gap: 12px;

    &-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--color-text-secondary);
      transition: color 0.3s ease;

      &:hover {
        color: var(--color-primary);
      }
    }

    &-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    &-text {
      font-size: 14px;
    }
  }

  &__social {
    display: flex;
    gap: 16px;

    &-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
        transform: translateY(-2px);
      }
    }

    &-icon {
      width: 20px;
      height: 20px;
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &-link {
      background: none;
      border: none;
      padding: 8px 0;
      text-align: left;
      font-size: 14px;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: color 0.3s ease;
      text-transform: capitalize;

      &:hover {
        color: var(--color-primary);
      }

      &--active {
        color: var(--color-primary);
        font-weight: 500;
      }
    }
  }

  &__availability {
    &-status {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: 8px;

      &--available {
        border-color: var(--color-success);
        
        .footer__availability-indicator {
          background: var(--color-success);
        }
      }

      &--busy {
        border-color: var(--color-warning);
        
        .footer__availability-indicator {
          background: var(--color-warning);
        }
      }

      &--unavailable {
        border-color: var(--color-error);
        
        .footer__availability-indicator {
          background: var(--color-error);
        }
      }
    }

    &-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    &-text {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text);
    }
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
  }

  &__copyright {
    p {
      font-size: 14px;
      color: var(--color-text-secondary);
      margin: 0;
    }
  }

  &__back-to-top {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: 1px solid var(--color-border);
    padding: 12px 20px;
    border-radius: 8px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
      transform: translateY(-2px);
    }

    &-icon {
      width: 16px;
      height: 16px;
      transform: rotate(-90deg);
    }

    &-text {
      font-size: 14px;
      font-weight: 500;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .footer {
    &__content {
      padding: 40px 20px 20px;
    }

    &__main {
      grid-template-columns: 1fr;
      gap: 32px;
      margin-bottom: 32px;
    }

    &__bottom {
      flex-direction: column;
      gap: 20px;
      text-align: center;
    }

    &__social {
      justify-content: center;
    }
  }
}

@media (max-width: 480px) {
  .footer {
    &__content {
      padding: 32px 16px 16px;
    }

    &__main {
      gap: 24px;
      margin-bottom: 24px;
    }

    &__social {
      &-link {
        width: 40px;
        height: 40px;
      }
    }

    &__back-to-top {
      padding: 10px 16px;
      
      &-text {
        font-size: 13px;
      }
    }
  }
}
</style>