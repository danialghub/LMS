import React, { useEffect, useState } from 'react'
import { MyCourseCard, CourseCard, Navbar, CourseFilteringCard, PageLoader, Footer, SubmitLoading } from '@/components/index'
import { BookA, GraduationCap, Loader, User } from 'lucide-react'
import { useGetCourses } from '@/query/courseQueries'
import toast from 'react-hot-toast'
import { useDebounce } from 'use-debounce'
import { AnimatePresence } from 'framer-motion'
import { useCourseStore } from '@/store/useCourseStore'


const Banner = () => {
    const [coursesCount, setCourseCount] = useState(0)
    const [studentsCount, setStudentsCount] = useState(0)
    const [instructorsCount, setInstructorsCount] = useState(0)
    const { getCourseBannerInfo } = useCourseStore()
    useEffect(() => {
        const getInfo = async () => {
            const data = await getCourseBannerInfo();
            return data;
        };

        const fetchData = async () => {
            const data = await getInfo();
            setCourseCount(data.courses || 0);
            setInstructorsCount(data.instructors || 0);
            setStudentsCount(data.students || 0);
        };

        fetchData();
    }, []);
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
                            <span>{studentsCount}+</span>
                            <span className='text-white/70'> دانشجو</span>
                        </div>


                    </div>
                    <div className='flex items-center gap-2 md:gap-3 '>
                        <span className='p-1 md:p-4 rounded-lg bg-white/10 '>
                            <BookA className='max-md:size-5' />
                        </span>
                        <div className='flex flex-col justify-center gap-1 md:gap-3'>
                            <span>{coursesCount}+</span>
                            <span className='text-white/70'> دوره ها</span>
                        </div>


                    </div>
                    <div className='flex items-center gap-2 md:gap-3 '>
                        <span className='p-1 md:p-4 rounded-lg bg-white/10 '>
                            <GraduationCap className='max-md:size-5' />
                        </span>
                        <div className='flex flex-col justify-center gap-1 md:gap-3'>
                            <span>{instructorsCount}+</span>
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
    // const [sortBy, setSortBy] = useState('newest')
    const [filters, setFilters] = useState({
        sortBy: "newest",
        isFreeCourses: false,
        myCourses: "",
        title: ""
    })
    const [searchByTitle, setSearchByTitle] = useState("")
    const [debouncedFilters] = useDebounce(filters, 700)
    const [courses, setCourses] = useState([])
    const [totalCourses, setTotalCourses] = useState(0)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isFetching,
        error
    } = useGetCourses(debouncedFilters)



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

        const flatedCourses = data?.pages?.flatMap(page => page.courses) || []
        setTotalCourses(data?.pages?.[0]?.totalCourses || 0)
        setCourses(flatedCourses)
    }, [data])

    useEffect(() => {
        const trimmed = searchByTitle.trim();
        if (trimmed.length >= 3 || trimmed.length === 0) {
            setFilters(prev => ({ ...prev, title: trimmed }));
        }
    }, [searchByTitle]);

    return (
        <div className='bg-neutral-100'>
            <Navbar />
            <div className='px-6 md:px-32  py-52 pt-4'>
                <div className='my-12 relative'>
                    <Banner courseCount={totalCourses} />
                </div>
                <div className='flex flex-col md:flex-row items-start  gap-8 relative'>

                    <CourseFilteringCard
                        filters={filters}
                        setFilters={setFilters}
                        setSearchByTitle={setSearchByTitle}
                        searchByTitle={searchByTitle}

                    />

                    <div className='md:flex-3 flex flex-col items-center gap-6'>
                        {isFetching && courses.length === 0
                            ? <div > <PageLoader /></div>
                            : courses?.length > 0
                                ? (
                                    <div className='grid grid-cols-1 px-7  md:px-0 md:grid-cols-2 xl:grid-cols-3  gap-6 md:flex-3 ' >
                                        <AnimatePresence>
                                            {courses.map(course => (
                                                <CourseCard key={course._id} course={course} />
                                            ))

                                            }
                                        </AnimatePresence>
                                    </div>
                                ) : <div className='flex items-center justify-center text-4xl text-gray-800 min-h-[70vh] font-heading'>
                                    دوره ای یافت نشد
                                </div>
                        }
                        {hasNextPage && (
                            <div >
                                <button
                                    disabled={!hasNextPage || isFetchingNextPage}
                                    onClick={fetchNextPage}
                                    className="w-[120px] h-[40px] rounded-lg bg-blue-500 text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                                >
                                    {isFetchingNextPage ? (
                                        <SubmitLoading />
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