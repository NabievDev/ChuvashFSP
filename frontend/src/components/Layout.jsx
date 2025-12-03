import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import CustomCursor from './CustomCursor'
import LoadingScreen from './LoadingScreen'

export default function Layout() {
  const location = useLocation()
  const [showLoading, setShowLoading] = useState(() => {
    if (location.pathname !== '/') return false
    const hasLoaded = sessionStorage.getItem('fsp-loaded')
    return !hasLoaded
  })
  const [loadingComplete, setLoadingComplete] = useState(false)

  const handleLoadingComplete = () => {
    setLoadingComplete(true)
    sessionStorage.setItem('fsp-loaded', 'true')
  }

  return (
    <div className="min-h-screen flex flex-col cursor-none">
      <CustomCursor />
      {showLoading && !loadingComplete && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
