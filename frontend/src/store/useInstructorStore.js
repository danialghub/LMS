import { create } from 'zustand'
import { privateRoutes } from '@/lib/privateRoutes'
import toast from 'react-hot-toast'

export const useInstructorStore = create((set, get) => ({
    instructorCourses: [],
    instructorCourse: {},
    lecture: {},
    isFetching: false,
    isReordering: false,
    getInstrucorCourses: async () => {
        set({ isFetching: true })
        try {
            const { data } = await privateRoutes.get('/instructor/courses', {
                headers: { 'Content-Type': 'application/json' }
            })
            set({ instructorCourses: data })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isFetching: false })
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
}))

