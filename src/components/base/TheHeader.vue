<template>
  <header ref="headerRef" class="header" :class="headerClasses" role="banner">
    <responsive-container size="xl">
      <div class="header__container">
        <nav
          class="header__nav"
          v-if="shouldShowDesktopMenu"
          role="navigation"
          aria-label="Main navigation"
        >
          <ul class="header__nav-list" role="menubar">
            <li
              v-for="section in visibleSections"
              :key="section.id"
              class="header__nav-item"
              role="none"
            >
              <button
                class="header__nav-link"
                :class="{ 'header__nav-link--active': currentSection === section.id }"
                @click="handleDesktopNavClick(section.id)"
                role="menuitem"
                :aria-current="currentSection === section.id ? 'page' : undefined"
                :tabindex="currentSection === section.id ? 0 : -1"
              >
                {{ t(`navigation.${section.id}`) }}
              </button>
            </li>
          </ul>
        </nav>

        <div class="header__controls" v-if="shouldShowDesktopMenu">
          <theme-toggle />
          <select-lang />
        </div>

        <div class="header__mobile-controls" v-if="shouldShowMobileMenu">
          <theme-toggle />
          <select-lang />
          <button
            class="header__mobile-menu-toggle"
            @click="toggleMobileMenu"
            :aria-label="isMobileMenuOpen ? t('navigation.closeMenu') : t('navigation.openMenu')"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-navigation"
            :aria-pressed="isMobileMenuOpen"
          >
            <div class="hamburger" :class="{ 'hamburger--active': isMobileMenuOpen }">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>
    </responsive-container>

    <div
      ref="mobileMenuRef"
      id="mobile-navigation"
      class="header__mobile-menu"
      :class="{ 'header__mobile-menu--open': isMobileMenuOpen }"
      v-if="shouldShowMobileMenu"
      :aria-hidden="!isMobileMenuOpen"
      role="dialog"
      aria-modal="false"
      :aria-label="t('navigation.mobileMenu')"
    >
      <nav class="header__mobile-nav" role="navigation" aria-label="Mobile navigation">
        <ul class="header__mobile-nav-list" role="menu">
          <li
            v-for="section in visibleSections"
            :key="section.id"
            class="header__mobile-nav-item"
            role="none"
          >
            <button
              class="header__mobile-nav-link"
              :class="{ 'header__mobile-nav-link--active': currentSection === section.id }"
              @click="handleMobileNavClick(section.id)"
              role="menuitem"
              :aria-current="currentSection === section.id ? 'page' : undefined"
            >
              {{ t(`navigation.${section.id}`) }}
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <div
      class="header__mobile-overlay"
      :class="{ 'header__mobile-overlay--visible': isMobileMenuOpen }"
      @click="closeMobileMenu"
      v-if="shouldShowMobileMenu && isMobileMenuOpen"
      aria-hidden="true"
      role="presentation"
    ></div>
  </header>
</template>

<script setup lang="ts">
import { SelectLang, ThemeToggle } from '@components'
import { ResponsiveContainer } from '@/components/ui'
import { useI18n } from 'vue-i18n'
import { useNavigationStore } from '@/stores/navigation'
import { useThemeStore } from '@/stores/theme'
import { useResponsiveNavigation } from '@/composables/useResponsive'
import { useScrollDetection } from '@/composables/useScrollDetection'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch, nextTick, computed } from 'vue'

interface Props {
  transparent?: boolean
  fixed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  transparent: false,
  fixed: false,
})

interface Emits {
  (e: 'section-change', sectionId: string): void
}

const emit = defineEmits<Emits>()

const headerRef = ref<HTMLElement>()

const { t } = useI18n()
const {
  shouldShowMobileMenu,
  shouldShowDesktopMenu,
  isMobileMenuOpen,
  toggleMobileMenu,
  closeMobileMenu,
} = useResponsiveNavigation()

const navigationStore = useNavigationStore()
const themeStore = useThemeStore()

const { currentSection, visibleSections } = storeToRefs(navigationStore)
const { scrollToSection } = navigationStore

const { isFloating, scrollY } = useScrollDetection()

const headerClasses = computed(() => ({
  'header--transparent': props.transparent,
  'header--fixed': props.fixed,
  'header--floating': isFloating.value,
  'header--scrolled': scrollY.value > 0,
}))

const handleMobileNavClick = (sectionId: string) => {
  scrollToSection(sectionId)
  closeMobileMenu()
  emit('section-change', sectionId)
}

const handleDesktopNavClick = (sectionId: string) => {
  scrollToSection(sectionId)
  emit('section-change', sectionId)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()

    const toggleButton = headerRef.value?.querySelector(
      '.header__mobile-menu-toggle',
    ) as HTMLElement
    toggleButton?.focus()
  }
}

watch(isMobileMenuOpen, async (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'

    await nextTick()
  } else {
    document.body.style.overflow = ''
  }
})

