import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { formatPrice, formatNumber } from '@/lib/helper'
import { useInstructorStore } from '@/store/useInstructorStore';
import { useEffect } from 'react';
import { PageLoader } from '@/components/index'

// const dummyData = [
//   {
//     courseName: 'React',
//     sales: 42000000,
//     students: 28,
//   },
//   {
//     courseName: 'Next.js',
//     sales: 58000000,
//     students: 35,
//   },
//   {
//     courseName: 'TypeScript',
//     sales: 65000000,
//     students: 42,
//   },
//   {
//     courseName: 'Node.js',
//     sales: 49000000,
//     students: 31,
//   },
//   {
//     courseName: 'Python',
//     sales: 72000000,
//     students: 48,
//   },
//   {
//     courseName: 'Django',
//     sales: 85000000,
//     students: 56,
//   },
//   {
//     courseName: 'Django',
//     sales: 85000000,
//     students: 56,
//   },

// ];

const InstructorAnalytics = () => {

  const { getCourseAnalytics, courseAnalytics, isFetching } = useInstructorStore()

  useEffect(() => {
    getCourseAnalytics()
  }, [])
  console.log(courseAnalytics);

  return (
    <div className="bg-white rounded-xl max-w-7xl mt-8 mx-4 shadow-lg p-6" dir="rtl">
      {/* هدر نمودار */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            گزارش فروش و دانشجویان بر اساس دوره
          </h2>

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
      {isFetching
        ? <PageLoader />
        : (<div className="overflow-x-auto overflow-y-hidden">
          <div
            dir='ltr'
            style={{ width: `${Math.max(100, courseAnalytics.length * 25)}%`, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={courseAnalytics}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

                <XAxis
                  dataKey="courseName"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  direction='rtl'
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
                  allowDecimals={false}
                  domain={[0, 'dataMax']}
                  interval={0}
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
                      return [`${formatNumber(value)} تومان`, 'درآمد'];
                    }
                    return [formatNumber(value) + ' نفر', 'تعداد دانشجو'];
                  }}
                  labelFormatter={(label) => `دوره: ${label}`}
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
        </div>)

      }
    </div>
  )
};

export default InstructorAnalytics;