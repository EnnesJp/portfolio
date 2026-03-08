export interface ThemeConfig {
  name: 'light' | 'dark'
  colors: ColorPalette
  typography: TypographyConfig
  animations: ThemeAnimationConfig
  shadows: ShadowConfig
  spacing: SpacingConfig
}

export interface ColorPalette {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  textSecondary: string
  accent: string
  border: string
  success: string
  warning: string
  error: string
  info: string
}

export interface TypographyConfig {
  fontFamilyPrimary: string
  fontFamilySecondary: string
  fontSizeBase: string
  fontSizeSmall: string
  fontSizeLarge: string
  fontSizeXLarge: string
  lineHeightBase: string
  lineHeightTight: string
  lineHeightLoose: string
  fontWeightNormal: string
  fontWeightMedium: string
  fontWeightBold: string
}

export interface ShadowConfig {
  light: string
  medium: string
  heavy: string
  colored: string
}

export interface SpacingConfig {
  borderRadius: string
  borderRadiusSmall: string
  borderRadiusLarge: string
}

export interface ThemeAnimationConfig {
  transitionFast: string
  transitionMedium: string
  transitionSlow: string
  easingDefault: string
  easingBounce: string
}

export interface NavigationSection {
  id: string
  label: string
  order: number
  visible: boolean
  element?: Element
}

export interface PortfolioData {
  personal: PersonalInfo
  presentation: PresentationData
  about: AboutData
  companies: CompaniesData
  certifications: CertificationsData
  skills: SkillsData
  projects: ProjectsData
  contact: ContactData
}

export interface PersonalInfo {
  name: string
  title: string
  location: string
  email: string
  phone?: string
  website?: string
  avatar: string
  resume?: string
}

export interface PresentationData {
  name: string
  title: string
  summary: string
  ctaButtons: CTAButton[]
  backgroundAnimation?: ComponentAnimationConfig
}

export interface CTAButton {
  label: string
  action: string
  variant: 'primary' | 'secondary'
}

export interface ComponentAnimationConfig {
  type: string
  duration: number
  delay?: number
}

export interface AboutData {
  personalInfo: PersonalInfo
  professionalJourney: JourneyItem[]
  values: string[]
  interests: string[]
}

export interface JourneyItem {
  id: string
  title: string
  description: string
  date: string
  type: 'education' | 'experience' | 'achievement'
}

export interface CompaniesData {
  companies: Company[]
  displayMode: 'timeline' | 'grid'
}

export interface Company {
  id: string
  name: string
  logo: string
  position: string
  period: DateRange
  description: string
  achievements: string[]
  technologies: string[]
}

export interface DateRange {
  start: Date
  end?: Date
}

export interface CertificationsData {
  certifications: Certification[]
  categories: CertificationCategory[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: Date
  credentialId?: string
  verificationUrl?: string
  badge?: string
  category: CertificationCategory
}

export interface CertificationCategory {
  id: string
  name: string
  color: string
}

export interface SkillsData {
  skills: Skill[]
  categories: SkillCategory[]
  displayMode: 'grid' | 'list' | 'chart'
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  proficiency: number
  yearsOfExperience: number
  projects?: number
  icon?: string
}

export interface SkillCategory {
  id: string
  name: string
  color: string
}

export interface ProjectsData {
  projects: Project[]
  categories: ProjectCategory[]
  featuredProjects: Project[]
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  images: string[]
  liveUrl?: string
  repositoryUrl?: string
  role: string
  challenges: string[]
  outcomes: string[]
  category: ProjectCategory
  featured: boolean
}

export interface ProjectCategory {
  id: string
  name: string
  color: string
}

export interface ContactData {
  form: ContactForm
  contactMethods: ContactMethod[]
  socialLinks: SocialLink[]
  availability: AvailabilityStatus
}

export interface ContactForm {
  name: string
  email: string
  budget?: string
  message: string
}

export interface ContactMethod {
  id: string
  type: 'email' | 'phone' | 'social'
  label: string
  value: string
  icon: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
}

export type AvailabilityStatus = 'available' | 'busy' | 'unavailable'

export type SupportedLanguage = 'en' | 'pt'

export interface LanguageConfig {
  code: SupportedLanguage
  name: string
  flag: string
  rtl: boolean
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  autoClose?: boolean
}