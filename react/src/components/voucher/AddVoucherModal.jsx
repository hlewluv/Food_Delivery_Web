import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';

const AddVoucherModal = ({ showAddVoucherModal, setShowAddVoucherModal, setVouchers, isLoading, setIsLoading }) => {
  const [newVoucherData, setNewVoucherData] = useState({
    _id: '',
    name: '',
    discount: '',
    minOrder: '',
    expiryDate: '',
    image: null,
    status: 'pending',
  });

  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowAddVoucherModal(false);
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
      setNewVoucherData({ ...newVoucherData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const validateInputs = () => {
    if (!newVoucherData.name.trim()) {
      alert('Tên voucher không được để trống.');
      return false;
    }
    const discountValue = parseFloat(newVoucherData.discount);
    if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      alert('Giảm giá phải là số từ 1 đến 100.');
      return false;
    }
    const minOrderValue = parseFloat(newVoucherData.minOrder.replace(/,/g, ''));
    if (isNaN(minOrderValue) || minOrderValue < 0) {
      alert('Đơn tối thiểu phải là số không âm.');
      return false;
    }
    if (!newVoucherData.expiryDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      alert('Ngày hết hạn phải có định dạng DD/MM/YYYY.');
      return false;
    }
    return true;
  };

  const handleAddVoucher = () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const newVoucher = {
        _id: `voucher_${Date.now()}`,
        name: newVoucherData.name.trim(),
        discount: `${parseFloat(newVoucherData.discount)}%`,
        minOrder: `${parseFloat(newVoucherData.minOrder.replace(/,/g, '')).toLocaleString('vi-VN')}đ`,
        expiryDate: `HSD: ${newVoucherData.expiryDate}`,
        image: newVoucherData.image,
        status: 'pending',
      };

      console.log('Sending voucher creation request to admin:', newVoucher);
      setVouchers((prev) => [...prev, newVoucher]);
      alert('Yêu cầu tạo voucher đã được gửi để admin phê duyệt.');
      setShowAddVoucherModal(false);
      setNewVoucherData({
        _id: '',
        name: '',
        discount: '',
        minOrder: '',
        expiryDate: '',
        image: null,
        status: 'pending',
      });
    } catch (error) {
      console.error('Error creating voucher:', error);
      alert('Không thể gửi yêu cầu tạo voucher. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center ${
        showAddVoucherModal ? 'block' : 'hidden'
      }`}
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg overflow-hidden w-full max-w-2xl max-h-[90vh]"
      >
        <div className="p-5 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-800">Thêm Voucher Mới</span>
        </div>
        <div className="flex p-5">
          <div className="w-1/3 pr-4 flex justify-start pt-10">
            <div className="items-center">
              <div className="relative mb-2">
                <img
                  src={newVoucherData.image || 'https://via.placeholder.com/200x160'}
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
                  Chọn ảnh
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={pickImage}
                  disabled={isLoading}
                />
              </label>
              {newVoucherData.image && (
                <button
                  onClick={() => setNewVoucherData({ ...newVoucherData, image: null })}
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
                value={newVoucherData.name}
                onChange={(e) => setNewVoucherData({ ...newVoucherData, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700 block mb-1">Giảm Giá (%)</span>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Nhập phần trăm giảm giá"
                value={newVoucherData.discount}
                onChange={(e) => setNewVoucherData({ ...newVoucherData, discount: e.target.value })}
                type="number"
              />
            </div>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700 block mb-1">Đơn Tối Thiểu (đ)</span>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Nhập giá trị đơn tối thiểu"
                value={newVoucherData.minOrder}
                onChange={(e) => setNewVoucherData({ ...newVoucherData, minOrder: e.target.value })}
                type="number"
              />
            </div>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700 block mb-1">Ngày Hết Hạn</span>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="VD: 30/06/2025"
                value={newVoucherData.expiryDate}
                onChange={(e) => setNewVoucherData({ ...newVoucherData, expiryDate: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddVoucher}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700"
                disabled={isLoading}
              >
                Gửi Yêu Cầu
              </button>
              <button
                onClick={() => setShowAddVoucherModal(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600"
                disabled={isLoading}
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

export { AddVoucherModal };