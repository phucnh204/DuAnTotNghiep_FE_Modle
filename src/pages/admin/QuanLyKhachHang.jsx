import { FaCheckCircle, FaTimesCircle, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GrPowerReset } from "react-icons/gr";
import { CiFilter } from "react-icons/ci";
import api from "../../config/AdminAPI";

const QuanLyKhachHang = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 7;
  const [user, setUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5); // Số đơn hàng mỗi trang
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [totalUser, setTotalUser] = useState(0);
  const [trangThai, setTrangThai] = useState("");
  const [sdt, setSdt] = useState("");

  // Hàm xử lý thay đổi trạng thái từ dropdown
  const handleStatusChange = (e) => {
    setTrangThai(e.target.value);
    setCurrentPage(1); // Reset về trang đầu
  };

  // Hàm xử lý thay đổi số điện thoại từ input
  const handlePhoneChange = (e) => {
    setSdt(e.target.value);
    setCurrentPage(1); // Reset về trang đầu
  };

  // Dữ liệu khách hàng mẫu

  const customerApi = {
    customers: [
      {
        id: 1,
        name: "Nguyễn Văn Phúc",
        email: "nguyenvanphuc@example.com",
        phone: "0123 456 789",
        status: "Active",
        birthday: "10-10-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 2,
        name: "Trần Thị An",
        email: "tranthian@example.com",
        phone: "0987 654 321",
        status: "Inactive",
        birthday: "05-11-2003",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 3,
        name: "Lê Văn Tam",
        email: "levantam@example.com",
        phone: "0932 456 123",
        status: "Active",
        birthday: "15-09-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 4,
        name: "Phạm Thị Dung",
        email: "phamthidung@example.com",
        phone: "0911 234 567",
        status: "Inactive",
        birthday: "20-08-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 5,
        name: "Đỗ Minh Hải",
        email: "domainehai@example.com",
        phone: "0968 123 456",
        status: "Active",
        birthday: "22-07-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 6,
        name: "Nguyễn Thị Bích",
        email: "nguyenthibich@example.com",
        phone: "0903 456 111",
        status: "Active",
        birthday: "15-10-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 7,
        name: "Trần Văn Hoàng",
        email: "tranvanhoang@example.com",
        phone: "0922 111 234",
        status: "Inactive",
        birthday: "02-10-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 8,
        name: "Lê Thị Mai",
        email: "lethimai@example.com",
        phone: "0977 222 333",
        status: "Active",
        birthday: "28-09-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 9,
        name: "Hoàng Văn Long",
        email: "hoangvanlong@example.com",
        phone: "0934 567 890",
        status: "Inactive",
        birthday: "25-09-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 10,
        name: "Phạm Quốc Bảo",
        email: "phamquocbao@example.com",
        phone: "0912 345 678",
        status: "Active",
        birthday: "15-09-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 11,
        name: "Nguyễn Phương Thảo",
        email: "nguyenphuongthao@example.com",
        phone: "0945 678 912",
        status: "Active",
        birthday: "05-09-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 12,
        name: "Đinh Hoàng Anh",
        email: "dinhhoanganh@example.com",
        phone: "0982 345 679",
        status: "Inactive",
        birthday: "01-09-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 13,
        name: "Lý Quốc Hùng",
        email: "lyquochung@example.com",
        phone: "0901 234 567",
        status: "Active",
        birthday: "29-08-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 14,
        name: "Vũ Thị Lan",
        email: "vuthilan@example.com",
        phone: "0978 654 321",
        status: "Inactive",
        birthday: "15-08-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 15,
        name: "Phạm Đình Lộc",
        email: "phamdinhloc@example.com",
        phone: "0923 567 890",
        status: "Active",
        birthday: "05-08-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 16,
        name: "Trương Thanh Bình",
        email: "truongthanhbinh@example.com",
        phone: "0967 123 456",
        status: "Inactive",
        birthday: "01-08-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 17,
        name: "Đoàn Minh Tuấn",
        email: "doanminhtuan@example.com",
        phone: "0935 456 789",
        status: "Active",
        birthday: "22-07-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 18,
        name: "Nguyễn Văn Kiên",
        email: "nguyenvankien@example.com",
        phone: "0942 567 111",
        status: "Active",
        birthday: "18-07-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 19,
        name: "Trần Thanh Phong",
        email: "tranthanhphong@example.com",
        phone: "0986 111 222",
        status: "Inactive",
        birthday: "10-07-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 20,
        name: "Bùi Thị Hạnh",
        email: "buithihanh@example.com",
        phone: "0925 333 444",
        status: "Active",
        birthday: "01-07-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 21,
        name: "Phan Thị Hoa",
        email: "phanthihoa@example.com",
        phone: "0973 456 789",
        status: "Inactive",
        birthday: "27-06-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 22,
        name: "Đỗ Thị Tuyết",
        email: "dothituyet@example.com",
        phone: "0915 789 234",
        status: "Active",
        birthday: "22-06-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 23,
        name: "Nguyễn Minh Tâm",
        email: "nguyenminhtam@example.com",
        phone: "0908 111 555",
        status: "Inactive",
        birthday: "15-06-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
      {
        id: 24,
        name: "Trần Đình Nam",
        email: "trandinh@example.com",
        phone: "0962 333 111",
        status: "Active",
        birthday: "10-06-2002",
        address: "CT",
        orders: 10,
        total: 1000000,
      },
    ],
  };

  const ToCaoData = [
    {
      id: 1,
      userReported: "Người dùng A",
      reporter: "Người tố cáo 1",
      accusationType: "Lừa đảo",
      accusationContent: "Người dùng này đã lừa đảo trong giao dịch.",
      reportTime: "2024-11-01 10:00",
      status: "Đã xử lý",
    },
    {
      id: 2,
      userReported: "Người dùng A",
      reporter: "Người tố cáo 1",
      accusationType: "Lừa đảo",
      accusationContent: "Người dùng này đã lừa đảo trong giao dịch.",
      reportTime: "2024-11-01 10:00",
      status: "Đã xử lý",
    },
    {
      id: 3,
      userReported: "Người dùng C",
      reporter: "Người tố cáo 3",
      accusationType: "Xâm phạm quyền riêng tư",
      accusationContent: "Người dùng này đã tiết lộ thông tin cá nhân của tôi.",
      reportTime: "2024-11-03 08:15",
      status: "Đã xử lý",
    },
    {
      id: 4,
      userReported: "Người dùng A",
      reporter: "Người tố cáo 1",
      accusationType: "Lừa đảo",
      accusationContent: "Người dùng này đã lừa đảo trong giao dịch.",
      reportTime: "2024-11-01 10:00",
      status: "Chưa xử lý",
    },
    {
      id: 4,
      userReported: "Người dùng A",
      reporter: "Người tố cáo 1",
      accusationType: "Lừa đảo",
      accusationContent: "Người dùng này đã lừa đảo trong giao dịch.",
      reportTime: "2024-11-01 10:00",
      status: "Chưa xử lý",
    },
    {
      id: 4,
      userReported: "Người dùng A",
      reporter: "Người tố cáo 1",
      accusationType: "Lừa đảo",
      accusationContent: "Người dùng này đã lừa đảo trong giao dịch.",
      reportTime: "2024-11-01 10:00",
      status: "Chưa xử lý",
    },
    {
      id: 4,
      userReported: "Người dùng A",
      reporter: "Người tố cáo 1",
      accusationType: "Lừa đảo",
      accusationContent: "Người dùng này đã lừa đảo trong giao dịch.",
      reportTime: "2024-11-01 10:00",
      status: "Chưa xử lý",
    },
    {
      id: 4,
      userReported: "Người dùng A",
      reporter: "Người tố cáo 1",
      accusationType: "Lừa đảo",
      accusationContent: "Người dùng này đã lừa đảo trong giao dịch.",
      reportTime: "2024-11-01 10:00",
      status: "Chưa xử lý",
    },
    {
      id: 4,
      userReported: "Người dùng A",
      reporter: "Người tố cáo 1",
      accusationType: "Lừa đảo",
      accusationContent: "Người dùng này đã lừa đảo trong giao dịch.",
      reportTime: "2024-11-01 10:00",
      status: "Chưa xử lý",
    },
  ];

  const fetchUser = async (page, size) => {
    try {
      const response = await api.get(`user`, {
        params: { page, size, trangThai, sdt },
      });

      const data = response.data;
      const users = data.content.map((item) => ({
        id: item[0],
        email: item[1],
        tenTaiKhoan: item[2],
        soDienThoai: item[3],
        hoVaTen: item[4],
        hinhAnh: item[5],
        trangThai: item[6],
        soLuongDonHang: item[7],
        tongGiaTriDonHang: item[8],
      }));

      setUser(users);
      setTotalPages(data.totalPages);
      setTotalUser(data.totalElements);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Chuyển hướng đến chi tiết khách hàng
  const TruyCapChiTietKhachHang = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  // Tính toán số trang tổng cộng cho bảng tố cáo
  const totalReportPages = Math.ceil(ToCaoData.length / itemsPerPage);

  // Lấy dữ liệu tố cáo của trang hiện tại
  const currentReports = ToCaoData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageSelect = (page) => {
    setCurrentPage(page);
  };
  const [activeTab, setActiveTab] = useState("userList");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  useEffect(() => {
    fetchUser(currentPage - 1, pageSize);
  }, [currentPage, pageSize, trangThai, sdt]);

  return (
    <div className="w-full h-full shadow-lg rounded-lg ">
      {/* Header */}

      {/* Bảng khách hàng */}
      {/*  */}
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
            Danh sách người dùng
          </button>
          <button
            onClick={() => handleTabClick("reportedList")}
            className={`py-2 px-4 text-lg font-medium ${
              activeTab === "reportedList"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600"
            }`}
          >
            Danh sách bị tố cáo
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "userList" && (
            <div className="bg-white">
              <div className="sticky top-0 bg-white p-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">
                    {" "}
                    <span className="text-gray-500 text-sm">
                      ({totalUser} khách hàng)
                    </span>
                  </h2>

                  {/* Bộ lọc và tìm kiếm */}
                  <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <select
                      value={trangThai}
                      onChange={handleStatusChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition"
                    >
                      <option value="">Tất cả khách hàng</option>
                      <option value="HoatDong">Còn hoạt động</option>
                      <option value="NgungHoatDong">Ngưng hoạt động</option>
                    </select>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={sdt}
                        onChange={handlePhoneChange}
                        placeholder="Tìm theo số điện thoại"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      />
                      <FaSearch className="absolute top-4 right-2 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              <table className="min-w-full text-center  md:table rounded  overflow-hidden sm:hidden">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Mã
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Điện thoại
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Tổng đơn hàng
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Tổng giá trị
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.tenTaiKhoan}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.soDienThoai}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.email || "Chưa cập nhật"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Intl.NumberFormat("vi-VN").format(
                          item.soLuongDonHang
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.tongGiaTriDonHang)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {item.trangThai == "HoatDong" ? (
                          <span className="text-green-600 flex items-center justify-center bg-green-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                            <FaCheckCircle className="mr-1" /> Hoạt động
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center justify-center bg-red-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                            <FaTimesCircle className="mr-1" /> Ngưng hoạt động
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
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
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Trang trước
                </button>
                <div className="flex items-center gap-1 my-2 sm:my-0">
                  <button
                    onClick={() => setCurrentPage(1)}
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
                    if (page > 1 && page < totalPages) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
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
                  {currentPage < totalPages - 2 && (
                    <span className="px-2">...</span>
                  )}
                  {totalPages > 1 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 rounded-full ${
                        currentPage === totalPages
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
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

        {/* Điện thoại View */}
        {/* <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:hidden">
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
        </div> */}
      </div>
    </div>
  );
};

export default QuanLyKhachHang;
