import React, { useState, useEffect, useRef } from 'react';
import { CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';

const EditVoucherModal = ({
  showEditVoucherModal,
  setShowEditVoucherModal,
  selectedVoucher,
  setVouchers,
  isLoading,
  setIsLoading,
}) => {
  const [editVoucherData, setEditVoucherData] = useState({
    _id: '',
    name: '',
    discount: '',
    minOrder: '',
    expiryDate: '',
    image: null,
    status: 'pending',
  });

  const modalRef = useRef(null);

  useEffect(() => {
    if (selectedVoucher) {
      setEditVoucherData({
        _id: selectedVoucher._id,
        name: selectedVoucher.name,
        discount: selectedVoucher.discount.replace('%', ''),
        minOrder: selectedVoucher.minOrder.replace(/[,đ]/g, ''),
        expiryDate: selectedVoucher.expiryDate.replace('HSD: ', ''),
        image: selectedVoucher.image || null,
        status: selectedVoucher.status,
      });
    }
  }, [selectedVoucher]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowEditVoucherModal(false);
    }
  };

  const pickImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size / (1024 * 1024) > 2) {
      alert('Kích thước ảnh không được vượt quá 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditVoucherData({ ...editVoucherData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const validateInputs = () => {
    if (!editVoucherData.name.trim()) {
      alert('Tên voucher không được để trống.');
      return false;
    }
    const discountValue = parseFloat(editVoucherData.discount);
    if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      alert('Giảm giá phải là số từ 1 đến 100.');
      return false;
    }
    const minOrderValue = parseFloat(editVoucherData.minOrder.replace(/,/g, ''));
    if (isNaN(minOrderValue) || minOrderValue < 0) {
      alert('Đơn tối thiểu phải là số không âm.');
      return false;
    }
    if (!editVoucherData.expiryDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      alert('Ngày hết hạn phải có định dạng DD/MM/YYYY.');
      return false;
    }
    return true;
  };

  const saveVoucherChanges = () => {
    if (!validateInputs()) return;
    if (selectedVoucher.status !== 'pending') {
      alert('Chỉ có thể chỉnh sửa voucher đang chờ phê duyệt!');
      return;
    }

    setIsLoading(true);
    try {
      const updatedVoucher = {
        _id: selectedVoucher._id,
        name: editVoucherData.name.trim(),
        discount: `${parseFloat(editVoucherData.discount)}%`,
        minOrder: `${parseFloat(editVoucherData.minOrder.replace(/,/g, '')).toLocaleString('vi-VN')}đ`,
        expiryDate: `HSD: ${editVoucherData.expiryDate}`,
        image: editVoucherData.image,
        status: 'pending',
      };

      console.log('Sending voucher update request to admin:', updatedVoucher);
      setVouchers((prev) =>
        prev.map((v) => (v._id === selectedVoucher._id ? updatedVoucher : v))
      );
      alert('Yêu cầu cập nhật voucher đã được gửi để admin phê duyệt.');
      setShowEditVoucherModal(false);
    } catch (error) {
      console.error('Error updating voucher:', error);
      alert('Không thể gửi yêu cầu cập nhật voucher. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVoucher = () => {
    if (selectedVoucher.status !== 'pending') {
      alert('Chỉ có thể xóa voucher đang chờ phê duyệt!');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sending voucher deletion request to admin:', selectedVoucher);
      setVouchers((prev) => prev.filter((v) => v._id !== selectedVoucher._id));
      alert('Yêu cầu xóa voucher đã được gửi để admin phê duyệt.');
      setShowEditVoucherModal(false);
    } catch (error) {
      console.error('Error deleting voucher:', error);
      alert('Không thể gửi yêu cầu xóa voucher. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center ${
        showEditVoucherModal ? 'block' : 'hidden'
      }`}
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg overflow-hidden w-full max-w-2xl max-h-[90vh]"
      >
        <div className="p-5 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-800">Chỉnh sửa Voucher</span>
        </div>
        <div className="flex p-5">
          <div className="w-1/3 pr-4 flex justify-start pt-10">
            <div className="items-center">
              <div className="relative mb-2">
                <img
                  src={editVoucherData.image || 'https://via.placeholder.com/200x160'}
                  className="w-48 h-40 rounded-lg bg-gray-100 object-cover"
                  alt="Voucher Preview"
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center rounded-lg">
                    <span className="text-white">Loading...</span>
                  </div>
                )}
              </div>
              <label
                className={`border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-center w-48 bg-${
                  isLoading ? 'gray-100' : 'white'
                } cursor-${isLoading ? 'not-allowed' : 'pointer'}`}
              >
                <CloudArrowUpIcon
                  className={`w-4 h-4 mr-2 text-${isLoading ? 'gray-400' : 'gray-600'}`}
                />
                <span className={`text-sm ${isLoading ? 'text-gray-400' : 'text-gray-700'}`}>
                  {editVoucherData.image ? 'Đổi ảnh' : 'Chọn ảnh'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={pickImage}
                  disabled={isLoading}
                />
              </label>
              {editVoucherData.image && (
                <button
                  onClick={() => setEditVoucherData({ ...editVoucherData, image: null })}
                  className="flex items-center mt-2"
                >
                  <TrashIcon className="w-4 h-4 text-red-500" />
                  <span className="text-red-500 text-sm ml-1">Xóa ảnh</span>
                </button>
              )}
            </div>
          </div>
          <div className="w-2/3 pl-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700 block mb-1">Tên Voucher</span>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Nhập tên voucher"
                value={editVoucherData.name}
                onChange={(e) => setEditVoucherData({ ...editVoucherData, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700 block mb-1">Giảm Giá (%)</span>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Nhập phần trăm giảm giá"
                value={editVoucherData.discount}
                onChange={(e) => setEditVoucherData({ ...editVoucherData, discount: e.target.value })}
                type="number"
              />
            </div>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700 block mb-1">Đơn Tối Thiểu (đ)</span>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Nhập giá trị đơn tối thiểu"
                value={editVoucherData.minOrder}
                onChange={(e) => setEditVoucherData({ ...editVoucherData, minOrder: e.target.value })}
                type="number"
              />
            </div>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700 block mb-1">Ngày Hết Hạn</span>
              <input
                className="w-full border border-gray-300 rounded-lg rounded-lg px-3 py-2 text-sm"
                placeholder="VD: 30/06/2025"
                value={editVoucherData.expiryDate}
                onChange={(e) => setEditVoucherData({ ...editVoucherData, expiryDate: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveVoucherChanges}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700"
                disabled={isLoading}
              >
                Hoàn tất
              </button>
              <button
                onClick={handleDeleteVoucher}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700"
                disabled={isLoading}
              >
                Yêu Cầu Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVoucherModal;