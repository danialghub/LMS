import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { LogIn, Loader2, Mail, Lock } from 'lucide-react';
import { loginSchema } from '@/validators/authSchema';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthInput } from '@/components/index';
import {Helmet} from 'react-helmet-async'
// چیدمان اصلی صفحه (همون layout ساین آپ)
const LoginLayout = ({ children }) => (
    <div dir='ltr' className="min-h-screen  bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl lg:min-h-[94vh]  overflow-hidden max-sm:mt-10">
                {children}
            </div>
        </div>
    </div>
);

// بخش تصویرسازی (همون استایل ساین آپ)
const LoginIllustration = ({ role }) => {
    const imageSrc = role === 'instructor'
        ? '/Auth/login-instructor.webp'
        : '/Auth/login-student.webp';

    const titles = {
        student: {
            title: "به جمع دانشجویان خوش آمدید",
            desc: "به دوره‌های آموزشی خود دسترسی پیدا کنید"
        },
        instructor: {
            title: "به پنل مدرسان خوش آمدید",
            desc: "دوره‌های خود را مدیریت کنید"
        }
    };

    const data = titles[role];

    return (
        <div className="flex-4 hidden lg:block relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
            <div className="absolute inset-0 flex justify-center items-center ">
                <img
                    src={imageSrc}
                    alt={data.title}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

// کامپوننت اصلی لاگین
const LoginPage = ({ role = "student" }) => {
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const isInstructor = role === "instructor";
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('role', role);

        const result = await login(formData);
        if (result?.success) {
            if (isInstructor) {
                navigate(`/instructor/courses`);
            } else {
                navigate(`/student/my-courses`);
            }

        }
    };

    const roleTitle =
        role === "student"
            ? "دانشجو"
            : role === "instructor"
                ? "مدرس"
                : "کاربر";

    return (
        <>
            <Helmet>
                <title>{`ورود ${roleTitle} | مغز افزار`}</title>

                <meta
                    name="description"
                    content={`برای دسترسی به حساب کاربری ${roleTitle} خود در مغز افزار وارد شوید و از امکانات آموزشی پلتفرم استفاده کنید.`}
                    data-rh="true"
                />

                <meta
                    property="og:title"
                    content={`ورود ${roleTitle} | مغز افزار`}
                />

                <meta
                    property="og:description"
                    content={`ورود به پنل ${roleTitle} در سامانه آموزشی مغز افزار.`}
                />

                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <LoginLayout>
                <div className="flex h-full ">
                    <LoginIllustration role={role} />

                    <div className="flex-5 p-6 md:p-8 col-span-2 ">
                        {/* هدر */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mb-4">
                                <LogIn size={28} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">ورود به حساب کاربری</h1>
                            <p className="text-gray-500 text-sm mt-2">
                                {isInstructor ? "به پنل مدرسان خوش آمدید" : "به جمع دانشجویان بپیوندید"}
                            </p>
                        </div>

                        {/* فرم */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-x-3 lg:space-y-7 lg:min-h-[380px]">
                            {/* فیلد ایمیل */}
                            <div>

                                <AuthInput
                                    inputName="email"
                                    register={register}
                                    error={errors.email?.message}
                                    placeholder="example@gmail.com"
                                    type="email"
                                />
                            </div>

                            {/* فیلد رمز عبور */}
                            <div>

                                <AuthInput
                                    inputName="password"
                                    register={register}
                                    error={errors.password?.message}
                                    placeholder="••••••••"
                                    type="password"
                                />
                            </div>

                            {/* دکمه ورود */}
                            <button
                                type='submit'
                                className="w-full px-4 py-3 mt-4 lg:mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                                disabled={isSubmitting || !isValid}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 size={18} className="animate-spin" />
                                        در حال ورود...
                                    </span>
                                ) : (
                                    isInstructor ? "ورود به عنوان مدرس" : "ورود به عنوان دانشجو"
                                )}
                            </button>
                        </form>

                        {/* لینک ثبت نام */}
                        <div className=" lg:mt-8 text-center pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                حساب کاربری ندارید؟{' '}
                                <Link
                                    to={`/sign-up/${role}`}
                                    className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition-colors"
                                >
                                    ثبت نام کنید
                                </Link>
                            </p>
                        </div>


                    </div>
                </div>
            </LoginLayout>
        </>
    );
};

export default LoginPage;