<template>
  <section class="hard-skills-section" id="hard-skills">
    <div class="hard-skills-section__container">
      <div class="hard-skills-section__header">
        <h2 class="hard-skills-section__title">
          {{ t('home.hardSkillsSection.title') }}
        </h2>
      </div>

      <div v-if="skills.length > 0" class="hard-skills-section__grid">
        <div v-for="skill in skills" :key="skill.id" class="skill-item">
          <h3 class="skill-item__name">{{ skill.name }}</h3>
          <span class="skill-item__category">{{ skill.category.name }}</span>
          <div class="skill-item__proficiency" :aria-label="`${skill.proficiency} out of 5`">
            <span
              v-for="n in 5"
              :key="n"
              class="skill-item__dot"
              :class="{ 'skill-item__dot--filled': n <= skill.proficiency }"
            />
          </div>
        </div>
      </div>

      <div v-else class="hard-skills-section__empty">
        <p>{{ t('home.hardSkillsSection.noSkills') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'

const { t } = useI18n()
const portfolioStore = usePortfolioStore()

const skills = computed(() => portfolioStore.skills)
</script>

<style scoped lang="scss">
.hard-skills-section {
  padding: 80px 24px;
  background: var(--color-surface);

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
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  &__empty {
    text-align: center;
    padding: 80px 20px;
    color: var(--color-text-secondary);

    p {
      font-size: 16px;
      margin: 0;
    }
  }
}

.skill-item {
  background: var(--color-background);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--color-border);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-surface);
  }

  &__name {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 4px 0;
  }

  &__category {
    font-size: 14px;
    color: var(--color-text-secondary);
    display: block;
    margin-bottom: 12px;
  }

  &__proficiency {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-border);
    display: inline-block;

    &--filled {
      background: var(--color-primary);
    }
  }
}

@media (max-width: 1024px) {
  .hard-skills-section {
    padding: 60px 20px;

    &__title {
      font-size: 40px;
    }

    &__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
  }
}

@media (max-width: 768px) {
  .hard-skills-section {
    padding: 40px 16px;

    &__title {
      font-size: 32px;
    }

    &__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    &__empty {
      padding: 60px 16px;

      p {
        font-size: 14px;
      }
    }
  }

  .skill-item {
    padding: 20px;

    &__name {
      font-size: 16px;
    }

    &__category {
      font-size: 13px;
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
