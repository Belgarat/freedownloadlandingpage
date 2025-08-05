export const BOOK_CONFIG = {
  title: 'Fish Cannot Carry Guns',
  subtitle: 'A Collection of Speculative Sci-Fi Tales',
  author: 'Michael Morgan',
  authorBio: 'Is the snowflake responsible for the avalanche? I\'m a lifelong reader with a love for physics, psychology, and stories that ask hard questions, and don\'t always offer easy answers. Consultant by day, author by night. Proud father. Grateful husband. Based in the U.S., often on the move.',
  publisher: '3/7 Indie Lab',
  publisherUrl: 'https://37indielab.com',
  publisherTagline: 'Be independent, be unique.',
  amazonUrl: 'https://www.amazon.com/dp/B0DS55TQ8R',
  rating: 5.0,
  reviewCount: 1,
  publicationDate: 'July 9, 2025',
  isbn: '979-1298569133',
  asin: 'B0DS55TQ8R',
  fileSize: '2.1 MB',
  pageCount: 167,
  language: 'English',
  format: 'Kindle Edition',
  categories: ['SciFi', 'Dystopian', 'Cyberpunk', 'Androids', 'DangerForHumanity'],
  description: 'Fish Cannot Carry Guns is a collection of speculative short stories that delve into how technology fractures identity, erodes trust, and distorts reality. For fans of Black Mirror, cyberpunk noir, and fringe futurism, these slow-burning, unsettling tales challenge what it means to be human in a world ruled by code.',
  stories: [
    {
      title: 'Betrayal Circuit',
      description: 'Captain Stalworth believes he can trust Private Jude Veil. He is wrong.'
    },
    {
      title: 'Devil\'s Advocate',
      description: 'What if you were trapped in a cell... with the person who killed you?'
    },
    {
      title: 'The Old Man and the Fee',
      description: 'On an ordinary day in Siberia, something extraordinary fell from the sky.'
    },
    {
      title: 'All of a Sudden',
      description: 'James has been afraid all his life, but the heart of the forest won\'t stop calling him.'
    },
    {
      title: 'Fish Cannot Carry Guns',
      description: 'All his life, John had thought he was safe...'
    }
  ],
  awards: [
    {
      title: '2023 Whistler Independent Book Awards Fiction Winner',
      type: 'Winner'
    },
    {
      title: '2022 Chanticleer International Book Awards Literary & Contemporary Fiction Finalist',
      type: 'Finalist'
    }
  ],
  rankings: {
    kindleStore: '#820,022',
    sciFiAnthologies: '#1,452',
    cyberpunkSciFi: '#1,525',
    cyberpunkBooks: '#2,259'
  }
}

export const EMAIL_CONFIG = {
  senderName: 'Fish Cannot Carry Guns',
  senderEmail: 'noreply@fishcannotcarryguns.aroundscifi.us', // Updated with verified domain
  replyTo: 'info@37indielab.com',
  subjectPrefix: 'Your Free Ebook:',
  templateExpiryHours: 24,
  maxRetries: 3
}

export const SITE_CONFIG = {
  title: 'Fish Cannot Carry Guns - Free Ebook Sample',
  description: 'Download your free sample of Fish Cannot Carry Guns by Michael Morgan. A collection of speculative short stories for fans of Black Mirror and cyberpunk noir.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://fishcannotcarryguns.aroundscifi.us',
  theme: {
    primary: '#0f766e', // teal-700
    secondary: '#0891b2', // cyan-600
    accent: '#f59e0b', // amber-500
    background: 'linear-gradient(135deg, #0f766e, #0891b2, #1e40af)'
  }
} 