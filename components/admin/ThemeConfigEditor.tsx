'use client'

import { useState } from 'react'
import { ThemeConfig } from '@/lib/config-loader'

interface ThemeConfigEditorProps {
  config: ThemeConfig
  onChange: (config: ThemeConfig) => void
}

export default function ThemeConfigEditor({ config, onChange }: ThemeConfigEditorProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout' | 'spacing' | 'animations' | 'development'>('colors')

  const tabs = [
    { id: 'colors', label: 'Colors' },
    { id: 'fonts', label: 'Fonts' },
    { id: 'layout', label: 'Layout' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'animations', label: 'Animations' },
    { id: 'development', label: 'Development' },
  ] as const

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900">Tema</h3>
        <p className="text-sm text-blue-700 mt-1">Configura colori, font, layout e opzioni di sviluppo.</p>
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

      {activeTab === 'colors' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary</label>
            <input
              type="color"
              value={config.colors.primary}
              onChange={(e) => onChange({...config, colors: {...config.colors, primary: e.target.value}})}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary</label>
            <input
              type="color"
              value={config.colors.secondary}
              onChange={(e) => onChange({...config, colors: {...config.colors, secondary: e.target.value}})}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Accent</label>
            <input
              type="color"
              value={config.colors.accent}
              onChange={(e) => onChange({...config, colors: {...config.colors, accent: e.target.value}})}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
            <input
              type="color"
              value={config.colors.background}
              onChange={(e) => onChange({...config, colors: {...config.colors, background: e.target.value}})}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-md font-medium text-gray-900 mb-2">Text Colors</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary</label>
              <input
                type="color"
                value={config.colors.text.primary}
                onChange={(e) => onChange({...config, colors: {...config.colors, text: {...config.colors.text, primary: e.target.value}}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary</label>
              <input
                type="color"
                value={config.colors.text.secondary}
                onChange={(e) => onChange({...config, colors: {...config.colors, text: {...config.colors.text, secondary: e.target.value}}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Muted</label>
              <input
                type="color"
                value={config.colors.text.muted}
                onChange={(e) => onChange({...config, colors: {...config.colors, text: {...config.colors.text, muted: e.target.value}}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-md font-medium text-gray-900 mb-2">Status Colors</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Success</label>
              <input
                type="color"
                value={config.colors.success}
                onChange={(e) => onChange({...config, colors: {...config.colors, success: e.target.value}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Error</label>
              <input
                type="color"
                value={config.colors.error}
                onChange={(e) => onChange({...config, colors: {...config.colors, error: e.target.value}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warning</label>
              <input
                type="color"
                value={config.colors.warning}
                onChange={(e) => onChange({...config, colors: {...config.colors, warning: e.target.value}})}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'fonts' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fonts</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
            <input
              type="text"
              value={config.fonts.heading}
              onChange={(e) => onChange({...config, fonts: {...config.fonts, heading: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inter, sans-serif"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
            <input
              type="text"
              value={config.fonts.body}
              onChange={(e) => onChange({...config, fonts: {...config.fonts, body: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inter, sans-serif"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mono</label>
            <input
              type="text"
              value={config.fonts.mono}
              onChange={(e) => onChange({...config, fonts: {...config.fonts, mono: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="JetBrains Mono, monospace"
            />
          </div>
        </div>
      </div>
      )}

      {activeTab === 'layout' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Layout</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Layout Type</label>
          <select
            value={config.layout.type}
            onChange={(e) => onChange({...config, layout: {...config.layout, type: e.target.value}})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="full-width">Full Width</option>
            <option value="sidebar">Sidebar</option>
          </select>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showCountdown"
              checked={config.layout.showCountdown}
              onChange={(e) => onChange({...config, layout: {...config.layout, showCountdown: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showCountdown" className="text-sm font-medium text-gray-700">Show Countdown</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showStories"
              checked={config.layout.showStories}
              onChange={(e) => onChange({...config, layout: {...config.layout, showStories: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showStories" className="text-sm font-medium text-gray-700">Show Stories</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showTestimonials"
              checked={config.layout.showTestimonials}
              onChange={(e) => onChange({...config, layout: {...config.layout, showTestimonials: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showTestimonials" className="text-sm font-medium text-gray-700">Show Testimonials</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showAwards"
              checked={config.layout.showAwards}
              onChange={(e) => onChange({...config, layout: {...config.layout, showAwards: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showAwards" className="text-sm font-medium text-gray-700">Show Awards</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showRankings"
              checked={config.layout.showRankings}
              onChange={(e) => onChange({...config, layout: {...config.layout, showRankings: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showRankings" className="text-sm font-medium text-gray-700">Show Rankings</label>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'spacing' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Spacing</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Container</label>
            <input
              type="text"
              value={config.spacing.container}
              onChange={(e) => onChange({...config, spacing: {...config.spacing, container: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="max-w-7xl mx-auto px-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <input
              type="text"
              value={config.spacing.section}
              onChange={(e) => onChange({...config, spacing: {...config.spacing, section: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="py-16"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Element</label>
            <input
              type="text"
              value={config.spacing.element}
              onChange={(e) => onChange({...config, spacing: {...config.spacing, element: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="p-6"
            />
          </div>
        </div>
      </div>
      )}

      {activeTab === 'animations' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Animations</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="animationsEnabled"
            checked={config.animations.enabled}
            onChange={(e) => onChange({...config, animations: {...config.animations, enabled: e.target.checked}})}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="animationsEnabled" className="text-sm font-medium text-gray-700">Enable Animations</label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <input
              type="text"
              value={config.animations.duration}
              onChange={(e) => onChange({...config, animations: {...config.animations, duration: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="300ms"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Easing</label>
            <input
              type="text"
              value={config.animations.easing}
              onChange={(e) => onChange({...config, animations: {...config.animations, easing: e.target.value}})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ease-in-out"
            />
          </div>
        </div>
      </div>
      )}

      {activeTab === 'development' && (
      <div className="pb-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Development</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="analytics"
              checked={config.development.analytics}
              onChange={(e) => onChange({...config, development: {...config.development, analytics: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="analytics" className="text-sm font-medium text-gray-700">Enable Analytics</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="tracking"
              checked={config.development.tracking}
              onChange={(e) => onChange({...config, development: {...config.development, tracking: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="tracking" className="text-sm font-medium text-gray-700">Enable Tracking</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="debug"
              checked={config.development.debug}
              onChange={(e) => onChange({...config, development: {...config.development, debug: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="debug" className="text-sm font-medium text-gray-700">Debug Mode</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hotReload"
              checked={config.development.hotReload}
              onChange={(e) => onChange({...config, development: {...config.development, hotReload: e.target.checked}})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="hotReload" className="text-sm font-medium text-gray-700">Hot Reload</label>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
