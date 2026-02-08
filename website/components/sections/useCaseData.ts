export interface UseCase {
  id: string
  title: string
  subtitle: string
  description: string
  iconPaths: string[]
}

export const useCases: UseCase[] = [
  {
    id: 'sales-teams',
    title: 'Win More Deals',
    subtitle: 'For Sales Teams',
    description: 'Create winning pitch decks that close deals. Customize presentations for every prospect in minutes, not hours.',
    iconPaths: ['M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z']
  },
  {
    id: 'marketing-teams',
    title: 'Showcase Results',
    subtitle: 'For Marketing',
    description: 'Build campaign decks, reports, and stakeholder presentations that showcase your impact with compelling data.',
    iconPaths: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z']
  },
  {
    id: 'executives',
    title: 'Present with Confidence',
    subtitle: 'For Executives',
    description: 'Deliver board presentations and strategic updates with polish and confidence. Focus on the message, not the slides.',
    iconPaths: ['M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z']
  },
  {
    id: 'consultants',
    title: 'Deliver Insights',
    subtitle: 'For Consultants',
    description: 'Package recommendations and findings into polished client deliverables. Maintain brand consistency across projects.',
    iconPaths: ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z']
  },
  {
    id: 'educators',
    title: 'Engage Students',
    subtitle: 'For Educators',
    description: 'Create engaging lesson presentations that keep students focused. Save hours on slide design and spend time teaching.',
    iconPaths: ['M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253']
  },
  {
    id: 'founders',
    title: 'Secure Funding',
    subtitle: 'For Founders',
    description: 'Build investor-ready pitch decks that tell your story. From seed to Series A, nail the narrative that gets you funded.',
    iconPaths: ['M13 7h8m0 0v8m0-8l-8 8-4-4-6 6']
  }
]
