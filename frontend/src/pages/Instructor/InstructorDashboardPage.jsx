import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { Logo, UserAvatar ,Navbar} from '@/components/index'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router'
import { Menu, LayoutDashboard, BarChart3, Library, BookOpen } from 'lucide-react'

const InstructorDashboardPage = () => {
  const { token } = useAuthStore()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const dashboardRef = useRef(null)

  useEffect(() => {
    if (token && location.pathname === "/instructor") {
      navigate('/instructor/dashboard')
    }
    scrollTo(0, 0)
  }, [token])

  useEffect(() => {
    const clickedOnPage = e => {
      if (e.target.id !== "sidebar" && e.target.tagName !== "path") setIsOpen(false)
    }
    dashboardRef?.current?.addEventListener('click', clickedOnPage)
    return () => dashboardRef?.current?.removeEventListener('click', clickedOnPage)
  }, [])

  const sideBar = [
    { title: "پیشخوان", icon: <LayoutDashboard />, path: "/instructor/dashboard" },
    { title: "دوره ها", icon: <Library />, path: "/instructor/courses" },
    { title: "آمار فروش", icon: <BarChart3 />, path: "/instructor/analytics" },
  ]

  return (
    <div className='h-screen flex flex-col ' ref={dashboardRef}>

        <Navbar />

      <div className='flex flex-1 overflow-hidden' >
        {/* سایدبار */}
        <div id='sidebar' className={`w-[50%]   sm:w-[15%] bg-white  h-full overflow-y-auto max-sm:shadow-md  max-sm:absolute z-1  transition duration-200 ${isOpen ? "max-sm:translate-x-[0%]" : "max-sm:translate-x-[100%]"}`}>
          <div className='mt-4'>
            {sideBar.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-4 text-black/70 hover:bg-blue-50 
            ${isActive && "bg-blue-50 text-blue-700 border-l-4 border-blue-600"}`
                }
              >
                {item.icon}
                <span className=''>{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* محتوای اصلی */}
        <div className='flex-1 overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboardPage