import { User } from 'lucide-react'
import React from 'react'

const CourseSkleton = () => {
    return (
        <div

            className="border border-gray-100 rounded-2xl overflow-hidden"
        >
            {/* Image Placeholder */}
            <div className="h-[140px] bg-[#ededed] animate-pulse" />

            {/* Body */}
            <div className="p-4">
                <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2 animate-pulse" />

                <div className="h-3 bg-gray-200 rounded-full w-1/2 mb-4 animate-pulse" />

                <div className="flex items-center justify-between mb-4 animate-pulse">
                    <User
                        size={18}
                        className="text-gray-300"
                    />

                
                </div>

                <div className="h-[4px] bg-gray-100 rounded-full overflow-hidden mb-4 animate-pulse">
                    <div className="h-full w-0 bg-blue-500" />
                </div>

                <div className="bg-blue-50 h-[38px] rounded-xl flex items-center justify-center text-blue-600  text-sm">
                    ادامه یادگیری
                </div>
            </div>
        </div>
    )
}

export default CourseSkleton