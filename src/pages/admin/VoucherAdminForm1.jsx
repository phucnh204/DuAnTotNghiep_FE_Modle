import React, { useEffect, useState } from "react";
import api from "../../config/AdminAPI";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const VoucherAdminForm1 = () => {
  const [voucherName, setVoucherName] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allowSaveBeforeUse, setAllowSaveBeforeUse] = useState(false);

  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxUseValue, setMaxUseValue] = useState("");
  const [maxUsePerUser, setMaxUsePerUser] = useState("");
  const [giamToiDa, setGiamToiDa] = useState("");
  const [status, setStatus] = useState("");

  const [voucherSanDetail, setVoucherSanDetail] = useState(null);
  const { voucherId } = useParams();
  const navigate = useNavigate();

  const fetchVoucherSanDetail = async (voucherId) => {
    try {
      const response = await api.get(`voucherSanAdminDetail/${voucherId}`);
      const data = response.data;
      setVoucherSanDetail(data);

      // Fill dữ liệu vào các trường
      setVoucherName(data.tenVoucher || "");
      setVoucherCode(data.maVoucher || "");
      setStartDate(new Date(data.ngayBatDau).toISOString().slice(0, 16)); // Định dạng datetime-local
      setEndDate(new Date(data.ngayKetThuc).toISOString().slice(0, 16));
      setDiscountType(data.loaiVoucher === 1 ? "percentage" : "amount");
      setDiscountValue(data.giaTriGiam);
      setMinOrderValue(data.donToiThieu);
      setMaxUseValue(data.soLuocDung);
      setMaxUsePerUser(data.soLuocDungMoiNguoi);
      setGiamToiDa(data.gioiHanGiam);
      setStatus(data.trangThai);
    } catch (error) {
      console.error("Error fetching voucher details:", error);
    }
  };

  const back = () => {
    navigate("/admin/voucher");
  };

  const submitVoucher = async (e) => {
    e.preventDefault(); // Ngừng reload trang khi submit form

    const voucherData = {
      tenVoucher: voucherName,
      maVoucher: voucherCode,
      ngayBatDau: startDate,
      ngayKetThuc: endDate,
      loaiVoucher: discountType === "percentage" ? 1 : 0, // 1 cho phần trăm, 2 cho tiền mặt
      giaTriGiam: discountValue,
      donToiThieu: minOrderValue,
      soLuocDung: maxUseValue,
      soLuocDungMoiNguoi: maxUsePerUser,
      gioiHanGiam: giamToiDa,
      trangThai: status,
    };

    try {
      let response;
      if (voucherId && voucherId !== 0) {
        response = await api.post(`saveOrUpdate/${voucherId}`, voucherData);
        toast.success("Cập nhật voucher thành công!");
      } else {
        response = await api.post(`saveOrUpdate/${0}`, voucherData);
        toast.success("Tạo mới voucher thành công!");
      }

      // Nếu API trả về thông báo lỗi
      if (response.status !== 200) {
        toast.error(
          "Có lỗi xảy ra khi tạo hoặc cập nhật voucher: " + response.data
        );
      } else {
        navigate("/admin/voucher");
      }
    } catch (error) {
      // toast.error("Lỗi khi thêm: ", error);
      if (error.response && error.response.data) {
        // Hiển thị lỗi trả về từ backend (có thể là lỗi do form không hợp lệ)
        toast.error("Lỗi: " + error.response.data);
      } else {
        toast.error("Có lỗi xảy ra khi tạo hoặc cập nhật voucher.");
      }
    }
  };

  useEffect(() => {
    if (voucherId) {
      fetchVoucherSanDetail(voucherId);
    }
  }, [voucherId]);

  return (
    <div className="flex p-8">
      {/* Form Section */}
      <form className="w-100" onSubmit={submitVoucher}>
        {/* Thông tin cơ bản */}
        <div className="mb-8">
          <div className="container bg-white">
            <div className="p-6 bg-white">
              <h2 className="text-lg font-semibold mb-4">Thông tin voucher</h2>

              {/* Tên chương trình giảm giá */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Tên voucher</label>
                <input
                  type="text"
                  className="w-full border border-red-500 p-2 rounded-md"
                  placeholder="Không được để trống ô"
                  maxLength={100}
                  value={voucherName}
                  onChange={(e) => setVoucherName(e.target.value)}
                />
              </div>

              {/* Mã voucher */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Mã voucher</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  maxLength={5}
                  placeholder="Mã"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vui lòng chỉ nhập các kí tự chữ cái (A-Z), số (0-9); tối đa 5
                  kí tự.
                </p>
              </div>

              {/* Thời gian sử dụng mã */}
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Thời gian sử dụng mã
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="datetime-local"
                    className="border p-2 rounded-md"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <span>–</span>
                  <input
                    type="datetime-local"
                    className="border p-2 rounded-md"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hiển thị mã giảm giá và các sản phẩm áp dụng */}
        <div className="mb-8">
          <div className="container bg-white">
            <div className="p-6 bg-white">
              <h2 className="text-lg font-semibold mb-4">Thiết lập voucher</h2>

              {/* Loại giá giảm | Mức giảm */}
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Loại giá giảm | Mức giảm
                </label>
                <div className="flex items-center space-x-4">
                  <select
                    className="border border-gray-300 p-2 rounded-md"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <option value="amount">Theo số tiền</option>
                    <option value="percentage">Theo phần trăm</option>
                  </select>
                  <input
                    type="text"
                    className="border border-red-500 p-2 rounded-md flex-grow"
                    placeholder="Không được để trống ô"
                    maxLength={100}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />
                </div>
              </div>

              {/* Giá trị đơn hàng tối thiểu */}
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Giá trị đơn hàng tối thiểu
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Giá trị giảm tối đa
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  value={giamToiDa}
                  onChange={(e) => setGiamToiDa(e.target.value)}
                />
              </div>

              {/* Tổng lượt sử dụng tối đa */}
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Tổng lượt sử dụng tối đa
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  value={maxUseValue}
                  onChange={(e) => setMaxUseValue(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Tổng số Mã giảm giá có thể sử dụng
                </p>
              </div>

              {/* Tổng lượt sử dụng tối đa/Người mua */}
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Tổng lượt sử dụng tối đa/Người mua
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  value={maxUsePerUser}
                  onChange={(e) => setMaxUsePerUser(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={back}
            className="bg-gray-300 px-4 py-2 rounded mr-2"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn-color-admin text-white px-4 py-2 rounded"
          >
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  );
};

export default VoucherAdminForm1;
