<template>
    <form class="contact-form">
        <div class="contact-form__fields">
            <app-input 
                v-model="formFields.name"
                :label="t('home.contactSection.fields.name')"
            />

            <app-input 
                v-model="formFields.email"
                :label="t('home.contactSection.fields.email')"
            />

            <app-input 
                v-model="formFields.budget"
                :label="t('home.contactSection.fields.budget')"
            />

            <app-input 
                v-model="formFields.description"
                :label="t('home.contactSection.fields.description')"
            />
        </div>

        <div class="contact-form__button">
            <app-button
                :label="t('home.contactSection.fields.send')"
                type="submit"    
            />
        </div>
    </form>
</template>

<script setup lang="ts">
import { AppButton, AppInput } from '@components';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const formFields = reactive({
    name: '',
    email: '',
    budget: '',
    description: ''
});
</script>

<style scoped lang="scss">
.contact-form {
    display: flex;
    flex-direction: column;
    background-color: #333333;
    
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 60px;
    padding-bottom: 60px;

    min-width: 450px;

    &__fields {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    &__button {
        display: flex;
        justify-content: end;
    }
}
</style>