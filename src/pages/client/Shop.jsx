import React, { useEffect, useState } from "react";
// import products from "../../data/json/ProductShop.json";
import axios from "axios";
import $ from "jquery";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ClientChat from "./Chat/ClientChat";
import Cookies from "js-cookie";
import api from "../../config/ApiNormal";

const Shop = () => {
  const [shopData, setShopData] = useState(null);
  const { id } = useParams();
  const [showChat, setShowChat] = useState(false);
  const [userId, setUserId] = useState(null);
  const [shopId, setShopId] = useState(null);
  //Phầm Lấy tt của user
  useEffect(() => {
    let token = Cookies.get("tokenModel");
    //alert(token);
    if (token != null) {
      api
        .post("/user/checkuser?token=" + token)
        .then((v) => v.data)
        .then((v) => {
          if (v.status === 200) {
            setUserId(v.data.id);
            //alert(v.data.id);
          } else {
          }
        });
    } else {
      // navigate("/login")
    }
  }, []);

  // Lấy tt của shop
  useEffect(() => {
    const fetchShopDetailData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/getshopinfo1?id=${id}`
        );

        if (response.data && response.data.status !== 404) {
          setShopId(response.data.shopId);

          // alert("thông tin shop nè " + response.data.shopId);
          // alert("thông tin shop nè" + response.data.idShop);
        } else {
          console.warn("Shop not found:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };

    if (id) {
      fetchShopDetailData();
    }
  }, [id]);

  useEffect(() => {
    if (shopData && shopData.shopVouchers.length > 0) {
      const timer = setTimeout(() => {
        $(".category-carousel").owlCarousel({
          loop: true,
          margin: 10,
          nav: true,
          dots: true,
          responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 5 },
          },
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [shopId]);

  useEffect(() => {
    const fetchShopDetailData = async () => {
      const userInfo = Cookies.get("userInfo");
      let userId = 0; // Giá trị mặc định nếu không có cookie

      if (userInfo) {
        // Nếu có cookie, lấy id từ userInfo
        const parsedUserInfo = JSON.parse(userInfo);
        userId = parsedUserInfo.id;
      }

      try {
        // Gọi API với userId (mặc định là 0 nếu không có userInfo)
        const response = await axios.get(
          "http://localhost:8080/shop/" + id + `?userId=${userId}`
        );
        const result = response.data;

        if (result.status === 200) {
          const { shopDetails, shopVouchers, shopProduct, shopProductNew } =
            result.data;

          const shopDetailArray = shopDetails[0];
          const shopDetail = {
            id: shopDetailArray[0],
            avatar: shopDetailArray[1],
            tenShop: shopDetailArray[2],
            soLuongSanPham: shopDetailArray[3],
            diaChi: shopDetailArray[4],
            soDienThoai: shopDetailArray[5],
            thoiGianTao: shopDetailArray[6],
          };

          setShopData({
            shopDetail,
            shopVouchers: shopVouchers.map((voucher) => ({
              id: voucher[0],
              giaTriGiam: voucher[1],
              donToiThieu: voucher[2],
              thoiGianKetThuc: voucher[3],
              loaiVoucher: voucher[4],
            })),
            shopProducts: shopProduct.map((product) => ({
              id: product[0],
              name: product[1],
              image: product[2],
              price: product[4],
              oldPrice: product[3],
              discount: product[5],
              sold: product[6],
            })),
            shopProductNews: shopProductNew.map((product) => ({
              id: product[0],
              name: product[1],
              image: product[2],
              price: product[4],
              oldPrice: product[3],
              discount: product[5],
              sold: product[6],
            })),
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchShopDetailData();
  }, []);

  if (!shopData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  const { shopDetail, shopVouchers, shopProducts, shopProductNews } = shopData;

  //

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const socket = io("http://localhost:3000/chat");

  const createConversation = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/chat/create-conversation",
        {
          accountId: userId,
          shopId: shopDetail.id,
        }
      );
      //alert("Thoogn tin đã laaud:" + userId + shopId);
      socket.emit("newConversation", response.data);
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setShowChat(true);
    }
  };
  return (
    <>
      <section className="shop">
        <div className="profile-header p-3 bg-white w-100 rounded">
          <div className="row align-items-center">
            <div className="col-lg-4 d-flex flex-column align-items-center text-center">
              <img
                src={
                  shopDetail.avatar
                    ? `${shopDetail.avatar}`
                    : "/assets/client/images/noimage.png"
                }
                alt="Profile"
                className="rounded-circle mb-2"
                style={{ width: 70, height: 70 }}
              />
              <h5 className="mb-0">{shopDetail.tenShop}</h5>
              <div className="mt-3">
                <button className="btn btn-outline-primary me-2">
                  Yêu Thích
                </button>
                <button
                  onClick={createConversation}
                  className="btn btn-outline-secondary"
                >
                  Chat
                </button>
              </div>
            </div>
            <div className="col-lg-4 d-flex flex-column text-lg-start">
              <div className="mb-3">
                Sản Phẩm: <strong>{shopDetail.soLuongSanPham}</strong>
              </div>
              <div className="mb-3">
                Địa chỉ: <strong>{shopDetail.diaChi}</strong>
              </div>
            </div>
            <div className="col-lg-4 text-lg-start">
              <div className="mb-3">
                Hotline shop: <strong>{shopDetail.soDienThoai}</strong>
              </div>
              <div className="mb-3">
                Tham gia: <strong>{shopDetail.thoiGianTao}</strong>
              </div>
            </div>
          </div>
        </div>
        {/* Voucher List */}
        {shopVouchers && shopVouchers.length > 0 ? (
          <section className="list-voucher-shop">
            <div className="container">
              <div className="category-carousel owl-carousel owl-theme">
                {shopVouchers.map((voucher) => (
                  <div className="category-item" key={voucher.id}>
                    <div className="category-item__content">
                      <div className="category-left">
                        <div className="row voucher-in-productDT">
                          <div className="col-8 content-voucher">
                            <p>
                              Giảm{" "}
                              <strong>
                                {voucher.giaTriGiam.toLocaleString()}
                                {voucher.loaiVoucher === 1 ? "%" : "đ"}
                              </strong>
                            </p>
                            <p>
                              Đơn tối thiểu: <br />
                              <strong>
                                {voucher.donToiThieu.toLocaleString()}đ
                              </strong>
                            </p>
                            <p className="pt-3">
                              <span>HSD: {voucher.thoiGianKetThuc}</span>
                            </p>
                          </div>
                          <div className="col-4 btn-voucher">
                            <a href="#" className="btn-blue-white">
                              Lấy
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <p></p>
        )}

        {/* Products Section */}
        <section className=" pt_0 flat-seller">
          <div className="mt-5 container">
            <div className="heading-product d-flex justify-content-between">
              <h2>Sản Phẩm Dành Cho Bạn</h2>
              <a
                href={`/shop/${shopDetail.id}/product`}
                className="text-primary"
              >
                Xem thêm
              </a>
            </div>
            <div
              className="grid-layout  wow fadeInUp mt-4"
              data-wow-delay="0s"
              data-grid="grid-6"
            >
              {shopProducts.slice(0, 6).map((product) => (
                <div className="card-product" key={product.id}>
                  <div className="card-product-wrapper">
                    {/* Thay đổi từ <a> thành <Link> */}
                    <Link to={`/product/${product.id}`} className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src={product.image}
                        src={product.image}
                        alt={product.name}
                      />
                      <img
                        className="lazyload img-hover"
                        data-src={product.hoverImage}
                        src={product.image}
                        alt={product.name}
                      />
                    </Link>
                    <div className="list-product-btn">
                      <a
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag"></span>
                        <span className="tooltip">Quick Add</span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart"></span>
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete"></span>
                      </a>
                      <a
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare"></span>
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check"></span>
                      </a>
                      <a
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view"></span>
                        <span className="tooltip">Quick View</span>
                      </a>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="product-content">
                      <p className="name-product">{product.name}</p>
                      {product.price ? (
                        <>
                          <label>
                            <p>{product.oldPrice.toLocaleString()}đ</p>
                            <p>-{product.discount}%</p>
                          </label>
                          <label className="footer-card-product">
                            <span>{product.price.toLocaleString()}đ</span>
                            <p>đã bán: {product.sold}</p>
                          </label>
                        </>
                      ) : (
                        // Nếu giá mới là null, hiển thị giá cũ làm giá mới
                        <>
                          <label className="h-7" />
                          <label className="footer-card-product">
                            <span>{product.oldPrice.toLocaleString()}đ</span>
                            <p>đã bán: {product.sold}</p>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className=" pt_0 flat-seller">
          <div className="mt-5 container">
            <div className="heading-product d-flex justify-content-between">
              <h2>Hàng mới về</h2>
              <a
                href={`/shop/${shopDetail.id}/product`}
                className="text-primary"
              >
                Xem thêm
              </a>
            </div>
            <div
              className="grid-layout  wow fadeInUp mt-4"
              data-wow-delay="0s"
              data-grid="grid-6"
            >
              {shopProductNews.slice(0, 6).map((product) => (
                <div className="card-product" key={product.id}>
                  <div className="card-product-wrapper">
                    {/* Thay đổi từ <a> thành <Link> */}
                    <Link to={`/product/${product.id}`} className="product-img">
                      <img
                        className="lazyload img-product"
                        data-src={product.image}
                        src={product.image}
                        alt={product.name}
                      />
                      <img
                        className="lazyload img-hover"
                        data-src={product.hoverImage}
                        src={product.image}
                        alt={product.name}
                      />
                    </Link>
                    <div className="list-product-btn">
                      <a
                        href="#quick_add"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quick-add tf-btn-loading"
                      >
                        <span className="icon icon-bag"></span>
                        <span className="tooltip">Quick Add</span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="box-icon bg_white wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart"></span>
                        <span className="tooltip">Add to Wishlist</span>
                        <span className="icon icon-delete"></span>
                      </a>
                      <a
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="offcanvasLeft"
                        className="box-icon bg_white compare btn-icon-action"
                      >
                        <span className="icon icon-compare"></span>
                        <span className="tooltip">Add to Compare</span>
                        <span className="icon icon-check"></span>
                      </a>
                      <a
                        href="#quick_view"
                        data-bs-toggle="modal"
                        className="box-icon bg_white quickview tf-btn-loading"
                      >
                        <span className="icon icon-view"></span>
                        <span className="tooltip">Quick View</span>
                      </a>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <div className="product-content">
                      <p className="name-product">{product.name}</p>
                      {product.price ? (
                        <>
                          <label>
                            <p>{product.oldPrice.toLocaleString()}đ</p>
                            <p>-{product.discount}%</p>
                          </label>
                          <label className="footer-card-product">
                            <span>{product.price.toLocaleString()}đ</span>
                            <p>đã bán: {product.sold}</p>
                          </label>
                        </>
                      ) : (
                        // Nếu giá mới là null, hiển thị giá cũ làm giá mới
                        <>
                          <label className="h-7" />
                          <label className="footer-card-product">
                            <span>{product.oldPrice.toLocaleString()}đ</span>
                            <p>đã bán: {product.sold}</p>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Chat Button */}
          {!showChat && (
            <div
              onClick={toggleChat}
              className="fixed bottom-10 right-10 bg-blue-600 text-white p-4 rounded-full cursor-pointer z-50 shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-700"
              title="Mở cửa sổ chat"
            >
              💬 Chat
            </div>
          )}

          {/* Chat  */}
          {showChat && (
            <div className="fixed bottom-10 right-10 z-50">
              <ClientChat onClose={toggleChat} />
            </div>
          )}
        </section>
      </section>
    </>
  );
};

export default Shop;
