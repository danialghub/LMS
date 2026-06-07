import { create } from 'zustand'
import { privateRoutes } from '@/lib/privateRoutes'
import toast from 'react-hot-toast'
import { useCourseStore } from '@/store/useCourseStore';

export const useTransactionStore = create((set, get) => ({

    //apis
    zarinPalRequest: async (courseId) => {

        try {
            const { data } = await privateRoutes.post('/transaction/request', {
                courseId
            });
            if (data?.paymentUrl) {
                window.location.href = data.paymentUrl;
            }
            if (data?.course) {
                useCourseStore.setState(
                    {
                        course: data.course
                    }
                )
                toast.success(data.message)
            }

        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.response?.data?.message || 'خطا در ارتباط با سرور');
        }
    },


}))

