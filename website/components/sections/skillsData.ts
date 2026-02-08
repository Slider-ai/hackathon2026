export interface Style {
  id: string
  category: 'Sales' | 'Education' | 'Startup'
  title: string
  description: string
  iconPaths: string[]
}

// For backwards compatibility
export type Skill = Style

export const styles: Style[] = [
  // Sales
  {
    id: 'sales-pitch',
    category: 'Sales',
    title: 'Sales Pitch Builder',
    description: 'Create compelling pitch decks with proven frameworks for discovery, demo, and close.',
    iconPaths: ['M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z']
  },
  {
    id: 'proposal-generator',
    category: 'Sales',
    title: 'Proposal Generator',
    description: 'Build custom proposals fast. Auto-format pricing, terms, and case studies.',
    iconPaths: ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z']
  },
  {
    id: 'account-review',
    category: 'Sales',
    title: 'Account Review',
    description: 'Summarize deals, track pipeline, and present QBRs with data-driven insights.',
    iconPaths: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z']
  },
  // Education
  {
    id: 'lesson-plan',
    category: 'Education',
    title: 'Lesson Plan Creator',
    description: 'Build engaging lessons with activities, visuals, and assessments aligned to objectives.',
    iconPaths: ['M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253']
  },
  {
    id: 'course-overview',
    category: 'Education',
    title: 'Course Overview',
    description: 'Design full course decks with syllabi, schedules, and module breakdowns.',
    iconPaths: ['M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10']
  },
  {
    id: 'training-deck',
    category: 'Education',
    title: 'Training Deck',
    description: 'Onboard teams with structured training slides, exercises, and knowledge checks.',
    iconPaths: ['M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z']
  },
  // Startup
  {
    id: 'investor-pitch',
    category: 'Startup',
    title: 'Investor Pitch',
    description: 'Craft a compelling story with traction, market size, and financial projections.',
    iconPaths: ['M13 7h8m0 0v8m0-8l-8 8-4-4-6 6']
  },
  {
    id: 'product-roadmap',
    category: 'Startup',
    title: 'Product Roadmap',
    description: 'Visualize your product vision with timelines, milestones, and feature releases.',
    iconPaths: ['M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7']
  },
  {
    id: 'demo-day',
    category: 'Startup',
    title: 'Demo Day Slides',
    description: 'Nail your accelerator demo with punchy problem-solution-traction narrative.',
    iconPaths: ['M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122']
  }
]

export const stylesByCategory = styles.reduce((acc, style) => {
  if (!acc[style.category]) {
    acc[style.category] = []
  }
  acc[style.category].push(style)
  return acc
}, {} as Record<string, Style[]>)

// For backwards compatibility
export const skills = styles
export const skillsByCategory = stylesByCategory

export const categories = ['Sales', 'Education', 'Startup'] as const
