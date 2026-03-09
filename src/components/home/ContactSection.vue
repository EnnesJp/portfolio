<template>
  <section class="contact-section-wrapper" id="contact">
    <div class="contact-section-wrapper__container">
      <div class="contact-section-wrapper__header">
        <h2 class="contact-section-wrapper__title">
          {{ t('home.contactSection.title') }}
        </h2>
      </div>

      <div class="contact-section">
        <div class="contact-section__info">
          <div class="contact-section__description">
            <p class="description-text">
              {{ t('home.contactSection.description') }}
            </p>

            <div class="availability-status">
              <div class="status-indicator" :class="availabilityClass"></div>
              <span class="status-text">{{ availabilityText }}</span>
            </div>
          </div>

          <div class="contact-methods">
            <h3 class="contact-methods__title">
              {{ t('home.contactSection.contactMethods.title') }}
            </h3>

            <div class="contact-methods__list">
              <div v-for="method in contactMethods" :key="method.id" class="contact-method">
                <div class="contact-method__icon">
                  <component :is="getIconComponent(method.type)" />
                </div>
                <div class="contact-method__content">
                  <span class="contact-method__label">{{ method.label }}</span>
                  <a
                    :href="getContactLink(method)"
                    class="contact-method__value"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ method.value }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="social-links" v-if="socialLinks.length > 0">
            <h3 class="social-links__title">{{ t('home.contactSection.socialLinks.title') }}</h3>

            <div class="social-links__list">
              <a
                v-for="link in socialLinks"
                :key="link.id"
                :href="link.url"
                class="social-link"
                target="_blank"
                rel="noopener noreferrer"
                :title="link.platform"
              >
                <component :is="getSocialIconComponent(link.platform)" />
                <span class="social-link__label">{{ link.platform }}</span>
              </a>
            </div>
          </div>

          <div class="location-info">
            <div class="location-info__item">
              <div class="location-info__icon">
                <LocationIcon />
              </div>
              <span class="location-info__text">
                {{ t('home.contactSection.socialInfos.location') }}
              </span>
            </div>
          </div>
        </div>

        <div class="contact-section__form">
          <contact-form />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ContactForm } from '@components'
import { usePortfolioStore } from '@/stores/portfolio'

const { t } = useI18n()
const portfolioStore = usePortfolioStore()

const contactData = computed(() => portfolioStore.portfolioData?.contact)
const contactMethods = computed(
  () => contactData.value?.contactMethods || defaultContactMethods.value,
)
const socialLinks = computed(() => contactData.value?.socialLinks || defaultSocialLinks.value)
const availability = computed(() => contactData.value?.availability || 'available')

const defaultContactMethods = computed(() => [
  {
    id: 'email',
    type: 'email' as const,
    label: t('home.contactSection.contactMethods.email'),
    value: import.meta.env.VITE_CONTACT_EMAIL || 'contact@portfolio.com',
  },
  {
    id: 'phone',
    type: 'phone' as const,
    label: t('home.contactSection.contactMethods.phone'),
    value: import.meta.env.VITE_CONTACT_PHONE || '+55 (31) 99999-9999',
  },
])

const defaultSocialLinks = computed(() => [
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/joaopedroennes',
  },
  {
    id: 'github',
    platform: 'GitHub',
    url: 'https://github.com/joaopedroennes',
  },
])

const availabilityClass = computed(() => {
  switch (availability.value) {
    case 'available':
      return 'available'
    case 'busy':
      return 'busy'
    case 'unavailable':
      return 'unavailable'
    default:
      return 'available'
  }
})

const availabilityText = computed(() => {
  switch (availability.value) {
    case 'available':
      return t('home.contactSection.availability.available')
    case 'busy':
      return t('home.contactSection.availability.busy')
    case 'unavailable':
      return t('home.contactSection.availability.unavailable')
    default:
      return t('home.contactSection.availability.available')
  }
})

const getContactLink = (method: any) => {
  switch (method.type) {
    case 'email':
      return `mailto:${method.value}`
    case 'phone':
      return `tel:${method.value}`
    default:
      return method.value
  }
}

const getIconComponent = (type: string) => {
  switch (type) {
    case 'email':
      return EmailIcon
    case 'phone':
      return PhoneIcon
    default:
      return EmailIcon
  }
}

const getSocialIconComponent = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return LinkedInIcon
    case 'github':
      return GitHubIcon
    case 'twitter':
      return TwitterIcon
    default:
      return LinkIcon
  }
}

const EmailIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
    </svg>`,
}

const PhoneIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
    </svg>`,
}

const LocationIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
    </svg>`,
}

const LinkedInIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
    </svg>`,
}

const GitHubIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"/>
    </svg>`,
}

const TwitterIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
    </svg>`,
}

const LinkIcon = {
  template: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/>
    </svg>`,
}
</script>

<style scoped lang="scss">
.contact-section-wrapper {
  padding: 80px 24px;
  background: var(--color-background);

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: 60px;
  }

  &__title {
    font-size: 48px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 16px 0;
  }
}

.contact-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  width: 100%;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__description {
    .description-text {
      font-size: 1.25rem;
      font-weight: 300;
      color: var(--color-text);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
  }

  &__form {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
}

.availability-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-surface);
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);

  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;

    &.available {
      background-color: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }

    &.busy {
      background-color: #f59e0b;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
    }

    &.unavailable {
      background-color: #ef4444;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
    }
  }

  .status-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }
}

.contact-methods {
  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 1rem;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-surface);
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--color-primary);
    color: white;
    border-radius: 0.5rem;
    flex-shrink: 0;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  &__value {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-primary);
    }
  }
}

.social-links {
  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 1rem;
  }

  &__list {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  &__label {
    @media (max-width: 480px) {
      display: none;
    }
  }
}

.location-info {
  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--color-surface);
    border-radius: 0.75rem;
    border: 1px solid var(--color-border);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: var(--color-primary);
    flex-shrink: 0;
  }

  &__text {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
}

@media (max-width: 1024px) {
  .contact-section-wrapper {
    padding: 60px 20px;

    &__title {
      font-size: 40px;
    }
  }
}

@media (max-width: 768px) {
  .contact-section-wrapper {
    padding: 40px 16px;

    &__title {
      font-size: 32px;
    }
  }

  .contact-section {
    &__info {
      order: 2;
    }

    &__form {
      order: 1;
    }
  }

  .social-links__list {
    justify-content: center;
  }
}
</style>
