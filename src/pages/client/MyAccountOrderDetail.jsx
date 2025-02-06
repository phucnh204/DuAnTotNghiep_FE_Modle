import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/APIUser";
import formatToVND from "../../components/client/FormatVND";
import { AppContext } from "../../App";

const MyAccountOrderDetail = () => {
  const [orderDetail, setOrderDetail] = useState(null);
  const {id}=useParams()
  const {setFloadingPage } = useContext(AppContext);
  useEffect(() => {
    setFloadingPage()
    api.get("/order/getorderdetail/"+id).then(v=>v.data).then(v=>{
      if(v.status===200){
        setOrderDetail(v.data)
        console.log(v.data)
      }else{
        alert(v.message)
      }
    })
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <>
      {orderDetail!=null&& <div className="col-lg-10 ">
        {/* Phần 1: Thông tin đơn hàng */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white p-3 ">
            <div className="d-flex justify-content-between">
              <a href="#">Quay lại</a>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <h2 className="h4">
                Mã đơn hàng: <span>{orderDetail.id}</span>
              </h2>
              <p>
                <strong>Trạng thái:</strong>
                <span className="text-primary"> {orderDetail.trangThai.tenTrangThai}</span>
              </p>
            </div>
            <div className="d-flex gap-3">
              <p className="bg-light p-2 rounded">
                <strong>Ngày mua:</strong> {formatDate(orderDetail.ngayTaoDon)}
              </p>
              <p className="bg-light p-2 rounded">
                <strong>Voucher shop áp dụng:</strong> {orderDetail.tienTru>0?"Có áp dụng":"Không áp dụng"}
              </p>
              <p className="bg-light p-2 rounded">
              <strong>Voucher sàn áp dụng:</strong> {orderDetail.tienTruVoucherSan>0?"Có áp dụng":"Không áp dụng"}
              </p>
            </div>
          </div>
        </div>

        {/* Phần 2: Thông tin người mua, cửa hàng và địa chỉ giao hàng */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Địa chỉ nhận hàng</h5>
               <p>
                  <strong>Địa chỉ:</strong> {orderDetail.diaChiId.toanBoDiaChi}
                </p>
                <p>
                  <strong>Địa chỉ chi tiết:</strong> {orderDetail.diaChiId.chiTietDiaChi}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {orderDetail.diaChiId.soDienThoai}
                </p>
                <p>
                  <strong>Ghi chú:</strong> {orderDetail.diaChiId.ghiChu}
                </p> 
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Thông tin cửa hàng</h5>
                 <p>
                  <strong>Tên cửa hàng:</strong> {orderDetail.shop.shopName}
                </p>
                <p>
                  <strong>Id cửa hàng:</strong> {orderDetail.shop.shopId}
                </p> <p>
                  <strong>Email shop:</strong> {orderDetail.shop.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phần 3: Bảng sản phẩm và phí đơn hàng */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">Danh sách sản phẩm</h5>
            <div className="card-oder">
              {orderDetail.orderDetails.map((product, index) => (
                <div key={index} className="row">
                  <div className="col-lg-2">
                    <img src={product.product.hinhAnh} alt={product.name} />
                  </div>
                  <div className="col-lg-7">
                    <p className="fw-6 fs-18">{product.product.product.tenSanPham}</p>
                    <p className="text-black-50">
                      Phân loại: {product.product.kichThuoc.tenKichThuoc} - {product.product.mauSac.tenMau}
                    </p>
                    <a href="#" className="green-btn">
                      Chính sách đổi trả
                    </a>
                  </div>
                  <div className="col-lg-3 d-flex pt-4">
                    <p className="text-color-blue">
                      {product.soLuong*product.giaBan} VNĐ
                    </p> 
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
            <div className="d-flex justify-content-between fw-bold text-md text-dark">
                <span>Tiền giảm voucher sàn:</span>
                <span className="text-danger">
                  {formatToVND(orderDetail.tienTruVoucherSan)} 
                </span>
              </div>
              <div className="d-flex justify-content-between fw-bold text-lg text-dark">
                <span>Tiền giảm voucher shop:</span>
                <span className="text-danger">
                  {formatToVND(orderDetail.tienTru)} 
                </span>
              </div>
              <div className="d-flex justify-content-between fw-bold text-lg text-dark">
                <span>Phí ship:</span>
                <span className="text-danger">
                  {formatToVND(orderDetail.phiShip)} 
                </span>
              </div>
              <div className="d-flex justify-content-between fw-bold text-lg text-dark">
                <span>Tổng cộng:</span>
                <span className="text-danger">
                  {formatToVND(orderDetail.tongTien+orderDetail.phiShip-orderDetail.tienTru-orderDetail.tienTruVoucherSan)} 
                </span>
              </div>
              
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-end">
                {/* <a href="#" className="btn btn-primary ps-5 pe-5">
                  Mua lại
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>}
    </>
  );
};

export default MyAccountOrderDetail;
