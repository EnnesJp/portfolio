<template>
  <AppSection section-id="projects" background="primary" :title="t('home.projectsSection.title')">
    <div class="projects-section__controls">
      <div class="projects-section__category-filter">
        <button
          v-for="category in allCategories"
          :key="category.id"
          :class="[
            'projects-section__category-btn',
            { 'projects-section__category-btn--active': selectedCategory === category.id },
          ]"
          :style="{ '--category-color': category.color }"
          @click="setSelectedCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>

      <div class="projects-section__featured-toggle">
        <label class="projects-section__toggle-label">
          <input
            type="checkbox"
            v-model="showFeaturedOnly"
            class="projects-section__toggle-input"
          />
          <span class="projects-section__toggle-slider"></span>
          <span class="projects-section__toggle-text">{{
            t('home.projectsSection.featuredOnly')
          }}</span>
        </label>
      </div>
    </div>

    <div class="projects-section__grid">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="projects-section__card"
        :style="{ '--category-color': project.category.color }"
      >
        <div class="projects-section__card-images" v-if="project.images.length > 0">
          <div class="projects-section__image-gallery">
            <LazyImage
              v-for="(image, index) in project.images"
              :key="index"
              :src="image"
              :alt="`${project.title} screenshot ${index + 1}`"
              :class="[
                'projects-section__gallery-image',
                {
                  'projects-section__gallery-image--active': activeImageIndex[project.id] === index,
                },
              ]"
              :width="400"
              :height="200"
              object-fit="cover"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :quality="80"
              @click="setActiveImage(project.id, index)"
            />
          </div>
          <div class="projects-section__image-indicators" v-if="project.images.length > 1">
            <button
              v-for="(_, index) in project.images"
              :key="index"
              :class="[
                'projects-section__indicator',
                { 'projects-section__indicator--active': activeImageIndex[project.id] === index },
              ]"
              @click="setActiveImage(project.id, index)"
            ></button>
          </div>
        </div>

        <div class="projects-section__card-content">
          <div class="projects-section__card-header">
            <div class="projects-section__card-title-section">
              <h3 class="projects-section__card-title">{{ project.title }}</h3>
              <span class="projects-section__card-category">{{ project.category.name }}</span>
              <span v-if="project.featured" class="projects-section__featured-badge">
                {{ t('home.projectsSection.featured') }}
              </span>
            </div>
            <div class="projects-section__card-role">{{ project.role }}</div>
          </div>

          <p class="projects-section__card-description">{{ project.description }}</p>

          <div class="projects-section__technologies">
            <span class="projects-section__tech-label"
              >{{ t('home.projectsSection.technologies') }}:</span
            >
            <div class="projects-section__tech-tags">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="projects-section__tech-tag"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <div class="projects-section__details">
            <div class="projects-section__detail-section" v-if="project.challenges.length > 0">
              <h4 class="projects-section__detail-title">
                {{ t('home.projectsSection.challenges') }}
              </h4>
              <ul class="projects-section__detail-list">
                <li v-for="challenge in project.challenges" :key="challenge">
                  {{ challenge }}
                </li>
              </ul>
            </div>

            <div class="projects-section__detail-section" v-if="project.outcomes.length > 0">
              <h4 class="projects-section__detail-title">
                {{ t('home.projectsSection.outcomes') }}
              </h4>
              <ul class="projects-section__detail-list">
                <li v-for="outcome in project.outcomes" :key="outcome">
                  {{ outcome }}
                </li>
              </ul>
            </div>
          </div>

          <div class="projects-section__actions">
            <a
              v-if="project.liveUrl"
              :href="project.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="projects-section__action-btn projects-section__action-btn--primary"
            >
              {{ t('home.projectsSection.viewLive') }}
              <ExternalLinkIcon />
            </a>
            <a
              v-if="project.repositoryUrl"
              :href="project.repositoryUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="projects-section__action-btn projects-section__action-btn--secondary"
            >
              {{ t('home.projectsSection.viewCode') }}
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredProjects.length === 0" class="projects-section__empty">
      <div class="projects-section__empty-icon">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm-11 11h7v7H3v-7zm11 0h7v7h-7v-7z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3 class="projects-section__empty-title">
        {{ t('home.projectsSection.noProjects') }}
      </h3>
      <p class="projects-section__empty-description">
        {{ t('home.projectsSection.noProjects') }}
      </p>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { LazyImage } from '@/components/ui'
import { usePortfolioStore } from '@/stores/portfolio'
import AppSection from '@/components/shared/AppSection.vue'

const ExternalLinkIcon = {
  template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V6.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
    <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
  </svg>`,
}

const GithubIcon = {
  template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>`,
}

const { t } = useI18n()
const portfolioStore = usePortfolioStore()

const selectedCategory = ref<string>('all')
const showFeaturedOnly = ref(false)
const activeImageIndex = reactive<Record<string, number>>({})

