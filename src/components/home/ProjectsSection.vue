<template>
  <app-section
    class="projects-section"
    :title="t('home.projectsSection.title')"
  >
    <div class="projects-controls">
      <div class="category-filter">
        <button
          v-for="category in allCategories"
          :key="category.id"
          :class="['category-btn', { active: selectedCategory === category.id }]"
          :style="{ '--category-color': category.color }"
          @click="setSelectedCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>

      <div class="featured-toggle">
        <label class="toggle-label">
          <input
            type="checkbox"
            v-model="showFeaturedOnly"
            class="toggle-input"
          />
          <span class="toggle-slider"></span>
          <span class="toggle-text">{{ t('home.projectsSection.featuredOnly') }}</span>
        </label>
      </div>
    </div>

    <div class="projects-grid">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card"
        :style="{ '--category-color': project.category.color }"
      >
        <div class="project-images" v-if="project.images.length > 0">
          <div class="image-gallery">
            <LazyImage
              v-for="(image, index) in project.images"
              :key="index"
              :src="image"
              :alt="`${project.title} screenshot ${index + 1}`"
              :class="['gallery-image', { active: activeImageIndex[project.id] === index }]"
              :width="400"
              :height="200"
              object-fit="cover"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :quality="80"
              @click="setActiveImage(project.id, index)"
            />
          </div>
          <div class="image-indicators" v-if="project.images.length > 1">
            <button
              v-for="(_, index) in project.images"
              :key="index"
              :class="['indicator', { active: activeImageIndex[project.id] === index }]"
              @click="setActiveImage(project.id, index)"
            ></button>
          </div>
        </div>

        <div class="project-content">
          <div class="project-header">
            <div class="project-title-section">
              <h3 class="project-title">{{ project.title }}</h3>
              <span class="project-category">{{ project.category.name }}</span>
              <span v-if="project.featured" class="featured-badge">
                {{ t('home.projectsSection.featured') }}
              </span>
            </div>
            <div class="project-role">{{ project.role }}</div>
          </div>

          <p class="project-description">{{ project.description }}</p>

          <div class="project-technologies">
            <span class="tech-label">{{ t('home.projectsSection.technologies') }}:</span>
            <div class="tech-tags">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="tech-tag"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <div class="project-details">
            <div class="detail-section" v-if="project.challenges.length > 0">
              <h4 class="detail-title">{{ t('home.projectsSection.challenges') }}</h4>
              <ul class="detail-list">
                <li v-for="challenge in project.challenges" :key="challenge">
                  {{ challenge }}
                </li>
              </ul>
            </div>

            <div class="detail-section" v-if="project.outcomes.length > 0">
              <h4 class="detail-title">{{ t('home.projectsSection.outcomes') }}</h4>
              <ul class="detail-list">
                <li v-for="outcome in project.outcomes" :key="outcome">
                  {{ outcome }}
                </li>
              </ul>
            </div>
          </div>

          <div class="project-actions">
            <a
              v-if="project.liveUrl"
              :href="project.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="action-btn primary"
            >
              {{ t('home.projectsSection.viewLive') }}
              <ExternalLinkIcon />
            </a>
            <a
              v-if="project.repositoryUrl"
              :href="project.repositoryUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="action-btn secondary"
            >
              {{ t('home.projectsSection.viewCode') }}
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredProjects.length === 0" class="empty-state">
      <p>{{ t('home.projectsSection.noProjects') }}</p>
    </div>
  </app-section>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppSection } from '@components'
import { LazyImage } from '@/components/ui'
import { usePortfolioStore } from '@/stores/portfolio'

const ExternalLinkIcon = {
  template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V6.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
    <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
  </svg>`
}

const GithubIcon = {
  template: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>`
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
  ...projectCategories.value
])

const filteredProjects = computed(() => {
  let filtered = projects.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(project => project.category.id === selectedCategory.value)
  }

  if (showFeaturedOnly.value) {
    filtered = filtered.filter(project => project.featured)
  }

  filtered.forEach(project => {
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.projects-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--category-color);
  background: transparent;
  color: var(--category-color);
  border-radius: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--category-color);
    color: white;
  }

  &.active {
    background: var(--category-color);
    color: white;
  }
}

.featured-toggle {
  display: flex;
  align-items: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  display: none;
}

.toggle-slider {
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

.toggle-input:checked + .toggle-slider {
  background: var(--color-primary);

  &::before {
    transform: translateX(20px);
  }
}

.toggle-text {
  font-size: 0.875rem;
  color: var(--color-text);
  font-weight: 500;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.project-card {
  background: var(--color-surface);
  border-radius: 1rem;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--category-color);
    transform: translateY(-4px);
  }
}

.project-images {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.image-gallery {
  position: relative;
  width: 100%;
  height: 100%;
}

.gallery-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;

  &.active {
    opacity: 1;
  }
}

.image-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.2s ease;

  &.active {
    background: white;
  }
}

.project-content {
  padding: 1.5rem;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.project-title-section {
  flex: 1;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 0.5rem 0;
}

.project-category {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--category-color);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 0.5rem;
}

.featured-badge {
  display: inline-block;
  background: var(--color-accent);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.project-role {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  text-align: right;
}

.project-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.project-technologies {
  margin-bottom: 1.5rem;
}

.tech-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  display: block;
  margin-bottom: 0.5rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
}

.project-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.detail-section {
  background: var(--color-background);
  padding: 1rem;
  border-radius: 0.5rem;
}

.detail-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin-bottom: 0.5rem;
    position: relative;
    padding-left: 1rem;

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

.project-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 2px solid;

  &.primary {
    background: var(--category-color);
    color: white;
    border-color: var(--category-color);

    &:hover {
      background: transparent;
      color: var(--category-color);
    }
  }

  &.secondary {
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

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
  
  p {
    font-size: 1.125rem;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .project-role {
    text-align: left;
  }
  
  .project-details {
    grid-template-columns: 1fr;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>