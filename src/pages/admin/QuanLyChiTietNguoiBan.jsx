import { useState, useEffect } from "react";
import { MdStore } from "react-icons/md";
import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";
import { AiOutlinePhone } from "react-icons/ai";
import {
  FaStore,
  FaEnvelope,
  FaClipboardCheck,
  FaCamera,
  FaIdBadge,
} from "react-icons/fa";
import api from "../../config/AdminAPI";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
// import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import {
  FaMapMarkerAlt,
  FaListOl,
  FaBoxOpen,
  FaShoppingCart,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaInfoCircle,
  FaIndustry,
  FaFileContract,
  FaBuilding,
  FaPassport,
  FaSearch,
  FaBox,
  FaStar,
} from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";

function QuanLyChiTietNguoiBan() {
  const [orders, setOrders] = useState([]); // Lưu danh sách đơn hàng
  const [product, setProduct] = useState([]);
  const [currentPageOder, setCurrentPageOder] = useState(1); // Trang hiện tại
  const [pageSizeOder, setPageSizeOder] = useState(3); // Số đơn hàng mỗi trang
  const [totalPagesOder, setTotalPagesOder] = useState(0); // Tổng số trang
  const [currentPageProduct, setCurrentPageProduct] = useState(1); // Trang hiện tại
  const [pageSizeProduct, setPageSizeProduct] = useState(1); // Số đơn hàng mỗi trang
  const [totalPagesProduct, setTotalPagesProduct] = useState(0); // Tổng số trang
  const [searchTerm, setSearchTerm] = useState("");
  const [sellersDetail, setSellersDetail] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [shopReport, setShopReport] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { shopId } = useParams();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullImage, setFullImage] = useState("");

  const fetchSellerDetail = async (shopId) => {
    try {
      const response = await api.get(`sellerDetail/${shopId}`);

      const data = response.data; // Dữ liệu nhận được từ API

      const getSellerDetail = {
        id: data[0][0],
        tenShop: data[0][1],
        hoVaTen: data[0][2],
        email: data[0][3],
        anhDaiDien: data[0][4],
        ngayDangKy: data[0][5],
        hinhChupThe: data[0][6],
        anhCamThe: data[0][7],
        maSoThue: data[0][8],
        giayPhepKinhDoanh: data[0][9],
        loaiHinhKinhDoanh: data[0][10],
        xacMinh: data[0][11],
        trangThai: data[0][12],
        soDienThoai: data[0][13],
        toanBoDiaChi: data[0][14],
        tenCongTy: data[0][15],
      };
      setSellersDetail(getSellerDetail);
      if (getSellerDetail.trangThai == 1) {
        setIsChecked(true);
      }
    } catch (error) {
      alert("lỗi: " + shopId);
      console.error("Error fetching seller detail:", error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setFullImage(imageUrl);
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFullImage("");
  };

  const fetchProduct = async (shopId, page, size) => {
    try {
      const response = await api.get(`sellerProduct/${shopId}`, {
        params: { page, size },
      });

      const data = response.data;

      const products = data.content.map((item) => ({
        id: item[0],
        tenSanPham: item[1],
        soLuong: item[2],
        moTa: item[3],
        hinhAnh: item[4],
        trangThai: item[5],
        video: item[6],
        cuaHangId: item[7],
        thuongHieuId: item[8],
        theLoaiId: item[9],
        soLuongDaBan: item[10],
        giaBan: item[12],
      }));
      console.log(data);
      // Cập nhật state với dữ liệu đơn hàng và phân trang
      setProduct(products);
      setTotalPagesProduct(data.totalPages);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchOrders = async (shopId, page, size) => {
    try {
      const response = await api.get(`sellerOder/${shopId}`, {
        params: { page, size },
      });

      const data = response.data;

      // Ánh xạ dữ liệu vào đối tượng order
      const orders = data.content.map((item) => ({
        id: item[0],
        taiKhoanId: item[1],
        ngayTaoDon: item[2],
        tongTien: item[4],
        hinhThuc: item[6],
        diaChi: item[7],
        trangThai: item[12],
      }));

      // Cập nhật state với dữ liệu đơn hàng và phân trang
      setOrders(orders);
      setTotalPagesOder(data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchStatistics = async (shopId) => {
    try {
      const response = await api.get(`seller/statistics/${shopId}`);

      const data = response.data; // Dữ liệu nhận được từ API

      setStatistics(data);
    } catch (error) {
      console.error("Error fetching seller detail:", error);
    }
  };

  const fetchShopReport = async () => {
    try {
      const response = await api.get(`sellerReport/1`);

      const data = response.data;

      setShopReport(data);
    } catch (error) {
      console.error("Error fetching shop report:", error);
    }
  };

  const handleUpdateTrangThai = async (id, currentTrangThai) => {
    const newTrangThai = currentTrangThai == 1 ? 0 : 1;
    try {
      await api.put(`${id}/updateStatus`, null, {
        params: { trangThai: newTrangThai },
      });
      fetchSellerDetail(shopId);
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

  const handleCreateReport = async (e) => {
    e.preventDefault();

    // Tạo object JSON để gửi
    const reportData = {
      shopId: sellersDetail.id,
      reportId: selectedReport,
      reportedBy: 22,
      status: 1,
      content: "Admin xử lí vi phạm",
      image: "", // Nếu không có ảnh
    };

    try {
      const response = await api.post(
        "createReport",
        reportData, // Dữ liệu JSON
        { headers: { "Content-Type": "application/json" } }
      );

      toggleModal();

      if (response.data > 0) {
        handleUpdateTrangThai(sellersDetail.id, sellersDetail.trangThai);
      } else {
        toast.warning("Cập nhật trạng thái thất bại", {
          autoClose: 2500,
        });
      }
    } catch (error) {
      toast.error("Xãy ra lỗi, vui lòng thử lại sau", {
        autoClose: 2500,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPageOder < totalPagesOder) {
      setCurrentPageOder(currentPageOder + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPageOder > 1) {
      setCurrentPageOder(currentPageOder - 1);
    }
  };

  const handleNextPageProduct = () => {
    if (currentPageProduct < totalPagesProduct) {
      setCurrentPageProduct(currentPageProduct + 1);
    }
  };

  const handlePreviousPageProduct = () => {
    if (currentPageProduct > 1) {
      setCurrentPageProduct(currentPageProduct - 1);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchOrders(shopId, currentPageOder - 1, pageSizeOder);
    }
  }, [shopId, currentPageOder, pageSizeOder]);

  useEffect(() => {
    if (shopId) {
      fetchProduct(shopId, currentPageProduct - 1, pageSizeProduct);
    }
  }, [shopId, currentPageProduct, pageSizeProduct]);

  useEffect(() => {
    fetchSellerDetail(shopId);
    fetchStatistics(shopId);
  }, [shopId]);

  const toggleModal = () => {
    setIsReportOpen(!isReportOpen);
  };

  const handleSelectReport = (id) => {
    setSelectedReport(id);
  };

  const handleConfirm = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Bạn có chắc chắn muốn thực hiện hành động này?</p>
          <button
            onClick={() => {
              alert("ok");
              closeToast(); // Đóng thông báo
            }}
          >
            OK
          </button>
          <button
            onClick={() => {
              console.log("Người dùng chọn Cancel");
              closeToast(); // Đóng thông báo
            }}
          >
            Cancel
          </button>
        </div>
      ),
      { autoClose: false } // Giữ thông báo cho đến khi người dùng tương tác
    );
  };

  const [selectedViolation, setSelectedViolation] = useState(null);

  const handleOpenConfirm = () => {
    document.body.style.overflowY = "scroll";

    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-white p-5 rounded-lg shadow-md text-center">
          <h1 className="text-xl mb-4 font-medium text-blue-700">
            Xác nhận thay đổi trạng thái {sellersDetail.tenShop}
          </h1>
          <p className="font-sans mb-4">
            Chuyển trạng thái từ{" "}
            <strong className="font-semibold text-blue-600">
              {sellersDetail.trangThai == 0 ? "Ngưng hoạt động" : "Hoạt động"}
            </strong>{" "}
            sang{" "}
            <strong className="font-semibold text-blue-600">
              {sellersDetail.trangThai == 0 ? "Hoạt động" : "Ngưng hoạt động"}
            </strong>
          </p>

          <div>
            <button
              onClick={() => {
                onClose();
                if (sellersDetail.trangThai != 0) {
                  if (fetchShopReport()) {
                    setIsReportOpen(true);
                  }
                } else {
                  handleUpdateTrangThai(
                    sellersDetail.id,
                    sellersDetail.trangThai
                  );
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

  return (
    <div className=" bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 w-full ">
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
          <div className="relative p-6 w-full max-w-3xl bg-white rounded-lg shadow-lg dark:bg-gray-700">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                Lý do khóa {sellersDetail.tenShop}
              </h2>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-72">
              <div className="space-y-2">
                {shopReport.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectReport(item.id)}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedReport === item.id ? "bg-blue-100" : "bg-gray-50"
                    } hover:bg-blue-100`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.tieuDe}
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-white">
                      {item.noiDung}
                    </p>
                  </div>
                ))}
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
      <div className=" mx-auto bg-white shadow-xl  p-8">
        <div className="grid grid-cols-12 gap-4  ">
          {/* Thông tin shop - chiếm 3 phần */}
          <div className="col-span-12 grid lg:col-span-3 p-4 sm:p-6 border-b lg:border-r lg:border-b-0 border-gray-100">
            <label className="relative inline-flex items-center cursor-pointer mb-4 sm:mb-0 sm:bottom-10 sm:right-8">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleOpenConfirm}
                className="sr-only peer"
              />
              <div
                className={`w-12 h-6 rounded-full transition-colors duration-500 ease-in-out ${
                  isChecked
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-300 hover:bg-red-400"
                } peer-focus:outline-none peer-focus:ring-transparent relative`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 transform ${
                    isChecked
                      ? "translate-x-6 shadow-lg bg-indigo-500"
                      : "shadow-md"
                  }`}
                ></div>
              </div>
              <span
                className={`ml-2 sm:ml-4 text-sm sm:text-base font-semibold transition-colors duration-300 ${
                  isChecked ? "text-green-600" : "text-red-600"
                }`}
              >
                {isChecked ? "Đang hoạt động" : "Ngưng hoạt động"}
              </span>
            </label>

            <img
              src={sellersDetail.anhDaiDien}
              alt="Logo"
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full shadow-lg mx-auto mb-4"
            />
            <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-blue-800 text-center">
              {sellersDetail.tenShop}
            </h2>
            <div className="flex flex-col sm:flex-wrap sm:flex-row justify-between items-start text-gray-600 gap-2">
              <p className="flex items-center w-full sm:w-auto text-sm sm:text-base">
                <MdStore className="text-blue-600 mr-1" />{" "}
                {sellersDetail.hoVaTen}
              </p>
              <p className="flex items-start w-full sm:w-auto text-sm sm:text-base">
                <HiOutlineLocationMarker
                  className="text-blue-600 mr-1"
                  style={{ flexShrink: 0 }}
                />
                <span className="overflow-auto max-w-full break-words">
                  {sellersDetail.toanBoDiaChi}
                </span>
              </p>

              <p className="flex items-center w-full sm:w-auto text-sm sm:text-base">
                <HiOutlineMail className="text-blue-600 mr-1" />{" "}
                {sellersDetail.email}
              </p>
              <p className="flex items-center w-full sm:w-auto text-sm sm:text-base">
                <AiOutlinePhone className="text-blue-600 mr-1" />{" "}
                {sellersDetail.soDienThoai}
              </p>
            </div>
          </div>

          {/* Hóa đơn  */}
          <div className="col-span-12 md:col-span-9">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-4 lg:space-y-0">
              <h3 className="text-2xl font-medium text-blue-700 text-center lg:text-left">
                Đơn hàng của cửa hàng
              </h3>

              {/* Thanh tìm kiếm */}
              <div className="flex w-full lg:w-auto">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  className="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:ring-blue-200"
                />
                <button className="p-2.5 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-200 ease-in-out">
                  <FaSearch className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2   md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              {orders.map((dh) => (
                <div
                  key={dh.id}
                  className=" bg-white border-dashed border-1 border-gray-300 rounded-lg shadow-sm hover:shadow-md p-6"
                >
                  {/* Tiêu đề Hóa đơn */}
                  <div className="text-center mb-2">
                    <p className="text-sm text-gray-500">
                      Mã hóa đơn: #{dh.id}
                    </p>
                  </div>

                  {/* Thông tin khách hàng và hóa đơn */}
                  <div className="border-t border-dashed border-gray-300 py-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <FaShoppingCart className="w-5 h-5 mr-1" />
                      <span className="text-gray-700">Khách hàng:</span>
                      <span className="ml-auto font-semibold text-gray-900">
                        {dh.taiKhoanId}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <FaBoxOpen className="w-5 h-5 mr-1" />
                      <span className="text-gray-700">Sản phẩm:</span>
                      <span
                        className="ml-auto font-semibold text-gray-900 truncate"
                        style={{
                          display: "inline-block",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                        }}
                        title={dh.tenSanPham}
                      >
                        {dh.tenSanPham}
                      </span>
                    </div>

                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <HiOutlineLocationMarker className="w-5 h-5 mr-1" />
                        <span className="text-gray-700 whitespace-nowrap">
                          Địa chỉ
                        </span>
                      </div>
                      <span
                        className="font-semibold text-gray-900 text-right"
                        style={{
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                          maxWidth: "70%", // Giới hạn chiều rộng để không chiếm quá nhiều diện tích
                        }}
                      >
                        {dh.diaChi}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <FaCalendarAlt className="w-5 h-5 mr-1" />
                      <span className="text-gray-700">Ngày đặt:</span>
                      <span className="ml-auto font-semibold text-gray-900">
                        {format(new Date(dh.ngayTaoDon), "HH:mm dd/MM/yyyy")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <FaCreditCard className="w-5 h-5 mr-1" />
                      <span className="text-gray-700">
                        Phương thức thanh toán:
                      </span>
                      <span className="ml-auto font-semibold text-gray-900">
                        {dh.hinhThuc}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <FaMoneyBillWave className="w-5 h-5 mr-1" />
                      <span className="text-gray-700">Tổng tiền:</span>
                      <span className="ml-auto text-xl font-bold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(dh.tongTien)}
                      </span>
                    </div>
                  </div>

                  {/* Trạng thái */}
                  <div className="mt-6 text-center">
                    <p
                      className={`inline-block font-semibold px-4 py-1 rounded-full text-sm ${
                        dh.trangThai === "Giao hàng thành công"
                          ? "bg-green-200 text-green-800"
                          : dh.trangThai === "Đã hủy" ||
                            dh.trangThai === "Giao thất bại"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {dh.trangThai}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
        </div>
        <hr />

        <div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-8 bg-white rounded-lg shadow-lg">
          {/* Doanh thu */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 shadow-inner">
                <FaMoneyBillWave className="text-blue-600 w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold text-blue-700">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(statistics.tongDoanhThu)}
              </h2>

              <p className="text-gray-600 text-sm font-medium">Doanh thu</p>
            </div>
          </div>

          {/* Đơn hàng */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 shadow-inner">
                <FaShoppingCart className="text-blue-600 w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold text-blue-700">
                {new Intl.NumberFormat("vi-VN").format(
                  statistics.tongSoDonHang
                )}
              </h2>
              <p className="text-gray-600 text-sm font-medium">Đơn hàng</p>
            </div>
          </div>

          {/* Sản phẩm */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 shadow-inner">
                <FaBox className="text-blue-600 w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold text-blue-700">
                {new Intl.NumberFormat("vi-VN").format(
                  statistics.tongSoSanPham
                )}
              </h2>
              <p className="text-gray-600 text-sm font-medium">Sản phẩm</p>
            </div>
          </div>

          {/* Thứ hạng */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 shadow-inner">
                <FaStar className="text-blue-600 w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold text-blue-700">27</h2>
              <p className="text-gray-600 text-sm font-medium">Thứ hạng</p>
            </div>
          </div>
        </div>

        <form className="bg-white mt-4 p-8 rounded-2xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-blue-700 mb-6">
            Thông tin chi tiết
          </h3>

          {/* Nội dung text: 2 dòng, 2 cột */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dòng 1: Ngày đăng ký và Tên công ty */}
            <div className="space-y-6">
              <p className="flex items-center text-gray-800">
                <FaCalendarAlt className="text-blue-600 mr-3 w-6 h-6" />
                <span className="font-semibold">Ngày đăng ký:</span>
                <span className="ml-2">
                  {new Date(sellersDetail.ngayDangKy).toLocaleDateString(
                    "vi-VN",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
                </span>
              </p>

              <p className="flex items-center text-gray-800">
                <FaBuilding className="text-blue-600 mr-3 w-6 h-6" />
                <span className="font-semibold">Tên công ty:</span>
                <span className="ml-2">
                  {sellersDetail.tenCongTy || "Chưa đăng ký"}
                </span>
              </p>
            </div>

            {/* Dòng 2: Loại hình và Mã số thuế */}
            <div className="space-y-6">
              <p className="flex items-center text-gray-800">
                <FaIndustry className="text-blue-600 mr-3 w-6 h-6" />
                <span className="font-semibold">Loại hình:</span>
                <span className="ml-2">
                  {sellersDetail.loaiHinhKinhDoanh || "Không có thông tin"}
                </span>
              </p>

              <p className="flex items-center text-gray-800">
                <FaPassport className="text-blue-600 mr-3 w-6 h-6" />
                <span className="font-semibold">Mã số thuế:</span>
                <span className="ml-2">
                  {sellersDetail.maSoThue || "Chưa đăng ký"}
                </span>
              </p>
            </div>
          </div>

          {/* Nội dung hình ảnh: 1 dòng, 2 cột */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Giấy phép kinh doanh */}
            <div className="text-gray-800">
              <div className="flex items-center mb-4">
                <FaFileContract className="text-blue-600 mr-3 w-6 h-6" />
                <span className="font-semibold">Giấy phép kinh doanh:</span>
              </div>
              {sellersDetail.giayPhepKinhDoanh ? (
                <img
                  src={sellersDetail.giayPhepKinhDoanh}
                  alt="Giấy phép kinh doanh"
                  className="w-full h-80 object-cover rounded-lg border"
                  onClick={() =>
                    handleImageClick(sellersDetail.giayPhepKinhDoanh)
                  }
                />
              ) : (
                <span>Không có hình ảnh</span>
              )}
            </div>

            {/* Hình chụp thẻ */}
            <div className="text-gray-800">
              <div className="flex items-center mb-4">
                <FaIdBadge className="text-blue-600 mr-3 w-6 h-6" />
                <span className="font-semibold">Hình chụp thẻ:</span>
              </div>
              {sellersDetail.hinhChupThe ? (
                <img
                  src={sellersDetail.hinhChupThe}
                  alt="Hình chụp thẻ"
                  className="w-full h-80 object-cover rounded-lg border"
                  onClick={() => handleImageClick(sellersDetail.hinhChupThe)}
                />
              ) : (
                <span>Không có hình ảnh</span>
              )}
            </div>

            {/* Ảnh đang cầm */}
            <div className="text-gray-800 mt-4">
              <div className="flex items-center mb-4">
                <FaCamera className="text-blue-600 mr-3 w-6 h-6" />
                <span className="font-semibold">Ảnh cầm thẻ:</span>
              </div>
              {sellersDetail.anhCamThe ? (
                <img
                  src={sellersDetail.anhCamThe}
                  alt="Ảnh đang cầm"
                  className="w-full h-80 object-cover rounded-lg border"
                  onClick={() => handleImageClick(sellersDetail.anhCamThe)}
                />
              ) : (
                <span>Không có hình ảnh</span>
              )}
            </div>
          </div>
        </form>

        <hr />
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-center mb-6 text-blue-700">
            Sản phẩm của cửa hàng
          </h3>
          <ul className=" grid items-center  grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {product.map((sp) => (
              <li
                key={sp.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-200"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={sp.hinhAnh}
                    alt={sp.tenSanPham}
                    className="w-full h-60 object-cover rounded-md transition transform hover:scale-105"
                  />
                </div>
                <h4
                  className="mt-2 font-bold text-gray-800 text-lg"
                  style={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    whiteSpace: "normal",
                    textOverflow: "ellipsis",
                    maxWidth: "300px", // Chiều rộng tối đa
                    maxHeight: "3em", // Giới hạn chiều cao cho hai hàng
                    lineHeight: "1.5em", // Khoảng cách giữa các dòng
                    WebkitLineClamp: 2, // Giới hạn 2 dòng
                    WebkitBoxOrient: "vertical",
                  }}
                  title={sp.tenSanPham}
                >
                  {sp.tenSanPham}
                </h4>
                <p className="font-semibold text-blue-700 text-lg mt-2">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(sp.giaBan)}
                </p>
                <p className="text-gray-600 mt-1 text-end">
                  Lượt bán:{" "}
                  <span className="font-semibold">
                    {new Intl.NumberFormat("vi-VN").format(sp.soLuongDaBan)}
                  </span>
                </p>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
            <button
              onClick={handlePreviousPageProduct}
              disabled={currentPageProduct === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Trang trước
            </button>
            <div className="flex items-center gap-1 my-2 sm:my-0">
              <button
                onClick={() => setCurrentPageProduct(1)}
                className={`px-3 py-1 rounded-full ${
                  currentPageProduct === 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                1
              </button>
              {currentPageProduct > 3 && <span className="px-2">...</span>}
              {Array.from({ length: 3 }, (_, index) => {
                const page = currentPageProduct - 1 + index;
                if (page > 1 && page < totalPagesProduct) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPageProduct(page)}
                      className={`px-3 py-1 rounded-full ${
                        currentPageProduct === page
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
              {currentPageProduct < totalPagesProduct - 2 && (
                <span className="px-2">...</span>
              )}
              {totalPagesProduct > 1 && (
                <button
                  onClick={() => setCurrentPageProduct(totalPagesProduct)}
                  className={`px-3 py-1 rounded-full ${
                    currentPageProduct === totalPagesProduct
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {totalPagesProduct}
                </button>
              )}
            </div>
            <button
              onClick={handleNextPageProduct}
              disabled={currentPageProduct === totalPagesProduct}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 mt-8 flex justify-center items-center z-50"
          onClick={closeModal} // Đóng modal khi click ngoài ảnh
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={fullImage}
              alt="Full Size"
              className="w-auto h-auto max-h-[75vh] max-w-[75vw] min-h-[25vh] min-w-[25vw] object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white bg-blue-600 p-2 rounded-full"
              onClick={closeModal}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyChiTietNguoiBan;
