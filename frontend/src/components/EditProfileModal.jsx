import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/useAuthStore";


const profileSchema = z.object({
    name: z.string().min(3, "نام کامل حداقل ۳ کاراکتر باشد"),
    avatar: z.any().optional(),
});


const passwordSchema = z.object({
    oldPassword: z.string().min(6, "رمز عبور قدیمی حداقل ۶ کاراکتر"),
    newPassword: z.string().min(6, "رمز عبور جدید حداقل ۶ کاراکتر"),
    confirmPassword: z.string().min(6, "تکرار رمز عبور حداقل ۶ کاراکتر"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور جدید و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
});


const instructorSchema = z.object({
    major: z.string().min(2, "رشته تحصیلی حداقل ۲ کاراکتر باشد"),
    bio: z.string().min(10, "بیوگرافی حداقل ۱۰ کاراکتر باشد"),
});

const EditProfileModal = ({ isOpen, onClose, userData, role }) => {
    const [activeTab, setActiveTab] = useState("account"); // account, password, instructor
    const [avatarPreview, setAvatarPreview] = useState(userData?.avatar || null);
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);

    const { changePassword, changeUserProfile, changeInstructorSpecifications } = useAuthStore()


    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
        setValue: setProfileValue,
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: userData?.name || "دانیال",
        },
    });


    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
        reset: resetPasswordForm,
    } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });


    const {
        register: registerInstructor,
        handleSubmit: handleInstructorSubmit,
        formState: { errors: instructorErrors, isSubmitting: isInstructorSubmitting },
        setValue: setInstructorValue,
    } = useForm({
        resolver: zodResolver(instructorSchema),
        defaultValues: {
            major: userData?.instructorProfile?.major || "",
            bio: userData?.instructorProfile?.bio || "",
        },
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setProfileValue("avatar", file);
        }
    };

    const onProfileSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (avatarFile) formData.append("image", avatarFile);

        await changeUserProfile(formData)

        onClose();

    };

    const onPasswordSubmit = async (data) => {

        await changePassword(
            {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            })

        resetPasswordForm();
        onClose();

    };

    const onInstructorSubmit = async (data) => {

        await changeInstructorSpecifications({
            major: data.major,
            bio: data.bio
        })

        onClose();

    };

    if (!isOpen) return null;

    return (
        <>
            {/* بکدراپ */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-40 transition-all duration-300"
                onClick={onClose}
            />

            {/* مودال اصلی */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
                onClick={onClose} // <-- این رو اضافه کن
            >
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mobile-tall:max-w-3xl sm:max-w-md max-h-[85vh] overflow-y-auto transform transition-all duration-300"
                    onClick={(e) => e.stopPropagation()} // <-- جلوگیری از بسته شدن وقتی داخل مودال کلیک میشه
                    dir="rtl"
                >
                    {/* هدر مودال - sticky */}
                    <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 rounded-t-2xl">
                        <h2 className="text-sm sm:text-lg font-bold text-gray-800">
                            {role === "instructor" ? "ویرایش حساب مدرس" : "ویرایش حساب کاربری"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* تب‌ها - sticky */}
                    <div className="sticky top-[52px] sm:top-[60px] bg-white z-10 flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("account")}
                            className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all relative ${activeTab === "account"
                                    ? "text-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            حساب کاربری
                            {activeTab === "account" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("password")}
                            className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all relative ${activeTab === "password"
                                    ? "text-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            رمز عبور
                            {activeTab === "password" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                        {role === "instructor" && (
                            <button
                                onClick={() => setActiveTab("instructor")}
                                className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all relative ${activeTab === "instructor"
                                        ? "text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                مشخصات مدرس
                                {activeTab === "instructor" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                )}
                            </button>
                        )}
                    </div>

                    {/* محتوای تب‌ها */}
                    <div className="p-3 sm:p-5">
                        {/* تب حساب کاربری */}
                        {activeTab === "account" && (
                            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-3 sm:space-y-4 mobile-tall:flex items-center justify-around">
                                {/* آواتار */}
                                <div className="flex flex-col items-center justify-center pb-2">
                                    <div className="relative group">
                                        <div className="size-20 mobile-tall:size-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-md">
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="آواتار"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 sm:p-1.5 rounded-full shadow-md hover:bg-blue-600 transition-all"
                                        >
                                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                  
                                  {/* نام کامل */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        نام کامل
                                    </label>
                                    <input
                                        type="text"
                                        {...registerProfile("name")}
                                        className={`w-full px-2.5 sm:px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm ${profileErrors.name ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {profileErrors.name && (
                                        <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>
                                    )}
                                </div>

                                {/* ایمیل */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        ایمیل
                                    </label>
                                    <input
                                        type="email"
                                        value={userData?.email}
                                        readOnly
                                        className="w-full px-2.5 sm:px-3 py-2.5 border rounded-lg text-xs sm:text-sm bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                     

                                {/* دکمه ذخیره */}
                                <button
                                    type="submit"
                                    disabled={isProfileSubmitting}
                                    className="w-full mobile-tall:w-auto mobile-tall:px-3  bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 rounded-lg transition-all disabled:opacity-50 text-xs sm:text-sm font-medium"
                                >
                                    {isProfileSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
                                </button>
                            </form>
                        )}

                        {/* تب رمز عبور */}
                        {activeTab === "password" && (
                            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-3 sm:space-y-4 mobile-tall:flex flex-row-reverse items-center justify-around " dir="ltr">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        رمز عبور قدیمی
                                    </label>
                                    <input
                                        type="password"
                                        {...registerPassword("oldPassword")}
                                        className={`w-full px-2.5 sm:px-3 mobile-short:py-3 py-2.5 border rounded-lg focus:ring-2 mobile-tall:placeholder:text-xs focus:ring-blue-500 text-xs sm:text-sm ${passwordErrors.oldPassword ? "border-red-500" : "border-gray-300 "
                                            }`}
                                        placeholder="رمز عبور فعلی را وارد کنید"
                                    />
                                    {passwordErrors.oldPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.oldPassword.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        رمز عبور جدید
                                    </label>
                                    <input
                                        type="password"
                                        {...registerPassword("newPassword")}
                                        className={`w-full px-2.5 sm:px-3 mobile-short:py-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm mobile-tall:placeholder:text-xs ${passwordErrors.newPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="رمز عبور جدید را وارد کنید"
                                    />
                                    {passwordErrors.newPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs  sm:text-sm font-medium text-gray-700 mb-1">
                                        تکرار رمز عبور جدید
                                    </label>
                                    <input
                                        type="password"
                                        {...registerPassword("confirmPassword")}
                                        className={`w-full px-2.5 sm:px-3 mobile-short:py-3 py-2.5 border rounded-lg focus:ring-2 mobile-tall:placeholder:text-xs focus:ring-blue-500 text-xs sm:text-sm  ${passwordErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="رمز عبور جدید را دوباره وارد کنید"
                                    />
                                    {passwordErrors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPasswordSubmitting}
                                    className="w-full mobile-tall:w-auto mobile-tall:px-3 bg-blue-600 hover:bg-blue-700 text-white py-2 mobile-short:py-2.5 sm:py-2.5 rounded-lg transition-all disabled:opacity-50 text-xs mobile-tall:text-xs sm:text-sm font-medium"
                                >
                                    {isPasswordSubmitting ? "در حال تغییر..." : "تغییر رمز عبور"}
                                </button>
                            </form>
                        )}

                        {/* تب مشخصات مدرس */}
                        {role === "instructor" && activeTab === "instructor" && (
                            <form onSubmit={handleInstructorSubmit(onInstructorSubmit)} className="space-y-3 sm:space-y-4 mobile-tall:flex items-center justify-around gap-3">
                                <div className="flex-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        رشته تحصیلی
                                    </label>
                                    <input
                                        type="text"
                                        {...registerInstructor("major")}
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm ${instructorErrors.major ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="رشته تحصیلی خود را وارد کنید"
                                    />
                                    {instructorErrors.major && (
                                        <p className="text-red-500 text-xs mt-1">{instructorErrors.major.message}</p>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        بیوگرافی
                                    </label>
                                    <textarea
                                        {...registerInstructor("bio")}
                                        rows="3"
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 resize-none focus:ring-blue-500 text-xs sm:text-sm ${instructorErrors.bio ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="توضیحات درباره خود را وارد کنید..."
                                    />
                                    {instructorErrors.bio && (
                                        <p className="text-red-500 text-xs mt-1">{instructorErrors.bio.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isInstructorSubmitting}
                                    className="w-full mobile-tall:w-auto mobile-tall:px-3 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-all disabled:opacity-50 text-xs sm:text-sm font-medium"
                                >
                                    {isInstructorSubmitting ? "در حال ذخیره..." : "ذخیره مشخصات مدرس"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfileModal;