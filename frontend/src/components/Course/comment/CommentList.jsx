import React, { memo, useEffect, useState } from 'react'
import {
    MessageCircle,
} from 'lucide-react';
import { CommentItem, CommentsListSkeleton, SubmitLoading } from '@/components/index'
import { useAuthStore } from '@/store/useAuthStore'
import { usePostCourseCommentMutation } from '@/query/commentQueries'
import { AnimatePresence } from 'framer-motion';

const CommentList = (
    {
        comments, loading, canModerate, canComment,
        replyTo, setReplyTo, courseId, fetchNextPage,
        hasNextPage, isFetchingNextPage
    }
) => {

    const [replyText, setReplyText] = useState('');
    const [expandedReplies, setExpandedReplies] = useState(new Set());

    const { authUser } = useAuthStore()

    const { mutateAsync: postComment, isPending: isPosting } = usePostCourseCommentMutation()

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        await postComment({ courseId, newComment: { content: replyText, parentId: replyTo } })
        setReplyText('');
        setReplyTo(null);
    };

    const toggleReplies = (commentId) => {
        const newExpanded = new Set(expandedReplies);
        if (newExpanded.has(commentId)) {
            newExpanded.delete(commentId);
        } else {
            newExpanded.add(commentId);
        }
        setExpandedReplies(newExpanded);
    };

    return (
        loading && comments.length === 0 ? (
            <CommentsListSkeleton count={3} />
        ) : comments.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
                <MessageCircle size={40} className="sm:size-12 mx-auto text-zinc-400 dark:text-gray-600 mb-3" />
                <p className="text-sm sm:text-base text-zinc-500 dark:text-gray-400">هنوز نظری ثبت نشده است</p>
                {canComment && (
                    <p className="text-xs sm:text-sm text-zinc-400 dark:text-gray-500 mt-1">
                        اولین نفری باشید که نظر می‌دهید
                    </p>
                )}
            </div>
        ) : (
            <div className="space-y-3 sm:space-y-4">
                <AnimatePresence>
                    {comments.map((comment) => {
                        return (comment.status !== "pending" || canModerate || comment.userId._id === authUser?._id) && (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                replyTo={replyTo}
                                canModerate={canModerate}
                                expandedReplies={expandedReplies}
                                canComment={canComment}
                                toggleReplies={toggleReplies}
                                setReplyTo={setReplyTo}
                                replyText={replyText}
                                setReplyText={setReplyText}
                                handleSubmitReply={handleSubmitReply}
                                submitting={isPosting}
                                courseId={courseId}
                            />
                        )
                    })}
                </AnimatePresence>
                {hasNextPage && (
                    <div  className='flex justify-center my-5 '>
                        <button
                            disabled={!hasNextPage || isFetchingNextPage}
                            onClick={fetchNextPage}
                            className="w-[120px] h-[40px] rounded-lg bg-blue-500 text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                        >
                            {isFetchingNextPage ? (
                                <SubmitLoading />
                            ) : (
                                "نظرات بیشتر"
                            )}
                        </button>
                    </div>
                )}
            </div>
        )
    )
}

export default memo(CommentList)