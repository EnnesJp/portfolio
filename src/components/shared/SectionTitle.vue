<template>
  <div class="section-title">
    <h2 class="section-title__text">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="section-title__subtitle">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface SectionTitleProps {
  title: string
  subtitle?: string
}

defineProps<SectionTitleProps>()
</script>

<style scoped lang="scss">
.section-title {
  text-align: center;
  margin-bottom: 60px;

  &__text {
    font-size: 48px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 16px 0;
  }

  &__subtitle {
    font-size: 20px;
    color: var(--color-text-secondary);
    margin: 0;
  }
}

@media (max-width: 1024px) {
  .section-title {
    &__text {
      font-size: 40px;
    }
  }
}

@media (max-width: 768px) {
  .section-title {
    &__text {
      font-size: 32px;
    }
  }
}
</style>
