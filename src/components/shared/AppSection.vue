<template>
    <div class="section">
        <section-title :title="title" />

        <slot />
    </div>
</template>

<script setup lang="ts">
import { SectionTitle } from '@components'

type Props = {
    title: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 140px auto;
}
</style>