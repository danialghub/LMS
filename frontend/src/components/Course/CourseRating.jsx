import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Rating } from 'react-simple-star-rating'
import { courseRating } from '@/validators/courseSchema'
import { useStudentStore } from '@/store/useStudentStore'
import { useParams } from 'react-router'

const CourseRating = () => {
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(true)
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

    useEffect(() => {
        document.body.style.overflow = "hidden"
    }, [])
    const selectedRating = watch('rating')

    const onSubmit = async (data) => {
        if (!data.rating) return
        await rateToCourse(courseId, data.rating)
        setIsRatingModalOpen(false)
    }

    const onClose = () => {

        setIsRatingModalOpen(false);
        document.body.style.overflow = "auto"
    }

    return isRatingModalOpen && (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-screen w-full bg-gradient-to-br from-slate-900/30 via-slate-700/30 to-blue-900 flex items-center justify-center p-4 absolute top-0 right-0 z-[100] backdrop-blur-sm"
        >



            <div className="relative w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-10 border border-white/20">
                <button
                    type="button"
                    onClick={onClose} // تابعی که برای بستن مودال یا فرم امتیازدهی استفاده می‌شود
                    className="cursor-pointer absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 "
                >
                    <svg
                        className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {/* هدر با آیکون */}
                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
                        <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        به این دوره امتیاز دهید
                    </h3>
                    <p className="text-gray-300 text-sm">
                        امتیاز شما به ما در بهبود دوره کمک می‌کند
                    </p>
                </div>

                {/* بخش امتیازدهی */}
                <div className="flex flex-col items-center gap-6 mb-8">
                    <Controller
                        name="rating"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Rating
                                    initialValue={field.value}
                                    onClick={field.onChange}
                                    allowFraction={false}
                                    size={48}
                                    SVGclassName="inline-block transition-transform hover:scale-110"
                                    transition
                                    fillColor="#fbbf24"
                                    emptyColor="#4b5563"
                                />

                                {/* نمایش امتیاز انتخابی */}
                                {field.value && (
                                    <div className="text-center">
                                        <span className="text-3xl font-bold text-orange-400">
                                            {field.value}
                                        </span>
                                        <span className="text-gray-300 text-lg"> / 5</span>
                                    </div>
                                )}
                            </>
                        )}
                    />

                    {errors.rating && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-2">
                            <p className="text-sm text-red-400 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {errors.rating.message}
                            </p>
                        </div>
                    )}
                </div>

                {/* دکمه ثبت */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                    w-full py-3 px-4
                    bg-gradient-to-r from-blue-500 to-indigo-600
                    hover:from-blue-600 hover:to-indigo-700
                    disabled:from-gray-600 disabled:to-gray-600
                    disabled:cursor-not-allowed
                    text-white
                    font-bold
                    text-base
                    rounded-xl
                    transition-all
                    duration-300
                    transform
                    hover:scale-[1.02]
                    active:scale-[0.98]
                    shadow-lg
                    flex
                    items-center
                    justify-center
                    gap-2
                "
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            در حال ثبت...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            ثبت امتیاز
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default CourseRating