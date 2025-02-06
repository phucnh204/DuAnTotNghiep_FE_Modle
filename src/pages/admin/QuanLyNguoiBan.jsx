import React, { useEffect, useState } from "react";
import api from "../../config/AdminAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const QuanLyNguoiBan = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [totalSellers, setTotalSellers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(1);
  const [statusFilter, setStatusFilter] = useState(""); // Trạng thái của cửa hàng
  const [nameFilter, setNameFilter] = useState(""); // Tên cửa hàng

  const fetchSellers = async (page = 0, size = pageSize, trangThai, name) => {
    try {
      const response = await api.get(`seller/getAllSeller`, {
        params: { page, size, trangThai, name },
      });
      const data = response.data;
      const sellerList = data.content.map((item) => ({
        shopId: item[0],
        tenShop: item[1],
        hoVaTen: item[2],
        anhDaiDien: item[3],
        ngayDangKy: item[4],
        trangThai: item[5],
        soDienThoai: item[6],
        totalOrders: item[7],
        totalRevenue: item[8],
      }));
      setSellers(sellerList);
      setTotalSellers(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
    fetchSellers(0, pageSize, statusFilter, nameFilter);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchSellers(currentPage - 1, pageSize, statusFilter, nameFilter);
  }, [currentPage, pageSize, statusFilter, nameFilter]);

  return (
    <div className="w-full">
      <div className="shadow-lg p-10 bg-white">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800">
            Quản lý người bán{" "}
            <span className="text-gray-600 text-sm">
              {totalSellers} nhà bán hàng
            </span>
          </h2>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="">Tất cả cửa hàng</option>
              <option value="1">Cửa hàng còn hoạt động</option>
              <option value="0">Cửa hàng ngưng hoạt động</option>
            </select>
            <input
              type="text"
              value={nameFilter}    
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Tìm kiếm tên cửa hàng..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              onClick={handleFilterChange}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Lọc
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto rounded-lg max-h-[600px]">
          {sellers.map((seller) => (
            <div
              key={seller.shopId}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center"
            >
              <img
                className="w-24 h-24 rounded-full"
                src={seller.anhDaiDien}
                alt={seller.tenShop}
              />
              <h3
                className="text-2xl font-semibold text-gray-800 mt-2 line-clamp-1"
                title={seller.tenShop}
              >
                {seller.tenShop}
              </h3>
              <p className="w-full border-b py-2">
                {seller.soDienThoai} / {seller.hoVaTen}
              </p>
              <div className="grid grid-cols-3 gap-2 py-2">
                <div>
                  <p className="text-gray-800 font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(seller.totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-400">Doanh thu</p>
                </div>
                <div className="border-x">
                  <p className="text-gray-800 font-medium">
                    {seller.totalOrders}
                  </p>
                  <p className="text-xs text-gray-400">Hóa đơn</p>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">
                    {new Date(seller.ngayDangKy).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-400">Ngày tham gia</p>
                </div>
              </div>
              <div className="text-center mb-2">
                {seller.trangThai === 1 ? (
                  <span className="text-green-700 flex items-center justify-center bg-green-100 px-4 py-2 rounded-full text-sm font-medium">
                    Hoạt động
                  </span>
                ) : (
                  <span className="text-red-700 flex items-center justify-center bg-red-100 px-4 py-2 rounded-full text-sm font-medium">
                    Ngưng hoạt động
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate(`/admin/sellerDetail/${seller.shopId}`)}
                className="text-sm text-blue-600 hover:underline"
              >
                Xem cửa hàng
              </button>
            </div>
          ))}
        </div>
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
            {currentPage < totalPages - 2 && <span className="px-2">...</span>}
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
  );
};

export default QuanLyNguoiBan;
