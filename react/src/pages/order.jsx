import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaUser, FaCheck } from 'react-icons/fa';
import transactionData from '../data/transactions'; // Import transaction data

// Define the MenuItem type
const MenuItem = {
  id: String,
  name: String,
  price: String,
  restaurant: String,
  image: String,
  description: String,
  time: String,
  option_menu: Array,
};

// Define the OrderType type
const OrderType = {
  id: String,
  customerName: String,
  bikerName: String,
  bikerAvatar: String,
  time: String,
  status: String,
  items: Array,
};

const Order = () => {
  const tabs = ['Chờ xác nhận', 'Đang chuẩn bị', 'Sẵn sàng', 'Lịch sử'];
  const navigate = useNavigate();

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('Lịch sử');

  // State to manage which order's details are being viewed
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Transform transactionData to match OrderType
  const transformTransactionData = (data) => {
    return data.map((transaction) => ({
      id: transaction.id,
      customerName: transaction.customer.name,
      bikerName: transaction.biker.name,
      bikerAvatar: 'https://file.hstatic.net/200000108863/file/4_0e1f1d1c84d64880907a4606bc618b9d_grande.png', // Placeholder avatar
      time: transaction.time,
      status: transaction.status === 'Hoàn tất' ? 'Lịch sử' : transaction.status === 'Đang giao' ? 'Sẵn sàng' : transaction.status,
      items: transaction.items.map((item) => ({
        item: {
          id: item.id,
          name: item.food_name,
          price: `${item.price.toLocaleString('vi-VN')}đ`,
          restaurant: transaction.restaurant.name,
          image: item.image,
          description: item.description,
          time: item.time,
          option_menu: item.option_menu,
        },
        quantity: 1, // Default quantity
      })),
    }));
  };

  // State to manage orders
  const [orders, setOrders] = useState(transformTransactionData(transactionData));

  // Function to move an order to the next tab
  const moveToNextTab = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId && order.status !== 'Lịch sử') {
          const currentTabIndex = tabs.indexOf(order.status);
          const nextTabIndex = currentTabIndex + 1;
          return { ...order, status: tabs[nextTabIndex] };
        }
        return order;
      })
    );
  };

  // Filter orders based on the active tab
  const filteredOrders = orders.filter((order) => order.status === activeTab);

  // Calculate total items for display
  const getTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total price for an order
  const getTotalPrice = (items) => {
    return (
      items
        .reduce((total, { item, quantity }) => {
          const price = parseFloat(item.price.replace('đ', '').replace('.', '')) / 1000;
          return total + price * quantity;
        }, 0)
        .toFixed(3) + 'đ'
    );
  };

  // Handle order click to show details
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  // Handle status button click
  const handleStatusClick = (order) => {
    if (order.status !== 'Lịch sử') {
      moveToNextTab(order.id);
    }
  };

  // Render detailed order form in a modal
  const renderOrderDetails = (order) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg m-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Hoá đơn #{order.id}</h2>
        <button onClick={() => setSelectedOrder(null)} aria-label="Close">
          <FaTimes className="text-gray-500" size={24} />
        </button>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Thông tin đơn hàng</h3>
        <div className="flex items-center mb-2">
          <div className="flex items-center w-32">
            <FaUser className="text-gray-500 mr-2" size={20} />
            <span className="text-base text-gray-600 font-medium">Khách hàng:</span>
          </div>
          <span className="flex-1 text-base text-gray-600">{order.customerName}</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center w-32">
            <img src={order.bikerAvatar} alt="Biker Avatar" className="w-8 h-8 rounded-full mr-2" />
            <span className="text-base text-gray-600 font-medium">Tài xế:</span>
          </div>
          <span className="flex-1 text-base text-gray-600">{order.bikerName}</span>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Món ăn đã đặt</h3>
        {order.items.map(({ item, quantity }, index) => (
          <div key={index} className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-base text-gray-600 flex-1">
              {item.name} x{quantity}
              {item.option_menu && item.option_menu.length > 0 && (
                <span className="text-sm text-gray-500">
                  {' '}
                  ({item.option_menu.map((options) => options.join('/')).join(', ')})
                </span>
              )}
            </span>
            <span className="text-base text-gray-600 font-medium">{item.price}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
        <span className="text-lg font-semibold text-gray-700">Tổng tiền:</span>
        <span className="text-xl font-bold text-blue-600">{getTotalPrice(order.items)}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={() => navigate('/merchant/home')} className="p-2" aria-label="Quay lại">
          <FaArrowLeft className="text-gray-600" size={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold text-gray-900">Đơn hàng</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white px-3 py-2 border-b border-gray-200 overflow-x-auto">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <div className="p-1" key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full ${activeTab === tab ? 'bg-[#00b14f] text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <span className="text-sm font-medium">{tab}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order List */}
      <div className="bg-white px-3 py-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleOrderClick(order)}
              className="flex justify-between items-start py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex flex-col flex-1 items-start">
                <div className="flex items-center">
                  <img src={order.bikerAvatar} alt="Biker Avatar" className="w-12 h-12 rounded-full mr-3" />
                  <span className="text-base font-medium">{order.bikerName}</span>
                </div>
                <span className="text-xl font-bold mt-1">{order.id}</span>
                <span className="text-base text-gray-500 mt-1">
                  {getTotalItems(order.items)} sản phẩm dành cho {order.customerName}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-base text-gray-500 mb-2">{order.time}</span>
                <div className="bg-gray-100 rounded-lg p-2 flex flex-col mt-4 h-12 w-36 justify-center items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusClick(order);
                    }}
                    className="flex items-center"
                    disabled={order.status === 'Lịch sử'}
                  >
                    <FaCheck
                      size={18}
                      className={
                        order.status === 'Chờ xác nhận'
                          ? 'text-orange-500'
                          : order.status === 'Đang chuẩn bị'
                          ? 'text-blue-500'
                          : order.status === 'Sẵn sàng'
                          ? 'text-green-500'
                          : 'text-gray-500'
                      }
                    />
                    <span
                      className={`ml-1 text-sm font-medium ${
                        order.status === 'Chờ xác nhận'
                          ? 'text-orange-500'
                          : order.status === 'Đang chuẩn bị'
                          ? 'text-blue-500'
                          : order.status === 'Sẵn sàng'
                          ? 'text-green-500'
                          : 'text-gray-500'
                      }`}
                    >
                      {order.status}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4">
            <span className="text-center text-gray-500 block">Không có đơn hàng trong danh mục này</span>
          </div>
        )}
      </div>

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-md">
          {renderOrderDetails(selectedOrder)}
        </div>
      )}
    </div>
  );
};

export default Order;