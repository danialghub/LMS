import React, { useEffect, useState } from 'react';
import { Clock, Users, Star, ArrowLeft, BookOpen, Award, TrendingUp } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore'
import { CourseCard, PageLoader } from '@/components/index'
import { Link } from 'react-router'
const LatestCourses = () => {


  const [recentlyCourses, setRecenlyCourses] = useState([])
  const [isFetching, setIsfetching] = useState(false)
  const { getCourses } = useCourseStore()

  const [totalCourses, setTotalCourses] = useState(0)

  useEffect(() => {
    const getcourse = async () => {
      setIsfetching(true)
      const data = await getCourses({ page: 1, limit: 4 })
      setTotalCourses(data?.totalCourses || 0)
      setRecenlyCourses(data?.courses || [])
      setIsfetching(false)
    }
    getcourse()
  }, [])

  const formatPrice = (price) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const getDiscountPercent = (price, discount) => {
    return Math.round(((price - discount) / price) * 100);
  };

  return (
    <div className="w-full py-24 bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* هدر بخش */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-indigo-500/30">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-300 text-sm font-medium">آخرین دوره‌های آموزشی</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              جدیدترین دوره‌ها
            </span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            با جدیدترین دوره‌های ما، مهارت‌های خود را به سطح بعدی برسانید
          </p>
        </div>

        {/* گرید دوره‌ها */}
        {isFetching
          ? <PageLoader />
          : recentlyCourses.length

            ? (<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mb-12 gap-y-4">
              {recentlyCourses.map((course, index) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>)
            : <div className='flex items-center justify-center text-3xl text-white/70 my-20'>فعلا محتوایی برای نمایش نیست</div>
        }

        {/* دکمه همه دوره‌ها */}
        <div className="text-center">
          <Link
            to="/courses"
            onClick={() => scrollTo(0, 0)}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25">
            مشاهده همه دوره‌ها
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link >

          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>بیش از {totalCourses}+ دوره فعال</span>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .grid > div {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          position: relative;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div >
  );
};

export default LatestCourses;