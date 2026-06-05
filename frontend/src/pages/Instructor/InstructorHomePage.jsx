import React from 'react'
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';


const InstructorHomePage = () => {

  const formatPrice = (value) => {
    return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('fa-IR').format(value);
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DollarSign className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">کل درآمد</p>
            <p className="text-xl font-bold text-gray-800">
              {/* {formatPrice(dummyData.reduce((sum, item) => sum + item.sales, 0))} */}
              300
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">مجموع دانشجویان</p>
            <p className="text-xl font-bold text-gray-800">
              {formatNumber(dummyData.reduce((sum, item) => sum + item.students, 0))} نفر
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calendar className="text-purple-600" size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">میانگین ماهانه</p>
            <p className="text-xl font-bold text-gray-800">
              {formatPrice(dummyData.reduce((sum, item) => sum + item.sales, 0) / dummyData.length)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorHomePage