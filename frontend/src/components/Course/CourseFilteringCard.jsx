import React, { useCallback, useEffect, useState } from 'react'

import { useAuthStore } from '@/store/useAuthStore';
import { Grip, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';



const ToggleButton = () => {
    const [isOn, setIsOn] = useState(false);
    return (
        <button
            onClick={() => setIsOn(!isOn)}
            className={`
        relative w-12 h-6 rounded-full transition-colors duration-500 px-1 cursor-pointer
        ${isOn ? 'bg-blue-500' : 'bg-gray-300'}
      `}
        >
            <div
                className={`
          absolute top-1 w-4 h-4 rounded-full bg-white shadow-md
          transition-transform duration-500 ease-out
          ${isOn ? '-translate-x-[1.5rem]' : 'translate-x-0'}
        `}
            ></div>
        </button>
    );
};


const CourseFilteringCard = ({ sortBy, setSortBy }) => {
    const location = useLocation()
    const navigate = useNavigate()

    const { authUser } = useAuthStore()

    const sortOptions = [
        { label: 'جدیدترین', value: 'newest' },
        { label: 'قدیمی‌ترین', value: 'oldest' },
        { label: 'محبوب‌ترین', value: 'most-popular' },
        { label: 'پرفروش‌ترین', value: 'most-sell' }
    ];


    const handleSort = (value) => {
        navigate(location.pathname + "?" + value)
    }

    return (
        <div className=' flex flex-col gap-6 md:flex-1 rounded-lg md:sticky md:top-24 max-md:mx-auto max-md:w-full'>
            {/* جستجو */}
            <div className='relative p-5 rounded-xl bg-white'>
                <input type="text" className='text-black/70 rounded-lg border-none outline-none bg-transparent placeholder:text-black/40'
                    placeholder='جستجو در بین دوره ها'
                />
                <span className='absolute left-7 text-black/40'><Search /></span>
            </div>
            {/* مرتب سازی */}
            <div className='bg-white shadow p-8 rounded-lg'>
                <div className='flex items-center gap-2'>
                    <Grip />
                    <h5 className='font-Dirooz text-lg'>   مرتب سازی</h5>
                </div>
                <hr className='my-4 border-black/10' />

                <div className="flex flex-col items-start gap-5">
                    {sortOptions.map(option => (
                        <label
                            key={option.value}
                            onClick={() => handleSort(option.value)}
                            className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="sort"
                                    value={option.value}
                                    checked={sortBy === option.value}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sr-only peer"
                                />
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all"></div>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className={`w-2 h-2 rounded-full bg-white transition-all ${sortBy === option.value ? 'scale-100' : 'scale-0'}`}></div>
                                </div>
                            </div>
                            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{option.label}</span>
                        </label>


                    ))}
                </div>

            </div>

            <div className='bg-white shadow p-8 py-6 rounded-lg flex items-center justify-between'>
                <p className='text-[17px] font-Dirooz'>فقط دوره های رایگان</p>
                <ToggleButton />
            </div>
            {authUser && authUser.role === "student" && (
                <div className='bg-white shadow p-8 py-6 rounded-lg flex items-center justify-between'>
                    <p className='text-[17px] font-Dirooz'>فقط دوره های من</p>
                    <ToggleButton />
                </div>
            )

            }
        </div>
    )
}

export default CourseFilteringCard