import React, { useState, useEffect, useRef } from "react";
import categoriesData from "../../data/json/category.json"; // Import file JSON
import api from "../../config/AdminAPI";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const Categories = () => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newCategoryImageUpdate, setNewCategoryImageUpdate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categories2, setCategories2] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [idCategory, setIdCategory] = useState(0);
  const [editCategory, setEditCategory] = useState({
    id: null,
    name: "",
    image: "",
    Status: "false",
    isUpdate: "false",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // state for modal
  const [selectedCategories, setSelectedCategories] = useState([]); // Lưu các doanh mục người dùng đã chọn
  const [currentLevelCategories, setCurrentLevelCategories] = useState([]); // Các doanh mục ở cấp hiện tại
  const [previousCategories, setPreviousCategories] = useState([]);
  const fileInputRef = useRef(null);

  const fetchCategorys = async (page, size) => {
    try {
      const response = await api.get("getAllCategories", {
        params: { page, size },
      });

      const data = response.data;
      const categories = data.content.map((item) => ({
        idDanhMuc: item[0],
        tenDanhMuc: item[1],
        anhDanhMuc: item[2],
        trangThaiDanhMuc: item[3],
        idDanhMucCha: item[4],
        capDo: item[5],
      }));
      setCategories2(categories);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async (parentId) => {
    try {
      const response = await api.post(`subcategories?parentId=${parentId}`);
      const subCategories = response.data;
      setCurrentLevelCategories(subCategories);
      setPreviousCategories([...previousCategories, selectedCategories]);
      console.log("có gọi hàm");
      console.log(parentId);
      console.log(subCategories);
    } catch (error) {
      console.error("Lỗi khi lấy doanh mục con:", error);
    }
  };

  const fetchRootCategories = async () => {
    try {
      const response = await api.get("roots"); // Thay thế bằng endpoint API thực tế
      const rootCategories = response.data;

      // Tạo doanh mục gốc (doanh mục đầu tiên)
      const rootCategory = {
        id: -1, // ID của doanh mục gốc, có thể là một giá trị đặc biệt
        tenLoai: "Tạo doanh mục gốc", // Tên của doanh mục gốc
        trangThai: 1,
        parentId: null, // Trạng thái doanh mục gốc, có thể tùy chỉnh
      };

      // Thêm doanh mục gốc vào đầu danh sách rootCategories
      const updatedRootCategories = [rootCategory, ...rootCategories];

      // Cập nhật danh sách doanh mục gốc
      setCurrentLevelCategories(updatedRootCategories);
      setPreviousCategories([]); // Reset lịch sử các cấp doanh mục

      console.log(response);
      console.log(updatedRootCategories); // In ra danh sách doanh mục gốc đã được cập nhật
    } catch (error) {
      console.error("Lỗi khi lấy doanh mục gốc:", error);
    }
  };

  const handleCategoryClick = (category) => {
    // Lưu danh mục con đã chọn vào previousCategories
    if (previousCategories.length === 0) {
      setPreviousCategories([currentLevelCategories]); // Lưu danh mục gốc
    }

    // Cập nhật danh mục đã chọn
    setSelectedCategories([...selectedCategories, category]);

    // Kiểm tra nếu có danh mục con để hiển thị
    if (category) {
      // Tiến hành gọi API hoặc xử lý tiếp theo để lấy danh mục con
      fetchSubCategories(category.id);
    }
  };

  const handleGoBack = () => {
    // Kiểm tra nếu không có danh mục con trước đó
    if (selectedCategories.length <= 0) {
      fetchRootCategories();
      return; // Không làm gì nếu không có danh mục đã chọn
    }

    // Lấy danh mục con của doanh mục đã chọn trước đó
    const lastSelectedCategory =
      selectedCategories[selectedCategories.length - 2];

    // Lấy danh mục con của doanh mục đã chọn trước đó từ API hoặc danh sách đã lưu
    try {
      fetchSubCategories(lastSelectedCategory.id);
    } catch (error) {
      fetchRootCategories();
    }

    // Cập nhật lại danh sách đã chọn (giảm số lượng đã chọn đi 1)
    setSelectedCategories(selectedCategories.slice(0, -1));
  };

  // Xử lý khi đóng modal (reset state)
  const handleCloseModal = () => {
    setSelectedCategories([]);
    setCurrentLevelCategories([]);
    setPreviousCategories([]);
    closeModal(); // Đóng modal
  };

  useEffect(() => {
    setCategories(categoriesData);
  }, []);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleNewCategoryChange = (e) => setNewCategory(e.target.value);

  const handleAddCategory = () => {
    // Kiểm tra xem có danh mục đã chọn hay không
    if (selectedCategories.length <= 0) {
      console.error("Chưa chọn danh mục để thêm danh mục con!");
      toast.error("Chưa chọn danh mục để thêm danh mục con!");
      return;
    }

    // Lấy id của danh mục đã chọn làm parent_Id
    const parentCategory = selectedCategories[selectedCategories.length - 1]; // Lấy danh mục cuối cùng được chọn
    const parent_Id = parentCategory.id;

    if (parent_Id === idCategory) {
      toast.error("Không thể chọn bản thân làm nơi lưu");
      return;
    }

    // Tạo FormData để gửi dữ liệu và file ảnh
    const formData = new FormData();
    formData.append("categoryName", newCategory); // Thêm tên danh mục vào formData
    formData.append("parent_Id", parent_Id); // Thêm parent_Id vào formData

    // Nếu có ảnh, thêm ảnh vào formData
    if (newCategoryImage) {
      formData.append("files", newCategoryImage); // Thêm file ảnh vào formData
    }
    formData.append("id", idCategory);
    formData.append("isUpdate", isUpdate);
    formData.append("filesUpdate", newCategoryImageUpdate);
    // Hiển thị thông báo đang chờ xử lý

    let message = "Đang cập nhật danh mục...";

    const loadingToast = toast.loading(message);

    // Gửi yêu cầu POST với formData
    api
      .post("createCategory", formData)
      .then((response) => {
        // Cập nhật thông báo thành công và đóng thông báo chờ
        toast.success("Danh mục đã được cập nhật thành công!", {
          id: loadingToast,
        });
        setIsUpdate(false);
        setIsModalOpen(false);
        handleCloseModal();
        clean();
        fetchCategorys(currentPage - 1, pageSize);
      })
      .catch((error) => {
        // Cập nhật thông báo lỗi và đóng thông báo chờ
        setIsModalOpen(false);
        handleCloseModal();
        toast.error(
          "Lỗi khi cập nhật danh mục: " +
            (error.response ? error.response.data : error.message),
          { id: loadingToast }
        );
        // Xử lý lỗi nếu có
      });
  };

  const handleEditCategory = (category) => {
    setIdCategory(category.idDanhMuc);
    setNewCategory(category.tenDanhMuc);
    setNewCategoryImageUpdate(category.anhDanhMuc);
    setIsUpdate(true);
  };

  const clean = () => {
    setIdCategory([]);
    setNewCategory([]);
    setNewCategoryImageUpdate([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    setIsUpdate(false);
  };

  const handleEditChange = (e) => {
    setEditCategory({ ...editCategory, name: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (isEditing) {
      setEditCategory({ ...editCategory, image: URL.createObjectURL(file) });
    } else {
      setNewCategoryImage(file);
    }
  };

  const handleSaveEdit = () => {
    setCategories(
      categories.map((cat) => (cat.id === editCategory.id ? editCategory : cat))
    );
    setIsEditing(false);
    setEditCategory({ id: null, name: "", image: "", Status: "false" });
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
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

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchCategorys(currentPage - 1, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (isModalOpen) {
      fetchRootCategories();
    }
  }, [isModalOpen]);

  return (
    <div className="flex p-4 gap-8 w-full">
      <div className="w-3/4">
        <div className="container bg-white shadow-lg rounded-lg p-6">
          <h2 className="fs-18 fw-6">Danh sách danh mục</h2>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={handleSearchChange}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-color-modelworld">
                <th className="p-3 text-center">ID</th>
                <th className="p-3 text-center">Tên danh mục</th>
                <th className="p-3 text-center">Ảnh</th>
                {/* <th className="p-3 text-center">Trạng thái</th> */}
                <th className="p-3 text-center">Danh mục cha</th>
                <th className="p-3 text-center">Cấp độ</th>
                {/* <th className="p-3 text-center">Hành động</th> */}
              </tr>
            </thead>
            <tbody>
              {categories2.map((category) => (
                <tr
                  key={category.idDanhMuc}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="p-3 text-gray-700 text-center align-middle">
                    {category.idDanhMuc}
                  </td>
                  <td className="p-3 text-gray-700 text-center align-middle">
                    {category.tenDanhMuc}
                  </td>
                  <td className="p-3 text-gray-700 text-center">
                    <img
                      src={category.anhDanhMuc}
                      alt={category.tenDanhMuc}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  {/* <td className="p-3 text-gray-700 text-center align-middle">
                    <div className="line-clamp-2">
                      {category.trangThaiDanhMuc === 1 ? (
                        <span className="text-green-600 inline-flex items-center justify-center bg-green-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                          <FaCheckCircle className="mr-1" /> Hoạt động
                        </span>
                      ) : (
                        <span className="text-red-600 inline-flex items-center justify-center bg-red-100 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                          <FaTimesCircle className="mr-1" /> Ngưng hoạt động
                        </span>
                      )}
                    </div>
                  </td> */}
                  <td className="p-3 text-gray-700 text-center align-middle">
                    {category.idDanhMucCha ?? "Không có"}
                  </td>
                  <td className="p-3 text-gray-700 text-center align-middle">
                    {category.capDo}
                  </td>
                  <td className="p-3 text-center align-middle">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-white bg-green-500 py-1 px-2 rounded hover:bg-green-600"
                      >
                        Cập nhật
                      </button>
                      {/* <button
                        onClick={() => handleDeleteCategory(category.idDanhMuc)}
                        className="text-white bg-red-500 py-1 px-2 rounded hover:bg-red-600"
                      >
                        Xóa
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
      </div>

      {/* Add New Category Section */}
      <div
        className="w-1/4 sticky top-20"
        style={{ height: "100%", zIndex: 10 }}
      >
        <div className="container bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Thêm danh mục mới</h3>
          <input
            type="text"
            value={newCategory}
            onChange={handleNewCategoryChange}
            placeholder="Nhập tên danh mục"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <input
            type="file"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <div className="flex justify-between">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 w-48"
            >
              Thêm danh mục
            </button>
            <button
              onClick={() => clean()}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-28 ms-2"
            >
              Mới
            </button>
          </div>
        </div>
      </div>

      {/* Modal for selecting categories */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal content */}
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Chọn doanh mục
              </h3>

              {/* Selected categories */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Đã chọn:{" "}
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map((cat, index) => (
                      <span key={index} className="font-medium text-blue-500">
                        {cat.tenLoai}
                        {index < selectedCategories.length - 1 && " > "}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">Chưa chọn</span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Array.isArray(currentLevelCategories) &&
                currentLevelCategories.length > 0 ? (
                  currentLevelCategories.map((category) => (
                    <div
                      key={category.id}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-400"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {category.tenLoai}
                      </p>
                      {category.trangThai === 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Thêm vào doanh mục này
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="col-span-3 text-center text-gray-500">
                    Không có danh mục nào
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border-t">
              <button
                onClick={handleGoBack}
                className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-gray-100"
                disabled={selectedCategories.length === 0}
              >
                Trở lại
              </button>
              <div className="flex">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-gray-100"
                >
                  Đóng
                </button>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={handleAddCategory}
                    className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    Xác nhận
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
