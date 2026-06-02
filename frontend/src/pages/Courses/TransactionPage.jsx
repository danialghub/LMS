import { useEffect, useState } from "react";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCourseStore } from "@/store/useCourseStore";
import { useTransactionStore } from "@/store/useTransactionStore"
import { formatPrice } from '@/lib/helper';
import { useNavigate, useParams } from "react-router";
import { cardSchema } from '@/validators/transactionSchema'

// اعتبارسنجی با yup


// تابع کمکی برای فرمت شماره کارت
const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, "");
    const groups = numbers.match(/(\d{1,4})/g) || [];
    return groups.join(" ").slice(0, 19);
};

// تابع کمکی برای اعتبارسنجی لحظه‌ای شماره کارت
const validateCardNumber = (value) => {
    const numbers = value.replace(/\s/g, "");
    return /^\d{16}$/.test(numbers);
};

const TransactionPage = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { courseId } = useParams();
    const { course, getCourseById } = useCourseStore();
    const { createTransaction } = useTransactionStore()
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, touchedFields },
        trigger,
    } = useForm({
        resolver: zodResolver(cardSchema),
        mode: "onChange",
        defaultValues: {
            cardNumber: "",
            expiryMonth: "",
            expiryYear: "",
            cvv2: "",
        },
    });

    const cardNumberValue = watch("cardNumber");
    const navigate = useNavigate()
    useEffect(() => {
        if (!courseId) return;
        getCourseById(courseId);
    }, [courseId, getCourseById]);

    // افکت برای فرمت شماره کارت
    useEffect(() => {
        if (cardNumberValue && !cardNumberValue.includes(" ")) {
            const formatted = formatCardNumber(cardNumberValue);
            if (formatted !== cardNumberValue) {
                setValue("cardNumber", formatted, { shouldValidate: true });
            }
        }
    }, [cardNumberValue, setValue]);

    const handleFormSubmit = async (data) => {
        setLoading(true);

            await createTransaction(course._id, {
                cardNumber: data.cardNumber.replace(/\s/g, ""),
                cvv2: data.cvv2,
                expireMonth: data.expiryMonth,
                expireYear: data.expiryYear
            })
            setTimeout(() =>
                navigate(`/course/${course._id}`)
                , 2000);
     
     
            setLoading(false);
        
    };

    const product = {
        title: course.courseTitle || "دوره آموزشی",
        price: formatPrice(course.coursePrice - (course.coursePrice * course.courseDiscount / 100)),
        thumbnail: course.courseThumbnail || "/placeholder-image.jpg",
    };

    // تابع کمکی برای نمایش خطا
    const renderError = (error) => {
        if (!error) return null;
        return (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {error.message}
            </p>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10 px-4 flex items-center justify-center font-sans" dir="rtl">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* سمت چپ: اطلاعات محصول */}
                <div className="md:w-1/2 bg-gray-900 text-white p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 border-r-4 border-blue-500 pr-3">جزئیات سفارش</h2>
                        <div className="rounded-2xl overflow-hidden shadow-xl mb-5">
                            <img
                                src={product.thumbnail}
                                alt="product thumbnail"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <div className="text-center md:text-right">
                            <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                            <div className="text-3xl font-bold text-blue-400 mt-3 font-Dirooz-FD">
                                {product.price}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-sm text-gray-400 border-t border-gray-700 pt-4 text-center">
                        <Lock className="inline-block w-4 h-4 ml-1" />
                        پرداخت امن
                    </div>
                </div>

                {/* سمت راست: فرم درگاه */}
                <div className="md:w-1/2 bg-white p-6 md:p-8">
                    {!success ? (
                        <>
                            <div className="flex items-center gap-2 mb-6">
                                <CreditCard className="text-blue-600 w-6 h-6" />
                                <h2 className="text-2xl font-bold text-gray-800">اطلاعات کارت بانکی</h2>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">
                                شماره کارت شبا و رمز دوم خود را وارد کنید (صرفاً برای شبیه‌سازی)
                            </p>

                            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 font-Dirooz-FD">
                                {/* شماره کارت */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">
                                        شماره کارت <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="۱۲۳۴ ۵۶۷۸ ۹۰۱۲ ۳۴۵۶"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition 
                      ${errors.cardNumber && touchedFields.cardNumber ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                        {...register("cardNumber")}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\s/g, "");
                                            if (rawValue.length <= 16) {
                                                const formatted = formatCardNumber(rawValue);
                                                setValue("cardNumber", formatted, { shouldValidate: true });
                                                trigger("cardNumber");
                                            }
                                        }}
                                    />
                                    {renderError(errors.cardNumber)}
                                    {touchedFields.cardNumber && !errors.cardNumber && validateCardNumber(cardNumberValue) && (
                                        <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 bg-green-500 rounded-full"></span>
                                            ✓ شماره کارت معتبر است
                                        </p>
                                    )}
                                </div>

                                {/* تاریخ انقضا و CVV */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-medium mb-1">
                                            ماه انقضا <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="MM"
                                            maxLength={2}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-center
                        ${errors.expiryMonth && touchedFields.expiryMonth ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                            {...register("expiryMonth")}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, "");
                                                if (parseInt(value) > 12 && value.length === 2) {
                                                    value = "12";
                                                }
                                                setValue("expiryMonth", value, { shouldValidate: true });
                                            }}
                                        />
                                        {renderError(errors.expiryMonth)}
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-medium mb-1">
                                            سال انقضا <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="YY"
                                            maxLength={2}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-center
                        ${errors.expiryYear && touchedFields.expiryYear ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                            {...register("expiryYear")}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                                                setValue("expiryYear", value, { shouldValidate: true });
                                            }}
                                        />
                                        {renderError(errors.expiryYear)}
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-medium mb-1">
                                            CVV2 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="***"
                                            maxLength={4}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-center
                        ${errors.cvv && touchedFields.cvv ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                            {...register("cvv2")}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                                                setValue("cvv2", value, { shouldValidate: true });
                                            }}
                                        />
                                        {renderError(errors.cvv2)}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 rounded-xl text-white font-bold text-lg transition flex justify-center items-center gap-2
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            در حال اتصال به بانک...
                                        </>
                                    ) : (
                                        "پرداخت مبلغ"
                                    )}
                                </button>
                            </form>

                           
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800">پرداخت موفق!</h3>
                            <p className="text-gray-600 mt-2">دوره شما فعال شد. از آموزش لذت ببرید.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionPage;