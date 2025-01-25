<template>
    <div class="app-button">
        <button
            class="app-button__button"
            v-bind="attrs"
        >
            {{ label }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

type Props = {
    label: string;
};

defineProps<Props>();
const attrs = useAttrs();
</script>

<style scoped lang="scss">
.app-button {
    &__button {
        font-size: 14px;
        color: #333333;
        font-weight: 400;
        text-transform: uppercase;
        cursor: pointer;

        padding-top: 16px;
        padding-bottom: 16px;
        padding-left: 32px;
        padding-right: 32px;
    }
}
</style>