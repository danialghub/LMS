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
import { useApproveCommentMutation } from '@/query/commentQueries'
import { motion } from 'framer-motion'


const CommentItem = ({
    comment, depth = 0, replyTo, setReplyTo, replyText, setReplyText, submitting,
    canModerate, expandedReplies, canComment, toggleReplies, handleSubmitReply, courseId
}) => {

    const { authUser } = useAuthStore()
    const isAuthor = authUser && comment.userId._id === authUser._id;
    const userReaction = comment.reactions?.find(r => r.userId === authUser?._id);
    const hasReplies = comment.replies && comment.replies.length > 0;


    const isExpanded = expandedReplies.has(comment._id);


    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('آیا از حذف این نظر مطمئن هستید؟')) return;

        if (useDummyData) {
            setComments(prev => prev.filter(comment => {
                if (comment._id === commentId) return false;
                if (comment.replies) {
                    comment.replies = comment.replies.filter(reply => reply._id !== commentId);
                }
                return true;
            }));
        } else {
            try {
                const response = await fetch(`/api/courses/${courseId}/comments/${commentId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchComments();
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'approved') {
            return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400">تایید شده</span>;
        }
        return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">در انتظار تایید</span>;
    };

    const { mutateAsync: approveComment, isPending: isApproving } = useApproveCommentMutation()


    const handleApproveComment = async (commentId) => {


        await approveComment({ courseId, commentId })
    };


    return (
        <motion.div
            className={`relative ${depth > 0 ? 'mr-8 mt-4' : 'mt-6'}`}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            layout="position"
        >

            {depth > 0 && (
                <div className="absolute right-[-1.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 to-transparent" />
            )}

            <div className={`rounded-2xl border p-5 transition-all duration-300 ${comment.status === 'pending'
                ? 'bg-yellow-50/30 border-yellow-200 dark:bg-yellow-950/10 dark:border-yellow-800/30'
                : 'bg-white border-zinc-200 dark:bg-[#121826] dark:border-[#1b2538]'
                }`}>
                {/* هدر کامنت */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {comment.userId?.avatar ? (
                            <img src={comment.userId.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <User size={20} className="text-white" />
                            </div>
                        )}

                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-zinc-800 dark:text-white">
                                    {comment.userId._id === authUser._id
                                        ? "شما"
                                        : comment.userId?.name
                                    }
                                </h4>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#1b2538] text-zinc-600 dark:text-zinc-400">
                                    {comment.userId?.role === 'instructor' ? 'مدرس' : 'دانشجو'}
                                </span>
                                {canModerate && getStatusBadge(comment.status)}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {formatTime(comment.createdAt)}
                                </span>

                            </div>
                        </div>
                    </div>

                    {/* منوی عملیات */}
                    {(isAuthor || canModerate) && (
                        <div className="relative group">
                            <div className="absolute left-0 top-full mt-1 bg-white dark:bg-[#0d111c] border border-zinc-200 dark:border-[#1a2233] rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[150px]">

                                {canModerate && comment.status === 'pending' && (
                                    <button
                                        disabled={isApproving}
                                        onClick={() => handleApproveComment(comment._id)}
                                        className="w-full px-4 py-2 text-right text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20  dark:disabled:text-green-600/60 flex items-center gap-2 cursor-pointer"
                                    >
                                        <CheckCircle size={14} /> تایید
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="w-full px-4 py-2 text-right text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 cursor-pointer"
                                >
                                    <Trash size={14} /> حذف
                                </button>


                            </div>
                            <button
                                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1b2538] transition-all">

                                <MoreVertical size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* محتوای کامنت */}

                <p className="mt-4 text-zinc-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                </p>


                {/* اکشن‌های کامنت */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-100 dark:border-[#1b2538]">
                    {canComment && (
                        <>
                            <button
                                onClick={() => handleReaction(comment._id, 'like')}
                                className={`flex items-center gap-1.5 text-sm transition-all ${userReaction?.type === 'like'
                                    ? 'text-blue-500'
                                    : 'text-zinc-500 hover:text-blue-500 dark:text-gray-400'
                                    }`}
                            >
                                <ThumbsUp size={16} />
                                <span>{comment.likes?.length || 0}</span>
                            </button>

                            <button
                                onClick={() => handleReaction(comment._id, 'dislike')}
                                className={`flex items-center gap-1.5 text-sm transition-all ${userReaction?.type === 'dislike'
                                    ? 'text-red-500'
                                    : 'text-zinc-500 hover:text-red-500 dark:text-gray-400'
                                    }`}
                            >
                                <ThumbsDown size={16} />
                                <span>{comment.dislikes?.length || 0}</span>
                            </button>
                        </>
                    )}

                    {comment.status !== "pending" && (canComment || canModerate) && !comment.parentId && (
                        <button
                            onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-blue-500 dark:text-gray-400 transition-all"
                        >
                            <Reply size={16} />
                            <span>پاسخ</span>
                        </button>
                    )}


                    {hasReplies && (
                        <button
                            onClick={() => toggleReplies(comment._id)}
                            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-blue-500 dark:text-gray-400 transition-all"
                        >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            <span>{comment.replies.length} پاسخ</span>
                        </button>
                    )}
                </div>

                {/* فرم پاسخ */}
                {replyTo === comment._id && (
                    <div className="mt-4">
                        <div className="flex items-center gap-3">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="پاسخ خود را بنویسید..."
                                className="flex-1 p-3 rounded-xl border border-zinc-200 dark:border-[#1b2538] bg-white dark:bg-[#0d111c] focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                rows="2"

                            />
                            <button
                                onClick={handleSubmitReply}
                                disabled={submitting || !replyText.trim()}
                                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all disabled:opacity-50"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* نمایش پاسخ‌ها */}
                {hasReplies && isExpanded && (
                    <div className="mt-4">
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

export default CommentItem