import { useState } from 'react';
import { Plus, Edit, Users, DollarSign, CheckSquare, Square, Loader, X } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { Link } from 'react-router'
import { useEffect } from 'react';
import { SubmitLoading, Pagination } from '@/components/index'
import { useInstructorStore } from '@/store/useInstructorStore';
import { usePostCourseMutation, useGetInstructorCourses } from '@/query/courseQueries';


const NewCourseModal = ({ isOpen, onClose }) => {

    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const { mutate: createCourse, isPending: isCreating } = usePostCourseMutation()

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('عنوان دوره الزامی است');
            return;
        }

        if (title.trim().length < 3) {
            setError('عنوان دوره باید حداقل 3 کاراکتر باشد');
            return;
        }
        // ایجاد دوره جدید
        const newCourse = {
            courseTitle: title,
        };

        createCourse(newCourse);
        setTitle('');
        setError('');
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">

                {/* هدر مودال */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Plus size={24} className="text-blue-600" />
                        ایجاد دوره جدید
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* فرم */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">
                            عنوان دوره
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setError('');
                            }}
                            placeholder="مثال: دوره جامع React"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-right ${error ? 'border-red-500' : 'border-gray-300'
                                }`}
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 min-w-[120px] min-h-[40px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                            {isCreating
                                ? <SubmitLoading />
                                : (
                                    <>
                                        <Plus size={18} />
                                        <span> ایجاد دوره</span>
                                    </>
                                )
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// تابع فرمت کننده اعداد به تومان
const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

const InstructorCoursesManagementPage = () => {

    const { authUser } = useAuthStore()

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const { data, isLoading, isError, isFetching } = useGetInstructorCourses(page, authUser?._id)


    const courses = data?.courses || []
    const totalPagesInfo = data?.totalPages



    useEffect(() => {
        if (!totalPagesInfo) return
        setTotalPages(totalPagesInfo)
    }, [totalPagesInfo])

    return (
        <div className="container max-w-7xl p-4 md:p-6 bg-gray-50" dir="rtl">
            <NewCourseModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* هدر و دکمه ایجاد دوره جدید - ریسپانسیو */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">مدیریت دوره‌ها</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 rounded-lg transition duration-200 shadow-md w-full sm:w-auto"
                >
                    <Plus size={20} />
                    <span>دوره جدید</span>
                </button>
            </div>

            {/* جدول دوره‌ها */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[70vh] relative">
                {isError ? (
                    <div className="p-4 text-center text-red-600">خطا در دریافت دوره‌ها</div>
                ) : isLoading ? (
                    <div className='flex items-center justify-center h-[60vh]'>
                        <Loader className='animate-spin size-8 md:size-10 text-blue-500' />
                    </div>
                ) : (
                    <>
                        {/* نسخه دسکتاپ: جدول معمولی */}
                        <div className="hidden md:block overflow-x-auto pb-14">
                            <table className="w-full min-w-[768px]">
                                <thead className="bg-gray-100 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">دوره</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <DollarSign size={16} />
                                                <span>درآمد دوره</span>
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Users size={16} />
                                                <span>تعداد دانشجو</span>
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                                            <div className="flex items-center justify-center gap-1">
                                                <CheckSquare size={16} />
                                                <span>وضعیت انتشار</span>
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course, index) => (
                                        <tr
                                            key={course._id || index}
                                            className={`border-b border-gray-200 hover:bg-gray-50 transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                }`}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-10 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                                                        {course.courseThumbnail ? (
                                                            <img
                                                                src={course.courseThumbnail}
                                                                alt={course.courseTitle}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                                بدون عکس
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-800 line-clamp-2">{course.courseTitle}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-green-600 font-semibold">
                                                    {course?.enrolledStudents?.length
                                                        ? <span>{formatPrice(course.sales)}</span>
                                                        : <span className="text-gray-400">———</span>
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-blue-600">
                                                    <Users size={16} />
                                                    <span className="font-semibold">
                                                        {course?.enrolledStudents?.length ? (
                                                            <>
                                                                <span>{course?.enrolledStudents?.length.toLocaleString('fa-IR')}</span>
                                                                <span className="text-gray-500 text-sm"> نفر</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400">———</span>
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center">
                                                    <button className="flex items-center gap-2 group">
                                                        {course.isCoursePublished ? (
                                                            <CheckSquare size={20} className="text-green-600 group-hover:text-green-700 transition" />
                                                        ) : (
                                                            <Square size={20} className="text-gray-400 group-hover:text-gray-500 transition" />
                                                        )}
                                                        <span className={`text-sm hidden sm:inline ${course.isCoursePublished ? 'text-green-600' : 'text-gray-500'
                                                            }`}>
                                                            {course.isCoursePublished ? 'منتشر شده' : 'پیش‌نویس'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center">
                                                    <Link
                                                        to={`/instructor/courses/course-setup/${course._id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-150 group"
                                                        title="ویرایش دوره"
                                                    >
                                                        <Edit size={18} className="group-hover:scale-110 transition" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* نسخه موبایل و تبلت: کارت‌های عمودی */}
                        <div className="block md:hidden pb-14">
                            <div className="space-y-3 p-3">
                                {courses.map((course, index) => (
                                    <div
                                        key={course._id || index}
                                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        {/* ردیف اول: تصویر و عنوان */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-16 h-14 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                                                {course.courseThumbnail ? (
                                                    <img
                                                        src={course.courseThumbnail}
                                                        alt={course.courseTitle}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                        بدون عکس
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm sm:text-base">
                                                    {course.courseTitle}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* ردیف دوم: آمار */}
                                        <div className="grid grid-cols-2 gap-3 mb-3 pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-green-600">
                                                <DollarSign size={16} />
                                                <div>
                                                    <span className="text-xs text-gray-500 block">درآمد</span>
                                                    <span className="font-semibold text-sm">
                                                        {course?.enrolledStudents?.length
                                                            ? formatPrice(course.sales)
                                                            : '———'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-blue-600">
                                                <Users size={16} />
                                                <div>
                                                    <span className="text-xs text-gray-500 block">تعداد دانشجو</span>
                                                    <span className="font-semibold text-sm">
                                                        {course?.enrolledStudents?.length ? (
                                                            <>{course?.enrolledStudents?.length.toLocaleString('fa-IR')} نفر</>
                                                        ) : (
                                                            '———'
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ردیف سوم: وضعیت و عملیات */}
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <button className="flex items-center gap-2 group">
                                                {course.isCoursePublished ? (
                                                    <CheckSquare size={18} className="text-green-600" />
                                                ) : (
                                                    <Square size={18} className="text-gray-400" />
                                                )}
                                                <span className={`text-xs ${course.isCoursePublished ? 'text-green-600' : 'text-gray-500'
                                                    }`}>
                                                    {course.isCoursePublished ? 'منتشر شده' : 'پیش‌نویس'}
                                                </span>
                                            </button>
                                            <Link
                                                to={`/instructor/courses/course-setup/${course._id}`}
                                                className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            >
                                                <Edit size={16} />
                                                <span className="text-sm">ویرایش</span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* وضعیت خالی بودن جدول */}
                {!isFetching && courses.length === 0 && (
                    <div className='h-[70vh] flex items-center justify-center'>
                        <div className="text-center py-12 px-4">
                            <p className="text-gray-500 text-xl md:text-2xl font-heading">هیچ دوره‌ای یافت نشد</p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >
                                <Plus size={18} />
                                <span>ایجاد اولین دوره</span>
                            </button>
                        </div>
                    </div>
                )}

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => {
                        setPage(newPage);
                    }}
                />
            </div>
        </div>
    );
};

export default InstructorCoursesManagementPage;