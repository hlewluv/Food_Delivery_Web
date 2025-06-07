import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { AddVoucherModal } from '../components/voucher/AddVoucherModal';
import EditVoucherModal from '../components/voucher/EditVoucherModal';

// Define interfaces
const Voucher = {
  _id: String,
  name: String,
  discount: String,
  minOrder: String,
  expiryDate: String,
  image: String || null,
  // eslint-disable-next-line no-constant-binary-expression
  status: 'pending' || 'approved' || 'rejected'
};

// Hardcoded voucher data
const initialVouchers = [
  {
    _id: '1',
    name: 'Giảm giá 20% cho đơn đầu tiên',
    discount: '20%',
    minOrder: '100,000đ',
    expiryDate: 'HSD: 30/06/2025',
    image: null,
    status: 'approved',
  },
  {
    _id: '2',
    name: 'Ưu đãi cuối tuần',
    discount: '15%',
    minOrder: '200,000đ',
    expiryDate: 'HSD: 15/07/2025',
    image: 'https://via.placeholder.com/200x160',
    status: 'pending',
  },
];

const VoucherScreen = () => {
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [showEditVoucherModal, setShowEditVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [isLoading, setIsLoading] = useState(false);

  const openEditModal = (voucher) => {
    setSelectedVoucher(voucher);
    setShowEditVoucherModal(true);
  };

  const pendingVouchers = vouchers.filter(voucher => voucher.status === 'pending');
  const approvedVouchers = vouchers.filter(voucher => voucher.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow">
        <button
          onClick={() => window.history.back()}
          className="p-2"
          aria-label="Quay lại"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <span className="flex-1 text-center text-xl font-bold text-gray-900">
          Quản lý Voucher
        </span>
      </div>

      {/* Voucher List */}
      <div className="max-h-[calc(100vh-80px)] overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-semibold text-gray-900">
            Voucher Nhà Hàng
          </span>
          <button
            onClick={() => setShowAddVoucherModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700"
            aria-label="Thêm voucher mới"
          >
            <PlusIcon className="w-5 h-5 inline mr-1" /> Thêm
          </button>
        </div>

        {/* Pending Vouchers Section */}
        {pendingVouchers.length > 0 && (
          <div className="mb-6">
            <span className="text-xl font-semibold text-gray-900 mb-4 block">
              Voucher Đang Chờ Phê Duyệt
            </span>
            {pendingVouchers.map((voucher) => (
              <div
                key={voucher._id}
                className="bg-yellow-50 rounded-xl p-4 mb-4 shadow-sm flex items-center"
              >
                {voucher.image ? (
                  <img
                    src={voucher.image}
                    className="w-16 h-16 rounded-lg mr-4 object-cover"
                    alt="Voucher"
                  />
                ) : (
                  <div className="bg-yellow-200 rounded-lg w-16 h-16 flex items-center justify-center mr-4">
                    <span className="text-gray-800 font-bold text-lg">{voucher.discount}</span>
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-lg font-semibold text-gray-900">{voucher.name}</span>
                  <p className="text-gray-600 text-sm">Đơn tối thiểu: {voucher.minOrder}</p>
                  <p className="text-gray-600 text-sm">{voucher.expiryDate}</p>
                  <p className="text-yellow-600 text-sm font-medium mt-1">
                    Đang chờ admin phê duyệt...
                  </p>
                </div>
                <button
                  onClick={() => openEditModal(voucher)}
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
                  aria-label={`Chỉnh sửa voucher ${voucher.name}`}
                >
                  Sửa
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Approved Vouchers Section */}
        {approvedVouchers.length > 0 && (
          <div>
            <span className="text-xl font-semibold text-gray-900 mb-4 block">
              Voucher Đã Phê Duyệt
            </span>
            {approvedVouchers.map((voucher) => (
              <div
                key={voucher._id}
                className="bg-white rounded-xl p-4 mb-4 shadow-sm flex items-center"
              >
                {voucher.image ? (
                  <img
                    src={voucher.image}
                    className="w-16 h-16 rounded-lg mr-4 object-cover"
                    alt="Voucher"
                  />
                ) : (
                  <div className="bg-green-600 rounded-lg w-16 h-16 flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">{voucher.discount}</span>
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-lg font-semibold text-gray-900">{voucher.name}</span>
                  <p className="text-gray-600 text-sm">Đơn tối thiểu: {voucher.minOrder}</p>
                  <p className="text-gray-600 text-sm">{voucher.expiryDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center">
            <span className="text-gray-600">Loading...</span>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddVoucherModal
        showAddVoucherModal={showAddVoucherModal}
        setShowAddVoucherModal={setShowAddVoucherModal}
        setVouchers={setVouchers}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      {selectedVoucher && (
        <EditVoucherModal
          showEditVoucherModal={showEditVoucherModal}
          setShowEditVoucherModal={setShowEditVoucherModal}
          selectedVoucher={selectedVoucher}
          setVouchers={setVouchers}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default VoucherScreen;