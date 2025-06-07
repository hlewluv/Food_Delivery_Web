import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddStaffModal from '../components/staff/AddStaffModal';
import EditStaffModal from '../components/staff/EditStaffModal';
import StaffList from '../components/staff/StaffList';
import { initialStaff } from '../components/staff/types';

const StaffScreen = () => {
  const navigate = useNavigate();
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffList, setStaffList] = useState(initialStaff);
  const [isLoading, setIsLoading] = useState(false);
  const [filterDay, setFilterDay] = useState('all');
  // Removed unused tableRenderKey state

  useEffect(() => {
    console.log('isLoading changed:', isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.log('isLoading reset by timeout');
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  useEffect(() => {
    console.log('staffList updated:', staffList);
  }, [staffList]);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow-md">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2"
          aria-label="Quay lại"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-xl font-bold text-gray-900">
          Quản lý Nhân viên
        </h1>
      </div>

      {/* Main Content */}
      <div className="px-2 py-4">
        {/* Filter and Add Staff Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="overflow-x-auto">
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'monday', label: 'Thứ Hai' },
                { key: 'tuesday', label: 'Thứ Ba' },
                { key: 'wednesday', label: 'Thứ Tư' },
                { key: 'thursday', label: 'Thứ Năm' },
                { key: 'friday', label: 'Thứ Sáu' },
                { key: 'saturday', label: 'Thứ Bảy' },
                { key: 'sunday', label: 'Chủ Nhật' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterDay(key)}
                  className={`px-3 py-1 rounded-full mr-2 ${
                    filterDay === key ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowAddStaffModal(true)}
            className="bg-green-600 px-4 py-2 rounded-full"
            aria-label="Thêm nhân viên mới"
          >
            <span className="text-white font-semibold">+ Thêm Nhân viên</span>
          </button>
        </div>

        {/* Staff Table */}
        <StaffList
          staffList={staffList}
          filterDay={filterDay}
          isLoading={isLoading}
          setStaffList={setStaffList}
          setSelectedStaff={setSelectedStaff}
          setShowEditStaffModal={setShowEditStaffModal}
          setIsLoading={setIsLoading}
        />

        {isLoading && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal
        visible={showAddStaffModal}
        setShowAddStaffModal={setShowAddStaffModal}
        setStaffList={setStaffList}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setFilterDay={setFilterDay}
      />

      {/* Edit Staff Modal */}
      {selectedStaff && (
        <EditStaffModal
          visible={showEditStaffModal}
          setShowEditStaffModal={setShowEditStaffModal}
          selectedStaff={selectedStaff}
          setStaffList={setStaffList}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default StaffScreen;