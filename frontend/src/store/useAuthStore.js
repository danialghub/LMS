import { create } from 'zustand'
import { publicAxios } from '@/lib/axios'
import { privateRoutes } from '@/lib/privateRoutes'
import toast from 'react-hot-toast'

export const useAuthStore = create((set, get) => ({
    token: null,
    authUser: undefined,
    users: null,
    isCheckingAuth: true,
    isLoggedOut: false,

    //apis
    signUp: async (body) => {
        try {
            const { data } = await publicAxios.post('/auth/signup',
                body,
                { headers: { "Content-Type": "multipart/form-data" }, }
            )
            toast.success(data.message)
            return true
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            return false
        }
    },
    login: async (body) => {
        try {
            const { data } = await publicAxios.post('/auth/login', body
                ,
                { headers: { "Content-Type": "application/json" }, }
            )
            toast.success(data.message)
            set({ authUser: data.user, token: data.accessToken })
            return true
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            return false
        }
    },
    logout: async () => {
        try {
            const { data } = await publicAxios.post('/auth/logout')
            set({ authUser: null, token: null })
            toast.success(data.message)
            set({ isLoggedOut: true })
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },
    issueRefreshToken: async () => {

        try {
            const { data } = await publicAxios.get('/auth/refresh')
            set({
                token: data.accessToken,
                authUser: data.user
            })
            return data.accessToken

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    checkAuthStatus: async () => {
        try {
            const { data } = await privateRoutes.get('/auth/check')

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");

        } finally {
            set({ isCheckingAuth: false })
        }
    },
    changePassword: async (body) => {
        try {
            const { data } = await privateRoutes.patch('/auth/change-password', body)
            toast.success("رمزعبور با موفقیت تغییر یافت")
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    changeUserProfile: async (body) => {
        try {
            const { data } = await privateRoutes.patch('/auth/change-profile', body)
            console.log(data);

            set({ authUser: data.updatedUser })
            toast.success("اطلاعات با موفقیت تغییر پیدا کرد")
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    changeInstructorSpecifications: async (body) => {
        try {
            const { data } = await privateRoutes.patch('/auth/change-instructor-specifications', body)
            set(({ authUser }) => (
                { authUser: { ...authUser, instructorProfile: data.instructorProfile } }
            ))
            toast.success("مشخصات  با موفقیت تغییر پیدا کرد")
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },

}))

