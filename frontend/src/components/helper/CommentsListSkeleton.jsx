const CommentSkeleton = ({ depth = 0 }) => {
    return (
        <div className={`relative ${depth > 0 ? 'mr-8 mt-4' : 'mt-6'} animate-pulse`}>
            {depth > 0 && (
                <div className="absolute right-[-1.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 to-transparent" />
            )}

            <div className="rounded-2xl border p-5 bg-white border-zinc-200 dark:bg-[#121826] dark:border-[#1b2538]">
                {/* هدر کامنت */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {/* آواتار اسکلتون */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />

                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* نام کاربر */}
                                <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded-md" />
                                {/* نقش کاربر */}
                                <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                {/* تاریخ */}
                                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        </div>
                    </div>

                    {/* منوی عملیات اسکلتون */}
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>

                {/* محتوای کامنت - خطوط متنی */}
                <div className="mt-4 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-9/12" />
                </div>

                {/* اکشن‌های کامنت */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-100 dark:border-[#1b2538]">
                    {/* دکمه لایک */}
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="w-5 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>

                    {/* دکمه دیسلایک */}
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="w-5 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>

                    {/* دکمه پاسخ */}
                    <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded" />

                    {/* دکمه نمایش پاسخ‌ها (اختیاری) */}
                    <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-auto" />
                </div>
            </div>
        </div>
    );
};

// اسکلتون برای لیست کامنت‌ها
const CommentsListSkeleton = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <CommentSkeleton key={index} depth={0} />
            ))}

            {/* یک کامنت با ریپلای اسکلتون */}
            <CommentSkeleton depth={0} />
            <div className="mr-8">
                <CommentSkeleton depth={1} />
            </div>
        </div>
    );
};

export default CommentsListSkeleton;