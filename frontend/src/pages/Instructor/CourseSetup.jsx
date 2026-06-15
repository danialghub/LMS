import React, { useEffect } from 'react'
import { CourseInput } from '@/components/index'
import { useCourseStore } from '@/store/useCourseStore'
import { useParams } from 'react-router'
import { Loader, Upload, LayoutDashboard, ListCheckIcon, DollarSign, Percent, CloudOff } from 'lucide-react'
import { useInstructorStore } from '@/store/useInstructorStore'



const Baddge = ({ Icon, title, className }) => {
    return (
        <div className={`flex items-center gap-2 my-4 ${className}`}  >
            <div className='p-2 rounded-full bg-blue-100 text-blue-700'><Icon /></div>
            <p className='text-xl text-black/70'>{title}</p>
        </div>
    )
}


const CourseSetup = () => {


    const { updateCoursePublishStatus } = useCourseStore()
    const { getInstructorCourseById, isFetching, instructorCourse: course } = useInstructorStore()

    const { courseId } = useParams()


    const handlePublishing = async () => {
        await updateCoursePublishStatus(courseId)
    }

    useEffect(() => {
        if (!courseId) return

        getInstructorCourseById(courseId)

    }, [courseId])

    const hasAtLeastOneLecture = course?.courseContent?.find(ch => ch.chapterContent.some(lec => lec.isLecturePublished))


    const requiredFieldes = [
        course?.courseTitle,
        course?.courseDescription,
        course?.coursePrice >= 0,
        course?.courseThumbnail,
        Number(course?.courseDiscount) >=0 ,
        hasAtLeastOneLecture,
    ]

    const toatalFields = requiredFieldes.length

    const completedFields = requiredFieldes.filter(Boolean).length




    return !isFetching ? (
        <div className='px-5 sm:px-10 py-6 transform-gpu overflow-x-hidden'>

            <div className='flex justify-between  items-center '>
                <div>
                    <h2 className='text-2xl font-bold text-black/80 mb-1'>تنظیمات دوره</h2>
                    <span className='text-black/60 text-sm '>فیلد های پر شده ({completedFields}/{toatalFields})</span>
                </div>

                <button
                    onClick={handlePublishing}
                    title='انتشار دوره'
                    disabled={toatalFields !== completedFields}
                    className={`md:ml-5 rounded-md  p-3 cursor-pointer disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed ${course.isCoursePublished ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                    {course.isCoursePublished
                        ? <div className='flex items-center flex-col justify-center gap-2'>
                            <CloudOff />
                            <span className='text-sm'> لغو انتشار</span>
                        </div>
                        : <div className='flex items-center flex-col justify-center gap-2'>
                            <Upload />
                            <span className='text-sm'> انتشار دوره</span>
                        </div>
                    }
                </button>

            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6  mt-10'>
                <div className='flex flex-col gap-6' >
                    <Baddge Icon={LayoutDashboard} title="مشخصات دوره" className="!my-0" />
                    <CourseInput inputName="title" value={course?.courseTitle} courseId={course._id} />

                    <CourseInput inputName="description" value={course?.courseDescription} courseId={course._id} />

                    <CourseInput inputName="thumbnail" value={course?.courseThumbnail} courseId={course._id} />

                </div>
                <div className='flex flex-col gap-6'>
                    <div>
                        <Baddge Icon={ListCheckIcon} title="فصل های دوره" />
                        <CourseInput inputName="chapters" value={course?.courseContent} courseId={course._id} />

                    </div>
                    <div >
                        <Baddge Icon={DollarSign} title="مبلغ دوره" />
                        <CourseInput inputName="price" value={course?.coursePrice} courseId={course._id} />
                    </div>
                    <div>
                        <Baddge Icon={Percent} title="درصد تخفیف دوره" />
                        <CourseInput inputName="discount" value={course?.courseDiscount} courseId={course._id} />
                    </div>

                </div>

            </div>

        </div >
    ) : <div className='h-screen flex items-center justify-center '><Loader className='animate-spin text-3xl text-blue-500' /></div>
}

export default CourseSetup