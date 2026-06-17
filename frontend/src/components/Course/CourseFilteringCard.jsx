import React, { useCallback, useEffect, useState } from 'react'

import { useAuthStore } from '@/store/useAuthStore';
import { Check, Filter, Grip, Search, SortAsc, SortDesc, XIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion'
const ToggleButton = ({ isOn }) => {
    return (
        <button

            className={`
        relative  w-12 h-6  rounded-full transition-colors duration-300 px-1 cursor-pointer
        ${isOn ? 'bg-blue-500' : 'bg-gray-300'}
      `}
        >
            <div
                className={`
          absolute  top-1 w-4 h-4 rounded-full bg-white shadow-md
          transition-transform duration-300 ease-out
          ${isOn ? ' -translate-x-[1.5rem]' : 'translate-x-0'}
        `}
            ></div>
        </button>
    );
};
const MobileSortOptions = ({ sortOptions, setShowSortOptions, sortBy, setSortBy }) => {
    return (
        <motion.div
            className='fixed inset-0 w-full h-screen bg-black/40 z-10'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSortOptions(false)}
        >
            <motion.div
                className='fixed bottom-0 right-0 bg-white rounded-md w-full py-5 pb-safe'
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-center justify-between px-6 text-[15px] font-Dirooz font-bold'>
                    <h4>مرتب سازی بر اساس</h4>
                    <button
                        onClick={() => setShowSortOptions(false)}
                        className='pl-2'>
                        <XIcon size={16} />
                    </button>
                </div>
                <div className='flex flex-col items-start gap-2 mt-4'>
                    {sortOptions.map(sortOpt => (
                        <button
                            key={sortOpt.value}
                            className={`px-6 w-full py-3 text-[13px] flex items-center justify-between ${sortBy === sortOpt.value ? "bg-blue-50 text-blue-500" : "text-black/80"}`}
                            onClick={() => setSortBy(sortOpt.value)}
                        >
                            {sortOpt.label}
                            {sortBy === sortOpt.value && <Check size={17} className='text-blue-500' />}
                        </button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
const MobileFilters = ({ setShowFilters, authUser, filters, setFilters }) => {
    return (
        <motion.div
            className='fixed inset-0 w-full h-screen bg-black/40 z-10'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
        >
            <motion.div
                className='fixed bottom-0 right-0 bg-white rounded-md w-full py-5 pb-safe'
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-center justify-between px-6 text-[15px] font-Dirooz font-bold'>
                    <h4 className='text-black/70'>فیلتر دوره ها </h4>
                    <button
                        onClick={() => setShowFilters(false)}
                        className='pl-2'>
                        <XIcon size={16} />
                    </button>
                </div>
                <div className=' mt-6'>
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, isFreeCourses: !prev.isFreeCourses }))}
                        className='flex  w-full bg-white shadow p-4 sm:p-6 md:p-8 py-3 sm:py-5 md:py-6 rounded-lg  items-center justify-between'>
                        <p className=' text-[15px]    text-black/70'>فقط دوره های رایگان</p>
                        <ToggleButton
                            isOn={filters.isFreeCourses}
                        />
                    </button>

                    {/* فیلتر دوره‌های من (فقط دانشجو) */}
                    {authUser && authUser.role === "student" && (
                        <button
                            onClick={() => setFilters(prev => ({ ...prev, myCourses: prev.myCourses ? "" : authUser._id }))}
                            className='border-t-1 w-full border-t-black/10 flex bg-white shadow p-4 sm:p-6 md:p-8 py-3 sm:py-5 md:py-6 rounded-lg  items-center justify-between'>
                            <p className='text-[15px]   text-black/70'>فقط دوره های من</p>
                            <ToggleButton
                                isOn={filters.myCourses === authUser._id}
                            />
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}
const CourseFilteringCard = ({ filters, setFilters, setSearchByTitle }) => {

    const [showSortOptions, setShowSortOptions] = useState(false)
    const [showFilters, setShowFilters] = useState(false)

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
        <div className='flex flex-col gap-4 sm:gap-6 md:flex-1 rounded-lg md:sticky md:top-24 max-md:mx-auto max-md:w-full'>
            {/* جستجو */}

            <div className='relative p-3 sm:p-5 rounded-xl mx-6 sm:mx-0 bg-white shadow-md'>
                <input
                    type="text"
                    onChange={e => setSearchByTitle(e.target.value)}
                    className='w-full text-sm sm:text-base text-black/70 rounded-lg border-none outline-none bg-transparent placeholder:text-black/40 pr-8 sm:pr-0'
                    placeholder='جستجو در بین دوره ها'
                />
                <span className='absolute left-3 sm:left-5 top-1/2  -translate-y-1/2 text-black/40'>
                    <Search size={18} className="sm:size-5" />
                </span>
            </div>

            {/*pc مرتب سازی */}
            <div className='hidden sm:block bg-white shadow py-4 sm:py-6 md:py-8 rounded-lg '>
                <div className='flex items-center gap-2 pr-3'>
                    <Grip size={18} className="sm:size-5" />
                    <h5 className='font-heading text-black/80  text-base sm:text-[21px]'>مرتب سازی</h5>
                </div>
                <hr className='my-3 sm:my-4 border-black/10' />

                <div className="flex flex-col items-start gap-3 sm:gap-5 px-4 sm:px-6 md:px-8">
                    {sortOptions.map(option => (
                        <label
                            key={option.value}
                            onClick={() => handleSort(option.value)}
                            className="flex items-center gap-2 sm:gap-3 cursor-pointer group w-full"
                        >
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="sort"
                                    value={option.value}
                                    checked={filters.sortBy === option.value}
                                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                    className="sr-only peer"
                                />
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all"></div>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white transition-all ${filters.sortBy === option.value ? 'scale-100' : 'scale-0'}`}></div>
                                </div>
                            </div>
                            <span className="text-xs sm:text-sm md:text-base text-gray-700 group-hover:text-blue-600 transition-colors">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/*Mobile دکمه های */}
            <div className='sm:hidden flex  items-center justify-center gap-4 text-[14px] text-black/70  mt-5 font-heading'>
                <button
                    onClick={() => setShowFilters(true)}
                    className='flex items-center justify-center gap-2 sm:hidden w-[180px] py-2.5 rounded-md border-1 border-black/5 shadow active:scale-105 transition duration-300'>
                    <Filter size={15} />
                    فیلتر
                </button>
                <button
                    onClick={() => setShowSortOptions(true)}
                    className='flex items-center justify-center gap-2 sm:hidden w-[180px] py-2.5 rounded-md border-1 border-black/5 shadow active:scale-105 transition duration-300'>
                    <SortDesc size={18} />
                    مرتب سازی
                </button>
            </div>

            {/*Mobile مرتب سازی */}
            <AnimatePresence>
                {showSortOptions && (
                    <MobileSortOptions
                        sortOptions={sortOptions}
                        setShowSortOptions={setShowSortOptions}
                        sortBy={filters.sortBy}
                        setSortBy={(val) => setFilters(prev => ({ ...prev, sortBy: val }))}
                    />
                )}
            </AnimatePresence>

            {/*Mobile فیلتر ها */}
            <AnimatePresence>
                {showFilters && (
                    <MobileFilters
                        setShowFilters={setShowFilters}
                        authUser={authUser}
                        filters={filters}
                        setFilters={setFilters}
                    />
                )}
            </AnimatePresence>

            {/* فیلتر دوره‌های رایگان */}
            <div className='space-y-2'>
                <button
                    onClick={() => setFilters(prev => ({ ...prev, isFreeCourses: !prev.isFreeCourses }))}
                    className='hidden sm:flex w-full bg-white shadow p-4 sm:p-6 md:p-8 py-3 sm:py-5 md:py-6 rounded-lg  items-center justify-between'>
                    <p className='text-sm sm:text-base md:text-[17px] font-Dirooz text-gray-700'>فقط دوره های رایگان</p>
                    <ToggleButton
                        isOn={filters.isFreeCourses}
                    />
                </button>

                {/* فیلتر دوره‌های من (فقط دانشجو) */}
                {authUser && authUser.role === "student" && (
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, myCourses: prev.myCourses ? "" : authUser._id }))}
                        className='hidden  sm:flex w-full bg-white shadow p-4 sm:p-6 md:p-8 py-3 sm:py-5 md:py-6 rounded-lg  items-center justify-between'>
                        <p className='text-sm sm:text-base md:text-[17px] font-Dirooz text-gray-700'>فقط دوره های من</p>
                        <ToggleButton
                            isOn={filters.myCourses === authUser._id}
                        />
                    </button>
                )}
            </div>
        </div>
    )
}

export default CourseFilteringCard