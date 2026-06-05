import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useAuthStore } from '@/store/useAuthStore'
import { useCourseStore } from '@/store/useCourseStore'
import { PageLoader, CourseDetail } from '@/components/index'
import toast from 'react-hot-toast'

const LessonPage = () => {

  const { chapterId, lectureId, courseId } = useParams()
  const { authUser, isCheckingAuth } = useAuthStore()
  const { getCourseById, course } = useCourseStore()
  const [lecture, setLecture] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!courseId || isCheckingAuth || !(authUser && authUser.role === "student")) return
    if (course._id) return



    getCourseById(courseId, { userId: authUser._id })




  }, [courseId, authUser])

  useEffect(() => {
    // اگر هنوز وضعیت احراز هویت مشخص نشده، هیچ کاری نکن
    if (authUser === undefined) {
      return; // یا میتونید یک loading state برگردونید
    }

   
    if (!authUser) {
      navigate("/unathorized");
      return;
    }

    // بررسی وجود course, lectureId, chapterId
    if (!course._id || !lectureId || !chapterId) return;

    const chapter = course.courseContent[chapterId];
    const lecture = chapter?.chapterContent[lectureId];

    if (!lecture || !chapter) {
      toast.error('جلسه نامعتبر است');
      navigate(-1);
      return;
    }

    setLecture(lecture);
  }, [course._id, chapterId, authUser, navigate, toast]);


  return lecture?.lectureId ? (
    <CourseDetail course={{ ...course, lecture }} isPreviewPage={false} />
  ) : <PageLoader />
}

export default LessonPage