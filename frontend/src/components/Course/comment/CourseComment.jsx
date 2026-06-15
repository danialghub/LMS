import React, { memo, useEffect, useState } from 'react';
import {
    MessageCircle,
} from 'lucide-react';
import { CommentList, CommentInput } from '@/components/index'
import { useAuthStore } from '@/store/useAuthStore'
import { useGetCourseComments } from '@/query/commentQueries'
import { useDebounce } from 'use-debounce';


const CourseComments = ({ course }) => {
    const [comments, setComments] = useState([])
    const [sortBy, setSortBy] = useState('newest');
    const [replyTo, setReplyTo] = useState(null);
    const [totalComments, setTotalComments] = useState(0)
    const { authUser } = useAuthStore()

    const canComment = authUser && course.enrolledStudents?.includes(authUser._id);
    const canModerate = authUser && course.instructor._id === authUser?._id;



    const [debouncedFilters] = useDebounce(sortBy, 300)


    const validUser = (canComment || canModerate) ? authUser._id : null

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error
    } = useGetCourseComments(course._id, { sortBy: debouncedFilters }, validUser)

    useEffect(() => {
        if (!data) return
        const fltatComments = data?.pages?.flatMap(page => page.comments) || []
        const totalApprovedComments = data?.pages[0]?.totalApprovedComments ?? 0;


        // const filteredComments = (canComment || canModerate)
        //     ? fltatComments
        //     : fltatComments.filter(comment => comment.status === "approved")
        setComments(fltatComments)
        setTotalComments(totalApprovedComments)

    }, [data])




    return (
        <div className="mt-4 sm:mt-8">
            {/* هدر نظرات */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-zinc-200 dark:border-[#1a2233]">
                <div className="flex items-center gap-2 sm:gap-3">
                    <MessageCircle size={20} className="sm:size-6 text-blue-500" />
                    <h2 className="text-xl sm:text-2xl font-bold">
                        نظرات {totalComments}
                    </h2>
                </div>

                {comments.length > 0 && (
                    <select
                        onChange={e => setSortBy(e.target.value)}
                        value={sortBy}
                        className="w-full sm:w-auto appearance-none bg-gray-900 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-md bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%239ca3af%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27M6%208l4%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] sm:bg-[length:20px] bg-[right_8px_center] sm:bg-[right_10px_center] bg-no-repeat">
                        <option value="newest" className="bg-gray-900 text-white">
                            جدیدترین
                        </option>
                        <option value="oldest" className="bg-gray-900 text-white">
                            قدیمی ترین
                        </option>
                        {canModerate && (
                            <option value="unApproved" className="bg-gray-900 text-white">
                                تایید نشده
                            </option>
                        )}
                    </select>
                )}
            </div>

            {/* فرم ارسال نظر جدید */}
            <CommentInput
                canComment={canComment}
                setReplyTo={setReplyTo}
                courseId={course?._id}
            />

            {/* لیست نظرات */}
            <CommentList
                comments={comments}
                loading={isLoading}
                canComment={canComment}
                canModerate={canModerate}
                setReplyTo={setReplyTo}
                replyTo={replyTo}
                courseId={course?._id}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
            />
        </div>
    );
};

export default memo(CourseComments);