import React from 'react';
import {Logo} from '@/components/index';  // import پیش‌فرض
import { Link } from 'react-router';  // تغییر به react-router-dom
import { GraduationCap, School, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const Navbar = () => {
    const { authUser, logout } = useAuthStore();

    return (
        <nav className=' bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm'>
            <div className='mx-auto px-4 sm:px-6 lg:px-24'>
                <div className='flex items-center justify-between h-16 md:h-20'>
                    {/* راست: لوگو */}
                    <Link to='/' className='flex-shrink-0'>
                        <Logo size="md" />
                    </Link>

                    {/* چپ: دکمه‌ها */}
                    <div className='flex items-center gap-3 md:gap-4'>
                        {authUser ? (
                            <>
                                {/* دکمه خروج */}
                                <button
                                    onClick={logout}
                                    className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-500 
                                        hover:from-red-600 hover:to-rose-600 text-white font-semibold 
                                        py-2 px-4 rounded-xl shadow-md hover:shadow-lg 
                                        transition-all duration-300 transform hover:scale-[1.02]"
                                >
                                    <div className="flex items-center gap-2 text-sm">
                                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        <span>خروج</span>
                                    </div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 
                                        bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full">
                                    </div>
                                </button>

                                {/* دکمه داشبورد بر اساس نقش */}
                                {authUser.role === "student" ? (
                                    <Link to="/student/dashboard">
                                        <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 
                                            hover:from-emerald-600 hover:to-teal-600 text-white font-semibold 
                                            py-2 px-5 rounded-xl shadow-md hover:shadow-lg 
                                            transition-all duration-300 transform hover:scale-[1.02]">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                                <span>داشبورد دانشجو</span>
                                            </div>
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 
                                                bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full">
                                            </div>
                                        </button>
                                    </Link>
                                ) : (
                                    <Link to="/instructor/dashboard">
                                        <button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 
                                            hover:from-blue-600 hover:to-indigo-600 text-white font-semibold 
                                            py-2 px-5 rounded-xl shadow-md hover:shadow-lg 
                                            transition-all duration-300 transform hover:scale-[1.02]">
                                            <div className="flex items-center gap-2">
                                                <School className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                                <span>داشبورد مدرس</span>
                                            </div>
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 
                                                bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full">
                                            </div>
                                        </button>
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                {/* دکمه دانشجو */}
                                <Link to="/login/student">
                                    <button className="group cursor-pointer flex items-center gap-2 bg-white border border-slate-200 
                                        hover:border-emerald-200 hover:bg-emerald-50/40 transition-all duration-200 
                                        rounded-xl px-3 py-2 shadow-sm hover:shadow-md">
                                        <GraduationCap className="w-5 h-5 text-emerald-600 group-hover:scale-105 transition-transform" />
                                        <div className="text-right">
                                            <span className="block text-xs text-emerald-600/80 leading-tight">ورود به عنوان</span>
                                            <span className="block font-bold text-slate-700 text-sm leading-tight">دانشجو</span>
                                        </div>
                                    </button>
                                </Link>

                                {/* دکمه مدرس */}
                                <Link to="/login/instructor">
                                    <button className="group cursor-pointer flex items-center gap-2 bg-white border border-slate-200 
                                        hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200 
                                        rounded-xl px-3 py-2 shadow-sm hover:shadow-md">
                                        <School className="w-5 h-5 text-blue-600 group-hover:scale-105 transition-transform" />
                                        <div className="text-right">
                                            <span className="block text-xs text-blue-600/80 leading-tight">ورود به عنوان</span>
                                            <span className="block font-bold text-slate-700 text-sm leading-tight">مدرس</span>
                                        </div>
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;