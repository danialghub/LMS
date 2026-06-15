import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { Check, Loader2, UserPlus} from 'lucide-react';
import { registerSchema } from '@/validators/authSchema';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthInput } from '@/components/index';


// کامپوننت پیشرفت مرحله
const SignupProgress = ({ currentStep, totalSteps }) => (
    <div className="flex items-center justify-center gap-1 mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => {
            const step = index + 1;
            const isActive = currentStep >= step;
            const isCompleted = currentStep > step;

            return (
                <React.Fragment key={step}>
                    <div
                        className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            transition-all duration-300
                            ${isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "bg-gray-100 text-gray-400"}
                        `}
                    >
                        {isCompleted ? <Check size={14} /> : step}
                    </div>

                    {step !== totalSteps && (
                        <div
                            className={`
                                h-0.5 w-12 transition-all duration-300
                                ${isCompleted ? "bg-blue-600" : "bg-gray-200"}
                            `}
                        />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

// چیدمان اصلی صفحه
const SignupLayout = ({ children }) => (
    <div
        dir='ltr'
        className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl min-h-[94vh] overflow-hidden">
                {children}
            </div>
        </div>
    </div>
);

// بخش تصویرسازی با استفاده از فایل PNG
const SignupIllustration = ({ role }) => {
    // برای مدرس از تصویر اختصاصی استفاده می‌کنیم
    const imageSrc = role === 'instructor'
        ? '/Auth/signup-instructor.webp'
        : '/Auth/signup-student.webp';

    const titles = {
        student: {
            title: "به جمع دانشجویان بپیوندید",
            desc: "دسترسی به هزاران دوره آموزشی"
        },
        instructor: {
            title: "مدرس شوید و درآمد داشته باشید",
            desc: "دانش خود را با دیگران به اشتراک بگذارید"
        }
    };

    const data = titles[role];

    return (
        <div
            className="flex-4 hidden lg:block relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
            {/* تصویر زمینه با افکت اوورلی */}
            <div className="absolute inset-0 flex justify-center items-center">
                <img
                    src={imageSrc}
                    alt={data.title}
                    className="w-full h-full object-cover"
                />

            </div>


        </div>
    );
};

// مرحله اول: اطلاعات پایه
const BasicInfoStep = ({ register, errors }) => (
    <div className="space-y-4">
        <AuthInput
            inputName="name"
            register={register}
            error={errors.name?.message}
            placeholder="نام و نام خانوادگی"
        />
        <AuthInput
            inputName="email"
            register={register}
            error={errors.email?.message}
            placeholder="ایمیل"
            type="email"
        />
        <AuthInput
            inputName="password"
            register={register}
            error={errors.password?.message}
            placeholder="رمز عبور"
            type="password"
        />
    </div>
);

// مرحله دوم: آواتار
const AvatarStep = ({ register, errors }) => (
    <div className="space-y-4">
        <AuthInput
            inputName="avatar"
            register={register}
            error={errors.avatar?.message}
            placeholder="عکس پروفایل"
            type="file"
        />
        <p className="text-xs text-gray-500">* می‌توانید بعداً نیز آپلود کنید</p>
    </div>
);

// مرحله سوم: اطلاعات مدرس
const InstructorInfoStep = ({ register, errors }) => (
    <div className="space-y-4">
        <AuthInput
            inputName="major"
            register={register}
            error={errors.instructorProfile?.major?.message}
            placeholder="تخصص اصلی"
        />
        <AuthInput
            inputName="bio"
            register={register}
            error={errors.instructorProfile?.bio?.message}
            placeholder="بیوگرافی"
            as="textarea"
            rows={3}
        />
    </div>
);

// کامپوننت اصلی
const SignUpPage = ({ role = "student" }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const { signUp, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const isStudent = role === "student";
    const totalSteps = isStudent ? 2 : 3;

    const {
        register,
        trigger,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        reValidateMode: "onChange"
    });

    const validateStep = async (step) => {
        const fields = {
            1: ["name", "email", "password"],
            2: ["avatar"],
            3: []
        };

        const fieldsToValidate = fields[step];
        if (fieldsToValidate?.length) {
            return await trigger(fieldsToValidate);
        }
        return true;
    };

    const nextStep = async (e) => {
        e.preventDefault();
        if (await validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = (e) => {
        e.preventDefault();
        setCurrentStep(prev => prev - 1);
    };

    const prepareFormData = (data) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("role", role);

        if (data.avatar?.[0]) {
            formData.append("image", data.avatar[0]);
        }

        if (!isStudent && data.instructorProfile) {
            const { major, bio } = data.instructorProfile;
            if (major || bio) {
                formData.append("instructorProfile", JSON.stringify({ major, bio }));
            }
        }

        return formData;
    };

    const onSubmit = async (data) => {
        if (currentStep !== totalSteps) return;

        const formData = prepareFormData(data);
        const result = await signUp(formData);

        if (result) {
            navigate(`/login/${role}`);
        }
    };

    const handleFormSubmit = (e) => {
        if (currentStep === totalSteps) {
            handleSubmit(onSubmit)(e);
        } else {
            e.preventDefault();
        }
    };

    const renderStep = () => {
        const stepProps = { register, errors };

        switch (currentStep) {
            case 1: return <BasicInfoStep {...stepProps} />;
            case 2: return <AvatarStep {...stepProps} />;
            case 3: return !isStudent && <InstructorInfoStep {...stepProps} />;
            default: return null;
        }
    };

    const getButtonText = () => {
        if (isSubmitting) return "در حال ثبت نام...";
        return isStudent ? "ثبت نام دانشجو" : "ثبت نام مدرس";
    };

    return (
        <SignupLayout>
            <div className="flex h-full">
                <SignupIllustration role={role} />

                <div className="flex-5 p-6 md:p-8 col-span-2">
                    {/* هدر */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3">
                            <UserPlus size={24} />
                        </div>
                        <h1 className="text-2xl font-bold">ثبت نام</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {isStudent ? "شروع یادگیری" : "شروع تدریس"}
                        </p>
                    </div>

                    {/* پیشرفت */}
                    <SignupProgress currentStep={currentStep} totalSteps={totalSteps} />

                    {/* فرم با ارتفاع ثابت */}
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                        {/* کانتینر با min-height ثابت برای جلوگیری از تغییر ارتفاع */}
                        <div className="animate-fadeIn min-h-[280px]">
                            {renderStep()}
                        </div>

                        {/* دکمه‌ها */}
                        <div className="flex gap-3 pt-2">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    قبلی
                                </button>
                            )}

                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                                >
                                    بعدی
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 size={18} className="animate-spin" />
                                            {getButtonText()}
                                        </span>
                                    ) : (
                                        getButtonText()
                                    )}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* لینک ورود */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            قبلاً ثبت نام کرده‌اید؟{" "}
                            <Link
                                to={`/login/${role}`}
                                className="text-blue-600 font-medium hover:underline"
                            >
                                وارد شوید
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </SignupLayout>
    );
};

export default SignUpPage;