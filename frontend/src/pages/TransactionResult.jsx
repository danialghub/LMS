import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CheckCircle, XCircle, AlertCircle, Clock, CreditCard, DollarSign, Hash, ArrowLeft } from 'lucide-react';

function TransactionResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [courseId, setCourseId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const refId = params.get('ref_id');
    const amount = params.get('amount');
    const errorCode = params.get('code')  ;
    const cardNumber = params.get('card_number') || '**** **** **** 1234';
    const courseIdParam = params.get('cId');

    setCourseId(courseIdParam);

    switch (status) {
      case 'success':
        setResult({
          success: true,
          message: 'پرداخت با موفقیت انجام شد',
          subtitle: 'دوره آموزشی شما فعال شد',
          refId: refId,
          cardNumber: cardNumber,
          amount: amount,
          icon: CheckCircle,
          color: '#10b981'
        });
        break;
      case 'already_verified':
        setResult({
          success: false,
          message: 'تراکنش قبلاً تایید شده است',
          subtitle: 'این پرداخت قبلاً ثبت شده',
          isWarning: true,
          icon: AlertCircle,
          color: '#f59e0b'
        });
        break;
      case 'failed':
        let errorMessage = 'پرداخت ناموفق بود';
        let errorSubtitle = 'مشکلی در انجام تراکنش پیش آمده';
        if (errorCode === '-50') {
          errorMessage = 'خطا در تایید مبلغ تراکنش';
          errorSubtitle = 'لطفاً با پشتیبانی تماس بگیرید';
        } else if (errorCode === '-51') {
          errorMessage = 'تراکنش قبلاً تایید شده است';
          errorSubtitle = 'این پرداخت تکراری می‌باشد';
        }
        setResult({
          success: false,
          message: errorMessage,
          subtitle: errorSubtitle,
          errorCode: errorCode,
          icon: XCircle,
          color: '#ef4444'
        });
        break;
      default:
        setResult({
          success: false,
          message: 'خطای ناشناخته',
          subtitle: 'لطفاً دوباره تلاش کنید',
          icon: XCircle,
          color: '#ef4444'
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
            <h1 className="text-3xl md:text-4xl  text-center text-gray-700 mb-2 font-heading">
              {result.message}
            </h1>
            <p className="text-center text-gray-500 mb-8">
              {result.subtitle}
            </p>

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
                  <span className="font-mono font-bold" style={{ color: result.color }}>
                    {result.refId}
                  </span>
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
              </div>
            )}

            {/* Error Code */}
            {result.errorCode !== null && (
              <div className="bg-red-50 rounded-xl p-4 mb-8 text-center">
                <span className="text-red-600 text-sm">کد خطا: {result.errorCode}</span>
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
              {!isSuccess && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  بازگشت و تلاش مجدد
                </button>
              )}

              <button
                onClick={() => navigate('/')}
                className={`flex-1 px-6 py-3 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${isSuccess
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'border-2 hover:text-white transition-colors'
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