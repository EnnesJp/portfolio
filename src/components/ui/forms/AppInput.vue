<template>
    <div class="app-input">
        <input
            ref="inputRef"
            v-model="modelValue"
            v-bind="attrs"
            class="app-input__input"
            :class="{ 'app-input__input--filled': modelValue }"
        >
            <label class="app-input__label">
                {{ label }}
            </label>
        </input> 
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';

type Props = {
    modelValue: any;
    label: string;
};

const props = defineProps<Props>();

const emit = defineEmits(['update:modelValue']);
const attrs = useAttrs();
const inputRef = ref(null);

defineExpose({
    inputRef
})

const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});
</script>

<style scoped lang="scss">
.app-input {
    display: flex;
    flex-direction: column-reverse;
    margin-bottom: 20px;

    position: relative;

    &__label {
        font-size: 14px;
        color: #FFF;
        
        position: absolute;
        top: 0;
        transform: translateY(50%);
        z-index: 1;
    }

    &__input {
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: transparent;
        
        border: none;
        border-bottom: 1px solid #FFF;

        font-family: "Rubik", sans-serif;
        color: #FFF;

        z-index: 2;

        &:focus {
            outline: none;
        }
    }

    &__input--filled + &__label,
    &__input:focus + &__label {
        transition: 0.5s;
        transform: translateY(-35%);
        font-size: 10px;
    }
}
</style>