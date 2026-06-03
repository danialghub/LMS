import React from 'react'
import { CourseSkleton, MyCourseCard } from '@/components/index'
import { useStudentStore } from '@/store/useStudentStore'
import { useEffect } from 'react'
const StudentCourses = () => {

    const { getStudentCourses, studentCourses, isFetching } = useStudentStore()

    useEffect(() => {
        getStudentCourses()
    }, [])
    return (
        <div className="flex-1 min-w-0 bg-[#f3f3f3] min-h-screen">
<div>
    
</div>

            {/* CONTENT */}
            <div className="bg-white  rounded-3xl mt-10 p-8 ">
                <h1 className="text-3xl  text-black/80 font-heading mb-6 text-right">
                    دوره های من
                </h1>

                <div className="grid grid-cols-4 gap-5">
                    {isFetching
                        ? (
                            [1, 2, 3, 4].map((course, idx) => (
                                <CourseSkleton key={idx} />
                            ))
                        )
                        : studentCourses.length
                            ? (
                                studentCourses.map(course => (
                                    <MyCourseCard key={course._id} course={course} />
                                ))
                            ) : <div className='text-2xl font-heading text-black/70 flex items-center justify-center '>
                                دوره ای یافت نشد
                            </div>

                    }
                </div>
            </div>
        </div>
    )
}

export default StudentCourses