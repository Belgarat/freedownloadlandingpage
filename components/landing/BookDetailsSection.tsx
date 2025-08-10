'use client'

import { Palette } from 'lucide-react'
import { useConfig } from '@/lib/useConfig'
import CountdownTimer from '@/components/CountdownTimer'

interface BookDetailsSectionProps {
  className?: string
  offerEndDate?: string
}

export default function BookDetailsSection({ className = '', offerEndDate }: BookDetailsSectionProps) {
  const { book, content, layout } = useConfig()
  const aboutBookHtml = (book?.description && book.description.trim()) ? book.description : (content?.aboutBook || '')
  const authorBioHtml = (book?.authorBio && book.authorBio.trim()) ? book.authorBio : (content?.authorBio || '')
  const isMinimal = false // TODO: Get from theme config when available

  return (
    <div className={`space-y-6 sm:space-y-8 ${className}`}>
      {/* Description */}
      <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
        <h3 className="text-lg font-semibold text-white mb-4">About the Book</h3>
        <div className="prose prose-invert max-w-none text-theme-secondary mb-4 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: aboutBookHtml }} />
        <div className="rounded p-3 mt-4 border" style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 20%, transparent)', borderColor: 'color-mix(in srgb, var(--color-background) 80%, white 20%)' }}>
          <p className="text-sm text-theme-primary font-medium text-center flex items-center justify-center gap-2">
            <Palette className="w-4 h-4 text-[var(--color-accent)]" />
            All interior illustrations are original works by the author
          </p>
        </div>
      </div>

      {/* Countdown Timer - Desktop Only */}
      {layout?.showCountdown === true && offerEndDate && (
        <div className="hidden lg:block">
          <CountdownTimer endDate={offerEndDate} className="mb-4" />
        </div>
      )}

      {/* Author Bio */}
      <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
        <h3 className="text-lg font-semibold text-white mb-4">About the Author</h3>
        <div className="prose prose-invert max-w-none text-theme-secondary text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: authorBioHtml }} />
      </div>

      {/* Stories */}
      {layout?.showStories === true && (content?.stories?.length ?? 0) > 0 && (
        <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
          <h3 className="text-lg font-semibold text-white mb-4">Stories</h3>
          <div className="space-y-6">
            {content!.stories.map((story, idx) => (
              <div key={idx} className="space-y-2">
                {story.title && <h4 className="text-theme-primary font-semibold">{story.title}</h4>}
                {story.description && <p className="text-theme-secondary text-sm">{story.description}</p>}
                {story.content && (
                  <div className="prose prose-invert max-w-none text-theme-secondary text-sm" dangerouslySetInnerHTML={{ __html: story.content }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials */}
      {layout?.showTestimonials === true && (content?.testimonials?.length ?? 0) > 0 && (
        <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
          <h3 className="text-lg font-semibold text-white mb-4">Testimonials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content!.testimonials.map((t, idx) => (
              <div key={idx} className="rounded border surface-alpha p-4">
                <p className="text-theme-secondary text-sm">"{t.text}"</p>
                <div className="mt-2 text-xs text-theme-muted">{t.author}{t.source ? ` — ${t.source}` : ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards */}
      {layout?.showAwards === true && (book?.awards?.length ?? 0) > 0 && (
        <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
          <h3 className="text-lg font-semibold text-white mb-4">Awards</h3>
          <div className="flex flex-wrap gap-2">
            {book!.awards.map((a, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full border text-xs surface">
                {a.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Rankings */}
      {layout?.showRankings === true && book?.rankings && (
        <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border surface-alpha">
          <h3 className="text-lg font-semibold text-white mb-4">Rankings</h3>
          <ul className="list-disc pl-5 text-theme-secondary text-sm space-y-1">
            {book.rankings.kindleStore && <li>Kindle Store: {book.rankings.kindleStore}</li>}
            {book.rankings.sciFiAnthologies && <li>Sci-Fi Anthologies: {book.rankings.sciFiAnthologies}</li>}
            {book.rankings.cyberpunkSciFi && <li>Cyberpunk Sci-Fi: {book.rankings.cyberpunkSciFi}</li>}
            {book.rankings.cyberpunkBooks && <li>Cyberpunk Books: {book.rankings.cyberpunkBooks}</li>}
          </ul>
        </div>
      )}

      {/* Goodreads Link */}
      {!isMinimal && (
        <div className="backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 text-center border surface-alpha">
          <p className="text-teal-100 mb-3 text-sm">
            Support independent authors by adding this book to your Goodreads reading list
          </p>
          <a
            href={book?.goodreadsUrl || 'https://www.goodreads.com/'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[var(--color-secondary)] hover:bg-[color-mix(in_srgb,var(--color-secondary)_85%,black)] text-theme-primary font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
          >
            Add to Goodreads
          </a>
        </div>
      )}
    </div>
  )
}
