'use client'

import { useEffect } from 'react'

export function CacheInvalidator() {
  useEffect(() => {
    // Force cache invalidation on each visit to ensure latest version
    const invalidateCache = async () => {
      try {
        // Force service worker update check
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration()
          if (registration) {
            registration.update() // Force update check
          }
        }

        // Clear browser cache for critical resources
        if ('caches' in window) {
          const cacheNames = await caches.keys()
          // Only clear old portfolio caches, keep current one
          const currentCache = cacheNames.find(name => name.startsWith('portfolio-v'))
          await Promise.all(
            cacheNames
              .filter(name => name.startsWith('portfolio-v') && name !== currentCache)
              .map(cacheName => caches.delete(cacheName))
          )
        }

        // Force revalidation of critical images
        const criticalResources = [
          '/kevin-headshot.jpg',
          '/kevin-floorball-homepage.jpg',
          '/kevin-family.jpg'
        ]
        
        criticalResources.forEach(resource => {
          const img = new Image()
          img.src = `${resource}?v=${Date.now()}`
        })

      } catch (error) {
        console.warn('Cache invalidation failed:', error)
      }
    }

    // Run cache invalidation immediately
    invalidateCache()

    // Also run on focus to catch users returning to tab
    const handleFocus = () => {
      invalidateCache()
    }

    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // This component doesn't render anything
  return null
}