const projects = computed(() => portfolioStore.projects)
const projectCategories = computed(() => portfolioStore.portfolioData?.projects?.categories || [])

const allCategories = computed(() => [
  { id: 'all', name: t('home.projectsSection.allCategories'), color: '#666666' },
  ...projectCategories.value,
])

const filteredProjects = computed(() => {
  let filtered = projects.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((project) => project.category.id === selectedCategory.value)
  }

  if (showFeaturedOnly.value) {
    filtered = filtered.filter((project) => project.featured)
  }

  filtered.forEach((project) => {
    if (!(project.id in activeImageIndex)) {
      activeImageIndex[project.id] = 0
    }
  })

  return filtered
})

const setSelectedCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const setActiveImage = (projectId: string, imageIndex: number) => {
  activeImageIndex[projectId] = imageIndex
}
</script>

<style scoped lang="scss">
.projects-section {
  &__controls {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    margin-bottom: 32px;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__category-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__category-btn {
    padding: 8px 16px;
    border: 2px solid var(--category-color);
    background: transparent;
    color: var(--category-color);
    border-radius: 24px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--category-color);
      color: white;
    }

    &--active {
      background: var(--category-color);
      color: white;
    }
  }

  &__featured-toggle {
    display: flex;
    align-items: center;
  }

  &__toggle-label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
  }

  &__toggle-input {
    display: none;
  }

  &__toggle-slider {
    position: relative;
    width: 44px;
    height: 24px;
    background: var(--color-border);
    border-radius: 12px;
    transition: background 0.2s ease;

    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.2s ease;
    }
  }

  &__toggle-input:checked + &__toggle-slider {
    background: var(--color-primary);

    &::before {
      transform: translateX(20px);
    }
  }

  &__toggle-text {
    font-size: 14px;
    color: var(--color-text);
    font-weight: 500;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 32px;
    width: 100%;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background: var(--color-surface);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--color-border);
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;

    &:hover {
      border-color: var(--color-primary);
    }
  }

  &__card-images {
    position: relative;
    height: 200px;
    overflow: hidden;
  }

  &__image-gallery {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__gallery-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;

    &--active {
      opacity: 1;
    }
  }

  &__image-indicators {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
  }

  &__indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: background 0.2s ease;

    &--active {
      background: white;
    }
  }

  &__card-content {
    padding: 24px;
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    gap: 16px;
  }

  &__card-title-section {
    flex: 1;
  }

  &__card-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 8px 0;
  }

  &__card-category {
    display: inline-block;
    font-size: 12px;
    color: var(--category-color);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 8px;
  }

  &__featured-badge {
    display: inline-block;
    background: var(--color-accent);
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__card-role {
    font-size: 14px;
    color: var(--color-text-secondary);
    font-weight: 500;
    text-align: right;
  }

  &__card-description {
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  &__technologies {
    margin-bottom: 24px;
  }

  &__tech-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
    display: block;
    margin-bottom: 8px;
  }

  &__tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tech-tag {
    background: var(--color-background);
    color: var(--color-text);
    font-size: 12px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 16px;
    border: 1px solid var(--color-border);
  }

  &__details {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__detail-section {
    background: var(--color-background);
    padding: 16px;
    border-radius: 8px;
  }

  &__detail-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__detail-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      font-size: 14px;
      color: var(--color-text-secondary);
      line-height: 1.5;
      margin-bottom: 8px;
      position: relative;
      padding-left: 16px;

      &::before {
        content: '•';
        color: var(--category-color);
        font-weight: bold;
        position: absolute;
        left: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__action-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    border: 2px solid;

    &--primary {
      background: var(--category-color);
      color: white;
      border-color: var(--category-color);

      &:hover {
        background: transparent;
        color: var(--category-color);
      }
    }

    &--secondary {
      background: transparent;
      color: var(--color-text);
      border-color: var(--color-border);

      &:hover {
        background: var(--color-text);
        color: var(--color-background);
        border-color: var(--color-text);
      }
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &__empty {
    text-align: center;
    padding: 80px 20px;
    color: var(--color-text-secondary);

    &-icon {
      margin-bottom: 24px;
      color: var(--color-border);

      svg {
        width: 64px;
        height: 64px;
      }
    }

    &-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--color-text);
      margin: 0 0 12px 0;
    }

    &-description {
      font-size: 16px;
      margin: 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}

@media (max-width: 768px) {
  .projects-section {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__card-content {
      padding: 20px;
    }

    &__card-header {
      flex-direction: column;
      align-items: flex-start;
    }

    &__card-role {
      text-align: left;
    }

    &__details {
      grid-template-columns: 1fr;
    }

    &__action-btn {
      flex: 1;
      justify-content: center;
    }

    &__empty {
      padding: 60px 16px;

      &-icon svg {
        width: 48px;
        height: 48px;
      }

      &-title {
        font-size: 20px;
      }

      &-description {
        font-size: 14px;
      }
    }
  }
}
</style>
