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
        // بازگردوندن مقدار عددی به جای JSX
        return res === 0 ? 0 : res
    }

    const calcTotalCourseRTating = (courseRatings) => {
        if (!courseRatings.length) return 0
        const sum = courseRatings.reduce((total, arg) => total + arg.rating, 0)
        return Math.floor(sum / courseRatings.length)
    }

    // محاسبه قیمت نهایی
    const finalPrice = calcDiscount(course.coursePrice, course.courseDiscount)
    const isFree = finalPrice === 0

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
                        className='bg-cover aspect-video w-full object-cover h-auto'
                    />
                    <span className='bg-black/15 group-hover:bg-black/0 size-full absolute top-0 left-0 transition duration-300'></span>
                </div>
            </Link>


            <div className='px-3 sm:px-4 pt-2 pb-4 sm:pb-5 flex flex-col flex-grow'>


                <div className="flex-shrink-0">
                    <h2 className='mobile-short:text-sm mobile-tall:text-[15px] lg:text-[18px] text-black/80 truncate font-heading [word-spacing:-1px]'>
                        {course.courseTitle}
                    </h2>
                </div>


                <div className="flex-shrink-0 mt-2">
                    <p
                        className='line-clamp-2 lg:line-clamp-3 leading-5 text-[11px] lg:text-[12px] text-black/50'
                        dangerouslySetInnerHTML={{
                            __html: course.courseDescription.replace(/&nbsp;/g, ' ')
                        }}
                    />
                </div>

                {/* فضای کشسان برای اینکه بقیه محتوا رو به پایین بچسبونه */}
                <div className="flex-grow"></div>

                {/* بخش پایینی که همیشه به پایین چسبیده */}
                <div className="flex-shrink-0">
                    <div className='flex items-center justify-between mt-4 sm:mt-6 md:mt-8'>
                        <div className='flex items-center gap-1.5 sm:gap-2'>
                            <img src={course.instructor.avatar || "/pro-avatar.webp"} className='w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover' alt="" />
                            <span className='mobile-short:text-[11px] mobile-tall:text-xs  text-[13px] text-black/70 truncate'>{course.instructor.name}</span>
                        </div>

                        <div className='flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm'>
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

                                {isFree ? (
                                    // حالت رایگان - فقط نمایش متن رایگان
                                    <div className='text-[16px] lg:text-[20px] font-heading text-blue-500'>
                                        رایگان
                                    </div>
                                ) : (
                                    // حالت غیر رایگان - نمایش قیمت و تخفیف
                                    <div className='flex items-center mobile-short:gap-4 mobile-tall:gap-3 gap-4'>
                                        <div className='flex flex-col items-end gap-0.5 sm:gap-1 font-Dirooz-FD'>
                                            {course?.courseDiscount > 0 && (
                                                <del className='mobile-short:text-[12px] mobile-tall:text-[11px] text-[15px] text-black/40'>
                                                    {formatNumber(course.coursePrice)}
                                                </del>
                                            )
                                            }
                                            <div className='mobile-short:text-[14px] mobile-tall:text-xs text-[16px] flex items-center gap-1 text-blue-500'>
                                                <span className='font-bold'>
                                                    {formatPrice(finalPrice)}
                                                </span>
                                                <span className='font-ghalam text-lg'>تومان</span>
                                            </div>
                                        </div>

                                        {course.courseDiscount > 0 && (
                                            <div className='flex flex-col items-center gap-2 sm:gap-1'>
                                                <span className='font-Dirooz-FD mobile-short:text-[13px] mobile-tall:text-[10px] text-[14px] p-0.5 sm:p-1 px-1 sm:px-1.5 bg-blue-500 text-white rounded-md'>
                                                    {course.courseDiscount}%
                                                </span>
                                                <span className='mobile-short:text-[12px] mobile-tall:text-[11px]  text-sm text-blue-500 font-vazir'>تخفیف</span>
                                            </div>
                                        )

                                        }
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>
        </motion.div>
    )
}

export default CourseCard