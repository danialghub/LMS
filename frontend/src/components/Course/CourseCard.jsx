import React from 'react'
import { ArrowLeft, Star, StarIcon, User } from 'lucide-react'
import { Link } from 'react-router'
import { useCourseStore } from '@/store/useCourseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { formatPrice, formatNumber } from '@/lib/helper'
import { motion } from 'framer-motion'

const CourseCard = ({ course }) => {

    const { authUser } = useAuthStore()
    const calcDiscount = (price, discount) => {
        console.log(price, discount);

        const res = price - (price * discount / 100)
        const calc = res === 0 ? <span className='text-[16px]'>رایگان</span> : formatPrice(res)
        return calc
    }

    const calcTotalCourseRTating = (courseRatings) => {
        if (!courseRatings.length) return 0
        const sum = courseRatings.reduce((total, arg) => total + arg.rating, 0)
        return Math.floor(sum / courseRatings.length)
    }


    return (

        <motion.div
            className='rounded-lg w-full flex flex-col bg-white shadow-sm group mx-auto h-full'
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            layout
        >
            <Link to={`/course/${course._id}`}
                onClick={() => scrollTo(0, 0)}
                className="block">
                <div className='rounded-lg relative cursor-pointer overflow-hidden'>
                    <img
                        src={course.courseThumbnail}
                        alt=""
                        className='bg-cover aspect-video w-full object-contain'
                    />
                    <span className='bg-black/15 group-hover:bg-black/0 size-full absolute top-0 left-0 transition duration-300'></span>
                </div>
            </Link>

            {/* محتوای اصلی - با flex-grow برای پر کردن فضای خالی */}
            <div className='px-3 sm:px-4 pt-2 pb-4 sm:pb-5 flex flex-col flex-grow'>

                {/* بخش بالایی که باید چسبیده به بالا باشه */}
                <div className="flex-shrink-0">
                    <h2 className='text-sm sm:text-[18px] text-black/80 truncate font-heading [word-spacing:-1px]'>
                        {course.courseTitle}
                    </h2>
                </div>

                {/* بخش توضیحات - با h- ثابت یا min-height */}
                <div className="flex-shrink-0 mt-2">
                    <p
                        className='line-clamp-2 sm:line-clamp-3 leading-5 text-[11px] sm:text-[12px] text-black/50'
                        dangerouslySetInnerHTML={{ __html: course.courseDescription }}
                    />
                </div>

                {/* فضای کشسان برای اینکه بقیه محتوا رو به پایین بچسبونه */}
                <div className="flex-grow"></div>

                {/* بخش پایینی که همیشه به پایین چسبیده */}
                <div className="flex-shrink-0">
                    <div className='flex items-center justify-between mt-4 sm:mt-6 md:mt-8'>
                        <div className='flex items-center gap-1.5 sm:gap-2'>
                            <img src={course.instructor.avatar || "/instructor1.png"} className='w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover' alt="" />
                            <span className='text-[11px] sm:text-[13px] text-black/70 truncate'>{course.instructor.name}</span>
                        </div>

                        <div className='flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm'>
                            <span className='font-Dirooz-FD text-black/70'>{calcTotalCourseRTating(course.courseRatings)}</span>
                            <Star
                                size={16}
                                fill="gold"
                                color="gold"
                                strokeWidth={1}
                                style={{ filter: "drop-shadow(0 0 8px gold)" }}
                                className="sm:w-5 sm:h-5"
                            />
                        </div>
                    </div>

                    <hr className='text-gray-200 my-3 sm:my-4' />

                    {course?.enrolledStudents.some(std => std === authUser?._id)
                        ? (
                            <div>
                                <Link to={`/course/${course._id}`}
                                    onClick={() => scrollTo(0, 0)}
                                >
                                    <button className="w-full py-2 rounded bg-blue-100 text-blue-500 flex items-center justify-center text-[13px] cursor-pointer gap-1">
                                        <span>ادامه یادگیری</span>
                                        <ArrowLeft />
                                    </button>
                                </Link>
                            </div>
                        )
                        : (
                            <div className='flex justify-between items-end flex-wrap gap-3'>
                                <div className='flex items-end gap-1 text-[11px] sm:text-[13px] text-black/60 font-extralight'>
                                    <User size={18} className="sm:w-[22px] sm:h-[22px]" />
                                    <span className='font-Dirooz-FD'>{course.enrolledStudents.length}</span>
                                </div>

                                <div className='flex items-center gap-2 sm:gap-4'>
                                    <div className='flex flex-col items-end gap-0.5 sm:gap-1 font-Dirooz-FD'>
                                        <del className='text-[10px] sm:text-[15px] text-black/40'>
                                            {formatNumber(course.coursePrice)}
                                        </del>
                                        <div className='text-xs sm:text-[16px] flex items-center gap-1 text-blue-500'>
                                            <span className='font-bold'>
                                                {calcDiscount(course.coursePrice, course.courseDiscount)}
                                            </span>
                                            <span className='font-ghalam text-lg'>تومان</span>
                                        </div>
                                    </div>

                                    <div className='flex flex-col items-center gap-0.5 sm:gap-1'>
                                        <span className='font-Dirooz-FD text-[10px] sm:text-[14px] p-0.5 sm:p-1 px-1 sm:px-1.5 bg-blue-500 text-white rounded-md'>
                                            {course.courseDiscount}%
                                        </span>
                                        <span className='text-[10px] sm:text-sm text-blue-500 font-vazir'>تخفیف</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </motion.div>
    )
}

export default CourseCard