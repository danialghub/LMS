import { create } from 'zustand'
import { privateRoutes } from '@/lib/privateRoutes'
import toast from 'react-hot-toast'

export const useTransactionStore = create((set, get) => ({

    //apis
    createTransaction: async (courseId) => {

        try {
            const { data } = await privateRoutes.post(`/transaction/place`,
                {courseId},
            )
            toast.success(data.message)

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");

        }
    },

  updateTransactionStatus: async (courseId,body) => {

        try {
            const { data } = await privateRoutes.put(`/transaction/make`,
                body,
            )
            toast.success(data.message)

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");

        }
    },

}))

