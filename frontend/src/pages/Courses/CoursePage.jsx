import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore'
import { useCourseStore } from '@/store/useCourseStore'
import { PageLoader, CourseDetail } from '@/components/index'
import { Helmet } from 'react-helmet-async'

const CoursePage = () => {

    const { courseId } = useParams()
    const { authUser, isCheckingAuth } = useAuthStore()
    const { getCourseById, course, isFetching } = useCourseStore()

    useEffect(() => {
        if (!courseId) return


        if (authUser && authUser.role === "student") {
            getCourseById(courseId, { userId: authUser._id })


        } else {
            getCourseById(courseId)
        }
    }, [courseId])



    return !isFetching && course ? (
        <>
            <Helmet>
                <title>{`${course.courseTitle} | مغز افزار`}</title>

                <meta
                    name="description"
                    content={`آموزش ${course.courseTitle} به صورت پروژه‌محور در مغز افزار. همین حالا این دوره را مشاهده کنید و مهارت‌های خود را ارتقا دهید.`}
                    data-rh="true"
                />

                <meta property="og:title" content={`${course.courseTitle} | مغز افزار`} />

                <meta
                    property="og:description"
                    content={`دوره ${course.courseTitle} در مغز افزار. یادگیری عملی و پروژه‌محور برای ورود به بازار کار.`}
                />

                <meta property="og:type" content="article" />

                <meta name="twitter:card" content="summary_large_image" />

                <meta
                    name="twitter:title"
                    content={`${course.courseTitle} | مغز افزار`}
                />

                <meta
                    name="twitter:description"
                    content={`دوره ${course.courseTitle} را در مغز افزار مشاهده کنید.`}
                />
                <link rel="canonical" href={`https://lms-48kl.onrender.com/course/${course._id}`} />
            </Helmet>

            <CourseDetail course={course} isPreviewPage={true} />
        </>
    ) : <PageLoader />
}

export default CoursePage