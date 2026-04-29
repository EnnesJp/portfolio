<template>
  <div>
    <the-header />
    <div class="header-spacer" />

    <RouterView />

    <the-footer />
  </div>
</template>

<script setup lang="ts">
import { TheHeader, TheFooter } from '@components'
import { RouterView } from 'vue-router'
</script>

<style scoped>
.header-spacer {
  height: var(--header-height, 64px);
}
</style>
