'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  endDate: string
  className?: string
}

export default function CountdownTimer({ endDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = new Date(endDate).getTime()
      const difference = end - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
        setIsExpired(false)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  if (isExpired) {
    return (
      <div className={`bg-red-900/50 border border-red-700 rounded-lg p-4 text-center ${className}`}>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Clock className="w-5 h-5 text-red-300" />
          <span className="text-red-300 font-semibold">Offer Expired</span>
        </div>
        <p className="text-red-200 text-sm">
          The free offer has ended. Thank you for your interest!
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-amber-900/50 border border-amber-700 rounded-lg p-4 text-center ${className}`}>
      <div className="flex items-center justify-center space-x-2 mb-3">
        <Clock className="w-5 h-5 text-amber-300" />
        <span className="text-amber-300 font-semibold">Limited Time Offer</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-amber-800/50 rounded p-2">
          <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
          <div className="text-xs text-amber-200">Days</div>
        </div>
        <div className="bg-amber-800/50 rounded p-2">
          <div className="text-2xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-xs text-amber-200">Hours</div>
        </div>
        <div className="bg-amber-800/50 rounded p-2">
          <div className="text-2xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs text-amber-200">Min</div>
        </div>
        <div className="bg-amber-800/50 rounded p-2">
          <div className="text-2xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs text-amber-200">Sec</div>
        </div>
      </div>
      
      <p className="text-amber-200 text-sm">
        Only {timeLeft.days} days left to download for free!
      </p>
    </div>
  )
} 