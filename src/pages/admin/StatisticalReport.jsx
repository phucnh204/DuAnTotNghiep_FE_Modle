import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import api from "../../config/AdminAPI";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatisticalReport = () => {
  const [timeFrame1, setTimeFrame1] = useState("day"); // Mặc định chọn 'day' cho doanh thu lợi nhuận
  const [timeFrame2, setTimeFrame2] = useState("day"); // Mặc định chọn 'day' cho đơn hàng
  const [dateRange1, setDateRange1] = useState({ startDate: "", endDate: "" });
  const [dateRange2, setDateRange2] = useState({ startDate: "", endDate: "" });
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([120, 30, 50]); // Dữ liệu mặc định cho biểu đồ tròn

  // Thêm mới by NamJava

  const [filterTypeShop, setFilterTypeShop] = useState("DAY"); // Bộ lọc cho cửa hàng
  const [filterTypeProduct, setFilterTypeProduct] = useState("DAY"); // Bộ lọc cho sản phẩm
  const [dataShop, setDataShopShop] = useState([]); // Dữ liệu cửa hàng từ API
  const [dataProduct, setDataProduct] = useState([]); // Dữ liệu sản phẩm từ API
  const [currentPageShop, setCurrentPageShop] = useState(0); // Trang hiện tại của cửa hàng
  const [currentPageProduct, setCurrentPageProduct] = useState(0); // Trang hiện tại của sản phẩm
  const [totalPagesShop, setTotalPagesShop] = useState(0); // Tổng số trang của cửa hàng
  const [totalPagesProduct, setTotalPagesProduct] = useState(0); // Tổng số trang của sản phẩm
  const pageSize = 10; // Số lượng mỗi trang

  // Fetch dữ liệu cửa hàng
  const fetchDataShop = async () => {
    try {
      const response = await api.get(
        "http://localhost:8080/admin/getTopReport",
        {
          params: {
            filterType: filterTypeShop.toUpperCase(),
            page: currentPageShop,
            size: pageSize,
          },
        }
      );

      const result = response.data; // Dữ liệu trả về từ API
      setDataShopShop(result.content); // Cập nhật danh sách cửa hàng
      setTotalPagesShop(result.totalPages); // Tổng số trang cửa hàng
    } catch (error) {
      console.error("Lỗi khi gọi API cửa hàng:", error);
    }
  };

  // Fetch dữ liệu sản phẩm
  const fetchDataProduct = async () => {
    try {
      const response = await api.get(
        "http://localhost:8080/admin/getTopReportProduct",
        {
          params: {
            filterType: filterTypeProduct.toUpperCase(),
            page: currentPageProduct,
            size: pageSize,
          },
        }
      );

      const result = response.data; // Dữ liệu trả về từ API
      setDataProduct(result.content); // Cập nhật danh sách sản phẩm
      setTotalPagesProduct(result.totalPages); // Tổng số trang sản phẩm
    } catch (error) {
      console.error("Lỗi khi gọi API sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchDataShop(); // Gọi API dữ liệu cửa hàng
    fetchDataProduct(); // Gọi API dữ liệu sản phẩm
  }, [
    filterTypeShop,
    filterTypeProduct,
    currentPageShop,
    currentPageProduct,
    pageSize,
  ]);

  // Hàm xử lý thay đổi bộ lọc cho cửa hàng
  const handleFilterChangeShop = (e) => {
    setFilterTypeShop(e.target.value); // Cập nhật filterType cho cửa hàng
    setCurrentPageShop(0); // Reset lại trang cửa hàng về 0
    fetchDataShop(); // Gọi lại API với bộ lọc mới
  };

  // Hàm xử lý thay đổi bộ lọc cho sản phẩm
  const handleFilterChangeProduct = (e) => {
    setFilterTypeProduct(e.target.value); // Cập nhật filterType cho sản phẩm
    setCurrentPageProduct(0); // Reset lại trang sản phẩm về 0
    fetchDataProduct(); // Gọi lại API với bộ lọc mới
  };

  // End NamJava

  // Hàm xử lý thay đổi combobox (chọn thời gian thống kê)
  const handleTimeFrameChange = (event, chart) => {
    const value = event.target.value;
    if (chart === 1) {
      setTimeFrame1(value);
    } else {
      setTimeFrame2(value);
    }
  };

  // Hàm xử lý thay đổi ngày (date range)
  const handleDateChange = (event, chart) => {
    const { name, value } = event.target;
    if (chart === 1) {
      setDateRange1((prev) => ({ ...prev, [name]: value }));
    } else {
      setDateRange2((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gọi API để lấy dữ liệu doanh thu và lợi nhuận
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await api.get("revenueReport", {
          params: {
            filterType: timeFrame1,
            startDate: dateRange1.startDate,
            endDate: dateRange1.endDate,
          },
        });
        setRevenueData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchRevenueData();
  }, [timeFrame1, dateRange1]);

  // Gọi API để lấy dữ liệu đơn hàng
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await api.get("orderTotal", {
          params: {
            filterType: timeFrame2,
            startDate: dateRange2.startDate,
            endDate: dateRange2.endDate,
          },
        });
        // Giả sử response.data trả về kiểu { success: number, cancelled: number, pending: number }
        setOrdersData([
          response.data[0] || 0,
          response.data[1] || 0,
          response.data[2] || 0,
        ]);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };

    fetchOrderData();
  }, [timeFrame2, dateRange2]);

  // Hàm xử lý dữ liệu cho biểu đồ doanh thu và lợi nhuận
  const revenueProfitChartData = () => {
    const labels = timeFrame1 === "year" ? ["Doanh thu"] : ["Doanh thu"]; // Nếu là ngày, tuần hoặc tháng chỉ có 1 cột duy nhất

    const data =
      timeFrame1 === "year"
        ? revenueData.map((item) => item[0] || 0)
        : [revenueData.reduce((sum, item) => sum + (item[0] || 0), 0)]; // Tổng doanh thu nếu không phải năm

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu",
          data,
          backgroundColor: "#00b5e2",
        },
        {
          label: "Lợi nhuận",
          data:
            timeFrame1 === "year"
              ? revenueData.map((item) => item[1] || 0)
              : [revenueData.reduce((sum, item) => sum + (item[1] || 0), 0)],
          backgroundColor: "#f44336",
        },
      ],
    };
  };

  // Dữ liệu cho biểu đồ tròn (Tổng đơn hàng)
  const ordersChartData = {
    labels: ["Đơn thành công", "Đơn hủy", "Đơn đang thực hiện"],
    datasets: [
      {
        data: ordersData[0],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
      },
    ],
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold">
            Thống kê Doanh thu và Lợi nhuận
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Theo ngày, tuần, tháng, năm
          </p>
          <div className="flex gap-4 mb-4">
            <select
              className="p-2 border rounded"
              value={timeFrame1}
              onChange={(e) => handleTimeFrameChange(e, 1)}
            >
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>
          <div className="ct-chart">
            <Bar
              data={revenueProfitChartData()}
              options={{ responsive: true }}
            />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold">Thống kê Đơn hàng</h4>
          <p className="text-sm text-gray-600 mb-4">
            Theo ngày, tuần, tháng, năm
          </p>
          <div className="flex gap-4 mb-4">
            <select
              className="p-2 border rounded"
              value={timeFrame2}
              onChange={(e) => handleTimeFrameChange(e, 2)}
            >
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>
          <div className="ct-chart">
            <Pie data={ordersChartData} />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold">
            Top 30 cửa hàng có doanh thu cao nhất
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Theo ngày, tuần, tháng, năm
          </p>
          <div className="flex gap-4 mb-4">
            {/* Bộ lọc cho cửa hàng */}
            <select
              className="p-2 border rounded"
              value={filterTypeShop}
              onChange={handleFilterChangeShop}
            >
              <option value="DAY">Ngày</option>
              <option value="WEEK">Tuần</option>
              <option value="MONTH">Tháng</option>
              <option value="YEAR">Năm</option>
            </select>
          </div>

          {/* Bảng hiển thị dữ liệu cửa hàng */}
          <div className="topShop-Table">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-left">
                    <th className="px-4 py-2 border-b whitespace-nowrap w-1/4 text-center">
                      Tên cửa hàng
                    </th>
                    <th className="px-4 py-2 border-b whitespace-nowrap w-1/6">
                      Ảnh đại diện
                    </th>
                    <th className="px-4 py-2 border-b whitespace-nowrap w-1/4 text-center">
                      Tên chủ cửa hàng
                    </th>
                    <th className="px-4 py-2 border-b whitespace-nowrap w-1/4">
                      Số điện thoại
                    </th>
                    <th className="px-4 py-2 border-b whitespace-nowrap w-1/4">
                      Doanh thu
                    </th>
                    <th className="px-4 py-2 border-b whitespace-nowrap w-1/6">
                      Số lượng đơn hàng
                    </th>
                    <th className="px-4 py-2 border-b whitespace-nowrap w-1/6">
                      Ngày đăng ký
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataShop.length > 0 ? (
                    dataShop.map((shop, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border-b whitespace-nowrap text-center">
                          {shop[1]}
                        </td>
                        <td className="px-4 py-2 border-b">
                          <img
                            src={shop[2] || "https://via.placeholder.com/50"}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                        </td>
                        <td className="px-4 py-2 border-b whitespace-nowrap text-center">
                          {shop[3]}
                        </td>
                        <td className="px-4 py-2 border-b">{shop[4]}</td>
                        <td className="px-4 py-2 border-b text-green-600">
                          {shop[5].toLocaleString()}đ
                        </td>
                        <td className="px-4 py-2 border-b text-blue-600">
                          {shop[6]}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {new Date(shop[7]).toLocaleDateString("vi-VN")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-gray-500"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phân trang cửa hàng */}
          <div className="flex justify-between mt-4">
            <button
              className="p-2 border rounded disabled:opacity-50"
              disabled={currentPageShop === 0}
              onClick={() => setCurrentPageShop(currentPageShop - 1)}
            >
              Trang trước
            </button>
            <span>
              Trang {currentPageShop + 1} / {totalPagesShop}
            </span>
            <button
              className="p-2 border rounded disabled:opacity-50"
              disabled={currentPageShop + 1 === totalPagesShop}
              onClick={() => setCurrentPageShop(currentPageShop + 1)}
            >
              Trang sau
            </button>
          </div>
        </div>

        {/* Top sản phẩm */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h4 className="text-xl font-semibold">
            Top 30 sản phẩm bán chạy nhất
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Theo ngày, tuần, tháng, năm
          </p>
          <div className="flex gap-4 mb-4">
            {/* Bộ lọc cho sản phẩm */}
            <select
              className="p-2 border rounded"
              value={filterTypeProduct}
              onChange={handleFilterChangeProduct}
            >
              <option value="DAY">Ngày</option>
              <option value="WEEK">Tuần</option>
              <option value="MONTH">Tháng</option>
              <option value="YEAR">Năm</option>
            </select>
          </div>

          {/* Bảng hiển thị dữ liệu sản phẩm */}
          <div className="topShop-Table">
            <div className="overflow-x-auto">
              <table className="min-w-full text-center  md:table rounded  overflow-hidden sm:hidden">
                <thead>
                  <tr className="">
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Tên sản phẩm
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Ảnh sản phẩm
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Tên cửa hàng
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                      Doanh thu
                    </th>
                    Lượt bán
                    <th className="px-4 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="">
                  {dataProduct.map((item) => (
                    <tr
                      key={item[0]}
                      className="hover:bg-gray-100 transition-colors  text-center "
                    >
                      <td className="px-3 py-3 text-sm text-gray-600 text-start align-middle w-58 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="line-clamp-2">{item[1]}</span>
                        </div>
                      </td>

                      <td className="px-3 py-3 text-sm text-gray-600 text-center align-middle w-42 overflow-hidden">
                        <img
                          src={item[2] || "https://via.placeholder.com/50"}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      </td>

                      <td className="px-3 py-3 text-sm text-gray-600 text-center align-middle w-30 overflow-hidden">
                        <div className="line-clamp-2">{item[3]}</div>
                      </td>

                      <td className="px-3 py-3 text-sm text-gray-600 text-center align-middle w-24 overflow-hidden">
                        <img
                          src={item[4] || "https://via.placeholder.com/50"}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600 text-start align-middle w-58 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="line-clamp-2">{item[5]}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phân trang sản phẩm */}
          <div className="flex justify-between mt-4">
            <button
              className="p-2 border rounded disabled:opacity-50"
              disabled={currentPageProduct === 0}
              onClick={() => setCurrentPageProduct(currentPageProduct - 1)}
            >
              Trang trước
            </button>
            <span>
              Trang {currentPageProduct + 1} / {totalPagesProduct}
            </span>
            <button
              className="p-2 border rounded disabled:opacity-50"
              disabled={currentPageProduct + 1 === totalPagesProduct}
              onClick={() => setCurrentPageProduct(currentPageProduct + 1)}
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticalReport;
