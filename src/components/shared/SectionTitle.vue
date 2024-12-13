<template>
    <div class="section-title">
        <span class="section-title__text">
            {{ title }}
        </span>
    </div>
</template>

<script setup lang="ts">
type Props = {
  title: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.section-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;

  &__text {
    font-size: 34px;
    font-weight: 500;
    color: #333333;
  }
}
</style>