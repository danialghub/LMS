import React, { useEffect, useState } from 'react'
import { MyCourseCard, CourseCard, Navbar, CourseFilteringCard, PageLoader, Footer } from '@/components/index'
import { BookA, GraduationCap, Loader, User } from 'lucide-react'
import { useGetCourses } from '@/query/courseQueries'
import toast from 'react-hot-toast'
import { useDebounce } from 'use-debounce'
import { AnimatePresence } from 'framer-motion'


const Banner = ({ studentCount = 0, courseCount, instructorCount = 0 }) => {

    return (
        <div className='relative '>
            <div className='relative z-10 p-4 md:p-12  flex flex-col justify-center items-center gap-10 md:gap-16 bg-zinc-800 text-sm text-white rounded-lg'>
                <h3 className=' text-xl md:text-3xl font-bold'>همه دوره های آموزشی</h3>
                <div className='flex items-center justify-center gap-8 max-md:text-[10px] md:gap-16'>
                    <div className='flex items-center gap-2 md:gap-3 '>
                        <span className='p-1 md:p-4 rounded-lg bg-white/10 '>
                            <User className='max-md:size-5' />
                        </span>
                        <div className='flex flex-col justify-center gap-1 md:gap-3'>
                            <span>{studentCount}+</span>
                            <span className='text-white/70'> دانشجو</span>
                        </div>


                    </div>
                    <div className='flex items-center gap-2 md:gap-3 '>
                        <span className='p-1 md:p-4 rounded-lg bg-white/10 '>
                            <BookA className='max-md:size-5' />
                        </span>
                        <div className='flex flex-col justify-center gap-1 md:gap-3'>
                            <span>{courseCount}+</span>
                            <span className='text-white/70'> دوره ها</span>
                        </div>


                    </div>
                    <div className='flex items-center gap-2 md:gap-3 '>
                        <span className='p-1 md:p-4 rounded-lg bg-white/10 '>
                            <GraduationCap className='max-md:size-5' />
                        </span>
                        <div className='flex flex-col justify-center gap-1 md:gap-3'>
                            <span>{instructorCount}+</span>
                            <span className='text-white/70'> مدرس ها</span>
                        </div>


                    </div>

                </div>
            </div>
            <div className='absolute -left-[2.5%] h-2/3 rounded-2xl w-[105%] top-1/2  -translate-y-1/2   bg-blue-600'>

            </div>
        </div>
    )
}

const CoursesPage = () => {
    const [sortBy, setSortBy] = useState('newest')
    const [courses, setCourses] = useState([])
    const [debouncedFilters] = useDebounce(sortBy, 700)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isFetching,
        error
    } = useGetCourses({ sortBy: debouncedFilters })



    useEffect(() => {
        if (!error) return

        toast.error(
            error?.response?.data?.message ||
            error?.message ||
            "مشکلی رخ داده"
        )
    }, [error])

    useEffect(() => {
        if (!data) return
        const fltatCourses = data?.pages?.flatMap(page => page.courses) || []

        setCourses(fltatCourses)

    }, [data])
    return (
        <div className='bg-neutral-100'>
            <Navbar />
            <div className='px-6 md:px-32  py-52 pt-4'>
                <div className='my-12 relative'>
                    <Banner courseCount={courses?.length} />
                </div>
                <div className='flex flex-col md:flex-row items-start  gap-8 relative'>

                    <CourseFilteringCard
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />

                    <div className='md:flex-3 flex flex-col items-center gap-6'>
                        {isFetching && !courses.length
                            ? <div > <PageLoader /></div>
                            : (
                                <div className='grid grid-cols-1 px-10  md:px-0 md:grid-cols-2 xl:grid-cols-3  gap-6 md:flex-3 ' >
                                    <AnimatePresence>
                                        {courses?.length && courses.map(course => (
                                            <CourseCard key={course._id} course={course} />
                                        ))

                                        }
                                    </AnimatePresence>
                                </div>
                            )
                        }
                        {hasNextPage && (
                            <div >
                                <button
                                    disabled={!hasNextPage || isFetchingNextPage}
                                    onClick={fetchNextPage}
                                    className="w-[120px] h-[40px] rounded-lg bg-blue-500 text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                                >
                                    {isFetchingNextPage ? (
                                        <div className="flex items-center gap-1">
                                            <span className="dot" />
                                            <span className="dot" />
                                            <span className="dot" />
                                        </div>
                                    ) : (
                                        "مشاهده بیشتر"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CoursesPage