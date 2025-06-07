import React, { useState, useEffect } from 'react';
import { shiftOptions, getCurrentDay } from '../staff/types';

const EditStaffModal = ({
  visible,
  setShowEditStaffModal,
  selectedStaff,
  setStaffList,
  isLoading,
  setIsLoading,
}) => {
  const [editStaffData, setEditStaffData] = useState({ ...selectedStaff });

  useEffect(() => {
    setEditStaffData({ ...selectedStaff });
  }, [selectedStaff]);

  const pickImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditStaffData({ ...editStaffData, image: event.target.result });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateInputs = () => {
    if (!editStaffData.name.trim()) {
      alert('Lỗi: Tên nhân viên không được để trống.');
      return false;
    }
    if (!editStaffData.phone.match(/^\d{10}$/)) {
      alert('Lỗi: Số điện thoại phải có đúng 10 chữ số.');
      return false;
    }
    const hasWorkingDay = Object.values(editStaffData.schedule).some((shift) => shift !== 'Nghỉ');
    if (!hasWorkingDay) {
      alert('Lỗi: Phải có ít nhất một ngày làm việc.');
      return false;
    }
    return true;
  };

  const handleSaveStaff = () => {
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
      const updatedStaff = {
        ...editStaffData,
        name: editStaffData.name.trim(),
        status: 'approved',
        workStatus:
          editStaffData.workStatus === 'on-leave'
            ? 'on-leave'
            : editStaffData.schedule[currentDayKey] && editStaffData.schedule[currentDayKey] !== 'Nghỉ'
            ? 'working'
            : 'no-schedule',
      };
      setStaffList((prev) => prev.map((s) => (s.id === selectedStaff.id ? updatedStaff : s)));
      setShowEditStaffModal(false);
    } catch (error) {
      console.error('Error updating staff:', error);
      alert('Lỗi: Không thể cập nhật nhân viên. Vui lòng thử lại.');
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
            Chỉnh sửa Nhân viên
          </h2>
        </div>
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <img
                  src={editStaffData.image || 'https://via.placeholder.com/100x100'}
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
                <span className="text-gray-600">
                  {editStaffData.image ? 'Đổi ảnh' : 'Chọn ảnh'}
                </span>
              </label>
              {editStaffData.image && (
                <button
                  onClick={() => setEditStaffData({ ...editStaffData, image: null })}
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
                value={editStaffData.name}
                onChange={(e) => setEditStaffData({ ...editStaffData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <div className="flex flex-wrap gap-2">
                {['waiter', 'chef', 'cashier', 'manager'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setEditStaffData({ ...editStaffData, role })}
                    className={`px-3 py-1 rounded-full ${
                      editStaffData.role === role
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
                placeholder="Nhập số điện thoại"
                value={editStaffData.phone}
                onChange={(e) => setEditStaffData({ ...editStaffData, phone: e.target.value })}
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
                            setEditStaffData({
                              ...editStaffData,
                              schedule: { ...editStaffData.schedule, [key]: shift },
                            })
                          }
                          className={`px-3 py-1 rounded-full ${
                            editStaffData.schedule[key] === shift
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
                onClick={handleSaveStaff}
                disabled={isLoading}
                className="flex-1 bg-green-600 py-3 rounded-lg text-white font-medium"
              >
                Lưu
              </button>
              <button
                onClick={() => {
                  setShowEditStaffModal(false);
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

export default EditStaffModal;