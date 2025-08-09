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
              <h2 className="text-xl font-semibold text-white mb-4">General Information</h2>
              <p className="mb-4">
                This Privacy Policy describes how we collect, use, and protect your personal information 
                when you visit our website and request the download of the ebook &quot;Fish Cannot Carry Guns&quot;.
              </p>
              <p>
                <strong>Data Controller:</strong> Michael B. Morgan<br/>
                <strong>Email:</strong> info@37indielab.com<br/>
                <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Data Collected</span>
              </h2>
              <div className="space-y-3">
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Email Address</h3>
                  <p className="text-sm">Collected to send you the requested ebook and manage downloads.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">IP Address</h3>
                  <p className="text-sm">Automatically collected for security and abuse prevention.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">User Agent</h3>
                  <p className="text-sm">Browser information for compatibility and analytics.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Timestamp</h3>
                  <p className="text-sm">Date and time of interactions for analytics and security.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Legal Basis for Processing</span>
              </h2>
              <div className="space-y-3">
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">Consent</h3>
                  <p className="text-sm">For analytics cookies and behavior tracking.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">Legitimate Interest</h3>
                  <p className="text-sm">For security, abuse prevention, and service improvement.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">Contract Performance</h3>
                  <p className="text-sm">To send you the requested ebook and manage downloads.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Data Retention</span>
              </h2>
              <ul className="space-y-2 text-sm">
                <li><strong>Email:</strong> Retained for 2 years or until deletion request</li>
                <li><strong>Analytics:</strong> Retained for 2 years</li>
                <li><strong>Security logs:</strong> Retained for 1 year</li>
                <li><strong>Download tokens:</strong> Automatically expire after 24 hours</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Your GDPR Rights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Right of Access</h3>
                  <p className="text-sm">Obtain a copy of your personal data.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Right of Rectification</h3>
                  <p className="text-sm">Correct inaccurate or incomplete data.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Right to Erasure</h3>
                  <p className="text-sm">Request deletion of your data.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Right to Portability</h3>
                  <p className="text-sm">Receive your data in a structured format.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Right to Object</h3>
                  <p className="text-sm">Object to processing for legitimate interests.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-300 mb-2">Right to Restriction</h3>
                  <p className="text-sm">Restrict processing in certain circumstances.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Cookie Policy</h2>
              <div className="space-y-3">
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2">Technical Cookies (Necessary)</h3>
                  <p className="text-sm">Session management, security, file downloads. Cannot be disabled.</p>
                </div>
                <div className="bg-teal-800/30 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400 mb-2">Analytics Cookies (Optional)</h3>
                  <p className="text-sm">Traffic analysis and site improvement. You can disable them at any time.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </h2>
              <div className="bg-teal-800/30 rounded-lg p-4">
                <p className="mb-3">To exercise your GDPR rights or for any privacy questions:</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> info@37indielab.com</p>
                  <p><strong>Data Controller:</strong> Michael B. Morgan</p>
                  <p><strong>Response time:</strong> Within 30 days of request</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Security</h2>
              <div className="bg-teal-800/30 rounded-lg p-4">
                <ul className="space-y-2 text-sm">
                  <li>• All data is protected with SSL/TLS encryption</li>
                  <li>• Data access limited to authorized personnel</li>
                  <li>• Continuous monitoring to detect unauthorized access</li>
                  <li>• Regular and secure data backups</li>
                </ul>
              </div>
            </section>
            
            <div className="border-t border-teal-700 pt-6">
              <Link 
                href="/"
                className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span>← Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 