<template>
  <AppSection
    section-id="hard-skills"
    background="primary"
    :title="t('home.hardSkillsSection.title')"
  >
    <div v-if="skills.length > 0" class="hard-skills-section__grid">
      <div v-for="skill in skills" :key="skill.id" class="hard-skills-section__skill-item">
        <h3 class="hard-skills-section__skill-name">{{ skill.name }}</h3>
        <span class="hard-skills-section__skill-category">{{ skill.category.name }}</span>
        <div
          class="hard-skills-section__skill-proficiency"
          :aria-label="`${skill.proficiency} out of 5`"
        >
          <span
            v-for="n in 5"
            :key="n"
            class="hard-skills-section__skill-dot"
            :class="{ 'hard-skills-section__skill-dot--filled': n <= skill.proficiency }"
          />
        </div>
      </div>
    </div>

    <div v-else class="hard-skills-section__empty">
      <div class="hard-skills-section__empty-icon">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L14.5 9.5H22L16 14L18 21.5L12 17L6 21.5L8 14L2 9.5H9.5L12 2Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3 class="hard-skills-section__empty-title">
        {{ t('home.hardSkillsSection.empty.title') }}
      </h3>
      <p class="hard-skills-section__empty-description">
        {{ t('home.hardSkillsSection.empty.description') }}
      </p>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import { useNavigationStore } from '@/stores/navigation'
import AppSection from '@/components/shared/AppSection.vue'

const { t } = useI18n()
const portfolioStore = usePortfolioStore()
const navigationStore = useNavigationStore()

const skills = computed(() => portfolioStore.skills)

onMounted(() => {
  const sectionElement = document.getElementById('hard-skills')
  if (sectionElement) {
    navigationStore.registerSection({
      id: 'hard-skills',
      label: t('navigation.skills'),
      order: 4,
      visible: true,
      element: sectionElement,
    })
  }
})
</script>

<style scoped lang="scss">
.hard-skills-section {
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  &__skill-item {
    background: var(--color-surface);
    border-radius: 12px;
    padding: 24px;
    border: 1px solid var(--color-border);
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      border-color: var(--color-primary);
    }
  }

  &__skill-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 4px 0;
  }

  &__skill-category {
    font-size: 14px;
    color: var(--color-text-secondary);
    display: block;
    margin-bottom: 12px;
  }

  &__skill-proficiency {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  &__skill-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-border);
    display: inline-block;

    &--filled {
      background: var(--color-primary);
    }
  }

  &__empty {
    text-align: center;
    padding: 80px 20px;
    color: var(--color-text-secondary);

    &-icon {
      margin-bottom: 24px;
      color: var(--color-border);

      svg {
        width: 64px;
        height: 64px;
      }
    }

    &-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--color-text);
      margin: 0 0 12px 0;
    }

    &-description {
      font-size: 16px;
      margin: 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}

@media (max-width: 1024px) {
  .hard-skills-section {
    &__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
  }
}

@media (max-width: 768px) {
  .hard-skills-section {
    &__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    &__skill-item {
      padding: 20px;
    }

    &__skill-name {
      font-size: 16px;
    }

    &__skill-category {
      font-size: 13px;
    }

    &__empty {
      padding: 60px 16px;

      &-icon svg {
        width: 48px;
        height: 48px;
      }

      &-title {
        font-size: 20px;
      }

      &-description {
        font-size: 14px;
      }
    }
  }
}

@media (max-width: 480px) {
  .hard-skills-section {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
