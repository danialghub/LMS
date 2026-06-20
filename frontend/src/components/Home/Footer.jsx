import React from "react";
import { Link } from "react-router";

// لوگو به صورت یک کامپوننت SVG ساده (مغز + افزار)
const BrainLogo = () => (
    <svg
        width="48"
        height="48"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105"
    >
        {/* دایره پس‌زمینه لوگو */}
        <circle cx="30" cy="30" r="28" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
        {/* نماد مغز ساده */}
        <path
            d="M30 18C25.5 18 22 21.5 22 26C22 29 24 31.5 26.5 32.5C25.5 34 25 36 25 38C25 41 27 43 30 43C33 43 35 41 35 38C35 36 34.5 34 33.5 32.5C36 31.5 38 29 38 26C38 21.5 34.5 18 30 18Z"
            fill="#94a3b8"
            stroke="#cbd5e1"
            strokeWidth="1.2"
        />
        {/* خطوط نمایانگر تکنولوژی / افزار */}
        <path d="M22 22L26 24" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M38 22L34 24" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="30" cy="28" r="2" fill="#0f172a" />
        <text x="30" y="52" textAnchor="middle" fontSize="8" fill="#cbd5e1" fontWeight="bold">
            مغزافزار
        </text>
    </svg>
);

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-slate-300 border-t border-slate-700 shadow-inner">
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                {/* ردیف اصلی فوتر */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

                    {/* بخش لوگو (سمت راست در حالت راست‌چین - اما به صورت معمولی چینش) */}
                    <div className="md:col-span-3 flex justify-center md:justify-start">
                        <div className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 text-center transition-all hover:border-slate-500 hover:bg-slate-800/60">
                            <div className="flex justify-center mb-2">
                                <BrainLogo />
                            </div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                                مغز افزار
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">فناوری هوشمند مغز</p>
                        </div>
                    </div>

                    {/* لینک‌های سریع */}
                    <div className="md:col-span-3">
                        <h3 className="text-slate-200 font-semibold text-lg mb-4 border-r-2 border-slate-500 pr-3">
                            دسترسی سریع
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to={"/"}
                                    className="hover:text-blue-400 transition flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-slate-500 rounded-full group-hover:bg-blue-400"></span>
                                    صفحه اصلی
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={"/courses"}
                                    className="hover:text-blue-400 transition flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-slate-500 rounded-full group-hover:bg-blue-400"></span>
                                    دوره‌های آموزشی
                                </Link>
                            </li>

                            <li>
                                <a href="#" className="hover:text-blue-400 transition flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-slate-500 rounded-full group-hover:bg-blue-400"></span>
                                    وبلاگ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* ارتباط با ما */}
                    <div className="md:col-span-3">
                        <h3 className="text-slate-200 font-semibold text-lg mb-4 border-r-2 border-slate-500 pr-3">
                            ارتباط با ما
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@maghzafzar.ir</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>۰۱۱-۱۲۳۴۵۶۷۸</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>قائمشهر خیابان بابل</span>
                            </li>
                        </ul>
                    </div>

                    {/* شبکه‌های اجتماعی / خبرنامه کوتاه */}
                    <div className="md:col-span-3">
                        <h3 className="text-slate-200 font-semibold text-lg mb-4 border-r-2 border-slate-500 pr-3">
                            همراه ما باشید
                        </h3>
                        <div className="flex gap-3 mb-4">
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors">
                                <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors">
                                <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.5-11.87c0-.21-.005-.42-.014-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors">
                                <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                        </div>
                        <p className="text-xs text-slate-400">برای دریافت تخفیف‌ها و اخبار جدید ایمیل خود را ثبت کنید</p>
                        <div className="flex mt-3">
                            <input
                                type="email"
                                placeholder="ایمیل شما"
                                className="bg-slate-800 text-sm px-4 py-2 rounded-r-lg w-full focus:outline-none focus:ring-1 focus:ring-slate-500 text-slate-200"
                            />
                            <button className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-l-lg text-sm transition">
                                ثبت
                            </button>
                        </div>
                    </div>
                </div>

                {/* کپی رایت و خط پایانی */}
                <div className="border-t border-slate-800 mt-12 pt-6 text-center text-slate-400 text-xs flex flex-col md:flex-row justify-between items-center gap-2">
                    <span>© {currentYear} مغز افزار. تمامی حقوق محفوظ است.</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-amber-400 transition">حریم خصوصی</a>
                        <a href="#" className="hover:text-amber-400 transition">شرایط استفاده</a>
                        <a href="#" className="hover:text-amber-400 transition">پشتیبانی</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;