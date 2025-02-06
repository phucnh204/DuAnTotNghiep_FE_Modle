import React, { useEffect, useState } from "react";
import api from "../../config/APIUser";
import { Link } from "react-router-dom";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from "react-icons/io5";
import ModalChooseCart from "./ModalChooseCart";
import ModalChooseCartVoucher from "./ModalChooseCartInVoucher";

const VoucherHistory = () => {
//   const [activeTab, setActiveTab] = useState("shop");
  const [vouchers,setVochers]=useState([])
  const [filter,setFilter]=useState({
    page:0,
    numPage:0,
    key:"",
    activeTab:"shop"
  })

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
        api.get("/voucherhistory?type="+filter.activeTab+"&key="+filter.key).then(v=>v.data).then(v=>{
            filter.numPage=v.data.totalPages;
            setVochers(v.data.content)
        })
    
  }
  const [orderDetail,setOrderDetail]=useState(null)
  const [voucherShop,setVoucherShop]=useState(null)
  useEffect(()=>{
    getVoucher()
  },[])

  const [open,setOpen]=useState(false)
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
          <ModalChooseCartVoucher voucherShop={voucherShop} open={open} setOpen={setOpen} orderDetail={orderDetail}></ModalChooseCartVoucher>
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
                  {filter.activeTab==="shop"?vouchers.map((voucher) => (
                    <div key={voucher.id} className="col-md-6 mb-4">
                      <div className="voucher-item d-flex">
                        <div className="voucher-info">
                          <span className="badge bg-primary">
                            {voucher.voucher.soLuocDung>voucher.voucher.soLuocDaDung?`Còn lược: ${voucher.voucher.soLuocDung-voucher.voucher.soLuocDaDung}`:"Còn lược"}
                          </span>
                          <h5>{voucher.voucher.tenVoucher}</h5>
                          <p>Giá trị giảm: {voucher.voucher.giaTriGiam} đơn tối thiểu {voucher.voucher.donToiThieu}đ</p>
                          <p className="overflow-hidden text-ellipsis line-clamp-3">
                            <strong>{voucher.voucher.moTa}</strong>
                          </p>
                          <p className="text-muted">
                            Có hiệu lực từ: {formatDate(voucher.voucher.ngayBatDau)} đến {formatDate(voucher.voucher.ngayKetThuc)}
                          </p>
                          <p className="text-muted">
                            {voucher.voucher.soLuocMoiNguoi>voucher.soLuocDung?"Bạn còn lược dùng":"Bạn đã dùng hết"}
                          </p>
                          <Link onClick={()=>{
                            console.log(voucher.voucher)
                          setVoucherShop(voucher.voucher)
                            setOpen(true)
                          }} className="text-primary">
                            Mua sắm ngay - Đến với {voucher.voucher.shop.shopName}
                          </Link>
                        </div>
                        <div className="voucher-action text-center">
                            <span className="badge bg-danger">
                                Xem shop
                            </span>
                        </div>
                      </div>
                    </div>
                  )):vouchers.map((voucher) => (
                    <div key={voucher.id} className="col-md-6 mb-4">
                      <div className="voucher-item d-flex">
                        <div className="voucher-info">
                          <span className="badge bg-primary">
                            {voucher.voucherSan.soLuocDung>voucher.voucherSan.soLuocDaDung?`Còn lược: ${voucher.voucherSan.soLuocDung-voucher.voucherSan.soLuocDaDung}`:"Còn lược"}
                          </span>
                          <h5>{voucher.voucherSan.loaiVoucher===1?"Phần trăm":"Giá tiền"}</h5>
                          <p>Giá trị giảm: {voucher.voucherSan.giaTriGiam}</p>
                          <p className="overflow-hidden text-ellipsis line-clamp-3">
                            Hình thức áp dụng: <strong>{voucher.voucherSan.hinhThucApDung}</strong>
                          </p>
                          <p className="text-muted">
                            Có hiệu lực từ: {formatDate(voucher.voucherSan.ngayBatDau)} đến {formatDate(voucher.voucherSan.ngayKetThuc)}
                          </p>
                          <p className="text-muted">
                            {voucher.voucherSan.soLuocMoiNguoi>voucher.soLuocDung?"Bạn còn lược dùng":"Bạn đã dùng hết"}
                          </p>
                          <Link href="#" className="text-primary">
                            Mua sắm ngay 
                          </Link>
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

export default VoucherHistory;
