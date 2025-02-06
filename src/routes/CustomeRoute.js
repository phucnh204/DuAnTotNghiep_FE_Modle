import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/Adminlayout";
import Dashboard from "../pages/admin/Dashboard";
import Login from "../components/admin/Login";
import MyAccountAddress from "../pages/client/MyAccountAddress";
import VoucherAdmin from "../pages/admin/VoucherAdmin";
import QuanLyNguoiBan from "../pages/admin/QuanLyNguoiBan";
import HoaDon from "../pages/admin/HoaDon";
import HoaDonChiTiet from "../pages/admin/HoaDonChiTiet";
import QuanLyKhachHang from "../pages/admin/QuanLyKhachHang";
import ChiTietKhachHang from "../pages/admin/QuanLyChiTietKhachHang";
import QuanLySanPham from "../pages/admin/QuanLySanPham";
import ChiTietSanPham from "../pages/admin/ChiTietSanPham";
import VoucherAdminForm1 from "../pages/admin/VoucherAdminForm1";
import VoucherAdminForm2 from "../pages/admin/VoucherAdminForm2";
import QuanLyChiTietNguoiBan from "../pages/admin/QuanLyChiTietNguoiBan";
import Categories from "../pages/admin/Categories";
import BannerManagement from "../pages/admin/BannerManagement";
import StatisReport from "../pages/admin/StatisticalReport";
// import Dashboard from "../pages/admin/Dashboard"; // Đường dẫn tới Dashboard
// import Profile from "../pages/client/MyAccountAddress"; // Đường dẫn tới Profile
// import Categories from "../pages/admin/Categories"; // Đường dẫn tới Categories
// import Login from "../components/admin/Login"; // Đường dẫn tới Login
// import AdminLayout from "../layouts/Adminlayout"; // Đường dẫn tới AdminLayout
// import QuanLyNguoiBan from "../pages/admin/QuanLyNguoiBan";
// import QuanLyChiTietNguoiBan from "../pages/admin/QuanLyChiTietNguoiBan";
// import VoucherAdmin from "../pages/admin/VoucherAdmin";
// import HoaDon from "../pages/admin/HoaDon";
// import HoaDonChiTiet from "../pages/admin/HoaDonChiTiet";
// import QuanLyKhachHang from "../pages/admin/";
// import QuanLyChiTietKhachHang from "../pages/admin/QuanLyChiTietKhachHang";
// import QuanLySanPham from "../pages/admin/QuanLySanPham";
// import QuanLyChiTietSanPham from "../pages/admin/ChiTietSanPham";
// import QuanLyVoucher from "../pages/admin/VoucherAdmin";
// import VoucherAdminForm1 from "../pages/admin/VoucherAdminForm1";
// import VoucherAdminForm2 from "../pages/admin/VoucherAdminForm2";
const AdminRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      }
    />
    <Route path="login" element={<Login />} />
    <Route path="demoApp" element={<demoApp />} />

    <Route
      path="profile"
      element={
        <AdminLayout>
          <MyAccountAddress />
        </AdminLayout>
      }
    />

    <Route
      path="/voucher"
      element={
        <AdminLayout>
          <VoucherAdmin />
        </AdminLayout>
      }
    />

    <Route
      path="sellers"
      element={
        <AdminLayout>
          <QuanLyNguoiBan />
        </AdminLayout>
      }
    />
    <Route
      path="invoices"
      element={
        <AdminLayout>
          <HoaDon />
        </AdminLayout>
      }
    />
    <Route
      path="invoices/:orderId"
      element={
        <AdminLayout>
          <HoaDonChiTiet />
        </AdminLayout>
      }
    />
    <Route
      path="users"
      element={
        <AdminLayout>
          <QuanLyKhachHang />
        </AdminLayout>
      }
    />
    <Route
      path="users/:userId"
      element={
        <AdminLayout>
          <ChiTietKhachHang />
        </AdminLayout>
      }
    />
    <Route
      path="products"
      element={
        <AdminLayout>
          <QuanLySanPham />
        </AdminLayout>
      }
    />
    <Route
      path="products/:productId"
      element={
        <AdminLayout>
          <ChiTietSanPham />
        </AdminLayout>
      }
    />
    <Route
      path="voucher"
      element={
        <AdminLayout>
          <VoucherAdmin />
        </AdminLayout>
      }
    />
    <Route
      path="voucher1"
      element={
        <AdminLayout>
          <VoucherAdminForm1
           />
        </AdminLayout>
      }
    />
    <Route
      path="voucher2"
      element={
        <AdminLayout>
          <VoucherAdminForm2 />
        </AdminLayout>
      }
    />
    <Route
      path="sellerDetail/:shopId"
      element={
        <AdminLayout>
          <QuanLyChiTietNguoiBan />
        </AdminLayout>
      }
    />
    <Route
      path="categories"
      element={
        <AdminLayout>
          <Categories />
        </AdminLayout>
      }
    />
    <Route
      path="/content"
      element={
        <AdminLayout>
          <BannerManagement />
        </AdminLayout>
      }
    />
    <Route
      path="/statistics"
      element={
        <AdminLayout>
          <StatisReport />
        </AdminLayout>
      }
    />
    {/* Thêm các Route khác ở đây */}
  </Routes>
);
export default AdminRoutes