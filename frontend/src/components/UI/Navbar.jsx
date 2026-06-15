import React, { useState, useRef, useEffect } from 'react';
import { Logo, WarningModal } from '@/components/index';
import { Link, useNavigate } from 'react-router';
import {
  GraduationCap,
  School,
  LogOut,
  Menu,
  X,
  User,
  BookOpen,
  CreditCard,
  BarChart3,
  Home,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';


const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // بستن dropdown با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // جلوگیری از اسکرول وقتی منو موبایل بازه
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  // آیتم‌های منو بر اساس نقش کاربر
  const getMenuItems = () => {
    if (!authUser) return [];

    if (authUser.role === 'student') {
      return [
        {
          icon: BookOpen,
          label: 'دوره‌های من',
          path: '/student/my-courses',
          description: 'دوره‌هایی که ثبت‌نام کردی'
        },
        {
          icon: CreditCard,
          label: 'تراکنش‌های من',
          path: '/student/my-transactions',
          description: 'وضعیت پرداخت‌ها'
        },
      ];
    } else if (authUser.role === 'instructor') {
      return [
        {
          icon: BookOpen,
          label: 'دوره‌های من',
          path: '/instructor/courses',
          description: 'مدیریت دوره‌ها'
        },
        {
          icon: BarChart3,
          label: 'آمار دوره‌ها',
          path: '/instructor/analytics',
          description: 'گزارش‌های پیشرفته'
        },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  // اطلاعات کاربر برای نمایش
  const getUserDisplayName = () => {
    if (!authUser) return '';
    return authUser.name || authUser.email?.split('@')[0] || 'کاربر';
  };

  const getUserRoleLabel = () => {
    return authUser?.role === 'student' ? 'دانشجو' : 'مدرس';
  };

  return (
    <>
      <nav className='bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16 md:h-20'>

            {/* لوگو */}
            <Link to='/' className='flex-shrink-0 z-20'>
              <Logo size="md" />
            </Link>

            {/* دکمه‌های دسکتاپ - سمت راست */}
            <div className='hidden md:flex items-center gap-3'>
              {/* دکمه دوره‌ها - برای هر دو حالت */}
              <Link to="/courses">
                <button className="group relative px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 
                  font-medium transition-all duration-200 hover:bg-slate-100">
                  <span className="relative z-10">دوره‌ها</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/0 to-emerald-400/0 
                    group-hover:from-emerald-400/10 group-hover:via-emerald-400/5 group-hover:to-transparent 
                    rounded-xl transition-all duration-500"></div>
                </button>
              </Link>

              {authUser ? (
                // حالت وارد شده - منوی کاربری جمع و جور
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="group flex items-center gap-2 bg-gradient-to-r from-slate-50 to-white 
                      hover:from-slate-100 hover:to-slate-50 border border-slate-200 rounded-xl 
                      px-3 py-1.5 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 
                      flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-semibold text-slate-700 leading-tight">
                        {getUserDisplayName()}
                      </span>
                      <span className="block text-[10px] text-slate-500 leading-tight">
                        {getUserRoleLabel()}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 
                      ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 
                      overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
                      {/* هدر پروفایل */}
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm 
                            flex items-center justify-center text-white font-bold text-lg">
                            {getUserDisplayName().charAt(0).toUpperCase()}
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">{getUserDisplayName()}</p>
                            <p className="text-white/80 text-sm">{getUserRoleLabel()}</p>
                            {authUser.email && (
                              <p className="text-white/70 text-xs mt-1">{authUser.email}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* آیتم‌های منو */}
                      <div className="py-2">
                        {menuItems.map((item, index) => (
                          <Link
                            key={index}
                            to={item.path}
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 
                              transition-colors duration-150 group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 
                              flex items-center justify-center transition-colors duration-150">
                              <item.icon className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="text-right flex-1">
                              <p className="font-medium text-slate-700">{item.label}</p>
                              <p className="text-xs text-slate-500">{item.description}</p>
                            </div>
                          </Link>
                        ))}

                        {/* دکمه خروج */}
                        <div className="border-t border-slate-100 mt-2 pt-2">
                          <button
                            onClick={handleLogoutClick}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 
                              transition-colors duration-150 w-full group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-red-50 group-hover:bg-red-100 
                              flex items-center justify-center transition-colors duration-150">
                              <LogOut className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="text-right flex-1">
                              <p className="font-medium text-red-600">خروج</p>
                              <p className="text-xs text-slate-500">خروج از حساب کاربری</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // حالت وارد نشده - ۳ دکمه با اندازه‌های متفاوت
                <>
                  {/* دکمه دوره‌ها - بزرگ */}
                  <Link to="/courses">
                    <button className="group cursor-pointer flex items-center gap-2 bg-white border border-slate-200 
                      hover:border-emerald-200 hover:bg-emerald-50/40 transition-all duration-200 
                      rounded-xl px-5 py-2.5 shadow-sm hover:shadow-md">
                      <BookOpen className="w-5 h-5 text-emerald-600 group-hover:scale-105 transition-transform" />
                      <div className="text-right">
                        <span className="block text-xs text-emerald-600/80 leading-tight">مشاهده</span>
                        <span className="block font-bold text-slate-700 text-base leading-tight">دوره‌ها</span>
                      </div>
                    </button>
                  </Link>

                  {/* دکمه ورود دانشجو - متوسط */}
                  <Link to="/login/student">
                    <button className="group cursor-pointer flex items-center gap-2 bg-white border border-slate-200 
                      hover:border-emerald-200 hover:bg-emerald-50/40 transition-all duration-200 
                      rounded-xl px-4 py-2 shadow-sm hover:shadow-md">
                      <GraduationCap className="w-5 h-5 text-emerald-600 group-hover:scale-105 transition-transform" />
                      <div className="text-right">
                        <span className="block text-[11px] text-emerald-600/80 leading-tight">ورود به عنوان</span>
                        <span className="block font-bold text-slate-700 text-sm leading-tight">دانشجو</span>
                      </div>
                    </button>
                  </Link>

                  {/* دکمه ورود مدرس - کوچک */}
                  <Link to="/login/instructor">
                    <button className="group cursor-pointer flex items-center gap-2 bg-white border border-slate-200 
                      hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-200 
                      rounded-xl px-3 py-1.5 shadow-sm hover:shadow-md">
                      <School className="w-4 h-4 text-blue-600 group-hover:scale-105 transition-transform" />
                      <div className="text-right">
                        <span className="block text-[10px] text-blue-600/80 leading-tight">ورود به عنوان</span>
                        <span className="block font-bold text-slate-700 text-xs leading-tight">مدرس</span>
                      </div>
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* دکمه منوی موبایل */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative z-50 p-2 rounded-lg bg-white border border-slate-200 
                shadow-sm hover:shadow-md transition-all duration-200"
              style={{ position: 'relative', zIndex: 60 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* منوی موبایل - خارج از nav برای جلوگیری از همپوشانی */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* محتوای منو */}
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white animate-in slide-in-from-top duration-300 overflow-y-auto">
            <div className="pt-20 px-4 pb-8">
              {/* دکمه دوره‌ها - موبایل بزرگ */}
              <Link
                to="/courses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-5 mb-4 bg-gradient-to-r from-sky-50 to-blue-100 
                  rounded-2xl hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/60  flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-lg">دوره‌ها</p>
                    <p className="text-sm text-blue-700">مشاهده همه دوره‌های آموزشی</p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-blue-600 -rotate-90" />
              </Link>

              {authUser ? (
                // حالت وارد شده موبایل
                <>
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm 
                        flex items-center justify-center text-white font-bold text-xl">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">{getUserDisplayName()}</p>
                        <p className="text-white/80 text-sm">{getUserRoleLabel()}</p>
                        {authUser.email && (
                          <p className="text-white/70 text-xs mt-1">{authUser.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {menuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl 
                          hover:bg-slate-100 transition-colors duration-200"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <item.icon className="w-5 h-5  text-emerald-600" />
                        </div>
                        <div className="text-right flex-1">
                          <p className="font-semibold text-slate-700">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl 
                      hover:bg-red-100 transition-colors duration-200 w-full"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-right flex-1">
                      <p className="font-semibold text-red-600">خروج از حساب</p>
                      <p className="text-xs text-slate-500">خروج و بازگشت به صفحه اصلی</p>
                    </div>
                  </button>
                </>
              ) : (
                // حالت وارد نشده موبایل - ۳ دکمه با سایز متفاوت
                <>
                  {/* دکمه ورود دانشجو - بزرگ */}
                  <Link to="/login/student" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full flex items-center gap-3 p-5 bg-gradient-to-r from-emerald-50 to-emerald-100 
                      rounded-2xl mb-4 hover:shadow-lg transition-all duration-200">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right flex-1">
                        <p className="font-bold text-slate-800 text-lg">ورود به عنوان دانشجو</p>
                        <p className="text-sm text-emerald-700">دسترسی به دوره‌های ثبت‌نامی</p>
                      </div>
                    </button>
                  </Link>

                  {/* دکمه ورود مدرس - متوسط */}
                  <Link to="/login/instructor" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-100 
                      rounded-2xl mb-3 hover:shadow-md transition-all duration-200">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <School className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right flex-1">
                        <p className="font-bold text-slate-800">ورود به عنوان مدرس</p>
                        <p className="text-xs text-blue-700">مدیریت و ایجاد دوره</p>
                      </div>
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* مودال تأیید خروج */}
      <WarningModal
        isOpen={isLogoutModalOpen}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="خروج از حساب کاربری"
        message="آیا از خروج خود اطمینان دارید؟"
        confirmText="خروج"
        cancelText="انصراف"
        type="danger"
      />
    </>
  );
};

export default Navbar;