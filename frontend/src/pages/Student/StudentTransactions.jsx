import {
    Calendar,
    DollarSign,
    CheckCircle,
    Clock,
    AlertCircle,
} from "lucide-react";

import { useStudentStore } from "@/store/useStudentStore";
import { useEffect, useState } from "react";
import { PageLoader, Pagination } from '@/components/index'
import { formatNumber, formatTime } from '@/lib/helper'
import { useGetStudentTransactions } from '@/query/courseQueries'


export default function TransactionsPage() {

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const {
        data,
        isLoading,
        isError,
        isFetching
    } = useGetStudentTransactions(page)


    const studentTransactions = data?.transactions || []
    const totalPagesInfo = data?.totalPages

    useEffect(() => {
        if (!totalPagesInfo) return
        setTotalPages(totalPagesInfo)
    }, [totalPagesInfo])

    const successfulTransactionCount = () => {
        const successFulTransaction = studentTransactions.filter(transaction => transaction.status === "successful")
        return successFulTransaction.length || 0
    }
    const failedTransactionCount = () => {
        const failedTransaction = studentTransactions.filter(transaction => transaction.status === "failed")
        return failedTransaction.length || 0
    }
    const calcTotalTransactionAmount = () => {
        const totalAmount = studentTransactions.reduce((sum, arg) => sum + arg.value, 0)
        return formatNumber(totalAmount)
    }


    // تابع برای نمایش وضعیت
    const getStatusIcon = (status) => {
        switch (status) {
            case "successful":
                return <CheckCircle size={16} />;
            case "progressing":
                return <Clock size={16} />;
            case "failed":
                return <AlertCircle size={16} />;
            default:
                return null;
        }
    };


    return (
        <div dir="rtl" className="min-h-screen bg-[#f3f3f3] p-6 flex-1 min-w-0">
            <div className="max-w-[1700px] mx-auto flex gap-8">
                {/* MAIN CONTENT */}
                <div className="flex-1 min-w-0 ">
                    {/* خلاصه آماری */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-center">
                            <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">

                                <div className=" bg-gradient-to-r from-sky-100 to-blue-50 rounded-2xl p-6 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{calcTotalTransactionAmount()}</div>
                                    <div className="text-sm text-gray-600 mt-1">مجموع مبلغ تراکنش ها</div>
                                </div>
                                <div className="col-span-1 bg-gradient-to-r from-green-100 to-emerald-50 rounded-2xl p-6 text-center">
                                    <div className="text-2xl font-bold text-green-600">{successfulTransactionCount()}</div>
                                    <div className="text-sm text-gray-600 mt-1">تراکنش‌های موفق</div>
                                </div>

                                <div className="col-span-1 bg-gradient-to-r from-red-50 to-rose-100 rounded-2xl p-6 text-center">
                                    <div className="text-2xl font-bold text-red-600">{failedTransactionCount()}</div>
                                    <div className="text-sm text-gray-600 mt-1">تراکنش های ناموفق</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TRANSACTIONS TABLE */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm mt-6 min-h-[90vh] relative">
                        <h2 className="text-3xl  text-black/80 font-heading mb-6 text-right">لیست تراکنش‌ها</h2>

                        {isLoading
                            ? <PageLoader />
                            : studentTransactions.length
                                ? (
                                    <div>
                                        {/* Table Header */}
                                        <div className="grid grid-cols-6 gap-4 py-4 border-b-2 border-gray-200 mb-2 text-right">
                                            <div className="col-span-2 text-gray-600 font-semibold">شناسه / شرح تراکنش</div>
                                            <div className="text-gray-600 font-semibold">تاریخ</div>
                                            <div className="text-gray-600 font-semibold">مبلغ</div>
                                            <div className="text-gray-600 font-semibold">وضعیت</div>

                                        </div>

                                        {/* Table Rows */}
                                        <div className="space-y-3">
                                            {studentTransactions.map((transaction, idx) => (
                                                <div
                                                    key={idx}
                                                    className="grid grid-cols-6 gap-4 py-4 border-b border-gray-100 items-center text-right hover:bg-gray-50 transition-colors rounded-lg"
                                                >
                                                    {/* شناسه و شرح */}
                                                    <div className="col-span-2">
                                                        <div className="font-medium text-gray-800">#{idx + 1}</div>
                                                        <div className="text-sm text-gray-500 mt-1">{transaction.courseId.courseTitle}</div>
                                                    </div>

                                                    {/* تاریخ */}
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Calendar size={16} className="text-gray-400" />
                                                        <span>{formatTime(transaction.createdAt)}</span>
                                                    </div>

                                                    {/* مبلغ */}
                                                    <div className="flex items-center gap-2 text-gray-700 font-medium">

                                                        <span>{formatNumber(transaction.value)}</span>
                                                        <span className="text-xs text-gray-400">تومان</span>
                                                    </div>

                                                    {/* وضعیت */}
                                                    <div>
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium  ${transaction.status === "failed" ? "text-red-600 bg-red-60" : "text-green-600 bg-green-50"}`}>
                                                            {getStatusIcon(transaction.status)}
                                                            {transaction.status}
                                                        </span>
                                                    </div>


                                                </div>
                                            ))}
                                        </div>

                                        <div className="absolute left-1/2 bottom-5">
                                            <Pagination
                                                currentPage={page}
                                                totalPages={totalPages}
                                                onPageChange={(newPage) => {
                                                    setPage(newPage)
                                                }}

                                            />
                                        </div>
                                    </div>
                                )
                                : <div className="text-3xl font-heading text-black/70 flex items-center justify-center ">
                                    تراکنش یافت نشد
                                </div>

                        }
                    </div>


                </div>

            </div>
        </div>
    );
}