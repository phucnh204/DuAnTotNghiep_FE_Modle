import React, { useEffect, useState } from "react";
import {
  FaWallet,
  FaUsers,
  FaChartLine,
  FaBoxOpen,
  FaCartArrowDown,
  FaCube,
  FaBriefcase,
  FaPhoneAlt,
  FaUser,
} from "react-icons/fa";
import api from "../../config/AdminAPI";
import { useParams } from "react-router-dom";
import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";
import { MdStore } from "react-icons/md";
import { format } from "date-fns";

import { AiOutlineInfoCircle } from "react-icons/ai";

import orderData from "../../data/json/hoaDonDetail.json"; // Đảm bảo đường dẫn chính xác đến file JSON của bạn

const HoaDonChiTiet = () => {
  const [order, setOrder] = useState(null);
  const [orderDetail, setOderDetail] = useState([]);
  const [productOderDetail, setProductOderDetail] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);
  const { orderId } = useParams();

  const iconMapping = {
    FaWallet: <FaWallet className="text-4xl text-blue-600 mr-3" />,
    FaChartLine: <FaChartLine className="text-4xl text-green-600 mr-3" />,
    FaBoxOpen: <FaBoxOpen className="text-4xl text-yellow-600 mr-3" />,
    FaCartArrowDown: <FaCartArrowDown className="text-4xl text-red-600 mr-3" />,
    FaUsers: <FaUsers className="text-4xl text-blue-500 mb-4" />,
    FaBriefcase: <FaBriefcase className="text-4xl text-yellow-600 mb-4" />,
    FaCube: <FaCube className="text-4xl text-purple-600 mb-4" />,
  };

  const fetchOrderDetail = async (oderId) => {
    try {
      const response = await api.get(`invoices/${oderId}`);

      const data = response.data; // Dữ liệu nhận được từ API

      const getOrderDetail = {
        id: data[0][0], // dh.id
        idKhachHang: data[0][1], // tk.id AS idKhachHang
        tenKhachHang: data[0][2], // tk.hoVaTen AS tenKhachHang
        emailKhachHang: data[0][3], // tk.email AS emailKhachHang
        sdtKhachHang: data[0][4], // tk.soDienThoai AS sdtKhachHang
        soDienThoai: data[0][5], // dc.soDienThoai
        toanBoDiaChi: data[0][6], // dc.toanBoDiaChi
        tenVoucherSan: data[0][7], // vs.tenVoucher AS tenVoucherSan
        tenVoucherShop: data[0][8], // vch.tenVoucher AS tenVoucherShop
        trangThaiDonHang: data[0][9], // ts.TenTrangThai
        hinhThucThanhToan: data[0][10], // tt.TenHinhThucThanhToan
        ngayTaoDon: data[0][11], // dh.ngayTaoDon
        tongTien: data[0][12], // dh.tongTien
        ghiChu: data[0][13], // dh.ghiChu
        lyDo: data[0][14], // dh.lyDo
        phiShip: data[0][15], // dh.phiShip
        tienTruVoucherSan: data[0][16], // dh.tienTruVoucherSan
        tienTruVoucherShop: data[0][17], // dh.tienTruVoucherShop
        idCuaHang: data[0][18], // ch.id AS idCuaHang
        tenCuaHang: data[0][19], // ch.tenShop AS tenCuaHang
        chuCuaHang: data[0][20], // ch.hoVaTen AS chuCuaHang
        emailCuaHang: data[0][21], // ch.email AS emailCuaHang
        soDienThoaiShop: data[0][22],
        tenTaiKhoan: data[0][23],
      };

      setOderDetail(getOrderDetail);
    } catch (error) {
      alert("lỗi: " + orderId);
      console.error("Error fetching order detail:", error);
    }
  };

  const fetchProductOderDetail = async (oderId) => {
    try {
      const response = await api.get(`productOrderDetail/${oderId}`);

      const data = response.data;
      const product = data.map((item) => ({
        chiTietDonHangId: item[0], // ctdh.id
        soLuongDat: item[1], // ctdh.soLuong
        giaBanChiTietDonHang: item[2], // ctdh.giaBan
        tenSanPham: item[3], // sp.tenSanPham
        hinhAnhSanPham: item[4], // sp.hinhAnh
        hinhAnhBienThe: item[5], // ctp.hinhAnhBienThe
        tenMau: item[6], // ms.tenMau
        tenKichThuoc: item[7], // kt.tenKichThuoc
      }));

      setProductOderDetail(product);
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number); // Dùng 'vi-VN' để phân cách theo kiểu Việt Nam (dấu chấm)
  };

  useEffect(() => {
    fetchOrderDetail(orderId);
    fetchProductOderDetail(orderId);
  }, [orderId]);

  useEffect(() => {
    const total = productOderDetail.reduce(
      (sum, item) => sum + item.giaBanChiTietDonHang * item.soLuongDat,
      0
    );
    setTotalPrice(total);
  }, [productOderDetail]);

  return (
    <div className="mx-auto w-full p-4 bg-white rounded">
      <div className="w-full">
        {/* Phần 1: Thông tin đơn hàng */}
        <div className="p-6 border shadow-sm rounded bg-white">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold">
              Mã đơn hàng: <span>{orderDetail.id}</span>
            </h2>
            <p>
              <h3 className="text-lg font-semibold">
                Trạng thái:
                <span
                  className={`inline-block items-center justify-center p-2 rounded-full text-sm font-medium shadow-sm break-words ml-2 ${
                    orderDetail.trangThaiDonHang === "Giao hàng thành công"
                      ? "bg-green-100 text-green-600"
                      : orderDetail.trangThaiDonHang === "Đã hủy" ||
                        orderDetail.trangThaiDonHang === "Giao thất bại"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-yellow-600"
                  }`}
                >
                  {orderDetail.trangThaiDonHang}
                </span>
              </h3>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <p className=" p-2 rounded-md shadow-sm">
              <strong className="text-sm font-medium mr-2">Ngày tạo:</strong>
              <span className="text-sm font-medium text-gray-800">
                {orderDetail.ngayTaoDon
                  ? format(new Date(orderDetail.ngayTaoDon), "HH:mm dd/MM/yyyy")
                  : "Ngày không hợp lệ"}
              </span>
            </p>
            <p className=" p-2 rounded-md shadow-sm">
              <strong className="text-sm font-medium mr-2">Voucher sàn:</strong>
              <span className="text-sm font-medium text-gray-800">
                {orderDetail.tenVoucherSan
                  ? orderDetail.tenVoucherSan
                  : "Không có"}
              </span>
            </p>
            <p className=" p-2 rounded-md shadow-sm">
              <strong className="text-sm font-medium mr-2">
                Hình thức thanh toán:
              </strong>
              <span className="text-sm font-medium text-gray-800">
                {orderDetail.hinhThucThanhToan}
              </span>
            </p>
            <p className=" p-2 rounded-md shadow-sm">
              <strong className="text-sm font-medium mr-2">
                Voucher shop:
              </strong>
              <span className="text-sm font-medium text-gray-800">
                {orderDetail.tenVoucherShop
                  ? orderDetail.tenVoucherShop
                  : "Không có"}
              </span>
            </p>
            <p className=" p-2 rounded-md shadow-sm">
              <strong className="text-sm font-medium mr-2">
                Địa chỉ nhận hàng:
              </strong>
              <span className="text-sm font-medium text-gray-800">
                {orderDetail.soDienThoai} - {orderDetail.toanBoDiaChi}
              </span>
            </p>
            <p className=" p-2 rounded-md shadow-sm">
              <strong className="text-sm font-medium mr-2">Lí do hủy:</strong>
              <span className="text-sm font-medium text-gray-800">
                {orderDetail.lyDo ? orderDetail.lyDo : "Không có"}
              </span>
            </p>
          </div>
        </div>

        {/* Phần 2: Thông tin người mua, cửa hàng và địa chỉ giao hàng */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 mb-12 mt-6">
          <div className="bg-white border p-6 rounded-lg shadow-md flex flex-col items-start">
            <div className="flex items-center mb-3">
              <FaUser className="text-indigo-500 w-5 h-5 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Người mua
              </h2>
            </div>
            <div className="text-gray-700 text-sm space-y-6">
              <div className="flex items-start gap-2">
                <AiOutlineInfoCircle
                  className="text-green-500 mt-1"
                  size={20}
                />
                <div>
                  <strong className="block text-gray-800">Thông tin</strong>
                  <span className="text-gray-600 font-medium">
                    Mã: {orderDetail.idKhachHang}
                  </span>{" "}
                  <br />
                  <span className="text-gray-600 font-medium">
                    Tên tài khoản: {orderDetail.tenTaiKhoan}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FaPhoneAlt className="text-blue-500 mt-1" size={20} />
                <div>
                  <strong className="block text-gray-800">Số điện thoại</strong>
                  <span className="text-gray-600 font-medium">
                    {orderDetail.sdtKhachHang}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <HiOutlineMail className="text-yellow-500 mt-1" size={20} />
                <div>
                  <strong className="block text-gray-800">Email</strong>
                  <span className="text-gray-600 font-medium">
                    {orderDetail.emailKhachHang}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border p-6 rounded-lg shadow-md flex flex-col items-start">
            <div className="flex items-center mb-3">
              <MdStore className="text-red-500 w-6 h-6 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Người Bán
              </h2>
            </div>
            <div className="text-gray-700 text-sm space-y-6">
              <div className="flex items-start gap-2">
                <AiOutlineInfoCircle
                  className="text-green-500 mt-1"
                  size={20}
                />
                <div>
                  <strong className="block text-gray-800">Thông tin</strong>
                  <span className="text-gray-600 font-medium">
                    Mã: {orderDetail.idCuaHang}
                  </span>{" "}
                  <br />
                  <span className="text-gray-600 font-medium">
                    Tên cửa hàng: {orderDetail.tenCuaHang}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FaPhoneAlt className="text-blue-500 mt-1" size={20} />
                <div>
                  <strong className="block text-gray-800 font-medium">
                    Số điện thoại
                  </strong>
                  <span className="text-gray-600">
                    {orderDetail.soDienThoaiShop}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <HiOutlineMail className="text-yellow-500 mt-1" size={20} />
                <div>
                  <strong className="block text-gray-800 ">Email</strong>
                  <span className="text-gray-600 font-medium">
                    {orderDetail.emailCuaHang}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phần 3: Bảng sản phẩm và phí đơn hàng */}
        <div className="p-6 bg-white border rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Danh sách sản phẩm
          </h3>
          <table className="min-w-full text-center table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mã
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody>
              {productOderDetail.map((item) => (
                <tr
                  key={item.chiTietDonHangId}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 py-4 max-w-[150px] truncate text-sm font-medium text-gray-900">
                    {item.chiTietDonHangId}
                  </td>
                  <td className="px-4 py-4 max-w-[200px] truncate text-sm text-gray-700">
                    {item.tenSanPham}
                  </td>
                  <td className="px-4 py-4 max-w-[200px] truncate text-sm text-gray-700">
                    {item.tenMau} - {item.tenKichThuoc}
                  </td>
                  <td className="px-4 py-4 max-w-[150px] truncate text-sm text-gray-700">
                    {new Intl.NumberFormat("vi-VN").format(item.soLuongDat)}
                  </td>
                  <td className="px-4 py-4 max-w-[150px] truncate text-sm text-gray-700">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.giaBanChiTietDonHang)}
                  </td>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.giaBanChiTietDonHang * item.soLuongDat)}
                  <td className="px-4 py-4 max-w-[200px] truncate text-sm">
                  <button
                    //   onClick={() => TruyCapChiTietKhachHang(item.id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
                  >
                    Xem chi tiết
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="mt-3  text-gray-500" />
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-base text-gray-800">
              <span>Tổng tiền sản phẩm:</span>
              <span className="font-medium">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between text-base text-gray-800">
              <span>Phí vận chuyển:</span>
              <span className="font-medium">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderDetail.phiShip)}
              </span>
            </div>
            <div className="flex justify-between text-base text-gray-800">
              <span>Voucher sàn:</span>
              <span className="font-medium">
                {" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  orderDetail.tienTruVoucherSan
                    ? orderDetail.tienTruVoucherSan
                    : 0
                )}
              </span>
            </div>
            <div className="flex justify-between text-base text-gray-800">
              <span>Voucher shop:</span>
              <span className="font-medium">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  orderDetail.tienTruVoucherShop
                    ? orderDetail.tienTruVoucherShop
                    : 0
                )}
              </span>
            </div>
            <div className="flex justify-between text-2xl text-red-600">
              <span className=" font-medium">Tổng cộng:</span>
              <span className="font-semibold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderDetail.tongTien)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoaDonChiTiet;
