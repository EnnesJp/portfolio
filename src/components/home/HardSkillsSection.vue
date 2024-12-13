<template>
  <app-section
    class="hard-skills-section"
    :title="t('home.hardSkillsSection.title')"
  >
    <div class="hard-skills-section-cards">
      <div class="hard-skills-section-cards__item">
        <div class="hard-skills-section-cards__item-info">
          <span class="hard-skills-section-cards__item-info--title">
            {{ t('home.hardSkillsSection.skills.frontend.title') }}
          </span>

          <span class="hard-skills-section-cards__item-info--description">
            {{ t('home.hardSkillsSection.skills.frontend.description') }}
          </span>
        </div>

        <div class="hard-skills-section-cards__item--read-more">
          <span>
            Read more
          </span>

          <arrow/>
        </div>
      </div> 
    </div>

  </app-section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { AppSection, Arrow } from '@components'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.hard-skills-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &-cards {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 60px;

    &__item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding: 50px 30px;
      background-color: #D6D6D6;
      max-width: 250px;
      gap: 60px;

      &-info {
        display: flex;
        flex-direction: column;
        gap: 20px;

        &--title {
          font-size: 32px;
          color: #333333;
        }
  
        &--description {
          font-size: 12px;
          font-weight: 400;
          color: #333333;
        }
      }

      &--read-more {
        display: flex;
        justify-content: space-between;
        width: 100%;
        cursor: pointer;

        span {
          font-size: 12px;
          font-weight: 600;
          color: #333333;
        }

        svg {
          rotate: -90deg;
        }
      }

      &:hover {
        background-color: #333333;
        transition: background-color 250ms linear;

        span {
          color: #fff;
        }

        svg {
          fill: #fff;
        }
      }
    }
  }
}
</style>
