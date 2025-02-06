import React, { useEffect, useState } from "react";
import api from "../../config/APIUser";
import { Link } from "react-router-dom";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const MyAccountVoucher = () => {
//   const [activeTab, setActiveTab] = useState("shop");
  const [vouchers,setVochers]=useState([])
  const [filter,setFilter]=useState({
    page:0,
    numPage:0,
    key:"",
    activeTab:"shop"
  })
  const [flag,setFlag]=useState(0)

  const layVoucher=(voucherId,index)=>{
    api.post(`/voucher/getvoucher/${voucherId}`).then(v=>v.data).then(v=>{
        if(v.status===200){
            toast.success("Lấy voucher thành công")
            vouchers.splice(index,1)
            setFlag(flag+1)
        }else{
            toast.error("Voucher có thể đaz hết hoặc không hợp lệ")
        }
    })
}


  const formatDate=(da)=>{
    return new Date(da).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).replace(",", "")
  }
  const getVoucher=()=>{
        api.get("/getvouchernotinmyvoucher?type="+filter.activeTab+"&key="+filter.key+"&page="+filter.page).then(v=>v.data).then(v=>{
            filter.numPage=v.data.totalPages;
            setVochers(v.data.content)
        })
    
  }


  const layVoucherSan=(voucherId,index)=>{
    api.post(`/voucher/getvouchersan/${voucherId}`).then(v=>v.data).then(v=>{
        if(v.status===200){
            toast.success("Lấy voucher thành công")
            vouchers.splice(index,1)
            setFlag(flag+1)
        }else{
            toast.error("Voucher có thể đaz hết hoặc không hợp lệ")
        }
    })
}
  useEffect(()=>{
    getVoucher()
  },[])

  return (
    <div className="col-lg-10">
      <div className="card-address">
        <div className="head-address d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-6 fs-18">Lịch sử voucher</span>
          </div>
          <div className="d-flex">
          </div>
        </div>
        <div className="body-profile">
          <div className="addVoucher">
            <form className="m-0 p-3">
              <div className="row">
                <div className="col-2 d-flex align-items-center justify-content-end">
                  <p>Mã Voucher</p>
                </div>
                <div className="col-8">
                  <input onChange={(e)=>{
                    filter.key=e.target.value
                    getVoucher()
                  }} type="text" />
                </div>
                <div className="col-2 d-flex align-items-center justify-content-start">
                  <button
                    type="button"
                    className="btn btn-outline-secondary color-white"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="container">
          <Stack spacing={4}>
          <Pagination
            onChange={(event, value) => {
              filter.page = value - 1;
              getVoucher()
            }}
            count={filter.numPage}
            renderItem={(item) => (
              <PaginationItem
                slots={{
                  previous: IoArrowBackCircleOutline,
                  next: IoArrowForwardCircleOutline,
                }}
                {...item}
              />
            )}
          />
        </Stack>
            <ul className="nav nav-tabs bg-white">
              
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    filter.activeTab === "modelworld" ? "active" : ""
                  }`}
                  onClick={() => {
                    filter.activeTab="shop"
                    getVoucher()
                  }}
              
                >
                  Shop 
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${filter.activeTab === "shop" ? "active" : ""}`}
                  onClick={() => {
                    filter.activeTab="modelworld"
                    getVoucher()
                  }}
                >
                  ModelWorld
                </button>
              </li>
            </ul>
            {/* Nội dung các tab */}
            <div className="tab-content">
              {/* {filteredVouchers.length > 0 ? ( */}
                <div className="row">
                  {filter.activeTab==="shop"?vouchers.map((voucher,index) => (
                    <div key={voucher.id} className="col-md-6 mb-4">
                      <div className="voucher-item d-flex">
                        <div className="voucher-info">
                          <span className="badge bg-primary">
                            {voucher.soLuocDung>voucher.soLuocDaDung?`Còn lược: ${voucher.soLuocDung-voucher.soLuocDaDung}`:"Còn lược"}
                          </span>
                          <h5>{voucher.loaiVoucher===1?"Phần trăm":"Giá tiền"}</h5>
                          <p>Giá trị giảm: {voucher.giaTriGiam} đơn tối thiểu {voucher.donToiThieu}đ</p>
                          <p className="overflow-hidden text-ellipsis line-clamp-3">
                            <strong>{voucher.moTa}</strong>
                          </p>
                          <p className="text-muted">
                            Có hiệu lực từ: {formatDate(voucher.ngayBatDau)} đến {formatDate(voucher.ngayKetThuc)}
                          </p>
                          <p className="text-muted">
                            {/* {voucher.soLuocMoiNguoi>voucher.soLuocDung?"Bạn còn lược dùng":"Bạn đã dùng hết"} */}
                          </p>
                          <Link href="#" className="text-primary">
                            Mua sắm ngay - Đến với {voucher.shop.shopName}
                          </Link>
                        </div>
                        <div className="voucher-action text-center">
                            <span onClick={()=>layVoucher(voucher.id,index)} className="badge cursor-pointer bg-danger">
                                Nhận ngay
                            </span>
                        </div>
                      </div>
                    </div>
                  )):vouchers.map((voucher,index) => (
                    <div key={voucher.id} className="col-md-6 mb-4">
                      <div className="voucher-item d-flex">
                        <div className="voucher-info">
                          <span className="badge bg-primary">
                            {voucher.soLuocDung>voucher.soLuocDaDung?`Còn lược: ${voucher.soLuocDung-voucher.soLuocDaDung}`:"Còn lược"}
                          </span>
                          <h5>{voucher.loaiVoucher===1?"Phần trăm":"Giá tiền"}</h5>
                          <p>Giá trị giảm: {voucher.giaTriGiam}</p>
                          <p className="overflow-hidden text-ellipsis line-clamp-3">
                            Hình thức áp dụng: <strong>{voucher.hinhThucApDung==1?"Giảm đơn hàng":"free ship"}</strong>
                          </p>
                          <p className="text-muted">
                            Có hiệu lực từ: {formatDate(voucher.ngayBatDau)} đến {formatDate(voucher.ngayKetThuc)}
                          </p>
                          <p className="text-muted">
                            {/* {voucher.soLuocMoiNguoi>voucher.soLuocDung?"Bạn còn lược dùng":"Bạn đã dùng hết"} */}
                          </p>
                          <Link href="#" className="text-primary">
                            Mua sắm ngay 
                          </Link>
                        </div>
                        <div className="voucher-action text-center">
                            <span onClick={()=>layVoucherSan(voucher.id,index)} className="badge cursor-pointer bg-danger">
                                Nhận ngay
                            </span>
                        </div>
                        <div className="voucher-action text-center">
                            {filter.activeTab==="shop"?<span className="badge bg-danger">
                                Xem shop
                            </span>:<></>}
                          
                        </div>
                      </div>
                    </div>
                  ))}
                  
                </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountVoucher;
