import React, { useEffect, useState } from 'react'
import { Star, StarIcon, User, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
const MyCourseCard = () => {

    const [wid, setWid] = useState(0)

    useEffect(() => {
        setTimeout(() => {
            setWid(70)
        }, 5000);
    }, [])
    return (
        <div
            className='rounded-lg w-full  flex flex-col justify-between  shadow-sm group mx-auto bg-white'
        >
            <div
                className='rounded-lg relative cursor-pointer overflow-hidden'
            >
                <img
                    src="/footage/1.webp"
                    alt=""
                    className='bg-cover aspect-video w-full object-cover'
                />
                <span
                    className='bg-black/15 group-hover:bg-black/0 size-full absolute top-0 left-0 transition duration-300'></span>
            </div>

            <div className='p-3 sm:p-4 pb-3 sm:pb-4'>
                <h2 className='text-sm  text-black/80  truncate'>آموزش پروژه محور Nextjs از صفر</h2>


                <div className='flex items-center gap-1 mt-4 sm:mt-6  text-black/60'>
                    <User size={20} />
                    <span className='text-[11px] sm:text-[13px]  truncate'>معین باخشچی</span>
                </div>


                <hr className='text-gray-200 my-3 sm:my-3' />

                <div className=''>
                    <div className='flex items-center gap-4 w-full'>
                        {/* متن درصد */}
                        <div className='flex items-center gap-1 text-sm text-blue-500 shrink-0'>
                            <span className='font-Dirooz-FD'>0%</span>
                            <span className='font-Dirooz'>تکمیل</span>
                        </div>

                        {/* نوار پیشرفت */}
                        <div className='relative h-1 rounded-full w-full bg-gray-200 overflow-hidden'>
                            {/* حاشیه  */}
                            <div className='h-full w-0 bg-blue-500 rounded-full'></div>
                            {/* درصد پر شده */}
                            <div
                                className='absolute top-0 right-0 bg-blue-500 h-full transition-all duration-1000 ease-out'
                                style={{ width: `${wid}%` }}
                            ></div>
                        </div>


                    </div>

                </div>
            </div>
            {/* دکمه رفتن به دوره */}
            <div>
                <Link >
                    <button
                        className="w-full py-2 rounded bg-blue-100 text-blue-500 flex items-center justify-center text-[13px] cursor-pointer"
                    >
                        <span>ادامه یادگیری</span>
                        <ArrowLeft />
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default MyCourseCard