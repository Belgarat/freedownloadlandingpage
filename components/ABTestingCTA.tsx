'use client'

import React from 'react'
import { useABTesting, useActiveTests } from '@/lib/useABTesting'
import { ABVariant } from '@/types/ab-testing'

interface ABTestingCTAProps {
  testId: string
  variants: ABVariant[]
  onConversion?: (value?: number) => void
  className?: string
}

export default function ABTestingCTA({ 
  testId, 
  variants, 
  onConversion,
  className = '' 
}: ABTestingCTAProps) {
  const { 
    assignedVariant, 
    isLoading, 
    error, 
    trackConversion 
  } = useABTesting({
    testId,
    variants,
    autoTrack: true
  })

  const handleClick = async () => {
    // Traccia la conversione
    await trackConversion()
    
    // Callback personalizzato
    if (onConversion) {
      onConversion()
    }
  }

  if (isLoading) {
    return (
      <button 
        className={`px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed ${className}`}
        disabled
      >
        Loading...
      </button>
    )
  }

  if (error) {
    console.error('A/B Testing error:', error)
    // Fallback alla prima variante
    const fallbackVariant = variants[0]
    return (
      <button 
        onClick={handleClick}
        className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${className}`}
        style={fallbackVariant.cssStyle ? JSON.parse(fallbackVariant.cssStyle) : {}}
      >
        {fallbackVariant.value || 'Download Free Ebook'}
      </button>
    )
  }

  if (!assignedVariant) {
    return null
  }

  // Applica le classi CSS della variante
  const buttonClasses = [
    'px-6 py-3 text-white rounded-lg transition-colors',
    className
  ]

  if (assignedVariant.cssClass) {
    buttonClasses.push(...assignedVariant.cssClass.split(' '))
  } else {
    // Fallback classes
    buttonClasses.push('bg-blue-600 hover:bg-blue-700')
  }

  return (
    <button 
      onClick={handleClick}
      className={buttonClasses.join(' ')}
      style={assignedVariant.cssStyle ? JSON.parse(assignedVariant.cssStyle) : {}}
    >
      {assignedVariant.value || 'Download Free Ebook'}
    </button>
  )
}

// Componente per testare headline
export function ABTestingHeadline({ 
  testId, 
  variants, 
  className = '' 
}: ABTestingCTAProps) {
  const { 
    assignedVariant, 
    isLoading, 
    error 
  } = useABTesting({
    testId,
    variants,
    autoTrack: true
  })

  if (isLoading) {
    return (
      <h1 className={`text-3xl font-bold text-gray-900 ${className}`}>
        Loading...
      </h1>
    )
  }

  if (error || !assignedVariant) {
    // Fallback alla prima variante
    const fallbackVariant = variants[0]
    return (
      <h1 
        className={`text-3xl font-bold text-gray-900 ${className}`}
        style={fallbackVariant.cssStyle ? JSON.parse(fallbackVariant.cssStyle) : {}}
      >
        {fallbackVariant.value || 'Fish Cannot Carry Guns'}
      </h1>
    )
  }

  // Applica le classi CSS della variante
  const headlineClasses = [
    'font-bold text-gray-900',
    className
  ]

  if (assignedVariant.cssClass) {
    headlineClasses.push(...assignedVariant.cssClass.split(' '))
  } else {
    // Fallback classes
    headlineClasses.push('text-3xl')
  }

  return (
    <h1 
      className={headlineClasses.join(' ')}
      style={assignedVariant.cssStyle ? JSON.parse(assignedVariant.cssStyle) : {}}
    >
      {assignedVariant.value || 'Fish Cannot Carry Guns'}
    </h1>
  )
}

// Componente per inizializzare tutti i test attivi
export function ABTestingProvider({ children }: { children: React.ReactNode }) {
  const { tests, isLoading } = useActiveTests()

  // Applica automaticamente le varianti per tutti i test attivi
  React.useEffect(() => {
    if (isLoading || tests.length === 0) return

    tests.forEach(test => {
      // Applica le varianti al DOM
      test.variants.forEach(variant => {
        const elements = document.querySelectorAll(test.targetSelector)
        elements.forEach(element => {
          if (variant.cssClass) {
            element.classList.add(...variant.cssClass.split(' '))
          }
          if (variant.value && element instanceof HTMLElement) {
            element.textContent = variant.value
          }
        })
      })
    })
  }, [tests, isLoading])

  return <>{children}</>
}
