import React, { useState } from 'react'
import { XIcon, EyeOff, Eye, Mail,Lock } from 'lucide-react'


const EmailField = ({ register, error }) => (
    <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
            <Mail size={16} className="text-blue-500" />
            <span>ایمیل</span>
        </div>
        <input
            type="email"
            {...register('email')}
            dir="ltr"
            placeholder="example@domain.com"
            className={`form-input ${error ? 'error' : ''}`}
        />
        {error && (
            <p className="mt-1 text-sm text-red-500 animate-fade-in">{error}</p>
        )}
    </div>
);

const PasswordField = ({ register, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mb-6">
            <div className="relative">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                    <Lock size={16} className="text-blue-500" />
                    <span>رمز عبور</span>
                </div>
                <input
                    dir="ltr"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    className={`form-input ${error ? 'error' : ''} pr-6`}
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </button>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500 animate-fade-in">{error}</p>
            )}
            <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-3">
                <span>🔸 حداقل ۸ کاراکتر</span>
                <span>🔸 حروف بزرگ/کوچک</span>
                <span>🔸 عدد</span>
                <span>🔸 کاراکتر ویژه</span>
            </div>
        </div>
    );
};

const AvatarField = ({ register, error }) => {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return setPreview(null);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className="">


            <div className="flex flex-col items-center justify-center py-2 gap-4">
                {/* Preview */}
                <div className="relative group">
                    <div className="w-20 h-20 rounded-full ring-2 ring-indigo-500 ring-offset-2 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl transition-transform group-hover:scale-105">
                        {preview ? (
                            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            "📷"
                        )}
                    </div>
                    {preview && (
                        <button
                            type="button"
                            onClick={() => setPreview(null)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 transition-colors font-bold"
                        >
                            <XIcon size={20} />
                        </button>
                    )}
                </div>

                {/* Input */}
                <label
                    className=' py-2 px-4 rounded-full text-indigo-600 hover:file:bg-indigo-100 bg-indigo-50 ont-medium cursor-pointer'
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        {...register('avatar')}
                        onChange={(e) => {
                            register('avatar').onChange(e);
                            handleFileChange(e);
                        }}
                        hidden
                        className="flex-1 text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium  file:text-indigo-600 file:cursor-pointer transition-all"
                    />
                    انتخاب فایل
                </label>
            </div>

            {error && (
                <p className="text-sm text-red-500 animate-pulse">{error}</p>
            )}


        </div>
    );
};
const NameField = ({ register, error }) => (
    <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="inline-block mr-1">👤</span>
            نام و نام خانوادگی
        </label>
        <input
            type="text"
            {...register('name')}
            dir="rtl"
            placeholder="مثال: محمد رضایی"
            className={`form-input ${error ? 'error' : ''}`}
        />
        {error && (
            <p className="mt-1 text-sm text-red-500 animate-fade-in">{error}</p>
        )}
    </div>
);

const MajorField = ({ register, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            رشته تحصیلی
        </label>
        <input
            type="text"
            {...register('instructorProfile.major')}
            dir="rtl"
            placeholder="مثال: مهندس کامپیوتر"
            className={`form-input ${error ? 'error' : ''}`}
        />
        {error && (
            <p className="mt-1 text-sm text-red-500 animate-fade-in">{error}</p>
        )}
    </div>
);

const BioField = ({ register, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2 ">
            درباره شما
        </label>
        <textarea
            type="text"
            resize={false}
            maxLength={255}
            {...register('instructorProfile.bio')}
            rows={4}
            maxRows={4}
            dir="rtl"
            placeholder="توضیحات"
            className={`form-input ${error ? 'error' : ''}  resize-none`}
        />
        {error && (
            <p className="mt-1 text-sm text-red-500 animate-fade-in">{error}</p>
        )}
    </div>
);


const InputHandler = ({ inputName, register, error }) => {
    const components = {
        name: NameField,
        email: EmailField,
        password: PasswordField,
        avatar: AvatarField,
        bio: BioField,
        major: MajorField
    };

    const Input = components[inputName];
    return Input ? (
        <Input register={register} error={error} />
    ) : null;
};

export default InputHandler