import React, { useState, useEffect, useContext } from "react";
import Swiper from "../../assets/client/js/swiper-bundle.min.js";
import "../../assets/client/css/bootstrap.min.css";
import "../../assets/client/css/bootstrap-select.min.css";
import "../../assets/client/css/drift-basic.min.css";
import "../../assets/client/css/photoswipe.css";
import productDetail from "../../data/json/productDetails.json";
import shopDetailpd from "../../data/json/shop.json";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../config/ApiNormal.js";
import apiUser from "../../config/APIUser.js";
import toast from "react-hot-toast";
import { Pagination, PaginationItem, Rating, Stack } from "@mui/material";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import { AppContext } from "../../App.js";
import formatToVND from "../../components/client/FormatVND.js";
import { format } from "date-fns";
import { AiOutlineProduct } from "react-icons/ai";
import { MdBrandingWatermark } from "react-icons/md";
const DetailProduct = () => {
  const { id } = useParams();
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [product, setProduct] = useState(productDetail.product);
  const [htmlString, sethtmlString] = useState("");
  const [isFavorite, setIsFavotite] = useState(false);
  const addToFavorite = () => {
    toast.promise(
      apiUser
        .post("/product/release/" + id)
        .then((v) => v.data)
        .then((v) => {
          if (v.status === 200) {
            setIsFavotite(v.data);
            return v.data;
          } else {
            throw new Error(v.message);
          }
        }),
      {
        loading: "Đang xử lý",
        success: (v) =>
          !v
            ? "Đã xóa sản phẩm khỏi danh sách yêu thích"
            : "Đã thêm vào danh sách yêu thích.",
        error: (error) => error.messge,
      }
    );
  };

  const [shopdt, setShop] = useState(shopDetailpd.shop);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const swiper = new Swiper(".tf-product-media-main", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
    setSwiperInstance(swiper);

    const productSwiper = new Swiper(".tf-sw-product-sell ", {
      slidesPerView: 4, // Số slide hiển thị mặc định
      spaceBetween: 30, // Khoảng cách giữa các slide
      breakpoints: {
        1024: {
          slidesPerView: 6, // Khi kích thước màn hình >1024px
        },
        768: {
          slidesPerView: 4, // Khi kích thước màn hình >768px
        },
        480: {
          slidesPerView: 2, // Khi kích thước màn hình nhỏ hơn 480px
        },
      },
      navigation: {
        nextEl: ".nav-next-slider", // Nút chuyển tới slide tiếp theo
        prevEl: ".nav-prev-slider", // Nút quay lại slide trước
      },
    });

    const recentSwiper = new Swiper(".tf-sw-recent", {
      slidesPerView: 4, // Số slide hiển thị mặc định
      spaceBetween: 30, // Khoảng cách giữa các slide
      breakpoints: {
        1024: {
          slidesPerView: 6, // Khi kích thước màn hình >1024px
        },
        768: {
          slidesPerView: 4, // Khi kích thước màn hình >768px
        },
        480: {
          slidesPerView: 2, // Khi kích thước màn hình nhỏ hơn 480px
        },
      },
      navigation: {
        nextEl: ".nav-next-slider", // Nút chuyển tới slide tiếp theo
        prevEl: ".nav-prev-slider", // Nút quay lại slide trước
      },
    });

    return () => {
      if (swiper) swiper.destroy();
      if (productSwiper) productSwiper.destroy();
      if (recentSwiper) recentSwiper.destroy();
    };
  }, []);

  const handleThumbnailClick = (index) => {
    if (swiperInstance) swiperInstance.slideTo(index);
  };

  const navigate = useNavigate();

  const [dataFill, setdataFill] = useState({});
  const fetchCounstar = (shopId) => {
    api
      .post(
        "/danhgia/getcountstart?shopId=" + shopId,
        [...Array.from(productMap.keys())],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((v) => v.data)
      .then((v) => {
        setdataFill(v);
      });
  };
  const [productt, setProductt] = useState({
    product: {
      productImages: [],
      productDetails: new Map(),
      thuongHieu: {},
      category: {},
    },
    khuyenMai: {},
  });
  const [productMap, setProductMap] = useState(new Map());
  const proccess = async (data, shopId) => {
    data.forEach((v) => {
      productMap.set(v.id, v.mauSac.tenMau + "  " + v.kichThuoc.tenKichThuoc);
    });
    fetchCounstar(shopId);
    setFlag(flag + 1);
  };
  const [vouchers, setVouchers] = useState([]);

  const getVoucherByProduct = () => {
    api
      .get(`/voucher/gevoucherbyproductid/${id}`)
      .then((v) => v.data)
      .then((v) => {
        setVouchers(v.data);
      })
      .catch((Error) => {
        alert(Error);
      });
  };
  const { fetchCart, setFloadingPage } = useContext(AppContext);
  function renderDate(dateString) {
    const d = new Date(dateString);
    return `${d.getFullYear()}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}`;
  }

  const addToCart = (type) => {
    if (cart.product.id !== undefined) {
      toast.promise(
        apiUser
          .post(
            "/cart/addtocart",
            {
              productDetailId: cart.product.id,
              soLuong: cart.soLuong,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((v) => v.data)
          .then((v) => {
            if (v.status === 200) {
              fetchCart();
              if (type === "checkout") {
                localStorage.setItem("ids", JSON.stringify([v.data]));
                navigate("/client/checkout");
              }
            } else if (v.status === 401) {
              navigate("/login");
              throw new Error("Tài khoản không hợp lệ");
            } else if (v.status !== 200) {
              throw new Error(v.message);
            }
          }),
        {
          loading: "Đang thêm vào giỏ hàng",
          success: "Thêm thành công vào giỏ hàng",
          error: (error) => error.message,
        }
      );
    } else {
      toast("This is a warning!", {
        icon: "⚠️", // Icon cảnh báo
        style: {
          background: "#f9c74f", // Màu vàng
          color: "#000", // Màu chữ
          fontWeight: "bold",
        },
      });
    }
  };

  const [productDetails, setProductDetails] = useState([]);
  const [flag, setFlag] = useState(0);
  useEffect(() => {
    setFloadingPage();
    api
      .get(`/product/productdetail/${id}`)
      .then((v) => v.data)
      .then((v) => {
        if (v.status === 200) {
          productt.product = v.data.product;
          productt.khuyenMai = v.data.khuyenMai;
          proccess(
            productt.product.productDetails,
            productt.product.shop.shopId
          );
          sethtmlString(productt.product.moTa);
          let a = productt.product.productDetails;
          let minPrice = a[0].giaBan;
          let maxPrice = a[0].giaBan;

          for (let i = 1; i < a.length; i++) {
            if (a[i].giaBan < minPrice) {
              minPrice = a[i].giaBan;
            }
            if (a[i].giaBan > maxPrice) {
              maxPrice = a[i].giaBan;
            }
            productt.product.minPrice = minPrice;
            productt.product.maxPrice = maxPrice;
          }
          const map = v.data.product.productDetails.reduce((acc, item) => {
            const key = item.kichThuoc.id;
            if (!acc.has(key)) {
              acc.set(key, {
                kichThuoc: item.kichThuoc,
                productDetails: [],
              });
            }
            acc.get(key).productDetails.push(item);
            return acc;
          }, new Map());
          productt.product.productDetails = map;
          setProductDetails(map.values().next().value.productDetails);
        }
      })
      .catch((error) => alert(error));
    getVoucherByProduct();
    getIsFFavorite();
  }, []);
  const [filter, setFilter] = useState({
    page: 0,
    numPage: 0,
  });

  const getIsFFavorite = () => {
    apiUser
      .get("/product/isfavorite/" + id)
      .then((v) => v.data)
      .then((v) => {
        setIsFavotite(v.data);
      });
  };
  const getReview = () => {
    api
      .post(
        "/danhgia/getbyproductid?page=" + filter.page,
        [...Array.from(productMap.keys())],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((v) => v.data)
      .then((vv) => {
        vv.content.forEach((v) => {
          v.productCate = productMap.get(v.productId);
        });
        filter.numPage = vv.totalPages;
        setReviews(vv.content);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  useEffect(() => {
    getReview();
  }, [flag]);
  const [cart, setCart] = useState({
    product: {},
    soLuong: 1,
  });

  return (
    <>
      <section className="flat-spacing-4 pt_0">
        <div className="tf-main-product section-image-zoom">
          <div className="container bg-white">
            <div className="row">
              <div className="col-md-6">
                <div className="tf-product-media-wrap sticky-top">
                  <div className="thumbs-slider">
                    <div className="swiper tf-product-media-thumbs other-image-zoom">
                      <div className="stagger-wrap">
                        {productt.product != null &&
                          productt.product.video != null && (
                            <div
                              key={0}
                              className="swiper-slide stagger-item stagger-finished"
                            >
                              <div
                                className="item"
                                onClick={() => handleThumbnailClick(0)}
                              >
                                <video
                                  controls
                                  src={
                                    productt.product != null
                                      ? productt.product.video
                                      : ""
                                  } // Nếu `imgSrc.hinhAnh` là đường dẫn đến video
                                  alt={`Video ${0 + 1}`} // Không bắt buộc, dùng như mô tả
                                  style={{ width: "100%", maxHeight: "230px" }} // Thêm CSS tùy chỉnh
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            </div>
                          )}
                        {productt.product.productImages.map((imgSrc, index) => (
                          <div
                            key={index + 1}
                            className="swiper-slide stagger-item stagger-finished"
                          >
                            <div
                              className="item"
                              onClick={() => handleThumbnailClick(index + 1)}
                            >
                              <img
                                src={imgSrc.hinhAnh}
                                alt={`Thumbnail ${index + 2}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      className="swiper tf-product-media-main"
                      id="gallery-swiper-started"
                    >
                      <div className="swiper-wrapper">
                        {productt.product != null &&
                          productt.product.video != null && (
                            <div
                              key={0}
                              className="swiper-slide stagger-item stagger-finished"
                            >
                              <div
                                className="item"
                                onClick={() => handleThumbnailClick(0)}
                              >
                                <video
                                  controls
                                  autoPlay
                                  muted
                                  src={
                                    productt.product != null
                                      ? productt.product.video
                                      : "ddjdjdj"
                                  } // Nếu `imgSrc.hinhAnh` là đường dẫn đến video
                                  alt={`Video ${0 + 1}`} // Không bắt buộc, dùng như mô tả
                                  style={{ width: "100%", maxHeight: "650px" }} // Thêm CSS tùy chỉnh
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            </div>
                          )}
                        {productt.product.productImages.map((imgSrc, index) => (
                          <div key={index + 1} className="swiper-slide">
                            <a
                              target="_blank"
                              className="item"
                              data-pswp-width="770px"
                              data-pswp-height="1075px"
                            >
                              <img
                                className="tf-image-zoom lazyload"
                                data-zoom={imgSrc.hinhAnh}
                                data-src={imgSrc.hinhAnh}
                                src={imgSrc.hinhAnh}
                                alt={`Main product ${index + 2}`}
                              />
                            </a>
                          </div>
                        ))}
                      </div>
                      <div className="swiper-button-next button-style-arrow thumbs-next" />
                      <div className="swiper-button-prev button-style-arrow thumbs-prev" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="tf-product-info-wrap position-relative">
                  <div className="tf-zoom-main" />
                  <div className="tf-product-info-list other-image-zoom">
                    <div className="tf-product-info-title">
                      <h5>{productt.product.tenSanPham}</h5>
                    </div>
                    <div class="flex items-center text-gray-60 mt-2">
                      <AiOutlineProduct
                        size={20}
                        className="mr-2 text-red-400"
                      />
                      <span class="font-medium">Danh mục:</span>
                      <span class="ml-2 font-semibold text-gray-800 mr-2">
                        {productt.product.category.tenLoai}
                      </span>
                      {"|"}
                      <MdBrandingWatermark
                        size={20}
                        className="mx-2 text-blue-400"
                      />
                      <span class="font-medium">Thương hiệu:</span>
                      <div class="ml-2 text-gray-800">
                        <p className="font-semibold">
                          {productt.product.thuongHieu.tenMau}
                        </p>
                      </div>
                    </div>
                    <div className="tf-product-info-badges">
                      <div className="">
                        <div className="hidden">
                          <Rating
                            name="half-rating-read"
                            defaultValue={dataFill["6"] / dataFill["7"]}
                            size="small"
                            precision={0.5}
                          />
                        </div>
                        <Rating
                          name="half-rating-read"
                          value={
                            dataFill["7"] > 0
                              ? dataFill["6"] / dataFill["7"]
                              : 0
                          }
                          precision={0.5}
                          readOnly
                        />
                      </div>
                      <div className="product-status-content">
                        <i className="icon-lightning" />
                        <p className="fw-6">{dataFill["7"]} Đánh Giá</p>
                      </div>
                      <div className="product-status-content">
                        <p className="fw-6">
                          {productt.product.soLuongDaban} Đã bán
                        </p>
                      </div>
                    </div>
                    <div className="tf-product-info-price">
                      <div className="price-on-sale">
                        {cart.product.id !== undefined ? (
                          formatToVND(cart.product.giaBan)
                        ) : productt.product.minPrice ===
                          productt.product.maxPrice ? (
                          formatToVND(productt.product.minPrice)
                        ) : (
                          <>
                            {formatToVND(productt.product.minPrice)} -
                            {formatToVND(productt.product.maxPrice)}
                          </>
                        )}
                      </div>
                      <div className="badges-on-sale">
                        <span>
                          {productt.khuyenMai &&
                          productt.khuyenMai.giaTriKhuyenMai > 0
                            ? productt.product.minPrice !==
                              productt.product.maxPrice
                              ? `${formatToVND(
                                  (1 -
                                    productt.khuyenMai.giaTriKhuyenMai / 100) *
                                    productt.product.minPrice
                                )} - ${formatToVND(
                                  (1 -
                                    productt.khuyenMai.giaTriKhuyenMai / 100) *
                                    productt.product.maxPrice
                                )}`
                              : formatToVND(
                                  (1 -
                                    productt.khuyenMai.giaTriKhuyenMai / 100) *
                                    productt.product.maxPrice
                                )
                            : null}
                        </span>
                      </div>
                    </div>
                    <div className="tf-product-info-liveview">
                      <div>Mã giảm giá của shop</div>
                      {vouchers.map((item, index) => {
                        return (
                          <div className="icon-sale p-1">
                            <img
                              src={"/assets/client/images/IconGiamGia39k.svg"}
                            />
                            <p className="fw-4 text-sm text-white text-sale-icon">
                              Giảm {item.giaTriGiam}{" "}
                              {item.loaiVoucher == 1 ? "%" : "đ"}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="tf-product-info-variant-picker">
                      <div className="variant-picker-item">
                        <div className="variant-picker-label">Phân loại:</div>
                        <div className="color-picker">
                          {productt.product != null &&
                            [...productt.product.productDetails.values()].map(
                              (value, index) => (
                                <>
                                  <label
                                    onClick={() => {
                                      setProductDetails(value.productDetails);
                                      setFlag(flag + 1);
                                    }}
                                    className="color-rectangle"
                                    htmlFor={value.kichThuoc.tenKichThuoc}
                                  >
                                    <span className="color-image"></span>
                                    <span className="color-name">
                                      {value.kichThuoc.tenKichThuoc}
                                    </span>
                                  </label>
                                </>
                              )
                            )}
                        </div>
                      </div>

                      <div className="variant-picker-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="variant-picker-label">Tùy chọn:</div>
                        </div>
                        <div className="variant-picker-values">
                          {productDetails.map((mauSac, i) => (
                            <div key={i}>
                              <input
                                type="radio"
                                name="option"
                                id={mauSac.id}
                                onChange={() => {
                                  cart.product = mauSac;
                                  setFlag(flag + 1);
                                }}
                                checked={cart.product.id === mauSac.id}
                              />
                              <label
                                className="style-text p-4 flex align-items-center"
                                htmlFor={mauSac.id}
                              >
                                <img
                                  className="mr-1"
                                  style={{ width: "30px" }}
                                  src={mauSac.hinhAnh}
                                />
                                <p>
                                  {mauSac.mauSac.tenMau} -{" "}
                                  {mauSac.kichThuoc.tenKichThuoc}
                                </p>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="tf-product-info-quantity">
                      <div className="quantity-title fw-6 flex">Số lượng</div>
                      <div className="flex align-items-center">
                        <div className="wg-quantity">
                          <span
                            className="btn-quantity plus-btn"
                            onClick={() => {
                              if (cart.soLuong > 1) {
                                cart.soLuong -= 1;
                                setFlag(flag + 1);
                              }
                            }}
                          >
                            -
                          </span>
                          <input
                            onChange={(e) => {
                              let a = e.target.value;
                              if (a > 0) {
                                cart.soLuong = e.target.value;
                                setFlag(flag + 1);
                              }
                            }}
                            type="number"
                            value={cart.soLuong}
                          />
                          <span
                            className="btn-quantity minus-btn"
                            onClick={() => {
                              cart.soLuong += 1;
                              setFlag(flag + 1);
                            }}
                          >
                            +
                          </span>
                        </div>
                        <p className="mt-2 ml-2">
                          Còn: {cart.product.soLuong} sản phẩm
                        </p>
                      </div>
                    </div>
                    <div className="tf-product-info-buy-button">
                      <form className>
                        <a
                          onClick={() => addToCart("")}
                          className=" cursor-pointer tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn "
                        >
                          Thêm vào giỏ hàng
                        </a>
                        <a
                          onClick={() => addToFavorite()}
                          className="tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action"
                        >
                          <span
                            style={{ color: `${isFavorite ? "red" : ""}` }}
                            className="icon icon-heart"
                          />
                          <span className="tooltip">Add to Wishlist</span>
                          <span className="icon icon-delete" />
                        </a>
                        <a
                          href="#compare"
                          data-bs-toggle="offcanvas"
                          aria-controls="offcanvasLeft"
                          className="tf-product-btn-wishlist hover-tooltip box-icon bg_white compare btn-icon-action"
                        >
                          <span className="icon icon-share" />
                          <span className="tooltip">Add to Compare</span>
                          <span className="icon icon-check" />
                        </a>
                        <div className="w-100">
                          <span
                            onClick={() => addToCart("checkout")}
                            className="btns-full cursor-pointer"
                          >
                            Mua ngay
                          </span>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flat-spacing-5 pt_0">
        <div className="container bg-white">
          <div className="brand-row">
            <div className="brand-column">
              <div className="d-flex">
                <div>
                  <img
                    className="avatar"
                    src={
                      productt.product.shop !== undefined
                        ? productt.product.shop.hinhAnh
                        : ""
                    }
                  />
                  <p className="brand-name">
                    {productt.product.shop !== undefined
                      ? productt.product.shop.shopName
                      : ""}
                  </p>
                  <p className="online-status">{shopdt.onlineStatus}</p>
                  <div className="action-buttons">
                    <a href="#" className="btn chat-btn">
                      Chat Ngay
                    </a>
                    <Link to={`/shop/${productt.product!=null&&productt.product.shop!=undefined?productt.product.shop.shopId:1}`} className="btn shop-btn">
                      Xem Shop  
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="brand-column">
              <div className="d-flex justify-content-between p-2">
                <p>Lượt Đánh Giá </p>
                <p className="brand-info">{dataFill["9"]} lượt</p>
              </div>
              <div className="d-flex justify-content-between p-2">
                <p>Số Sản Phẩm </p>
                <p className="brand-info">{dataFill["8"]} sản phẩm</p>
              </div>
            </div>

            <div className="brand-column">
              <div className="d-flex justify-content-between p-2">
                <p>Tham Gia Vào</p>
                <p className="brand-info">
                  {productt.product.shop !== undefined
                    ? format(
                        productt.product.shop.ngayDangKy,
                        "HH:mm dd/MM/yyyy"
                      )
                    : ""}
                </p>
              </div>
              <div className="d-flex justify-content-between p-2">
                <p>Tỉ Lệ Phản Hồi</p>
                <p className="brand-info">{shopdt.responseRate}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flat-spacing-10">
        <div className="container bg-white">
          <div className="row productDT-Voucher-Shop">
            <div className="col-9">
              <div className="d-flex flex-column gap-20">
                <div>
                  <div className="lg_fs_18 fw-6 line py_15">MÔ TẢ SẢN PHẨM</div>
                  <div className="py_20 lg_py_30">
                    <div className="tf-page-privacy-policy flex justify-content-center motasanpham">
                      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container review-section">
          <div className="row">
            <div className="col-12">
              <h4>Đánh Giá Sản Phẩm</h4>
              <div className="d-flex align-items-center align-items-center">
                <span className="review-rating mr-2">
                  {dataFill["7"] > 0
                    ? (dataFill["6"] / dataFill["7"]).toFixed(2)
                    : 0}{" "}
                  trên 5
                </span>
                <Rating
                  color="yellow"
                  name="half-rating-read"
                  value={(dataFill["6"] / dataFill["7"]).toFixed(2)}
                  precision={0.5}
                  readOnly
                />

                <span className="ms-2 ml-2">({dataFill["7"]} đánh giá)</span>
              </div>
              <div className="filter-btns my-3">
                <button className="btn btn-outline-primary">
                  {" "}
                  5 sao ({dataFill["5"]}){" "}
                </button>
                <button className="btn btn-outline-primary">
                  {" "}
                  4 sao ({dataFill["4"]}){" "}
                </button>
                <button className="btn btn-outline-primary">
                  {" "}
                  3 sao ({dataFill["3"]}){" "}
                </button>
                <button className="btn btn-outline-primary">
                  {" "}
                  2 sao ({dataFill["2"]}){" "}
                </button>
                <button className="btn btn-outline-primary">
                  {" "}
                  1 sao ({dataFill["1"]}){" "}
                </button>
              </div>

              {/* Reviews */}
              {reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="d-flex">
                    <div className="review-user">
                      <img src={review.account.hinhAnh} alt="User Image" />
                    </div>
                    <div className="ms-3">
                      <strong>
                        {review.account.hoVaTen} - {review.account.soDienThoai}
                      </strong>

                      {/* Hiển thị sao từ dữ liệu JSON */}
                      <div className="">
                        <Rating
                          readOnly
                          name="size-small"
                          defaultValue={review.soSao}
                          size="small"
                        />
                      </div>

                      <p>
                        {renderDate(review.ngayDanhGia)} | Phân loại hàng:{" "}
                        <strong>{review.productCate}</strong>
                      </p>
                      <p className="mt-1">Đánh giá: {review.noiDungDanhGia}</p>
                      <p className="mt-1">Hình ảnh thực tế: </p>
                      <div className="review-images d-flex">
                        {review.chiTietDanhGias != null &&
                          review.chiTietDanhGias.map((v) => {
                            return v.type === "IMAGE" ? (
                              <img
                                src={v.link}
                                alt="product"
                                style={{ width: "80px" }}
                                className="w-16 h-16 border border-gray-300 rounded-md"
                              />
                            ) : (
                              <video
                                src={v.link}
                                style={{ width: "80px" }}
                                controls
                                autoPlay
                                muted
                                loop
                                className="w-16 h-16 border border-gray-300 rounded-md"
                              />
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  {/* Phản hồi của người bán */}
                  <p className="Shop-Feedback">
                    <strong>Phản Hồi Của Người Bán</strong>:{" "}
                    {review.shopPhanHoi}
                  </p>
                </div>
              ))}

              <nav aria-label="Page navigation">
                <Stack spacing={4}>
                  <Pagination
                    onChange={(event, value) => {
                      filter.page = value - 1;
                      getReview();
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
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="flat-spacing-1 pt_0">
        <div className="container">
          <div className="flat-title">
            {/* <span className="title">CÁC SẢN PHẨM KHÁC CỦA SHOP</span> */}
          </div>
          <div className="hover-sw-nav hover-sw-2">
            <div
              className="swiper tf-sw-product-sell wrap-sw-over"
              data-preview={6}
              data-tablet={6}
              data-mobile={4}
              data-space-lg={30}
              data-space-md={15}
              data-pagination={2}
              data-pagination-md={6}
              data-pagination-lg={6}
            >
              <div className="swiper-wrapper"></div>
            </div>
            <div className="nav-sw nav-next-slider nav-next-product box-icon w_46 round">
              <span className="icon icon-arrow-left" />
            </div>
            <div className="nav-sw nav-prev-slider nav-prev-product box-icon w_46 round">
              <span className="icon icon-arrow-right" />
            </div>
            <div className="sw-dots style-2 sw-pagination-product justify-content-center" />
          </div>
        </div>
      </section>

      <section className="flat-spacing-4 pt_0">
        <div className="container">
          <div className="flat-title">
            {/* <span className="title">CÓ THỂ BẠN CŨNG THÍCH</span> */}
          </div>
          <div className="hover-sw-nav hover-sw-2">
            <div
              className="swiper tf-sw-recent wrap-sw-over"
              data-preview={6}
              data-tablet={6}
              data-mobile={4}
              data-space-lg={30}
              data-space-md={30}
              data-space={15}
              data-pagination={1}
              data-pagination-md={1}
              data-pagination-lg={1}
            >
              <div className="swiper-wrapper">
                {/* Lặp qua các sản phẩm để tạo các slide */}
                {/* {products.map((product) => (
                  <div className="swiper-slide" key={product.id} lazy="true">
                    <div className="card-product">
                      <div className="card-product-wrapper">
                        <div className="card-item">
                          <img src={product.image} alt={product.name} />
                          <div className="product-content">
                            <p>{product.name}</p>
                            <span>{product.price}</span>
                            <label>
                              <p>{product.oldPrice}</p>
                              <p>{product.discount}</p>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>
            <div className="nav-sw nav-next-slider nav-next-recent box-icon w_46 round">
              <span className="icon icon-arrow-left" />
            </div>
            <div className="nav-sw nav-prev-slider nav-prev-recent box-icon w_46 round">
              <span className="icon icon-arrow-right" />
            </div>
            <div className="sw-dots style-2 sw-pagination-recent justify-content-center" />
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailProduct;
