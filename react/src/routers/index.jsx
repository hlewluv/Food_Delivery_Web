// routers/index.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home";
// Kiểm tra xem file order.jsx có tồn tại không
import Order from "../pages/order"; // Nếu không tồn tại, tạo file hoặc xóa route này
import Menu from "../pages/menu"; // Nếu không tồn tại, tạo file hoặc xóa route này
import StaffScreen from "../pages/staff";
import VoucherScreen from "../pages/voucher"; // Nếu không tồn tại, tạo file hoặc xóa route này
const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/merchant/home" element={<Home />} />
        <Route path="/merchant/order" element={<Order />} />
        <Route path="/merchant/menu" element={<Menu />} />
        <Route path="/merchant/voucher" element={<VoucherScreen />} />
        <Route path="/merchant/staff" element={<StaffScreen />} />
        <Route path="/merchant/messages" element={<div>Tin nhắn</div>} />
        <Route path="/merchant/account" element={<div>Tài khoản</div>} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/merchant/home" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;