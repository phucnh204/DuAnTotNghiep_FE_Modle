import React, { useEffect, useState } from "react";
import {
  FaWallet,
  FaUsers,
  FaChartLine,
  FaBoxOpen,
  FaCartArrowDown,
  FaCube,
  FaBriefcase,
} from "react-icons/fa";
import axios from "axios";
import api from "../../config/AdminAPI";

const iconMapping = {
  FaWallet: <FaWallet className="text-4xl text-blue-600 mr-3" />,
  FaChartLine: <FaChartLine className="text-4xl text-green-600 mr-3" />,
  FaBoxOpen: <FaBoxOpen className="text-4xl text-yellow-600 mr-3" />,
  FaCartArrowDown: <FaCartArrowDown className="text-4xl text-red-600 mr-3" />,
  FaUsers: <FaUsers className="text-4xl text-blue-500 mb-4" />,
  FaBriefcase: <FaBriefcase className="text-4xl text-yellow-600 mb-4" />,
  FaCube: <FaCube className="text-4xl text-purple-600 mb-4" />,
};

const Dashboard = () => {
  const [revenueToday, setRevenueToday] = useState(null);
  const [revenuePercentage, setRevenuePercentage] = useState(null);
  const [completedOrdersToday, setCompletedOrdersToday] = useState(null);
  const [activeAccounts, setActiveAccounts] = useState(null);
  const [activeSellers, setActiveSellers] = useState(null);
  const [activeProducts, setActiveProducts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          revenueTodayResponse,
          revenuePercentageResponse,
          completedOrdersTodayResponse,
          activeAccountsResponse,
          activeSellersResponse,
          activeProductsResponse,
        ] = await axios.all([
          api.get("dashboard/getRevenueToday").catch((err) => err),
          api.get("dashboard/getTodayRevenuePercentage").catch((err) => err),
          api.get("dashboard/countCompletedOrdersToday").catch((err) => err),
          api.get("dashboard/countActiveAccounts").catch((err) => err),
          api.get("dashboard/countActiveSeller").catch((err) => err),
          api.get("dashboard/activeProducts").catch((err) => err),
        ]);

        // Kiểm tra nếu một API gặp lỗi, sẽ không làm gián đoạn quá trình
        if (revenueTodayResponse instanceof Error) {
          console.error("Error fetching revenue today:", revenueTodayResponse);
          setRevenueToday(0); // Bạn có thể xử lý lỗi tại đây, chẳng hạn set giá trị mặc định
        } else {
          setRevenueToday(revenueTodayResponse.data.data);
        }

        if (revenuePercentageResponse instanceof Error) {
          console.error(
            "Error fetching revenue percentage:",
            revenuePercentageResponse
          );
          setRevenuePercentage(0);
        } else {
          setRevenuePercentage(revenuePercentageResponse.data.data);
        }

        if (completedOrdersTodayResponse instanceof Error) {
          console.error(
            "Error fetching completed orders:",
            completedOrdersTodayResponse
          );
          setCompletedOrdersToday(0);
        } else {
          setCompletedOrdersToday(completedOrdersTodayResponse.data.data);
        }

        if (activeAccountsResponse instanceof Error) {
          console.error(
            "Error fetching active accounts:",
            activeAccountsResponse
          );
          setActiveAccounts(0);
        } else {
          setActiveAccounts(activeAccountsResponse.data.data);
        }

        if (activeSellersResponse instanceof Error) {
          console.error(
            "Error fetching active sellers:",
            activeSellersResponse
          );
          setActiveSellers(0);
        } else {
          setActiveSellers(activeSellersResponse.data.data);
        }

        if (activeProductsResponse instanceof Error) {
          console.error(
            "Error fetching active products:",
            activeProductsResponse
          );
          setActiveProducts(0);
        } else {
          setActiveProducts(activeProductsResponse.data.data);
        }
      } catch (err) {
        setError(err.message); // Nếu có lỗi ngoài việc gọi API
        console.error("Unexpected error:", err);
      }
    };

    fetchData(); // Gọi phương thức khi component render lần đầu
  }, []);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number); // Dùng 'vi-VN' để phân cách theo kiểu Việt Nam (dấu chấm)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-[80vh] w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 mt-6">
        <div className="bg-white border p-6 rounded-lg shadow-md flex flex-col items-start transition-transform duration-300 hover:shadow-xl hover:scale-105">
          <div className="flex items-center mb-3">
            {iconMapping[`FaWallet`]}
            <span className="text-lg font-medium text-gray-800">
              Tổng Doanh Thu
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {revenueToday !== null ? (
              <>
                {formatNumber(revenueToday)}{" "}
                <span className="text-sm">VNĐ</span>
              </>
            ) : (
              "Loading..."
            )}
          </div>
          <span className="text-sm text-gray-500 mt-2">
            Tổng doanh thu từ tất cả các hoạt động mua bán
          </span>
        </div>
        <div className="bg-white border p-6 rounded-lg shadow-md flex flex-col items-start transition-transform duration-300 hover:shadow-xl hover:scale-105">
          <div className="flex items-center mb-3">
            {iconMapping[`FaChartLine`]}
            <span className="text-lg font-medium text-gray-800">Lợi Nhuận</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {revenuePercentage !== null ? (
              <>
                {formatNumber(revenuePercentage)}{" "}
                <span className="text-sm">VNĐ</span>
              </>
            ) : (
              "Loading..."
            )}
          </div>
          <span className="text-sm text-gray-500 mt-2">
            Lợi nhuận đạt được, chiếm 4% mỗi đơn hàng thành công
          </span>
        </div>
        <div className="bg-white border p-6 rounded-lg shadow-md flex flex-col items-start transition-transform duration-300 hover:shadow-xl hover:scale-105">
          <div className="flex items-center mb-3">
            {iconMapping[`FaBoxOpen`]}
            <span className="text-lg font-medium text-gray-800">
              Tổng Đơn Hàng
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {completedOrdersToday !== null ? (
              <>
                {completedOrdersToday} <span className="text-sm">Đơn</span>
              </>
            ) : (
              "Loading..."
            )}
          </div>
          <span className="text-sm text-gray-500 mt-2">
            Tổng số đơn hàng đã xử lý và hoàn thành
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center transition-shadow duration-300 hover:shadow-lg">
          {iconMapping[`FaUsers`]}
          <span className="text-lg font-medium text-gray-800">Khách hàng</span>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {activeAccounts !== null ? (
              <>
                {activeAccounts} <span className="text-sm">Người</span>
              </>
            ) : (
              "Loading..."
            )}
          </div>
          <span className="text-sm text-gray-500">
            Tổng số lượng khách hàng đang hoạt động trên sàn
          </span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center transition-shadow duration-300 hover:shadow-lg">
          {iconMapping[`FaBriefcase`]}
          <span className="text-lg font-medium text-gray-800">
            Người bán hàng
          </span>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {activeSellers !== null ? (
              <>
                {activeSellers} <span className="text-sm">Người</span>
              </>
            ) : (
              "Loading..."
            )}
          </div>
          <span className="text-sm text-gray-500">
            Tổng số lượng người bán hàng đang hoạt động trên sàn
          </span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center transition-shadow duration-300 hover:shadow-lg">
          {iconMapping[`FaCube`]}
          <span className="text-lg font-medium text-gray-800">Sản phẩm</span>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {activeProducts !== null ? (
              <>
                {activeProducts} <span className="text-sm">Sản phẩm</span>
              </>
            ) : (
              "Loading..."
            )}
          </div>
          <span className="text-sm text-gray-500">
            Tổng số lượng sản phẩm đang được bán trên sàn
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
