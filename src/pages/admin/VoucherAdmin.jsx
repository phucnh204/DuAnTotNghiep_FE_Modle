import React, { useEffect, useState } from "react";
import "../../assets/admin/css/admin.css";
import { useNavigate } from "react-router-dom";
import api from "../../config/AdminAPI";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast"; // Import react-hot-toast

const VoucherAdmin = () => {
  const [pageSize, setPageSize] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [voucherSan, setVoucherSan] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const showForm = () => {
    navigate("/admin/voucher/form");
  };

  const showDetail = (voucherId) => {
    navigate(`/admin/voucher/form/${voucherId}`);
  };

  const fetchVoucherSan = async (page, size) => {
    try {
      const response = await api.get("voucherSanAdmin", {
        params: { page, size },
      });
      setVoucherSan(response.data.content);
      setTotalPages(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Hàm xử lý thay đổi trạng thái
  const handleStatusChange = async (voucherId, currentStatus, tenVoucher) => {
    const userConfirmed = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="max-w-md mx-auto text-center">
            <p className="text-lg font-semibold mb-4 text-gray-800">
              Bạn có muốn thay đổi trạng thái voucher {tenVoucher}?
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none transition"
              >
                Đồng ý
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none transition"
              >
                Hủy
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          position: "top-center", // Đặt thông báo ở vị trí phía trên giữa màn hình
        }
      );
    });

    if (userConfirmed) {
      // Nếu người dùng đồng ý, cập nhật trạng thái voucher
      try {
        // Gửi yêu cầu PUT với chỉ thông tin trạng thái
        const updatedStatus = currentStatus === 0 ? 1 : 0; // Đổi trạng thái (0 -> 1, 1 -> 0)

        const response = await api.post(`updateStatusCategory/${voucherId}`, {
          status: updatedStatus,
        });

        if (response.status === 200) {
          fetchVoucherSan(currentPage - 1, pageSize); // Lấy lại danh sách voucher
          // Thông báo thành công với thời gian 2 giây
          toast.success("Trạng thái voucher đã được cập nhật thành công!", {
            duration: 2000, // Hiển thị trong 2 giây
          });
        } else {
          // Thông báo lỗi với thời gian 2 giây
          toast.error("Lỗi khi cập nhật trạng thái voucher", {
            duration: 2000, // Hiển thị trong 2 giây
          });
        }
      } catch (error) {
        // Thông báo lỗi với thời gian 2 giây
        toast.error("Lỗi khi cập nhật trạng thái voucher", {
          duration: 2000, // Hiển thị trong 2 giây
        });
      }
    }
  };

  useEffect(() => {
    fetchVoucherSan(currentPage - 1, pageSize);
  }, [currentPage, pageSize]);

  return (
    <div className="bg-gray-100 w-full mx-auto">
      <section className="create-voucher-now">
        <div className="container mx-auto bg-white grid grid-cols-12 gap-4 p-6">
          <div className="col-span-12 md:col-span-4">
            <h1 className="text-xl font-semibold">
              Tạo ngay Voucher để thu hút thêm nhiều khách hàng!
            </h1>
            <p className="mt-2 text-gray-700">
              Cơ hội để có thêm <span className="font-bold">người dùng</span> và
              thêm nhiều <span className="font-bold">đơn hàng</span> khi tạo ưu
              đãi cho khách hàng.
            </p>
            <button
              onClick={showForm}
              className="mt-4 inline-block btn-color-admin text-white py-2 px-6 rounded-md"
            >
              Tạo Voucher ngay!
            </button>
          </div>
          <div className="col-span-12 md:col-span-8">
            <img
              src="../../assets/admin/img/Bg-voucher.jpg"
              alt="Voucher Image"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Voucher List Section */}
      <section className="list-voucher rounded-md mt-8">
        <div className="container bg-white mx-auto">
          <h2 className="text-xl font-semibold mb-4">Danh sách voucher</h2>
          <div className="flex space-x-4 mb-4">
            {["all", "ongoing", "upcoming", "expired"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
              >
                {tab === "all"
                  ? "Tất cả"
                  : tab === "ongoing"
                  ? "Đang diễn ra"
                  : tab === "upcoming"
                  ? "Sắp diễn ra"
                  : "Đã kết thúc"}
              </button>
            ))}
          </div>
          <div className="overflow-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
              <thead className="bg-indigo-400 text-white text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold">
                    Tên Voucher
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Loại mã
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Giảm giá
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Tổng lượt sử dụng
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Đã dùng
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Thời gian áp dụng
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
                {voucherSan.length > 0 ? (
                  voucherSan.map((voucher) => (
                    <tr
                      key={voucher.id}
                      className="hover:bg-gray-100 transition-colors text-center"
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium align-middle">
                        {voucher.tenVoucher}
                      </td>
                      <td className="px-4 py-3 text-gray-600 align-middle">
                        {voucher.loaiVoucher === 0 ? "Giảm VNĐ" : "Giảm %"}
                      </td>
                      <td className="px-4 py-3 text-green-600 font-bold align-middle">
                        {voucher.loaiVoucher === 0
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(voucher.giaTriGiam)
                          : `${voucher.giaTriGiam}%`}
                      </td>
                      <td className="px-4 py-3 text-gray-600 align-middle">
                        {voucher.soLuocDung.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600 align-middle">
                        {voucher.soLuocDaDung.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600 align-middle">
                        <div className="flex justify-center items-center gap-1">
                          <span className="text-green-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                            {new Date(voucher.ngayBatDau).toLocaleDateString()}
                          </span>
                          <span className="text-gray-500">-</span>
                          <span className="text-red-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                            {new Date(voucher.ngayKetThuc).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-700 text-center align-middle">
                        <div className="line-clamp-2">
                          {voucher.trangThai === 0 ? (
                            <span
                              className="text-green-600 inline-flex items-center justify-center bg-green-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm cursor-pointer"
                              onClick={() =>
                                handleStatusChange(
                                  voucher.id,
                                  voucher.trangThai,
                                  voucher.tenVoucher
                                )
                              }
                            >
                              <FaCheckCircle className="mr-1" /> Hoạt động
                            </span>
                          ) : (
                            <span
                              className="text-red-600 inline-flex items-center justify-center bg-red-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm cursor-pointer"
                              onClick={() =>
                                handleStatusChange(
                                  voucher.id,
                                  voucher.trangThai
                                )
                              }
                            >
                              <FaTimesCircle className="mr-1" /> Ngưng hoạt động
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 align-middle">
                        <button
                          onClick={() => showDetail(voucher.id)}
                          className="bg-green-500 text-white hover:bg-green-600 px-3 py-2 rounded-md shadow-sm ml-2 transition duration-200"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-4 py-3 text-center text-gray-500"
                      colSpan="7"
                    >
                      Không có Mã giảm giá nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Section */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
              >
                Trang trước
              </button>
              <div className="flex items-center gap-2">
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
                {currentPage > 3 && <span className="text-gray-500">...</span>}
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
                  <span className="text-gray-500">...</span>
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
        </div>
      </section>
    </div>
  );
};

export default VoucherAdmin;
