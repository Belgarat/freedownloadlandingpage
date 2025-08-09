'use client'

import { MarketingConfig } from '@/lib/config-loader'

interface MarketingConfigEditorProps {
  config: MarketingConfig
  onChange: (config: MarketingConfig) => void
}

export default function MarketingConfigEditor({ config, onChange }: MarketingConfigEditorProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
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

      <div className="border-b pb-4">
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

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Newsletter CTA</h3>
        
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

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Modal Messages</h3>
        
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

      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Offer Settings</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="datetime-local"
            value={config.offer.endDate}
            onChange={(e) => onChange({...config, offer: {...config.offer, endDate: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isLimited"
            checked={config.offer.isLimited}
            onChange={(e) => onChange({...config, offer: {...config.offer, isLimited: e.target.checked}})}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isLimited" className="text-sm font-medium text-gray-700">Is Limited Time Offer</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Limited Text</label>
          <input
            type="text"
            value={config.offer.limitedText}
            onChange={(e) => onChange({...config, offer: {...config.offer, limitedText: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Limited time offer"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social Proof</h3>
        
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
    </div>
  )
}
