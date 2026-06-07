import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Rating } from 'react-simple-star-rating'
import { courseRating } from '@/validators/courseSchema'
import { useStudentStore } from '@/store/useStudentStore'
import { useParams } from 'react-router'
import { motion, AnimatePresence } from "framer-motion";

const CourseRating = () => {
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
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
        setTimeout(() => {
            document.body.style.overflow = "hidden"
            setIsRatingModalOpen(true)
        }, 3000);

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])

    const onSubmit = async (data) => {
        if (!data.rating) return
        await rateToCourse(courseId, data.rating)
        setIsRatingModalOpen(false)
        document.body.style.overflow = "auto"
    }

    const onClose = () => {

        setIsRatingModalOpen(false);
        document.body.style.overflow = "auto"
    }



    return (
        <AnimatePresence>
            {isRatingModalOpen && (
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="min-h-screen w-full bg-gradient-to-br from-slate-900/30 via-slate-700/30 to-blue-900/30 dark:from-slate-900/30 dark:via-slate-700/30 dark:to-blue-900/30 absolute top-0 right-0 z-[100] backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-white/95 dark:bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-10 border border-zinc-200/50 dark:border-white/20"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md border border-zinc-200/50 dark:border-white/20 flex items-center justify-center transition-all duration-300 group"
                        >
                            <svg
                                className="w-5 h-5 text-zinc-600 group-hover:text-zinc-900 dark:text-gray-300 dark:group-hover:text-white transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* هدر با آیکون */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4"
                            >
                                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </motion.div>
                            <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                                به این دوره امتیاز دهید
                            </h3>
                            <p className="text-zinc-600 dark:text-gray-300 text-sm">
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
                                            emptyColor="#9ca3af"
                                        />

                                        {/* نمایش امتیاز انتخابی */}
                                        {field.value && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-center"
                                            >
                                                <span className="text-3xl font-bold text-orange-400">
                                                    {field.value}
                                                </span>
                                                <span className="text-zinc-600 dark:text-gray-300 text-lg"> / 5</span>
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            />

                            {errors.rating && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-2"
                                >
                                    <p className="text-sm text-red-400 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        {errors.rating.message}
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* دکمه ثبت */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="
              w-full py-3 px-4
              bg-gradient-to-r from-blue-500 to-indigo-600
              hover:from-blue-600 hover:to-indigo-700
              disabled:from-zinc-400 disabled:to-zinc-500
              dark:disabled:from-gray-600 dark:disabled:to-gray-600
              disabled:cursor-not-allowed
              text-white
              font-bold
              text-base
              rounded-xl
              transition-all
              duration-300
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
                        </motion.button>
                    </motion.div>
                </motion.form>
            )}
        </AnimatePresence>
    );
}

export default CourseRating