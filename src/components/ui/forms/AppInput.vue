<template>
    <div class="app-input" :class="{ 'app-input--error': error }">
        <textarea
            v-if="type === 'textarea'"
            ref="inputRef"
            v-model="modelValue"
            v-bind="filteredAttrs"
            class="app-input__textarea"
            :class="{ 'app-input__textarea--filled': modelValue }"
            :rows="rows"
        />
        <input
            v-else
            ref="inputRef"
            v-model="modelValue"
            v-bind="filteredAttrs"
            class="app-input__input"
            :class="{ 'app-input__input--filled': modelValue }"
            :type="type"
        />
        <label class="app-input__label" :class="{ 'app-input__label--required': required }">
            {{ label }}
            <span v-if="required" class="app-input__required">*</span>
        </label>
        <div v-if="error" class="app-input__error">
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

interface Props {
    modelValue: any
    label: string
    error?: string
    required?: boolean
    type?: string
    rows?: number
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    rows: 3,
    required: false
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
const inputRef = ref(null)

const filteredAttrs = computed(() => {
    const { error, required, type, rows, ...rest } = attrs
    return rest
})

defineExpose({
    inputRef
})

const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
</script>

<style scoped lang="scss">
.app-input {
    display: flex;
    flex-direction: column;
    position: relative;
    margin-bottom: 1.5rem;

    &--error {
        .app-input__input,
        .app-input__textarea {
            border-color: #ef4444;
        }

        .app-input__label {
            color: #ef4444;
        }
    }

    &__label {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        font-weight: 500;
        margin-bottom: 0.5rem;
        transition: color 0.2s ease;

        &--required {
            color: var(--color-text);
        }
    }

    &__required {
        color: #ef4444;
        margin-left: 0.25rem;
    }

    &__input,
    &__textarea {
        padding: 0.75rem 1rem;
        background-color: var(--color-background);
        border: 2px solid var(--color-border);
        border-radius: 0.5rem;
        font-family: inherit;
        font-size: 1rem;
        color: var(--color-text);
        transition: all 0.2s ease;
        resize: none;

        &:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
        }

        &::placeholder {
            color: var(--color-text-secondary);
        }
    }

    &__textarea {
        min-height: 100px;
        resize: vertical;
    }

    &__error {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #ef4444;
        font-weight: 500;
    }
}

@media (prefers-color-scheme: dark) {
    .app-input {
        &__input,
        &__textarea {
            background-color: var(--color-surface);
        }
    }
}
</style>