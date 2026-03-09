import { defineStore } from 'pinia'
import { ref, computed, readonly, watch } from 'vue'
import type { PortfolioData, PersonalInfo } from '@/types'
import { useLanguageStore } from './language'

export const usePortfolioStore = defineStore('portfolio', () => {
  const languageStore = useLanguageStore()
  const portfolioData = ref<PortfolioData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  watch(
    () => languageStore.currentLanguage,
    () => {
      loadPortfolioData()
    },
  )

  const t = (key: string, fallback?: string): string => {
    return languageStore.getTranslation(key, fallback)
  }

  const getCategoryTranslation = (categoryId: string, section: string): string => {
    const categoryMappings: Record<string, Record<string, string>> = {
      certifications: {
        cloud: 'home.certificationsSection.categories.cloud',
        frontend: 'home.certificationsSection.categories.development',
        management: 'home.certificationsSection.categories.project',
        database: 'home.certificationsSection.categories.data',
      },
      skills: {
        frontend: 'home.hardSkillsSection.skills.frontend.title',
        backend: 'home.hardSkillsSection.skills.backend.title',
        cloud: 'home.hardSkillsSection.skills.devops.title',
        database: 'home.hardSkillsSection.skills.database.title',
      },
      projects: {
        'web-app': 'home.projectsSection.categories.web',
        api: 'home.projectsSection.categories.api',
        portfolio: 'home.projectsSection.categories.portfolio',
        infrastructure: 'home.projectsSection.categories.other',
      },
    }

    const key = categoryMappings[section]?.[categoryId]
    return key ? t(key, categoryId) : categoryId
  }

  const personalInfo = computed(() => portfolioData.value?.personal)
  const companies = computed(() => portfolioData.value?.companies?.companies || [])
  const certifications = computed(() => portfolioData.value?.certifications?.certifications || [])
  const skills = computed(() => portfolioData.value?.skills?.skills || [])
  const projects = computed(() => portfolioData.value?.projects?.projects || [])

  const featuredProjects = computed(() => projects.value.filter((p) => p.featured).slice(0, 3))

  const skillsByCategory = computed(() => {
    const categories = new Map<string, any[]>()
    skills.value.forEach((skill) => {
      const category = skill.category.name
      if (!categories.has(category)) {
        categories.set(category, [])
      }
      categories.get(category)!.push(skill)
    })
    return categories
  })

  const loadPortfolioData = async () => {
    isLoading.value = true
    error.value = null

    try {
      portfolioData.value = {
        personal: {
          name: 'Portfolio Owner',
          title: 'Software Developer',
          location: 'Location',
          email: 'contact@portfolio.com',
          avatar: new URL('@/assets/images/self-img.jpeg', import.meta.url).href,
        },
        presentation: {
          name: t('home.presentationSection.name'),
          title: t('home.presentationSection.title'),
          summary: t('home.presentationSection.summary'),
          ctaButtons: [
            {
              label: t('home.presentationSection.cta.viewWork'),
              action: 'projects',
              variant: 'primary',
            },
            {
              label: t('home.presentationSection.cta.getInTouch'),
              action: 'contact',
              variant: 'secondary',
            },
          ],
        },
        about: {
          personalInfo: {
            name: 'Portfolio Owner',
            title: 'Software Developer',
            location: 'Location',
            email: 'contact@portfolio.com',
            avatar: '/images/avatar.jpg',
          },
          professionalJourney: [],
          values: [],
          interests: [],
        },
        companies: {
          companies: [
            {
              id: '1',
              name: 'Nubank',
              logo: '/portfolio/images/companies/nubank.png',
              position: t('home.portfolioData.companies.nubank.position'),
              period: {
                start: new Date('2026-03-16'),
                end: undefined,
              },
              description: t('home.portfolioData.companies.nubank.description'),
              achievements: [],
              technologies: ['Clojure', 'Datomic'],
            },
            {
              id: '2',
              name: 'Onfly',
              logo: '/portfolio/images/companies/onfly.png',
              position: t('home.portfolioData.companies.onfly.position'),
              period: {
                start: new Date('2024-01-29'),
                end: new Date('2026-03-13'),
              },
              description: t('home.portfolioData.companies.onfly.description'),
              achievements: [
                t('home.portfolioData.companies.onfly.achievements.cicd'),
                t('home.portfolioData.companies.onfly.achievements.performance'),
                t('home.portfolioData.companies.onfly.achievements.mentoring'),
              ],
              technologies: ['Laravel', 'Vue.js', 'MySQL', 'JavaScript', 'PHP'],
            },
            {
              id: '3',
              name: 'Nelogica',
              logo: '/portfolio/images/companies/nelogica.jpg',
              position: t('home.portfolioData.companies.nelogica.position'),
              period: {
                start: new Date('2022-05-24'),
                end: new Date('2024-01-27'),
              },
              description: t('home.portfolioData.companies.nelogica.description'),
              achievements: [
                t('home.portfolioData.companies.nelogica.achievements.projects'),
                t('home.portfolioData.companies.nelogica.achievements.designSystem'),
                t('home.portfolioData.companies.nelogica.achievements.performance'),
              ],
              technologies: ['Vue.js', 'React', 'JavaScript', 'Git'],
            },
          ],
          displayMode: 'timeline',
        },
        certifications: {
          certifications: [
            {
              id: '1',
              name: t('home.portfolioData.certifications.awsSaa.name'),
              issuer: t('home.portfolioData.certifications.awsSaa.issuer'),
              date: new Date('2023-06-15'),
              credentialId: 'AWS-SAA-123456',
              verificationUrl: 'https://aws.amazon.com/verification',
              badge: '/images/badges/aws-saa.png',
              category: {
                id: 'cloud',
                name: getCategoryTranslation('cloud', 'certifications'),
                color: '#FF9900',
              },
            },
            {
              id: '2',
              name: t('home.portfolioData.certifications.vueCertified.name'),
              issuer: t('home.portfolioData.certifications.vueCertified.issuer'),
              date: new Date('2023-03-20'),
              credentialId: 'VUE-DEV-789012',
              verificationUrl: 'https://vuejs.org/verification',
              badge: '/images/badges/vue-certified.png',
              category: {
                id: 'frontend',
                name: getCategoryTranslation('frontend', 'certifications'),
                color: '#4FC08D',
              },
            },
            {
              id: '3',
              name: t('home.portfolioData.certifications.psm.name'),
              issuer: t('home.portfolioData.certifications.psm.issuer'),
              date: new Date('2022-11-10'),
              credentialId: 'PSM-345678',
              verificationUrl: 'https://scrum.org/verification',
              badge: '/images/badges/psm-1.png',
              category: {
                id: 'management',
                name: getCategoryTranslation('management', 'certifications'),
                color: '#0066CC',
              },
            },
            {
              id: '4',
              name: t('home.portfolioData.certifications.gcpDev.name'),
              issuer: t('home.portfolioData.certifications.gcpDev.issuer'),
              date: new Date('2023-01-25'),
              credentialId: 'GCP-DEV-901234',
              verificationUrl: 'https://cloud.google.com/verification',
              badge: '/images/badges/gcp-dev.png',
              category: {
                id: 'cloud',
                name: getCategoryTranslation('cloud', 'certifications'),
                color: '#FF9900',
              },
            },
            {
              id: '5',
              name: t('home.portfolioData.certifications.mongoDev.name'),
              issuer: t('home.portfolioData.certifications.mongoDev.issuer'),
              date: new Date('2022-08-30'),
              credentialId: 'MONGO-DEV-567890',
              verificationUrl: 'https://university.mongodb.com/verification',
              badge: '/images/badges/mongodb-dev.png',
              category: {
                id: 'database',
                name: getCategoryTranslation('database', 'certifications'),
                color: '#47A248',
              },
            },
          ],
          categories: [
            {
              id: 'cloud',
              name: getCategoryTranslation('cloud', 'certifications'),
              color: '#FF9900',
            },
            {
              id: 'frontend',
              name: getCategoryTranslation('frontend', 'certifications'),
              color: '#4FC08D',
            },
            {
              id: 'management',
              name: getCategoryTranslation('management', 'certifications'),
              color: '#0066CC',
            },
            {
              id: 'database',
              name: getCategoryTranslation('database', 'certifications'),
              color: '#47A248',
            },
          ],
        },
        skills: {
          skills: [
            {
              id: '1',
              name: 'Vue.js',
              category: {
                id: 'frontend',
                name: getCategoryTranslation('frontend', 'skills'),
                color: '#4FC08D',
              },
              proficiency: 5,
              yearsOfExperience: 4,
              projects: 12,
              icon: '/images/icons/vue.svg',
            },
            {
              id: '2',
              name: 'TypeScript',
              category: {
                id: 'frontend',
                name: getCategoryTranslation('frontend', 'skills'),
                color: '#4FC08D',
              },
              proficiency: 4,
              yearsOfExperience: 3,
              projects: 10,
              icon: '/images/icons/typescript.svg',
            },
            {
              id: '3',
              name: 'Node.js',
              category: {
                id: 'backend',
                name: getCategoryTranslation('backend', 'skills'),
                color: '#339933',
              },
              proficiency: 4,
              yearsOfExperience: 3,
              projects: 8,
              icon: '/images/icons/nodejs.svg',
            },
            {
              id: '4',
              name: 'Python',
              category: {
                id: 'backend',
                name: getCategoryTranslation('backend', 'skills'),
                color: '#339933',
              },
              proficiency: 3,
              yearsOfExperience: 2,
              projects: 5,
              icon: '/images/icons/python.svg',
            },
            {
              id: '5',
              name: 'AWS',
              category: {
                id: 'cloud',
                name: getCategoryTranslation('cloud', 'skills'),
                color: '#FF9900',
              },
              proficiency: 4,
              yearsOfExperience: 2,
              projects: 6,
              icon: '/images/icons/aws.svg',
            },
            {
              id: '6',
              name: 'Docker',
              category: {
                id: 'cloud',
                name: getCategoryTranslation('cloud', 'skills'),
                color: '#FF9900',
              },
              proficiency: 3,
              yearsOfExperience: 2,
              projects: 7,
              icon: '/images/icons/docker.svg',
            },
            {
              id: '7',
              name: 'PostgreSQL',
              category: {
                id: 'database',
                name: getCategoryTranslation('database', 'skills'),
                color: '#336791',
              },
              proficiency: 4,
              yearsOfExperience: 3,
              projects: 9,
              icon: '/images/icons/postgresql.svg',
            },
            {
              id: '8',
              name: 'MongoDB',
              category: {
                id: 'database',
                name: getCategoryTranslation('database', 'skills'),
                color: '#336791',
              },
              proficiency: 3,
              yearsOfExperience: 2,
              projects: 4,
              icon: '/images/icons/mongodb.svg',
            },
          ],
          categories: [
            {
              id: 'frontend',
              name: getCategoryTranslation('frontend', 'skills'),
              color: '#4FC08D',
            },
            {
              id: 'backend',
              name: getCategoryTranslation('backend', 'skills'),
              color: '#339933',
            },
            {
              id: 'cloud',
              name: getCategoryTranslation('cloud', 'skills'),
              color: '#FF9900',
            },
            {
              id: 'database',
              name: getCategoryTranslation('database', 'skills'),
              color: '#336791',
            },
          ],
          displayMode: 'grid',
        },
        projects: {
          projects: [
            {
              id: '1',
              title: t('home.portfolioData.projects.ecommerce.title'),
              description: t('home.portfolioData.projects.ecommerce.description'),
              technologies: ['Vue.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'AWS'],
              images: [
                '/images/projects/ecommerce-1.jpg',
                '/images/projects/ecommerce-2.jpg',
                '/images/projects/ecommerce-3.jpg',
              ],
              liveUrl: 'https://ecommerce-demo.portfolio.com',
              repositoryUrl: 'https://github.com/username/ecommerce-platform',
              role: t('home.portfolioData.projects.ecommerce.role'),
              challenges: [
                t('home.portfolioData.projects.ecommerce.challenges.inventory'),
                t('home.portfolioData.projects.ecommerce.challenges.queries'),
                t('home.portfolioData.projects.ecommerce.challenges.compliance'),
              ],
              outcomes: [
                t('home.portfolioData.projects.ecommerce.outcomes.conversion'),
                t('home.portfolioData.projects.ecommerce.outcomes.performance'),
                t('home.portfolioData.projects.ecommerce.outcomes.transactions'),
              ],
              category: {
                id: 'web-app',
                name: getCategoryTranslation('web-app', 'projects'),
                color: '#4FC08D',
              },
              featured: true,
            },
            {
              id: '2',
              title: t('home.portfolioData.projects.taskApi.title'),
              description: t('home.portfolioData.projects.taskApi.description'),
              technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Socket.io', 'Docker'],
              images: ['/images/projects/task-api-1.jpg', '/images/projects/task-api-2.jpg'],
              repositoryUrl: 'https://github.com/username/task-management-api',
              role: t('home.portfolioData.projects.taskApi.role'),
              challenges: [
                t('home.portfolioData.projects.taskApi.challenges.schema'),
                t('home.portfolioData.projects.taskApi.challenges.notifications'),
                t('home.portfolioData.projects.taskApi.challenges.consistency'),
              ],
              outcomes: [
                t('home.portfolioData.projects.taskApi.outcomes.users'),
                t('home.portfolioData.projects.taskApi.outcomes.uptime'),
                t('home.portfolioData.projects.taskApi.outcomes.efficiency'),
              ],
              category: {
                id: 'api',
                name: getCategoryTranslation('api', 'projects'),
                color: '#339933',
              },
              featured: true,
            },
            {
              id: '3',
              title: t('home.portfolioData.projects.portfolio.title'),
              description: t('home.portfolioData.projects.portfolio.description'),
              technologies: ['Vue.js', 'TypeScript', 'Pinia', 'SCSS', 'Vite'],
              images: ['/images/projects/portfolio-1.jpg', '/images/projects/portfolio-2.jpg'],
              liveUrl: 'https://portfolio.demo.com',
              repositoryUrl: 'https://github.com/username/portfolio',
              role: t('home.portfolioData.projects.portfolio.role'),
              challenges: [
                t('home.portfolioData.projects.portfolio.challenges.animations'),
                t('home.portfolioData.projects.portfolio.challenges.responsive'),
                t('home.portfolioData.projects.portfolio.challenges.optimization'),
              ],
              outcomes: [
                t('home.portfolioData.projects.portfolio.outcomes.lighthouse'),
                t('home.portfolioData.projects.portfolio.outcomes.inquiries'),
                t('home.portfolioData.projects.portfolio.outcomes.featured'),
              ],
              category: {
                id: 'portfolio',
                name: getCategoryTranslation('portfolio', 'projects'),
                color: '#FF6B6B',
              },
              featured: true,
            },
            {
              id: '4',
              title: t('home.portfolioData.projects.weather.title'),
              description: t('home.portfolioData.projects.weather.description'),
              technologies: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API', 'Mapbox'],
              images: ['/images/projects/weather-1.jpg'],
              liveUrl: 'https://weather-dashboard.demo.com',
              repositoryUrl: 'https://github.com/username/weather-dashboard',
              role: t('home.portfolioData.projects.weather.role'),
              challenges: [
                t('home.portfolioData.projects.weather.challenges.apis'),
                t('home.portfolioData.projects.weather.challenges.visualizations'),
                t('home.portfolioData.projects.weather.challenges.geolocation'),
              ],
              outcomes: [
                t('home.portfolioData.projects.weather.outcomes.users'),
                t('home.portfolioData.projects.weather.outcomes.accuracy'),
                t('home.portfolioData.projects.weather.outcomes.feedback'),
              ],
              category: {
                id: 'web-app',
                name: getCategoryTranslation('web-app', 'projects'),
                color: '#4FC08D',
              },
              featured: false,
            },
            {
              id: '5',
              title: t('home.portfolioData.projects.microservices.title'),
              description: t('home.portfolioData.projects.microservices.description'),
              technologies: ['Node.js', 'Docker', 'Kubernetes', 'Redis', 'PostgreSQL', 'AWS'],
              images: ['/images/projects/microservices-1.jpg'],
              repositoryUrl: 'https://github.com/username/fintech-microservices',
              role: t('home.portfolioData.projects.microservices.role'),
              challenges: [
                t('home.portfolioData.projects.microservices.challenges.communication'),
                t('home.portfolioData.projects.microservices.challenges.monitoring'),
                t('home.portfolioData.projects.microservices.challenges.consistency'),
              ],
              outcomes: [
                t('home.portfolioData.projects.microservices.outcomes.deployment'),
                t('home.portfolioData.projects.microservices.outcomes.reliability'),
                t('home.portfolioData.projects.microservices.outcomes.scaling'),
              ],
              category: {
                id: 'infrastructure',
                name: getCategoryTranslation('infrastructure', 'projects'),
                color: '#FF9900',
              },
              featured: false,
            },
          ],
          categories: [
            {
              id: 'web-app',
              name: getCategoryTranslation('web-app', 'projects'),
              color: '#4FC08D',
            },
            {
              id: 'api',
              name: getCategoryTranslation('api', 'projects'),
              color: '#339933',
            },
            {
              id: 'portfolio',
              name: getCategoryTranslation('portfolio', 'projects'),
              color: '#FF6B6B',
            },
            {
              id: 'infrastructure',
              name: getCategoryTranslation('infrastructure', 'projects'),
              color: '#FF9900',
            },
          ],
          featuredProjects: [],
        },
        contact: {
          form: {
            name: '',
            email: '',
            message: '',
          },
          contactMethods: [],
          socialLinks: [],
          availability: 'available',
        },
      }
    } catch (err) {
      error.value = 'Failed to load portfolio data'
      console.error('Portfolio data loading error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    if (portfolioData.value?.personal) {
      portfolioData.value.personal = { ...portfolioData.value.personal, ...info }
    }
  }

  return {
    portfolioData: readonly(portfolioData),
    isLoading: readonly(isLoading),
    error: readonly(error),
    personalInfo,
    companies,
    certifications,
    skills,
    projects,
    featuredProjects,
    skillsByCategory,
    loadPortfolioData,
    updatePersonalInfo,
  }
})
