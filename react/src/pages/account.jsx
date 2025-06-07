import React, { useState, useRef } from "react";
import { 
  FaArrowLeft, 
  FaClock, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPencilAlt, 
  FaStar,
  FaCalendarAlt,
  FaHeart,
  FaShare,
  FaCheckCircle
} from "react-icons/fa";

const ProfileScreen = () => {
  const [restaurant, setRestaurant] = useState({
    name: "Coffee Cafe",
    subtitle: "Premium Coffee Experience",
    image: "https://cafefcdn.com/thumb_w/640/203337114487263232/2025/2/21/avatar1740096715584-17400967157451708166300.jpg",
    address: "34 Le Duan Street, Ho Chi Minh City, Vietnam",
    phone: "+84838123456",
    email: "contact@coffeecafe.com",
    services: "GrabFood • GrabPay • Dine-in",
    established: "01/01/2020",
    rating: 4.8,
    reviews: 1234,
    verified: true,
    workingHours: {
      "Thứ 2": "07:00 - 22:00",
      "Thứ 3": "07:00 - 22:00", 
      "Thứ 4": "07:00 - 22:00",
      "Thứ 5": "07:00 - 22:00",
      "Thứ 6": "07:00 - 23:00",
      "Thứ 7": "08:00 - 23:00",
      "Chủ nhật": "08:00 - 22:00"
    },
  });

  const [workingHoursModalVisible, setWorkingHoursModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const [tempWorkingHours, setTempWorkingHours] = useState(restaurant.workingHours || {});
  const [tempPhone, setTempPhone] = useState(restaurant.phone || "");
  const [tempEmail, setTempEmail] = useState(restaurant.email || "");
  const [tempAddress, setTempAddress] = useState(restaurant.address || "");

  const profileModalRef = useRef(null);
  const workingHoursModalRef = useRef(null);
  const contactModalRef = useRef(null);
  const addressModalRef = useRef(null);

  const handleClickOutside = (e, setModalVisible, modalRef) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setModalVisible(false);
    }
  };

  const handleCall = () => {
    if (restaurant.phone && /^[\+\d\s-]+$/.test(restaurant.phone)) {
      window.open(`tel:${restaurant.phone}`);
    }
  };

  const handleEmail = () => {
    if (restaurant.email && /\S+@\S+\.\S+/.test(restaurant.email)) {
      window.open(`mailto:${restaurant.email}`);
    }
  };

  const handleMap = () => {
    if (restaurant.address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`
      );
    }
  };

  const handleSaveWorkingHours = () => {
    setRestaurant((prev) => ({
      ...prev,
      workingHours: { ...tempWorkingHours },
    }));
    setWorkingHoursModalVisible(false);
  };

  const handleSaveContact = () => {
    setRestaurant((prev) => ({
      ...prev,
      phone: tempPhone,
      email: tempEmail,
    }));
    setContactModalVisible(false);
  };

  const handleSaveAddress = () => {
    setRestaurant((prev) => ({
      ...prev,
      address: tempAddress,
    }));
    setAddressModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header với background gradient */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        {/* Restaurant Image */}
        <div className="relative h-52">
          <img
            src={restaurant.image || "https://via.placeholder.com/640x480"}
            className="w-full h-full object-cover"
            alt="Restaurant Header"
            onError={(e) => (e.target.src = "https://via.placeholder.com/640x480")}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-8 z-10">
        {/* Restaurant Info Card */}
        <div className="mx-4 mb-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={restaurant.image || "https://via.placeholder.com/640x480"}
                  className="w-20 h-20 rounded-xl border-3 border-white shadow-lg object-cover"
                  alt="Restaurant Logo"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/640x480")}
                />
                {restaurant.verified && (
                  <div className="absolute -top-1 -right-1">
                    <FaCheckCircle className="w-6 h-6 text-blue-500 bg-white rounded-full" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
                </div>
                <p className="text-gray-600 text-sm mb-2">{restaurant.subtitle}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                    <FaStar className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-yellow-700 font-semibold text-sm">{restaurant.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({restaurant.reviews} đánh giá)</span>
                </div>
                
                {/* Services */}
                <div className="flex flex-wrap gap-2">
                  {restaurant.services.split(' • ').map((service, index) => (
                    <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg"
                onClick={() => setProfileModalVisible(true)}
              >
                Xem hồ sơ
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-4 space-y-4">
          {/* Working Hours */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <FaClock className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Giờ hoạt động</h2>
                </div>
                <button
                  onClick={() => {
                    setTempWorkingHours(restaurant.workingHours || {});
                    setWorkingHoursModalVisible(true);
                  }}
                  className="bg-white p-2 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <FaPencilAlt className="w-4 h-4 text-green-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {restaurant.workingHours && Object.entries(restaurant.workingHours).length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(restaurant.workingHours).map(([day, time]) => (
                    <div key={day} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-700">{day}</span>
                      <span className="text-gray-900 font-semibold">{time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Chưa có thông tin giờ hoạt động</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl">
                    <FaPhone className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Thông tin liên lạc</h2>
                </div>
                <button
                  onClick={() => {
                    setTempPhone(restaurant.phone || "");
                    setTempEmail(restaurant.email || "");
                    setContactModalVisible(true);
                  }}
                  className="bg-white p-2 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <FaPencilAlt className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <button
                onClick={handleCall}
                className="flex items-center gap-4 w-full p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                disabled={!restaurant.phone}
              >
                <div className="bg-green-100 p-2 rounded-lg">
                  <FaPhone className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-semibold text-gray-900">{restaurant.phone || "Chưa có số điện thoại"}</p>
                </div>
              </button>
              
              <button
                onClick={handleEmail}
                className="flex items-center gap-4 w-full p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                disabled={!restaurant.email}
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FaEnvelope className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">{restaurant.email || "Chưa có email"}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-xl">
                    <FaMapMarkerAlt className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Địa chỉ</h2>
                </div>
                <button
                  onClick={() => {
                    setTempAddress(restaurant.address || "");
                    setAddressModalVisible(true);
                  }}
                  className="bg-white p-2 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <FaPencilAlt className="w-4 h-4 text-purple-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <button
                onClick={handleMap}
                className="flex items-center gap-4 w-full p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                disabled={!restaurant.address}
              >
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FaMapMarkerAlt className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">Địa chỉ cửa hàng</p>
                  <p className="font-semibold text-gray-900">{restaurant.address || "Chưa có địa chỉ"}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {profileModalVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={profileModalRef}
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-6 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Hồ sơ nhà hàng</h2>
                <button
                  onClick={() => setProfileModalVisible(false)}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <img
                src={restaurant.image || "https://via.placeholder.com/640x480"}
                className="w-full h-48 rounded-2xl mb-6 object-cover shadow-lg"
                alt="Restaurant Profile"
                onError={(e) => (e.target.src = "https://via.placeholder.com/640x480")}
              />
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-1">Tên nhà hàng</h3>
                    <p className="text-gray-600">{restaurant.name}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-1">Ngày thành lập</h3>
                    <p className="text-gray-600">{restaurant.established}</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Đánh giá khách hàng</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`w-5 h-5 ${index < Math.floor(restaurant.rating || 4) ? "text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">{restaurant.rating}</span>
                    <span className="text-gray-600">({restaurant.reviews} lượt đánh giá)</span>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Dịch vụ</h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.services.split(' • ').map((service, index) => (
                      <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Working Hours Modal */}
      {workingHoursModalVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={workingHoursModalRef}
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa giờ hoạt động</h2>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {Object.entries(tempWorkingHours).map(([day, time]) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium text-gray-700">{day}</div>
                    <input
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={time}
                      onChange={(e) =>
                        setTempWorkingHours((prev) => ({
                          ...prev,
                          [day]: e.target.value,
                        }))
                      }
                      placeholder="VD: 07:00 - 22:00"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleSaveWorkingHours}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Lưu thay đổi
              </button>
              <button
                onClick={() => setWorkingHoursModalVisible(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactModalVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={contactModalRef}
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa thông tin liên lạc</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  placeholder="VD: +84838123456"
                  type="tel"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="VD: contact@coffeecafe.com"
                  type="email"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleSaveContact}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Lưu thay đổi
              </button>
              <button
                onClick={() => setContactModalVisible(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {addressModalVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={addressModalRef}
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa địa chỉ</h2>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
              <textarea
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
                placeholder="VD: 34 Le Duan Street, Ho Chi Minh City, Vietnam"
              />
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleSaveAddress}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Lưu thay đổi
              </button>
              <button
                onClick={() => setAddressModalVisible(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;