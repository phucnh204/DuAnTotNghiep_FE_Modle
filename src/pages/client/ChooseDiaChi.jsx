import React, { useState, useEffect } from 'react';

const ModalDiaChi = ({address,setAddress}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thanhPho, setThanhPho] = useState([]);
  const [wardCode, setWardCode] = useState([]);
  const [district, setDistrict] = useState([]);
  const [flag,setFlag]=useState(0)
  function isValidVietnamPhoneNumber(phoneNumber) {
    const regex = /^(0(3[2-9]|5[2-9]|7[0|6-9]|8[1-9]|9[0-9]))\d{7}$/;
    return regex.test(phoneNumber);
  }

  useEffect(() => {
    const getThanhPho = () => {
      const token = '1c0642bd-4891-11ef-af01-5a4abb38d4d4';
      const shopId = '5146217';
      fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Token': token,
          'ShopId': shopId
        }
      })
        .then(response => response.json())
        .then(data => {
          setThanhPho(data.data);
        })
        .catch(error => {
          console.error('Lỗi:', error);
        });
    };

    getThanhPho();
  }, []);

  const getDistrictId = (id) => {
    const token = '1c0642bd-4891-11ef-af01-5a4abb38d4d4';
    const shopId = '5146217';
    fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': token,
        'ShopId': shopId
      },
      body: JSON.stringify({ "province_id": id })
    })
      .then(response => response.json())
      .then(data => {
        setDistrict(data.data);
        setAddress(prevState => ({
          ...prevState,
          districtId: data.data[0].DistrictID
        }));
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
  };

  const getWardCode = (id) => {
    const token = '1c0642bd-4891-11ef-af01-5a4abb38d4d4';
    const shopId = '5146217';
    fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': token,
        'ShopId': shopId
      },
      body: JSON.stringify({ "district_id": id })
    })
      .then(response => response.json())
      .then(data => {
        setWardCode(data.data);
        setAddress(prevState => ({
          ...prevState,
          wardCode: data.data[0].WardCode
        }));
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
  };

  // Hàm mở Modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Hàm đóng Modal
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* Nút mở Modal */}
      <span
        onClick={openModal}
        className="px-4 py-2 text-blue-700 "
      >
        Chọn địa chỉ
      </span>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-md w-11/12 max-w-3xl">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-2 text-sm text-right">Thành phố</div>
              <div className="col-span-12 lg:col-span-10">
                <select
                  onChange={(e) => {
                    const province = thanhPho[e.target.value];
                    setAddress(prevState => ({
                      ...prevState,
                      provinceId: province.ProvinceID,
                      toanBoDiaChi: province.ProvinceName + "-"
                    }));
                    getDistrictId(province.ProvinceID);
                  }}
                  className="w-full p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                >
                  {thanhPho.map((province, index) => (
                    <option
                      key={province.ProvinceID}
                      selected={address.provinceId === province.ProvinceID}
                      value={index}
                    >
                      {province.ProvinceName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-6">
              <div className="col-span-12 lg:col-span-2 text-sm text-right">Huyện</div>
              <div className="col-span-12 lg:col-span-10">
                <select
                  onChange={(e) => {
                    const districtData = district[e.target.value];
                    setAddress(prevState => ({
                      ...prevState,
                      districtId: districtData.DistrictID,
                      toanBoDiaChi: prevState.toanBoDiaChi.split("-")[0] + "-" + districtData.DistrictName + "-"
                    }));
                    getWardCode(districtData.DistrictID);
                  }}
                  className="w-full p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                >
                  {district.map((districtData, index) => (
                    <option
                      key={districtData.DistrictID}
                      selected={address.districtId === districtData.DistrictID}
                      value={index}
                    >
                      {districtData.DistrictName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-6">
              <div className="col-span-12 lg:col-span-2 text-sm text-right">Thị xã</div>
              <div className="col-span-12 lg:col-span-10">
                <select
                  onChange={(e) => {
                    const wardData = wardCode[e.target.value];
                    setAddress(prevState => ({
                      ...prevState,
                      wardCode: wardData.WardCode,
                      toanBoDiaChi: prevState.toanBoDiaChi.split("-")[0] + "-" + prevState.toanBoDiaChi.split("-")[1] + "-" + wardData.WardName
                    }));
                  }}
                  className="w-full p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                >
                  {wardCode.map((ward, index) => (
                    <option
                      key={ward.WardCode}
                      selected={address.wardCode === ward.WardCode}
                      value={index}
                    >
                      {ward.WardName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-6">
              <div className="col-span-12 lg:col-span-2 text-sm text-right">Toàn bộ địa chỉ</div>
              <div className="col-span-12 lg:col-span-10">
                <input
                  disabled
                  value={address.toanBoDiaChi}
                  type="text"
                  placeholder="Toàn bộ địa chỉ"
                  className="w-full p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 mt-6">
              <div className="col-span-12 lg:col-span-2 text-sm text-right">Số điện thoại</div>
              <div className="col-span-12 lg:col-span-10">
                <input
                  value={address.soDienThoai}
                  type="text"
                  onChange={(e)=>{
                    address.soDienThoai=e.target.value
                    setFlag(flag+1)
                  }}
                  placeholder="Toàn bộ địa chỉ"
                  className="w-full p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                />
                <p className='w-full text-danger'>{isValidVietnamPhoneNumber(address.soDienThoai)} </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-6">
              <div className="col-span-12 lg:col-span-2 text-sm text-right">Địa chỉ chi tiết</div>
              <div className="col-span-12 lg:col-span-10">
                <textarea
                  value={address.chiTietDiaChi}
                  onChange={(e) => {
                    setAddress(prevState => ({
                      ...prevState,
                      chiTietDiaChi: e.target.value
                    }));
                  }}
                  className="w-full p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-6">
              <div className="col-span-12 lg:col-span-2 text-sm text-right">Ghi chú</div>
              <div className="col-span-12 lg:col-span-10">
                <textarea
                  value={address.ghiChu}
                  onChange={(e) => {
                    setAddress(prevState => ({
                      ...prevState,
                      ghiChu: e.target.value
                    }));
                  }}
                  className="w-full p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
              >
                Đóng
              </button>
              <button
                onClick={() => alert("Thông tin đã được lưu")}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDiaChi;
