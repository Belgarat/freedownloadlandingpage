import { ABTest, ABVariant, ABTestResult } from '@/types/ab-testing'

// Storage per i test attivi
let activeTests: ABTest[] = []
// const visitorAssignments: Map<string, Map<string, string>> = new Map() // visitorId -> testId -> variantId

// Cookie name per il visitor ID
const VISITOR_ID_COOKIE = 'ab_visitor_id'
const TEST_ASSIGNMENTS_COOKIE = 'ab_assignments'

/**
 * Genera un ID univoco per il visitatore
 */
export function generateVisitorId(): string {
  return 'visitor_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

/**
 * Ottiene o crea il visitor ID dal cookie
 */
export function getVisitorId(): string {
  if (typeof document === 'undefined') return ''
  
  let visitorId = getCookie(VISITOR_ID_COOKIE)
  if (!visitorId) {
    visitorId = generateVisitorId()
    setCookie(VISITOR_ID_COOKIE, visitorId, 365) // 1 anno
  }
  return visitorId
}

/**
 * Assegna una variante a un visitatore per un test specifico
 */
export async function assignVariant(testId: string, variants: ABVariant[]): Promise<string> {
  if (typeof window === 'undefined') return variants[0]?.id || ''
  
  const visitorId = getVisitorId()
  if (!visitorId) return variants[0]?.id || ''
  
  // Controlla se il visitatore ha già un'assegnazione per questo test
  const existingAssignment = await getAssignedVariant(testId)
  if (existingAssignment) {
    return existingAssignment
  }
  
  // Assegna casualmente una variante
  const random = Math.random()
  let cumulativeWeight = 0
  
  for (const variant of variants) {
    cumulativeWeight += variant.trafficSplit || (100 / variants.length)
    if (random <= cumulativeWeight / 100) {
      // Salva l'assegnazione nel database
      try {
        await fetch('/api/ab-testing/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            testId,
            variantId: variant.id
          })
        })
      } catch (error) {
        console.error('Error saving assignment:', error)
      }
      
      return variant.id
    }
  }
  
  // Fallback alla prima variante
  const fallbackVariant = variants[0]
  try {
    await fetch('/api/ab-testing/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        testId,
        variantId: fallbackVariant.id
      })
    })
  } catch (error) {
    console.error('Error saving assignment:', error)
  }
  
  return fallbackVariant.id
}

/**
 * Ottiene la variante assegnata per un test
 */
export async function getAssignedVariant(testId: string): Promise<string | null> {
  if (typeof window === 'undefined') return null
  
  const visitorId = getVisitorId()
  if (!visitorId) return null

  try {
    const response = await fetch(`/api/ab-testing/assignments?visitorId=${visitorId}&testId=${testId}`)
    if (response.ok) {
      const data = await response.json()
      return data.variantId
    }
  } catch (error) {
    console.error('Error fetching assignment:', error)
  }
  
  return null
}

/**
 * Applica le varianti A/B test al DOM
 */
export function applyABTestVariants(): void {
  if (typeof document === 'undefined') return
  
  // Esempio: applica varianti ai test attivi
  activeTests.forEach(test => {
    const variantId = getAssignedVariant(test.id)
    if (!variantId) return
    
    const variant = test.variants.find(v => v.id === variantId)
    if (!variant) return
    
    applyVariantToElement(test, variant)
  })
}

/**
 * Applica una variante specifica a un elemento del DOM
 */
function applyVariantToElement(test: ABTest, variant: ABVariant): void {
  const elements = document.querySelectorAll(test.targetSelector)
  
  elements.forEach(element => {
    switch (test.type) {
      case 'cta_button_text':
        if (element instanceof HTMLButtonElement) {
          element.textContent = variant.value
        }
        break
        
      case 'cta_button_color':
        if (element instanceof HTMLButtonElement) {
          // Rimuovi classi di colore esistenti
          element.classList.remove('bg-blue-600', 'bg-green-600', 'bg-red-600')
          // Aggiungi la nuova classe
          if (variant.cssClass) {
            element.classList.add(...variant.cssClass.split(' '))
          }
        }
        break
        
      case 'headline_text':
        if (element instanceof HTMLElement) {
          element.textContent = variant.value
        }
        break
        
      case 'headline_size':
        if (element instanceof HTMLElement) {
          // Rimuovi classi di dimensione esistenti
          element.classList.remove('text-2xl', 'text-3xl', 'text-xl', 'sm:text-4xl', 'sm:text-5xl', 'sm:text-3xl', 'md:text-5xl', 'md:text-6xl', 'md:text-4xl')
          // Aggiungi la nuova classe
          if (variant.cssClass) {
            element.classList.add(...variant.cssClass.split(' '))
          }
        }
        break
        
      case 'offer_text':
        if (element instanceof HTMLElement) {
          element.textContent = variant.value
        }
        break
        
      case 'form_placeholder':
        if (element instanceof HTMLInputElement) {
          element.placeholder = variant.value
        }
        break
    }
  })
}

/**
 * Traccia una conversione per un test A/B
 */
export async function trackConversion(testId: string, conversionValue?: number): Promise<void> {
  const visitorId = getVisitorId()
  const variantId = getAssignedVariant(testId)
  
  if (!variantId) return
  
  const result: ABTestResult = {
    testId,
    variantId,
    visitorId,
    timestamp: new Date().toISOString(),
    conversion: true,
    conversionValue
  }
  
  // Invia il risultato al server
  try {
    await fetch('/api/ab-testing/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    })
  } catch (error) {
    console.error('Failed to track A/B test conversion:', error)
  }
}

/**
 * Traccia una visita per un test A/B
 */
export async function trackVisit(testId: string): Promise<void> {
  const visitorId = getVisitorId()
  const variantId = getAssignedVariant(testId)
  
  if (!variantId) return
  
  const result: ABTestResult = {
    testId,
    variantId,
    visitorId,
    timestamp: new Date().toISOString(),
    conversion: false
  }
  
  // Invia il risultato al server
  try {
    await fetch('/api/ab-testing/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    })
  } catch (error) {
    console.error('Failed to track A/B test visit:', error)
  }
}

// Utility functions per i cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

function getVisitorAssignments(): Record<string, string> {
  const assignmentsJson = getCookie(TEST_ASSIGNMENTS_COOKIE)
  if (!assignmentsJson) return {}
  
  try {
    return JSON.parse(assignmentsJson)
  } catch {
    return {}
  }
}

function saveVisitorAssignments(assignments: Record<string, string>): void {
  setCookie(TEST_ASSIGNMENTS_COOKIE, JSON.stringify(assignments), 365)
}

// Inizializzazione
export function initializeABTesting(tests: ABTest[]): void {
  activeTests = tests.filter(test => test.status === 'running')
  
  // Applica le varianti quando il DOM è pronto
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyABTestVariants)
    } else {
      applyABTestVariants()
    }
  }
}


