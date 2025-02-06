import React, { useState, useEffect } from "react";
import { CiFilter } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import api from "../../config/AdminAPI";

const HoaDon = () => {
  // States cho filters

  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("userList");
  const [currentPage, setCurrentPage] = useState(1);

  // Thêm states thiếu

  const [orders, setOrders] = useState([]);
  const [currentPageOder, setCurrentPageOder] = useState(1); // Trang hiện tại
  const [pageSizeOder, setPageSizeOder] = useState(5); // Số đơn hàng mỗi trang
  const [totalPagesOder, setTotalPagesOder] = useState(0); // Tổng số trang
  const [totalOders, setTotalOders] = useState(0);

  const [search, setSearch] = useState(""); // Mã hóa đơn
  const [status, setStatus] = useState(""); // Trạng thái đơn hàng
  const [shopName, setShopName] = useState(""); // Tên cửa hàng
  const [userName, setUserName] = useState(""); // Tên khách hàng
  // Constants
  const itemsPerPage = 10; // Thêm số item trên mỗi trang

  // Mock data cho testing
  const filteredCustomers = []; // Thay thế bằng data thật
  const ToCaoData = []; // Thay thế bằng data thật
  const totalReportPages = Math.ceil(ToCaoData.length / itemsPerPage);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Lấy customers cho trang hiện tại
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchOders = async (page, size, search, status, shopName, userName) => {
    try {
      const response = await api.get("getAllOder", {
        params: {
          page,
          size,
          id: search, // Mã hóa đơn
          trangThai: status, // Trạng thái
          shopName, // Tên cửa hàng
          name: userName, // Tên khách hàng
        },
      });

      const data = response.data;
      const ordersData = data.content.map((item) => ({
        id: item[0],
        shop: item[1],
        user: item[2],
        createdAt: item[3],
        totalAmount: item[4],
        status: item[5],
      }));

      setOrders(ordersData);
      setTotalPagesOder(data.totalPages);
      setTotalOders(data.totalElements);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Functions
  const handlePreviousPage = () => {
    if (currentPageOder > 1) setCurrentPageOder(currentPageOder - 1);
  };

  const handleNextPage = () => {
    if (currentPageOder < totalPagesOder)
      setCurrentPageOder(currentPageOder + 1);
  };

  const handlePageSelect = (page) => {
    setCurrentPage(page);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setShopName("");
    setUserName("");
  };

  const TruyCapChiTietKhachHang = (id) => {
    navigate(`/admin/invoices/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPageOder(1); // Đưa về trang 1 khi thay đổi bộ lọc
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPageOder(1); // Đưa về trang 1 khi thay đổi bộ lọc
  };

  const handleShopNameChange = (e) => {
    setShopName(e.target.value);
    setCurrentPageOder(1); // Đưa về trang 1 khi thay đổi bộ lọc
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    setCurrentPageOder(1); // Đưa về trang 1 khi thay đổi bộ lọc
  };

  useEffect(() => {
    fetchOders(
      currentPageOder - 1,
      pageSizeOder,
      search,
      status,
      shopName,
      userName
    );
  }, [currentPageOder, pageSizeOder, search, status, shopName, userName]);

  return (
    <div className="p-6 rounded mx-auto bg-white w-full">
      {/* Bộ lọc */}
      <div className="flex justify-between mb-2">
        <h2 className="text-2xl font-extrabold text-gray-800">
          Theo dõi hóa đơn{" "}
          <span className="text-gray-500 text-sm">({totalOders} hóa đơn)</span>
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <div className="flex">
            {showFilters ? "Ẩn Bộ Lọc" : "Hiện Bộ Lọc"} <CiFilter />
          </div>
        </button>
      </div>

      {showFilters && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 mb-6 border border-gray-600 p-4">
          <div className="col-span-2">
            <label className="block mb-2 font-medium">Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Mã hóa đơn"
              value={search}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 font-medium">Trạng thái:</label>
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Tất cả</option>
              <option value="2">Tiếp nhận đơn</option>
              <option value="3">Đã giao cho đơn vị vận chuyển</option>
              <option value="4">Đang giao hàng</option>
              <option value="5">Đã giao hàng</option>
              <option value="6">Giao hàng thành công</option>
              <option value="7">Giao hàng không thành công</option>
              <option value="8">Đã hủy</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block mb-2 font-medium">Cửa hàng:</label>
            <input
              text="shopList"
              value={shopName}
              onChange={handleShopNameChange}
              placeholder="Tên cửa hàng"
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 font-medium">Khách hàng:</label>
            <input
              list="userList"
              value={userName}
              onChange={handleUserNameChange}
              placeholder="Tên tài khoản"
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <datalist id="userList">
              <option value="">Tất cả</option>
              {/* Nếu có danh sách người dùng, bạn có thể map các tên người dùng vào đây */}
            </datalist>
          </div>

          <div className="col-span-full flex justify-end mt-1">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              <GrPowerReset /> Làm mới bộ lọc
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto w-full p-4">
        <div className="flex space-x-4 border-b-2">
          <button
            onClick={() => handleTabClick("userList")}
            className={`py-2 px-4 text-lg font-medium ${
              activeTab === "userList"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600"
            }`}
          >
            Danh sách hóa đơn
          </button>
          <button
            onClick={() => handleTabClick("reportedList")}
            className={`py-2 px-4 text-lg font-medium ${
              activeTab === "reportedList"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600"
            }`}
          >
            Danh sách đơn khiếu nại
          </button>
        </div>
        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "userList" && (
            <div className="bg-white">
              <table className="min-w-full text-center table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mã đơn
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Shop
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Khách hàng
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
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-4 py-4 max-w-[150px] truncate text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-4 py-4 max-w-[200px] truncate text-sm text-gray-500">
                        {item.shop}
                      </td>
                      <td className="px-4 py-4 max-w-[200px] truncate text-sm text-gray-500">
                        {item.user}
                      </td>
                      <td className="px-4 py-4 max-w-[150px] truncate text-sm text-gray-500">
                        {format(new Date(item.createdAt), "HH:mm dd/MM/yyyy")}
                      </td>
                      <td className="px-4 py-4 max-w-[150px] truncate text-sm text-gray-500">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.totalAmount)}
                      </td>
                      <td className="px-4 py-4 max-w-[200px] text-sm">
                        {item.status === "Giao hàng thành công" ? (
                          <span className="text-green-600 inline-flex items-center justify-center bg-green-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                            <FaCheckCircle className="mr-1" /> {item.status}
                          </span>
                        ) : item.status === "Đã hủy" ||
                          item.status === "Giao không thành công" ? (
                          <span className="text-red-600 inline-flex items-center justify-center bg-red-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                            <FaTimesCircle className="mr-1" /> {item.status}
                          </span>
                        ) : (
                          <span className="text-yellow-600 inline-flex items-center justify-center bg-gray-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                            <FaSpinner className="mr-1" /> {item.status}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 max-w-[200px] truncate text-sm">
                        <button
                          onClick={() => TruyCapChiTietKhachHang(item.id)}
                          className="text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Điều khiển phân trang */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPageOder === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Trang trước
                </button>
                <div className="flex items-center gap-1 my-2 sm:my-0">
                  <button
                    onClick={() => setCurrentPageOder(1)}
                    className={`px-3 py-1 rounded-full ${
                      currentPageOder === 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    1
                  </button>
                  {currentPageOder > 3 && <span className="px-2">...</span>}
                  {Array.from({ length: 3 }, (_, index) => {
                    const page = currentPageOder - 1 + index;
                    if (page > 1 && page < totalPagesOder) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPageOder(page)}
                          className={`px-3 py-1 rounded-full ${
                            currentPageOder === page
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  })}
                  {currentPageOder < totalPagesOder - 2 && (
                    <span className="px-2">...</span>
                  )}
                  {totalPagesOder > 1 && (
                    <button
                      onClick={() => setCurrentPageOder(totalPagesOder)}
                      className={`px-3 py-1 rounded-full ${
                        currentPageOder === totalPagesOder
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {totalPagesOder}
                    </button>
                  )}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPageOder === totalPagesOder}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}

          {activeTab === "reportedList" && (
            <div>
              <div className="  mx-auto mt-10">
                <table className="bg-white border border-gray-200 rounded-lg shadow-md w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-6 text-left">Người bị tố cáo</th>
                      <th className="py-3 px-6 text-left">Người tố cáo</th>
                      <th className="py-3 px-6 text-left">Mục tố cáo</th>
                      <th className="py-3 px-6 text-center">Nội dung</th>
                      <th className="py-3 px-6 text-left">Thời gian</th>
                      <th className="py-3 px-6 text-center w-1/6">
                        Trạng thái
                      </th>
                      <th className="py-3 px-6 text-center">
                        Hành động (Đã xử lý | Đang xử lý)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ToCaoData.map((report) => (
                      <tr key={report.id} className="border-t hover:bg-gray-50">
                        <td className="py-4 px-6">{report.userReported}</td>
                        <td className="py-4 px-6">{report.reporter}</td>
                        <td className="py-4 px-6">{report.accusationType}</td>
                        <td className="py-4 px-6 max-w-xs truncate">
                          {report.accusationContent}
                        </td>{" "}
                        {/* Giới hạn chiều rộng và cắt text */}
                        <td className="py-4 px-6">{report.reportTime}</td>
                        <td className="py-4 px-6 text-center ">
                          <span
                            className={`py-1 px-3 rounded-full text-sm ${
                              report.status === "Chưa xử lý"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-green-200 text-green-800"
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className=" text-blue-500 hover:text-green-700">
                            Cập nhật
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Điều khiển phân trang tố cáo*/}

                <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    Trang trước
                  </button>
                  <div className="flex items-center gap-1 my-2 sm:my-0">
                    <button
                      onClick={() => handlePageSelect(1)}
                      className={`px-3 py-1 rounded-full ${
                        currentPage === 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      1
                    </button>

                    {currentPage > 3 && <span className="px-2">...</span>}

                    {Array.from({ length: 3 }, (_, index) => {
                      const page = currentPage - 1 + index;
                      if (page > 1 && page < totalReportPages) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageSelect(page)}
                            className={`px-3 py-1 rounded-full ${
                              currentPage === page
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                      return null;
                    })}

                    {currentPage < totalReportPages - 2 && (
                      <span className="px-2">...</span>
                    )}

                    {totalReportPages > 1 && (
                      <button
                        onClick={() => handlePageSelect(totalReportPages)}
                        className={`px-3 py-1 rounded-full ${
                          currentPage === totalReportPages
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {totalReportPages}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalReportPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    Trang sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:hidden">
          {currentCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <p className="font-semibold text-gray-800">
                Tên: {customer.name}
              </p>
              <p className="text-gray-600">Email: {customer.email}</p>
              <p className="text-gray-600">SĐT: {customer.phone}</p>
              <p className="text-gray-600">Ngày Sinh: {customer.birthday}</p>
              <p className="flex items-center">
                Trạng Thái:
                {customer.status === "Active" ? (
                  <span className="ml-2 text-green-600 flex items-center bg-green-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                    <FaCheckCircle className="mr-1" /> Hoạt động
                  </span>
                ) : (
                  <span className="ml-2 text-red-600 flex items-center bg-red-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                    <FaTimesCircle className="mr-1" /> Ngưng hoạt động
                  </span>
                )}
              </p>
              <button
                onClick={() => TruyCapChiTietKhachHang(customer.id)}
                className="mt-2 text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>{" "}
      </div>
    </div>
  );
};

export default HoaDon;
