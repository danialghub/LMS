import { create } from 'zustand'
import { privateRoutes } from '@/lib/privateRoutes'
import toast from 'react-hot-toast'

export const useTransactionStore = create((set, get) => ({

    //apis
    createTransaction: async (courseId, body) => {

        try {
            const { data } = await privateRoutes.post(`/transaction/purchase/${courseId}`,
                body,
            )
            toast.success(data.message)

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");

        }
    },


}))

