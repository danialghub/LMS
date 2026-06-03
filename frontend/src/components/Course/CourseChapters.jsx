import { CheckCircle2, ChevronDown, PlayCircle, Lock, Circle } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore'
import toast from 'react-hot-toast'
const CourseChapters = ({ chapters, isDark = true, completedLectures, formatDuration, course }) => {

    const { chapterId, lectureId } = useParams()

    const [open, setOpen] = useState(chapters[chapterId]?.chapterId || chapters[0].chapterId);

    const { authUser } = useAuthStore()
    const navigate = useNavigate()

    const handleGoToLecture = (chapterId, lectureId) => {
        if (!authUser || authUser.role !== "student") {
            toast.error('ابتدا  به عنوان دانشجو وارد شوید')
            return
        }

        navigate(`/course/${course._id}/${chapterId}/${lectureId}`)
    }
    
    return (
        <div className="px-3 pb-5 overflow-y-auto  ">
            <h3 className="text-xl text-white px-3 my-2 font-bold font-Dirooz">جلسات</h3>
            <div className='space-y-4'>
                {chapters.map((chapter, chapIdx) => (
                    <div
                        key={chapter.chapterId}
                        className={`rounded-md overflow-hidden border relative z-20 shadow-md
                                ${isDark
                                ? "bg-[#121826] border-[#1a2233]"
                                : "bg-white border-zinc-200"
                            }
`}
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
                            className={`  w-full p-5 flex items-center justify-between transition-all
 ${open === chapter.chapterId && "bg-[#171f30]"}
                                    ${isDark
                                    ? "hover:bg-[#171f30]"
                                    : "hover:bg-zinc-50"
                                }
`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold">
                                    {chapIdx + 1}
                                </div>

                                <div className="text-right">
                                    <h3 className="font-semibold">
                                        {chapter.chapterTitle}
                                    </h3>

                                    <p
                                        className={` text-sm mt-1

                                                ${isDark
                                                ? "text-gray-400"
                                                : "text-zinc-500"
                                            }
`}
                                    >
                                        {chapter.chapterContent.length} درس
                                    </p>
                                </div>
                            </div>

                            <ChevronDown
                                size={20}
                                className={`transition ${open === chapter.chapterId
                                    ? "rotate-180"
                                    : ""
                                    } `}
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
                                            className={`p-4 rounded-sm border flex items-center justify-between transition-all duration-300 h-[75px]
    ${lectureId == lecIdx
                                                    ? "bg-blue-500/10 border-blue-500"
                                                    : completedLectures?.includes(lec.lectureId)
                                                        ? "bg-green-500/10 border-green-500"
                                                        : isDark
                                                            ? "bg-[#0f1523] border-[#1a2233]"
                                                            : "bg-zinc-50 border-zinc-200"
                                                }`}
                                        >
                                            <button
                                                onClick={() => handleGoToLecture(chapIdx, lecIdx)}
                                                className="flex items-center gap-3 flex-1 min-w-0 text-right"
                                            >
                                                {completedLectures?.includes(lec.lectureId) ? (
                                                    <CheckCircle2
                                                        size={22}
                                                        className="text-green-400 shrink-0"
                                                    />
                                                ) : chapterId == chapIdx && lectureId == lecIdx ? (
                                                    <PlayCircle
                                                        size={22}
                                                        className="text-blue-400 shrink-0"
                                                    />
                                                ) : lec.isLectureFree ? (
                                                    <Circle
                                                        size={22}
                                                        className="text-blue-500 shrink-0"
                                                    />
                                                ) : (
                                                    <Lock
                                                        size={18}
                                                        className="text-gray-500 shrink-0"
                                                    />
                                                )}

                                                <div className="min-w-0 flex-1">
                                                    <h4
                                                        className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-zinc-800"
                                                            }`}
                                                        title={lec.lectureTitle}
                                                    >
                                                        {lec.lectureTitle}
                                                    </h4>

                                                    {chapterId == chapIdx && lectureId == lecIdx ? (
                                                        <p className="text-xs text-blue-400 mt-1">
                                                            در حال مشاهده
                                                        </p>
                                                    ) : (
                                                        completedLectures?.includes(lec.lectureId) && (
                                                            <p className="text-xs text-green-400 mt-1">
                                                                تکمیل شده
                                                            </p>
                                                        )
                                                    )}
                                                </div>
                                            </button>

                                            <span
                                                className={`text-xs shrink-0 mr-3 ${isDark ? "text-gray-400" : "text-zinc-500"
                                                    }`}
                                            >
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