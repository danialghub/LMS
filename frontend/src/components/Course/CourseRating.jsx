import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Rating } from 'react-simple-star-rating'
import { courseRating } from '@/validators/courseSchema'
import { useStudentStore } from '@/store/useStudentStore'
import { useParams } from 'react-router'

const CourseRating = () => {
    const { rateToCourse } = useStudentStore()
    const { courseId } = useParams()
    const {
        handleSubmit,
        control,
        watch,
        formState: { isSubmitting, errors }
    } = useForm({
        resolver: zodResolver(courseRating),
        defaultValues: {
            rating: 1
        }
    })

    const selectedRating = watch('rating')

    const onSubmit = async (data) => {
        if (!data.rating) return


        await rateToCourse(courseId, data.rating)
    }

    return (
        <form

            onSubmit={handleSubmit(onSubmit)}
            className="bg-slate-800/10 w-[25vw] relative mt-10   rounded-xl shadow-md py-8  flex flex-col items-center gap-4"
        >
            <h3 className="text-lg font-semibold text-gray-200">
                به این دوره امتیاز دهید
            </h3>

            <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                    <Rating
                        initialValue={field.value}
                        onClick={field.onChange}
                        allowFraction={false}
                        size={40}
                        SVGclassName="inline-block"
                        transition
                        fillColor="#f59e0b"
                        emptyColor="#d1d5db"
                    />
                )}
            />



            {errors.rating && (
                <p className="text-sm text-red-500">
                    {errors.rating.message}
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="
                    px-4 py-2
                    max-w-xs
                    bg-blue-600
                    hover:bg-blue-700
                    disabled:bg-blue-400
                    text-white
                    font-medium
                   text-sm
                    rounded-lg
                    transition-all
                    duration-200
                "
            >
                {isSubmitting ? 'در حال ثبت...' : 'ثبت امتیاز'}
            </button>
        </form>
    )
}

export default CourseRating