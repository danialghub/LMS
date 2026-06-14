import { CheckCircle2, ChevronDown, PlayCircle, Lock, Circle } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore'
import toast from 'react-hot-toast'

const CourseChapters = ({ chapters, completedLectures, formatDuration, course }) => {

    const { chapterId, lectureId } = useParams()

    const [open, setOpen] = useState(chapters[chapterId]?.chapterId || chapters[0].chapterId);

    const { authUser } = useAuthStore()
    const navigate = useNavigate()

    const handleGoToLecture = (chapterId, lectureId) => {
        if (!authUser || authUser.role !== "student") {
            toast.error('ابتدا  به عنوان دانشجو وارد شوید')
            return
        }
        const lecture = chapters[chapterId].chapterContent[lectureId]
        if (!lecture) {
            toast.error("جلسه نامعتبر است")
            return
        }
        if (!lecture.isLectureFree && !course?.enrolledStudents?.includes(authUser?._id)) {
            toast.error("این جلسه قفل است")
            return
        }

        navigate(`/course/${course._id}/${chapterId}/${lectureId}`)
    }

    const getLectureIcon = (lecture, isPlaying) => {
        if (course.enrolledStudents.includes(authUser?._id) || lecture.isLectureFree) {
            if (completedLectures?.includes(lecture.lectureId)) {
                return <CheckCircle2 size={20} className="text-green-400 shrink-0" />
            } else if (isPlaying) {
                return <PlayCircle size={20} className="text-blue-400 shrink-0" />
            } else {
                return <Circle size={20} className="text-blue-500 shrink-0" />
            }
        } else {
            return <Lock size={20} className='text-gray-500 shrink-0' />
        }
    }

    return (
        <div className="px-2 sm:px-3 pb-5 overflow-y-auto">
            <h3 className="text-lg sm:text-xl px-2 sm:px-3 my-2 font-bold font-Dirooz text-zinc-900 dark:text-white">جلسات</h3>
            <div className='space-y-3 sm:space-y-4'>
                {chapters.map((chapter, chapIdx) => (
                    <div
                        key={chapter.chapterId}
                        className="rounded-md overflow-hidden border relative z-20 shadow-md bg-white border-zinc-200 dark:bg-[#121826] dark:border-[#1a2233]"
                    >
                        {/* HEADER */}
                        <button
                            onClick={() =>
                                setOpen(
                                    open === chapter.chapterId
                                        ? null
                                        : chapter.chapterId
                                )
                            }
                            className={`w-full p-3 sm:p-5 flex items-center justify-between transition-all hover:bg-zinc-100 dark:hover:bg-[#171f30]
                                ${open === chapter.chapterId && "bg-zinc-100 dark:bg-[#171f30]"}
                            `}
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="size-8 sm:size-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-sm sm:text-base">
                                    {chapIdx + 1}
                                </div>

                                <div className="text-right">
                                    <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-white">
                                        {chapter.chapterTitle}
                                    </h3>

                                    <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 text-zinc-500 dark:text-gray-400">
                                        {chapter.chapterContent.length} درس
                                    </p>
                                </div>
                            </div>

                            <ChevronDown
                                size={18}
                                className={`transition text-zinc-700 dark:text-white shrink-0 ${open === chapter.chapterId ? "rotate-180" : ""}`}
                            />
                        </button>

                        {/* LESSONS */}
                        <div
                            className={`grid transition-all duration-500 ease-in-out
                                ${open === chapter.chapterId
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                                }
                            `}
                        >
                            <div className="overflow-hidden">
                                <div className="px-0 py-0 space-y-2">
                                    {chapter.chapterContent.map((lec, lecIdx) => (
                                        <div
                                            key={lec.lectureId}
                                            className={`p-3 sm:p-4 rounded-sm border flex items-center justify-between transition-all duration-300 min-h-[65px] sm:h-[75px]
                                                ${lectureId == lecIdx
                                                    ? "bg-blue-500/10 border-blue-500"
                                                    : completedLectures?.includes(lec.lectureId)
                                                        ? "bg-green-500/10 border-green-500"
                                                        : "bg-zinc-50 border-zinc-200 dark:bg-[#0f1523] dark:border-[#1a2233]"
                                                }`}
                                        >
                                            <button
                                                onClick={() => handleGoToLecture(chapIdx, lecIdx)}
                                                className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 text-right"
                                            >
                                                {getLectureIcon(lec, chapterId == chapIdx && lectureId == lecIdx)}

                                                <div className="min-w-0 flex-1">
                                                    <h4
                                                        className="text-xs sm:text-sm font-medium truncate text-zinc-800 dark:text-white"
                                                        title={lec.lectureTitle}
                                                    >
                                                        {lec.lectureTitle}
                                                    </h4>

                                                    {chapterId == chapIdx && lectureId == lecIdx ? (
                                                        <p className="text-[10px] sm:text-xs text-blue-400 mt-0.5 sm:mt-1">
                                                            در حال مشاهده
                                                        </p>
                                                    ) : (
                                                        completedLectures?.includes(lec.lectureId) && (
                                                            <p className="text-[10px] sm:text-xs text-green-400 mt-0.5 sm:mt-1">
                                                                تکمیل شده
                                                            </p>
                                                        )
                                                    )}
                                                </div>
                                            </button>

                                            <span className="text-[10px] sm:text-xs shrink-0 mr-2 sm:mr-3 text-zinc-500 dark:text-gray-400">
                                                {formatDuration(lec.lectureDuration)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CourseChapters