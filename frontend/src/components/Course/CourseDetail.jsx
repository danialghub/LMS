
import React, { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
    PlayCircle,
    CheckCircle2,
    Moon,
    Sun,
    Check,
} from "lucide-react";

import { VideoPlayer, LectureAttachment, CourseChapters, CourseRating, SubmitLoading } from "@/components/index";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from '@/store/useAuthStore'
import { useStudentStore } from '@/store/useStudentStore'
import { formatPrice, formatTime } from '@/lib/helper'
import toast from "react-hot-toast";


const celebrate = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
        });

        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };

    frame();
};


const CourseDetail = ({ isPreviewPage, course }) => {


    const [theme, setTheme] = useState("dark");

    const { authUser } = useAuthStore()
    const { markLectureAsCompleted, isMarking } = useStudentStore()
    const navigate = useNavigate()

    const goToTransactionPageHandler = () => {
        if (!authUser?._id || authUser?.role !== "student") {
            toast.error('ابتدا به عنوان دانشجو وارد شوید')
            return
        }
        navigate(`/transaction/${course._id}`)
    }
    const calcDiscount = (price, discount) => {
        return (price - (price * discount / 100))
    }

    const formatDuration = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);

        return hours === 0
            ? `${minutes} دقیقه`
            : minutes === 0
                ? `${hours} ساعت`
                : `${hours} ساعت و ${minutes} دقیقه`;
    }

    const calcTotalLectures = (chapters) => {
        return chapters.reduce((total, ch) => total + ch.chapterContent.length, 0);
    }
    const calTotalCourseDuration = (chapters) => {
        let minutes = chapters.reduce(
            (total, ch) =>
                total +
                ch.chapterContent.reduce(
                    (sum, arg) => sum + arg.lectureDuration,
                    0
                ),
            0
        );
        return formatDuration(minutes)
    }
    const calcTotalCourseRTating = (courseRatings) => {
        if (!courseRatings.length) return 0
        const sum = courseRatings.reduce((total, arg) => total + arg.rating, 0)
        return Math.floor(sum / courseRatings.length)
    }

    const progressPercent = Math.round(
        ((course?.courseProgress?.completedLectures?.length || 0) / calcTotalLectures(course.courseContent)) * 100
    );



    const handleMarkAsComplete = async () => {
        const result = await markLectureAsCompleted(course._id, course.lecture.lectureId)


        if (result) {
            const progress = Math.round(
                ((result?.completedLectures?.length || 0) /
                    calcTotalLectures(course.courseContent)) * 100
            )
            if (progress == 100) celebrate()
        }
    }


    const completedLessons = course?.courseProgress?.completedLectures?.length || 0
    const totalLessons = calcTotalLectures(course.courseContent)

    const statistician = [
        {
            title: "تعداد جلسات",
            value: calcTotalLectures(course.courseContent),
            suffix: "جلسه آموزشی",
            icon: "🎬",
            color: "from-blue-500/20 to-cyan-500/10",
            border: "border-blue-500/20",
            text: "text-blue-400",
        },
        {
            title: "مدت زمان",
            value: calTotalCourseDuration(course.courseContent),
            suffix:
                "ساعت آموزش",
            icon: "⏳",
            color: "from-violet-500/20 to-fuchsia-500/10",
            border: "border-violet-500/20",
            text: "text-violet-400",
        },
        {
            title: "امتیاز دوره",
            value: calcTotalCourseRTating(course.courseRatings),
            suffix: `${course.courseRatings.length} دیدگاه`, icon: "⭐", color: "from-yellow-500/20 to-orange-500/10", border: "border-yellow-500/20", text: "text-yellow-400",
        }, {
            title: "دانشجویان",
            value: course.enrolledStudents.length,
            suffix: "دانشجوی فعال",
            icon: "👨‍🎓",
            color: "from-emerald-500/20 to-green-500/10",
            border: "border-emerald-500/20",
            text: "text-emerald-400",
        }
    ]


    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);




    const isDark = theme === "dark";




    return (
        <div dir="rtl" className={`min-h-screen  overflow-hidden transition-all duration-300 ${isDark ? "bg-[#0b0f19] text-white" : "bg-[#f4f7fb] text-zinc-900"}`}>

            <div className="flex ">
                {/* SIDEBAR */}
                <aside className={`w-[340px] border-l flex flex-col transition-all duration-300 relative ${isDark ? "bg-[#0d111c] border-[#1a2233]" : "bg-white border-zinc-200"}`}>

                    {/* HEADER */}
                    <div className={`h-[72px] border-b px-5 flex items-center justify-between ${isDark ? "border-[#1a2233]" : "border-zinc-200"}`}>
                        <div className="flex items-center gap-3">

                            {
                                authUser && authUser.role === "student"
                                    ? (
                                        <>
                                            {authUser?.avatar
                                                ? <img src={authUser.avatar} alt="" className="object-contain size-10 rounded-xl" />
                                                : <span
                                                    className="size-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-2xl">{authUser.name[0]}</span>
                                            }
                                            <h1 className="text-lg font-bold">{authUser.name}</h1>
                                        </>
                                    )
                                    : (
                                        <Link
                                            to={'/login/student'}
                                            className="btn-primary py-1.5 px-6 rounded">
                                            شروع یادگیری
                                        </Link>
                                    )
                            }
                        </div>
                        <button onClick={() => setTheme(isDark ? "light" : "dark")} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isDark ? "bg-[#151b2b] hover:bg-[#1d2638]" : "bg-zinc-100 hover:bg-zinc-200"}`}>
                            {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-zinc-700" />}
                        </button>
                    </div>

                    {/* COURSE CARD */}
                    <div className="p-5 px-3">
                        <div className={`rounded-lg border p-4 ${isDark ? "bg-[#121826] border-[#1b2538]" : "bg-white border-zinc-200"}`}>
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                                    <PlayCircle size={28} className="text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="font-semibold leading-7 text-[15px] line-clamp-2 max-w-[12vw]">
                                        {course.courseTitle}

                                    </h2>
                                    <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-zinc-500"}`}>توسعه وب</p>
                                    {/* progress bar */}
                                    {course.enrolledStudents.includes(authUser?._id) && (
                                        <div className="mt-5">
                                            <div className={`flex justify-between text-xs mb-2 ${isDark ? "text-gray-400" : "text-zinc-500"}`}>
                                                <span>{progressPercent}٪ تکمیل شده</span>
                                                <span>{completedLessons} / {totalLessons} درس</span>
                                            </div>
                                            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-[#1b2233]" : "bg-zinc-200"}`}>
                                                <div className={`${progressPercent == 100 ? "bg-green-500" : "bg-blue-500"} h-full  rounded-full transition-all duration-500`} style={{ width: `${progressPercent}% ` }} />
                                            </div>
                                        </div>
                                    )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CHAPTERS */}
                    <CourseChapters
                        chapters={course.courseContent}
                        completedLectures={course?.courseProgress?.completedLectures}
                        isDark={isDark}
                        formatDuration={formatDuration}
                        course={course}
                    />
                </aside>

                {/* MAIN */}
                <main className="flex-1 p-5">
                    <div className={`rounded-[30px] overflow-hidden border ${isDark ? "bg-[#0f1523] border-[#1a2233]" : "bg-white border-zinc-200"}`}>
                        {/* VIDEO */}
                        <div className="relative">
                            <div className="py-5 px-10 text-sm text-white/70 flex items-center gap-2">
                                <Link to={`/courses`} className="hover:text-blue-500">
                                    دوره ها
                                </Link>
                                <span>/ </span>
                                <span >
                                    {course.courseTitle}
                                </span>
                            </div>
                            {!isPreviewPage
                                ? <VideoPlayer video={{ src: course.lecture.lectureUrl, thumbnail: course.courseThumbnail }} className="rounded-none max-w-6xl max-h-[85vh]" />
                                : <img src={course.courseThumbnail} className="aspect-video w-full max-w-4xl max-h-[85vh] mx-auto pb-4 rounded-3xl" />}
                        </div>

                        {/* CONTENT */}
                        <div className="p-8 py-5">
                            {/* قیمت و دکمه ثبت نام */}
                            {!course.enrolledStudents.includes(authUser?._id) ? (
                                <div className="flex items-end justify-between mb-10 gap-6">
                                    {/* دکمه ثبت‌نام */}
                                    <button
                                        onClick={goToTransactionPageHandler}
                                        className="group relative overflow-hidden rounded-lg shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-[1.02] active:scale-95">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:via-blue-700 group-hover:to-indigo-700 transition-all duration-300"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                        <div className="relative px-6 py-3 flex items-center gap-3">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span className="text-white font-bold text-base tracking-wide">ثبت‌نام در دوره</span>
                                            <svg className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5l-7 7 7 7" />
                                            </svg>
                                        </div>
                                    </button>

                                    {/* قیمت‌ها */}
                                    <div className="flex items-baseline gap-3 flex-wrap">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">{
                                                formatPrice(calcDiscount(course.coursePrice, course.courseDiscount))
                                            }</span>
                                            <span className={`text-base font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>تومان</span>
                                        </div>
                                        <svg className={`w-5 h-5 ${isDark ? "text-indigo-600" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-2xl font-bold ${isDark ? "text-gray-500" : "text-gray-400"} line-through decoration-2 decoration-red-500/50`}>{formatPrice(course.coursePrice)}</span>
                                            <span className={`text-sm ${isDark ? "text-gray-600" : "text-gray-400"}`}>تومان</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>

                                    {course?.lecture
                                        ? !isPreviewPage && (
                                            <div className="flex items-center justify-between">

                                                {
                                                    !course?.courseProgress?.completedLectures?.includes(course.lecture.lectureId)
                                                        ?
                                                        (
                                                            <button
                                                                onClick={handleMarkAsComplete}
                                                                disabled={isMarking}
                                                                className="btn-primary py-3 min-w-[220px] min-h-[50px] flex items-center gap-2 justify-center font-medium transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.02] rounded disabled:bg-blue-300">

                                                                {isMarking ? <SubmitLoading /> : (
                                                                    <>
                                                                        <span>علامت به عنوان مشاهده شده</span>
                                                                        <CheckCircle2 size={20} />
                                                                    </>
                                                                )}
                                                            </button>

                                                        ) : (
                                                            <div className="bg-green-700/100 text-white py-3 px-5 flex items-center gap-2 font-medium transition-all shadow-lg shadow-green-600/20 hover:scale-[1.02] rounded">
                                                                <Check size={20} />مشاهده شده
                                                            </div>
                                                        )
                                                }


                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className={`text-sm ${isDark ? "text-gray-400" : "text-zinc-500"}`}>
                                                        آخرین بروزرسانی دوره : {formatTime(course.updatedAt)}
                                                    </span>

                                                </div>
                                            </div>
                                        ) : isPreviewPage && (
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    to={`/course/${course._id}/0/0`}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-md mb-10"
                                                >
                                                    مشاهده ادامه دوره
                                                </Link>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className={`text-sm ${isDark ? "text-gray-400" : "text-zinc-500"}`}>
                                                        آخرین بروزرسانی دوره : {formatTime(course.updatedAt)}
                                                    </span>

                                                </div>
                                            </div>
                                        )

                                    }
                                </div>
                            )}

                            {!course.enrolledStudents.includes(authUser?._id) && (
                                <span className={`text-sm ${isDark ? "text-gray-400" : "text-zinc-500"}`}>
                                    آخرین بروزرسانی دوره : {formatTime(course.updatedAt)}
                                </span>
                            )}

                            {/* Course Rating */}
                            {course.enrolledStudents.includes(authUser?._id) &&
                                !course.courseRatings.some(rate => rate.userId === authUser._id) &&
                                <CourseRating />
                            }
                            {/* COURSE INFO */}
                            <div className="mt-8">
                                {course?.lecture?.attachment && (
                                    <LectureAttachment isDark={theme === "dark"} attachmentFile={course.lecture.attachment} />
                                )}
                                <h1 className="text-4xl  mt-5 font-heading font-normal leading-[70px]">{course.courseTitle}</h1>
                                <p dangerouslySetInnerHTML={{ __html: course.courseDescription }} className={`leading-9 mt-5 max-w-5xl text-[18px] ${isDark ? "!text-white" : "text-zinc-600"}`} />
                            </div>


                            {/* COURSE META */}
                            <div className="mt-10">
                                {/* INSTRUCTOR */}
                                <div className={`rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1 ${isDark ? "bg-[#121826] border-[#1b2538] hover:bg-[#151d2d]" : "bg-zinc-50 border-zinc-200 hover:bg-white"}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                {course.instructor?.avatar
                                                    ? (<img src={course.instructor.avatar} alt="teacher" className="w-20 h-20 rounded-xl object-cover border-2 border-blue-500" />)
                                                    : (
                                                        <span
                                                            className='size-16 rounded-xl bg-indigo-500 text-white text-4xl flex items-center justify-center'>{course.instructor.name[0]}</span>
                                                    )

                                                }
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{course.instructor.name}</h3>
                                                <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-zinc-500"}`}>{course.instructor.instructorProfile.major}</p>
                                            </div>
                                        </div>
                                        <div className="mt-5">
                                            <Link to={`/instructor/${course.instructor.name}/courses`} className={` py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"} shadow-sm hover:shadow-md active:scale-95`}>
                                                مشاهده همه دوره‌های مدرس
                                            </Link>
                                        </div>
                                    </div>

                                    <div className={`mt-5 pt-5 border-t text-sm leading-8 line-clamp-2 ${isDark ? "border-[#1b2538] text-gray-400" : "border-zinc-200 text-zinc-600"}`}>
                                        {course.instructor.instructorProfile.bio}
                                    </div>

                                </div>

                                {/* STATS */}
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mt-4">
                                    {statistician.map((item, index) => (
                                        <div key={index} className={`relative overflow-hidden rounded-3xl border p-5 transition-all duration-500 group hover:-translate-y-2 hover:shadow-2xl ${isDark ? `bg-[#121826] ${item.border}` : "bg-white border-zinc-200"}`}>
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br ${item.color}`} />
                                            <div className="relative z-10">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-zinc-500"}`}>{item.title}</p>
                                                        <h3 className="text-3xl font-black mt-4 tracking-tight">{item.value}</h3>
                                                        <span className={`text-xs mt-2 block ${isDark ? "text-gray-500" : "text-zinc-400"}`}>{item.suffix}</span>
                                                    </div>
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${isDark ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200"}`}>
                                                        {item.icon}
                                                    </div>
                                                </div>
                                                <div className={`mt-5 h-[3px] w-full rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-zinc-100"}`}>
                                                    <div className={`h-full rounded-full w-[70%] bg-gradient-to-r ${item.color}`} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}


export default CourseDetail;