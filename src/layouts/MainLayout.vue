<template>
  <div class="container">
    <the-header />

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { TheHeader } from '@components'
import { RouterView } from 'vue-router'
</script>
