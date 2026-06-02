import React from 'react';
import { Brain, Cpu } from 'lucide-react';

const Logo = ({ size = 'md', className = '' }) => {
    // سایزهای مختلف لوگو
    const sizes = {
        sm: {
            text: 'text-sm sm:text-lg',
            icon: 'w-4 h-4 sm:w-5 sm:h-5',
            padding: 'px-2 py-0.5'
        },
        md: {
            text: 'text-base sm:text-xl',
            icon: 'w-5 h-5 sm:w-7 sm:h-7',
            padding: 'px-3 py-1'
        },
        lg: {
            text: 'text-2xl sm:text-4xl',
            icon: 'w-8 h-8 sm:w-10 sm:h-10',
            padding: 'px-4 py-2'
        }
    };

    const currentSize = sizes[size];

    return (
        <div className={`inline-block ${className}`}>
            <div className="relative group">
                {/* لوگوی اصلی - بدون لینک تودرتو */}
                <div
                    className={`
                        relative flex items-center font-bold select-none
                        ${currentSize.text}
                        transform transition-all duration-300
                        group-hover:scale-105
                    `}
                >
                    {/* بخش اول: مغز */}
                    <div
                        className={`
                            relative overflow-hidden
                            text-white bg-gradient-to-r from-orange-500 to-orange-600
                            ${currentSize.padding} rounded-r-2xl
                            shadow-lg
                            transition-all duration-300
                            group-hover:shadow-xl
                        `}
                    >
                        <span className="relative z-10 flex items-center gap-1">
                            <Brain className={`${currentSize.icon} inline-block`} />
                            <span>مغز</span>
                        </span>
                    </div>

                    {/* بخش دوم: افزار */}
                    <div
                        className={`
                            relative overflow-hidden
                            text-white bg-gradient-to-r from-blue-500 to-indigo-600
                            ${currentSize.padding} rounded-l-2xl -ml-1
                            shadow-lg
                            transition-all duration-300
                            group-hover:shadow-xl
                        `}
                    >
                        <span className="relative z-10 flex items-center gap-1">
                            <Cpu className={`${currentSize.icon} inline-block`} />
                            <span>افزار</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// نسخه ساده برای حالت‌های خاص
export const LogoSimple = ({ className = '' }) => {
    return (
        <div className={`flex items-center font-bold text-2xl select-none ${className}`}>
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative flex">
                    <span className="text-white bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-1 rounded-r-full shadow-lg">
                        مغز
                    </span>
                    <span className="text-white bg-gradient-to-r from-blue-600 to-indigo-700 px-3 py-1 rounded-l-full shadow-lg">
                        افزار
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Logo;