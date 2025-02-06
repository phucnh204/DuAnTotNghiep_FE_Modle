import React, { useContext, useEffect, useState } from "react";
// import addressesData from "../../data/json/address.json";
import api from "../../config/APIUser";
import toast from "react-hot-toast";
import ModalDiaChi from "./ModalChonDiaChi";
import { AppContext } from "../../App";

const MyAccountAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [flag,setFlag]=useState(0)
  const [address,setAdress]=useState({})
  const setAddressDefault=(id,index)=>{
    toast.promise(
      api.post("/address/updatedefault?id="+id).then(v=>v.data).then(v=>{
        if(v.status===400){
          throw new Error(v.message)
        }else{
          addresses.forEach(v=>v.isDefault=0);
          addresses[index].isDefault=1;
          setFlag(flag+1)
        }
      })
      ,{
        loading:"Đang cập nhật địa chỉ",
        "success":"Cập nhật default thành công",
        error:error=>error.message
      })
  }

  const [isOpen,setIsOpen]=useState({
    num:0
  })

  useEffect(() => {
    setFloadingPage()
    getAllDiaChi()
  }, []);

  const getAllDiaChi=()=>{
    api.get("/getalldiachi").then(v=>v.data).then(v=>{
      setAddresses(v.data)
    }).catch(error=>{
      toast.error("Có lỗi lấy dữ liệu")
    })
  }
  useEffect(()=>{
    if(isOpen.num>0){
      document.getElementById("btn-choose-address").click()
    }
    isOpen.num++;
  },[address])
  const {setFloadingPage } = useContext(AppContext);

  // const setFlas=()=>{
  //   setAd((prevMang) => [...prevMang, newElement]);
  // }
 
  return (
    <div className="col-lg-10">
      <div className="card-address ">
        <div className="head-address d-flex justify-content-between align-items-center">
          <span className="fw-6 fs-18">Địa chỉ của tôi</span>
          <ModalDiaChi address={address} setFlas={getAllDiaChi} />
          <span
          onClick={async ()=>{
           setAdress({})
          }}
            className="px-4 py-2 text-blue-700 "
          >
        Thêm địa chỉ
      </span>
        </div>
        <div className="body-profile">
          <p className="fs-16 fw-4 pb-3 pt-3">Địa chỉ</p>
          {addresses.map((address1,index) => (
            <div className="row address-list">
              <div className="col-md-8">
                <div className="row align-items-center">
                  <label htmlFor={`address-${address1.id}`} className="col-sm-3">
                    Nguyến thanh Nam
                  </label>
                  <div className="col-sm-9">
                    <span id={`phone-${address.id}`} className="fw-6">
                      {address1.soDienThoai}
                    </span>
                  </div>
                </div>
                <p className="text-black-50">{address1.chiTietDiaChi}</p>
                <p className="text-black-50">{address1.toanBoDiaChi} </p>
                {address1.isDefault?<span className="btn-macDinh text-primary">Mặc định</span>:""}
              </div>
              <div className="col-md-4 text-center body-profile-right">
                <p onClick={()=>{
                  setAdress(address1)
                  }} className="text-primary">Cập nhật</p>
                <button 
                  disabled={address1.isDefault===1}
                  onClick={()=>setAddressDefault(address1.id,index)}
                  className="btn-khongPhaiMacDinh"
                >
                  {address.isDefault===1?"Mặc định":'Thiết lập mặc định'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAccountAddress;
