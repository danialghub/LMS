import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CheckCircle, XCircle, AlertCircle, Clock, CreditCard, DollarSign, Hash, ArrowLeft, HelpCircle, RefreshCw, Phone, Mail } from 'lucide-react';

const TransactionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [courseId, setCourseId] = useState(null);

  // دیکشنری کامل خطاهای زرین‌پال
  const errorMessages = {
    '-1': {
      title: 'خطای داخلی',
      message: 'خطای داخلی در پرداختگاه زرین‌پال رخ داده است',
      suggestion: 'لطفاً چند دقیقه دیگر مجدداً تلاش کنید',
      solution: 'در صورت تکرار خطا، با پشتیبانی تماس بگیرید',
      type: 'system'
    },
    '-2': {
      title: 'خطا در ارسال داده‌ها',
      message: 'داده‌های ارسالی به درگاه پرداخت معتبر نیست',
      suggestion: 'لطفاً مجدداً از صفحه پرداخت اقدام کنید',
      solution: 'اطلاعات دوره و مبلغ را بررسی کنید',
      type: 'validation'
    },
    '-3': {
      title: 'پذیرنده نامعتبر',
      message: 'پذیرنده در سیستم زرین‌پال ثبت نشده است',
      suggestion: 'مشکل از سامانه آموزشی می‌باشد',
      solution: 'لطفاً با پشتیبانی تماس بگیرید',
      type: 'configuration'
    },
    '-4': {
      title: 'پایان یافتن زمان مجاز',
      message: 'زمان مجاز برای انجام تراکنش به پایان رسیده است',
      suggestion: 'لطفاً مجدداً اقدام به ثبت سفارش کنید',
      solution: 'عملیات پرداخت را از ابتدا شروع کنید',
      type: 'timeout'
    },
    '-5': {
      title: 'خطای وریفای',
      message: 'مشکل در تایید تراکنش',
      suggestion: 'لطفاً از صحت اطلاعات کارت خود اطمینان حاصل کنید',
      solution: 'در صورت نیاز با بانک خود تماس بگیرید',
      type: 'verification'
    },
    '-6': {
      title: 'عدم پوشش تراکنش',
      message: 'تراکنش توسط بانک صادرکننده کارت پوشش داده نمی‌شود',
      suggestion: 'از کارت بانکی دیگر استفاده کنید',
      solution: 'با بانک خود در مورد محدودیت‌های خرید اینترنتی مشورت کنید',
      type: 'bank'
    },
    '-7': {
      title: 'لغو تراکنش توسط کاربر',
      message: 'شما عملیات پرداخت را لغو کردید',
      suggestion: 'در صورت تمایل مجدداً تلاش کنید',
      solution: 'در ادامه فرآیند را کامل کنید',
      type: 'user_cancel'
    },
    '-8': {
      title: 'آدرس آی‌پی نامعتبر',
      message: 'آدرس آی‌پی درخواست کننده معتبر نمی‌باشد',
      suggestion: 'از اتصال اینترنت پایدار استفاده کنید',
      solution: 'VPN یا پروکسی خود را غیرفعال کنید',
      type: 'security'
    },
    '-9': {
      title: 'مبلغ تراکنش نامعتبر',
      message: 'مبلغ وارد شده برای تراکنش معتبر نمی‌باشد',
      suggestion: 'لطفاً مبلغ را بررسی کنید',
      solution: 'در صورت صحت مبلغ، با پشتیبانی تماس بگیرید',
      type: 'validation'
    },
    '-10': {
      title: 'تراکنش نامعتبر',
      message: 'تراکنش مورد نظر در سیستم وجود ندارد',
      suggestion: 'لطفاً مجدداً از طریق سایت اقدام به خرید کنید',
      solution: 'از صحت لینک پرداخت اطمینان حاصل کنید',
      type: 'not_found'
    },
    '-11': {
      title: 'خطای وریفای',
      message: 'مشکل در فرآیند تایید نهایی تراکنش',
      suggestion: 'لطفاً وضعیت تراکنش را در حساب کاربری بررسی کنید',
      solution: 'در صورت کسر وجه، خودکار ظرف 72 ساعت برگشت می‌خورد',
      type: 'system'
    },
    '-12': {
      title: 'کارت بانکی مسدود',
      message: 'کارت بانکی شما قادر به انجام تراکنش نمی‌باشد',
      suggestion: 'از کارت بانکی دیگر استفاده کنید',
      solution: 'با بانک خود برای رفع مشکل تماس بگیرید',
      type: 'bank'
    },
    '-13': {
      title: 'رمز پویا نامعتبر',
      message: 'رمز پویای وارد شده صحیح نمی‌باشد',
      suggestion: 'رمز جدیدی از بانک خود دریافت کنید',
      solution: 'حتماً از رمز یکبار مصرف استفاده کنید',
      type: 'bank'
    },
    '-50': {
      title: 'عدم تطابق مبلغ',
      message: 'مبلغ تراکنش با مبلغ درخواستی مطابقت ندارد',
      suggestion: 'لطفاً مجدداً از صحت مبلغ اطمینان حاصل کنید',
      solution: 'در صورت تکرار خطا، با پشتیبانی تماس بگیرید',
      type: 'validation'
    },
    '-51': {
      title: 'تراکنش تکراری',
      message: 'این تراکنش قبلاً با موفقیت انجام شده است',
      suggestion: 'لطفاً از تکراری بودن پرداخت خودداری کنید',
      solution: 'در صورت کسر دوباره وجه، به پشتیبانی اطلاع دهید',
      type: 'duplicate'
    },
    '-52': {
      title: 'عدم موجودی کافی',
      message: 'موجودی کارت بانکی شما کافی نمی‌باشد',
      suggestion: 'مبلغ مورد نیاز را به کارت خود انتقال دهید',
      solution: 'از کارت دیگری با موجودی کافی استفاده کنید',
      type: 'bank'
    },
    '-53': {
      title: 'سقف مجاز روزانه رد شده',
      message: 'مبلغ تراکنش از سقف مجاز روزانه بیشتر است',
      suggestion: 'با بانک خود برای افزایش سقف تراکنش تماس بگیرید',
      solution: 'از کارت دیگری با سقف بالاتر استفاده کنید',
      type: 'bank'
    },
    '-54': {
      title: 'سقف مجاز ماهانه رد شده',
      message: 'مبلغ تراکنش از سقف مجاز ماهانه بیشتر است',
      suggestion: 'با بانک خود برای افزایش سقف تراکنش تماس بگیرید',
      solution: 'از کارت دیگری استفاده کنید یا ماه آینده اقدام کنید',
      type: 'bank'
    }
  };

  // تابع دریافت پیام خطا
  const getErrorMessage = (errorCode) => {
    if (!errorCode) return null;

    const error = errorMessages[errorCode];
    if (!error) {
      return {
        title: 'خطای ناشناخته',
        message: `خطا با کد ${errorCode} رخ داده است`,
        suggestion: 'لطفاً اطلاعات خطا را با پشتیبانی به اشتراک بگذارید',
        solution: 'در اسرع وقت مشکل بررسی خواهد شد',
        type: 'unknown'
      };
    }
    return error;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const refId = params.get('ref_id');
    const amount = params.get('amount');
    const errorCode = params.get('code');
    const cardNumber = params.get('card_number') || '**** **** **** 1234';
    const cardHash = params.get('card_hash');
    const paymentDate = params.get('payment_date') || new Date().toLocaleString('fa-IR');
    const courseIdParam = params.get('cId');
    const message = params.get('message');

    setCourseId(courseIdParam);

    switch (status) {
      case 'success':
        setResult({
          success: true,
          message: 'پرداخت با موفقیت انجام شد',
          subtitle: 'دوره آموزشی شما فعال شد',
          refId: refId,
          cardNumber: cardNumber,
          cardHash: cardHash,
          amount: amount,
          paymentDate: paymentDate,
          icon: CheckCircle,
          color: '#10b981',
          gradient: 'from-emerald-500 to-teal-600'
        });
        break;

      case 'already_verified':
        setResult({
          success: false,
          message: 'تراکنش قبلاً تایید شده است',
          subtitle: 'این پرداخت قبلاً در سیستم ثبت شده',
          refId: refId,
          amount: amount,
          isWarning: true,
          icon: AlertCircle,
          color: '#f59e0b',
          gradient: 'from-amber-500 to-orange-600'
        });
        break;

      case 'failed':
        const error = getErrorMessage(errorCode);

        if (error) {
          setResult({
            success: false,
            message: error.title,
            subtitle: error.message,
            suggestion: error.suggestion,
            solution: error.solution,
            errorType: error.type,
            errorCode: errorCode,
            refId: refId,
            amount: amount,
            rawMessage: message,
            icon: XCircle,
            color: '#ef4444',
            gradient: 'from-red-500 to-rose-600'
          });
        } else {
          setResult({
            success: false,
            message: message || 'پرداخت ناموفق بود',
            subtitle: 'مشکلی در انجام تراکنش پیش آمده است',
            suggestion: 'لطفاً مجدداً تلاش کنید',
            solution: 'در صورت تکرار خطا با پشتیبانی تماس بگیرید',
            errorCode: errorCode || 'unknown',
            refId: refId,
            amount: amount,
            icon: XCircle,
            color: '#ef4444',
            gradient: 'from-red-500 to-rose-600'
          });
        }
        break;

      default:
        setResult({
          success: false,
          message: 'وضعیت نامشخص',
          subtitle: 'پاسخ دریافتی از درگاه پرداخت معتبر نیست',
          suggestion: 'لطفاً دوباره تلاش کنید',
          solution: 'در صورت تکرار مشکل، با پشتیبانی تماس بگیرید',
          icon: XCircle,
          color: '#ef4444',
          gradient: 'from-red-500 to-rose-600'
        });
    }
  }, [location]);

  // تایمر برای شمارنده و انتقال خودکار
  useEffect(() => {
    if (result && result.success && courseId) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate(`/course/${courseId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [result, courseId, navigate]);

  // تابع کپی کردن کد رهگیری
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // می‌توانید یک نوتیفیکیشن اضافه کنید
    alert('کد رهگیری کپی شد');
  };

  if (!result) {
    return (
      <div className="overflow-hidden font-vazir min-h-screen bg-gradient-to-br from-blue-600 via-sky-700 to-indigo-800 flex items-center justify-center p-5">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white mt-6 text-lg font-medium">در حال بررسی اطلاعات پرداخت...</p>
        </div>
      </div>
    );
  }

  const IconComponent = result.icon;
  const isSuccess = result.success && !result.isWarning;
  const isUserCancel = result.errorCode === '-7';
  const showSupport = !isSuccess && (!result.errorType === 'user_cancel');

  return (
    <div className="overflow-hidden min-h-screen bg-gradient-to-br from-blue-600 via-sky-700 to-indigo-800 flex items-center justify-center p-5 font-sans">
      <div className="w-full max-w-lg animate-[slideUp_0.5s_ease-out]">
        <div
          className="bg-white rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl"
          style={{ '--accent-color': result.color }}
        >
          {/* Animated Background */}
          <div
            className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] opacity-5 animate-[spin_20s_linear_infinite]"
            style={{ background: `radial-gradient(circle, ${result.color} 0%, transparent 70%)` }}
          ></div>

          {/* Icon Section */}
          <div className="relative text-center mb-8">
            <div className="inline-block relative">
              <IconComponent size={80} color={result.color} strokeWidth={1.5} />
              {isSuccess && (
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full animate-ping"
                  style={{ backgroundColor: result.color, opacity: 0.2 }}
                ></div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl text-center text-gray-700 mb-2 font-heading">
              {result.message}
            </h1>
            <p className="text-center text-gray-500 mb-4">
              {result.subtitle}
            </p>

            {/* راهکار پیشنهادی برای خطاها */}
            {!isSuccess && result.suggestion && (
              <div className={`rounded-xl p-4 mb-6 ${result.errorType === 'bank' ? 'bg-blue-50' : 'bg-amber-50'}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {result.errorType === 'bank' ? (
                      <CreditCard size={18} className="text-blue-600" />
                    ) : (
                      <RefreshCw size={18} className="text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">راهکار پیشنهادی:</p>
                    <p className="text-gray-600 text-sm">{result.suggestion}</p>
                    {result.solution && (
                      <p className="text-gray-500 text-xs mt-2">{result.solution}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Success Details */}
            {isSuccess && (
              <div className="bg-gray-50 rounded-2xl p-5 mb-8 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <DollarSign size={20} style={{ color: result.color }} />
                  </div>
                  <span className="flex-1 text-gray-500 text-sm">مبلغ پرداختی:</span>
                  <span className="font-bold text-gray-800">
                    {Number(result.amount).toLocaleString()} تومان
                  </span>
                </div>

                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Hash size={20} style={{ color: result.color }} />
                  </div>
                  <span className="flex-1 text-gray-500 text-sm">کد رهگیری:</span>
                  <button
                    onClick={() => copyToClipboard(result.refId)}
                    className="font-mono font-bold hover:opacity-80 transition-opacity flex items-center gap-1"
                    style={{ color: result.color }}
                  >
                    {result.refId}
                    <span className="text-xs">(کپی)</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <CreditCard size={20} style={{ color: result.color }} />
                  </div>
                  <span className="flex-1 text-gray-500 text-sm">شماره کارت:</span>
                  <span className="font-mono font-bold text-gray-800">
                    {result.cardNumber}
                  </span>
                </div>

                {result.paymentDate && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Clock size={20} style={{ color: result.color }} />
                    </div>
                    <span className="flex-1 text-gray-500 text-sm">تاریخ پرداخت:</span>
                    <span className="text-gray-800 text-sm">
                      {result.paymentDate}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Error Details */}
            {!isSuccess && result.errorCode && result.errorCode !== 'unknown' && (
              <div className={`rounded-xl p-4 mb-8 ${result.errorType === 'bank' ? 'bg-red-50' : result.errorType === 'user_cancel' ? 'bg-gray-50' : 'bg-yellow-50'}`}>
                <div className="text-center">
                  <span className={`text-sm font-mono ${result.errorType === 'bank' ? 'text-red-600' : 'text-gray-600'}`}>
                    کد خطا: {result.errorCode}
                  </span>
                  {result.refId && (
                    <div className="text-xs text-gray-500 mt-1">
                      کد پیگیری: {result.refId}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Support Section برای خطاهای غیر از لغو توسط کاربر */}
            {!isSuccess && !isUserCancel && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <HelpCircle size={18} className="text-indigo-600" />
                  <span className="font-semibold text-gray-700">نیاز به کمک دارید؟</span>
                </div>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <button className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors text-right">
                    <Phone size={16} className="text-indigo-600" />
                    <span>تماس با پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸</span>
                  </button>
                  <button className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors text-right">
                    <Mail size={16} className="text-indigo-600" />
                    <span>ایمیل: support@yoursite.com</span>
                  </button>
                </div>
              </div>
            )}

            {/* Redirect Timer */}
            {isSuccess && courseId && (
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={18} className="text-gray-600" />
                  <span className="flex-1 text-gray-600 text-sm">
                    در حال انتقال به دوره آموزشی در {countdown} ثانیه...
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${(countdown / 5) * 100}%`,
                      backgroundColor: result.color
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 flex-col sm:flex-row font-Dirooz">
              {!isSuccess && !isUserCancel && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  تلاش مجدد
                </button>
              )}

              {isUserCancel && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  بازگشت و ادامه خرید
                </button>
              )}

              <button
                onClick={() => navigate('/')}
                className={`flex-1 px-6 py-3 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${isSuccess
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'border-2 hover:bg-opacity-10 transition-colors'
                  }`}
                style={!isSuccess ? { borderColor: result.color, color: result.color } : {}}
              >
                {isSuccess ? 'ورود به پنل کاربری' : 'بازگشت به صفحه اصلی'}
              </button>

              {isSuccess && courseId && (
                <button
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="flex-1 px-6 py-3 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{ backgroundColor: result.color, color: 'white' }}
                >
                  شروع یادگیری
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}

export default TransactionResult;