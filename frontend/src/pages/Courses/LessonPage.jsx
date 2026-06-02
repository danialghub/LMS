import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useAuthStore } from '@/store/useAuthStore'
import { useCourseStore } from '@/store/useCourseStore'
import { PageLoader, CourseDetail } from '@/components/index'
import toast from 'react-hot-toast'

const LessonPage = () => {

  const { chapterId, lectureId, courseId } = useParams()
  const { authUser } = useAuthStore()
  const { getLectureById, getCourseById, course, isFetching } = useCourseStore()
  const [lecture, setLecture] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!courseId) return
    if (course._id) return

    if (authUser && authUser.role === "student") {
      getCourseById(courseId, { userId: authUser._id })

    } else {
      getCourseById(courseId)
    }

  }, [courseId, authUser])

  useEffect(() => {
    if (!course._id || !lectureId) return

    const lecture = course.courseContent[chapterId].chapterContent[lectureId]

    if (!lecture) {
      toast.error('جلسه نامعتبر است')
      navigate(-1)
    }
    setLecture(lecture)

  }, [course._id, chapterId])


  return lecture?.lectureId ? (
    <CourseDetail course={{ ...course, lecture }} isPreviewPage={false} />
  ) : <PageLoader />
}

export default LessonPage