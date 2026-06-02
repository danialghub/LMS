import React, { useEffect } from 'react'

import Routes from '@/routes'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { PageLoader } from '@/components/index'

const App = () => {
  const { isCheckingAuth, checkAuthStatus, isAuthenticated } = useAuthStore()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  if (isCheckingAuth) return <PageLoader />;


  return (
    <div dir='rtl' className='h-screen bg-slate-50'>
      <Toaster />
      <Routes />
    </div>
  )
}
export default App;