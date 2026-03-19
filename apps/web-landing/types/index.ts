export interface NavItem {
  label: string
  href: string
}

export interface Feature {
  icon: string
  title: string
  description: string
}

export interface Module {
  icon: string
  title: string
  description: string
  status: 'active' | 'coming-soon'
  tag?: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface Step {
  number: string
  title: string
  description: string
  icon: string
}

export interface BeforeAfterItem {
  before: string
  after: string
}

export interface CredibilityItem {
  icon: string
  text: string
}
