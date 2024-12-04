<template>
    <header class="header">
        <div class="header__container">
            <div class="header__logo">
                <img
                    src="@assets/images/logo-white.png"
                    alt="Logo"
                />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.header {
    width: 100%;
    padding-top: 16px;
    padding-bottom: 48px;

    &__container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;
        padding: 0 1rem;
    }

    &__logo {
        img {
            margin-left: -20px;
            width: 180px;
        }
    }

    &__nav {
        display: flex;
        align-items: center;
    }
}
</style>