import React from "react";
import {
  FaPhoneAlt,
  FaClock,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaShoppingCart,
  FaMoneyBillWave,
  FaBox,
  FaStar,
} from "react-icons/fa";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { FiTag, FiInfo, FiBox, FiDollarSign } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdFormatColorFill } from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useFetcher, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../../config/AdminAPI";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";

const customerApi = {
  customers: [
    {
      id: 1,
      name: "Nguyễn Văn Phúc",
      email: "nguyenvanphuc@example.com",
      phone: "0123 456 789",
      status: "Active",
      birthday: "10-10-2002",
      address: "Hà Nội, Việt Nam",
      sex: true,
      orders: 15,
      total: 5000000,
      joinDate: "01-01-2020",
    },
    {
      id: 2,
      name: "Trần Thu Hà",
      email: "tranthuha@example.com",
      phone: "0987 654 321",
      status: "Inactive",
      birthday: "25-12-1999",
      address: "Hồ Chí Minh, Việt Nam",
      sex: false,
      orders: 8,
      total: 3000000,
      joinDate: "10-05-2021",
    },
  ],
};

const ChiTietKhachHang = () => {
  const { userId } = useParams();
  const [user, setUser] = useState([]);
  const [orderStatistics, setOrderStatistics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrder] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [taiKhoanReport, setTaiKhoanReport] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });

  // const customerData = customerApi.customers.find(
  //   (c) => c.id === parseInt(userId)
  // );

  const handleUpdateTrangThai = async (id, currentTrangThai) => {
    const newTrangThai =
      currentTrangThai == "HoatDong" ? "NgungHoatDong" : "HoatDong";
    try {
      await api.put(`${id}/updateStatusTaiKhoan`, null, {
        params: { trangThai: newTrangThai },
      });
      fetchSUser(userId);
      setIsChecked(!isChecked);
      toast.success("Cập nhật trạng thái thành công", {
        autoClose: 2500,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.warning("Cập nhật trạng thái thất bại", {
        autoClose: 2500,
      });
    }
  };

  const toggleModal = () => {
    setIsReportOpen(!isReportOpen);
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    // Tạo object JSON để gửi
    const reportData = {
      shopId: user.idUser,
      reportId: selectedReport,
      reportedBy: 22,
      status: 1,
      content: "Admin xử lí vi phạm",
      image: "", // Nếu không có ảnh
    };
    try {
      const response = await api.post(
        "createReportTaiKhoan",
        reportData, // Dữ liệu JSON
        { headers: { "Content-Type": "application/json" } }
      );
      toggleModal();
      if (response.data > 0) {
        handleUpdateTrangThai(user.idUser, user.trangThai);
      } else {
        toast.error("Cập nhật trạng thái thất bại", {
          autoClose: 2500,
        });
      }
    } catch (error) {
      toast.error("Xãy ra lỗi, vui lòng thử lại sau", {
        autoClose: 2500,
      });
    }
  };

  const handleSelectReport = (id) => {
    setSelectedReport(id);
  };

  const handleOpenConfirm = () => {
    document.body.style.overflowY = "scroll";

    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <h1 className="text-xl mb-4 font-medium text-blue-700">
            Xác nhận thay đổi trạng thái {user.tenTaiKhoan}
          </h1>
          <p className="font-sans mb-4">
            Chuyển trạng thái từ{" "}
            <strong className="font-semibold text-blue-600">
              {user.trangThai == "Ngưng hoạt động"
                ? "Ngưng hoạt động"
                : "Hoạt động"}
            </strong>{" "}
            sang{" "}
            <strong className="font-semibold text-blue-600">
              {user.trangThai == "Ngưng hoạt động"
                ? "Hoạt động"
                : "Ngưng hoạt động"}
            </strong>
          </p>

          <div>
            <button
              onClick={() => {
                onClose();
                if (user.trangThai === "HoatDong") {
                  if (fetchShopReport()) {
                    setIsReportOpen(true);
                  }
                } else {
                  handleUpdateTrangThai(user.idUser, user.trangThai);
                }
              }}
              className="bg-green-500 text-white text-base py-2 px-3 rounded-md mr-2 cursor-pointer"
            >
              Xác nhận
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white text-base py-2 px-3 rounded-md cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      ),
    });
  };

  const fetchShopReport = async () => {
    try {
      const response = await api.get(`taiKhoanReport/2`);

      const data = response.data;

      setTaiKhoanReport(data);
    } catch (error) {
      console.error("Error fetching shop report:", error);
    }
  };

  const handlePageChange = (newPage) => {
    fetchOrders(userId, newPage, pagination.pageSize); // Gọi lại API với trang mới
  };

  const fetchSUser = async (userId) => {
    try {
      const response = await api.get(`userDetail/${userId}`);

      const data = response.data;

      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchOrderStatistics = async (userId) => {
    try {
      const response = await api.get(`orderStatistics/${userId}`);

      const data = response.data[0]; // Truy cập mảng con đầu tiên
      const Statistics = {
        tongTienDonThanhCong: data[0],
        tongTienDonHuy: data[1],
        soDonThanhCong: data[2],
        soDonHuy: data[3],
      };

      setOrderStatistics(Statistics);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchOrders = async (userId, pageNumber, pageSize) => {
    try {
      // Gửi request với tham số phân trang
      const response = await api.get(`orders/${userId}`, {
        params: {
          page: pageNumber, // Trang hiện tại
          size: pageSize, // Số lượng bản ghi trên mỗi trang
        },
      });

      // Lấy dữ liệu từ response
      const data = response.data; // Dữ liệu trả về từ API (Spring Data Page)
      const orders = data.content.map((item) => ({
        id: item[0], // dh.id
        tongTien: item[1], // dh.tongTien
        ngayTaoDon: item[2], // dh.ngayTaoDon
        tenTrangThai: item[3], // tt.TenTrangThai
        tenShop: item[4], // ch.tenShop
      }));

      // Cập nhật state với dữ liệu và thông tin phân trang
      setOrder(orders);
      setPagination({
        currentPage: data.number, // Trang hiện tại (0-based)
        totalPages: data.totalPages, // Tổng số trang
        totalElements: data.totalElements, // Tổng số bản ghi
        pageSize: data.size, // Số lượng bản ghi trên mỗi trang
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Bật trạng thái loading

      // Tạo promise chờ ít nhất 1 giây
      const loadingTimeout = new Promise(
        (resolve) => setTimeout(resolve, 750) // Đợi tối thiểu 1 giây
      );

      try {
        // Đợi cả hai Promise: gọi API và thời gian chờ tối thiểu
        await Promise.all([
          fetchSUser(userId),
          fetchOrderStatistics(userId),
          fetchOrders(userId, 0, 1),
          loadingTimeout,
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Tắt trạng thái loading
      }
    };
    fetchData();
  }, [userId]);

  if (isLoading) {
    // Hiển thị hiệu ứng loading
    return (
      <div className="max-w-none w-full min-h-[550px] flex items-center justify-center">
        <div className="text-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <p className="mt-4 text-lg font-semibold text-blue-500">
              Đang tải...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className=" bg-white p-4 sm:p-6 rounded-lg 
      shadow-lg max-w-none w-full"
    >
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
          <div className="relative p-6 w-full max-w-3xl bg-white rounded-lg shadow-lg dark:bg-gray-700">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                Lý do khóa {user.tenTaiKhoan}
              </h2>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-72">
              <div className="space-y-2">
                {Array.isArray(taiKhoanReport) && taiKhoanReport.length > 0 ? (
                  taiKhoanReport.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectReport(item.id)}
                      className={`p-3 border rounded-lg cursor-pointer ${
                        selectedReport === item.id
                          ? "bg-blue-100"
                          : "bg-gray-50"
                      } hover:bg-blue-100`}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.tieuDe}
                      </h3>
                      <p className="text-sm text-gray-800 dark:text-white">
                        {item.noiDung}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    Không có dữ liệu để hiển thị
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  toggleModal();
                  setSelectedReport(null);
                }}
                className="py-2.5 px-5 mr-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Đóng
              </button>
              <button
                onClick={handleCreateReport}
                disabled={!selectedReport}
                className={`py-2.5 px-5 text-sm font-medium text-white rounded-lg focus:outline-none ${
                  selectedReport
                    ? "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <section
          className="
      flex-grow bg-white p-4 sm:p-6 rounded-lg 
      shadow-lg max-w-none w-full mb-3
    "
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Thông tin người dùng
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột 1 - Hình ảnh và trạng thái */}
            <div className="flex flex-col items-center lg:items-start text-left space-y-4">
              <div className="relative">
                <img
                  src={user.hinhAnh}
                  alt={user.hinhAnh}
                  className="w-32 h-32 rounded-full shadow-md"
                />
                {/* Trạng thái nằm chính giữa phía dưới ảnh */}
                <div
                  className="absolute cursor-pointer bottom-[-10px] left-1/2 transform -translate-x-1/2 translate-y-full flex items-center justify-center w-full text-center"
                  checked={isChecked}
                  onClick={handleOpenConfirm}
                >
                  {user.trangThai === "HoatDong" ? (
                    <span className="text-green-600 bg-green-100 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      <FaCheckCircle className="mr-2 inline-block" />
                      Hoạt động
                    </span>
                  ) : (
                    <span className="text-red-600 bg-red-100 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      <FaTimesCircle className="mr-2 inline-block" />
                      Ngưng hoạt động
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Cột 2 - Thông tin cửa hàng */}
            <div className="text-gray-700 text-sm space-y-6">
              <div className="flex items-start gap-2">
                <AiOutlineInfoCircle
                  className="text-green-500 mt-0.5"
                  size={20}
                />
                <div>
                  <strong className="block text-base text-gray-800 mb-2">
                    Thông tin cá nhân
                  </strong>
                  <span className="text-gray-800 mb-1 d-block">
                    <strong>Mã: </strong>
                    {user.idUser}
                  </span>
                  <span className="text-gray-800 mb-1 d-block">
                    <strong>Tên tài khoản: </strong>
                    {user.tenTaiKhoan}
                  </span>
                  <span className="text-gray-800 mb-1 d-block">
                    <strong>Số điện thoại: </strong>
                    {user.soDienThoai}
                  </span>
                  <span className="text-gray-800 mb-1 d-block">
                    <strong>Họ và tên: </strong>
                    {user.hoVaTen?.trim() ? user.hoVaTen : "Chưa cập nhật"}
                  </span>
                  <span className="text-gray-800 mb-1 d-block">
                    <strong>Email: </strong>
                    {user.email?.trim() ? user.email : "Chưa cập nhật"}
                  </span>
                  <span className="text-gray-800 mb-1 d-block">
                    <strong>Giới tính: </strong>
                    {user.gioiTinh !== null
                      ? user.gioiTinh == 1
                        ? "Nam"
                        : "Nữ"
                      : "Chưa cập nhật"}
                  </span>
                  <span className="text-gray-800 mb-1 d-block">
                    <strong>Ngày sinh: </strong>
                    {user.sinhNhat || "Chưa cập nhật"}
                  </span>
                  <span className="text-gray-800 mb-1 d-block">
                    <strong>Vai trò: </strong>
                    {user.vaiTro}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                {/* <FaPhoneAlt className="text-yellow-500 mt-1" size={20} />
                <div>
                  <strong className="block text-gray-800">Liên hệ:</strong>
                  <span className="text-gray-600">value</span>
                </div> */}
              </div>
            </div>

            {/* Cột 3 - Danh sách địa chỉ cuộn */}
            <div className="flex items-start w-full">
              <MdLocationOn
                className="text-red-500 mt-0.5 flex-shrink-0"
                size={20}
              />
              <div className="flex-grow">
                <strong className="block text-base text-gray-800 mb-2 ml-2">
                  Địa chỉ:
                </strong>
                {/* Container cuộn với chiều cao cố định */}
                <div
                  className="text-gray-700 text-sm space-y-6 max-h-[200px] overflow-y-auto relative w-full pr-2"
                  style={{
                    scrollbarWidth: "thin", // Hiển thị scrollbar mỏng
                    msOverflowStyle: "auto", // Bật scrollbar tự động khi cần
                  }}
                >
                  <ul className="space-y-4">
                    {user?.addresses?.length > 0 ? (
                      user.addresses.map((item) => (
                        <li
                          key={item.idAddress}
                          className="p-4 bg-gray-50 rounded-lg shadow-md text-gray-800 w-full mb-2"
                        >
                          <p className="font-semibold text-sm">
                            {item.soDienThoai} - {item.toanBoDiaChi}
                          </p>
                        </li>
                      ))
                    ) : (
                      <p>Không có địa chỉ nào được tìm thấy.</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-8 bg-white rounded-lg shadow-lg mb-3">
        {/* Doanh thu */}
        <div className="text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 shadow-inner">
              <FaMoneyBillWave className="text-green-600 w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(orderStatistics.tongTienDonThanhCong)}
            </h2>

            <p className="text-gray-600 text-sm font-medium">
              Giá trị đơn thành công
            </p>
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 shadow-inner">
              <FaMoneyBillWave className="text-red-600 w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat("vi-VN").format(
                orderStatistics.tongTienDonHuy
              )}
            </h2>
            <p className="text-gray-600 text-sm font-medium">Giá trị đơn hủy</p>
          </div>
        </div>
        {/* Đơn hàng */}
        <div className="text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 shadow-inner">
              <FaShoppingCart className="text-green-600 w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("vi-VN").format(
                orderStatistics.soDonThanhCong
              )}
            </h2>
            <p className="text-gray-600 text-sm font-medium">Đơn thành công</p>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 shadow-inner">
              <FaShoppingCart className="text-red-600 w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat("vi-VN").format(orderStatistics.soDonHuy)}
            </h2>
            <p className="text-gray-600 text-sm font-medium">Đơn hủy</p>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white border rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Danh sách đơn hàng
          <span className="text-gray-500 text-sm ml-2">
            ({pagination.totalElements} đơn hàng)
          </span>
        </h3>
        <table className="min-w-full text-center table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mã
              </th>
              <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Shop
              </th>
              <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tổng giá trị
              </th>
              <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hành động
              </th>
              <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 py-4 max-w-[150px] truncate text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-4 py-4 max-w-[200px] truncate text-sm text-gray-700">
                    {item.tenShop}
                  </td>
                  <td className="px-4 py-4 max-w-[200px] truncate text-sm text-gray-700">
                    {format(new Date(item.ngayTaoDon), "HH:mm dd/MM/yyyy")}
                  </td>
                  <td className="px-4 py-4 max-w-[150px] truncate text-base font-medium text-gray-700">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.tongTien)}
                  </td>
                  <td className="px-4 py-4 max-w-[200px] text-sm">
                    {item.tenTrangThai === "Giao hàng thành công" ? (
                      <span className="text-green-600 inline-flex items-center justify-center bg-green-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                        <FaCheckCircle className="mr-1" /> {item.tenTrangThai}
                      </span>
                    ) : item.tenTrangThai === "Đã hủy" ||
                      item.tenTrangThai === "Giao không thành công" ? (
                      <span className="text-red-600 inline-flex items-center justify-center bg-red-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                        <FaTimesCircle className="mr-1" /> {item.tenTrangThai}
                      </span>
                    ) : (
                      <span className="text-yellow-600 inline-flex items-center justify-center bg-gray-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                        <FaTimesCircle className="mr-1" /> {item.tenTrangThai}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 max-w-[200px] truncate text-sm">
                    <button className="text-blue-600 hover:text-blue-800 hover:underline transition duration-200">
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-4 text-center text-base text-gray-500 italic"
                >
                  Người dùng chưa có đơn nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <hr className="mt-3  text-gray-500" />
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
          {/* Nút "Trang trước" */}
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            Trang trước
          </button>

          {/* Hiển thị danh sách số trang */}
          <div className="flex items-center gap-1 my-2 sm:my-0">
            {/* Nút trang đầu tiên */}
            <button
              onClick={() => handlePageChange(0)}
              className={`px-3 py-1 rounded-full ${
                pagination.currentPage === 0
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              1
            </button>

            {/* Hiển thị dấu "..." nếu cần */}
            {pagination.currentPage > 2 && <span className="px-2">...</span>}

            {/* Hiển thị 3 trang xung quanh trang hiện tại */}
            {Array.from({ length: 3 }, (_, index) => {
              const page = pagination.currentPage - 1 + index;
              if (page > 0 && page < pagination.totalPages - 1) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-full ${
                      pagination.currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {page + 1}
                  </button>
                );
              }
              return null;
            })}

            {/* Hiển thị dấu "..." nếu cần */}
            {pagination.currentPage < pagination.totalPages - 3 && (
              <span className="px-2">...</span>
            )}

            {/* Nút trang cuối */}
            {pagination.totalPages > 1 && (
              <button
                onClick={() => handlePageChange(pagination.totalPages - 1)}
                className={`px-3 py-1 rounded-full ${
                  pagination.currentPage === pagination.totalPages - 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {pagination.totalPages}
              </button>
            )}
          </div>

          {/* Nút "Trang sau" */}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChiTietKhachHang;
