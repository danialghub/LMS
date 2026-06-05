import { create } from 'zustand'
import { privateRoutes } from '@/lib/privateRoutes'
import toast from 'react-hot-toast'

export const useInstructorStore = create((set, get) => ({
    instructorCourse: {},
    lecture: {},
    isReordering: false,
    courseAnalytics: [],
    getInstrucorCourses: async (query) => {

        try {
            const { data } = await privateRoutes.get('/instructor/courses', {
                headers: { 'Content-Type': 'application/json' },
                params: query
            })
      

            return data
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    getInstructorCourseById: async (courseId) => {
        set({ isFetching: true })
        try {
            const { data } = await privateRoutes.get(`/instructor/course/${courseId}`)

            set({ instructorCourse: data })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isFetching: false })
        }
    },
    getCourseAnalytics: async () => {
        set({ isFetching: true })
        try {
            const { data } = await privateRoutes.get('/instructor/courses/analytics')
            set({ courseAnalytics: data })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isFetching: false })
        }
    }
}))

