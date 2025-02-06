import React, { useState, useEffect } from "react";
import {
  FaPhoneAlt,
  FaClock,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { AiOutlineFieldNumber } from "react-icons/ai";
import {
  FiTag,
  FiInfo,
  FiBox,
  FiDollarSign,
  FiHash,
  FiShoppingCart,
  FiBookmark,
} from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdFormatColorFill } from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { useParams } from "react-router-dom";
import api from "../../config/AdminAPI";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
const ChiTietSanPham = () => {
  const [productStatus, setProductStatus] = useState("Đang bán");
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [variantProducts, setVariantProducts] = useState([]);
  const [minPrice, setMinPrice] = useState([]);
  const [maxPrice, setMaxPrice] = useState([]);
  const [pageSize, setPageSize] = useState(3); // Số đơn hàng mỗi trang
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [colorAndSize, setColorAndSize] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [productReport, setProductReport] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [pagination, setPagination] = useState({
  //   currentPage: 0,
  //   totalPages: 0,
  //   totalElements: 0,
  //   pageSize: 5,
  // });

  const handleUpdateTrangThai = async (id, currentTrangThai) => {
    const newTrangThai = currentTrangThai == 1 ? 0 : 1;
    try {
      await api.put(`${id}/updateStatusProduct`, null, {
        params: { trangThai: newTrangThai },
      });
      // fetchProducts(productId);
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
      shopId: productId,
      reportId: selectedReport,
      reportedBy: 22,
      status: 1,
      content: "Admin xử lí vi phạm",
      image: "", // Nếu không có ảnh
    };
    try {
      const response = await api.post(
        "createReportProduct",
        reportData, // Dữ liệu JSON
        { headers: { "Content-Type": "application/json" } }
      );
      toggleModal();
      if (response.data > 0) {
        handleUpdateTrangThai(productId, products.trangThaiSanPham);
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
            Xác nhận thay đổi trạng thái {products.tenSanPham}
          </h1>
          <p className="font-sans mb-4">
            Chuyển trạng thái từ{" "}
            <strong className="font-semibold text-blue-600">
              {products.trangThaiSanPham == 1 ? "Hoạt động" : "Ngừng hoạt động"}
            </strong>{" "}
            sang{" "}
            <strong className="font-semibold text-blue-600">
              {products.trangThaiSanPham == 1 ? "Ngưng hoạt động" : "Hoạt động"}
            </strong>
          </p>

          <div>
            <button
              onClick={() => {
                onClose();
                if (products.trangThaiSanPham === 1) {
                  if (fetchProductReport()) {
                    setIsReportOpen(true);
                  }
                } else {
                  handleUpdateTrangThai(productId, products.trangThaiSanPham);
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

  const fetchProductReport = async () => {
    try {
      const response = await api.get(`productReport/3`);

      const data = response.data;

      setProductReport(data);
    } catch (error) {
      console.error("Error fetching shop report:", error);
    }
  };

  const fetchProductDetail = async (productId) => {
    try {
      const response = await api.get(`productDetail/${productId}`);

      const data = response.data; // Đây là dữ liệu trả về từ API
      const productData = {
        sanPhamId: data[0][0], // sp.id
        tenSanPham: data[0][1], // sp.tenSanPham
        soLuong: data[0][2], // sp.soLuong
        moTa: data[0][3], // sp.moTa
        hinhAnh: data[0][4], // sp.hinhAnh
        trangThaiSanPham: data[0][5], // sp.trangThai
        video: data[0][6], // sp.video
        soLuongDaBan: data[0][7], // sp.soLuongDaBan
        cuaHangId: data[0][8], // ch.id
        tenShop: data[0][9], // ch.tenShop
        trangThaiCuaHang: data[0][10], // ch.trangThai
        chuCuaHang: data[0][11], // ch.hoVaTen
        emailCuaHang: data[0][12], // ch.email
        hinhAnhCuaHang: data[0][13], // ch.hinhAnh
        ngayDangKyCuaHang: data[0][14], // ch.ngayDangKy
        xacMinh: data[0][15], // ch.xacMinh
        tenTheLoai: data[0][16], // tl.tenLoai
        tenThuongHieu: data[0][17], // th.tenThuongHieu
        diaChiCuaHang: data[0][18],
        dienThoaiCuaHang: data[0][19], // ch.dienThoai
      };
      setProducts(productData);
      if (productData.trangThaiSanPham == 1) {
        setIsChecked(true);
      }
      // console.log(productData);
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };

  const fetchProducts = async (productId, pageNumber, pageSize) => {
    try {
      // Gửi request với tham số phân trang
      const response = await api.get(`productDetails/${productId}`, {
        params: {
          page: pageNumber, // Trang hiện tại
          size: pageSize, // Số lượng bản ghi trên mỗi trang
        },
      });

      // Lấy dữ liệu từ response
      const data = response.data; // Dữ liệu trả về từ API (Spring Data Page)
      const products = data.content.map((item) => ({
        chiTietSanPhamId: item[0], // ctsp.id
        soLuong: item[1], // ctsp.soLuong
        giaBan: typeof item[2] === "number" && item[2] >= 0 ? item[2] : 0, // Validate giaBan
        hinhAnhBienThe: item[3], // ctsp.hinhAnhBienThe
        tenMauSac: item[4], // ms.tenMau
        tenKichThuoc: item[5], // kt.tenKichThuoc
      }));

      // Cập nhật state với dữ liệu sản phẩm và giá trị max, min
      setVariantProducts(products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchColorAndSize = async (productId) => {
    try {
      // Gửi request với tham số phân trang
      const response = await api.get(`colorAndSizeProduct/${productId}`, {});

      // Lấy dữ liệu từ response
      const data = response.data; // Dữ liệu trả về từ API (Spring Data Page)
      const colorAndSize = data
        .map((item) => ({
          chiTietSanPhamId: item[0], // ctsp.id
          tenMau: item[1], // ctsp.soLuong
          tenKichThuoc: item[2],
          giaBan: item[3],
          anhBienThe: item[4],
        }))
        .filter(
          (product) => product.giaBan !== null && product.giaBan !== undefined
        ); // Lọc những sản phẩm có giaBan hợp lệ

      // Tính toán giá trị max và min từ danh sách giá bán (giaBan)
      const maxPrice = Math.max(
        ...colorAndSize.map((product) => product.giaBan)
      );
      const minPrice = Math.min(
        ...colorAndSize.map((product) => product.giaBan)
      );

      // Cập nhật state với dữ liệu sản phẩm và giá trị max, min
      setColorAndSize(colorAndSize);
      setMaxPrice(maxPrice);
      setMinPrice(minPrice);
      console.log("đâylà giá min" + minPrice);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchProductsTotal = async (productId, pageNumber, pageSize) => {
    try {
      // Gửi request với tham số phân trang
      const response = await api.get(`productDetails/${productId}`, {
        params: {
          page: pageNumber, // Trang hiện tại
          size: pageSize, // Số lượng bản ghi trên mỗi trang
        },
      });

      // Lấy dữ liệu từ response
      const data = response.data; // Dữ liệu trả về từ API (Spring Data Page)
      const products = data.content
        .map((item) => ({
          chiTietSanPhamId: item[0], // ctsp.id
          soLuong: item[1], // ctsp.soLuong
          giaBan: typeof item[2] === "number" && item[2] >= 0 ? item[2] : 0, // Validate giaBan
          hinhAnhBienThe: item[3], // ctsp.hinhAnhBienThe
          tenMauSac: item[4], // ms.tenMau
          tenKichThuoc: item[5], // kt.tenKichThuoc
        }))
        .filter(
          (product) => product.giaBan !== null && product.giaBan !== undefined
        ); // Lọc những sản phẩm có giaBan hợp lệ

      // Tính toán giá trị max và min từ danh sách giá bán (giaBan)
      const maxPrice = Math.max(...products.map((product) => product.giaBan));
      const minPrice = Math.min(...products.map((product) => product.giaBan));

      // Cập nhật state với dữ liệu sản phẩm và giá trị max, min
      setVariantProducts(products);
      setMaxPrice(maxPrice);
      setMinPrice(minPrice);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchPromotions = async (productId) => {
    const response = await api.get(`sale/${productId}`);
    const data = response.data;

    if (Array.isArray(data)) {
      // Nếu data là một mảng (có khuyến mãi)
      setPromotions(data);
    } else if (data?.message) {
      // Nếu data trả về thông báo "Sản phẩm không có khuyến mãi"
      setPromotions(0);
    }
  };

  useEffect(() => {
    fetchProductDetail(productId);
    fetchColorAndSize(productId);
    fetchPromotions(productId);
  }, [productId]);

  useEffect(() => {
    fetchProducts(productId, currentPage, pageSize);
  }, [productId, currentPage, pageSize]);

  useEffect(() => {
    const sampleToyProduct = {
      TenSanPham: "Mô hình siêu xe Jeep Wrangler",
      MoTa: "Mô hình xe Jeep Wrangler Rubicon tỷ lệ 1:14, chất liệu kim loại cao cấp, chi tiết sắc nét.",
      HinhAnh:
        "https://bizweb.dktcdn.net/100/040/530/files/mo-hinh-xe-jeep-wrangler-rubicon-o-to-dia-hinh-dieu-khien-tu-xa-ty-le-1-14-rastar-8-copy.jpg?v=1617366928864",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      //LuotBan: sum( ProductDetails.Categories.LuotBan),
      ThuongHieu: { TenThuongHieu: "ToysPro" },

      Categories: [
        {
          id: 1,
          TenLoai: "Mô hình xe hơi",
          Parent_id: null,
          TrangThai: "Active",
        },
        {
          id: 2,
          TenLoai: "Mô hình xe mô tô",
          Parent_id: null,
          TrangThai: "Active",
        },
      ],

      Shop: {
        tenShop: "Toyland Store",
        moTa: "Chuyên cung cấp mô hình và đồ chơi chất lượng.",
        DiaChiShop: "456 Phố Đồ Chơi, Thành phố Mẫu",
        SoDienThoai: "0987654321",
      },
      ProductDetails: [
        {
          id: 1,
          product_id: 1,
          category_id: 1,
          MauSac: { id: 1, TenMauSac: "Đen" },
          KichThuoc: { id: 1, TenKichThuoc: "XL" },
          SoLuong: 50,
          GiaBan: 350000,
          HinhAnhBienThe:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4KmY3Gnab6VuApV7pc19OMmTUuGmnbW19w&s",
          LuotBan: 120,
        },
        {
          id: 2,
          product_id: 1,
          category_id: 1,
          MauSac: { id: 1, TenMauSac: "Đen" },
          KichThuoc: { id: 2, TenKichThuoc: "L" },
          SoLuong: 30,
          GiaBan: 380000,
          HinhAnhBienThe:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4KmY3Gnab6VuApV7pc19OMmTUuGmnbW19w&s",
          LuotBan: 80,
        },
        {
          id: 3,
          product_id: 1,
          category_id: 2,
          MauSac: { id: 2, TenMauSac: "Trắng" },
          KichThuoc: { id: 1, TenKichThuoc: "M" },
          SoLuong: 40,
          GiaBan: 370000,
          HinhAnhBienThe:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4KmY3Gnab6VuApV7pc19OMmTUuGmnbW19w&s",
          LuotBan: 60,
        },
        {
          id: 4,
          product_id: 1,
          category_id: 2,
          MauSac: { id: 2, TenMauSac: "Trắng" },
          KichThuoc: { id: 2, TenKichThuoc: "S" },
          SoLuong: 25,
          GiaBan: 390000,
          HinhAnhBienThe:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4KmY3Gnab6VuApV7pc19OMmTUuGmnbW19w&s",
          LuotBan: 70,
        },
        {
          id: 5,
          product_id: 1,
          category_id: 1,
          MauSac: { id: 3, TenMauSac: "Xanh lá" },
          KichThuoc: { id: 1, TenKichThuoc: "M" },
          SoLuong: 60,
          GiaBan: 420000,
          HinhAnhBienThe:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4KmY3Gnab6VuApV7pc19OMmTUuGmnbW19w&s",
          LuotBan: 95,
        },
        {
          id: 6,
          product_id: 1,
          category_id: 2,
          MauSac: { id: 4, TenMauSac: "Xanh dương" },
          KichThuoc: { id: 1, TenKichThuoc: "L" },
          SoLuong: 30,
          GiaBan: 450000,
          HinhAnhBienThe:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4KmY3Gnab6VuApV7pc19OMmTUuGmnbW19w&s",
          LuotBan: 65,
        },
        {
          id: 7,
          product_id: 1,
          category_id: 1,
          MauSac: { id: 5, TenMauSac: "Vàng" },
          KichThuoc: { id: 2, TenKichThuoc: "S" },
          SoLuong: 25,
          GiaBan: 430000,
          HinhAnhBienThe:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4KmY3Gnab6VuApV7pc19OMmTUuGmnbW19w&s",
          LuotBan: 70,
        },
        {
          id: 8,
          product_id: 1,
          category_id: 2,
          MauSac: { id: 6, TenMauSac: "Đỏ" },
          KichThuoc: { id: 2, TenKichThuoc: "XL" },
          SoLuong: 20,
          GiaBan: 460000,
          HinhAnhBienThe:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4KmY3Gnab6VuApV7pc19OMmTUuGmnbW19w&s",
          LuotBan: 110,
        },
        {
          id: 9,
          product_id: 1,
          category_id: 1,
          MauSac: { id: 7, TenMauSac: "Hồng" },
          KichThuoc: { id: 1, TenKichThuoc: "M" },
          SoLuong: 15,
          GiaBan: 400000,
          HinhAnhBienThe:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4KmY3Gnab6VuApV7pc19OMmTUuGmnbW19w&s",
          LuotBan: 45,
        },
        {
          id: 10,
          product_id: 1,
          category_id: 2,
          MauSac: { id: 8, TenMauSac: "Tím" },
          KichThuoc: { id: 2, TenKichThuoc: "S" },
          SoLuong: 18,
          GiaBan: 410000,
          HinhAnhBienThe:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4KmY3Gnab6VuApV7pc19OMmTUuGmnbW19w&s",
          LuotBan: 32,
        },
      ],

      PhotoProducts: [
        {
          id: 1,
          HinhAnh:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwv3fAjUSclQL5FewQxyvzshKvqEfHjIQr-Q&s",
        },
        {
          id: 2,
          HinhAnh:
            "https://bizweb.dktcdn.net/100/040/530/files/mo-hinh-xe-jeep-wrangler-rubicon-o-to-dia-hinh-dieu-khien-tu-xa-ty-le-1-14-rastar-8-copy.jpg?v=1617366928864",
        },
        {
          id: 3,
          HinhAnh:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwv3fAjUSclQL5FewQxyvzshKvqEfHjIQr-Q&s",
        },
        {
          id: 4,
          HinhAnh:
            "https://bizweb.dktcdn.net/100/040/530/files/mo-hinh-xe-jeep-wrangler-rubicon-o-to-dia-hinh-dieu-khien-tu-xa-ty-le-1-14-rastar-8-copy.jpg?v=1617366928864",
        },
      ],
      KhuyenMai: {
        id: 1,
        giaTri: 10,
      },
    };

    // Tính LuotBan dựa vào loại
    sampleToyProduct.LuotBan = sampleToyProduct.ProductDetails.reduce(
      (total, detail) => total + detail.LuotBan,
      0
    );

    // Tính khoảng giá nhỏ nhất - lớn nhat
    sampleToyProduct.LuotBan = sampleToyProduct.ProductDetails.reduce(
      (total, detail) => total + detail.LuotBan,
      0
    );
    const prices = sampleToyProduct.ProductDetails.map(
      (detail) => detail.GiaBan
    );
    sampleToyProduct.PriceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };

    setTimeout(() => {
      setProduct(sampleToyProduct);
    }, 1000);
  }, []);

  if (!product) {
    return (
      <div className="flex justify-center">
        <img
          src="https://i.gifer.com/origin/ec/ecf46fc2a40f43ad0ef438b04b0d2e8e_w200.gif"
          alt="Loading..."
        />
      </div>
    );
  }

  const toggleStatus = () => {
    setProductStatus((prevStatus) =>
      prevStatus === "Đang bán" ? "Ngừng bán" : "Đang bán"
    );
    alert(`Đã cập nhật trạng thái sản phẩm`);
  };

  const itemsPerPage = 3; // Số lượng item mỗi trang
  // const totalPages = Math.ceil(product.ProductDetails.length / itemsPerPage); // Tổng số trang

  // Xác định dữ liệu trên trang hiện tại
  const currentItems = product.ProductDetails.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  // Chuyển sang trang tiếp theo
  const nextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages - 1 ? prevPage + 1 : prevPage
    );
  };

  // Chuyển về trang trước
  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
  };

  return (
    <div className="w-screen lg:w-full mx-auto p-4 lg:p-8 bg-white rounded-lg shadow-lg">
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full">
          <div className="relative p-6 w-full max-w-3xl bg-white rounded-lg shadow-lg dark:bg-gray-700">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                Lý do khóa {products.tenSanPham}
              </h2>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-72">
              <div className="space-y-2">
                {Array.isArray(productReport) && productReport.length > 0 ? (
                  productReport.map((item) => (
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
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 flex flex-col items-center shadow-md">
          <img
            src={products.hinhAnh}
            alt={products.tenSanPham}
            className="w-full h-auto rounded-lg mb-4"
          />
          <div className="grid grid-cols-4 gap-2 overflow-x-auto ms-3">
            <div className="flex space-x-2">
              {colorAndSize.map((item) => (
                <img
                  key={item.chiTietSanPhamId}
                  src={item.anhBienThe}
                  alt="Hình ảnh phụ"
                  className="w-20 h-20 object-cover rounded shadow-md transition-transform"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 px-4 py-2 rounded-lg shadow-lg">
          <div className="relative flex flex-wrap md:flex-nowrap justify-between items-start mb-1">
            {/* Tiêu đề sản phẩm */}
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex-1 break-words">
              {products.tenSanPham}
            </h1>

            {/* Nút trạng thái cố định */}
            <div className="cursor-pointer">
              {/* Nút trạng thái */}
              <label className="flex items-center space-x-2 sm:space-x-4">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleOpenConfirm}
                  className="sr-only peer"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors duration-500 ease-in-out flex-shrink-0 ${
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
                  className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${
                    isChecked ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isChecked ? "Đang hoạt động" : "Ngưng hoạt động"}
                </span>
              </label>
            </div>
          </div>

          <div className="">
            <div className="grid grid-cols-1 gap-y-4 text-gray-800 text-sm mb-2">
              <div className="flex items-center">
                <div className="flex items-center mt-1">
                  <FiHash className="mr-2 text-green-500 text-lg" />
                  <span className="font-semibold">Mã sản phẩm: </span>
                  <span className="text-gray-700 font-semibold ml-2">
                    {products.sanPhamId}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {/* Hàng 1 */}
                <div className="flex items-center mb-2">
                  <FiBox className="mr-2 text-yellow-500 text-lg" />
                  <span className="font-semibold mr-2">Số lượng:</span>
                  <span className="text-gray-700 font-medium">
                    {products.soLuong || 0}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <FiTag className="mr-2 text-red-500 text-lg" />
                  <span className="font-semibold mr-2">Loại sản phẩm:</span>
                  <span className="text-gray-700">{products.tenTheLoai}</span>
                </div>

                {/* Hàng 2 */}
                <div className="flex items-center mb-2">
                  <FiShoppingCart className="mr-2 text-yellow-500 text-lg" />
                  <span className="font-semibold mr-2">Lượt bán:</span>
                  <span className="text-gray-700">
                    {products.soLuongDaBan || 0}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <FiBookmark className="mr-2 text-red-500 text-lg" />
                  <span className="font-semibold mr-2">Thương hiệu:</span>
                  <span className="text-gray-700">
                    {products.tenThuongHieu
                      ? products.tenThuongHieu
                      : "Không có"}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex items-center">
                  <MdFormatColorFill className="mr-2 text-purple-500 text-lg" />
                  <span className="font-semibold">Màu sắc:</span>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Set(colorAndSize.map((detail) => detail.tenMau))
                    ).map((color, index) => (
                      <span
                        key={index}
                        className="text-gray-700 bg-gray-200 px-2 py-1 rounded-full text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <AiOutlineFieldNumber className="mr-2 text-green-500 text-lg" />
                <span className="font-semibold mr-2">Kích thước:</span>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(colorAndSize.map((detail) => detail.tenKichThuoc))
                  ).map((size, index) => (
                    <span
                      key={index}
                      className="text-gray-700 bg-gray-200 px-2 py-1 rounded-full text-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg py-2 flex justify-center">
                <div className="flex items-center gap-4">
                  {/* Hiển thị giá bán */}
                  <span className="text-green-600 font-medium text-xl md:text-2xl">
                    {minPrice === maxPrice
                      ? new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          promotions?.[0]?.giaTriKhuyenMai > 0
                            ? minPrice *
                                (1 - promotions[0].giaTriKhuyenMai / 100)
                            : minPrice
                        )
                      : `${new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          promotions?.[0]?.giaTriKhuyenMai > 0
                            ? minPrice *
                                (1 - promotions[0].giaTriKhuyenMai / 100)
                            : minPrice
                        )} ~ ${new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          promotions?.[0]?.giaTriKhuyenMai > 0
                            ? maxPrice *
                                (1 - promotions[0].giaTriKhuyenMai / 100)
                            : maxPrice
                        )}`}
                  </span>

                  {/* Hiển thị giá gốc và phần trăm giảm giá nếu có khuyến mãi */}
                  {promotions?.[0]?.giaTriKhuyenMai > 0 && (
                    <div className="text-sm text-gray-500 flex items-center">
                      <span className="line-through italic">
                        {minPrice === maxPrice
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(minPrice)
                          : `${new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(minPrice)} ~ ${new Intl.NumberFormat(
                              "vi-VN",
                              {
                                style: "currency",
                                currency: "VND",
                              }
                            ).format(maxPrice)}`}
                      </span>
                      <span className="text-red-500 font-medium ml-2">
                        -{promotions[0].giaTriKhuyenMai}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div>
            <table className="min-w-full min-h-44 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-2 sm:px-4 font-semibold text-gray-600 border-b text-center">
                    Hình ảnh biến thể
                  </th>
                  <th className="py-2 px-2 sm:px-4 font-semibold text-gray-600 border-b text-center">
                    Màu sắc
                  </th>
                  <th className="py-2 px-2 sm:px-4 font-semibold text-gray-600 border-b text-center">
                    Kích thước
                  </th>
                  <th className="py-2 px-2 sm:px-4 font-semibold text-gray-600 border-b text-center">
                    Số lượng
                  </th>
                  <th className="py-2 px-2 sm:px-4 font-semibold text-gray-600 border-b text-center">
                    Giá bán
                  </th>
                </tr>
              </thead>
              <tbody>
                {variantProducts.map((detail) => {
                  return (
                    <tr key={detail.id} className="hover:bg-gray-50 transition">
                      <td className="border-b flex justify-center">
                        <img
                          src={detail.hinhAnhBienThe}
                          alt={detail.hinhAnhBienThe}
                          className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-lg"
                        />
                      </td>
                      <td className="border-b text-center">
                        {detail.tenMauSac}
                      </td>
                      <td className="px-2 sm:px-4 border-b text-center">
                        {detail.tenKichThuoc}
                      </td>
                      <td className="px-2 sm:px-4 border-b text-center">
                        {/* Format số lượng */}
                        {new Intl.NumberFormat("vi-VN").format(detail.soLuong)}
                      </td>
                      <td className="px-2 sm:px-4 border-b text-center">
                        {/* Format giá và thêm "đ" */}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          promotions && promotions[0].giaTriKhuyenMai
                            ? detail.giaBan *
                                (1 - promotions[0].giaTriKhuyenMai / 100)
                            : detail.giaBan
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center items-center mt-3 space-x-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 text-white ${
                  currentPage === 0 && "opacity-50 cursor-not-allowed"
                }`}
              >
                <FiChevronLeft size={16} smSize={20} />
              </button>
              <div className="flex space-x-1 sm:space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <span
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-6 h-1 sm:w-10 sm:h-1 rounded-full cursor-pointer transition-transform duration-300 ${
                      currentPage === index
                        ? "bg-blue-500 scale-125"
                        : "bg-gray-400"
                    }`}
                  ></span>
                ))}
              </div>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 text-white ${
                  currentPage === totalPages - 1 &&
                  "opacity-50 cursor-not-allowed"
                }`}
              >
                <FiChevronRight size={16} smSize={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <section className="mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Mô tả sản phẩm
        </h2>
        <div className="grid grid-cols-1 gap-8">
          <div className="text-gray-700 text-sm space-y-6 overflow-y-auto max-h-50 p-2 rounded-md">
            <div className="flex items-start gap-2">
              <div>
                <span
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: products.moTa }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mô tả cửa hàng */}
      <section className="mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Thông tin cửa hàng
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Cột bên trái: Hình ảnh và trạng thái */}
          <div className="flex flex-col items-center text-center space-y-4">
            <img
              src={products.hinhAnh}
              alt={products.hinhAnh}
              className="w-32 h-32 rounded-full shadow-md"
            />
            <div>
              <span
                className={`inline-block px-3 py-2 rounded-full font-semibold text-sm ${
                  products.trangThai === "HoatDong"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {products.trangThai === "HoatDong"
                  ? "Đang hoạt động"
                  : "Ngưng hoạt động"}
              </span>
            </div>
          </div>

          {/* Cột giữa: Thông tin cửa hàng và địa chỉ */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Thông tin cửa hàng */}
            <div className="flex items-start gap-2">
              <AiOutlineInfoCircle className="text-green-500 mt-1" size={20} />
              <div>
                <strong className="block text-gray-800">Cửa hàng:</strong>
                <span className="text-gray-600 font-medium">
                  Mã: {products.cuaHangId}
                </span>
                <br />
                <span className="text-gray-600 font-medium">
                  Tên cửa hàng: {products.tenShop}
                </span>
                <br />
                <span className="text-gray-600 font-medium">
                  Đại diện: {products.chuCuaHang}
                </span>
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="flex items-start gap-2">
              <MdLocationOn className="text-red-500 mt-1" size={20} />
              <div>
                <strong className="block text-gray-800">Địa chỉ:</strong>
                <span className="text-gray-600">{products.diaChiCuaHang}</span>
              </div>
            </div>
          </div>

          {/* Cột bên phải: Liên hệ và email */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Liên hệ */}
            <div className="flex items-start gap-2">
              <FaPhoneAlt className="text-yellow-500 mt-1" size={20} />
              <div>
                <strong className="block text-gray-800">Liên hệ:</strong>
                <span className="text-gray-600">
                  {products.dienThoaiCuaHang}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-2">
              <HiOutlineMail className="text-blue-500 mt-1" size={20} />
              <div>
                <strong className="block text-gray-800">Email:</strong>
                <span className="text-gray-600 font-medium">
                  {products.emailCuaHang}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChiTietSanPham;
