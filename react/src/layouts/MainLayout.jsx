// MainLayout.jsx
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const SidebarItem = ({ focused, icon, title, onPress }) => {
  return (
    <div
      onClick={onPress}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
        margin: "0 8px",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: focused ? "rgba(0, 177, 79, 0.1)" : "transparent",
      }}
    >
      {icon}
      <span
        style={{
          marginLeft: "12px",
          fontSize: "16px",
          fontWeight: focused ? "600" : "normal",
          color: focused ? "#00b14f" : "#4b5563",
        }}
      >
        {title}
      </span>
    </div>
  );
};

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const tabs = [
    {
      name: "home",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill={activeTab === "home" ? "#00b14f" : "#6b7280"}
          viewBox="0 0 24 24"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
      title: "Trang chủ",
    },
    {
      name: "order",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill={activeTab === "order" ? "#00b14f" : "#6b7280"}
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm1-3c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
        </svg>
      ),
      title: "Đơn hàng",
    },
    {
      name: "menu",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill={activeTab === "menu" ? "#00b14f" : "#6b7280"}
          viewBox="0 0 24 24"
        >
          <path d="M4 4h16v2H4zm0 6h16v2H4zm0 6h16v2H4z" />
        </svg>
      ),
      title: "Thực đơn",
    },
    {
      name: "voucher",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill={activeTab === "voucher" ? "#00b14f" : "#6b7280"}
          viewBox="0 0 24 24"
        >
          <path d="M21 6h-3V5c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v1H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM8 5h8v1H8V5zm5 10h-2v-2h2v2zm0-4h-2V9h2v2z" />
        </svg>
      ),
      title: "Khuyến mãi",
    },
    {
      name: "staff",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill={activeTab === "staff" ? "#00b14f" : "#6b7280"}
          viewBox="0 0 24 24"
        >
          <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05.02.01.05.03.07.04 2.33.83 4.9 2.46 4.9 4.41V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
      title: "Nhân viên",
    },
    {
      name: "messages",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill={activeTab === "messages" ? "#00b14f" : "#6b7280"}
          viewBox="0 0 24 24"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
        </svg>
      ),
      title: "Tin nhắn",
    },
    {
      name: "account",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill={activeTab === "account" ? "#00b14f" : "#6b7280"}
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
      ),
      title: "Tài khoản",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f9fafb",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "288px",
          borderRight: "1px solid #e5e7eb",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: "128px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <img
            src="https://inkythuatso.com/uploads/images/2021/11/logo-grab-inkythuatso-2-01-24-09-59-49.jpg"
            alt="Logo"
            style={{ width: "300px", height: "150px", objectFit: "contain" }}
          />
        </div>

        {/* Menu items */}
        <div style={{ marginTop: "16px", flex: 1 }}>
          {tabs.map((tab) => (
            <SidebarItem
              key={tab.name}
              focused={activeTab === tab.name}
              icon={tab.icon}
              title={tab.title}
              onPress={() => {
                setActiveTab(tab.name);
                navigate(`/merchant/${tab.name}`);
              }}
            />
          ))}
        </div>
      </div>
      {/* Main content */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          overflowY: "auto", // Đảm bảo nội dung có thể cuộn
          minHeight: "100vh", // Đảm bảo container có chiều cao tối thiểu
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
