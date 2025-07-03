import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div 
      className={cn(
        'border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingOverlayProps {
  text?: string
  className?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  text = 'Chargement...', 
  className 
}) => {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-slate-600">{text}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner