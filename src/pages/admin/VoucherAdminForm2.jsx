import React, { useEffect, useState } from "react";
import category from "../../data/json/category.json";
const VoucherAdminForm2 = () => {
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

  const [displayOption, setDisplayOption] = useState("");

  const [categorys, setCategorys] = useState([]);

  useEffect(() => {
    // Đặt dữ liệu vào state
    setCategorys(category);
  }, []);
  return (
    <>
      <div className="flex p-8">
        {/* Form Section */}
        <form className="w-3/4">
          {/* Thông tin cơ bản */}

          <div className="mb-8">
            <div className="container bg-white">
              <div className="p-6 bg-white ">
                <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>

                {/* Loại mã */}
                <div className="mb-4 flex items-center space-x-4">
                  <label className="font-medium">Loại mã</label>
                  <a
                    href=""
                    className="border rounded-md shadow-md p-3 text-color-blue fw-6"
                  >
                    Voucher mặc hàng
                  </a>
                </div>

                {/* Tên chương trình giảm giá */}
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Tên chương trình giảm giá
                  </label>
                  <input
                    type="text"
                    className="w-full border border-red-500 p-2 rounded-md"
                    placeholder="Không được để trống ô"
                    maxLength={100}
                    value={voucherName}
                    onChange={(e) => setVoucherName(e.target.value)}
                  />
                  <p className="text-xs  mt-1">
                    Tên Voucher sẽ không được hiển thị cho Người mua
                  </p>
                </div>

                {/* Mã voucher */}
                <div className="mb-4">
                  <label className="block font-medium mb-1">Mã voucher</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded-md"
                    maxLength={5}
                    placeholder="NAMP / INPUT"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Vui lòng chỉ nhập các kí tự chữ cái (A-Z), số (0-9); tối đa
                    5 kí tự.
                  </p>
                  <p className="text-xs text-gray-500">
                    Mã giảm giá đầy đủ là: NAMP
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
                  <div className="mt-2">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={allowSaveBeforeUse}
                        onChange={(e) =>
                          setAllowSaveBeforeUse(e.target.checked)
                        }
                      />
                      Cho phép lưu mã trước Thời gian sử dụng
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hiển thị mã giảm giá và các sản phẩm áp dụng */}
          <div className="mb-8">
            <div className="container bg-white">
              <div className="p-6 bg-white ">
                <h2 className="text-lg font-semibold mb-4">
                  Thiết lập mã giảm giá
                </h2>

                {/* Tên chương trình giảm giá */}
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

                {/* Mã voucher */}
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
                    Tổng lượt sử dụng tối đa
                  </label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded-md"
                    value={maxUseValue}
                    onChange={(e) => setMaxUseValue(e.target.value)}
                  />

                  <p className="text-xs text-gray-500 pt-1">
                    Tổng số Mã giảm giá có thể sử dụng
                  </p>
                </div>
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
          <div className="mb-8">
            <div className="container bg-white">
              <div className="p-6 bg-white ">
                <h2 className="text-lg font-semibold mb-4">
                  Hiển thị mã giảm giá và các sản phẩm áp dụng
                </h2>

                {/* Tên chương trình giảm giá */}
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Thiết lập hiển thị
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="displayOption"
                        value="multi"
                        checked={displayOption === "multi"}
                        onChange={() => setDisplayOption("multi")}
                      />
                      <span>Hiển thị nhiều nơi</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="displayOption"
                        value="voucher"
                        checked={displayOption === "voucher"}
                        onChange={() => setDisplayOption("voucher")}
                      />
                      <span>Không công khai</span>
                    </label>
                    <span>
                      ( Mã giảm giá của bạn sẽ không được công khai, bạn có thể
                      chia sẻ mã giảm giá với người dùng khác)
                    </span>
                  </div>
                </div>

                {/* Mã voucher */}
                <div className="mb-4 flex items-center">
                  <label className="block font-medium mb-1">
                    Sản phẩm được áp dụng
                  </label>
                  <div className="ps-3">
                    <select className="border border-gray-300 p-2 rounded-md">
                      {categorys.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
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

        {/* Preview Section */}
        <div className="w-1/4 p-4 ml-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Xem trước</h2>
          <div className="border rounded p-4">
            {/* Placeholder for preview content */}
            <p>
              Người mua sẽ không thể sử dụng voucher này cho tất cả sản phẩm của
              Shop
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoucherAdminForm2;
