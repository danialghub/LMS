import { Download, FileArchive, Paperclip, FileBox } from "lucide-react";


const LectureAttachment = ({ isDark, attachmentFile }) => {

    const formatBytes = (bytes) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const units = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
    };

    const attachment = {
        id: 1,
        name: attachmentFile.name,
        size: formatBytes(attachmentFile?.size),
        type: attachmentFile?.fileType,
        icon: attachmentFile.fileType === "zip" ? FileArchive : FileBox,
        downloadUrl: attachmentFile.url,
        color: attachmentFile.fileType === "zip" ? "text-amber-400" : "text-red-400"
    };

    const IconComponent = attachment.icon;



    return (
        <div className="my-8">
            {/* Attachments Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center
                        ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}
                    `}>
                        <Paperclip size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">فایل پیوست جلسه</h3>

                    </div>
                </div>
            </div>

            {/* Single File Card */}
            <div
                className={`
                    group relative overflow-hidden rounded-xl border transition-all duration-300
                    hover:translate-x-[-4px] hover:shadow-lg
                    ${isDark
                        ? 'bg-[#121826] border-[#1a2233] hover:border-blue-500/30'
                        : 'bg-white border-zinc-200 hover:border-blue-300'
                    }
                `}
            >
                {/* Hover Gradient */}
                <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    bg-gradient-to-r from-blue-500/5 to-transparent
                `} />

                <div className="relative p-4 flex items-center justify-between">
                    {/* Left Side - File Info */}
                    <div className="flex items-center gap-4 flex-1">
                        {/* File Icon */}
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                            group-hover:scale-110
                            ${isDark ? 'bg-[#0f1523]' : 'bg-zinc-100'}
                        `}>
                            <IconComponent size={24} className={attachment.color} />
                        </div>

                        {/* File Details */}
                        <div className="flex-1">
                            <h4 className="font-medium text-sm group-hover:text-blue-400 transition-colors">
                                {attachment.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-zinc-400'}`}>
                                    {attachment.size}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full bg-amber-500/10 ${attachment.color}`}>
                                    فایل فشرده
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Download Button */}
                    <button
                        className={`
                            p-2 rounded-lg transition-all duration-300
                            ${isDark
                                ? 'hover:bg-blue-500/10 hover:text-blue-400'
                                : 'hover:bg-bg-50 hover:text-blue-600'
                            }
                        `}
                        title="دانلود فایل"
                    >
                        <a href={attachment.downloadUrl}>
                            <Download size={18} />
                        </a>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500/20 overflow-hidden">
                    <div className="h-full w-0 bg-blue-500 group-hover:w-full transition-all duration-1000" />
                </div>
            </div>
        </div>
    );
};

export default LectureAttachment;