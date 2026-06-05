import { create } from 'zustand'
import { privateRoutes } from '@/lib/privateRoutes'
import toast from 'react-hot-toast'

export const useTransactionStore = create((set, get) => ({

    //apis
    zarinPalRequest: async (courseId) => {

        try {
            const { data } = await privateRoutes.post('/transaction/request', {
                courseId
            });

            window.location.href = data.paymentUrl;

        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.response?.data?.message || 'خطا در ارتباط با سرور');
        }
    },

    //   updateTransactionStatus: async (courseId,body) => {

    //         try {
    //             const { data } = await privateRoutes.put(`/transaction/make`,
    //                 body,
    //             )
    //             toast.success(data.message)

    //         } catch (error) {
    //             toast.error(error.response?.data?.message || "Something went wrong");

    //         }
    //     },

}))

