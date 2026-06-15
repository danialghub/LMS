import React from 'react';
import { User, BookOpen, Users, Clock, Star, ChevronLeft, ChevronRight, MapPin, Briefcase, Award } from 'lucide-react';

const SleekInstructorProfile = () => {
    const instructor = {
        name: "دنیل کریگ",
        title: "معمار ارشد فرانت‌اند",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        bio: "توسعه‌دهنده ارشد با ۱۲ سال تجربه. متخصص React، Next.js و معماری scalable. مدرس رسمی در ۲۰+ دوره آنلاین.",
        specialty: "React • Next.js • TypeScript",
        location: "تهران، ایران",
        experience: "۱۲ سال تجربه",
        stats: {
            students: "۱۲,۴۵۰",
            courses: "۱۸"
        }
    };

    const courses = [
        {
            id: 1,
            title: "React از پایه تا پیشرفته",
            description: "مفاهیم پایه تا تکنیک‌های پیشرفته React با پروژه‌های عملی",
            duration: "۲۴ ساعت",
            students: "۳,۲۴۰",
            level: "مقدماتی تا پیشرفته",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop"
        },
        {
            id: 2,
            title: "Next.js 14 با رویکرد عملی",
            description: "ساخت اپلیکیشن‌های scalable با App Router و Server Components",
            duration: "۱۸ ساعت",
            students: "۲,۱۸۰",
            level: "متوسط",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=240&fit=crop"
        },
        {
            id: 3,
            title: "TypeScript پیشرفته",
            description: "تایپ‌های پیشرفته، Utility Types و معماری تایپ سیف",
            duration: "۱۲ ساعت",
            students: "۱,۹۵۰",
            level: "پیشرفته",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop"
        },
        {
            id: 4,
            title: "Tailwind CSS Mastery",
            description: "طراحی حرفه‌ای با Tailwind، سفارشی‌سازی و بهینه‌سازی",
            duration: "۸ ساعت",
            students: "۲,۸۰۰",
            level: "مقدماتی تا پیشرفته",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop"
        }
    ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
            
            {/* بخش پروفایل استاد - طراحی مدرن و شیک */}
            <div className="relative mb-12 sm:mb-16 md:mb-20">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent rounded-2xl sm:rounded-3xl -z-10"></div>
                <div className="absolute top-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-100/30 rounded-full blur-3xl -z-20"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg">
                    
                    {/* آواتار با افکت هولوگرافیک */}
                    <div className="relative group shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl sm:rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-[3px] shadow-xl">
                            <div className="w-full h-full rounded-xl sm:rounded-2xl bg-white overflow-hidden">
                                <img
                                    src={instructor.avatar}
                                    alt={instructor.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 sm:border-3 border-white shadow-md"></div>
                    </div>

                    {/* اطلاعات اصلی با طراحی بهتر */}
                    <div className="flex-1 text-center md:text-right">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                                    {instructor.name}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-3">
                                    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                                        <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <span className="text-xs sm:text-sm">{instructor.title}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs sm:text-sm">
                                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <span className="text-xs sm:text-sm">{instructor.location}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs sm:text-sm">
                                        <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <span className="text-xs sm:text-sm">{instructor.experience}</span>
                                    </span>
                                </div>
                                <p className="text-blue-600 font-mono text-xs sm:text-sm text-center md:text-right">{instructor.specialty}</p>
                            </div>

                            {/* آمار به صورت کارت‌های مدرن */}
                            <div className="flex justify-center md:justify-end gap-3 sm:gap-4">
                                <div className="text-center px-4 sm:px-5 md:px-6 py-2 sm:py-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl">
                                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">{instructor.stats.students}</div>
                                    <div className="text-[10px] sm:text-xs text-blue-600 font-medium mt-1">دانشجو</div>
                                </div>
                                <div className="text-center px-4 sm:px-5 md:px-6 py-2 sm:py-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl sm:rounded-2xl">
                                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-700">{instructor.stats.courses}</div>
                                    <div className="text-[10px] sm:text-xs text-indigo-600 font-medium mt-1">دوره</div>
                                </div>
                            </div>
                        </div>

                        {/* بایو با نقل قول و استایل بهتر */}
                        <div className="relative mt-4">
                            <div className="absolute -right-2 -top-2 text-4xl sm:text-6xl text-blue-100 font-serif">"</div>
                            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm pr-4 sm:pr-6 py-2 border-r-2 sm:border-r-3 border-blue-400 text-center md:text-right">
                                {instructor.bio}
                            </p>
                        </div>

                        {/* مهارت‌های کلیدی */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 mt-4">
                            {instructor.specialty.split(' • ').map((skill, index) => (
                                <span key={index} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] sm:text-xs font-mono">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* هدر دوره‌ها */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">دوره‌های آموزشی</h2>
                    <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-2 rounded-full"></div>
                </div>
                <div className="flex justify-center sm:justify-end gap-2">
                    <button className="p-1.5 sm:p-2 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </button>
                    <button className="p-1.5 sm:p-2 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* گرید دوره‌ها */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="group bg-white border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                                {course.level}
                            </div>
                        </div>

                        <div className="p-3 sm:p-4 md:p-5">
                            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 sm:mb-2 line-clamp-1">
                                {course.title}
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                                {course.description}
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-sm">
                                <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm">{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm">{course.students}</span>
                                    </div>
                                </div>

                                <button className="text-blue-600 font-medium text-xs sm:text-sm hover:text-blue-700 transition-colors text-center sm:text-left">
                                    مشاهده دوره ←
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA ساده */}
            <div className="mt-8 sm:mt-10 md:mt-12 text-center">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                    <span className="w-6 sm:w-8 h-px bg-gray-200"></span>
                    <span>تمامی دوره‌ها با گواهی معتبر</span>
                    <span className="w-6 sm:w-8 h-px bg-gray-200"></span>
                </div>
            </div>
        </div>
    </div>
);
};

export default SleekInstructorProfile;