import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// اسکیما برای تب حساب کاربری
const profileSchema = z.object({
    name: z.string().min(3, "نام کامل حداقل ۳ کاراکتر باشد"),
    avatar: z.any().optional(),
});

// اسکیما برای تب رمز عبور
const passwordSchema = z.object({
    oldPassword: z.string().min(6, "رمز عبور قدیمی حداقل ۶ کاراکتر"),
    newPassword: z.string().min(6, "رمز عبور جدید حداقل ۶ کاراکتر"),
    confirmPassword: z.string().min(6, "تکرار رمز عبور حداقل ۶ کاراکتر"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور جدید و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
});

const EditProfileModal = ({ isOpen, onClose, userData }) => {
    const [activeTab, setActiveTab] = useState("account"); // account یا password
    const [avatarPreview, setAvatarPreview] = useState(userData?.avatar || null);
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);

    // فرم حساب کاربری
    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
        setValue: setProfileValue,
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: userData?.name || "danial2090",
        },
    });

    // فرم رمز عبور
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
        if (avatarFile) formData.append("avatar", avatarFile);

        console.log("حساب کاربری ذخیره شد:", Object.fromEntries(formData));
        // درخواست به API
        setTimeout(() => {
            onClose();
        }, 1000);
    };

    const onPasswordSubmit = async (data) => {
        console.log("رمز عبور تغییر کرد:", {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
        });
        // درخواست به API برای تغییر رمز
        setTimeout(() => {
            resetPasswordForm();
            onClose();
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* بکدراپ */}
            <div
                className="fixed inset-0 bg-black/10 bg-opacity-50 backdrop-blur-[3px] z-50 transition-all duration-300"
                onClick={onClose}
            />

            {/* مودال اصلی - اندازه دقیق مثل تصویر */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                    dir="rtl"
                >
                    {/* هدر مودال */}
                    <div className="flex justify-between items-center p-5 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">ویرایش حساب کاربری</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* تب‌ها */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("account")}
                            className={`flex-1 py-3 text-center font-medium transition-all relative ${activeTab === "account"
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
                            className={`flex-1 py-3 text-center font-medium transition-all relative ${activeTab === "password"
                                ? "text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            رمز عبور
                            {activeTab === "password" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                    </div>

                    {/* محتوای تب‌ها */}
                    <div className="p-5">
                        {/* تب حساب کاربری */}
                        {activeTab === "account" && (
                            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                                {/* آواتار */}
                                <div className="flex flex-col items-center justify-center pb-2">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-md">
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="آواتار"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full shadow-md hover:bg-blue-600 transition-all"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نام کامل
                                    </label>
                                    <input
                                        type="text"
                                        {...registerProfile("name")}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${profileErrors.name ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {profileErrors.name && (
                                        <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>
                                    )}
                                </div>

                                {/* ایمیل */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ایمیل
                                    </label>
                                    <input
                                        type="email"
                                        value={userData.email}
                                        readOnly
                                        className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                {/* دکمه ذخیره */}
                                <button
                                    type="submit"
                                    disabled={isProfileSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all disabled:opacity-50 text-sm font-medium"
                                >
                                    {isProfileSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
                                </button>
                            </form>
                        )}

                        {/* تب رمز عبور */}
                        {activeTab === "password" && (
                            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                                {/* رمز عبور قدیمی */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        رمز عبور قدیمی
                                    </label>
                                    <input
                                        type="password"
                                        {...registerPassword("oldPassword")}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm ${passwordErrors.oldPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="رمز عبور فعلی را وارد کنید"
                                    />
                                    {passwordErrors.oldPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.oldPassword.message}</p>
                                    )}
                                </div>

                                {/* رمز عبور جدید */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        رمز عبور جدید
                                    </label>
                                    <input
                                        type="password"
                                        {...registerPassword("newPassword")}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm ${passwordErrors.newPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="رمز عبور جدید را وارد کنید"
                                    />
                                    {passwordErrors.newPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
                                    )}
                                </div>

                                {/* تکرار رمز عبور جدید */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        تکرار رمز عبور جدید
                                    </label>
                                    <input
                                        type="password"
                                        {...registerPassword("confirmPassword")}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm ${passwordErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="رمز عبور جدید را دوباره وارد کنید"
                                    />
                                    {passwordErrors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
                                    )}
                                </div>

                                {/* دکمه تغییر رمز */}
                                <button
                                    type="submit"
                                    disabled={isPasswordSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all disabled:opacity-50 text-sm font-medium"
                                >
                                    {isPasswordSubmitting ? "در حال تغییر..." : "تغییر رمز عبور"}
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