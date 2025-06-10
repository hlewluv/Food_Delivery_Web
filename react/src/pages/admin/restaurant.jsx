import React, { useState, useEffect } from "react";
import { X, Check, XCircle } from "lucide-react";

const Restaurant = () => {
  const [selectedTab, setSelectedTab] = useState("Approved");
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showApprovalForm, setShowApprovalForm] = useState(false);

  // Hardcoded restaurant data
  const mockRestaurants = [
    {
      id: 1,
      name: "Nhà hàng Phở Việt",
      category: "Nhà hàng",
      description: "Phở bò truyền thống với nước dùng thơm ngon.",
      logo: "phoviet.jpg",
      cover_photo: "phoviet-cover.jpg",
      address: {
        street: "123 Nguyễn Huệ",
        ward: "Phường 5",
        district: "Quận 1",
        city: "Hồ Chí Minh",
        gps: { lat: 10.7756, lng: 106.7003 },
        delivery_areas: ["Quận 1", "Quận 3", "Quận 7"],
      },
      legal: {
        representative_cccd: "123456789012",
      },
      contact: {
        contact_name: "Nguyễn Văn A",
        phone: "0901234567",
        email: "phoviet@example.com",
        fanpage: "facebook.com/phoviet",
      },
      operations: {
        hours: "08:00 - 22:00",
        closed_days: "Không có",
        service_type: "Giao hàng / Tại chỗ / Mang đi",
      },
      menu: [
        {
          name: "Phở bò tái",
          description: "Phở bò với thịt tái mềm",
          price: 50000,
          image: "pho-bo-tai.jpg",
          type: "Món chính",
        },
        {
          name: "Nước sâm",
          description: "Nước sâm mát lạnh",
          price: 15000,
          image: "nuoc-sam.jpg",
          type: "Đồ uống",
        },
      ],
      status: "Approved",
    },
    {
      id: 2,
      name: "Quán Cà Phê Sáng",
      category: "Quán cà phê",
      description: "Không gian yên tĩnh, cà phê đậm đà.",
      logo: "cafesang.jpg",
      cover_photo: "cafesang-cover.jpg",
      address: {
        street: "45 Lê Lợi",
        ward: "Phường Bến Nghé",
        district: "Quận 1",
        city: "Hồ Chí Minh",
        gps: { lat: 10.7732, lng: 106.6987 },
        delivery_areas: ["Quận 1", "Quận 4"],
      },
      legal: {
        representative_cccd: "234567890123",
      },
      contact: {
        contact_name: "Trần Thị B",
        phone: "0912345678",
        email: "cafesang@example.com",
        fanpage: "facebook.com/cafesang",
      },
      operations: {
        hours: "07:00 - 20:00",
        closed_days: "Chủ nhật",
        service_type: "Tại chỗ / Mang đi",
      },
      menu: [
        {
          name: "Cà phê đen",
          description: "Cà phê đen nguyên chất",
          price: 25000,
          image: "caphe-den.jpg",
          type: "Đồ uống",
        },
      ],
      status: "Pending",
    },
  ];

  useEffect(() => {
    // Simulate loading with a delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      setRestaurants(mockRestaurants);
      setIsLoading(false);
    }, 1000); // 1-second delay to mimic API call

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // Filter restaurants based on selected tab
  const filteredRestaurants = restaurants.filter(
    (restaurant) => restaurant.status === selectedTab
  );

  const handleRowClick = (restaurant) => {
    if (selectedTab === "Pending") {
      setSelectedRestaurant(restaurant);
      setShowApprovalForm(true);
    }
  };

  const handleApprove = () => {
    if (selectedRestaurant) {
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant.id === selectedRestaurant.id
            ? { ...restaurant, status: "Approved" }
            : restaurant
        )
      );
      setShowApprovalForm(false);
      setSelectedRestaurant(null);
    }
  };

  const handleReject = () => {
    if (selectedRestaurant) {
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter(
          (restaurant) => restaurant.id !== selectedRestaurant.id
        )
      );
      setShowApprovalForm(false);
      setSelectedRestaurant(null);
    }
  };

  const closeForm = () => {
    setShowApprovalForm(false);
    setSelectedRestaurant(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Restaurant Management
        </h1>
        <p className="text-gray-600 mb-6">
          Manage approved and pending restaurants for the platform.
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

        {/* Click hint for Pending tab only */}
        {selectedTab === "Pending" && !isLoading && filteredRestaurants.length > 0 && (
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
            <span className="text-gray-600">Loading restaurants...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredRestaurants.length === 0 && (
          <p className="text-gray-600">
            {selectedTab === "Approved"
              ? "No approved restaurants found."
              : "No pending restaurants found."}
          </p>
        )}

        {/* Restaurant List */}
        {!isLoading && filteredRestaurants.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl">
              <thead>
                <tr className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Category</th>
                  <th className="py-3 px-4 text-left font-semibold">Contact</th>
                  <th className="py-3 px-4 text-left font-semibold">Address</th>
                  <th className="py-3 px-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRestaurants.map((restaurant) => (
                  <tr
                    key={restaurant.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      selectedTab === "Pending"
                        ? "cursor-pointer hover:bg-blue-50"
                        : "cursor-default"
                    }`}
                    onClick={() => handleRowClick(restaurant)}
                  >
                    <td className="py-3 px-4 text-gray-700">
                      {restaurant.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {restaurant.category}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {restaurant.contact.phone}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {restaurant.address.street}, {restaurant.address.district}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {restaurant.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval Form Modal */}
      {showApprovalForm && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Xét duyệt Nhà hàng
                </h2>
                <button
                  onClick={closeForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    1. Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên nhà hàng
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">
                          {selectedRestaurant.name}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại hình kinh doanh
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">
                          {selectedRestaurant.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả ngắn
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">
                        {selectedRestaurant.description}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo và ảnh bìa
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">
                        Logo: {selectedRestaurant.logo}, Ảnh bìa: {selectedRestaurant.cover_photo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address and Delivery Area */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    2. Địa chỉ và khu vực phục vụ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ cụ thể
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">
                          {selectedRestaurant.address.street}, {selectedRestaurant.address.ward}, {selectedRestaurant.address.district}, {selectedRestaurant.address.city}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tọa độ GPS
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">
                          Lat: {selectedRestaurant.address.gps.lat}, Lng: {selectedRestaurant.address.gps.lng}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Khu vực giao hàng
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">
                        {selectedRestaurant.address.delivery_areas.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legal Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    3. Giấy tờ pháp lý
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CMND/CCCD người đại diện
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">
                        {selectedRestaurant.legal.representative_cccd}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    4. Thông tin liên hệ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên người liên hệ
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">
                          {selectedRestaurant.contact.contact_name}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">
                          {selectedRestaurant.contact.phone}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">
                          {selectedRestaurant.contact.email}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fanpage
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">
                          {selectedRestaurant.contact.fanpage || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operating Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    5. Thông tin hoạt động
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giờ mở cửa - đóng cửa
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">
                          {selectedRestaurant.operations.hours}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày nghỉ cố định
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">
                          {selectedRestaurant.operations.closed_days}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình thức phục vụ
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">
                        {selectedRestaurant.operations.service_type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu and Pricing */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    6. Menu và giá
                  </h3>
                  <div className="space-y-4">
                    {selectedRestaurant.menu.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                            <p className="text-sm text-gray-600">
                              Giá: {item.price.toLocaleString()} VNĐ
                            </p>
                            <p className="text-sm text-gray-600">
                              Loại: {item.type}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Ảnh: {item.image}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default Restaurant;