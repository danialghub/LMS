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
    const [totalSuccessfulTransaction, setTotalSuccessfulTransaction] = useState(0)
    const [studentTransactions, setStudentTransactions] = useState([])
    const [totalFailedTransaction, setTotalFailedTransaction] = useState(0)

    const {
        data,
        isLoading,
        isError,
    } = useGetStudentTransactions(page)



    useEffect(() => {
        if (!data) return
        const studentTransactions = data?.transactions || []
        const totalPagesInfo = data?.totalPages
        const toatalFailedTransaction = data?.toatalFailedTransaction || 0
        const toatalSuccessfulransaction = data?.toatalSuccessfulransaction || 0
        setStudentTransactions(studentTransactions)
        setTotalPages(totalPagesInfo)
        setTotalFailedTransaction(toatalFailedTransaction)
        setTotalSuccessfulTransaction(toatalSuccessfulransaction)
    }, [data])


    const calcTotalTransactionAmount = () => {
        const successfulTransactions = studentTransactions.filter(t => t.status === "successful")
        const totalAmount = successfulTransactions.reduce((sum, arg) => sum + arg.amount, 0)
        return formatNumber(totalAmount)
    }


    // تابع برای نمایش وضعیت
    const getStatusIcon = (status) => {
        switch (status) {
            case "successful":
                return <CheckCircle size={16} />;
            case "pending":
                return <Clock size={16} />;
            case "failed":
                return <AlertCircle size={16} />;
            default:
                return null;
        }
    };

    // تابع برای نمایش متن وضعیت و رنگ
    const getStatusStyle = (status) => {
        switch (status) {
            case "successful":
                return {
                    text: "موفق",
                    colorClass: "text-green-600 bg-green-50"
                };
            case "pending":
                return {
                    text: "در انتظار",
                    colorClass: "text-yellow-600 bg-yellow-50"
                };
            case "failed":
                return {
                    text: "ناموفق",
                    colorClass: "text-red-600 bg-red-50"
                };
            default:
                return {
                    text: "نامشخص",
                    colorClass: "text-gray-600 bg-gray-50"
                };
        }
    };


    return (
        <div dir="rtl" className="min-h-screen flex-1 min-w-0">
            <div className="max-w-[1700px] mx-auto flex gap-4 md:gap-8 sm:px-4 md:px-6">
                {/* MAIN CONTENT */}
                <div className="flex-1 min-w-0">
                    {/* خلاصه آماری - Responsive Grid */}
                    <div className="pt-4 sm:pt-6 border-t border-gray-200">
                        <div className="flex justify-center">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-3xl">

                                <div className="bg-gradient-to-r from-sky-100 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{calcTotalTransactionAmount()}</div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">مجموع مبلغ تراکنش ها</div>
                                </div>

                                <div className="bg-gradient-to-r from-green-100 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                                    <div className="text-xl sm:text-2xl font-bold text-green-600">{totalSuccessfulTransaction}</div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">تراکنش‌های موفق</div>
                                </div>

                                <div className="bg-gradient-to-r from-red-50 to-rose-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                                    <div className="text-xl sm:text-2xl font-bold text-red-600">{totalFailedTransaction}</div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">تراکنش های ناموفق</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TRANSACTIONS TABLE */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm mt-4 sm:mt-6  min-h-[80vh] relative overflow-x-auto">
                        <h2 className="text-xl sm:text-2xl md:text-3xl text-black/80 font-heading mb-4 sm:mb-6 text-right px-1">لیست تراکنش‌ها</h2>



                        <div className="h-full flex flex-col justify-between">
                            {isLoading
                                ? <PageLoader />
                                : studentTransactions.length > 0
                                    ? (
                                        <div>
                                            {/* Table Header - Hidden on mobile, visible on tablet+ */}
                                            <div className="hidden md:grid grid-cols-12 gap-3 lg:gap-4 py-3 lg:py-4 border-b-2 border-gray-200 mb-2 text-right">
                                                <div className="col-span-4 text-gray-600 font-semibold text-sm lg:text-base">شناسه / شرح تراکنش</div>
                                                <div className="col-span-2 text-gray-600 font-semibold text-sm lg:text-base">تاریخ</div>
                                                <div className="col-span-2 text-gray-600 font-semibold text-sm lg:text-base">مبلغ</div>
                                                <div className="col-span-2 text-gray-600 font-semibold text-sm lg:text-base">وضعیت</div>
                                                <div className="col-span-2"></div>
                                            </div>

                                            {/* Mobile Card View - Visible only on mobile */}
                                            <div className="md:hidden space-y-3">
                                                {studentTransactions.map((transaction, idx) => {
                                                    const statusStyle = getStatusStyle(transaction.status);
                                                    return (
                                                        <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className="flex-1">
                                                                    <div className="font-bold text-gray-800">#{idx + 1}</div>
                                                                    <div className="text-sm text-gray-500 mt-1">{transaction.courseId.courseTitle}</div>
                                                                </div>
                                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.colorClass}`}>
                                                                    {getStatusIcon(transaction.status)}
                                                                    {statusStyle.text}
                                                                </span>
                                                            </div>

                                                            <div className="space-y-2 pt-2 border-t border-gray-200">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-gray-500 text-sm">تاریخ:</span>
                                                                    <div className="flex items-center gap-1 text-gray-700">
                                                                        <Calendar size={14} className="text-gray-400" />
                                                                        <span className="text-sm">{formatTime(transaction.createdAt)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-gray-500 text-sm">مبلغ:</span>
                                                                    <div className="flex items-center gap-1 text-gray-700 font-medium">
                                                                        <span>{formatNumber(transaction.amount)}</span>
                                                                        <span className="text-xs text-gray-400">تومان</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Desktop/Tablet Table View - Hidden on mobile */}
                                            <div className="hidden md:block">
                                                <div className="space-y-2">
                                                    {studentTransactions.map((transaction, idx) => {
                                                        const statusStyle = getStatusStyle(transaction.status);
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="grid grid-cols-12 gap-3 lg:gap-4 py-3 lg:py-4 px-2 border-b border-gray-100 items-center text-right hover:bg-gray-50 transition-colors rounded-lg"
                                                            >
                                                                {/* شناسه و شرح */}
                                                                <div className="col-span-4">
                                                                    <div className="font-medium text-gray-800 text-sm lg:text-base">#{idx + 1}</div>
                                                                    <div className="text-xs lg:text-sm text-gray-500 mt-1 truncate">{transaction.courseId.courseTitle}</div>
                                                                </div>

                                                                {/* تاریخ */}
                                                                <div className="col-span-2">
                                                                    <div className="flex items-center gap-1 lg:gap-2 text-gray-700 text-sm lg:text-base">
                                                                        <Calendar size={14} className="text-gray-400 lg:w-4 lg:h-4" />
                                                                        <span>{formatTime(transaction.createdAt)}</span>
                                                                    </div>
                                                                </div>

                                                                {/* مبلغ */}
                                                                <div className="col-span-2">
                                                                    <div className="flex items-center gap-1 lg:gap-2 text-gray-700 font-medium text-sm lg:text-base">
                                                                        <span>{formatNumber(transaction.amount)}</span>
                                                                        <span className="text-xs text-gray-400">تومان</span>
                                                                    </div>
                                                                </div>

                                                                {/* وضعیت */}
                                                                <div className="col-span-2">
                                                                    <span className={`inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${statusStyle.colorClass}`}>
                                                                        {getStatusIcon(transaction.status)}
                                                                        {statusStyle.text}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-xl sm:text-2xl md:text-3xl h-[50vh] sm:h-[60vh] md:h-[75vh] font-heading text-gray-700 flex items-center justify-center">
                                            تراکنشی یافت نشد
                                        </div>
                                    )
                            }


                            {/* Pagination - Responsive */}
                            <div className="mt-16 sm:mt-6">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={(newPage) => setPage(newPage)}
                                />
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
}