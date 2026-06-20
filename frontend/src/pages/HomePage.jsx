import React, { useEffect } from 'react'
import { Navbar, Hero, LatestCourses, Footer } from '@/components/index'
import { useSearchParams } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore'
import { Helmet } from 'react-helmet-async'

const HomePage = () => {
    const [searchParams] = useSearchParams()
    const { authUser } = useAuthStore()

    const name = searchParams.get('name')


    return (
        <>
            <Helmet>
                <title>مغز افزار | آموزش برنامه‌نویسی و مهارت‌های تخصصی</title>

                <meta
                    name="description"
                    content="مغز افزار یک پلتفرم آموزش آنلاین برای یادگیری برنامه‌نویسی، توسعه وب، علوم داده و مهارت‌های تخصصی است. با دوره‌های پروژه‌محور، مسیر یادگیری خود را حرفه‌ای آغاز کنید."
                />

                <meta
                    name="keywords"
                    content="مغز افزار, آموزش آنلاین, دوره برنامه نویسی, آموزش React, آموزش Node.js, آموزش وب, آموزش توسعه نرم افزار, دوره آموزشی, LMS"
                />

                <meta name="robots" content="index, follow" />

                <meta property="og:title" content="مغز افزار | آموزش برنامه‌نویسی، هوش مصنوعی و مهارت‌های تخصصی" />

                <meta
                    property="og:description"
                    content="یادگیری برنامه‌نویسی، هوش مصنوعی، توسعه وب و مهارت‌های تخصصی با دوره‌های پروژه‌محور در پلتفرم آموزشی مغز افزار."
                />

                <meta property="og:type" content="website" />

                <meta property="og:site_name" content="مغز افزار" />

                <meta name="twitter:card" content="summary_large_image" />

                <meta
                    name="twitter:title"
                    content="مغز افزار | آموزش برنامه‌نویسی و مهارت‌های تخصصی"
                />

                <meta
                    name="twitter:description"
                    content="دوره‌های آموزشی پروژه‌محور در حوزه برنامه‌نویسی، توسعه وب و علوم داده در مغز افزار."
                />
            </Helmet>
            <div>
                <Navbar />

                <Hero />
                <LatestCourses />
                <Footer />
            </div>
        </>
    )
}

export default HomePage