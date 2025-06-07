// home.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import StatisticsSection from '../components/StatisticsSection';
import transactionData from '../data/transactions';

const Home = () => {
  const [monthlyGoal, setMonthlyGoal] = useState(1000000);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const formatCurrency = (amount) => {
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
    if (isNaN(numericAmount)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
      numericAmount
    );
  };

  if (!transactionData || !Array.isArray(transactionData)) {
    console.error('transactionData is not valid:', transactionData);
    return (
      <div className="bg-white flex-1 overflow-y-auto min-h-screen">
        <Header />
        <div>Không có dữ liệu giao dịch. Vui lòng kiểm tra file transactions.js</div>
      </div>
    );
  }

  return (
    <div className="bg-white flex-1 overflow-y-auto min-h-screen">
      <Header />
      <StatisticsSection
        transactions={transactionData}
        monthlyGoal={monthlyGoal}
        setMonthlyGoal={setMonthlyGoal}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        filter={filter}
        setFilter={setFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default Home;