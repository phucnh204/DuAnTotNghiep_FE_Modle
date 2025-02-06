import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../config/APIUser';

const ModalDiaChi = ({address,setFlas}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thanhPho, setThanhPho] = useState([]);
  const [wardCode, setWardCode] = useState([]);
  const [district, setDistrict] = useState([]);
  const [flag,setFlag]=useState(0)
  function isValidVietnamPhoneNumber(phoneNumber) {
    const regex = /^(0(3[2-9]|5[2-9]|7[0|6-9]|8[1-9]|9[0-9]))\d{7}$/;
    return regex.test(phoneNumber);
  }


  const submit=()=>{
        if(address.wardCode==-1){
            alert("Vui lòng chọn đầy đủ địa chỉ")
        }else{
            toast.promise(api.post(address.id!=undefined?"/updateaddress":"/addaddress",address,{
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(v=>v.data).then(v=>{
                if(v.status===200){

                    setFlas()
                }else{
                  throw new Error(v.message)              
                }
            }),{
                loading:"Đang thao tác....",
                success:"thành công...",
                error:error=>error.message
            })
        }
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
        if(address.id===undefined){
          address.districtId=data.data[0].DistrictID
        }
        if(address.id===undefined){
          address.wardCode=-1
        setWardCode([])
        }
        setDistrict(data.data);

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
        if(address.id===undefined){
          address.wardCode=data.data[0].WardCode
        }
        setWardCode(data.data);
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
  };


  
  const openModal = () => {
    setIsOpen(true);
    if(address.id!==undefined){
        getDistrictId(address.provinceId)
        getWardCode(address.districtId)
    }else{
        address.districtId=null;
        address.wardCode=null;
        setDistrict([])
        setWardCode([])
    }
  };


  // Hàm đóng Modal
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* Nút mở Modal */}
      <span
        id='btn-choose-address'
        onClick={openModal}
        className="px-4 py-2 text-blue-700 "
      >
        {/* Chọn địa chỉ */}
      </span>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50" style={{zIndex:"999999"}}>
          <div className="bg-white p-4 rounded shadow-md w-11/12 max-w-3xl">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-2 text-sm text-right">Thành phố</div>
              <div className="col-span-12 lg:col-span-10">
                <select
                  onChange={(e) => {
                    const province = thanhPho[e.target.value];
                
                      address.provinceId= province.ProvinceID;
                      address.toanBoDiaChi= province.ProvinceName + "-";
                    getDistrictId(province.ProvinceID);
                  }}
                  className="w-full p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                >
                  {thanhPho.map((province, index) => (
                    <option
                      key={province.ProvinceID}
                      selected={address.provinceId == province.ProvinceID}
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
                    address.districtId= districtData.DistrictID
                    address.toanBoDiaChi=address.toanBoDiaChi.split("-")[0] + "-" + districtData.DistrictName
                    setFlag(flag+1)
                    getWardCode(districtData.DistrictID);
                  }}
                  className="w-full p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                >
                  {district.map((districtData, index) => (
                    <option
                      key={districtData.DistrictID}
                      selected={address.districtId == districtData.DistrictID}
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
                    address. wardCode= wardData.WardCode
                    address.toanBoDiaChi=address.toanBoDiaChi.split("-")[0] + "-" + address.toanBoDiaChi.split("-")[1] + "-" + wardData.WardName
                    setFlag(flag+1)
                  }}
                  className="w-full p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                >
                  {wardCode.map((ward, index) => (
                    <option
                      key={ward.WardCode}
                      selected={address.wardCode == ward.WardCode}
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
                    address.chiTietDiaChi=e.target.value
                    setFlag(flag+1)
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
                    address.ghiChu=e.target.value
                    setFlag(flag+1)
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
                onClick={() => submit()}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {address.id==undefined?"Thêm địa chỉ":"Cập nhật địa chỉ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDiaChi;
