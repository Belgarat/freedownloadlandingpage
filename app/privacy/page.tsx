import Link from 'next/link'
import { Shield, Mail, Clock, User, Lock } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-teal-900/50 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8 border border-teal-700/50">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>
          
          <div className="space-y-8 text-teal-100">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Informazioni Generali</h2>
              <p className="mb-4">
                Questa Privacy Policy descrive come raccogliamo, utilizziamo e proteggiamo le tue informazioni personali 
                quando visiti il nostro sito web e richiedi il download dell'ebook "Fish Cannot Carry Guns".
              </p>
              <p>
                <strong>Titolare del Trattamento:</strong> Michael Morgan<br/>
                <strong>Email:</strong> privacy@fishcannotcarryguns.aroundscifi.us<br/>
                <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Dati Personali Raccolti</span>
              </h2>
              <div className="space-y-3">
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Email Address</h3>
                  <p className="text-sm">Raccolta per inviarti l'ebook richiesto e gestire il download.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Indirizzo IP</h3>
                  <p className="text-sm">Raccolto automaticamente per sicurezza e prevenzione abusi.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">User Agent</h3>
                  <p className="text-sm">Informazioni sul browser per compatibilità e analytics.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Timestamp</h3>
                  <p className="text-sm">Data e ora delle interazioni per analytics e sicurezza.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Base Legale del Trattamento</span>
              </h2>
              <div className="space-y-3">
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">Consenso</h3>
                  <p className="text-sm">Per cookie di analytics e tracking del comportamento.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">Interesse Legittimo</h3>
                  <p className="text-sm">Per sicurezza, prevenzione abusi e miglioramento del servizio.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">Esecuzione Contratto</h3>
                  <p className="text-sm">Per inviarti l'ebook richiesto e gestire il download.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Conservazione dei Dati</span>
              </h2>
              <ul className="space-y-2 text-sm">
                <li><strong>Email:</strong> Conservata per 2 anni o fino alla richiesta di cancellazione</li>
                <li><strong>Analytics:</strong> Conservati per 2 anni</li>
                <li><strong>Log di sicurezza:</strong> Conservati per 1 anno</li>
                <li><strong>Token di download:</strong> Scadono automaticamente dopo 24 ore</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">I Tuoi Diritti GDPR</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Diritto di Accesso</h3>
                  <p className="text-sm">Ottenere copia dei tuoi dati personali.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Diritto di Rettifica</h3>
                  <p className="text-sm">Correggere dati inesatti o incompleti.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Diritto alla Cancellazione</h3>
                  <p className="text-sm">Richiedere la cancellazione dei tuoi dati.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Diritto alla Portabilità</h3>
                  <p className="text-sm">Ricevere i tuoi dati in formato strutturato.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Diritto di Opposizione</h3>
                  <p className="text-sm">Opporti al trattamento per interesse legittimo.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Diritto di Limitazione</h3>
                  <p className="text-sm">Limitare il trattamento in determinate circostanze.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Cookie Policy</h2>
              <div className="space-y-3">
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">Cookie Tecnici (Necessari)</h3>
                  <p className="text-sm">Gestione sessioni, sicurezza, download file. Non possono essere disabilitati.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400 mb-2">Cookie Analytics (Opzionali)</h3>
                  <p className="text-sm">Analisi del traffico e miglioramento del sito. Puoi disabilitarli in qualsiasi momento.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Contatti</span>
              </h2>
              <div className="bg-teal-800/30 rounded-lg p-4">
                <p className="mb-3">Per esercitare i tuoi diritti GDPR o per qualsiasi domanda sulla privacy:</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> privacy@fishcannotcarryguns.aroundscifi.us</p>
                  <p><strong>Responsabile del Trattamento:</strong> Michael Morgan</p>
                  <p><strong>Tempo di risposta:</strong> Entro 30 giorni dalla richiesta</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Sicurezza</h2>
              <div className="bg-teal-800/30 rounded-lg p-4">
                <ul className="space-y-2 text-sm">
                  <li>• Tutti i dati sono protetti con crittografia SSL/TLS</li>
                  <li>• Accesso ai dati limitato al personale autorizzato</li>
                  <li>• Monitoraggio continuo per rilevare accessi non autorizzati</li>
                  <li>• Backup regolari e sicuri dei dati</li>
                </ul>
              </div>
            </section>
            
            <div className="border-t border-teal-700 pt-6">
              <Link 
                href="/"
                className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span>← Torna alla Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 