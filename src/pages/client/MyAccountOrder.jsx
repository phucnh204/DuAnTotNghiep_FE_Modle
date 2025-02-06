import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
// import ordersData from "../../data/json/order.json";
import api from "../../config/APIUser";
import { Button, Pagination, PaginationItem, Stack } from "@mui/material";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import OrderEmpty from "../../utils/images/seller/OrderEmpty.png";
import toast from "react-hot-toast";
import ModalReport from "./ModelReport";
import { BiCheckCircle } from "react-icons/bi";
import formatToVND from "../../components/client/FormatVND";
import { AppContext } from "../../App";
import ModalCancel from "./ModalCancelOrder";
const RatingModal = lazy(() => import("./ModalConfirm"));
const MyAccountOrder = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState(1); // Trạng thái cho tab hiện tại
  const [filter, setFilter] = useState({
    page: 0,
    numPage: 0,
    key: "",
  });
  const {setFloadingPage } = useContext(AppContext);
  const { id } = useParams();
  useEffect(()=>setFloadingPage(),[])
  useEffect(() => {
    if (id != undefined) {
      filter.key = id;
    }
    getOrders();
  }, [activeTab]);

  const getOrders = () => { 
    
    api
      .get(
        `/order/getAllOrderNormal?trangThaiId=${activeTab}&key=${filter.key}&page=${filter.page}`,{
        }
      )
      .then((v) => {
        return v.data;
      })
      .then((v) => {
        filter.numPage = v.totalPages;
        setOrders(v.content);
      });
  };
  const setOrderss = (index) => {
    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
  };
  const renderComponent = (order, index) => {
    switch (order.trangThai.id) {
      case 2:
        return (
          <ActionPrepare
            // navigate={navigate}
            orderId={order.id}
            setOrders={setOrderss}
            index={index}
          />
        );
      case 3:
        return (
          <ActionNormal
            orderId={order.id}
          />
        );
      case 4:
        return <ActionNormal orderId={order.id} />;
      case 5:
        return (
          <ActionFinish
            order={order}
            index={index}
            // navigate={navigate}
            setOrders={setOrderss}
          />
        );
      case 6:
        return <ActionNormal orderId={order.id} />;
      case 7:
        return <ActionCacel orderId={order} />;
      case 7:
        return <ActionCacel orderId={order} />;
      case 8:
        return <ActionCacel orderId={order} />;
    }
  };

  return (
    <div className="col-lg-10">
      <ul className="nav nav-tabs bg-white" id="myTab" role="tablist">
        {[
          "Tất cả",
          "Chờ xác nhận",
          "Đã gia cho đơn vị vận chuyển",
          "Đang giao hàng",
          "Đã giao hàng",
          "Giao thành công",
          "Giao thất bại",
          "Đơn hủy",
        ].map((tab, index) => (
          <li className="nav-item" role="presentation" key={index}>
            <button
              className={`nav-link ${activeTab - 1 === index ? "active" : ""}`}
              onClick={() => setActiveTab(index + 1)}
              type="button"
              role="tab"
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
      <div className="tf-search-sticky pt-3">
        <div className="tf-mini-search-frm">
          <fieldset className="text">
            <input
              onChange={(e) => {
                filter.key = e.target.value;
              }}
              type="text"
              placeholder="Bạn có thể tìm kiếm theo Tên shop, id đơn hàng."
              name="text"
              required
            />
          </fieldset>
          <button type="button">
            <i className="icon-search" onClick={() => getOrders()}></i>
          </button>
        </div>
      </div>
      <div className="tab-content" id="myTabContent">
        <Stack spacing={4}>
          <Pagination
            onChange={(event, value) => {
              filter.page = value - 1;
              getOrders();
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
        <div
          className={`${
            orders.length < 1
              ? "flex h-[580px] w-full bg-white text-center justify-center items-center flex-col"
              : "hidden"
          }`}
        >
          <img
            style={{ width: "200px", marginBottom: "16px" }}
            src={OrderEmpty}
            alt="Order Empty"
          />
          <p className="text-sm text-gray-500">Không có dữ liệu...</p>
        </div>

        <div>
          <div className="my-account-content account-order">
            <div className="wrap-account-order">
              <table>
                <tbody>
                  {orders.map((v, idx) => (
                    <tr className="tf-order-item"id={`orderitem${v.id}`}>
                      <div className="card-oder">
                        <div className="head-card d-flex justify-content-between">
                          <div className="head-left">
                            <p>
                              <img
                                src="/assets/client/images/icon/Store1.svg"
                                alt="" 
                              />{" "}
                              {v.shop.shopName}
                            </p>
                            <a className="chat-btn d-flex align-items-center">
                              <img
                                src="/assets/client/images/icon/chatwhite.svg"
                                alt=""
                              />{" "}
                              Chat
                            </a>
                            <a className="shop-btn d-flex align-items-center">
                              <img src={v.shop.hinhAnh} alt="" /> Xem Shop
                            </a>
                          </div>
                          <div className="head-right">
                            <p className="text-status flex align-items-center ">
                              <img
                                src="/assets/client/images/icon/Ship-green.svg"
                                alt=""
                              />{" "}
                              <span className="text-sm">{v.trangThai.tenTrangThai}</span>
                            
                            </p>
                          </div>
                        </div>
                        <div className="body-card">
                          {/* Kiểm tra xem order.product có phải là mảng không */}
                          {v.orderDetails.map((product, productIndex) => (
                            <div className="row mb-2" key={productIndex}>
                              <div className="col-lg-2">
                                <img className="rounded-sm" style={{width:"80px",height:"80px",objectFit:"cover",margin:"0 auto"}}
                                  src={product.image || product.product.hinhAnh}
                                  alt={product.name}
                                />
                              </div>
                              <div className="col-lg-7">
                                <p className="fw-6 fs-18">
                                  {product.product.product.tenSanPham}
                                </p>
                                <p className="text-black-100 foont-semibold">
                                  Phân loại:{" "}
                                  <span className="text-blue-500 font-semibold">{product.product.kichThuoc.tenKichThuoc} -{" "} {product.product.mauSac.tenMau}</span>
                                </p>
                                <p className="text-black-50 mt-2 mb-2 font-semibold">
                                {product.trangThaiDanhGia===1?<>
                                  Đơn hàng đã đánh giá <BiCheckCircle style={{display:"inline"}} color="green"/>
                                </>:""} 
                                </p>
                                
                                {product.trangThaiDanhGia===1?<></>:
                                <Suspense fallback={<div>Loading...</div>}>
                                  {activeTab === 6 ? (
                                    <RatingModal orderDetail={product} />
                                  ) : (
                                    <></>
                                  )}
                                </Suspense>
}
                                <p>
                                <span className="font-semibold">{product.soLuong}</span> x <span className="font-semibold">{formatToVND(product.giaBan)}</span>
                                </p>
                              </div>
                              <div className="col-lg-3 d-flex pt-4">
                                <p className=" pe-3 font-semibold">
                                  {formatToVND(product.giaBan * product.soLuong)} <sub>đ</sub>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="foot-card">
                          <p className="text-lg font-semibold">
                            {v.diaChiId.toanBoDiaChi} {v.diaChiId.chiTietDiaChi}
                          </p>
                          {renderComponent(v,idx)}
                        </div>
                      </div>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountOrder;

const ActionPrepare = ({ orderId, setOrders, index }) => {

  return (
    <>
      <Link
        to={"/client/my-account-orderDetail/" + orderId}
        className="bg-transparent hover:bg-green-500 text-green-700 font-semibold  py-2 px-4 border border-green-500 hover:border-transparent rounded"
      >
        Xem chi tiết đơn hàng.
      </Link>
      <ModalCancel id={orderId} index={index} reload={setOrders} />
    </>
  );
};

const ActionNormal = ({ orderId }) => {
  return (
    <>
      <Link
        to={"/client/my-account-orderDetail/" + orderId}
        // onClick={() => navigate(`/user/auth/orderdetail/${orderId}`)}
        className="bg-transparent hover:bg-green-500 text-green-700 font-semibold  py-2 px-4 border border-green-500 hover:border-transparent rounded"
      >
        Xem chi tiết đơn hàng.
      </Link>
    </>
  );
};

const ActionFinish = ({ order, index, navigate, setOrders }) => {
  const confirmNotReciveOrder = () => {
    toast.promise(
      api
        .post(`/order/notreciveorder/${order.id}`)
        .then((v) => v.data)
        .then((v) => {
          if (v.status === 200) {
            setOrders(index);
          } else {
            throw new Error(v.message);
          }
        }),
      {
        loading: "Đang cập nhật đơn hàng",
        success:
          "Đã cập nhật trạng thái đơn hàng và gửi TB đến shop, vui lòng đợi xử lý",
        error: (error) => error.message,
      }
    );
  };

  const confirmOrder = () => {
    toast.promise(
      api
        .post(`/order/confirm/${order.id}`)
        .then((v) => v.data)
        .then((v) => {
          if (v.status == 200) {
            setOrders(index);
          } else {
            throw new Error(v.message);
          }
        }),
      {
        loading: "Đang cập nhật đơn hàng",
        success: "Đã cập nhật trạng thái thành công",
        error: (error) => error.message,
      }
    );
  };
  return (
    <>
      <Link
        to={"/client/my-account-orderDetail/" + order.id}
        // onClick={() => navigate(`/user/auth/orderdetail/${orderId}`)}
        className="bg-transparent hover:bg-green-500 text-green-700 font-semibold  py-2 px-4 border border-green-500 hover:border-transparent rounded"
      >
        XEM CHI TIẾT 
      </Link>
      <Button  onClick={() => {
          confirmOrder();
        }} variant="outlined">Đã nhận được hàng</Button>
      <Button  onClick={() => {
          confirmNotReciveOrder();
        }}  variant="outlined">Tôi không nhận được hàng</Button>
      {/* <span
        onClick={() => {
          confirmNotReciveOrder();
        }}
        className={`btn btn-btn-outline cursor-pointer ${
          order.daNhanHang === 1 ? "disabled" : ""
        } `}
      >
        Tôi không nhận được hàng.
      </span> */}
    </>
  );
};

const ActionCacel = ({ orderId }) => {
  const {fetchCart } = useContext(AppContext);
  const copyOrder = () => {
    toast.promise(
      api
        .post(`/order/copyorder/${orderId.id}`)
        .then((v) => v.data)
        .then((v) => {
          if (v.status === 200) {
            fetchCart()
          } else {
            throw new Error(v.message);
          }
        }),
      {
        loading: "Đang đặt lại đơn",
        success: "Đặt lại đơn thành công",
        error: (error) => error.message,
      }
    );
  };
  return (
    <>
      <Link
        to={"/client/my-account-orderDetail/" + orderId.id}
        className="bg-transparent hover:bg-green-500 text-green-700 font-semibold  py-2 px-4 border border-green-500 hover:border-transparent rounded"
      >
        Xem chi tiết.
      </Link>
      <button
        type="button"
        onClick={() => {
          copyOrder();
        }}
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold  py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Đặt lại đơn 
      </button>
      <button
        type="button"
        onClick={() => {
          toast(orderId.lyDo, {
            icon: 'ℹ️', // Biểu tượng dạng "info"
            style: {
              border: '1px solid #007bff',
              padding: '16px',
              color: '#007bff',
            },
          });
        }}
        
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold  py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Xem lý do hủy đơn
      </button>
      <ModalReport order={orderId}/>
    </>
  );
};
