import React, { useState, useEffect } from "react";
import { X, Check, XCircle } from "lucide-react";

const Biker = () => {
  const [selectedTab, setSelectedTab] = useState("Approved");
  const [bikers, setBikers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBiker, setSelectedBiker] = useState(null);
  const [showApprovalForm, setShowApprovalForm] = useState(false);

  // Hardcoded biker data with additional details
  const mockBikers = [
    {
      id: 1,
      username: "biker1",
      first_name: "Mike",
      last_name: "Wilson",
      email: "mike.wilson@example.com",
      phone: "0901234567",
      cccd: "123456789012",
      vehicle_type: "Xe máy",
      license_plate: "59A1-12345",
      role: { role_name: "Biker" },
      status: "Approved",
    },
    {
      id: 2,
      username: "biker2",
      first_name: "Sarah",
      last_name: "Lee",
      email: "sarah.lee@example.com",
      phone: "0912345678",
      cccd: "234567890123",
      vehicle_type: "Xe máy",
      license_plate: "59B2-23456",
      role: { role_name: "Biker" },
      status: "Approved",
    },
    {
      id: 3,
      username: "biker3",
      first_name: "Tom",
      last_name: "Nguyen",
      email: "tom.nguyen@example.com",
      phone: "0923456789",
      cccd: "345678901234",
      vehicle_type: "Xe máy",
      license_plate: "59C3-34567",
      role: { role_name: "Biker" },
      status: "Pending",
    },
    {
      id: 4,
      username: "biker4",
      first_name: "Emily",
      last_name: "Tran",
      email: "emily.tran@example.com",
      phone: "0934567890",
      cccd: "456789012345",
      vehicle_type: "Xe máy",
      license_plate: "59D4-45678",
      role: { role_name: "Biker" },
      status: "Pending",
    },
  ];

  useEffect(() => {
    // Simulate loading with a delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      setBikers(mockBikers);
      setIsLoading(false);
    }, 1000); // 1-second delay to mimic API call

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // Filter bikers based on selected tab
  const filteredBikers = bikers.filter((biker) => biker.status === selectedTab);

  const handleRowClick = (biker) => {
    if (selectedTab === "Pending") {
      setSelectedBiker(biker);
      setShowApprovalForm(true);
    }
  };

  const handleApprove = () => {
    if (selectedBiker) {
      setBikers((prevBikers) =>
        prevBikers.map((biker) =>
          biker.id === selectedBiker.id
            ? { ...biker, status: "Approved" }
            : biker
        )
      );
      setShowApprovalForm(false);
      setSelectedBiker(null);
    }
  };

  const handleReject = () => {
    if (selectedBiker) {
      setBikers((prevBikers) =>
        prevBikers.filter((biker) => biker.id !== selectedBiker.id)
      );
      setShowApprovalForm(false);
      setSelectedBiker(null);
    }
  };

  const closeForm = () => {
    setShowApprovalForm(false);
    setSelectedBiker(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Biker Management
        </h1>
        <p className="text-gray-600 mb-6">
          Manage approved and pending bikers for the platform.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {["Approved", "Pending"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 p-3 text-center text-lg font-medium ${
                selectedTab === tab
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-800 hover:text-green-500"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab === "Approved" ? "Đã duyệt" : "Đang chờ xét duyệt"}
            </button>
          ))}
        </div>

        {/* Click hint for pending tab */}
        {selectedTab === "Pending" &&
          !isLoading &&
          filteredBikers.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                💡 Click vào một dòng để xem chi tiết và xét duyệt
              </p>
            </div>
          )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent mr-3"></div>
            <span className="text-gray-600">Loading bikers...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBikers.length === 0 && (
          <p className="text-gray-600">
            {selectedTab === "Approved"
              ? "No approved bikers found."
              : "No pending bikers found."}
          </p>
        )}

        {/* Biker List */}
        {!isLoading && filteredBikers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl">
              <thead>
                <tr className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <th className="py-3 px-4 text-left font-semibold">
                    Username
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">
                    First Name
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">
                    Last Name
                  </th>
                  <th className="py-3 px-4 text-left font-semibold">Email</th>
                  <th className="py-3 px-4 text-left font-semibold">Role</th>
                  <th className="py-3 px-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBikers.map((biker) => (
                  <tr
                    key={biker.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      selectedTab === "Pending"
                        ? "cursor-pointer hover:bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleRowClick(biker)}
                  >
                    <td className="py-3 px-4 text-gray-700">
                      {biker.username}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {biker.first_name}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {biker.last_name}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{biker.email}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {biker.role?.role_name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{biker.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval Form Modal */}
      {showApprovalForm && selectedBiker && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Xét duyệt Biker
                </h2>
                <button
                  onClick={closeForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">
                        {selectedBiker.first_name} {selectedBiker.last_name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">
                        {selectedBiker.username}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CCCD/CMND
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">
                        {selectedBiker.cccd}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">
                        {selectedBiker.phone}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">
                        {selectedBiker.email}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại xe
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">
                        {selectedBiker.vehicle_type}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biển số xe
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <span className="text-gray-900 font-mono text-lg">
                      {selectedBiker.license_plate}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                  <button
                    onClick={handleApprove}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Duyệt
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Từ chối
                  </button>
                  <button
                    onClick={closeForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Biker;
