import React, { useState } from 'react'
import { CourseSkleton, MyCourseCard } from '@/components/index'
import { useGetStudentCourses } from '@/query/courseQueries'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

const StudentCourses = () => {



    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isFetching,
        error
    } = useGetStudentCourses()

    const courses = data ? data?.pages?.flatMap(page => page.courses) : []


    useEffect(() => {
        if (!error) return

        toast.error(
            error?.response?.data?.message ||
            error?.message ||
            "مشکلی رخ داده"
        )
    }, [error])




    return (
        <div className="flex-1 min-w-0 bg-[#f3f3f3] min-h-screen">


            {/* CONTENT */}
            <div className="bg-white min-h-[100vh]  rounded-xl mt-10 p-8 ">
                <h1 className="text-3xl  text-black/80 font-heading mb-6 text-right">
                    دوره های من
                </h1>


                {isFetching
                    ? (
                        <div className="grid grid-cols-4 gap-5">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
                                <CourseSkleton key={idx} />
                            ))}
                        </div>
                    ) : courses.length > 0
                        ? (
                            <div className='flex flex-col items-center justify-center gap-8'>
                                <div className="grid grid-cols-4 gap-5">
                                    <AnimatePresence>
                                        {courses.map(course => (
                                            <MyCourseCard key={course._id} course={course} />
                                        ))}
                                    </AnimatePresence>
                                </div>
                                {hasNextPage && (
                                    <div >
                                        <button
                                            disabled={!hasNextPage || isFetchingNextPage}
                                            onClick={fetchNextPage}
                                            className="w-[120px] h-[40px] rounded-lg bg-blue-500 text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                                        >
                                            {isFetchingNextPage ? (
                                                <SubmitLoading />
                                            ) : (
                                                "مشاهده بیشتر"
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                        ) : (
                            <div className='text-2xl font-heading text-black/70 flex items-center justify-center '>
                                دوره ای یافت نشد
                            </div>
                        )
                }

            </div>





        </div >
    )
}

export default StudentCourses