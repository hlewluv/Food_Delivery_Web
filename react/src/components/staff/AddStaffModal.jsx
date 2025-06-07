import React, { useState } from 'react';
import { shiftOptions } from '../staff/types';

const AddStaffModal = ({
  visible,
  setShowAddStaffModal,
  setStaffList,
  isLoading,
  setIsLoading,
  setFilterDay,
}) => {
  const [newStaffData, setNewStaffData] = useState({
    id: '',
    name: '',
    role: 'waiter',
    phone: '',
    schedule: {
      monday: 'Nghỉ',
      tuesday: 'Nghỉ',
      wednesday: 'Nghỉ',
      thursday: 'Nghỉ',
      friday: 'Nghỉ',
      saturday: 'Nghỉ',
      sunday: 'Nghỉ',
    },
    image: null,
    status: 'approved',
    workStatus: 'no-schedule',
  });

  const pickImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewStaffData({ ...newStaffData, image: event.target.result });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateInputs = () => {
    if (!newStaffData.name.trim()) {
      alert('Lỗi: Tên nhân viên không được để trống.');
      return false;
    }
    if (!newStaffData.phone.match(/^\d{10}$/)) {
      alert('Lỗi: Số điện thoại phải có đúng 10 chữ số.');
      return false;
    }
    const workingDays = Object.values(newStaffData.schedule).filter((shift) => shift !== 'Nghỉ').length;
    if (workingDays < 3) {
      alert('Lỗi: Phải có ít nhất 3 ngày làm việc (khác Nghỉ).');
      return false;
    }
    return true;
  };

  const handleAddStaff = () => {
    if (!validateInputs()) {
      return;
    }
    setIsLoading(true);
    try {
      const currentDay = new Date().getDay();
      const days = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const currentDayKey = days[currentDay];
      
      setStaffList((prev) => {
        const ids = prev.map((staff) => parseInt(staff.id, 10)).filter((id) => !isNaN(id));
        const maxId = Math.max(...ids, 0);
        const newId = (maxId + 1).toString();
        
        const newStaff = {
          id: newId,
          name: newStaffData.name.trim(),
          role: newStaffData.role,
          phone: newStaffData.phone,
          schedule: { ...newStaffData.schedule },
          image: newStaffData.image,
          status: 'approved',
          workStatus:
            newStaffData.schedule[currentDayKey] && newStaffData.schedule[currentDayKey] !== 'Nghỉ'
              ? 'working'
              : 'no-schedule',
        };
        
        return [...prev, newStaff];
      });
      
      setFilterDay('all');
      setShowAddStaffModal(false);
      setNewStaffData({
        id: '',
        name: '',
        role: 'waiter',
        phone: '',
        schedule: {
          monday: 'Nghỉ',
          tuesday: 'Nghỉ',
          wednesday: 'Nghỉ',
          thursday: 'Nghỉ',
          friday: 'Nghỉ',
          saturday: 'Nghỉ',
          sunday: 'Nghỉ',
        },
        image: null,
        status: 'approved',
        workStatus: 'no-schedule',
      });
    } catch (error) {
      console.error('Error creating staff:', error);
      alert('Lỗi: Không thể thêm nhân viên. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-2xl max-h-[90vh]">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Thêm Nhân viên Mới
          </h2>
        </div>
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <img
                  src={newStaffData.image || 'https://via.placeholder.com/100x100'}
                  className="w-24 h-24 rounded-full object-cover"
                  alt="Ảnh nhân viên"
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-black/30 rounded-full flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <label className="border border-gray-300 rounded-lg px-3 py-2 mt-2 flex items-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={pickImage}
                  className="hidden"
                  disabled={isLoading}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-gray-600">Chọn ảnh</span>
              </label>
              {newStaffData.image && (
                <button
                  onClick={() => setNewStaffData({ ...newStaffData, image: null })}
                  className="flex items-center mt-2 text-red-500 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa ảnh
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên Nhân viên</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                placeholder="Nhập tên nhân viên"
                value={newStaffData.name}
                onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <div className="flex flex-wrap gap-2">
                {['waiter', 'chef', 'cashier', 'manager'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setNewStaffData({ ...newStaffData, role })}
                    className={`px-3 py-1 rounded-full ${
                      newStaffData.role === role
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {role === 'waiter'
                      ? 'Phục vụ'
                      : role === 'chef'
                      ? 'Đầu bếp'
                      : role === 'cashier'
                      ? 'Thu ngân'
                      : 'Quản lý'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                placeholder="Nhập số điện thoại (10 chữ số)"
                value={newStaffData.phone}
                onChange={(e) => setNewStaffData({ ...newStaffData, phone: e.target.value })}
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lịch làm việc</label>
              <div className="space-y-3">
                {[
                  { key: 'monday', label: 'Thứ Hai' },
                  { key: 'tuesday', label: 'Thứ Ba' },
                  { key: 'wednesday', label: 'Thứ Tư' },
                  { key: 'thursday', label: 'Thứ Năm' },
                  { key: 'friday', label: 'Thứ Sáu' },
                  { key: 'saturday', label: 'Thứ Bảy' },
                  { key: 'sunday', label: 'Chủ Nhật' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-600 mb-1">{label}</label>
                    <div className="flex flex-wrap gap-2">
                      {shiftOptions.map((shift) => (
                        <button
                          key={`${key}-${shift}`}
                          onClick={() =>
                            setNewStaffData({
                              ...newStaffData,
                              schedule: { ...newStaffData.schedule, [key]: shift },
                            })
                          }
                          className={`px-3 py-1 rounded-full ${
                            newStaffData.schedule[key] === shift
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {shift}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddStaff}
                disabled={isLoading}
                className={`flex-1 py-3 rounded-lg text-white font-medium ${
                  isLoading ? 'bg-gray-400' : 'bg-green-600'
                }`}
              >
                {isLoading ? 'Đang thêm...' : 'Thêm Nhân Viên'}
              </button>
              <button
                onClick={() => {
                  setShowAddStaffModal(false);
                  setIsLoading(false);
                }}
                disabled={isLoading}
                className="flex-1 bg-gray-500 py-3 rounded-lg text-white font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;