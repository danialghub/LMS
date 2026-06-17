import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCourseStore } from '@/store/useCourseStore'
import { useInstructorStore } from '@/store/useInstructorStore'
import { useStudentStore } from '@/store/useStudentStore'
import toast from 'react-hot-toast'

export const useGetCourses = (debouncedFilters = {}) => {

    const { getCourses } = useCourseStore()

    return useInfiniteQuery({
        queryKey: ['courses', debouncedFilters],

        queryFn: ({ pageParam = 1 }) =>
            getCourses({
                page: pageParam,
                limit: 6,
                ...debouncedFilters
            }),

        initialPageParam: 1,

        getNextPageParam: (lastPage) =>
            lastPage.hasMore
                ? lastPage.page + 1
                : undefined,
    })
}
export const useGetStudentCourses = (stdId) => {

    const { getStudentCourses } = useStudentStore()

    return useInfiniteQuery({
        queryKey: ['studentCourses', stdId],

        queryFn: ({ pageParam = 1 }) =>
            getStudentCourses({
                page: pageParam,
                limit: 6,
            }),

        initialPageParam: 1,

        getNextPageParam: (lastPage) =>
            lastPage.hasMore
                ? lastPage.page + 1
                : undefined,

    })
}
export const useGetInstructorCourses = (page, instructorId) => {
    const { getInstrucorCourses } = useInstructorStore()

    return useQuery({
        queryKey: ['instructorCourses', page, instructorId],
        queryFn: () => getInstrucorCourses({ page, limit: 6 }),
        keepPreviousData: true
    })
}
export const useGetStudentTransactions = (page) => {
    const { getTransactions } = useStudentStore()

    return useQuery({
        queryKey: ['studentTransactions', page],
        queryFn: () => getTransactions({ page, limit: 6 }),
        keepPreviousData: true
    })
}

export const usePostCourseMutation = () => {

    const queryClient = useQueryClient()

    const { createCourse } = useCourseStore()

    return useMutation({
        mutationFn: (newCourse) => {
            createCourse(newCourse)
            console.log('mutated');

        },

        onSuccess: (data, variables) => {
            toast.success(
                'دوره با موفقیت ایجاد شد'
            )

            queryClient.invalidateQueries({
                queryKey: ['instructorCourses']
            })
        },
    })
}
