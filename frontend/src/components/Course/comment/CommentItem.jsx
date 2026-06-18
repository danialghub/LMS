import { useAuthStore } from '@/store/useAuthStore'

import {
    ThumbsUp,
    ThumbsDown,
    Reply,
    Edit2,
    Trash2,
    CheckCircle,
    MoreVertical,
    User,
    Calendar,
    ChevronDown,
    ChevronUp,
    Send,
    Trash
} from 'lucide-react';
import { formatTime } from "@/lib/helper";
import {
    useApproveCommentMutation, useDeleteCommentMutation,
    useDisLikeCommentMutation, useLikeCommentMutation
} from '@/query/commentQueries'
import { motion } from 'framer-motion'
import { memo } from 'react';


const CommentItem = ({
    comment, depth = 0, replyTo, setReplyTo, replyText, setReplyText, submitting,
    canModerate, expandedReplies, canComment, toggleReplies, handleSubmitReply, courseId
}) => {

    const { authUser } = useAuthStore()
    const isAuthor = authUser && comment.userId._id === authUser._id;
    const userReaction = comment.reactions?.find(r => r.userId === authUser?._id);
    const hasReplies = comment.replies && comment.replies.length > 0;


    const isExpanded = expandedReplies.has(comment._id);

    const { mutateAsync: approveComment, isPending: isApproving } = useApproveCommentMutation()
    const { mutateAsync: deleteComment, isPending: isDeletting } = useDeleteCommentMutation()
    const { mutateAsync: likeComment, isPending: isLiking } = useLikeCommentMutation()
    const { mutateAsync: disLikeComment, isPending: isDisLiking } = useDisLikeCommentMutation()


    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('آیا از حذف این نظر مطمئن هستید؟')) return;

        await deleteComment({ courseId, commentId })
    };

    const handleApproveComment = async (commentId) => {
        await approveComment({ courseId, commentId })
    };

    const getStatusBadge = (status) => {
        if (status === 'approved') {
            return <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400">تایید شده</span>;
        }
        return <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">در انتظار تایید</span>;
    };

    const handleReaction = async (commentId, type) => {
        if (type === "like") {

            await likeComment({ courseId, commentId })
        } else {
            await disLikeComment({ courseId, commentId })
        }
    };

    return (
        <motion.div
            className={`relative ${depth > 0 ? 'mr-4 sm:mr-8 mt-3 sm:mt-4' : 'mt-4 sm:mt-6'}`}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            layout="position"
        >
            {depth > 0 && (
                <div className="absolute right-[-1rem] sm:right-[-1.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 to-transparent" />
            )}

            <div className={`rounded-xl sm:rounded-2xl border p-3 sm:p-5 transition-all duration-300 ${comment.status === 'pending'
                ? 'bg-yellow-50/30 border-yellow-200 dark:bg-yellow-950/10 dark:border-yellow-800/30'
                : 'bg-white border-zinc-200 dark:bg-[#121826] dark:border-[#1b2538]'
                }`}>
                {/* هدر کامنت */}
                <div className="flex  items-start justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                        {comment.userId?.avatar ? (
                            <img src={comment.userId.avatar} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-cover" />
                        ) : (
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <User size={16} className="sm:size-5 text-white" />
                            </div>
                        )}

                        <div>
                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                <h4 className="font-bold text-sm sm:text-base text-zinc-800 dark:text-white">
                                    {comment.userId._id === authUser?._id
                                        ? "شما"
                                        : comment.userId?.name
                                    }
                                </h4>
                                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#1b2538] text-zinc-600 dark:text-zinc-400">
                                    {comment.userId?.role === 'instructor' ? 'مدرس' : 'دانشجو'}
                                </span>
                                {canModerate && getStatusBadge(comment.status)}
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-zinc-500 dark:text-gray-400">
                                <span className="flex items-center gap-0.5 sm:gap-1">
                                    <Calendar size={10} className="sm:size-3" />
                                    {formatTime(comment.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* منوی عملیات */}
                    {(isAuthor || canModerate) && (
                        <div className="relative group self-end sm:self-auto">
                            <div className="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d111c] border border-zinc-200 dark:border-[#1a2233] rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[130px] sm:min-w-[150px]">
                                {canModerate && comment.status === 'pending' && (
                                    <button
                                        disabled={isApproving}
                                        onClick={() => handleApproveComment(comment._id)}
                                        className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-right text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 dark:disabled:text-green-600/60 flex items-center gap-2 cursor-pointer text-sm sm:text-base"
                                    >
                                        <CheckCircle size={12} className="size-6" /> تایید
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    disabled={isDeletting}
                                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-right text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 cursor-pointer dark:disabled:text-red-600/60 text-sm sm:text-base"
                                >
                                    <Trash size={12} className="sm:size-6" /> حذف
                                </button>
                            </div>
                            <button className="p-1.5 sm:p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1b2538] transition-all">
                                <MoreVertical size={14} className="sm:size-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* محتوای کامنت */}
                <p className="mt-4 sm:mt-4 text-sm sm:text-base text-zinc-700 dark:text-gray-300  leading-relaxed whitespace-pre-wrap break-words">
                    {comment.content}
                </p>

                {/* اکشن‌های کامنت */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-zinc-100 dark:border-[#1b2538]">
                    {comment.status !== "pending" && (canComment || canModerate) && (
                        <>
                            <button
                                disabled={isLiking}
                                onClick={() => handleReaction(comment._id, 'like')}
                                className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm transition-all ${comment?.likes?.includes(authUser?._id)
                                    ? 'text-blue-500'
                                    : 'text-zinc-500 hover:text-blue-500 dark:text-gray-400'
                                    }`}
                            >

                                <ThumbsUp
                                    size={14}
                                    className="sm:size-4"

                                />
                                <span>{comment?.likes?.length || 0}</span>
                            </button>

                            <button
                                disabled={isDisLiking}
                                onClick={() => handleReaction(comment._id, 'dislike')}
                                className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm transition-all ${comment?.dislikes?.includes(authUser?._id)
                                    ? 'text-red-500'
                                    : 'text-zinc-500 hover:text-red-500 dark:text-gray-400'
                                    }`}
                            >
                                <ThumbsDown
                                    size={14}
                                    className="sm:size-4"

                                />
                                <span>{comment?.dislikes?.length || 0}</span>
                            </button>
                        </>
                    )}

                    {comment.status !== "pending" && (canComment || canModerate) && !comment.parentId && (
                        <button
                            onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                            className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-zinc-500 hover:text-blue-500 dark:text-gray-400 transition-all"
                        >
                            <Reply size={14} className="sm:size-4" />
                            <span>پاسخ</span>
                        </button>
                    )}

                    {hasReplies && (
                        <button
                            onClick={() => toggleReplies(comment._id)}
                            className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-zinc-500 hover:text-blue-500 dark:text-gray-400 transition-all"
                        >
                            {isExpanded ? <ChevronUp size={14} className="sm:size-4" /> : <ChevronDown size={14} className="sm:size-4" />}
                            <span>{comment.replies.length} پاسخ</span>
                        </button>
                    )}
                </div>

                {/* فرم پاسخ */}
                {replyTo === comment._id && (
                    <div className="mt-3 sm:mt-4">
                        <div className="flex  flex-col sm:flex-row  sm:items-center gap-2 sm:gap-3">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="پاسخ خود را بنویسید..."
                                className="flex-1 p-2.5 sm:p-3 rounded-md border border-zinc-200 dark:border-[#1b2538] bg-white dark:bg-[#0d111c] focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm sm:text-base"
                                rows="2"
                            />
                            <button
                                onClick={handleSubmitReply}
                                disabled={submitting || !replyText.trim()}
                                className="px-3 sm:px-4 max-sm:w-[50px] py-2 sm:py-2.5 bg-blue-500 text-white  rounded-md hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* نمایش پاسخ‌ها */}
                {hasReplies && isExpanded && (
                    <div className="mt-3 sm:mt-4">
                        {comment.replies.map((reply) => {
                            return (reply.status !== "pending" || canModerate || canComment) && (
                                <CommentItem
                                    key={reply._id}
                                    comment={reply}
                                    depth={depth + 1}
                                    replyTo={replyTo}
                                    canModerate={canModerate}
                                    expandedReplies={expandedReplies}
                                    canComment={canComment}
                                    toggleReplies={toggleReplies}
                                    handleSubmitReply={handleSubmitReply}
                                    replyText={replyText}
                                    setReplyText={setReplyText}
                                    submitting={submitting}
                                    setReplyTo={setReplyTo}
                                    courseId={courseId}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default memo(CommentItem)