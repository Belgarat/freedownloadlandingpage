'use client'

import { useEffect, useState } from 'react'
import { MarketingConfig } from '@/lib/config-loader'

interface MarketingConfigEditorProps {
  config: MarketingConfig
  onChange: (config: MarketingConfig) => void
}

export default function MarketingConfigEditor({ config, onChange }: MarketingConfigEditorProps) {
  const [activeTab, setActiveTab] = useState<'offer' | 'primary' | 'social' | 'newsletter' | 'modals' | 'socialProof'>('offer')
  const formatDateTimeLocal = (date: Date) => {
    const tzoffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - tzoffset).toISOString().slice(0, 16)
  }

  // Default endDate to +30 days if empty
  useEffect(() => {
    if (!config.offer?.endDate || config.offer.endDate.trim() === '') {
      const in30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      onChange({
        ...config,
        offer: { ...config.offer, endDate: formatDateTimeLocal(in30) },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setEndDatePlus30 = () => {
    const in30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    onChange({ ...config, offer: { ...config.offer, endDate: formatDateTimeLocal(in30) } })
  }

  const tabs = [
    { id: 'offer', label: 'Offerta' },
    { id: 'primary', label: 'Primary CTA' },
    { id: 'social', label: 'Social' },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'modals', label: 'Modals' },
    { id: 'socialProof', label: 'Social Proof' },
  ] as const

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900">Impostazioni Marketing</h3>
        <p className="text-sm text-blue-700 mt-1">Usa i tab per gestire in modo lineare CTA, offerta, newsletter e prove sociali.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'offer' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Offerta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <div className="flex items-center gap-2">
              <input
                type="datetime-local"
                value={config.offer.endDate}
                onChange={(e) => onChange({ ...config, offer: { ...config.offer, endDate: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={setEndDatePlus30} className="px-2 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">+30 giorni</button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Con un click puoi spostare la scadenza di 30 giorni.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Testo "Offerta a tempo"</label>
            <input
              type="text"
              value={config.offer.limitedText}
              onChange={(e) => onChange({ ...config, offer: { ...config.offer, limitedText: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Limited time offer"
            />
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="isLimited" checked={config.offer.isLimited} onChange={(e) => onChange({ ...config, offer: { ...config.offer, isLimited: e.target.checked } })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="isLimited" className="text-sm text-gray-700">Mostra come offerta a tempo</label>
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'primary' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Primary CTA</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
          <input
            type="text"
            value={config.cta.primary.text}
            onChange={(e) => onChange({...config, cta: {...config.cta, primary: {...config.cta.primary, text: e.target.value}}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Download Free Ebook"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtext</label>
          <input
            type="text"
            value={config.cta.primary.subtext}
            onChange={(e) => onChange({...config, cta: {...config.cta, primary: {...config.cta.primary, subtext: e.target.value}}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Get your free copy now"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loading Text</label>
          <input
            type="text"
            value={config.cta.primary.loadingText}
            onChange={(e) => onChange({...config, cta: {...config.cta, primary: {...config.cta.primary, loadingText: e.target.value}}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Preparing download..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Success Text</label>
          <input
            type="text"
            value={config.cta.primary.successText}
            onChange={(e) => onChange({...config, cta: {...config.cta, primary: {...config.cta.primary, successText: e.target.value}}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Download started!"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Error Text</label>
          <input
            type="text"
            value={config.cta.primary.errorText}
            onChange={(e) => onChange({...config, cta: {...config.cta, primary: {...config.cta.primary, errorText: e.target.value}}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Something went wrong"
          />
        </div>
      </div>
      )}

      {activeTab === 'social' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social CTAs</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goodreads</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={config.cta.social.goodreads.text}
                onChange={(e) => {
                  const newConfig = {...config};
                  newConfig.cta.social.goodreads.text = e.target.value;
                  onChange(newConfig);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add to Goodreads"
              />
              <input
                type="url"
                value={config.cta.social.goodreads.url}
                onChange={(e) => {
                  const newConfig = {...config};
                  newConfig.cta.social.goodreads.url = e.target.value;
                  onChange(newConfig);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://goodreads.com/book/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amazon</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={config.cta.social.amazon.text}
                onChange={(e) => {
                  const newConfig = {...config};
                  newConfig.cta.social.amazon.text = e.target.value;
                  onChange(newConfig);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="View on Amazon"
              />
              <input
                type="url"
                value={config.cta.social.amazon.url}
                onChange={(e) => {
                  const newConfig = {...config};
                  newConfig.cta.social.amazon.url = e.target.value;
                  onChange(newConfig);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://amazon.com/dp/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={config.cta.social.publisher.text}
                onChange={(e) => {
                  const newConfig = {...config};
                  newConfig.cta.social.publisher.text = e.target.value;
                  onChange(newConfig);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Visit Publisher"
              />
              <input
                type="url"
                value={config.cta.social.publisher.url}
                onChange={(e) => {
                  const newConfig = {...config};
                  newConfig.cta.social.publisher.url = e.target.value;
                  onChange(newConfig);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://publisher.com"
              />
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'newsletter' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Newsletter</h3>
        <p className="text-sm text-gray-500 mb-4">Configura il form di iscrizione (placeholder, testo bottone e URL).</p>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
          <input
            type="text"
            value={config.cta.newsletter.text}
            onChange={(e) => onChange({...config, cta: {...config.cta, newsletter: {...config.cta.newsletter, text: e.target.value}}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Subscribe to Updates"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
          <input
            type="text"
            value={config.cta.newsletter.placeholder}
            onChange={(e) => onChange({...config, cta: {...config.cta, newsletter: {...config.cta.newsletter, placeholder: e.target.value}}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <input
            type="url"
            value={config.cta.newsletter.url}
            onChange={(e) => onChange({...config, cta: {...config.cta, newsletter: {...config.cta.newsletter, url: e.target.value}}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://substack.com"
          />
        </div>
      </div>
      )}

      {activeTab === 'modals' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Messaggi Modal</h3>
        <p className="text-sm text-gray-500 mb-4">Testi mostrati dopo azioni chiave (successo/errore).</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Success Modal</label>
            <div className="space-y-2">
              <input
                type="text"
                value={config.modal.success.title}
                onChange={(e) => onChange({...config, modal: {...config.modal, success: {...config.modal.success, title: e.target.value}}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Download Started!"
              />
              <textarea
                value={config.modal.success.message}
                onChange={(e) => onChange({...config, modal: {...config.modal, success: {...config.modal.success, message: e.target.value}}})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Check your email for the download link"
              />
              <input
                type="text"
                value={config.modal.success.buttonText}
                onChange={(e) => onChange({...config, modal: {...config.modal, success: {...config.modal.success, buttonText: e.target.value}}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Close"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Error Modal</label>
            <div className="space-y-2">
              <input
                type="text"
                value={config.modal.error.title}
                onChange={(e) => onChange({...config, modal: {...config.modal, error: {...config.modal.error, title: e.target.value}}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Oops!"
              />
              <textarea
                value={config.modal.error.message}
                onChange={(e) => onChange({...config, modal: {...config.modal, error: {...config.modal.error, message: e.target.value}}})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Something went wrong. Please try again."
              />
              <input
                type="text"
                value={config.modal.error.buttonText}
                onChange={(e) => onChange({...config, modal: {...config.modal, error: {...config.modal.error, buttonText: e.target.value}}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Try Again"
              />
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Offer duplicate removed (now in tab 'offer') */}

      {activeTab === 'socialProof' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Social Proof</h3>
        <p className="text-sm text-gray-500 mb-4">Elementi di prova sociale da mostrare nella landing.</p>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showRating"
              checked={config.socialProof.showRating}
              onChange={(e) => onChange({...config, socialProof: {...config.socialProof, showRating: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showRating" className="text-sm font-medium text-gray-700">Show Rating</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showReviewCount"
              checked={config.socialProof.showReviewCount}
              onChange={(e) => onChange({...config, socialProof: {...config.socialProof, showReviewCount: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showReviewCount" className="text-sm font-medium text-gray-700">Show Review Count</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showRankings"
              checked={config.socialProof.showRankings}
              onChange={(e) => onChange({...config, socialProof: {...config.socialProof, showRankings: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showRankings" className="text-sm font-medium text-gray-700">Show Rankings</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showAwards"
              checked={config.socialProof.showAwards}
              onChange={(e) => onChange({...config, socialProof: {...config.socialProof, showAwards: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showAwards" className="text-sm font-medium text-gray-700">Show Awards</label>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
