import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCourseStore } from '@/store/useCourseStore'
import { useInstructorStore } from '@/store/useInstructorStore'
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
export const useGetInstructorCourses = (page) => {
    const { getInstrucorCourses } = useInstructorStore()

    return useQuery({
        queryKey: ['instructorCourses', page],
        queryFn: () => getInstrucorCourses({ page, limit: 6 }),
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
const useRateToCourse = (courseId, rating) => {
    const queryClient = useQueryClient()
    const { rateToCourse } = useCourseStore()
    return useMutation({
        mutationFn: () => rateToCourse(courseId, rating),

        onSuccess: (_, variables) => {
            toast.success(
                'ممنون از امتیازدهی شما'
            )

            queryClient.invalidateQueries({
                queryKey: [
                    'course',
                    variables.courseId
                ]
            })
        }
    })
}