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
    getCourseProgress: async (courseId) => {
        try {
            const { data } = await privateRoutes.get(`/student/course/${courseId}/course-progress`)
            set({ courseProgress: data })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    getTransactions: async () => {
        set({ isFetching: true })
        try {
            const { data } = await privateRoutes.get('/student/transactions')
            set({ studentTransactions: data })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isFetching: false })
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

