import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { formatPrice, formatNumber } from '@/lib/helper';
import { useInstructorStore } from '@/store/useInstructorStore';
import { useEffect, useState } from 'react';
import { PageLoader } from '@/components/index';

const InstructorAnalytics = () => {
  const { getCourseAnalytics, courseAnalytics, isFetching } = useInstructorStore();
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    getCourseAnalytics();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;


  const barSize = isMobile ? 40 : isTablet ? 55 : 65;


  const categoryGap = isMobile ? 40 : isTablet ? 25 : 100;


  const chartWidth = courseAnalytics?.length
    ? courseAnalytics.length * (barSize * 2 + categoryGap) + (isMobile ? 80 : 120)
    : 500;

  return (
    <div className="bg-white rounded-xl max-w-7xl  md:mt-8 mx-3 md:mx-4 shadow-lg p-4 md:p-6" dir="rtl">
      {/* total analytics */}
      {courseAnalytics?.length > 0 && (
        <div className="flex items-center justify-center gap-4  mb-5 pt-6 border-t border-gray-200">
          <div className="w-[300px] flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">کل درآمد</p>
              <p className="text-sm sm:text-xl font-bold text-gray-800 font-Dirooz-FD">

                {formatPrice(courseAnalytics.reduce((sum, c) => sum + (c.sales || 0), 0))} <span className='font-ghalam text-blue-500'>تومان</span>
              </p>
            </div>
          </div>

          <div className="w-[300px] flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">مجموع دانشجویان</p>
              <p className="text-sm sm:text-xl font-bold text-gray-800 font-Dirooz-FD">
                30
              </p>
            </div>
          </div>


        </div>
      )}














      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-base md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={isMobile ? 20 : 24} />
          <span>گزارش فروش و دانشجویان بر اساس دوره</span>
        </h2>

        <div className="flex gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">درآمد (تومان)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">تعداد دانشجو</span>
          </div>
        </div>
      </div>

      {isFetching ? (
        <PageLoader />
      ) : !courseAnalytics?.length ? (
        <div className="flex flex-col items-center justify-center py-16">
          <TrendingUp size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">هیچ داده‌ای برای نمایش وجود ندارد</p>
        </div>
      ) : (
        <div
          className="overflow-x-auto overflow-y-hidden pb-4"
          onMouseDown={(e) => e.preventDefault()}
          onFocus={(e) => e.preventDefault()}
        >
          <div dir="ltr" style={{ width: chartWidth }}>
            <BarChart

              width={chartWidth}
              height={isMobile ? 400 : isTablet ? 440 : 480}
              data={courseAnalytics}
              margin={{
                top: 20,
                right: isMobile ? 30 : 40,
                left: isMobile ? 30 : 40,
                bottom: isMobile ? 70 : 50,
              }}
              barCategoryGap={categoryGap + '%'}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e5e5"
                vertical={false}
              />

              <XAxis
                dataKey="courseName"
                stroke="#888"
                tickLine={false}
                height={isMobile ? 80 : 80} // افزایش ارتفاع برای جای خط دوم
                interval={0}
                tick={(props) => {
                  const { x, y, payload } = props;

                  // تابع برای شکستن متن به دو خط
                  const splitText = (text, maxLength = 12) => {
                    if (!isMobile && text.length > maxLength) {
                      const splitIndex = Math.floor(text.length / 2);
                      // پیدا کردن نزدیک‌ترین فاصله به وسط
                      let breakPoint = text.indexOf(' ', splitIndex);
                      if (breakPoint === -1) breakPoint = splitIndex;

                      return [
                        text.substring(0, breakPoint),
                        text.substring(breakPoint)
                      ];
                    }
                    return [text];
                  };

                  const lines = splitText(payload.value);

                  return (
                    <g>
                      {lines.map((line, index) => (
                        <text
                          key={index}
                          x={x}
                          y={isMobile ? y + (index * 12) : y + (index * 14) - 5}
                          dy={16}
                          dx={isMobile ? -8 : 0}
                          textAnchor={isMobile ? 'start' : 'middle'}
                          fill="#666"
                          fontSize={isMobile ? 9 : 11}
                          transform={isMobile ? `rotate(-35 ${x} ${y})` : undefined}
                          style={{ direction: 'rtl' }}
                        >
                          {line}
                        </text>
                      ))}
                    </g>
                  );
                }}
              />

              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#888"
                fontSize={isMobile ? 10 : 12}
                tickFormatter={(value) => formatNumber(value)}
                width={isMobile ? 50 : 65}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#888"
                fontSize={isMobile ? 10 : 11}
                allowDecimals={false}
                width={isMobile ? 40 : 50}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: isMobile ? '11px' : '13px',
                  direction: 'rtl',
                }}
                formatter={(value, name) => {
                  if (name === 'درآمد') {
                    return [`${formatNumber(value)} تومان`, ' درآمد'];
                  }
                  return [`${formatNumber(value)} نفر`, ' دانشجو'];
                }}
              />

              <Bar
                yAxisId="left"
                dataKey="sales"
                name="درآمد"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                barSize={barSize}
                isAnimationActive={false}
              />

              <Bar
                yAxisId="right"
                dataKey="students"
                name="تعداد دانشجو"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                barSize={barSize}
                isAnimationActive={false}
              />
            </BarChart>
          </div>
        </div>
      )}



    </div>
  );
};

export default InstructorAnalytics;