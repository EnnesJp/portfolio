<template>
    <form class="contact-form" @submit.prevent="handleSubmit">
        <div class="contact-form__fields">
            <app-input 
                v-model="formData.name"
                :label="t('home.contactSection.fields.name')"
                :error="errors.name"
                :required="true"
                type="text"
            />

            <app-input 
                v-model="formData.email"
                :label="t('home.contactSection.fields.email')"
                :error="errors.email"
                :required="true"
                type="email"
            />

            <app-input 
                v-model="formData.budget"
                :label="t('home.contactSection.fields.budget')"
                :error="errors.budget"
                type="text"
            />

            <app-input 
                v-model="formData.message"
                :label="t('home.contactSection.fields.description')"
                :error="errors.message"
                :required="true"
                type="textarea"
                :rows="4"
            />
        </div>

        <div class="contact-form__button">
            <app-button
                :label="isSubmitting ? t('home.contactSection.fields.sending') : t('home.contactSection.fields.send')"
                type="submit"
                :disabled="isSubmitting"
                :loading="isSubmitting"
            />
        </div>

        <div v-if="submitMessage" class="contact-form__message" :class="submitMessageType">
            {{ submitMessage }}
        </div>
    </form>
</template>

<script setup lang="ts">
import { AppButton, AppInput } from '@components'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores/ui'
import { usePortfolioStore } from '@/stores/portfolio'

const { t } = useI18n()
const uiStore = useUIStore()
const portfolioStore = usePortfolioStore()

const formData = reactive({
    name: '',
    email: '',
    budget: '',
    message: ''
})

const errors = reactive({
    name: '',
    email: '',
    budget: '',
    message: ''
})

const isSubmitting = ref(false)
const submitMessage = ref('')
const submitMessageType = ref<'success' | 'error'>('success')

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const validateForm = (): boolean => {
    let isValid = true
    
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = ''
    })
    
    if (!formData.name.trim()) {
        errors.name = t('home.contactSection.validation.nameRequired')
        isValid = false
    } else if (formData.name.trim().length < 2) {
        errors.name = t('home.contactSection.validation.nameMinLength')
        isValid = false
    }
    
    if (!formData.email.trim()) {
        errors.email = t('home.contactSection.validation.emailRequired')
        isValid = false
    } else if (!validateEmail(formData.email)) {
        errors.email = t('home.contactSection.validation.emailInvalid')
        isValid = false
    }
    
    if (!formData.message.trim()) {
        errors.message = t('home.contactSection.validation.messageRequired')
        isValid = false
    } else if (formData.message.trim().length < 10) {
        errors.message = t('home.contactSection.validation.messageMinLength')
        isValid = false
    }
    
    return isValid
}

const resetForm = () => {
    formData.name = ''
    formData.email = ''
    formData.budget = ''
    formData.message = ''
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = ''
    })
    submitMessage.value = ''
}

const handleSubmit = async () => {
    if (!validateForm()) {
        return
    }
    
    isSubmitting.value = true
    submitMessage.value = ''
    
    try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        submitMessage.value = t('home.contactSection.messages.success')
        submitMessageType.value = 'success'
        
        uiStore.addNotification({
            type: 'success',
            title: t('home.contactSection.notifications.successTitle'),
            message: t('home.contactSection.notifications.successMessage'),
            duration: 5000
        })
        
        setTimeout(() => {
            resetForm()
        }, 2000)
        
    } catch (error) {
        console.error('Form submission error:', error)
        
        submitMessage.value = t('home.contactSection.messages.error')
        submitMessageType.value = 'error'
        
        uiStore.addNotification({
            type: 'error',
            title: t('home.contactSection.notifications.errorTitle'),
            message: t('home.contactSection.notifications.errorMessage'),
            duration: 5000
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped lang="scss">
.contact-form {
    display: flex;
    flex-direction: column;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 1rem;
    
    padding: 2rem;
    min-width: 450px;
    box-shadow: var(--shadow-medium);

    @media (max-width: 768px) {
        min-width: 100%;
        padding: 1.5rem;
    }

    &__fields {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    &__button {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;
    }

    &__message {
        padding: 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        text-align: center;
        
        &.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        &.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    }
}
</style>