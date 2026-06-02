import { ShieldAlert, ArrowRight, Home } from "lucide-react";

const UnAuthorized = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-xl">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8 md:p-10 text-center shadow-2xl">

                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                        <ShieldAlert className="h-10 w-10 text-red-500" />
                    </div>

                    <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1 text-sm text-red-400">
                        Error 403
                    </span>

                    <h1 className="mt-5 text-3xl font-bold text-white">
                        دسترسی غیرمجاز
                    </h1>

                    <p className="mt-4 leading-8 text-slate-400">
                        شما مجوز مشاهده این صفحه را ندارید. ممکن است این دوره،
                        آزمون یا بخش آموزشی فقط برای کاربران دارای سطح دسترسی
                        مشخص فعال باشد.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-slate-900 transition hover:bg-slate-200"
                        >
                            <ArrowRight size={18} />
                            بازگشت
                        </button>

                        <button
                            onClick={() => (window.location.href = "/dashboard")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800"
                        >
                            <Home size={18} />
                            داشبورد
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
export default UnAuthorized