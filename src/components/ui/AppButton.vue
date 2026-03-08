<template>
    <div class="app-button">
        <button
            class="app-button__button"
            :class="{ 
                'app-button__button--loading': loading,
                'app-button__button--disabled': disabled 
            }"
            :disabled="disabled || loading"
            v-bind="filteredAttrs"
        >
            <span v-if="loading" class="app-button__spinner"></span>
            <span :class="{ 'app-button__text--loading': loading }">{{ label }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

interface Props {
    label: string
    loading?: boolean
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    disabled: false
})

const attrs = useAttrs()

const filteredAttrs = computed(() => {
    const { loading, disabled, ...rest } = attrs
    return rest
})
</script>

<style scoped lang="scss">
.app-button {
    &__button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        
        font-size: 0.875rem;
        color: var(--color-text);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        cursor: pointer;
        
        padding: 1rem 2rem;
        background: var(--color-primary);
        color: white;
        border: 2px solid var(--color-primary);
        border-radius: 0.5rem;
        
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
            background: transparent;
            color: var(--color-primary);
            transform: translateY(-2px);
            box-shadow: var(--shadow-medium);
        }

        &:active:not(:disabled) {
            transform: translateY(0);
        }

        &--loading {
            cursor: not-allowed;
            
            .app-button__text--loading {
                opacity: 0.7;
            }
        }

        &--disabled,
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
        }
    }

    &__spinner {
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    &__text--loading {
        transition: opacity 0.2s ease;
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>