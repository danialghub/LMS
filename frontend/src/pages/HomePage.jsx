import React, { useEffect } from 'react'
import { Navbar, Hero, LatestCourses,Footer } from '@/components/index'
import { useSearchParams } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore'
import { useQuery } from '@tanstack/react-query'


const HomePage = () => {
    const [searchParams] = useSearchParams()
    const { authUser } = useAuthStore()

    const name = searchParams.get('name')


    return (
        <div>
            <Navbar />
            <Hero />
            <LatestCourses />
            <Footer />
        </div>
    )
}

export default HomePage