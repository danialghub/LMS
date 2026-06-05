import {
    LogOut,
    Settings,
    Zap,
    Wallet,
} from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { Navbar } from '@/components/index'
const courses = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
}));

export default function MyCourses() {
    const menus = [

        { title: "دوره های من", icon: Zap, active: true, path: "/student/my-courses" },
        { title: "  تراکنش ها", icon: Wallet, path: "/student/my-transactions" },

    ];

    return (
        <div

            className="min-h-screen bg-[#f3f3f3] "
        >
            <Navbar />
            <div className="max-w-[1700px]  flex gap-8 p-6">

                {/* SIDEBAR - Sticky */}
                <aside
                    dir="ltr"
                    className="w-[280px] shrink-0 sticky top-24  self-start ">
                    <div className="bg-white rounded-3xl p-6 ">
                        {/* Top */}
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <LogOut
                                    size={18}
                                    className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                                />

                                <Settings
                                    size={18}
                                    className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div>
                                    <h3 className="font-bold text-sm">
                                        Danial
                                    </h3>

                                </div>

                                <div className="w-12 h-12 rounded-full bg-gray-200" />
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
                                        className={({ isActive }) => `flex items-center gap-4 cursor-pointer transition-all py-3 ${isActive
                                            ? "text-blue-500 border-l-4 border-blue-500 pr-4 "
                                            : "text-gray-700 hover:text-blue-500 border-r-4 border-transparent pr-4"
                                            }`}
                                    >

                                        <div className="flex items-center gap-4">
                                            <Icon size={22} />
                                            <span className="font-medium text-base">
                                                {menu.title}
                                            </span>
                                        </div>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* MAIN */}
                <Outlet />

            </div>
        </div>
    );
}