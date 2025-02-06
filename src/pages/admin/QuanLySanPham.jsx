import React, { useState } from "react";
import { FaEye, FaPauseCircle } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { CiFilter } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSearch } from "react-icons/fa";
import api from "../../config/AdminAPI";
import { useEffect } from "react";
const QuanLySanPham = () => {
  const navigate = useNavigate();
  // const SanPhamData = [
  //   {
  //     id: 1,
  //     Shop: "Toy Store A",
  //     TenSanPham: "Xe ô tô đồ chơi",
  //     NgayDang: "2024-11-11",
  //     SoLuong: 0,
  //     HinhAnh:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzB90-xJHpnKJrC18Y0cDRXQuE4FNY6mY08g&s",
  //     GiaBan: 300000,
  //     LuotBan: 150,
  //     TrangThai: "Đang bán",
  //   },
  //   {
  //     id: 2,
  //     Shop: "Kids World",
  //     TenSanPham: "Búp bê Barbie",
  //     NgayDang: "2024-10-10",
  //     SoLuong: 80,
  //     HinhAnh:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzB90-xJHpnKJrC18Y0cDRXQuE4FNY6mY08g&s",
  //     GiaBan: 250000,
  //     LuotBan: 220,
  //     TrangThai: "Đang bán",
  //   },
  //   {
  //     id: 3,
  //     Shop: "Toy Kingdom",
  //     TenSanPham: "Robot biến hình",
  //     NgayDang: "2024-09-09",
  //     SoLuong: 30,
  //     HinhAnh:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzB90-xJHpnKJrC18Y0cDRXQuE4FNY6mY08g&s",
  //     GiaBan: 400000,
  //     LuotBan: 180,
  //     TrangThai: "Ngừng bán",
  //   },
  //   {
  //     id: 4,
  //     Shop: "Toy Store B",
  //     TenSanPham: "Đồ chơi xếp hình",
  //     NgayDang: "2024-08-08",
  //     SoLuong: 100,
  //     HinhAnh:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzB90-xJHpnKJrC18Y0cDRXQuE4FNY6mY08g&s",
  //     GiaBan: 150000,
  //     LuotBan: 300,
  //     TrangThai: "Đang bán",
  //   },
  //   {
  //     id: 5,
  //     Shop: "Toy Shop",
  //     TenSanPham: "Súng nước",
  //     NgayDang: "2024-07-07",
  //     SoLuong: 60,
  //     HinhAnh:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzB90-xJHpnKJrC18Y0cDRXQuE4FNY6mY08g&s",
  //     GiaBan: 120000,
  //     LuotBan: 90,
  //     TrangThai: "Đang bán",
  //   },
  //   {
  //     id: 6,
  //     Shop: "Kids Market",
  //     TenSanPham: "Bộ đồ chơi nấu ăn",
  //     NgayDang: "2024-06-06",
  //     SoLuong: 45,
  //     HinhAnh:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzB90-xJHpnKJrC18Y0cDRXQuE4FNY6mY08g&s",
  //     GiaBan: 180000,
  //     LuotBan: 120,
  //     TrangThai: "Ngừng bán",
  //   },
  //   {
  //     id: 7,
  //     Shop: "Toy Land",
  //     TenSanPham: "Đồ chơi lắp ráp xe",
  //     NgayDang: "2024-05-05",
  //     SoLuong: 35,
  //     HinhAnh:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzB90-xJHpnKJrC18Y0cDRXQuE4FNY6mY08g&s",
  //     GiaBan: 350000,
  //     LuotBan: 140,
  //     TrangThai: "Đang bán",
  //   },
  //   {
  //     id: 8,
  //     Shop: "Kids Universe",
  //     TenSanPham: "Gấu bông Teddy",
  //     NgayDang: "2024-04-04",
  //     SoLuong: 70,
  //     HinhAnh:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzB90-xJHpnKJrC18Y0cDRXQuE4FNY6mY08g&s",
  //     GiaBan: 200000,
  //     LuotBan: 230,
  //     TrangThai: "Đang bán",
  //   },
  //   {
  //     id: 9,
  //     Shop: "Toy World",
  //     TenSanPham: "Bàn cờ vua mini",
  //     NgayDang: "2024-03-03",
  //     SoLuong: 25,
  //     HinhAnh:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzB90-xJHpnKJrC18Y0cDRXQuE4FNY6mY08g&s",
  //     GiaBan: 90000,
  //     LuotBan: 50,
  //     TrangThai: "Ngừng bán",
  //   },
  //   {
  //     id: 10,
  //     Shop: "Fun Toys",
  //     TenSanPham: "Đồ chơi lego mini",
  //     NgayDang: "2024-02-02",
  //     SoLuong: 150,
  //     HinhAnh:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzB90-xJHpnKJrC18Y0cDRXQuE4FNY6mY08g&s",
  //     GiaBan: 300000,
  //     LuotBan: 500,
  //     TrangThai: "Đang bán",
  //   },
  //   {
  //     id: 11,
  //     Shop: "Model Masters",
  //     TenSanPham: "Mô hình Gundam RX-78",
  //     NgayDang: "2024-01-01",
  //     SoLuong: 45,
  //     HinhAnh: "https://legaxi.com/wp-content/uploads/2021/12/DSC02515.jpg",
  //     GiaBan: 500000,
  //     LuotBan: 120,
  //     TrangThai: "Đang bán",
  //   },
  //   {
  //     id: 12,
  //     Shop: "Robo World",
  //     TenSanPham: "Robot điều khiển từ xa",
  //     NgayDang: "2024-01-02",
  //     SoLuong: 30,
  //     HinhAnh: "https://legaxi.com/wp-content/uploads/2021/12/DSC02515.jpg",
  //     GiaBan: 350000,
  //     LuotBan: 110,
  //     TrangThai: "Ngừng bán",
  //   },
  //   {
  //     id: 13,
  //     Shop: "Mecha Shop",
  //     TenSanPham: "Mô hình Megatron",
  //     NgayDang: "2024-01-03",
  //     SoLuong: 25,
  //     HinhAnh: "https://legaxi.com/wp-content/uploads/2021/12/DSC02515.jpg",
  //     GiaBan: 600000,
  //     LuotBan: 130,
  //     TrangThai: "Đang bán",
  //   },
  //   {
  //     id: 14,
  //     Shop: "Toy Universe",
  //     TenSanPham: "Robot ASIMO",
  //     NgayDang: "2024-01-04",
  //     SoLuong: 55,
  //     HinhAnh: "https://legaxi.com/wp-content/uploads/2021/12/DSC02515.jpg",
  //     GiaBan: 450000,
  //     LuotBan: 140,
  //     TrangThai: "Đang bán",
  //   },
  //   {
  //     id: 15,
  //     Shop: "Toy Galaxy",
  //     TenSanPham: "Mô hình Iron Man Mark 50",
  //     NgayDang: "2024-01-05",
  //     SoLuong: 40,
  //     HinhAnh: "https://legaxi.com/wp-content/uploads/2021/12/DSC02515.jpg",
  //     GiaBan: 700000,
  //     LuotBan: 160,
  //     TrangThai: "Ngừng bán",
  //   },
  // ];

  // Dữ liệu SP bị tố cáo
  // const reportedProducts = [
  //   {
  //     id: 1,
  //     TenSanPham: "Xe ô tô đồ chơi",
  //     LyDoToCao: "Mô tả sai lệch",
  //     NguoiToCao: "Nguyễn Văn Phúc",
  //     CuaHang: "Toy Store A",
  //     NgayToCao: "2024-11-10",
  //     NoiDungToCao:
  //       "Sản phẩm không giống như hình ảnh và mô tả, chất lượng kém.",
  //     TinhTrangToCao: "Chờ xử lý",
  //     HinhAnhSanPham:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUs-8rObXxjgIBcTBUKq7AUUfFTwbAKlTeDg&s",
  //   },
  //   {
  //     id: 2,
  //     TenSanPham: "Búp bê Barbie",
  //     LyDoToCao: "Chất lượng kém",
  //     NguoiToCao: "Trần Thị B",
  //     CuaHang: "Kids World",
  //     NgayToCao: "2024-11-09",
  //     NoiDungToCao: "Búp bê bị hỏng sau một ngày sử dụng.",
  //     TinhTrangToCao: "Chờ xử lý",
  //     HinhAnhSanPham:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUs-8rObXxjgIBcTBUKq7AUUfFTwbAKlTeDg&s",
  //   },
  //   {
  //     id: 3,
  //     TenSanPham: "Robot biến hình",
  //     LyDoToCao: "Không hoạt động",
  //     NguoiToCao: "Lê Văn C",
  //     CuaHang: "Toy Kingdom",
  //     NgayToCao: "2024-11-08",
  //     NoiDungToCao: "Robot không thể biến hình như quảng cáo.",
  //     TinhTrangToCao: "Chờ xử lý",
  //     HinhAnhSanPham:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUs-8rObXxjgIBcTBUKq7AUUfFTwbAKlTeDg&s",
  //   },
  // ];

  const [showFilters, setShowFilters] = useState(false); // Trạng thái ẩn/hiện bộ lọc
  const [activeTab, setActiveTab] = useState("Danh sách sản phẩm");
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(2); // Số đơn hàng mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [totalProducts, setTotalProducts] = useState(0);

  // Trạng thái lưu trữ các bộ lọc
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterShop, setFilterShop] = useState("");

  const fetchProducts = async (page, size) => {
    try {
      // Debug thông qua console log để xem các tham số
      console.log("Fetching products with filters:", {
        page,
        size,
        name: filterName,
        trangThai: filterStatus,
        shopName: filterShop,
      });

      const response = await api.get("productsAdmin", {
        params: {
          page,
          size,
          name: filterName,
          trangThai: filterStatus,
          shopName: filterShop,
        },
      });

      const data = response.data;
      const products = data.content.map((item) => ({
        sanPhamId: item[0],
        tenSanPham: item[1],
        hinhAnh: item[2],
        trangThaiSanPham: item[3],
        video: item[4],
        soLuongDaBan: item[5],
        tenShop: item[6],
        theLoai: item[7],
        giaLonNhat: item[8],
        giaNhoNhat: item[9],
        giaTriKhuyenMai: item[10],
      }));

      setProducts(products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.totalElements);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value);
    setCurrentPage(1); // Quay lại trang đầu tiên
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(1); // Quay lại trang đầu tiên
  };

  const handleFilterShopChange = (event) => {
    setFilterShop(event.target.value);
    setCurrentPage(1); // Quay lại trang đầu tiên
  };

  const TruyCapChiTietSanPham = (productId) => {
    navigate(`/admin/products/${productId}`);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageSelect = (page) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setFilterName("");
    setFilterStatus("");
    setFilterShop("");
    setCurrentPage(1); // Quay lại trang đầu tiên
  };
  const suspendProduct = (productTenSP, cuaHang) => {
    alert(`Đã tạm ngưng sản phẩm: ${productTenSP} của cửa hàng ${cuaHang}`);
    // Cập nhật trạng thái sản phẩm trong cơ sở dữ liệu
  };

  useEffect(() => {
    fetchProducts(currentPage - 1, pageSize);
  }, [currentPage, pageSize, filterName, filterStatus, filterShop]);

  return (
    <div className="w-full h-full shadow-lg rounded-lg p-6 bg-gray-50">
      {/* Nút Hiện/Tắt Bộ Lọc */}
      <div className="flex justify-between mb-2">
        <h2 className="text-2xl font-extrabold text-gray-800">
          Quản Lý Sản Phẩm
          <span className="text-gray-500 text-sm ml-1">
            ({totalProducts} sản phẩm)
          </span>
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
      {/* Bộ lọc */}
      {showFilters && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 mb-6 border border-gray-600 p-4">
          <div className="col-span-2">
            <label className="block mb-2 font-medium">Tìm kiếm:</label>
            <input
              type="text"
              value={filterName}
              onChange={handleFilterNameChange}
              placeholder="Tên sản phẩm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 font-medium">Trạng thái:</label>
            <select
              value={filterStatus}
              onChange={handleFilterStatusChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Tất cả</option>
              <option value="1">Đang bán</option>
              <option value="0">Ngừng bán</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block mb-2 font-medium">Cửa hàng:</label>
            <input
              type="text"
              value={filterShop}
              onChange={handleFilterShopChange}
              placeholder="Tên cửa hàng"
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
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
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4 border-b border-gray-300">
        {["Danh sách sản phẩm", "Sản phẩm bị tố cáo"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`relative px-4 py-2 font-medium transition duration-300 ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 rounded-t-lg"></span>
            )}
          </button>
        ))}
      </div>

      {/* Active Tab */}
      {activeTab === "Danh sách sản phẩm" && (
        <div>
          <table className="min-w-full text-center  md:table rounded  overflow-hidden sm:hidden">
            <thead>
              <tr className="">
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Mã
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Cửa hàng
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Doanh mục
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Lượt bán
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Giá bán
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="">
              {products.map((item) => (
                <tr
                  key={item.sanPhamId}
                  className="hover:bg-gray-100 transition-colors  text-center "
                >
                  <td className="px-3 py-3 text-sm text-gray-600 text-center font-semibold align-middle w-28 overflow-hidden overflow-ellipsis">
                    {item.sanPhamId}
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-600 text-start align-middle w-58 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.hinhAnh}
                        alt={item.tenSanPham}
                        className="w-0 h-0 object-cover rounded-lg lg:w-16 lg:h-16"
                      />
                      <span className="line-clamp-2">{item.tenSanPham}</span>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-600 text-center align-middle w-42 overflow-hidden">
                    <div className="line-clamp-2">{item.tenShop}</div>
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-600 text-center align-middle w-30 overflow-hidden">
                    <div className="line-clamp-2">{item.theLoai}</div>
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-600 text-center align-middle w-24 overflow-hidden">
                    <div className="line-clamp-2">
                      {new Intl.NumberFormat("vi-VN").format(item.soLuongDaBan)}{" "}
                    </div>
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-600 text-center align-middle w-40">
                    <div className="flex flex-col items-center">
                      {item.giaNhoNhat === item.giaLonNhat ? (
                        // Nếu giá nhỏ nhất và lớn nhất bằng nhau, chỉ hiển thị 1 giá
                        <span className="text-green-600 font-medium">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            item.giaTriKhuyenMai > 0
                              ? item.giaNhoNhat *
                                  (1 - item.giaTriKhuyenMai / 100) // Áp dụng khuyến mãi
                              : item.giaNhoNhat
                          )}
                        </span>
                      ) : (
                        // Nếu giá nhỏ nhất và lớn nhất khác nhau, hiển thị cả khoảng giá
                        <>
                          {/* Giá nhỏ nhất */}
                          <span className="text-green-600 font-medium">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              item.giaTriKhuyenMai > 0
                                ? item.giaNhoNhat *
                                    (1 - item.giaTriKhuyenMai / 100) // Áp dụng khuyến mãi
                                : item.giaNhoNhat
                            )}
                          </span>
                          {/* Dấu hoặc chữ thể hiện khoảng giá */}
                          <span className="text-xs text-gray-500">Đến</span>
                          {/* Giá lớn nhất */}
                          <span className="text-red-600 font-medium">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              item.giaTriKhuyenMai > 0
                                ? item.giaLonNhat *
                                    (1 - item.giaTriKhuyenMai / 100) // Áp dụng khuyến mãi
                                : item.giaLonNhat
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-600 text-center align-middle w-36 overflow-hidden">
                    <div className="line-clamp-2">
                      {item.trangThaiSanPham == 1 ? (
                        <span className="text-green-600 inline-flex items-center justify-center bg-green-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                          <FaCheckCircle className="mr-1" /> Hoạt động
                        </span>
                      ) : (
                        <span className="text-red-600 inline-flex items-center justify-center bg-red-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                          <FaTimesCircle className="mr-1" /> Ngưng hoạt động
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-600 text-center align-middle w-16 overflow-hidden">
                    <button
                      onClick={() => TruyCapChiTietSanPham(item.sanPhamId)}
                      className="text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
                    >
                      Xem
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

      {activeTab === "Sản phẩm bị tố cáo" && (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Danh sách sản phẩm bị tố cáo
          </h2>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-indigo-50 text-gray-700">
                <th className="py-4 px-6 font-semibold border-b">Hình ảnh</th>
                <th className="py-4 px-6 font-semibold border-b">
                  Tên sản phẩm
                </th>
                <th className="py-4 px-6 font-semibold border-b">
                  Lý do tố cáo
                </th>
                <th className="py-4 px-6 font-semibold border-b">
                  Người tố cáo
                </th>
                <th className="py-4 px-6 font-semibold border-b">Cửa hàng</th>
                <th className="py-4 px-6 font-semibold border-b">
                  Ngày tố cáo
                </th>
                <th className="py-4 px-6 font-semibold border-b">Tình trạng</th>
                <th className="py-4 px-6 font-semibold border-b text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {reportedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
             
                  <td className="py-4 px-6 border-b">
                    <img
                      src={product.HinhAnhSanPham}
                      alt={product.TenSanPham}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300 shadow-sm transition-transform transform hover:scale-105"
                    />
                  </td>
                
                  <td className="py-4 border-b text-gray-700">
                    {product.TenSanPham}
                  </td>
                
                  <td className="py-4 px-6 border-b text-gray-600">
                    {product.LyDoToCao}
                  </td>
                

                  <td className="py-4 border-b text-gray-600">
                    {product.NguoiToCao.split(" ")
                      .map((part, index, arr) =>
                        index === 0 || index === arr.length - 1
                          ? `${part[0]}${"*".repeat(part.length - 1)}`
                          : "*".repeat(part.length)
                      )
                      .join(" ")}
                  </td>

                  
                  <td className="py-4 px-6 border-b text-gray-600">
                    {product.CuaHang}
                  </td>
                 
                  <td className="py-4 px-6 border-b text-gray-600">
                    {product.NgayToCao}
                  </td>
                 
                  <td className="py-4  border-b text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm  ${
                        product.TinhTrangToCao === "Chờ xử lý"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {product.TinhTrangToCao}
                    </span>
                  </td>
                 
                  <td className="py-4 px-1 border-b text-center flex items-center justify-center space-x-2">
                    <button
                      onClick={() =>
                        suspendProduct(product.TenSanPham, product.CuaHang)
                      }
                      className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition duration-200 flex items-center justify-center"
                      title="Tạm ngưng sản phẩm"
                    >
                      <FaPauseCircle className="text- mr-1" />
                      <p>Tạm ngưng sản phẩm</p>
                    </button>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuanLySanPham;
