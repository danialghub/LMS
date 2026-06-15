import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useCourseStore } from '@/store/useCourseStore'
import { ArrowRight, CloudOff, DollarSign, Eye, FileIcon, LayoutDashboard, ListCheckIcon, Loader, Upload, VideoIcon } from 'lucide-react'
import { LectureInput } from '@/components/index'
import { Link } from 'react-router'

const Baddge = ({ Icon, title, className }) => {
    return (
        <div className={`flex items-center gap-2 my-4 ${className}`}  >
            <div className='p-2 rounded-full bg-blue-100 text-blue-700'><Icon size={30} /></div>
            <p className='text-xl text-black/70'>{title}</p>
        </div>
    )
}


const LectureSetup = () => {
    const { lectureId, chapterId, courseId } = useParams()
    const { lecture, isFetching, getLectureById, updateLecturePublishStatus } = useCourseStore()


    const handlePublishing = async () => {
        await updateLecturePublishStatus(courseId, chapterId, lectureId)
    }
    useEffect(() => {
        if (!lectureId || !chapterId || !courseId) return

        getLectureById(courseId, chapterId, lectureId)
    }, [lectureId, chapterId, courseId])

    const requiredFieldes = [
        lecture?.lectureTitle,
        lecture?.lectureUrl,

    ]

    const toatalFields = requiredFieldes.length

    const completedFields = requiredFieldes.filter(Boolean).length

    return !isFetching ? (
        <div className='px-5 sm:px-10 py-6 transform-gpu'>
            <div className='mt-4'>
                <Link
                    to={`/instructor/courses/course-setup/${courseId}`}
                    className='flex items-center gap-2 text-black/70'>
                    <ArrowRight size={20} />
                    <span>بازگشت به تنظیمات دوره</span>
                </Link>
            </div>

            <div className='flex justify-between  items-center '>
                <div>
                    <h2 className='text-2xl font-bold text-black/80 mb-1 mt-6'>تنظیمات جلسه</h2>
                    <span className='text-black/60 text-sm '>فیلد های پر شده ({completedFields}/{toatalFields})</span>
                </div>

                <button
                    onClick={handlePublishing}
                    title='انتشار دوره'
                    disabled={toatalFields !== completedFields}
                    className={`md:ml-5 rounded-md  p-3 cursor-pointer disabled:bg-gray-200 disabled:text-gray-800 disabled:cursor-not-allowed ${lecture.isLecturePublished ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                    {lecture.isLecturePublished
                        ? <div className='flex items-center flex-col justify-center gap-2'>
                            <CloudOff />
                            <span className='text-sm'> لغو انتشار</span>
                        </div>
                        : <div className='flex items-center flex-col justify-center gap-2'>
                            <Upload />
                            <span className='text-sm'> انتشار جلسه</span>
                        </div>
                    }
                </button>

            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6  mt-5'>
                <div className='flex flex-col gap-6' >

                    <div>
                        <Baddge Icon={LayoutDashboard} title="عنوان جلسه" />
                        <LectureInput
                            inputName="title"
                            value={lecture?.lectureTitle}
                            courseId={courseId}
                            chapterId={chapterId}
                            lectureId={lectureId}
                        />

                    </div>

                    <div>
                        <Baddge Icon={FileIcon} title="پیوست جلسه" />
                        <LectureInput
                            inputName="attachment"
                            value={lecture?.attachment}
                            courseId={courseId}
                            chapterId={chapterId}
                            lectureId={lectureId}
                        />

                    </div>


                    <div >
                        <Baddge Icon={Eye} title=" وضعیت دسترسی به جلسه" />
                        <LectureInput
                            inputName="accessSetting"
                            value={lecture?.isLectureFree}
                            courseId={courseId}
                            chapterId={chapterId}
                            lectureId={lectureId}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-6'>
                    <div>
                        <Baddge Icon={VideoIcon} title=" ویدئو جلسه" />
                        <LectureInput
                            inputName="video"
                            value={lecture?.lectureUrl}
                            courseId={courseId}
                            chapterId={chapterId}
                            lectureId={lectureId}
                        />

                    </div>



                </div>

            </div>

        </div >
    ) : <div className='h-screen flex items-center justify-center '><Loader className='animate-spin text-3xl text-blue-500' /></div>
}

export default LectureSetup