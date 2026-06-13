import { create } from 'zustand'
import { privateRoutes } from '@/lib/privateRoutes'
import { publicAxios } from '@/lib/axios'
import toast from 'react-hot-toast'

export const useCommentStore = create((set, get) => ({

    getCourseComments: async (courseId, query) => {

        try {
            const { data } = await publicAxios.get(`/comment/${courseId}/all`, {
                headers: { 'Content-Type': 'application/json' },
                params: query
            })

            return data
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    postComment: async (courseId, body) => {
        try {
            const { data } = await privateRoutes.post(`/comment/${courseId}/post`, body)
            return data
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
            throw error;
        }
    },
    approveComment: async (courseId, commentId) => {
        try {
            const { data } = await privateRoutes.put(`/comment/${courseId}/${commentId}/approve`)
            return data
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
            throw error;
        }
    }

}))

