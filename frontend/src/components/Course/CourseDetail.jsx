import React, { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
    PlayCircle,
    CheckCircle2,
    Moon,
    Sun,
    Check,
    Menu,
    X
} from "lucide-react";

import {
    VideoPlayer, LectureAttachment, CourseChapters,
    CourseRating, SubmitLoading, CourseComment
} from "@/components/index";
import { Link, useNavigate, useParams } from "react-router";
import { useAuthStore } from '@/store/useAuthStore'
import { useStudentStore } from '@/store/useStudentStore'
import { formatPrice, formatTime } from '@/lib/helper'
import toast from "react-hot-toast";
import { useTransactionStore } from "@/store/useTransactionStore";


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

    const [theme, setTheme] = useState(localStorage.getItem('theme') || "dark");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('description');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { authUser } = useAuthStore()
    const { markLectureAsCompleted, isMarking } = useStudentStore()
    const { zarinPalRequest, isEnrolling } = useTransactionStore()
    const { lectureId, chapterId } = useParams()
    const navigate = useNavigate()

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

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        if (!authUser?._id || authUser?.role !== "student") {
            toast.error('ابتدا به عنوان دانشجو وارد شوید')
            return
        }
        await zarinPalRequest(course._id)
        setLoading(false);
    };

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

    const foundFirstLecture = () => {
        const chapterIndex = course.courseContent.findIndex(ch => ch.chapterContent.some(lec => lec.lectureUrl))
        const lectureIndex = course.courseContent[chapterIndex].chapterContent.findIndex(lec => lec.lectureUrl)
        console.log(chapterIndex, lectureIndex);



        if (isNaN(chapterIndex) && isNaN(lectureIndex)) {
            toast.error('جلسه ای برای مشاهده موجود نیست')
            return {}
        }

        return { chapterIndex, lectureIndex }
    }

    const goToLectures = () => {
        const { chapterIndex, lectureIndex } = foundFirstLecture()
        navigate(`/course/${course._id}/${chapterIndex}/${lectureIndex}`)
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("dark", savedTheme === "dark");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    useEffect(() => {
        scrollTo(0, 0)
    }, [])

    // Close sidebar on window resize if screen becomes large
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);

    const isDark = theme === "dark";
    const finalPrice = calcDiscount(course.coursePrice, course.courseDiscount)
    const isFree = finalPrice === 0

    // Sidebar content component (reused for both desktop and mobile)
    const SidebarContent = () => (
        <>
            {/* HEADER */}
            <div className="h-[72px] border-b px-5 flex items-center justify-between border-zinc-200 dark:border-[#1a2233]">
                <div className="flex items-center gap-3">
                    {authUser && authUser.role === "student" ? (
                        <>
                            {authUser?.avatar ? (
                                <img src={authUser.avatar} alt="" className="object-contain size-10 rounded-xl" />
                            ) : (
                                <span className="size-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-2xl">
                                    {authUser.name[0]}
                                </span>
                            )}
                            <h1 className="text-lg font-bold truncate">{authUser.name}</h1>
                        </>
                    ) : (
                        <Link to={'/login/student'} className="btn-primary py-1.5 px-6 rounded text-sm">
                            شروع یادگیری
                        </Link>
                    )}
                </div>
                <button
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className="size-10 ml-52 sm:ml-0 rounded-xl flex items-center justify-center transition-all duration-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-[#151b2b] dark:hover:bg-[#1d2638]"
                >
                    {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-zinc-700 dark:text-white" />}
                </button>
            </div>

            {/* COURSE CARD */}
            <div className="p-5 px-3">
                <div className="rounded-lg border p-4 bg-white border-zinc-200 dark:bg-[#121826] dark:border-[#1b2538]">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center shrink-0">
                            <PlayCircle size={28} className="text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="font-semibold leading-7 text-[15px] line-clamp-2 break-words">
                                {course.courseTitle}
                            </h2>
                            <p className="text-sm mt-1 text-zinc-500 dark:text-gray-400">توسعه وب</p>
                            {course.enrolledStudents.includes(authUser?._id) && (
                                <div className="mt-5">
                                    <div className="flex justify-between text-xs mb-2 text-zinc-500 dark:text-gray-400">
                                        <span>{progressPercent}٪ تکمیل شده</span>
                                        <span>{completedLessons} / {totalLessons} درس</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-200 dark:bg-[#1b2233]">
                                        <div className={`${progressPercent == 100 ? "bg-green-500" : "bg-blue-500"} h-full rounded-full transition-all duration-500`} style={{ width: `${progressPercent}%` }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CHAPTERS */}
            <div className="flex-1 overflow-y-auto">
                <CourseChapters
                    chapters={course.courseContent}
                    completedLectures={course?.courseProgress?.completedLectures}
                    isDark={isDark}
                    formatDuration={formatDuration}
                    course={course}
                />
            </div>
        </>
    );

    return (
        <div dir="rtl" className="min-h-screen overflow-hidden transition-all duration-300 bg-[#f4f7fb] text-zinc-900 dark:bg-[#0b0f19] dark:text-white">
            <div className="flex relative">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-[#0d111c] shadow-lg border border-zinc-200 dark:border-[#1a2233]"
                >
                    <Menu size={24} />
                </button>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* SIDEBAR - Desktop always visible, Mobile as drawer */}
                <aside className={`
                    fixed lg:relative lg:translate-x-0 z-50
                    w-[100vw] sm:w-[340px] h-full 
                    border-l flex flex-col transition-all duration-300
                    bg-white border-zinc-200 dark:bg-[#0d111c] dark:border-[#1a2233]
                    ${isSidebarOpen ? '-translate-x-0 lg:translate-x-0' : 'translate-x-full'}
                    lg:block
                `}>

                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden absolute top-4 left-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-[#151b2b]"
                    >
                        <X size={20} />
                    </button>
                    <SidebarContent />
                </aside>

                {/* MAIN */}
                <main className="flex-1 p-3 sm:p-5 w-full overflow-x-hidden">
                    <div className="rounded-[20px] sm:rounded-[30px] overflow-hidden border bg-white border-zinc-200 dark:bg-[#0f1523] dark:border-[#1a2233]">
                        {/* VIDEO */}
                        <div className="relative">
                            <div className="py-3 sm:py-5 px-4 sm:px-10 text-xs sm:text-sm dark:text-white/70 flex items-center gap-2 flex-wrap">
                                <Link to={`/courses`} className="hover:text-blue-500">
                                    دوره ها
                                </Link>
                                <span>/ </span>
                                <span className="truncate">{course.courseTitle}</span>
                            </div>
                            {!isPreviewPage && course?.lecture?.lectureUrl ? (
                                <div className="px-1 sm:px-4">
                                    <VideoPlayer video={{ src: course.lecture.lectureUrl, thumbnail: course.courseThumbnail }} className="rounded-none max-w-6xl max-h-[85vh] " />
                                </div>
                            ) : (
                                <img src={course.courseThumbnail} className="aspect-video w-full max-w-4xl max-h-[85vh] mx-auto pb-4 rounded-3xl px-3 sm:px-0" />
                            )}
                        </div>

                        <div className="p-4 sm:p-8 py-3 sm:py-5">
                            {/* قیمت و دکمه ثبت نام */}
                            {!course.enrolledStudents.includes(authUser?._id) ? (
                                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-10 gap-4 sm:gap-6">
                                    <button
                                        onClick={handlePayment}
                                        disabled={isEnrolling}
                                        className="w-full sm:w-auto min-w-[150px] min-h-[45px] group relative overflow-hidden rounded-lg shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:via-blue-700 group-hover:to-indigo-700 transition-all duration-300"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                        {isEnrolling
                                            ? <div className="flex items-center justify-center py-3">
                                                <SubmitLoading />
                                            </div>
                                            : (
                                                <div className="relative px-4 sm:px-6 py-3 flex items-center justify-center gap-2 sm:gap-3">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    <span className="text-white font-bold text-sm sm:text-base tracking-wide">ثبت‌نام در دوره</span>
                                                    <svg className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5l-7 7 7 7" />
                                                    </svg>
                                                </div>
                                            )
                                        }
                                    </button>

                                    {isFree ? (
                                        <h4 className="sm:ml-20 text-2xl sm:text-4xl font-black bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                            رایگان
                                        </h4>
                                    ) : (
                                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-end">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                                    {formatPrice(finalPrice)}
                                                </span>
                                                <span className="text-xs sm:text-base font-medium text-gray-500 dark:text-gray-400">تومان</span>
                                            </div>
                                            <div className="flex items-center gap-1 sm:gap-2">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-bold text-blue-500 text-sm sm:text-base">{course.courseDiscount}%</span>
                                                    <svg className="size-5 sm:size-8 mb-4 text-gray-300 dark:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-lg sm:text-2xl font-bold text-gray-400 line-through decoration-2 decoration-red-500/50 dark:text-gray-500">
                                                        {formatPrice(course.coursePrice)}
                                                    </span>
                                                    <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-600">تومان</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {course?.lecture ? (
                                        !isPreviewPage && (
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <span className="text-lg sm:text-2xl font-heading">
                                                    <span className="text-xl sm:text-3xl text-blue-500">فصل {Number(chapterId) + 1} , </span>
                                                    <span className="text-xl sm:text-3xl text-blue-500">جلسه {Number(lectureId) + 1} : </span>
                                                    <span className="text-base sm:text-xl break-words">{course.lecture.lectureTitle}</span>
                                                </span>
                                                {!course?.courseProgress?.completedLectures?.includes(course.lecture.lectureId) ? (
                                                    <button
                                                        onClick={handleMarkAsComplete}
                                                        disabled={isMarking}
                                                        className="relative overflow-hidden btn-primary py-2.5 sm:py-3  w-auto px-4 sm:px-6 min-h-[44px] sm:min-h-[50px] flex items-center gap-2 justify-center font-medium transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-95 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        {isMarking ? (
                                                            <div className="relative z-10 flex items-center justify-center">
                                                                <SubmitLoading />
                                                            </div>
                                                        ) : (
                                                            <div className="relative z-10 flex items-center gap-2">
                                                                <span className="text-sm sm:text-base">علامت به عنوان مشاهده شده</span>
                                                                <CheckCircle2 size={18} className="sm:size-5 transition-transform group-hover:scale-110" />
                                                            </div>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 flex items-center gap-2 font-medium transition-all duration-300 shadow-lg shadow-green-600/20 rounded-lg  w-auto justify-center group">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        <div className="relative z-10 flex items-center gap-2">
                                                            <Check size={18} className="sm:size-5" />
                                                            <span className="text-sm sm:text-base">مشاهده شده</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    ) : (
                                        isPreviewPage && (
                                            <div className="flex flex-row items-center justify-between gap-4 mb-6 sm:mb-10">
                                                <button onClick={goToLectures} className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-md text-sm sm:text-base">
                                                    مشاهده ادامه دوره
                                                </button>
                                                <span
                                                    className="bg-blue-500/20 dark:bg-blue-500/50 rounded-full py-1.5 sm:py-2 px-3 sm:px-4 text-[10px] sm:text-xs text-zinc-800 dark:text-gray-300">
                                                    آخرین بروزرسانی دوره : {formatTime(course.updatedAt)}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Course Rating */}
                            {isPreviewPage && course.enrolledStudents.includes(authUser?._id) &&
                                !course.courseRatings.some(rate => rate.userId === authUser._id) &&
                                <CourseRating />
                            }
                        </div>
                        {/* CONTENT WITH TABS */}
                        <div className="p-4 sm:p-8 py-3 sm:py-5">
                            {/* TABS */}
                            <div className="flex gap-1 sm:gap-2 border-b border-zinc-200 dark:border-[#1a2233] overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all relative whitespace-nowrap text-sm sm:text-base ${activeTab === 'description'
                                        ? 'text-blue-500'
                                        : 'text-zinc-500 hover:text-zinc-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                >
                                    توضیحات دوره
                                    {activeTab === 'description' && (
                                        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-blue-500 rounded-full" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setActiveTab('comments')}
                                    className={`px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all relative whitespace-nowrap text-sm sm:text-base ${activeTab === 'comments'
                                        ? 'text-blue-500'
                                        : 'text-zinc-500 hover:text-zinc-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                >
                                    نظرات
                                    {activeTab === 'comments' && (
                                        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-blue-500 rounded-full" />
                                    )}
                                </button>
                            </div>


                            {/* DESCRIPTION TAB CONTENT */}
                            {activeTab === 'description' && (
                                <>
                                    {/* COURSE INFO */}
                                    <div className="mt-4">
                                        {course?.lecture?.attachment && (
                                            <LectureAttachment isDark={theme === "dark"} attachmentFile={course.lecture.attachment} />
                                        )}
                                        <h1 className="text-2xl sm:text-4xl mt-8 sm:mt-12 font-heading font-normal leading-8 sm:leading-[70px] break-words">{course.courseTitle}</h1>
                                        <div dangerouslySetInnerHTML={{ __html: course.courseDescription }} className="font- leading-7 sm:leading-9 mt-4 sm:mt-5 text-sm sm:text-[18px] text-zinc-600 dark:!text-white/70 break-words" />
                                    </div>

                                    {/* COURSE META */}
                                    <div className="mt-4">
                                        {/* INSTRUCTOR */}
                                        <div className="rounded-2xl sm:rounded-3xl border p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 bg-zinc-50 border-zinc-200 hover:bg-white dark:bg-[#121826] dark:border-[#1b2538] dark:hover:bg-[#151d2d]">
                                            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        {course.instructor?.avatar ? (
                                                            <img src={course.instructor.avatar} alt="teacher" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-blue-500" />
                                                        ) : (
                                                            <span className="size-12 sm:size-16 rounded-xl bg-indigo-500 text-white text-3xl sm:text-4xl flex items-center justify-center">
                                                                {course.instructor.name[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg sm:text-xl font-bold">{course.instructor.name}</h3>
                                                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-zinc-500 dark:text-gray-400">
                                                            {course.instructor.instructorProfile.major}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-0 sm:mt-5">
                                                    <Link to={`/instructor/${course.instructor.name}/courses`} className="py-2 px-3 sm:py-2.5 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md active:scale-95 inline-block">
                                                        مشاهده همه دوره‌های مدرس
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t text-xs sm:text-sm leading-6 sm:leading-8 line-clamp-3 sm:line-clamp-2 border-zinc-200 text-zinc-600 dark:border-[#1b2538] dark:text-gray-400">
                                                {course.instructor.instructorProfile.bio}
                                            </div>
                                        </div>

                                        {/* STATS */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mt-4">
                                            {statistician.map((item, index) => (
                                                <div key={index} className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-5 transition-all duration-500 group hover:-translate-y-2 hover:shadow-2xl bg-white border-zinc-200 dark:bg-[#121826] ${item.border}`}>
                                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br ${item.color}`} />
                                                    <div className="relative z-10">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <p className={`text-xs sm:text-sm text-zinc-500 dark:text-gray-400`}>{item.title}</p>
                                                                <h3 className="text-2xl sm:text-3xl font-black mt-2 sm:mt-4 tracking-tight">{item.value}</h3>
                                                                <span className={`text-[11px] sm:text-xs mt-1 sm:mt-2 block text-zinc-400 dark:text-gray-500`}>{item.suffix}</span>
                                                            </div>
                                                            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl backdrop-blur-xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-zinc-100 border-zinc-200 dark:bg-white/5 dark:border-white/10 shrink-0`}>
                                                                {item.icon}
                                                            </div>
                                                        </div>
                                                        <div className={`mt-3 sm:mt-5 h-[3px] w-full rounded-full overflow-hidden bg-zinc-100 dark:bg-white/5`}>
                                                            <div className={`h-full rounded-full w-[70%] bg-gradient-to-r ${item.color}`} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* COMMENTS TAB CONTENT */}
                            {activeTab === 'comments' && course && (
                                <CourseComment course={course} />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CourseDetail;