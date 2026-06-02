import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useCourseStore } from '@/store/useCourseStore'

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