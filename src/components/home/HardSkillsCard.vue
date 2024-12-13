<template>
  <div class="hard-skills-card">
    <div class="hard-skills-card__info">
      <span class="hard-skills-card__info--title">
        {{ t(title) }}
      </span>

      <span class="hard-skills-card__info--description">
        {{ t(description) }}
      </span>
    </div>

    <div class="hard-skills-card__read-more">
      <span class="hard-skills-card__read-more--text">
        {{ t('common.readMore') }}
      </span>

      <arrow class="hard-skills-card__read-more--icon"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Arrow } from '@components'
import { useI18n } from 'vue-i18n'

type Props = {
  title: string
  description: string
  link: string
}

defineProps<Props>()
const { t } = useI18n()
</script>

<style scoped lang="scss">
.hard-skills-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30px;
  background-color: #D6D6D6;
  max-width: 250px;
  gap: 60px;
  min-height: 300px;

  &__info {
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

  &__read-more {
    display: flex;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;

    &--text {
      font-size: 12px;
      font-weight: 600;
      color: #333333;
    }

    &--icon {
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
</style>
