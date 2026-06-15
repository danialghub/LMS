import { create } from 'zustand'
import { publicAxios } from '@/lib/axios'
import { privateRoutes } from '@/lib/privateRoutes'
import toast from 'react-hot-toast'
import { useInstructorStore } from './useInstructorStore'

export const useCourseStore = create((set, get) => ({
    courses: [],
    course: null,
    lecture: {},
    isCreating: false,
    isFetching: false,
    isReordering: false,

    getCourses: async (filters = {}) => {

        try {
            const { data } = await publicAxios.get('/course/courses', {
                params: filters,
                headers: { 'Content-Type': 'application/json' }
            })
            return data
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    getCourseById: async (courseId, query = {}) => {
        set({ isFetching: true })
        console.log(query);

        try {
            const { data } = await publicAxios.get(`/course/${courseId}`, {
                params: query
            })

            set({ course: data })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isFetching: false })
        }
    },
    getCourseBannerInfo: async () => {
        try {
            const { data } = await publicAxios.get('/course/course-banner')
            console.log(data);

            return data
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    createCourse: async (title) => {

        try {
            const { data } = await privateRoutes.post('/course/create', title)
            return data
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");

            throw error;
        }
    },
    patchCourseFields: async (courseId, body) => {

        try {
            const { data } = await privateRoutes.patch(`/course/${courseId}/update`, body,
                { headers: { "Content-Type": "multipart/form-data" }, }
            )
            useInstructorStore.setState({ instructorCourse: data.updatedCourse })

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },

    updateCoursePublishStatus: async (courseId) => {
        const { instructorCourse } = useInstructorStore.getState()
        try {
            const { data } = await privateRoutes.patch(`/course/${courseId}/publish`)
            useInstructorStore.setState({
                instructorCourse: { ...instructorCourse, isCoursePublished: !instructorCourse.isCoursePublished }
            })
            toast.success(data.message)
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    createChapter: async (courseId, body) => {

        try {
            const { data } = await privateRoutes.post(`/course/${courseId}/chapter`, body)

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    getLectureById: async (courseId, chapterId, lectureId) => {
        set({ isFetching: true })
        try {
            const { data } = await privateRoutes.get(`/course/${courseId}/chapter/${chapterId}/lecture/${lectureId}`)

            set({ lecture: data })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isFetching: false })
        }
    },
    createLecture: async (body, chapterId) => {
        const { instructorCourse: course } = useInstructorStore.getState()
        console.log(body);

        try {
            const { data } = await privateRoutes.post(`/course/${course._id}/chapter/${chapterId}/lecture`, body)
            set({
                course: {
                    ...course,
                    courseContent: course.courseContent.map(ch => ch.chapterId === chapterId ? { ...ch, chapterContent: [...ch.chapterContent, data] } : ch)
                }
            })

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    patchChapterFields: async (courseId, chapterId, body) => {
        try {
            const { data } = await privateRoutes.patch(`/course/${courseId}/chapter/${chapterId}`, body)
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    patchChapterOrder: async (courseId, body) => {
        set({ isReordering: true })
        try {
            const { data } = await privateRoutes.patch(`/course/${courseId}/chapter/reorder`, body)

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isReordering: false })
        }
    },
    patchLectureFields: async (courseId, chapterId, lectureId, body) => {

        try {
            const { data } = await privateRoutes.patch(`/course/${courseId}/chapter/${chapterId}/lecture/${lectureId}`, body,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
            set({ lecture: data.updatedLecture })
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    patchLectureOrder: async (courseId, chapterId, body) => {
        set({ isReordering: true })
        try {
            const { data } = await privateRoutes.patch(`/course/${courseId}/chapter/${chapterId}/lecture/reorder`, body)

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isReordering: false })
        }
    },
    updateLecturePublishStatus: async (courseId, chapterId, lectureId) => {
        const { lecture } = get()
        try {
            const { data } = await privateRoutes.patch(`/course/${courseId}/chapter/${chapterId}/lecture/${lectureId}/publish`)
            set({ lecture: { ...lecture, isLecturePublished: data.lecture.isLecturePublished } })
            toast.success(data.message)
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    },
    removeAttachment: async (courseId, chapterId, lectureId) => {
        try {
            await privateRoutes.delete(`/course/${courseId}/chapter/${chapterId}/lecture/${lectureId}`)
            toast.success('پیوست با موفقیت حذف شد')
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    }
}))

