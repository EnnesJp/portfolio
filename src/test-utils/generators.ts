import { fc } from '@fast-check/vitest'

export const nonEmptyString = (options: { minLength?: number; maxLength?: number } = {}) =>
  fc
    .string({ minLength: options.minLength || 1, maxLength: options.maxLength || 100 })
    .filter((s) => s.trim().length > 0)

export const validNumber = (options: { min?: number; max?: number } = {}) =>
  fc
    .float({
      min: options.min || 0,
      max: options.max || 1000,
      noNaN: true,
      noDefaultInfinity: true,
    })
    .filter((n) => Math.abs(n) > 1e-10 || n === 0)

export const navigationSection = () =>
  fc.record({
    id: nonEmptyString({ maxLength: 20 }),
    label: nonEmptyString({ maxLength: 50 }),
    order: fc.integer({ min: 0, max: 10 }),
    visible: fc.boolean(),
  })

export const portfolioProject = () =>
  fc.record({
    id: nonEmptyString({ maxLength: 50 }),
    title: nonEmptyString({ maxLength: 100 }),
    description: nonEmptyString({ maxLength: 500 }),
    technologies: fc.array(nonEmptyString({ maxLength: 50 })),
    images: fc.array(nonEmptyString({ maxLength: 200 })),
    role: nonEmptyString({ maxLength: 100 }),
    challenges: fc.array(nonEmptyString({ maxLength: 200 })),
    outcomes: fc.array(nonEmptyString({ maxLength: 200 })),
    featured: fc.boolean(),
    category: fc.record({
      id: nonEmptyString({ maxLength: 50 }),
      name: nonEmptyString({ maxLength: 100 }),
      color: nonEmptyString({ maxLength: 20 }),
    }),
  })

export const skill = () =>
  fc.record({
    id: nonEmptyString({ maxLength: 50 }),
    name: nonEmptyString({ maxLength: 100 }),
    proficiency: fc.integer({ min: 1, max: 5 }),
    yearsOfExperience: fc.integer({ min: 0, max: 20 }),
    projects: fc.option(fc.integer({ min: 0, max: 50 })),
    icon: fc.option(nonEmptyString({ maxLength: 100 })),
    category: fc.record({
      id: nonEmptyString({ maxLength: 50 }),
      name: nonEmptyString({ maxLength: 50 }),
      color: nonEmptyString({ maxLength: 20 }),
    }),
  })
