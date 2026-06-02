import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { formatPrice, formatNumber } from '@/lib/helper'
// Dummy data - به راحتی قابل تعویض با دیتای واقعی از API هست
const dummyData = [
  {
    month: 'فروردین',
    sales: 42000000,
    students: 28,
    courseName: 'React'
  },
  {
    month: 'اردیبهشت',
    sales: 58000000,
    students: 35,
    courseName: 'Next.js'
  },
  {
    month: 'خرداد',
    sales: 65000000,
    students: 42,
    courseName: 'TypeScript'
  },
  {
    month: 'تیر',
    sales: 49000000,
    students: 31,
    courseName: 'Node.js'
  },
  {
    month: 'مرداد',
    sales: 72000000,
    students: 48,
    courseName: 'Python'
  },
  {
    month: 'شهریور',
    sales: 85000000,
    students: 56,
    courseName: 'Django'
  }
];


const InstructorAnalytics = () => {
  // تابع برای تبدیل دیتا (اگر از API دیتا گرفتی، میتونی اینجا مپ کنی)
  // const chartData = apiData.map(item => ({
  //   month: item.month,
  //   sales: item.revenue,
  //   students: item.studentCount
  // }));

  return (
    <div className="bg-white rounded-xl max-w-7xl mt-8 mx-4 shadow-lg p-6" dir="rtl">
      {/* هدر نمودار */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            گزارش فروش و دانشجویان
          </h2>
          <p className="text-gray-500 text-sm mt-1">آمار ۶ ماه گذشته</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">درآمد (تومان)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">تعداد دانشجو</span>
          </div>
        </div>
      </div>

      {/* خود نمودار */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={dummyData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

          <XAxis
            dataKey="month"
            stroke="#666"
            fontSize={12}
            tickLine={false}
          />

          <YAxis
            yAxisId="left"
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => {
              if (value >= 10000000) {
                return (value / 10000000).toFixed(0) + ' میلیون';
              }
              return formatNumber(value);
            }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => formatNumber(value)}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '10px',
              direction: 'rtl'
            }}
            formatter={(value, name) => {
              if (name === 'درآمد') {
                return [formatPrice(value), 'درآمد'];
              }
              return [formatNumber(value) + ' نفر', 'تعداد دانشجو'];
            }}
            labelFormatter={(label) => `ماه: ${label}`}
          />

          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => {
              return <span className="text-gray-700">{value === 'sales' ? 'درآمد' : 'تعداد دانشجو'}</span>;
            }}
          />

          <Bar
            yAxisId="left"
            dataKey="sales"
            name="درآمد"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            barSize={40}
          />

          <Bar
            yAxisId="right"
            dataKey="students"
            name="تعداد دانشجو"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>


    </div>
  );
};

export default InstructorAnalytics;