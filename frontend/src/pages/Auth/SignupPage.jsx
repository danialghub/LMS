import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/validators/authSchema'
import { Link, useNavigate } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore';
import { Logo, AuthInput } from '@/components/index'
import { ArrowLeft } from 'lucide-react'



const InstructorInfo = ({ register, errors }) => {
    const instructorBioError = errors.instructorProfile?.bio?.message
    const instructorMajorError = errors.instructorProfile?.major?.message

    return (
        <div>

            <Input inputName="major" register={register} error={instructorMajorError} />
            <Input inputName="bio" register={register} error={instructorBioError} />
        </div>
    )
}

const SignUpPage = ({ role = "student" }) => {

    const [logoStep, setLogoStep] = useState(false)

    const { signUp } = useAuthStore()

    const navigate = useNavigate()

    const isStudent = role === "student"

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data) => {

        if (!logoStep) {
            return setLogoStep(true)
        }

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('image', data.avatar[0]);
        formData.append('role', role)

        if (!isStudent) {
            const instructorProfile = {}
            if (data.instructorProfile?.major)
                instructorProfile['major'] = data.instructorProfile.major

            if (data.instructorProfile?.bio)
                instructorProfile['bio'] = data.instructorProfile.bio

            if (Object.keys(instructorProfile).length) {
                formData.append('instructorProfile', JSON.stringify(instructorProfile))
            }
        }

        const result = await signUp(formData)
        if (result) {
            navigate(`/${role}/login`)
        }
        setLogoStep(false)
    };



    const avatarError = errors.avatar?.message
    const nameError = errors.name?.message
    const emailError = errors.email?.message
    const passwordError = errors.password?.message



    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-sky-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl ">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center p-8 py-5">
                        <div className="flex items-center justify-center  mb-2">
                            <Link to='/'>
                                <Logo />
                            </Link>
                        </div>
                        <p className="text-indigo-100 mt-2">به خانواده آموزشی ما بپیوندید</p>

                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 py-6 relative">
                        {/* User Info */}
                        <div>
                            {logoStep
                                ? (
                                    <>
                                        <button
                                            onClick={() => setLogoStep(false)}
                                            className='absolute top-3 left-4 font-extrabold cursor-pointer'>
                                            <ArrowLeft size={35} />
                                        </button>
                                        <AuthInput inputName="avatar" register={register} error={avatarError} />
                                    </>
                                )
                                : (
                                    <>
                                        <AuthInput inputName="name" register={register} error={nameError} />
                                        <AuthInput inputName="email" register={register} error={emailError} />
                                        <AuthInput inputName="password" register={register} error={passwordError} />
                                    </>
                                )
                            }
                        </div>

                        {/* Instructor Info */}
                        {logoStep && !isStudent && (
                            <InstructorInfo register={register} errors={errors} />
                        )}

                        <button
                            type='submit'
                            className="btn-primary w-full mt-4"
                            disabled={isSubmitting || !isValid && !logoStep}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    در حال ثبت‌نام...
                                </span>
                            ) : logoStep
                                ? role === "student"
                                    ? "عضو به عنوان فراگیر"
                                    : "عضو به عنوان مدرس"
                                : (
                                    "ادامه"
                                )
                            }
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center p-6  pt-0 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            قبلاً حساب دارید؟{' '}
                            <Link to={`/login/${role}`} className="text-indigo-600 hover:text-indigo-700 font-semibold">
                                ورود به پنل
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;