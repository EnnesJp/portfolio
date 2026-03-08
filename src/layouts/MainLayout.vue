<template>
  <div>
    <the-header />

    <RouterView />

    <the-footer />
  </div>
</template>

<script setup lang="ts">
import { TheHeader, TheFooter } from '@components'
import { RouterView } from 'vue-router'
</script>
