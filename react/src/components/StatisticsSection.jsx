// components/StatisticsSection.jsx
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  XMarkIcon, 
} from '@heroicons/react/24/outline';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const parseDate = (dateInput) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (!date || isNaN(date.getTime())) {
    return null;
  }
  // Chuyển sang múi giờ Việt Nam (+7 giờ) một cách an toàn
  const vietnamDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  return vietnamDate;
};

const useTransactionData = (
  transactionsRaw,
  selectedMonth,
  selectedYear,
  filter,
  currentPage,
  selectedDate,
  dateFilterMode
) => {
  const transactions = useMemo(() => {
    return transactionsRaw
      .map((t) => {
        const date = parseDate(t.date);
        if (!date || isNaN(date.getTime())) {
          console.warn(`Invalid date for transaction ${t.id}: ${JSON.stringify(t.date)}`);
          return null;
        }
        return {
          ...t,
          date,
          items: t.items || [],
          itemCount: t.items?.length || 0,
          total: t.items?.reduce((sum, item) => sum + (item.price || 0), 0) || 0,
          status:
            t.status === 'Hoàn tất'
              ? 'Đã thanh toán'
              : t.status === 'Chưa trả'
              ? 'Đang xử lý'
              : 'Đã hủy',
        };
      })
      .filter((t) => t !== null);
  }, [transactionsRaw]);

  // Lấy ngày hiện tại tại múi giờ Việt Nam
  const vietnamToday = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const todayString = vietnamToday.toISOString().split('T')[0];
  const currentMonth = vietnamToday.getMonth();
  const currentYear = vietnamToday.getFullYear();
  const yesterday = new Date(vietnamToday);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  const yesterdayTransactions = transactions.filter(
    (t) => t.date.toISOString().split('T')[0] === yesterdayString
  );
  const yesterdayRevenue = yesterdayTransactions.reduce((sum, t) => sum + t.total, 0);

  const todayTransactions = transactions.filter(
    (t) => t.date.toISOString().split('T')[0] === todayString
  );
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  const todayItemsSold = todayTransactions.reduce((sum, t) => sum + t.itemCount, 0);
  const todayCustomers = new Set(todayTransactions.map((t) => t.customer)).size;

  const mayRevenue = transactions
    .filter(
      (t) =>
        t.date.getMonth() === currentMonth &&
        t.date.getFullYear() === currentYear &&
        t.status === 'Đã thanh toán'
    )
    .reduce((sum, t) => sum + t.total, 0);

  const monthlyRevenue = transactions.reduce(
    (acc, t) => {
      const month = `Th${t.date.getMonth() + 1}`;
      acc[month] = (acc[month] || 0) + (t.status === 'Đã thanh toán' ? t.total : 0);
      return acc;
    },
    {
      Th1: 0, Th2: 0, Th3: 0, Th4: 0, Th5: 0, Th6: 0,
      Th7: 0, Th8: 0, Th9: 0, Th10: 0, Th11: 0, Th12: 0,
    }
  );

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (dateFilterMode === 'day') {
      const selectedDateString = selectedDate.toISOString().split('T')[0];
      filtered = transactions.filter((t) => t.date.toISOString().split('T')[0] === selectedDateString);
    } else {
      filtered = transactions.filter(
        (t) => t.date.getMonth() === selectedMonth && t.date.getFullYear() === selectedYear
      );
    }
    if (filter !== 'All') {
      filtered = filtered.filter((t) => t.status.toLowerCase() === filter.toLowerCase());
    }
    return filtered;
  }, [transactions, selectedMonth, selectedYear, filter, selectedDate, dateFilterMode]);

  const transactionsPerPage = 5;
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const availableMonths = useMemo(() => {
    const months = {};
    transactions.forEach((t) => {
      const month = t.date.getMonth();
      const year = t.date.getFullYear();
      const key = `${year}-${month}`;
      if (!months[key]) {
        months[key] = { month, year, label: `Tháng ${month + 1}/${year}` };
      }
    });
    return Object.values(months).sort((a, b) => b.year - a.year || b.month - a.month);
  }, [transactions]);

  const availableYears = useMemo(() => {
    const years = new Set(transactions.map((t) => t.date.getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  return {
    todayRevenue,
    yesterdayRevenue,
    todayItemsSold,
    todayCustomers,
    mayRevenue,
    monthlyRevenue,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    availableMonths,
    availableYears,
  };
};

const StatisticsSection = ({
  transactions,
  monthlyGoal,
  setMonthlyGoal,
  selectedDate,
  setSelectedDate,
  filter,
  setFilter,
  currentPage,
  setCurrentPage,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  formatCurrency,
}) => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [dateFilterMode, setDateFilterMode] = useState('month');

  const {
    todayRevenue,
    yesterdayRevenue,
    todayItemsSold,
    todayCustomers,
    mayRevenue,
    monthlyRevenue,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    availableMonths,
    availableYears,
  } = useTransactionData(
    transactions,
    selectedMonth,
    selectedYear,
    filter,
    currentPage,
    selectedDate,
    dateFilterMode
  );

  const formatCurrencyFn = formatCurrency || ((amount) =>
    Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));

  const actualProgress = monthlyGoal > 0 ? (mayRevenue / monthlyGoal) * 100 : 0;
  const displayProgress = Math.min(actualProgress, 100);
  const progressColor = actualProgress >= 100 ? '#00b14f' : actualProgress < 60 ? '#ef4444' : '#facc15';

  const handleSetGoal = () => {
    const goal = parseFloat(goalInput);
    if (isNaN(goal) || goal <= 0) {
      alert('Vui lòng nhập một số tiền hợp lệ lớn hơn 0.');
      return;
    }
    setMonthlyGoal(goal);
    setGoalInput('');
    setShowGoalModal(false);
  };

  const onWebDateChange = (e) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      // Đảm bảo ngày được đặt theo múi giờ Việt Nam
      const vietnamDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
      setSelectedDate(vietnamDate);
      setDateFilterMode('day');
    }
  };

  const allMonths = [
    { month: 0, label: 'Tháng 1' }, { month: 1, label: 'Tháng 2' }, { month: 2, label: 'Tháng 3' },
    { month: 3, label: 'Tháng 4' }, { month: 4, label: 'Tháng 5' }, { month: 5, label: 'Tháng 6' },
    { month: 6, label: 'Tháng 7' }, { month: 7, label: 'Tháng 8' }, { month: 8, label: 'Tháng 9' },
    { month: 9, label: 'Tháng 10' }, { month: 10, label: 'Tháng 11' }, { month: 11, label: 'Tháng 12' },
  ];

  return (
    <div className="p-4">
      {/* Revenue Summary Card */}
      <div className="bg-green-600 rounded-xl p-4 mt-4 mx-3 shadow-md text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">Doanh thu hôm nay</p>
            <p className="text-3xl font-bold mt-1">{formatCurrencyFn(todayRevenue)}</p>
          </div>
          <div>
            <p className="text-sm">Doanh thu hôm qua</p>
            <p className="text-base mt-1">{formatCurrencyFn(yesterdayRevenue)}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/30">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2zm-2 14H10v-2h4v2zm0-4H10v-2h4v2zm0-4H10V8h4v2z" />
            </svg>
            <p className="text-sm">{todayItemsSold} đơn hàng</p>
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm2 4v10h10V7H7zm2 2h6v6H9V9z" />
            </svg>
            <p className="text-sm">{todayCustomers} thanh toán QR</p>
          </div>
        </div>
      </div>

      {/* Today Stats and Monthly Progress */}
      <div className="px-3 py-4">
        <div className="flex justify-between mb-6">
          <div className="bg-white rounded-lg p-4 flex-1 mr-2 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">THỐNG KÊ HÔM NAY</h3>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-gray-600 text-sm">Tiền thu</p>
                <p className="text-xl font-bold text-green-600">{formatCurrencyFn(todayRevenue)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Món bán ra</p>
                <p className="text-xl font-bold text-green-600">{todayItemsSold}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Khách hàng</p>
                <p className="text-xl font-bold text-green-600">{todayCustomers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 flex-1 ml-2 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">TIẾN ĐỘ DOANH THU THÁNG</h3>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-800">{formatCurrencyFn(mayRevenue)}</p>
              <div className="flex items-center">
                <p className="mr-2 text-lg font-semibold" style={{ color: progressColor }}>
                  {actualProgress.toFixed(1)}%
                </p>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="30" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    fill="none"
                    stroke={progressColor}
                    strokeWidth="4"
                    strokeDasharray="188.5"
                    strokeDashoffset={188.5 - (displayProgress / 100) * 188.5}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-2">Mục tiêu: {formatCurrencyFn(monthlyGoal)}</p>
            <button
              onClick={() => setShowGoalModal(true)}
              className="bg-green-500 px-4 py-2 rounded-full mt-4 text-white font-semibold mx-auto block"
            >
              Thiết lập mục tiêu
            </button>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Doanh Thu Gần Đây (Triệu VND)</h3>
          <Bar
            data={{
              labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
              datasets: [{
                label: 'Doanh thu (Triệu VND)',
                data: Object.values(monthlyRevenue).map((val) => val / 1000000),
                backgroundColor: '#00b14f',
                borderRadius: 4,
              }],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false }, title: { display: false } },
              scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Triệu VND' } },
                x: { title: { display: true, text: 'Tháng' } },
              },
            }}
          />
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-3">
        <h3 className="text-lg font-semibold mb-4">Lịch Sử Giao Dịch</h3>
        <div className="mx-1 mt-1">
          <p className="text-sm font-medium text-gray-700 mb-1">Chọn ngày</p>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={onWebDateChange}
              max={new Date().toISOString().split('T')[0]}
              className="bg-white p-3 rounded-lg border border-gray-200 text-base text-gray-800 w-36"
            />
            {dateFilterMode === 'day' && (
              <button
                onClick={() => setDateFilterMode('month')}
                className="ml-2 bg-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700"
              >
                Quay lại lọc theo tháng
              </button>
            )}
          </div>
        </div>

        <div className="flex mt-4 px-1 space-x-2 overflow-x-auto">
          {['All', 'Đã thanh toán', 'Đang xử lý', 'Đã hủy'].map((status) => (
            <button
              key={status}
              onClick={() => { setFilter(status); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full ${filter === status ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mx-1 mt-4 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold">Lịch sử giao dịch</h3>
            <button
              onClick={() => setShowMonthPicker(true)}
              className="flex items-center bg-green-50 py-1.5 px-3 rounded-lg border border-green-200"
            >
              <span className="text-sm font-medium text-green-700 mr-1">
                Tháng {selectedMonth + 1}/{selectedYear}
              </span>
              <ChevronDownIcon className="h-4 w-4 text-green-700" />
            </button>
          </div>
          <p className="text-sm text-gray-500 px-4 pt-2 pb-3">
            Tổng cộng: {filteredTransactions.length} giao dịch
          </p>
          <div className="flex bg-gray-50 px-4 py-3">
            <span className="text-xs font-medium text-gray-500 w-20">Mã đơn</span>
            <div className="flex-1 flex justify-between">
              <span className="text-xs font-medium text-gray-500 w-24">Ngày</span>
              <span className="text-xs font-medium text-gray-500 w-16 text-right">Tổng tiền</span>
              <span className="text-xs font-medium text-gray-500 w-16">Trạng thái</span>
            </div>
          </div>
          {paginatedTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarIcon className="h-10 w-10 text-gray-300 mx-auto" />
              <p className="text-gray-500 mt-2">Không có giao dịch nào</p>
            </div>
          ) : (
            paginatedTransactions.map((item) => (
              <div key={item.id} className="flex py-3 px-4 border-b border-gray-100 items-center">
                <div className="w-20">
                  <p className="text-sm font-medium text-gray-900">{item.id}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <p className="text-sm text-gray-700 w-24">
                    {item.date.toLocaleDateString('vi-VN', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-700 w-16 text-right">{formatCurrencyFn(item.total)}</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs text-center ${
                      item.status === 'Đang xử lý'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.status === 'Đã hủy'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          )}
          {filteredTransactions.length > 5 && (
            <div className="flex justify-center items-center my-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`p-2 mx-1 ${currentPage === 1 ? 'opacity-50' : ''}`}
              >
                <ChevronLeftIcon className={`h-5 w-5 ${currentPage === 1 ? 'text-gray-400' : 'text-green-600'}`} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full mx-1 flex items-center justify-center ${
                    currentPage === page ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 mx-1 ${currentPage === totalPages ? 'opacity-50' : ''}`}
              >
                <ChevronRightIcon className={`h-5 w-5 ${currentPage === totalPages ? 'text-gray-400' : 'text-green-600'}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-11/12 max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Thiết lập mục tiêu tháng</h3>
            <p className="text-gray-600 mb-2">Nhập số tiền mục tiêu (VND):</p>
            <input
              type="number"
              className="border border-gray-700 p-3 rounded-lg mb-4 w-full bg-white text-sm"
              placeholder="VD: 1000000"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                onClick={handleSetGoal}
                className="bg-green-600 px-6 py-2 rounded-full flex-1 mr-2 text-white font-semibold"
              >
                Lưu
              </button>
              <button
                onClick={() => setShowGoalModal(false)}
                className="bg-gray-500 px-6 py-2 rounded-full flex-1 ml-2 text-white font-semibold"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Month Picker Modal */}
      {showMonthPicker && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Chọn tháng</h3>
              <button onClick={() => setShowMonthPicker(false)}>
                <XMarkIcon className="h-6 w-5 text-gray-600" />
              </button>
            </div>
            {availableYears.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Không có dữ liệu tháng nào</p>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-4 py-2 rounded-lg ${
                          selectedYear === year ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  {allMonths.map((item) => {
                    const hasTransactions = availableMonths.some(
                      (m) => m.month === item.month && m.year === selectedYear
                    );
                    return (
                      <button
                        key={item.month}
                        onClick={() => {
                          setSelectedMonth(item.month);
                          setShowMonthPicker(false);
                          setDateFilterMode('month');
                        }}
                        disabled={!hasTransactions}
                        className={`w-[30%] m-1 p-3 rounded-lg ${
                          selectedMonth === item.month
                            ? 'bg-green-600 text-white'
                            : hasTransactions
                            ? 'bg-white border border-gray-200 text-gray-800'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

StatisticsSection.propTypes = {
  transactions: PropTypes.array.isRequired,
  monthlyGoal: PropTypes.number.isRequired,
  setMonthlyGoal: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  setSelectedDate: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  selectedMonth: PropTypes.number.isRequired,
  setSelectedMonth: PropTypes.func.isRequired,
  selectedYear: PropTypes.number.isRequired,
  setSelectedYear: PropTypes.func.isRequired,
  formatCurrency: PropTypes.func, // Bỏ isRequired
};

export default StatisticsSection;
