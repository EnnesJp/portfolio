<template>
    <app-section :title="t('home.contactSection.title')">
        <div class="contact-section">
            <div class="contact-section__info">
                <span class="contact-section__info--description">
                    {{ t('home.contactSection.description') }}
                </span>

                <div class="contact-section__info--social">
                    <div
                        v-for="info in socialInfos"
                        class="contact-section__info--social-info"    
                    >
                        <div class="contact-section__info--social-info-sdash"/>
                    
                        <span class="contact-section__info--social-info-text">
                            {{ info }}
                        </span>
                    </div>
                </div>
            </div>
    
            <div class="contact-section__from">
                <contact-form />
            </div>
        </div>
    </app-section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { AppSection, ContactForm } from '@components'
import { ref } from 'vue';

const { t } = useI18n()

const socialInfos = ref([
    t('home.contactSection.socialInfos.phone'),
    t('home.contactSection.socialInfos.email'),
    t('home.contactSection.socialInfos.location')
])
</script>

<style scoped lang="scss">
.contact-section {
    display: flex;
    width: 100%;

    &__info {
        display: flex;
        width: 50%;
        justify-content: space-between;
        flex-direction: column;
        margin: auto;
        max-width: 400px;

        &--description {
            font-size: 26px;
            font-weight: 300;
            color: #333333;
            max-width: 400px;
        }

        &--social {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-top: 20px;
            flex-direction: column;

            &-info {
                display: flex;
                align-items: center;
                gap: 10px;

                &-sdash {
                    width: 15px;
                    height: 1px;
                    background-color: #333333;
                }
            }
        }
    }


    &__from {
        display: flex;
        width: 50%;
        justify-content: center;
    }
}
</style>