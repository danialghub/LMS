import {
    LogOut,
    Settings,
    Zap,
    Wallet,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Navbar, EditProfileModal, WarningModal } from '@/components/index'
import { useState } from "react";
import { useAuthStore } from '@/store/useAuthStore'
import UserAvatar from "../../components/UI/UserAvatar";
const courses = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
}));

export default function MyCourses() {
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate()
    const { authUser, logout } = useAuthStore();

    const menus = [

        { title: "دوره های من", icon: Zap, active: true, path: "/student/my-courses" },
        { title: "  تراکنش ها", icon: Wallet, path: "/student/my-transactions" },

    ];


    const handleConfirmLogout = async () => {
        await logout();
        setIsLogoutModalOpen(false);
        navigate('/');
    };

    const handleCancelLogout = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#f3f3f3]">
            <Navbar />
            <div className="max-w-[1700px] flex gap-8 p-6">
                <EditProfileModal
                    isOpen={showProfileModal}
                    onClose={() => setShowProfileModal(false)}
                    userData={authUser}
                    role="student"
                />

                {/* SIDEBAR - Desktop: Sticky, Mobile: Hidden */}
                <aside
                    dir="ltr"
                    className="hidden lg:block w-[280px] shrink-0 sticky top-24 self-start"
                >
                    <div className="bg-white rounded-3xl p-6">
                        {/* محتوای current sidebar شما */}
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <button onClick={() => setIsLogoutModalOpen(true)}>
                                    <LogOut size={18} className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                                </button>
                                <button onClick={() => setShowProfileModal(true)}>
                                    <Settings size={18} className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <div>
                                    <h3 className="font-bold text-sm">{authUser.name}</h3>
                                </div>
                                {/* <div className="w-12 h-12 rounded-full bg-gray-200" /> */}
                                <UserAvatar className="size-12 rounded-full" />
                            </div>
                        </div>
                        <div className="h-px bg-gray-200 my-6" />
                        <div className="space-y-8" dir="rtl">
                            {menus.map((menu) => {
                                const Icon = menu.icon;
                                return (
                                    <NavLink
                                        key={menu.title}
                                        to={menu.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-4 cursor-pointer transition-all py-3 ${isActive
                                                ? "text-blue-500 border-l-4 border-blue-500 pr-4"
                                                : "text-gray-700 hover:text-blue-500 border-r-4 border-transparent pr-4"
                                            }`
                                        }
                                    >
                                        <div className="flex items-center gap-4">
                                            <Icon size={22} />
                                            <span className="font-medium text-base">{menu.title}</span>
                                        </div>
                                    </NavLink>
                                )
                            })}
                        </div>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 pb-20 lg:pb-0">
                    <Outlet />
                </main>
            </div>

            {/* BOTTOM NAVIGATION - Mobile Only */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg z-50">
                <div className="flex justify-around items-center px-4 py-2">
                    {menus.map((menu) => {
                        const Icon = menu.icon;
                        return (
                            <NavLink
                                key={menu.title}
                                to={menu.path}
                                className={({ isActive }) =>
                                    `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${isActive
                                        ? "text-blue-500"
                                        : "text-gray-500 hover:text-blue-400"
                                    }`
                                }
                            >
                                <Icon size={22} />
                                <span className="text-[11px] font-medium">{menu.title}</span>
                            </NavLink>
                        );
                    })}

                    {/* دکمه‌های Logout و Settings هم می‌تونید اضافه کنید */}
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="flex flex-col items-center gap-1 py-2 px-3 text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={22} />
                        <span className="text-[11px] font-medium">خروج</span>
                    </button>

                    <button
                        onClick={() => setShowProfileModal(true)}
                        className="flex flex-col items-center gap-1 py-2 px-3 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                        <Settings size={22} />
                        <span className="text-[11px] font-medium">تنظیمات</span>
                    </button>
                </div>
            </div>

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
        </div>
    );
}