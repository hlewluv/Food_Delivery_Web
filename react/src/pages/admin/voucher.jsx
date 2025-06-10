import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, PlusIcon, CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { AddVoucherModal } from '../../components/voucher/AddVoucherModal';

// Define interfaces
const Voucher = {
  _id: String,
  name: String,
  discount: String,
  minOrder: String,
  expiryDate: String,
  image: String | null,
  status: 'pending' | 'approved' | 'rejected',
};

// ReviewVoucherModal Component
const ReviewVoucherModal = ({
  showReviewVoucherModal,
  setShowReviewVoucherModal,
  selectedVoucher,
  setVouchers,
  isLoading,
  setIsLoading,
}) => {
  const handleApprove = () => {
    if (selectedVoucher) {
      setIsLoading(true);
      setTimeout(() => {
        setVouchers((prevVouchers) =>
          prevVouchers.map((voucher) =>
            voucher._id === selectedVoucher._id
              ? { ...voucher, status: 'approved' }
              : voucher
          )
        );
        setShowReviewVoucherModal(false);
        setIsLoading(false);
      }, 500); // Simulate API call
    }
  };

  const handleReject = () => {
    if (selectedVoucher) {
      setIsLoading(true);
      setTimeout(() => {
        setVouchers((prevVouchers) =>
          prevVouchers.map((voucher) =>
            voucher._id === selectedVoucher._id
              ? { ...voucher, status: 'rejected' }
              : voucher
          )
        );
        setShowReviewVoucherModal(false);
        setIsLoading(false);
      }, 500); // Simulate API call
    }
  };

  const closeModal = () => {
    setShowReviewVoucherModal(false);
  };

  if (!showReviewVoucherModal || !selectedVoucher) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Xét duyệt Voucher</h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Đóng"
            >
              <XCircleIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Voucher Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Voucher
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-gray-900">{selectedVoucher.name}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giảm giá
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="text-gray-900">{selectedVoucher.discount}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đơn tối thiểu
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="text-gray-900">{selectedVoucher.minOrder}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày hết hạn
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-gray-900">{selectedVoucher.expiryDate}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                {selectedVoucher.image ? (
                  <img
                    src={selectedVoucher.image}
                    className="w-32 h-32 rounded-lg object-cover"
                    alt="Voucher"
                  />
                ) : (
                  <span className="text-gray-900">Không có hình ảnh</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <span className="text-yellow-600">Đang chờ phê duyệt</span>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <button
                onClick={handleApprove}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <CheckIcon className="w-5 h-5" />
                Phê duyệt
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <XCircleIcon className="w-5 h-5" />
                Từ chối
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
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

const AdminVoucher = () => {
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [showReviewVoucherModal, setShowReviewVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    // Simulate loading with a delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      setVouchers(initialVouchers);
      setIsLoading(false);
    }, 1000); // 1-second delay to mimic API call

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  const openReviewModal = (voucher) => {
    if (voucher.status === 'pending') {
      setSelectedVoucher(voucher);
      setShowReviewVoucherModal(true);
    }
  };

  const pendingVouchers = vouchers.filter((voucher) => voucher.status === 'pending');
  const approvedVouchers = vouchers.filter((voucher) => voucher.status === 'approved');

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
              Voucher Chưa Phê Duyệt
            </span>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                💡 Click vào một voucher để xem chi tiết và xét duyệt
              </p>
            </div>
            {pendingVouchers.map((voucher) => (
              <div
                key={voucher._id}
                className="bg-yellow-50 rounded-xl p-4 mb-4 shadow-sm flex items-center cursor-pointer hover:bg-yellow-100"
                onClick={() => openReviewModal(voucher)}
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
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click from triggering
                    openReviewModal(voucher);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
                  aria-label={`Xét duyệt voucher ${voucher.name}`}
                >
                  Xét duyệt
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
                className="bg-white rounded-xl p-4 mb-4 shadow-sm flex items-center cursor-default"
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

        {/* Rejected Vouchers Section */}
        {vouchers.filter((voucher) => voucher.status === 'rejected').length > 0 && (
          <div>
            <span className="text-xl font-semibold text-gray-900 mb-4 block">
              Voucher Đã Từ Chối
            </span>
            {vouchers
              .filter((voucher) => voucher.status === 'rejected')
              .map((voucher) => (
                <div
                  key={voucher._id}
                  className="bg-red-50 rounded-xl p-4 mb-4 shadow-sm flex items-center cursor-default"
                >
                  {voucher.image ? (
                    <img
                      src={voucher.image}
                      className="w-16 h-16 rounded-lg mr-4 object-cover"
                      alt="Voucher"
                    />
                  ) : (
                    <div className="bg-red-200 rounded-lg w-16 h-16 flex items-center justify-center mr-4">
                      <span className="text-gray-800 font-bold text-lg">{voucher.discount}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <span className="text-lg font-semibold text-gray-900">{voucher.name}</span>
                    <p className="text-gray-600 text-sm">Đơn tối thiểu: {voucher.minOrder}</p>
                    <p className="text-gray-600 text-sm">{voucher.expiryDate}</p>
                    <p className="text-red-600 text-sm font-medium mt-1">Đã bị từ chối</p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent mr-3"></div>
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
      <ReviewVoucherModal
        showReviewVoucherModal={showReviewVoucherModal}
        setShowReviewVoucherModal={setShowReviewVoucherModal}
        selectedVoucher={selectedVoucher}
        setVouchers={setVouchers}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default AdminVoucher;