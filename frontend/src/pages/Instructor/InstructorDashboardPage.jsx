import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { Logo, UserAvatar, Navbar, WarningModal ,EditProfileModal} from '@/components/index'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router'
import { Menu, LayoutDashboard, BarChart3, Library, BookOpen, Settings, LogOut, X } from 'lucide-react'


const InstructorDashboardPage = () => {
  const { token, logout ,authUser} = useAuthStore()
  const navigate = useNavigate()

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);



  useEffect(() => {
    if (token && location.pathname === "/instructor") {
      navigate('/instructor/dashboard')
    }
    scrollTo(0, 0)
  }, [token])

 

  const sideBar = [
    { title: "دوره ها", icon: <Library size={20} />, path: "/instructor/courses" },
    { title: "آمار فروش", icon: <BarChart3 size={20} />, path: "/instructor/analytics" },
  ]

  const handleConfirmLogout = async () => {
    await logout();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false)
  }

  return (
    <div className='h-screen flex flex-col' >
      <Navbar />

      <div className='flex flex-1 overflow-hidden'>
        {/* سایدبار - دسکتاپ */}
        <div
          id='sidebar'
          className='hidden sm:flex flex-col justify-between w-[15%] bg-white h-full overflow-y-auto shadow-md transition duration-200'
        >
          {/* منوی اصلی */}
          <div className='mt-4'>
            {sideBar.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-4 text-black/70 hover:bg-blue-50 transition-colors
                  ${isActive && "bg-blue-50 text-blue-700 border-l-4 border-blue-600"}`
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>

          {/* دکمه‌های پایین سایدبار دسکتاپ */}
          <div className='mb-6 border-t border-gray-200 pt-4'>
            <button
              onClick={() => setShowProfileModal(true)}
              className='flex items-center gap-2 px-4 py-3 w-full text-black/70 hover:bg-blue-50 transition-colors rounded-lg'
            >
              <Settings size={20} />
              <span>تنظیمات</span>
            </button>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className='flex items-center gap-2 px-4 py-3 w-full text-red-600 hover:bg-red-50 transition-colors rounded-lg'
            >
              <LogOut size={20} />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* محتوای اصلی */}
        <div className='flex-1 overflow-y-auto pb-20 sm:pb-0'>
          <Outlet />
        </div>
      </div>

      {/* منوی پایین موبایل */}
      <div className='sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-50'>
        <div className='flex justify-around items-center px-2 py-2'>
          {sideBar.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200
                ${isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-blue-500 hover:bg-gray-50"
                }`
              }
            >
              <div className="text-xl">
                {item.icon}
              </div>
              <span className='text-[11px] font-medium'>{item.title}</span>
            </NavLink>
          ))}

          {/* دکمه تنظیمات در موبایل */}
          <button
            onClick={() => setShowProfileModal(true)}
            className='flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 text-gray-500 hover:text-blue-500 hover:bg-gray-50'
          >
            <Settings size={20} />
            <span className='text-[11px] font-medium'>تنظیمات</span>
          </button>

          {/* دکمه خروج در موبایل */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className='flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 text-gray-500 hover:text-red-500 hover:bg-red-50'
          >
            <LogOut size={20} />
            <span className='text-[11px] font-medium'>خروج</span>
          </button>
        </div>
      </div>

      {/* مودال تایید خروج */}
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

      {/* مودال تنظیمات (اگه داری) */}
      <EditProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userData={authUser}
      />
    </div>
  )
}

export default InstructorDashboardPage