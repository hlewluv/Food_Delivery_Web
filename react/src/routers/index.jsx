import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home";
import Order from "../pages/order";
import Menu from "../pages/menu";
import StaffScreen from "../pages/staff";
import VoucherScreen from "../pages/voucher";
import ProfileScreen from "../pages/account";
import Login from "../pages/LogIn";

// Component để bảo vệ các route
const ProtectedRoute = ({ allowedRoles = ["Host"] }) => {
  // Sử dụng localStorage thay vì AsyncStorage
  const role = localStorage.getItem("role"); // Thay bằng AsyncStorage.getItem("role") nếu dùng react-native-web
  const isAuthenticated = !!role; // Kiểm tra xem có role hay không

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Route cho màn hình đăng nhập */}
      <Route path="/login" element={<Login />} />

      {/* Các route được bảo vệ cho merchant */}
      <Route element={<ProtectedRoute allowedRoles={["Host"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/merchant/home" element={<Home />} />
          <Route path="/merchant/order" element={<Order />} />
          <Route path="/merchant/menu" element={<Menu />} />
          <Route path="/merchant/voucher" element={<VoucherScreen />} />
          <Route path="/merchant/staff" element={<StaffScreen />} />
          <Route path="/merchant/account" element={<ProfileScreen />} />
        </Route>
      </Route>

      {/* Route mặc định và xử lý 404 */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
