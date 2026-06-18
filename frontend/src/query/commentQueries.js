import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCommentStore } from '@/store/useCommentStore'
import toast from 'react-hot-toast'

export const useGetCourseComments = (courseId, debouncedFilters = {}, userId = null) => {

    const { getCourseComments } = useCommentStore()

    return useInfiniteQuery({
        queryKey: ['courseComments', courseId, debouncedFilters],

        queryFn: ({ pageParam = 1 }) =>
            getCourseComments(courseId, {
                page: pageParam,
                limit: 6,
                ...debouncedFilters,
                userId
            }),

        initialPageParam: 1,

        getNextPageParam: (lastPage) =>
            lastPage.hasMore
                ? lastPage.page + 1
                : undefined,
    })
}

export const usePostCourseCommentMutation = () => {
    const queryClient = useQueryClient()
    const { postComment } = useCommentStore()

    return useMutation({
        mutationFn: ({ courseId, newComment }) => {  // یک object با دو خاصیت
            return postComment(courseId, newComment)  // مقدار را return کنید
        },

        onSuccess: (data, variables) => {
            toast.success('نظر شما با موفقیت ثبت گردید')
            console.log(variables);

            queryClient.invalidateQueries({
                queryKey: ['courseComments', variables.courseId]
            })
        },

        onError: (error) => {
            toast.error('خطا در ثبت نظر: ' + error.message)
        }
    })
}
export const useApproveCommentMutation = () => {
    const queryClient = useQueryClient()

    const { approveComment } = useCommentStore()

    return useMutation({
        mutationFn: ({ courseId, commentId }) => {
            return approveComment(courseId, commentId)
        },

        onSuccess: (data, variables) => {
            toast.success('نظر با موفقیت تأیید شد')

            queryClient.invalidateQueries({
                queryKey: ['courseComments', variables.courseId]
            })
        },

        onError: (error) => {
            toast.error('خطا در ثبت نظر: ' + error.message)
        }
    })
}
export const useDeleteCommentMutation = () => {
    const queryClient = useQueryClient()

    const { deleteComment } = useCommentStore()

    return useMutation({
        mutationFn: ({ courseId, commentId }) => {
            return deleteComment(courseId, commentId)
        },

        onSuccess: (data, variables) => {
            toast.success('نظر با موفقیت حذف شد')

            queryClient.invalidateQueries({
                queryKey: ['courseComments', variables.courseId]
            })
        },

        onError: (error) => {
            toast.error('خطا در ثبت نظر: ' + error.message)
        }
    })
}
export const useLikeCommentMutation = () => {
    const queryClient = useQueryClient()

    const { likeComment } = useCommentStore()

    return useMutation({
        mutationFn: ({ courseId, commentId }) => {
            return likeComment(courseId, commentId)
        },

        onSuccess: (data, variables) => {

            queryClient.invalidateQueries({
                queryKey: ['courseComments', variables.courseId]
            })
        },

        onError: (error) => {
            toast.error('خطا در ثبت نظر: ' + error.message)
        }
    })
}
export const useDisLikeCommentMutation = () => {
    const queryClient = useQueryClient()

    const { disLikeComment } = useCommentStore()

    return useMutation({
        mutationFn: ({ courseId, commentId }) => {
            return disLikeComment(courseId, commentId)
        },

        onSuccess: (data, variables) => {

            queryClient.invalidateQueries({
                queryKey: ['courseComments', variables.courseId]
            })
        },

        onError: (error) => {
            toast.error('خطا در ثبت نظر: ' + error.message)
        }
    })
}