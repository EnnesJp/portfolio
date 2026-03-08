import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { PortfolioData, PersonalInfo, Company, Certification, Skill, Project } from '@/types'

export const usePortfolioStore = defineStore('portfolio', () => {
  const portfolioData = ref<PortfolioData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const personalInfo = computed(() => portfolioData.value?.personal)
  const companies = computed(() => portfolioData.value?.companies?.companies || [])
  const certifications = computed(() => portfolioData.value?.certifications?.certifications || [])
  const skills = computed(() => portfolioData.value?.skills?.skills || [])
  const projects = computed(() => portfolioData.value?.projects?.projects || [])
  
  const featuredProjects = computed(() => 
    projects.value.filter(p => p.featured).slice(0, 3)
  )
  
  const skillsByCategory = computed(() => {
    const categories = new Map<string, Skill[]>()
    skills.value.forEach(skill => {
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
          avatar: new URL('@/assets/images/self-img.jpeg', import.meta.url).href
        },
        presentation: {
          name: 'João Pedro Ennes',
          title: 'Software Engineer',
          summary: 'Passionate about creating amazing digital experiences with modern technologies and clean code.',
          ctaButtons: [
            {
              label: 'View My Work',
              action: 'projects',
              variant: 'primary'
            },
            {
              label: 'Get In Touch',
              action: 'contact',
              variant: 'secondary'
            }
          ]
        },
        about: {
          personalInfo: {
            name: 'Portfolio Owner',
            title: 'Software Developer',
            location: 'Location',
            email: 'contact@portfolio.com',
            avatar: '/images/avatar.jpg'
          },
          professionalJourney: [],
          values: [],
          interests: []
        },
        companies: {
          companies: [
            {
              id: '1',
              name: 'Tech Solutions Inc.',
              logo: '/images/companies/tech-solutions.png',
              position: 'Senior Full Stack Developer',
              period: {
                start: new Date('2022-01-01'),
                end: undefined
              },
              description: 'Leading development of enterprise web applications using modern technologies.',
              achievements: [
                'Improved application performance by 40%',
                'Led a team of 5 developers',
                'Implemented CI/CD pipeline reducing deployment time by 60%'
              ],
              technologies: ['Vue.js', 'Node.js', 'TypeScript', 'AWS', 'Docker']
            },
            {
              id: '2',
              name: 'Digital Agency Co.',
              logo: '/images/companies/digital-agency.png',
              position: 'Full Stack Developer',
              period: {
                start: new Date('2020-06-01'),
                end: new Date('2021-12-31')
              },
              description: 'Developed custom web solutions for various clients across different industries.',
              achievements: [
                'Delivered 15+ successful projects',
                'Reduced client onboarding time by 50%',
                'Mentored junior developers'
              ],
              technologies: ['React', 'Laravel', 'MySQL', 'JavaScript', 'PHP']
            },
            {
              id: '3',
              name: 'StartupXYZ',
              logo: '/images/companies/startup-xyz.png',
              position: 'Frontend Developer',
              period: {
                start: new Date('2019-03-01'),
                end: new Date('2020-05-31')
              },
              description: 'Built responsive web applications and mobile-first interfaces.',
              achievements: [
                'Increased user engagement by 35%',
                'Implemented responsive design system',
                'Optimized loading times by 45%'
              ],
              technologies: ['Vue.js', 'SCSS', 'JavaScript', 'Webpack', 'Git']
            }
          ],
          displayMode: 'timeline'
        },
        certifications: {
          certifications: [
            {
              id: '1',
              name: 'AWS Certified Solutions Architect',
              issuer: 'Amazon Web Services',
              date: new Date('2023-06-15'),
              credentialId: 'AWS-SAA-123456',
              verificationUrl: 'https://aws.amazon.com/verification',
              badge: '/images/badges/aws-saa.png',
              category: {
                id: 'cloud',
                name: 'Cloud Computing',
                color: '#FF9900'
              }
            },
            {
              id: '2',
              name: 'Vue.js Certified Developer',
              issuer: 'Vue.js Foundation',
              date: new Date('2023-03-20'),
              credentialId: 'VUE-DEV-789012',
              verificationUrl: 'https://vuejs.org/verification',
              badge: '/images/badges/vue-certified.png',
              category: {
                id: 'frontend',
                name: 'Frontend Development',
                color: '#4FC08D'
              }
            },
            {
              id: '3',
              name: 'Professional Scrum Master I',
              issuer: 'Scrum.org',
              date: new Date('2022-11-10'),
              credentialId: 'PSM-345678',
              verificationUrl: 'https://scrum.org/verification',
              badge: '/images/badges/psm-1.png',
              category: {
                id: 'management',
                name: 'Project Management',
                color: '#0066CC'
              }
            },
            {
              id: '4',
              name: 'Google Cloud Professional Developer',
              issuer: 'Google Cloud',
              date: new Date('2023-01-25'),
              credentialId: 'GCP-DEV-901234',
              verificationUrl: 'https://cloud.google.com/verification',
              badge: '/images/badges/gcp-dev.png',
              category: {
                id: 'cloud',
                name: 'Cloud Computing',
                color: '#FF9900'
              }
            },
            {
              id: '5',
              name: 'MongoDB Certified Developer',
              issuer: 'MongoDB University',
              date: new Date('2022-08-30'),
              credentialId: 'MONGO-DEV-567890',
              verificationUrl: 'https://university.mongodb.com/verification',
              badge: '/images/badges/mongodb-dev.png',
              category: {
                id: 'database',
                name: 'Database',
                color: '#47A248'
              }
            }
          ],
          categories: [
            {
              id: 'cloud',
              name: 'Cloud Computing',
              color: '#FF9900'
            },
            {
              id: 'frontend',
              name: 'Frontend Development',
              color: '#4FC08D'
            },
            {
              id: 'management',
              name: 'Project Management',
              color: '#0066CC'
            },
            {
              id: 'database',
              name: 'Database',
              color: '#47A248'
            }
          ]
        },
        skills: {
          skills: [
            {
              id: '1',
              name: 'Vue.js',
              category: {
                id: 'frontend',
                name: 'Frontend',
                color: '#4FC08D'
              },
              proficiency: 5,
              yearsOfExperience: 4,
              projects: 12,
              icon: '/images/icons/vue.svg'
            },
            {
              id: '2',
              name: 'TypeScript',
              category: {
                id: 'frontend',
                name: 'Frontend',
                color: '#4FC08D'
              },
              proficiency: 4,
              yearsOfExperience: 3,
              projects: 10,
              icon: '/images/icons/typescript.svg'
            },
            {
              id: '3',
              name: 'Node.js',
              category: {
                id: 'backend',
                name: 'Backend',
                color: '#339933'
              },
              proficiency: 4,
              yearsOfExperience: 3,
              projects: 8,
              icon: '/images/icons/nodejs.svg'
            },
            {
              id: '4',
              name: 'Python',
              category: {
                id: 'backend',
                name: 'Backend',
                color: '#339933'
              },
              proficiency: 3,
              yearsOfExperience: 2,
              projects: 5,
              icon: '/images/icons/python.svg'
            },
            {
              id: '5',
              name: 'AWS',
              category: {
                id: 'cloud',
                name: 'Cloud & DevOps',
                color: '#FF9900'
              },
              proficiency: 4,
              yearsOfExperience: 2,
              projects: 6,
              icon: '/images/icons/aws.svg'
            },
            {
              id: '6',
              name: 'Docker',
              category: {
                id: 'cloud',
                name: 'Cloud & DevOps',
                color: '#FF9900'
              },
              proficiency: 3,
              yearsOfExperience: 2,
              projects: 7,
              icon: '/images/icons/docker.svg'
            },
            {
              id: '7',
              name: 'PostgreSQL',
              category: {
                id: 'database',
                name: 'Database',
                color: '#336791'
              },
              proficiency: 4,
              yearsOfExperience: 3,
              projects: 9,
              icon: '/images/icons/postgresql.svg'
            },
            {
              id: '8',
              name: 'MongoDB',
              category: {
                id: 'database',
                name: 'Database',
                color: '#336791'
              },
              proficiency: 3,
              yearsOfExperience: 2,
              projects: 4,
              icon: '/images/icons/mongodb.svg'
            }
          ],
          categories: [
            {
              id: 'frontend',
              name: 'Frontend',
              color: '#4FC08D'
            },
            {
              id: 'backend',
              name: 'Backend',
              color: '#339933'
            },
            {
              id: 'cloud',
              name: 'Cloud & DevOps',
              color: '#FF9900'
            },
            {
              id: 'database',
              name: 'Database',
              color: '#336791'
            }
          ],
          displayMode: 'grid'
        },
        projects: {
          projects: [
            {
              id: '1',
              title: 'E-Commerce Platform',
              description: 'A modern e-commerce platform built with Vue.js and Node.js, featuring real-time inventory management, payment processing, and admin dashboard.',
              technologies: ['Vue.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'AWS'],
              images: [
                '/images/projects/ecommerce-1.jpg',
                '/images/projects/ecommerce-2.jpg',
                '/images/projects/ecommerce-3.jpg'
              ],
              liveUrl: 'https://ecommerce-demo.portfolio.com',
              repositoryUrl: 'https://github.com/username/ecommerce-platform',
              role: 'Full Stack Developer',
              challenges: [
                'Implementing real-time inventory synchronization',
                'Optimizing database queries for large product catalogs',
                'Ensuring PCI compliance for payment processing'
              ],
              outcomes: [
                'Increased conversion rate by 25%',
                'Reduced page load time by 40%',
                'Successfully processed $100K+ in transactions'
              ],
              category: {
                id: 'web-app',
                name: 'Web Application',
                color: '#4FC08D'
              },
              featured: true
            },
            {
              id: '2',
              title: 'Task Management API',
              description: 'RESTful API for task management with team collaboration features, built with Node.js and MongoDB.',
              technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Socket.io', 'Docker'],
              images: [
                '/images/projects/task-api-1.jpg',
                '/images/projects/task-api-2.jpg'
              ],
              repositoryUrl: 'https://github.com/username/task-management-api',
              role: 'Backend Developer',
              challenges: [
                'Designing scalable database schema',
                'Implementing real-time notifications',
                'Ensuring data consistency across team operations'
              ],
              outcomes: [
                'Supports 1000+ concurrent users',
                'Achieved 99.9% uptime',
                'Reduced task completion time by 30%'
              ],
              category: {
                id: 'api',
                name: 'API Development',
                color: '#339933'
              },
              featured: true
            },
            {
              id: '3',
              title: 'Portfolio Website',
              description: 'Personal portfolio website showcasing projects and skills, built with Vue.js and modern web technologies.',
              technologies: ['Vue.js', 'TypeScript', 'Pinia', 'SCSS', 'Vite'],
              images: [
                '/images/projects/portfolio-1.jpg',
                '/images/projects/portfolio-2.jpg'
              ],
              liveUrl: 'https://portfolio.demo.com',
              repositoryUrl: 'https://github.com/username/portfolio',
              role: 'Frontend Developer & Designer',
              challenges: [
                'Creating smooth animations and transitions',
                'Implementing responsive design across all devices',
                'Optimizing performance and accessibility'
              ],
              outcomes: [
                'Achieved 95+ Lighthouse score',
                'Increased client inquiries by 50%',
                'Featured in design showcases'
              ],
              category: {
                id: 'portfolio',
                name: 'Portfolio',
                color: '#FF6B6B'
              },
              featured: true
            },
            {
              id: '4',
              title: 'Weather Dashboard',
              description: 'Real-time weather dashboard with location-based forecasts and interactive maps.',
              technologies: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API', 'Mapbox'],
              images: [
                '/images/projects/weather-1.jpg'
              ],
              liveUrl: 'https://weather-dashboard.demo.com',
              repositoryUrl: 'https://github.com/username/weather-dashboard',
              role: 'Frontend Developer',
              challenges: [
                'Integrating multiple weather APIs',
                'Creating responsive data visualizations',
                'Handling geolocation and permissions'
              ],
              outcomes: [
                'Serves 10K+ daily active users',
                'Accurate forecasts with 95% reliability',
                'Positive user feedback (4.8/5 rating)'
              ],
              category: {
                id: 'web-app',
                name: 'Web Application',
                color: '#4FC08D'
              },
              featured: false
            },
            {
              id: '5',
              title: 'Microservices Architecture',
              description: 'Scalable microservices architecture for a fintech application with Docker and Kubernetes.',
              technologies: ['Node.js', 'Docker', 'Kubernetes', 'Redis', 'PostgreSQL', 'AWS'],
              images: [
                '/images/projects/microservices-1.jpg'
              ],
              repositoryUrl: 'https://github.com/username/fintech-microservices',
              role: 'DevOps Engineer',
              challenges: [
                'Designing service communication patterns',
                'Implementing distributed logging and monitoring',
                'Ensuring data consistency across services'
              ],
              outcomes: [
                'Reduced deployment time by 70%',
                'Improved system reliability to 99.95%',
                'Enabled horizontal scaling for peak loads'
              ],
              category: {
                id: 'infrastructure',
                name: 'Infrastructure',
                color: '#FF9900'
              },
              featured: false
            }
          ],
          categories: [
            {
              id: 'web-app',
              name: 'Web Application',
              color: '#4FC08D'
            },
            {
              id: 'api',
              name: 'API Development',
              color: '#339933'
            },
            {
              id: 'portfolio',
              name: 'Portfolio',
              color: '#FF6B6B'
            },
            {
              id: 'infrastructure',
              name: 'Infrastructure',
              color: '#FF9900'
            }
          ],
          featuredProjects: []
        },
        contact: {
          form: {
            name: '',
            email: '',
            message: ''
          },
          contactMethods: [],
          socialLinks: [],
          availability: 'available'
        }
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
    updatePersonalInfo
  }
})