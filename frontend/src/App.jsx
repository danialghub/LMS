import React, { useEffect, useRef } from 'react'

import Routes from '@/routes'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { PageLoader } from '@/components/index'
import { useLocation, useNavigation } from 'react-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css';

const NavigationProgress = () => {
  const location = useLocation();
  const previousPathname = useRef(location.pathname);


  useEffect(() => {

    if (previousPathname.current !== location.pathname) {
      NProgress.start();
      previousPathname.current = location.pathname;


      const timer = setTimeout(() => {
        NProgress.done();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return null;
}

const App = () => {
  const { isCheckingAuth, checkAuthStatus } = useAuthStore()


  useEffect(() => {
    checkAuthStatus()
  }, [])

  if (isCheckingAuth) return <PageLoader />;



  return (
    <div dir='rtl' className='h-screen bg-slate-50'>
      <Toaster />
      <NavigationProgress />
      <Routes />
    </div>
  )
}
export default App;