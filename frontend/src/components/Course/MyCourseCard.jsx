import React, { useEffect, useState } from 'react'
import { Star, StarIcon, User, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'

const MyCourseCard = ({ course }) => {


    const calcTotalLectures = (chapters) => {
        const publishedLecturesCount = chapters.reduce((total, ch) => {
            const publishedInChapter = ch.chapterContent.filter(lec => lec.isLecturePublished).length;
            return total + publishedInChapter;
        }, 0);

        return publishedLecturesCount;
    }

    const progressPercent = Math.round(
        ((course?.courseProgress?.completedLectures?.length || 0) / calcTotalLectures(course.courseContent)) * 100
    );


    return (
        <motion.div
            className='rounded-lg w-full  flex flex-col justify-between  shadow-sm group mx-auto bg-white'
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            layout
        >
            <div
                className='rounded-lg relative cursor-pointer overflow-hidden'
            >
                <img
                    src={course.courseThumbnail}
                    alt=""
                    className='bg-cover aspect-video w-full object-cover'
                />
                <span
                    className='bg-black/15 group-hover:bg-black/0 size-full absolute top-0 left-0 transition duration-300'></span>
            </div>

            <div className='p-3 sm:p-4 pb-3 sm:pb-4'>
                <h2 className='text-sm  text-black/80  truncate'>{course.courseTitle}</h2>


                <div className='flex items-center gap-1 mt-4 sm:mt-6  text-black/60'>
                    <User size={20} />
                    <span className='text-[11px] sm:text-[13px] font-medium  truncate'>{course.instructor.name}</span>
                </div>


                <hr className='text-gray-200 my-3 sm:my-3' />

                <div className=''>
                    <div className='flex items-center gap-4 w-full'>
                        {/* متن درصد */}
                        <div className={`flex items-center gap-1 text-sm  shrink-0 ${progressPercent == 100 ? "text-green-600" : "text-blue-500"}`}>
                            <span className='font-Dirooz-FD'>{progressPercent}%</span>
                            <span className='font-Dirooz'>تکمیل</span>
                        </div>

                        {/* نوار پیشرفت */}
                        <div className='relative h-1 rounded-full w-full bg-gray-200 overflow-hidden'>
                            {/* حاشیه  */}
                            <div className='h-full w-0 bg-blue-500 rounded-full'></div>
                            {/* درصد پر شده */}
                            <div
                                className={`${progressPercent == 100 ? "bg-green-600" : "bg-blue-500"} absolute top-0 right-0  h-full transition-all duration-1000 ease-out`}
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>


                    </div>

                </div>
            </div>
            {/* دکمه رفتن به دوره */}
            <div>
                <Link
                    to={`/course/${course._id}`}
                >
                    <button
                        className="w-full py-2 rounded bg-blue-100 text-blue-500 flex items-center justify-center text-[13px] cursor-pointer"
                    >
                        <span>ادامه یادگیری</span>
                        <ArrowLeft />
                    </button>
                </Link>
            </div>
        </motion.div>
    )
}

export default MyCourseCard