watch(currentSection, (newSection, oldSection) => {
  if (newSection && newSection !== oldSection) {
    const activeNavItem = headerRef.value?.querySelector(`[aria-current="page"]`) as HTMLElement
    if (activeNavItem) {
      activeNavItem.setAttribute('tabindex', '0')
    }

    const navItems = headerRef.value?.querySelectorAll(
      '.header__nav-link:not([aria-current="page"])',
    )
    navItems?.forEach((item) => {
      item.setAttribute('tabindex', '-1')
    })
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)

  if (isMobileMenuOpen.value) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  padding: var(--container-padding) 0;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  z-index: var(--z-fixed);

  transition-property: padding, background-color, backdrop-filter, border-color, box-shadow,
    transform, opacity;
  transition-duration: 500ms;
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &--transparent {
    background-color: transparent;
    border-bottom: none;
  }

  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  &--floating {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: var(--header-padding-floating) 0;
    background-color: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border-bottom: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    transform: translateZ(0) scale(1);
    z-index: var(--z-fixed);

    @supports not (backdrop-filter: blur(10px)) {
      background-color: var(--color-background);
      opacity: 0.95;
      border-bottom: 1px solid var(--color-border);
    }

    @supports not (-webkit-backdrop-filter: blur(10px)) {
      background-color: var(--color-background);
      opacity: 0.95;
      border-bottom: 1px solid var(--color-border);
    }
  }

  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__nav {
    display: flex;
    align-items: center;

    &-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }

    &-item {
      position: relative;
    }

    &-link {
      background: none;
      border: none;
      color: var(--color-text);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius-small);
      transition: all var(--transition-fast);
      position: relative;

      &:hover {
        color: var(--color-primary);
        background-color: var(--color-surface);
      }

      &--active {
        color: var(--color-primary);
        font-weight: var(--font-weight-bold);

        &::after {
          content: '';
          position: absolute;
          bottom: -0.25rem;
          left: 50%;
          transform: translateX(-50%);
          width: 1.25rem;
          height: 2px;
          background-color: var(--color-primary);
          border-radius: 1px;
        }
      }
    }
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__mobile-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-left: auto;
  }

  &__mobile-menu-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--border-radius-small);
    transition: background-color var(--transition-fast);

    &:hover {
      background-color: var(--color-surface);
    }
  }

  .hamburger {
    width: 24px;
    height: 18px;
    position: relative;
    cursor: pointer;

    span {
      display: block;
      position: absolute;
      height: 2px;
      width: 100%;
      background: var(--color-text);
      border-radius: 1px;
      opacity: 1;
      left: 0;
      transform: rotate(0deg);
      transition: var(--transition-medium);

      &:nth-child(1) {
        top: 0px;
      }

      &:nth-child(2) {
        top: 8px;
      }

      &:nth-child(3) {
        top: 16px;
      }
    }

    &--active {
      span {
        &:nth-child(1) {
          top: 8px;
          transform: rotate(135deg);
        }

        &:nth-child(2) {
          opacity: 0;
          left: -60px;
        }

        &:nth-child(3) {
          top: 8px;
          transform: rotate(-135deg);
        }
      }
    }
  }

  &__mobile-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    transform: translateY(100%);
    transition: transform var(--transition-medium);
    z-index: calc(var(--z-fixed) + 1);
    max-height: 80vh;
    overflow-y: auto;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);

    &--open {
      transform: translateY(0);
    }
  }

  &__mobile-nav {
    padding: 1.5rem;

    &-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    &-item {
      width: 100%;
    }

    &-link {
      display: block;
      width: 100%;
      background: none;
      border: none;
      color: var(--color-text);
      font-size: var(--font-size-large);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      padding: 1rem 1.25rem;
      border-radius: var(--border-radius);
      transition: all var(--transition-fast);
      text-align: left;

      &:hover {
        color: var(--color-primary);
        background-color: var(--color-surface);
      }

      &--active {
        color: var(--color-primary);
        background-color: var(--color-surface);
        font-weight: var(--font-weight-bold);
      }
    }
  }

  &__mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-medium);
    z-index: var(--z-fixed);

    &--visible {
      opacity: 1;
      visibility: visible;
    }
  }
}

@media screen and (max-width: 768px) {
  .header {
    &__nav {
      display: none;
    }

    &__controls {
      display: none;
    }
  }
}

@media screen and (min-width: 769px) {
  .header {
    &__mobile-controls {
      display: none;
    }

    &__mobile-menu {
      display: none;
    }

    &__mobile-overlay {
      display: none;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .header {
    transition-duration: 0ms;
    transition-property: none;
    will-change: auto;

    &__nav-link {
      transition: none;

      &::after {
        transition: none;
      }
    }

    &__mobile-menu {
      transition: none;
    }

    &__mobile-menu-toggle {
      transition: none;
    }

    &__mobile-overlay {
      transition: none;
    }

    .hamburger span {
      transition: none;
    }
  }
}

@media (prefers-contrast: high) {
  .header {
    border-bottom-width: 2px;

    &__nav-link {
      border: 1px solid transparent;

      &:hover,
      &--active {
        border-color: currentColor;
      }
    }
  }
}
</style>
