import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles.css";
import Swiper from "../../assets/client/js/swiper-bundle.min.js"; // Import Swiper
import "../../assets/client/css/swiper-bundle.min.css"; // Import CSS cho Swiper
import "../../assets/client/css/animate.css";
// import categories from "../../data/json/category.json";
// import saleProducts from "../../data/json/saleProducts.json"; // Giả sử file JSON ở cùng thư mục
import "../../assets/client/fonts/font-icons.css";
import "../../assets/client/fonts/fonts.css";
import Cookies from "js-cookie";
import { Link } from "react-router-dom"; // Thêm import này
import $ from "jquery";
import ClientChat from "./Chat/ClientChat.jsx";
window.jQuery = $;

const HomePage = () => {
  const [swiperImages, setSwiperImages] = useState([]);
  const [otherImages, setOtherImages] = useState({
    image1: null,
    image2: null,
  });
  const [categoryData, setCategoryData] = useState([]); // Dữ liệu danh mục
  const [productData, setProductData] = useState([]); // Dữ liệu sản phẩm
  const [visibleCount, setVisibleCount] = useState(6); // Số sản phẩm hiển thị ban đầu
  const [productDataAll, setProductDataAll] = useState([]); // Dữ liệu sản phẩm tất cả
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showChat, setShowChat] = useState(false);
  const toggleChat = () => {
    setShowChat(!showChat);
  };

  // const socket = io("http://localhost:3000/chat");

  // const createConversation = <as></as>ync () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/chat/create-conversation",
  //       {
  //         accountId: "PhucVan",
  //         shopId: "Baby Tree",
  //       }
  //     );

  //     socket.emit("newConversation", response.data);
  //   } catch (error) {
  //     console.error("Error creating conversation:", error);
  //   } finally {
  //     setShowChat(true);
  //   }
  // };
  const flashSaleEndTime = new Date("2024-12-01T23:59:59");

  const fetchImages = () => {
    console.log("Fetching images...");
    axios
      .get("http://localhost:8080/getBannerSwipper")
      .then((response) => {
        console.log("Fetched data:", response.data);
        if (response.data.status === 200) {
          const data = response.data.data;
          setSwiperImages(data.swiperImages.map((img) => img.imageUrl));
          setOtherImages({
            image1: data.otherImages[0]?.imageUrl || null,
            image2: data.otherImages[1]?.imageUrl || null,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  };

  useEffect(() => {
    const fetchProductData = async () => {
      const userInfo = Cookies.get("userInfo");
      let response = null;

      try {
        if (userInfo) {
          const parsedUserInfo = JSON.parse(userInfo);
          const userId = parsedUserInfo.id;

          response = await axios.get(
            `http://localhost:8080/home/getProducLoginIn?userId=${userId}`
          );
        } else {
          response = await axios.get(
            "http://localhost:8080/home/getProductOnHome"
          );
        }

        const result = response.data;

        if (result.status === 200 && result.data) {
          const { listProduct, listCategory } = result.data;

          const products = listProduct.map((product) => ({
            id: product[0],
            name: product[1],
            image: product[2],
            price: product[4],
            oldPrice: product[3],
            discount: product[5],
            sold: product[6],
            cate: product[7],
          }));
          setProductData(products);

          const categories = listCategory.map((category) => ({
            id: category[0],
            name: category[1],
            image: category[2],
          }));
          setCategoryData(categories);
        } else {
          console.log("Không có dữ liệu");
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };
    fetchImages();
    fetchProductData();
  }, []);

  useEffect(() => {
    const fetchProductDataAll = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/home/getProductOnHome"
        );

        const result = response.data;

        if (result.status === 200 && result.data) {
          const { listProduct } = result.data;

          const products = listProduct.map((product) => ({
            id: product[0],
            name: product[1],
            image: product[2],
            price: product[4],
            oldPrice: product[3],
            discount: product[5],
            sold: product[6],
            cate: product[7],
          }));
          setProductDataAll(products);
        } else {
          console.log("Không có dữ liệu");
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchProductDataAll();
  }, []);

  useEffect(() => {
    const initCarousels = () => {
      $(".category-carousel").owlCarousel("destroy").removeClass("owl-loaded");

      $(".category-carousel").owlCarousel({
        loop: true,
        margin: 26,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 4 },
          576: { items: 5 },
          768: { items: 7 },
          992: { items: 7 },
          1200: { items: 7 },
          1440: { items: 9 },
        },
      });

      $(".sale-carousel").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 2 },
          576: { items: 3 },
          768: { items: 4 },
          992: { items: 4 },
          1200: { items: 5 },
          1440: { items: 6 },
        },
      });

      $(".slide-carousel").owlCarousel({
        loop: false,
        margin: 26,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
          0: { items: 1 },
          576: { items: 1 },
          768: { items: 1 },
          992: { items: 1 },
          1200: { items: 1 },
          1440: { items: 1 },
        },
      });
    };

    if (categoryData.length > 0) {
      initCarousels();
    }

    const swiper = new Swiper(".tf-sw-slideshow", {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
      autoplay: false,
      speed: 1000,
      pagination: {
        el: ".sw-pagination-slider",
        clickable: true,
      },
      lazy: true,
      on: {
        slideChange: function () {
          const activeIndex = this.realIndex;
          console.log("Slide changed to: ", activeIndex);
        },
      },
    });

    return () => {
      $(".category-carousel").owlCarousel("destroy");
    };
  }, [categoryData]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = flashSaleEndTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  const handleProductClick = async (productId, categoryId) => {
    const userInfo = Cookies.get("userInfo");
    if (!userInfo) {
      console.error("User not logged in");
      return;
    }

    let userId = "";
    try {
      const parsedUserInfo = JSON.parse(userInfo);
      userId = parsedUserInfo.id;
    } catch (error) {
      console.error("Không thể phân tích cookie userInfo:", error);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/viewedcategories/add",
        null,
        {
          params: {
            userId: userId,
            categoryId: categoryId,
            productId: productId,
            viewedAt: new Date().toISOString(),
          },
        }
      );

      if (response.data.status === 200) {
        console.log("Dữ liệu đã được lưu vào bảng viewedcategories");
      } else {
        console.error("Lỗi khi lưu dữ liệu:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    }
  };

  const formatSold = (sold) => {
    if (sold >= 1000) {
      return `${(sold / 1000).toFixed(1)}k`.replace(".0", "");
    }
    return sold;
  };

  const shouldBreakLine = (oldPrice) => {
    return oldPrice.toString().length > 12;
  };

  const hasMoreProducts = visibleCount < productData.length;
  return (
    <>
      <div className="container">
        <div className="row mt-3 demo-slides">
          <div className="col-lg-7">
            <div className="tf-slideshow slider-radius slider-effect-fade position-relative">
              <div className="swiper tf-sw-slideshow">
                <div className="swiper-wrapper">
                  {swiperImages.length > 0 ? (
                    swiperImages.map((src, index) => (
                      <div className="swiper-slide" key={index}>
                        <div className="wrap-slider">
                          <img
                            className="lazyload"
                            src={src}
                            alt={`swiper-slide-${index}`}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center">No images uploaded</p>
                  )}
                </div>
              </div>
              <div className="wrap-pagination">
                <div className="container">
                  <div className="sw-dots line-white-pagination sw-pagination-slider justify-content-center"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 cot-phai">
            {otherImages.image1 && (
              <img
                src={otherImages.image1}
                alt="Other Image 1"
                className="img-fluid mb-3"
              />
            )}
            {otherImages.image2 && (
              <img
                src={otherImages.image2}
                alt="Other Image 2"
                className="img-fluid mb-3"
              />
            )}
          </div>
        </div>
      </div>

      <section className="sec-banner">
        <div className="container subBanner">
          <div className="grid grid-cols-12 subBanner-item">
            <div className="col-span-3">
              <div className="subBanner-item-top">
                <img src="/assets/client/images/icon/Voucher.svg" alt />
                <h1>Vouchers</h1>
              </div>
              <div className="subBanner-item-bottom">
                <p>Vouchers</p>
              </div>
            </div>
            <div className="col-span-3">
              <a href="/favoriteProduct">
                <div className="subBanner-item-top">
                  <img src="/assets/client/images/icon/Tym.svg" alt />
                  <h1>Top yêu Thích</h1>
                </div>
                <div className="subBanner-item-bottom">
                  <p>Top Yêu Thích</p>
                </div>
              </a>
            </div>
            <div className="col-span-3">
              <div className="subBanner-item-top">
                <img src="/assets/client/images/icon/Live.svg" alt />
                <h1>LiveStream</h1>
              </div>
              <div className="subBanner-item-bottom">
                <p>LiveStream</p>
              </div>
            </div>
            <div className="col-span-3">
              <a href="/PromotionalProducts">
                <div className="subBanner-item-top">
                  <img src="/assets/client/images/icon/Sale.svg" alt />
                  <h1>Khuyến mãi</h1>
                </div>
                <div className="subBanner-item-bottom">
                  <p>Khuyến mãi</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="list-category">
        <div className="container">
          <div className="headpd">
            <h2>Danh mục</h2>
          </div>
          <div className="category-carousel owl-carousel owl-theme">
            {categoryData.map((category) => (
              <div className="category-item" key={category.id}>
                <div className="category-item__content">
                  <div className="category-left">
                    <a
                      href={
                        `/home/find/` +
                        ` ` +
                        `?sortBy=best_selling&theLoaiIds=${category.id}`
                      }
                    >
                      <img src={category.image} alt={category.name} />
                      <p>{category.name}</p>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="list-sale">
        <div className="container">
          <div className="heading-product">
            <h2>Sản phẩm dành cho bạn</h2>
          </div>
          <div className="sale-carousel owl-carousel owl-theme">
            {productData.map((product) => (
              <div className="card-product" key={product.id}>
                <div className="card-product-wrapper">
                  {/* Thay đổi từ <a> thành <Link> */}
                  <Link
                    to={`/product/${product.id}`}
                    className="product-img"
                    onClick={() => handleProductClick(product.id, product.cate)}
                  >
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
                        <label
                          className={`footer-card-product ${
                            shouldBreakLine(product.oldPrice)
                              ? "break-line"
                              : ""
                          }`}
                        >
                          <span>{product.price.toLocaleString()}đ</span>
                          <p>đã bán: {formatSold(product.sold)}</p>
                        </label>
                      </>
                    ) : (
                      // Nếu giá mới là null, hiển thị giá cũ làm giá mới
                      <>
                        <label className="h-7" />
                        <label
                          className={`footer-card-product ${
                            shouldBreakLine(product.oldPrice)
                              ? "break-line"
                              : ""
                          }`}
                        >
                          <span>{product.oldPrice.toLocaleString()}đ</span>
                          <p>đã bán: {formatSold(product.sold)}</p>
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

      <section className="flat-spacing-5 pt_0 flat-seller">
        <div className="container mt-5">
          <div className="heading-product d-flex justify-center">
            <h2>Gợi ý hôm nay</h2>
          </div>
          <div
            className="grid-layout wow fadeInUp mt-4"
            data-wow-delay="0s"
            data-grid="grid-6"
          >
            {productDataAll.slice(0, visibleCount).map((product) => (
              <div className="card-product" key={product.id}>
                <div className="card-product-wrapper">
                  {/* Thay đổi từ <a> thành <Link> */}
                  <Link
                    to={`/product/${product.id}`}
                    className="product-img"
                    onClick={() => handleProductClick(product.id, product.cate)}
                  >
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
                        <label
                          className={`footer-card-product ${
                            shouldBreakLine(product.oldPrice)
                              ? "break-line"
                              : ""
                          }`}
                        >
                          <span>{product.price.toLocaleString()}đ</span>
                          <p>đã bán: {formatSold(product.sold)}</p>
                        </label>
                      </>
                    ) : (
                      // Nếu giá mới là null, hiển thị giá cũ làm giá mới
                      <>
                        <label className="h-7" />
                        <label
                          className={`footer-card-product ${
                            shouldBreakLine(product.oldPrice)
                              ? "break-line"
                              : ""
                          }`}
                        >
                          <span>{product.oldPrice.toLocaleString()}đ</span>
                          <p>đã bán: {formatSold(product.sold)}</p>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasMoreProducts && (
            <div className="text-center product-buttom p-5 tf-pagination-wrap view-more-button text-center">
              <button
                onClick={handleLoadMore}
                className="buttom tf-btn-loading tf-loading-default style-2 btn-loadmore"
              >
                <span className="text">Load more</span>
              </button>
            </div>
          )}
        </div>
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
      {/* Chat Button */}
    </>
  );
};

export default HomePage;
