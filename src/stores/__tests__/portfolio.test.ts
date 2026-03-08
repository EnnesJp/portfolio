import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { fc, test } from '@fast-check/vitest'
import { usePortfolioStore } from '../portfolio'

describe('Portfolio Store', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia({
      createSpy: vi.fn,
    }))
    
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test.prop([
    fc.record({
      personal: fc.record({
        name: fc.string({ minLength: 1, maxLength: 100 }),
        title: fc.string({ minLength: 1, maxLength: 100 }),
        location: fc.string({ minLength: 1, maxLength: 100 }),
        email: fc.emailAddress(),
        avatar: fc.string({ minLength: 1, maxLength: 200 }),
        phone: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
        website: fc.option(fc.webUrl()),
        resume: fc.option(fc.string({ minLength: 1, maxLength: 200 })),
      }),
      companies: fc.record({
        companies: fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            logo: fc.string({ minLength: 1, maxLength: 200 }),
            position: fc.string({ minLength: 1, maxLength: 100 }),
            description: fc.string({ minLength: 1, maxLength: 500 }),
            achievements: fc.array(fc.string({ minLength: 1, maxLength: 200 })),
            technologies: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
          }),
          { maxLength: 5 }
        ),
        displayMode: fc.constantFrom('timeline', 'grid'),
      }),
      skills: fc.record({
        skills: fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            proficiency: fc.integer({ min: 1, max: 5 }),
            yearsOfExperience: fc.integer({ min: 0, max: 20 }),
            projects: fc.option(fc.integer({ min: 0, max: 50 })),
            icon: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
            category: fc.record({
              id: fc.string({ minLength: 1, maxLength: 50 }),
              name: fc.string({ minLength: 1, maxLength: 100 }),
              color: fc.string({ minLength: 1, maxLength: 20 }),
            }),
          }),
          { maxLength: 10 }
        ),
        categories: fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            color: fc.string({ minLength: 1, maxLength: 20 }),
          }),
          { maxLength: 5 }
        ),
        displayMode: fc.constantFrom('grid', 'list', 'chart'),
      }),
      projects: fc.record({
        projects: fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            description: fc.string({ minLength: 1, maxLength: 500 }),
            technologies: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
            images: fc.array(fc.string({ minLength: 1, maxLength: 200 })),
            liveUrl: fc.option(fc.webUrl()),
            repositoryUrl: fc.option(fc.webUrl()),
            role: fc.string({ minLength: 1, maxLength: 100 }),
            challenges: fc.array(fc.string({ minLength: 1, maxLength: 200 })),
            outcomes: fc.array(fc.string({ minLength: 1, maxLength: 200 })),
            featured: fc.boolean(),
            category: fc.record({
              id: fc.string({ minLength: 1, maxLength: 50 }),
              name: fc.string({ minLength: 1, maxLength: 100 }),
              color: fc.string({ minLength: 1, maxLength: 20 }),
            }),
          }),
          { maxLength: 8 }
        ),
        categories: fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            color: fc.string({ minLength: 1, maxLength: 20 }),
          }),
          { maxLength: 5 }
        ),
        featuredProjects: fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            featured: fc.constant(true),
          }),
          { maxLength: 3 }
        ),
      }),
      certifications: fc.record({
        certifications: fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            issuer: fc.string({ minLength: 1, maxLength: 100 }),
            credentialId: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
            verificationUrl: fc.option(fc.webUrl()),
            badge: fc.option(fc.string({ minLength: 1, maxLength: 200 })),
            category: fc.record({
              id: fc.string({ minLength: 1, maxLength: 50 }),
              name: fc.string({ minLength: 1, maxLength: 100 }),
              color: fc.string({ minLength: 1, maxLength: 20 }),
            }),
          }),
          { maxLength: 10 }
        ),
        categories: fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            color: fc.string({ minLength: 1, maxLength: 20 }),
          }),
          { maxLength: 5 }
        ),
      }),
    })
  ])('should contain all required content fields when portfolio data is loaded', (portfolioData) => {
    const store = usePortfolioStore()
    
    store.$patch({ portfolioData })
    
    const personalInfo = store.personalInfo
    expect(personalInfo).toBeDefined()
    expect(personalInfo?.name).toBeDefined()
    expect(personalInfo?.title).toBeDefined()
    expect(personalInfo?.location).toBeDefined()
    expect(personalInfo?.email).toBeDefined()
    expect(personalInfo?.avatar).toBeDefined()
    
    const companies = store.companies
    expect(Array.isArray(companies)).toBe(true)
    companies.forEach(company => {
      expect(company.id).toBeDefined()
      expect(company.name).toBeDefined()
      expect(company.logo).toBeDefined()
      expect(company.position).toBeDefined()
      expect(company.description).toBeDefined()
      expect(Array.isArray(company.achievements)).toBe(true)
      expect(Array.isArray(company.technologies)).toBe(true)
    })
    
    const skills = store.skills
    expect(Array.isArray(skills)).toBe(true)
    skills.forEach(skill => {
      expect(skill.id).toBeDefined()
      expect(skill.name).toBeDefined()
      expect(typeof skill.proficiency).toBe('number')
      expect(skill.proficiency).toBeGreaterThanOrEqual(1)
      expect(skill.proficiency).toBeLessThanOrEqual(5)
      expect(typeof skill.yearsOfExperience).toBe('number')
      expect(skill.category).toBeDefined()
      expect(skill.category.id).toBeDefined()
      expect(skill.category.name).toBeDefined()
    })
    
    const projects = store.projects
    expect(Array.isArray(projects)).toBe(true)
    projects.forEach(project => {
      expect(project.id).toBeDefined()
      expect(project.title).toBeDefined()
      expect(project.description).toBeDefined()
      expect(Array.isArray(project.technologies)).toBe(true)
      expect(Array.isArray(project.images)).toBe(true)
      expect(project.role).toBeDefined()
      expect(Array.isArray(project.challenges)).toBe(true)
      expect(Array.isArray(project.outcomes)).toBe(true)
      expect(typeof project.featured).toBe('boolean')
      expect(project.category).toBeDefined()
    })
    
    const certifications = store.certifications
    expect(Array.isArray(certifications)).toBe(true)
    certifications.forEach(certification => {
      expect(certification.id).toBeDefined()
      expect(certification.name).toBeDefined()
      expect(certification.issuer).toBeDefined()
      expect(certification.category).toBeDefined()
      expect(certification.category.id).toBeDefined()
      expect(certification.category.name).toBeDefined()
    })
  })

  test.prop([
    fc.array(
      fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        title: fc.string({ minLength: 1, maxLength: 100 }),
        featured: fc.boolean(),
      }),
      { minLength: 0, maxLength: 10 }
    )
  ])('should return correct featured projects', (projectsData) => {
    const store = usePortfolioStore()
    
    const portfolioData = {
      projects: {
        projects: projectsData.map(p => ({
          ...p,
          description: 'Test description',
          technologies: ['Test'],
          images: [],
          role: 'Developer',
          challenges: [],
          outcomes: [],
          category: { id: '1', name: 'Test', color: 'blue' },
        })),
        categories: [],
        featuredProjects: [],
      },
    }
    
    store.$patch({ portfolioData })
    
    const featuredProjects = store.featuredProjects
    const expectedFeaturedCount = Math.min(
      projectsData.filter(p => p.featured).length,
      3
    )
    
    expect(featuredProjects).toHaveLength(expectedFeaturedCount)
    featuredProjects.forEach(project => {
      expect(project.featured).toBe(true)
    })
  })

  test.prop([
    fc.array(
      fc.record({
        id: fc.string({ minLength: 1, maxLength: 50 }),
        name: fc.string({ minLength: 1, maxLength: 100 }),
        category: fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
        }),
      }),
      { minLength: 0, maxLength: 15 }
    )
  ])('should categorize skills correctly', (skillsData) => {
    const store = usePortfolioStore()
    
    const portfolioData = {
      skills: {
        skills: skillsData.map(s => ({
          ...s,
          proficiency: 3,
          yearsOfExperience: 2,
          category: {
            id: s.category.name,
            name: s.category.name,
            color: 'blue',
          },
        })),
        categories: [],
        displayMode: 'grid' as const,
      },
    }
    
    store.$patch({ portfolioData })
    
    const skillsByCategory = store.skillsByCategory
    
    const totalSkillsInCategories = Array.from(skillsByCategory.values())
      .reduce((sum, skills) => sum + skills.length, 0)
    
    expect(totalSkillsInCategories).toBe(skillsData.length)
    
    skillsByCategory.forEach((skills, categoryName) => {
      skills.forEach(skill => {
        expect(skill.category.name).toBe(categoryName)
      })
    })
  })
})