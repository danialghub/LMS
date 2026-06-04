import React, { useEffect } from 'react';
import { AlertTriangle, X, LogOut } from 'lucide-react';

const WarningModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "تأیید خروج",
    message = "آیا از خروج خود اطمینان دارید؟",
    confirmText = "خروج",
    cancelText = "انصراف",
    type = "warning" // warning, danger, info
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    buttonBg: 'bg-red-500 hover:bg-red-600',
                    borderColor: 'border-red-200'
                };
            case 'info':
                return {
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    buttonBg: 'bg-blue-500 hover:bg-blue-600',
                    borderColor: 'border-blue-200'
                };
            default:
                return {
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    buttonBg: 'bg-amber-500 hover:bg-amber-600',
                    borderColor: 'border-amber-200'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <>
            {/* بکدراپ */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[100] 
          animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* مودال */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        w-[90%] max-w-md z-[101] animate-in zoom-in-95 duration-300">

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* هدر */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* محتوا */}
                    <div className="p-6">
                        <div className="flex items-center gap-4">
                            {/* آیکون */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.iconBg} 
                flex items-center justify-center`}>
                                {type === 'warning' ? (
                                    <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
                                ) : (
                                    <LogOut className={`w-6 h-6 ${styles.iconColor}`} />
                                )}
                            </div>

                            {/* متن */}
                            <div className="flex-1 text-right">
                                <p className="text-slate-700 leading-relaxed">{message}</p>
                                <p className="text-sm text-slate-500 mt-2">
                                    این اقدام قابل بازگشت نیست.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-3 p-4 bg-slate-50">
                        <button
                            onClick={onConfirm}
                            className={`flex-1 ${styles.buttonBg} text-white font-semibold 
                py-2.5 px-4 rounded-xl transition-all duration-200 
                hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 
                font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 
                hover:bg-slate-50 hover:border-slate-300"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WarningModal;