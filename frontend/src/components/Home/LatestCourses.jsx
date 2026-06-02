import React from 'react';
import { Clock, Users, Star, ArrowLeft, BookOpen, Award, TrendingUp } from 'lucide-react';

const LatestCourses = () => {
  const courses = [
    {
      id: 1,
      title: "دوره جامع React و Next.js",
      instructor: "مهدی کریمی",
      students: 3420,
      duration: "۴۲ ساعت",
      price: 1290000,
      discount: 990000,
      rating: 4.9,
      image: "/course1.png",
      tags: ["فرانت اند", "React"],
      featured: true
    },
    {
      id: 2,
      title: "دوره هوش مصنوعی با پایتون",
      instructor: "سارا حسینی",
      students: 2850,
      duration: "۳۸ ساعت",
      price: 1490000,
      discount: 1190000,
      rating: 4.8,
      image: "/course2.png",
      tags: ["هوش مصنوعی", "پایتون"],
      featured: false
    },
    {
      id: 3,
      title: "طراحی UI/UX حرفه‌ای",
      instructor: "الناز رضایی",
      students: 4210,
      duration: "۲۸ ساعت",
      price: 890000,
      discount: 690000,
      rating: 4.9,
      image: "/course3.png",
      tags: ["طراحی", "UI/UX"],
      featured: true
    },
    {
      id: 4,
      title: "بک اند با Node.js و MongoDB",
      instructor: "علی محمدی",
      students: 1980,
      duration: "۵۰ ساعت",
      price: 1590000,
      discount: 1290000,
      rating: 4.7,
      image: "/course4.png",
      tags: ["بک اند", "Node.js"],
      featured: false
    }
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* برچسب ویژه */}
              {course.featured && (
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  ویژه
                </div>
              )}
              
              {/* تصویر */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* تگ‌ها */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  {course.tags.map((tag, idx) => (
                    <span key={idx} className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* محتوا */}
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-3">
                  {course.instructor}
                </p>
                
                {/* جزئیات */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString('fa-IR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                
                {/* قیمت */}
                <div className="flex items-center justify-between mb-4 pt-3 border-t border-white/10">
                  <div>
                    <span className="text-gray-500 line-through text-sm">
                      {formatPrice(course.price)}
                    </span>
                    <div className="text-white font-bold text-xl">
                      {formatPrice(course.discount)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {getDiscountPercent(course.price, course.discount)}% تخفیف
                  </div>
                </div>
                
                <button className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105">
                  ثبت نام
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* دکمه همه دوره‌ها */}
        <div className="text-center">
          <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25">
            مشاهده همه دوره‌ها
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>بیش از ۵۰۰+ دوره فعال</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>۵۰,۰۰۰+ دانشجو</span>
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
    </div>
  );
};

export default LatestCourses;