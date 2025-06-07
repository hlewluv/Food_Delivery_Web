import React, { useMemo, useState } from 'react';
import { summarizeSchedule, getCurrentDay } from '../staff/types';

const StaffList = ({
  staffList,
  filterDay,
  isLoading,
  setStaffList,
  setSelectedStaff,
  setShowEditStaffModal,
  setIsLoading,
  setTableRenderKey,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const filteredStaff = useMemo(() => {
    const result =
      filterDay === 'all'
        ? staffList
        : staffList.filter((staff) => staff.schedule[filterDay] !== 'Nghỉ');
    console.log('Computed filteredStaff:', result);
    return result;
  }, [staffList, filterDay]);

  const openEditModal = (staff) => {
    setSelectedStaff(staff);
    setShowEditStaffModal(true);
  };

  const toggleLeaveStatus = (staff) => {
    const currentDay = getCurrentDay();
    if (
      staff.status !== 'approved' ||
      !staff.schedule[currentDay] ||
      staff.schedule[currentDay] === 'Nghỉ'
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const newWorkStatus =
        staff.workStatus === 'on-leave'
          ? staff.schedule[currentDay] && staff.schedule[currentDay] !== 'Nghỉ'
            ? 'working'
            : 'no-schedule'
          : 'on-leave';
      const updatedStaff = { ...staff, workStatus: newWorkStatus };
      setStaffList((prev) => prev.map((s) => (s.id === staff.id ? updatedStaff : s)));
    } catch (error) {
      console.error('Error toggling leave status:', error);
      alert('Lỗi: Không thể thay đổi trạng thái. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStaff = (staff) => {
    console.log(`Delete button pressed for ${staff.name} (ID: ${staff.id})`);
    setStaffToDelete(staff);
    setShowDeleteModal(true);
  };

  const confirmDeleteStaff = () => {
    if (!staffToDelete) return;
    console.log('Delete confirmed for:', staffToDelete.id);
    setIsLoading(true);
    try {
      setStaffList((prev) => {
        const updatedList = prev.filter((s) => s.id !== staffToDelete.id);
        console.log(`Deleted staff: ${staffToDelete.name} (ID: ${staffToDelete.id})`);
        console.log('Updated staffList:', updatedList);
        return updatedList;
      });
      setTableRenderKey((prev) => prev + 1);
      setShowDeleteModal(false);
      setStaffToDelete(null);
    } catch (error) {
      console.error('Error deleting staff:', error);
    } finally {
      setTimeout(() => {
        console.log('Clearing isLoading after delete');
        setIsLoading(false);
      }, 100);
    }
  };

  const renderStaffItem = (staff) => {
    const currentDay = getCurrentDay();
    const workStatus =
      staff.workStatus === 'on-leave'
        ? 'on-leave'
        : staff.schedule[currentDay] && staff.schedule[currentDay] !== 'Nghỉ'
        ? 'working'
        : 'no-schedule';
    const canToggleStatus =
      staff.status === 'approved' &&
      staff.schedule[currentDay] &&
      staff.schedule[currentDay] !== 'Nghỉ';
      
    return (
      <tr 
        key={staff.id} 
        className={`${staff.status === 'pending' ? 'bg-yellow-50' : 'bg-white'} border-b border-gray-200`}
      >
        <td className="w-20 p-3 text-gray-600 text-center">{staff.id}</td>
        <td className="w-36 p-3 text-gray-600 text-center">{staff.name}</td>
        <td className="w-20 p-3 flex items-center justify-center">
          <img
            src={staff.image || 'https://via.placeholder.com/40x40'}
            className="w-10 h-10 rounded-full object-cover"
            alt={staff.name}
          />
        </td>
        <td className="w-28 p-3 text-gray-600 text-center">
          {staff.role === 'waiter'
            ? 'Phục vụ'
            : staff.role === 'chef'
            ? 'Đầu bếp'
            : staff.role === 'cashier'
            ? 'Thu ngân'
            : 'Quản lý'}
        </td>
        <td className="w-36 p-3 text-gray-600 text-center">{staff.phone}</td>
        <td className="w-72 p-3 text-gray-600 text-center">{summarizeSchedule(staff.schedule)}</td>
        <td className="w-36 p-3 text-center">
          <button
            onClick={() => toggleLeaveStatus(staff)}
            disabled={!canToggleStatus || isLoading}
            className={`${
              workStatus === 'working'
                ? 'text-green-600'
                : workStatus === 'on-leave'
                ? 'text-blue-600'
                : 'text-red-600'
            } ${canToggleStatus && !isLoading ? 'underline' : ''}`}
            aria-label={`Thay đổi trạng thái cho ${staff.name}`}
          >
            {workStatus === 'working'
              ? 'Đang làm'
              : workStatus === 'on-leave'
              ? 'Nghỉ có phép'
              : 'Không có lịch'}
          </button>
        </td>
        <td className="w-56 p-3 flex justify-center space-x-2">
          <button
            onClick={() => openEditModal(staff)}
            className="bg-green-600 px-2 py-1 rounded mr-1 text-white text-xs"
            disabled={isLoading}
            aria-label={`Chỉnh sửa nhân viên ${staff.name}`}
          >
            Sửa
          </button>
          <button
            onClick={() => handleDeleteStaff(staff)}
            className="bg-red-500 px-2 py-1 rounded mr-1 text-white text-xs"
            disabled={isLoading}
            aria-label={`Xóa nhân viên ${staff.name}`}
          >
            Xóa
          </button>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="w-20 p-3 font-semibold text-gray-700 text-center">ID</th>
              <th className="w-36 p-3 font-semibold text-gray-700 text-center">Tên</th>
              <th className="w-20 p-3 font-semibold text-gray-700 text-center">Ảnh</th>
              <th className="w-28 p-3 font-semibold text-gray-700 text-center">Vai trò</th>
              <th className="w-36 p-3 font-semibold text-gray-700 text-center">Số điện thoại</th>
              <th className="w-72 p-3 font-semibold text-gray-700 text-center">Lịch làm việc</th>
              <th className="w-36 p-3 font-semibold text-gray-700 text-center">Trạng thái</th>
              <th className="w-56 p-3 font-semibold text-gray-700 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => renderStaffItem(staff))}
          </tbody>
        </table>
      </div>

      {filteredStaff.length === 0 && (
        <div className="p-4 text-gray-600 text-center">
          Không có nhân viên làm việc vào ngày{' '}
          {filterDay === 'all'
            ? 'hiện tại'
            : filterDay === 'monday'
            ? 'Thứ Hai'
            : filterDay === 'tuesday'
            ? 'Thứ Ba'
            : filterDay === 'wednesday'
            ? 'Thứ Tư'
            : filterDay === 'thursday'
            ? 'Thứ Năm'
            : filterDay === 'friday'
            ? 'Thứ Sáu'
            : filterDay === 'saturday'
            ? 'Thứ Bảy'
            : 'Chủ Nhật'}
          .
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-5 w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Xác nhận xóa nhân viên
            </h3>
            <p className="text-gray-600 mb-5">
              Bạn có chắc muốn xóa nhân viên{' '}
              <span className="font-medium">{staffToDelete?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setStaffToDelete(null);
                }}
                className="bg-gray-500 px-4 py-2 rounded-lg text-white font-medium"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                onClick={confirmDeleteStaff}
                className={`px-4 py-2 rounded-lg ${isLoading ? 'bg-red-400' : 'bg-red-600'} text-white font-medium`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xóa...
                  </span>
                ) : (
                  'Xác nhận'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffList;