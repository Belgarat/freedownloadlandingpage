'use client'

import { useState, useEffect, useCallback } from 'react'
import { ABTest, ABVariant } from '@/types/ab-testing'
import { getVisitorId, assignVariant, getAssignedVariant } from './ab-testing'

interface UseABTestingOptions {
  testId: string
  variants: ABVariant[]
  onVariantAssigned?: (variant: ABVariant) => void
  autoTrack?: boolean
}

interface UseABTestingReturn {
  assignedVariant: ABVariant | null
  isLoading: boolean
  error: string | null
  trackVisit: () => Promise<void>
  trackConversion: (value?: number) => Promise<void>
}

export function useABTesting({
  testId,
  variants,
  onVariantAssigned,
  autoTrack = true
}: UseABTestingOptions): UseABTestingReturn {
  const [assignedVariant, setAssignedVariant] = useState<ABVariant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Assegna o ottieni la variante per questo test
  const assignOrGetVariant = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Prima controlla se c'è già un'assegnazione
      let variantId = await getAssignedVariant(testId)
      
      if (!variantId) {
        // Se non c'è assegnazione, creane una nuova
        variantId = await assignVariant(testId, variants)
      }

      // Trova la variante assegnata
      const variant = variants.find(v => v.id === variantId)
      if (!variant) {
        throw new Error('Assigned variant not found')
      }

      setAssignedVariant(variant)
      
      // Callback per notificare l'assegnazione
      if (onVariantAssigned) {
        onVariantAssigned(variant)
      }

      // Traccia automaticamente la visita se richiesto
      if (autoTrack) {
        await trackVisit()
      }

    } catch (err) {
      console.error('Error in A/B testing assignment:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Fallback alla prima variante
      setAssignedVariant(variants[0] || null)
    } finally {
      setIsLoading(false)
    }
  }, [testId, variants, onVariantAssigned, autoTrack])

  // Traccia una visita
  const trackVisit = useCallback(async () => {
    if (!assignedVariant) return

    try {
      const visitorId = getVisitorId()
      if (!visitorId) return

      await fetch('/api/ab-testing/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          variantId: assignedVariant.id,
          visitorId,
          conversion: false
        })
      })
    } catch (err) {
      console.error('Error tracking visit:', err)
    }
  }, [testId, assignedVariant])

  // Traccia una conversione
  const trackConversion = useCallback(async (value?: number) => {
    if (!assignedVariant) return

    try {
      const visitorId = getVisitorId()
      if (!visitorId) return

      await fetch('/api/ab-testing/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          variantId: assignedVariant.id,
          visitorId,
          conversion: true,
          conversionValue: value
        })
      })
    } catch (err) {
      console.error('Error tracking conversion:', err)
    }
  }, [testId, assignedVariant])

  // Inizializza l'A/B testing quando il componente si monta
  useEffect(() => {
    assignOrGetVariant()
  }, [assignOrGetVariant])

  return {
    assignedVariant,
    isLoading,
    error,
    trackVisit,
    trackConversion
  }
}

// Hook per ottenere test attivi dal database
export function useActiveTests() {
  const [tests, setTests] = useState<ABTest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTests() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/ab-testing/tests')
        
        if (!response.ok) {
          throw new Error('Failed to fetch tests')
        }

        const data = await response.json()
        // Filtra solo i test attivi (running)
        const activeTests = data.filter((test: ABTest) => test.status === 'running')
        setTests(activeTests)
      } catch (err) {
        console.error('Error fetching active tests:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTests()
  }, [])

  return { tests, isLoading, error }
}

// Hook semplificato per test specifici per tipo
export function useABTestByType(testType: string) {
  const { tests, isLoading } = useActiveTests()
  const [assignedVariant, setAssignedVariant] = useState<ABVariant | null>(null)
  const [isVariantLoading, setIsVariantLoading] = useState(true)

  // Trova il test per tipo
  const test = tests.find(t => t.type === testType)

  useEffect(() => {
    async function assignVariantForTest() {
      if (!test || !test.variants || test.variants.length === 0) {
        setIsVariantLoading(false)
        return
      }

      try {
        setIsVariantLoading(true)
        
        // Ottieni visitor ID
        const visitorId = getVisitorId()
        if (!visitorId) {
          // Fallback alla prima variante se non c'è visitor ID
          setAssignedVariant(test.variants[0])
          setIsVariantLoading(false)
          return
        }

        // Controlla se c'è già un'assegnazione
        const existingVariantId = await getAssignedVariant(test.id)
        
        if (existingVariantId) {
          // Usa l'assegnazione esistente
          const variant = test.variants.find(v => v.id === existingVariantId)
          setAssignedVariant(variant || test.variants[0])
        } else {
          // Crea una nuova assegnazione
          const variantId = await assignVariant(test.id, test.variants)
          const variant = test.variants.find(v => v.id === variantId)
          setAssignedVariant(variant || test.variants[0])
        }

        // Traccia la visita
        try {
          await fetch('/api/ab-testing/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              testId: test.id,
              variantId: assignedVariant?.id || test.variants[0].id,
              visitorId,
              conversion: false
            })
          })
        } catch (error) {
          console.error('Error tracking visit:', error)
        }

      } catch (error) {
        console.error('Error assigning variant:', error)
        // Fallback alla prima variante
        setAssignedVariant(test.variants[0])
      } finally {
        setIsVariantLoading(false)
      }
    }

    if (!isLoading && test) {
      assignVariantForTest()
    }
  }, [test, isLoading, assignedVariant?.id])

  const trackConversion = useCallback(async (value?: number) => {
    if (!test || !assignedVariant) return

    try {
      const visitorId = getVisitorId()
      if (!visitorId) return

      await fetch('/api/ab-testing/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: test.id,
          variantId: assignedVariant.id,
          visitorId,
          conversion: true,
          conversionValue: value
        })
      })
    } catch (error) {
      console.error('Error tracking conversion:', error)
    }
  }, [test, assignedVariant])

  return {
    test,
    assignedVariant,
    isLoading: isLoading || isVariantLoading,
    trackConversion
  }
}

// Hook per applicare automaticamente le varianti al DOM
export function useABTestingDOM(testId: string, variants: ABVariant[]) {
  const { assignedVariant, isLoading } = useABTesting({
    testId,
    variants,
    autoTrack: false
  })

  useEffect(() => {
    if (!assignedVariant || isLoading) return

    // Applica la variante al DOM
    const applyVariant = () => {
      // Esempio: cambia il testo di un pulsante
      const button = document.querySelector('button[type="submit"]')
      if (button && assignedVariant.value) {
        button.textContent = assignedVariant.value
      }

      // Esempio: cambia il colore di un elemento
      if (assignedVariant.css_class) {
        const elements = document.querySelectorAll('.cta-button')
        elements.forEach(element => {
          element.classList.remove('bg-blue-600', 'bg-green-600', 'bg-red-600')
          element.classList.add(...assignedVariant.css_class!.split(' '))
        })
      }
    }

    // Applica dopo un breve delay per assicurarsi che il DOM sia pronto
    const timeoutId = setTimeout(applyVariant, 100)
    return () => clearTimeout(timeoutId)
  }, [assignedVariant, isLoading])

  return { assignedVariant, isLoading }
}
