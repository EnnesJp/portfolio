<template>
    <div class="container about-section">
        <div class="about-section-main">
            <div class="about-section-main__info">
                <div class="about-section-main__info--hello">
                    <div class="about-section-main__info--hello-dash"/>
                    
                    <span class="about-section-main__info--hello-text">
                        Hello
                    </span>
                </div>

                <span class="about-section-main__info--name">
                    I'm João Pedro Ennes
                </span>

                <span class="about-section-main__info--resume">
                    A Full Stack Software Developer, Bachelor of Information Systems from UFMG, and a tech enthusiast.
                </span>
                
                <span class="about-section-main__info--learn-more">
                    Of course, there’s so much more to me than just a few fancy titles. Scroll down and get to know me,
                </span>
            </div>

            <div class="about-section-main__img">
                <img
                    src="@assets/images/self-img.png"
                    alt="João Pedro Ennes"
                />    
            </div>
        </div>

        <div class="about-section-bottom">
            <div class="about-section-bottom__social-medias">
                <img
                    src="@assets/images/icons/linkedin.svg"
                    alt="Linkedin"
                />
            </div>

            <div class="about-section-bottom__scroll">
                <span>SCROLL</span>

                <arrow />
            </div>

            <div/>
        </div>
    </div>
</template>

<script setup lang="ts">
import Arrow from '@components/icons/Arrow.vue'
</script>

<style scoped lang="scss">
.about-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &-main {
        display: flex;
        justify-content: center;
        gap: 71px;

        &__info {
            display: flex;
            flex-direction: column;
            gap: 20px;

            &--hello {
                display: flex;
                align-items: center;
                gap: 10px;

                &-dash {
                    width: 25px;
                    height: 3px;
                    background-color: var(--color-text);
                }

                &-text {
                    font-size: 24px;
                    font-weight: 700;
                }
            }

            &--name {
                font-size: 54px;
                font-weight: 500;
            }

            &--resume {
                font-size: 26px;
                font-weight: 400;
            }

            &--learn-more {
                font-size: 16px;
                font-weight: 400;
            }
        }

        &__img {
            img {
                width: 450px;
                height: 540px;
            }
        }
    }

    &-bottom {
        display: flex;
        margin-top: 56px;
        justify-content: space-between;
        width: 100%;

        &__social-medias {
            display: flex;
            gap: 32px;

            img {
                width: 20px;
                height: 20px;
            }
        }

        &__scroll {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;

            span {
                font-size: 18px;
                font-weight: 300;
            }
        }
    }
}
</style>