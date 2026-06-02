import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/validators/authSchema'
import { Link, useNavigate } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore';
import { Logo, AuthInput } from '@/components/index'


const LoginPage = ({ role = "student" }) => {


    const { login } = useAuthStore()

    const navigate = useNavigate()


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
        formData.append('role', role)


        const result = await login(formData)
        if (result) {

            navigate(`/${role}/dashboard`)
        }

    };


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
                        <p className="text-indigo-100 mt-2">وارد به دنیا یادگیری شوید</p>

                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 py-6 relative">
                        {/* User Info */}
                        <div>

                            <AuthInput inputName="email" register={register} error={emailError} />
                            <AuthInput inputName="password" register={register} error={passwordError} />

                        </div>


                        <button
                            type='submit'
                            className="btn-primary w-full mt-4"
                            disabled={isSubmitting || !isValid}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    در حال ورود...
                                </span>
                            ) : role === "student"
                                ? "ورود به عنوان فراگیر"
                                : "ورود به عنوان مدرس"

                            }
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center p-6  pt-0 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            حساب ندارید؟{' '}
                            <Link to={`/sign-up/${role}`} className="text-indigo-600 hover:text-indigo-700 font-semibold">
                                ورود به پنل

                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;