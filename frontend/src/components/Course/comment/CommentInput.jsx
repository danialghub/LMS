import React, { useState } from 'react'
import { usePostCourseCommentMutation } from '@/query/commentQueries'
import { SubmitLoading } from '@/components/index'


const CommentInput = ({ canComment, courseId }) => {

    const [newComment, setNewComment] = useState('');

    const { mutateAsync: postComment, isPending: isPosting } = usePostCourseCommentMutation()


    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        await postComment({ courseId, newComment: { content: newComment } })
    };

    return (
        canComment ? (
            <form onSubmit={handleSubmitComment} className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="نظر خود را بنویسید..."
                        className="flex-1 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-[#1b2538] bg-white dark:bg-[#0d111c] focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm sm:text-base"
                        rows="3"
                    />
                    <button
                        type="submit"
                        disabled={isPosting || !newComment.trim()}
                        className="px-4 sm:px-6 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] w-full sm:w-auto min-w-[100px] sm:min-w-[130px] flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 font-medium text-sm sm:text-base"
                    >
                        {isPosting ? <SubmitLoading /> : 'ارسال نظر'}
                    </button>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-gray-400 mt-2 mr-1">
                    * نظرات شما پس از تایید نمایش داده می‌شوند
                </p>
            </form>
        ) : (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 text-center rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-[#121826] border border-zinc-200 dark:border-[#1b2538]">
                <p className="text-sm sm:text-base text-zinc-600 dark:text-gray-400">
                    برای ثبت نظر باید در این دوره ثبت‌نام کنید
                </p>
            </div>
        )
    )
}

export default CommentInput