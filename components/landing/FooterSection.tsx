'use client'

import { useAnalytics } from '@/lib/useAnalytics'
import { useConfig } from '@/lib/useConfig'

interface FooterSectionProps {
  className?: string
}

export default function FooterSection({ className = '' }: FooterSectionProps) {
  const { trackPublisherClick } = useAnalytics()
  const { book, content } = useConfig()

  return (
    <div className={`mt-12 sm:mt-16 text-center text-teal-200 text-sm flex flex-col items-center gap-4 ${className}`}>
      <p className="text-theme-secondary">{content?.footer?.copyright || `© ${new Date().getFullYear()} ${book?.author || 'Michael B. Morgan'}. All rights reserved.`}</p>
      {content?.footer?.supportText && (
        <p className="text-xs text-teal-300" dangerouslySetInnerHTML={{ __html: content.footer.supportText }} />
      )}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <a href="/privacy" className="underline hover:text-white transition-colors">
          Privacy Policy
        </a>
      </div>
      <div className="flex flex-col items-center gap-2">
        <a 
            href={book?.publisherUrl || 'https://37indielab.com/'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block"
            onClick={trackPublisherClick}
          >
          <img src="/logo_transparent.png" alt="3/7 Indie Lab Logo" className="h-10 sm:h-12 mb-2" style={{maxWidth:'80px'}} />
        </a>
        <div className="text-xs text-theme-secondary max-w-md px-4">
          <strong className="text-theme-primary">{book?.publisher || '3/7 Indie Lab'}</strong> &mdash; {book?.publisherTagline || 'Be independent, be unique.'}<br/>
          {content?.footer?.copyright || 'At 3/7 Indie Lab, we are fiercely independent. We will always support authors who want to push the boundaries of the publishing market with independent writing.'}<br/>
                            <a
              href={book?.publisherUrl || 'https://37indielab.com/'}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-teal-300"
              onClick={trackPublisherClick}
            >
            {book?.publisherUrl?.replace('https://','') || 'www.37indielab.com'}
          </a>
          <br/>
          <span className="italic">3/7 Indie Lab is an author-centric imprint. Our mission is to help independent authors publish their books. All rights, responsibilities, and liabilities associated with the content and distribution of the books remain solely with the respective authors or other entities involved.</span>
        </div>
      </div>
    </div>
  )
}
