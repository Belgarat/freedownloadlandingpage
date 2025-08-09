'use client'

import { useState } from 'react'
import { EmailConfig } from '@/lib/config-loader'
import EmailTemplateEditor from '@/components/EmailTemplateEditor'
import { Mail, Settings, Eye, EyeOff, Info, AlertCircle } from 'lucide-react'

interface EmailConfigEditorProps {
  config: EmailConfig
  onChange: (config: EmailConfig) => void
}

export default function EmailConfigEditor({ config, onChange }: EmailConfigEditorProps) {
  const [activeTab, setActiveTab] = useState<'sender' | 'download' | 'followup' | 'settings'>('sender')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const tabs = [
    { id: 'sender', label: 'Mittente', icon: Mail },
    { id: 'download', label: 'Email Download', icon: Mail },
    { id: 'followup', label: 'Email Follow-up', icon: Mail },
    { id: 'settings', label: 'Impostazioni', icon: Settings }
  ] as const

  return (
    <div className="space-y-6">
      {/* Header con descrizione */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Configurazione Email</h3>
            <p className="text-sm text-blue-700 mt-1">
              Personalizza le email inviate agli utenti. Usa i placeholder per inserire contenuti dinamici.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Sender Configuration */}
      {activeTab === 'sender' && (
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Informazioni Mittente</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Mittente</label>
                <input
                  type="text"
                  value={config.sender.name}
                  onChange={(e) => onChange({...config, sender: {...config.sender, name: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Il tuo nome"
                />
                <p className="text-xs text-gray-500 mt-1">Appare come "Da: [Nome]"</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Mittente</label>
                <input
                  type="email"
                  value={config.sender.email}
                  onChange={(e) => onChange({...config, sender: {...config.sender, email: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="tuo@email.com"
                />
                <p className="text-xs text-gray-500 mt-1">Email da cui vengono inviate le email</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email di Risposta</label>
                <input
                  type="email"
                  value={config.sender.replyTo}
                  onChange={(e) => onChange({...config, sender: {...config.sender, replyTo: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="risposta@email.com"
                />
                <p className="text-xs text-gray-500 mt-1">Email per le risposte degli utenti</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Email Template */}
      {activeTab === 'download' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-900 mb-2">Email di Download</h4>
            <p className="text-sm text-green-700">
              Questa email viene inviata quando un utente richiede il download del libro.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Oggetto Email</label>
              <input
                type="text"
                value={config.templates.download.subject}
                onChange={(e) => onChange({...config, templates: {...config.templates, download: {...config.templates.download, subject: e.target.value}}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Il tuo libro è pronto!"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenuto HTML</label>
              <EmailTemplateEditor
                value={config.templates.download.html || config.templates.download.message}
                onChange={(value) => onChange({...config, templates: {...config.templates, download: {...config.templates.download, html: value}}})}
                placeholder="Scrivi il contenuto HTML dell'email..."
                className="mb-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenuto Testuale</label>
              <textarea
                value={config.templates.download.text || config.templates.download.message}
                onChange={(e) => onChange({...config, templates: {...config.templates, download: {...config.templates.download, text: e.target.value}}})}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Scrivi il contenuto testuale dell'email..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Versione testuale per client email che non supportano HTML
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Email Template */}
      {activeTab === 'followup' && (
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-orange-900 mb-2">Email di Follow-up</h4>
            <p className="text-sm text-orange-700">
              Questa email viene inviata 24-48 ore dopo se l'utente non ha scaricato il libro.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Oggetto Email</label>
              <input
                type="text"
                value={config.templates.followup.subject}
                onChange={(e) => onChange({...config, templates: {...config.templates, followup: {...config.templates.followup, subject: e.target.value}}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hai dimenticato di scaricare il libro?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenuto HTML</label>
              <EmailTemplateEditor
                value={config.templates.followup.html}
                onChange={(value) => onChange({...config, templates: {...config.templates, followup: {...config.templates.followup, html: value}}})}
                placeholder="Scrivi il contenuto HTML dell'email di follow-up..."
                className="mb-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenuto Testuale</label>
              <textarea
                value={config.templates.followup.text}
                onChange={(e) => onChange({...config, templates: {...config.templates, followup: {...config.templates.followup, text: e.target.value}}})}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Scrivi il contenuto testuale dell'email di follow-up..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Versione testuale per client email che non supportano HTML
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Impostazioni Avanzate</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scadenza Link (ore)</label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={config.settings.templateExpiryHours}
                  onChange={(e) => onChange({...config, settings: {...config.settings, templateExpiryHours: parseInt(e.target.value)}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Dopo quante ore scade il link di download</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tentativi Massimi</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={config.settings.maxRetries}
                  onChange={(e) => onChange({...config, settings: {...config.settings, maxRetries: parseInt(e.target.value)}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Numero di tentativi per inviare l'email</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailTracking"
                  checked={config.settings.tracking}
                  onChange={(e) => onChange({...config, settings: {...config.settings, tracking: e.target.checked}})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="emailTracking" className="text-sm font-medium text-gray-700">
                  Abilita Tracking Email
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Traccia aperture e click nelle email (richiede configurazione aggiuntiva)
              </p>
            </div>
          </div>

          {/* Placeholder Help */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Placeholders Disponibili</h4>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
               <div><code className="bg-blue-100 px-1 rounded">{'{{downloadUrl}}'}</code> - Link download</div>
               <div><code className="bg-blue-100 px-1 rounded">{'{{name}}'}</code> - Nome utente</div>
               <div><code className="bg-blue-100 px-1 rounded">{'{{bookTitle}}'}</code> - Titolo libro</div>
               <div><code className="bg-blue-100 px-1 rounded">{'{{authorName}}'}</code> - Nome autore</div>
               <div><code className="bg-blue-100 px-1 rounded">{'{{goodreadsUrl}}'}</code> - URL Goodreads</div>
               <div><code className="bg-blue-100 px-1 rounded">{'{{amazonUrl}}'}</code> - URL Amazon</div>
               <div><code className="bg-blue-100 px-1 rounded">{'{{substackUrl}}'}</code> - URL Substack</div>
               <div><code className="bg-blue-100 px-1 rounded">{'{{publisherUrl}}'}</code> - URL Publisher</div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
