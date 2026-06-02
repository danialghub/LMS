import { create } from 'zustand'
import { privateRoutes } from '@/lib/privateRoutes'
import toast from 'react-hot-toast'

export const useStudentStore = create((set, get) => ({
    studentCourses: [],
    studentCourse: {},
    courseProgress: {},
    lecture: {},
    isFetching: false,

    getStudentCourses: async () => {
        set({ isFetching: true })
        try {
            const { data } = await privateRoutes.get('/student/courses', {
                headers: { 'Content-Type': 'application/json' }
            })
            set({ studentCourses: data })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isFetching: false })
        }
    },
    getStudentCourseById: async (courseId) => {
        set({ isFetching: true })
        try {
            const { data } = await privateRoutes.get(`/student/course/${courseId}`)

            set({ studentCourse: data })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isFetching: false })
        }
    },
    getCourseProgress: async (courseId) => {
        try {
            const { data } = await privateRoutes.get(`/student/course/${courseId}/course-progress`)
            set({ courseProgress: data })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    markLectureAsCompleted: async (courseId, lectureId) => {
        try {
            const { data } = await privateRoutes.post(`/student/lecture/mark-as-complete`, { courseId, lectureId })
            set({ courseProgress: data })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    rateToCourse: async (courseId, rating) => {
        console.log(rating);
        
        try {
            const { data } = await privateRoutes.post(`/student/${courseId}/rate-to-course`, { rating })
            set(({ course }) => (
                { course: { ...course, courseRatings: data } }
            ))
            toast.success('ممنون از امتیازدهی شما')
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
}))

