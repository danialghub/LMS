import { create } from 'zustand'
import { privateRoutes } from '@/lib/privateRoutes'
import toast from 'react-hot-toast'
import { useCourseStore } from '@/store/useCourseStore'
export const useStudentStore = create((set, get) => ({
    studentCourses: [],
    studentTransactions: [],
    lecture: {},
    isFetching: false,
    isMarking: false,

    getStudentCourses: async (query) => {

        try {
            const { data } = await privateRoutes.get('/student/courses', {
                headers: { 'Content-Type': 'application/json' },
                params: query
            })
            return data
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
            
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
    getTransactions: async (query) => {

        try {
            const { data } = await privateRoutes.get('/student/transactions', {
                params: query
            })
            return data
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    markLectureAsCompleted: async (courseId, lectureId) => {
        set({ isMarking: true })
        try {
            const { data } = await privateRoutes.post(`/student/lecture/mark-as-complete`, { courseId, lectureId })
            useCourseStore.setState(({ course }) => (
                { course: { ...course, courseProgress: data } }
            ))
            return data
            toast.success("این جلسه مشاهده شد")
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isMarking: false })
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

