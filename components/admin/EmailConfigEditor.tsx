'use client'

import { useState, useEffect } from 'react'
import { EmailConfig } from '@/lib/config-loader'
import { Mail, Settings, Info, ExternalLink, Plus } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContext'

interface EmailConfigEditorProps {
  config: EmailConfig
  onChange: (config: EmailConfig) => void
}

interface EmailTemplate {
  id: string
  name: string
  type: 'download' | 'followup'
  isActive: boolean
}

export default function EmailConfigEditor({ config, onChange }: EmailConfigEditorProps) {
  const [activeTab, setActiveTab] = useState<'sender' | 'templates' | 'settings'>('sender')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const tabs = [
    { id: 'sender', label: 'Mittente', icon: Mail },
    { id: 'templates', label: 'Template Email', icon: Mail },
    { id: 'settings', label: 'Impostazioni', icon: Settings }
  ] as const

  // Carica i template disponibili
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/email-templates')
        if (response.ok) {
          const data = await response.json()
          setTemplates(data.templates || [])
        }
      } catch (error) {
        console.error('Error loading templates:', error)
        addToast({
          type: 'error',
          title: 'Errore',
          message: 'Impossibile caricare i template email',
          duration: 5000
        })
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [addToast])

  const handleTemplateSelect = async (templateId: string, type: 'download' | 'followup') => {
    try {
      const response = await fetch(`/api/email-templates/${templateId}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'Template Attivato',
          message: `Template ${type} aggiornato con successo`,
          duration: 3000
        })
        
        // Ricarica i template per aggiornare lo stato
        const templatesResponse = await fetch('/api/email-templates')
        if (templatesResponse.ok) {
          const data = await templatesResponse.json()
          setTemplates(data.templates || [])
        }
      }
    } catch (error) {
      console.error('Error activating template:', error)
      addToast({
        type: 'error',
        title: 'Errore',
        message: 'Impossibile attivare il template',
        duration: 5000
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con descrizione */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Configurazione Email</h3>
            <p className="text-sm text-blue-700 mt-1">
              Configura le impostazioni generali per l'invio delle email. I template email sono gestiti nella sezione dedicata.
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-input"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-input"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-input"
                  placeholder="risposta@email.com"
                />
                <p className="text-xs text-gray-500 mt-1">Email per le risposte degli utenti</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Selection */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-900 mb-2">Gestione Template Email</h4>
            <p className="text-sm text-green-700 mb-3">
              Seleziona i template da utilizzare per le email di download e follow-up. I template sono gestiti nella sezione dedicata.
            </p>
            <a
              href="/admin/email-templates"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Gestisci Template</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600">Caricamento template...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Download Template */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 mb-3">Template Download</h5>
                <p className="text-xs text-gray-600 mb-4">Template utilizzato per l'email di download del libro</p>
                
                {templates.filter(t => t.type === 'download').length > 0 ? (
                  <div className="space-y-2">
                    {templates.filter(t => t.type === 'download').map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          template.isActive
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleTemplateSelect(template.id, 'download')}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{template.name}</span>
                          {template.isActive && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Attivo
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Nessun template download disponibile</p>
                    <a
                      href="/admin/email-templates/new"
                      className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                    >
                      Crea il primo template
                    </a>
                  </div>
                )}
              </div>

              {/* Follow-up Template */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 mb-3">Template Follow-up</h5>
                <p className="text-xs text-gray-600 mb-4">Template utilizzato per l'email di follow-up</p>
                
                {templates.filter(t => t.type === 'followup').length > 0 ? (
                  <div className="space-y-2">
                    {templates.filter(t => t.type === 'followup').map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          template.isActive
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleTemplateSelect(template.id, 'followup')}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{template.name}</span>
                          {template.isActive && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Attivo
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Nessun template follow-up disponibile</p>
                    <a
                      href="/admin/email-templates/new"
                      className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                    >
                      Crea il primo template
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-input"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 admin-input"
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div><code className="bg-blue-200 px-1 rounded text-blue-900 font-medium">{'{{downloadUrl}}'}</code> <span className="text-blue-800 font-medium">- Link download</span></div>
              <div><code className="bg-blue-200 px-1 rounded text-blue-900 font-medium">{'{{name}}'}</code> <span className="text-blue-800 font-medium">- Nome utente</span></div>
              <div><code className="bg-blue-200 px-1 rounded text-blue-900 font-medium">{'{{bookTitle}}'}</code> <span className="text-blue-800 font-medium">- Titolo libro</span></div>
              <div><code className="bg-blue-200 px-1 rounded text-blue-900 font-medium">{'{{authorName}}'}</code> <span className="text-blue-800 font-medium">- Nome autore</span></div>
              <div><code className="bg-blue-200 px-1 rounded text-blue-900 font-medium">{'{{goodreadsUrl}}'}</code> <span className="text-blue-800 font-medium">- URL Goodreads</span></div>
              <div><code className="bg-blue-200 px-1 rounded text-blue-900 font-medium">{'{{amazonUrl}}'}</code> <span className="text-blue-800 font-medium">- URL Amazon</span></div>
              <div><code className="bg-blue-200 px-1 rounded text-blue-900 font-medium">{'{{substackUrl}}'}</code> <span className="text-blue-800 font-medium">- URL Substack</span></div>
              <div><code className="bg-blue-200 px-1 rounded text-blue-900 font-medium">{'{{substackName}}'}</code> <span className="text-blue-800 font-medium">- Nome Substack</span></div>
              <div><code className="bg-blue-200 px-1 rounded text-blue-900 font-medium">{'{{publisherUrl}}'}</code> <span className="text-blue-800 font-medium">- URL Publisher</span></div>
              <div><code className="bg-blue-200 px-1 rounded text-blue-900 font-medium">{'{{publisherName}}'}</code> <span className="text-blue-800 font-medium">- Nome Publisher</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
