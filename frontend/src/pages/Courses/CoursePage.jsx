import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore'
import { useCourseStore } from '@/store/useCourseStore'
import { PageLoader, CourseDetail } from '@/components/index'
const CoursePage = () => {

    const { courseId } = useParams()
    const { authUser,isCheckingAuth } = useAuthStore()
    const { getCourseById, course, isFetching } = useCourseStore()

    useEffect(() => {
        if (!courseId) return


        if (authUser && authUser.role === "student") {
            getCourseById(courseId, { userId: authUser._id })
     

        } else {
            getCourseById(courseId)
        }
    }, [authUser, courseId])



    return !isFetching && course ? (
        <CourseDetail course={course} isPreviewPage={true} />
    ) : <PageLoader />
}

export default CoursePage