import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles.css";

import "../../assets/client/css/swiper-bundle.min.css"; // Import CSS cho Swiper
import "../../assets/client/css/animate.css";
// import categories from "../../data/json/category.json";
// import saleProducts from "../../data/json/saleProducts.json"; // Giả sử file JSON ở cùng thư mục
import "../../assets/client/fonts/font-icons.css";
import "../../assets/client/fonts/fonts.css";
import Cookies from "js-cookie";
import { Link } from "react-router-dom"; // Thêm import này
import $ from "jquery";
window.jQuery = $;

const TopFavorite = () => {
  const [productDataAll, setProductDataAll] = useState([]);
  const [visibleCount, setVisibleCount] = useState(18); // Số sản phẩm hiển thị ban đầu
  useEffect(() => {
    const fetchProductDataAll = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/home/get50FavoriteProduct"
        );

        const result = response.data;

        if (result.status === 200 && result.data) {
          const { listProduct } = result.data;

          // Cập nhật danh sách sản phẩm cho productDataAll
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
  }, []); // Chạy khi component mount
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6); // Tăng số sản phẩm hiển thị thêm 3
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
      userId = parsedUserInfo.id; // Lấy ID từ thông tin người dùng
    } catch (error) {
      console.error("Không thể phân tích cookie userInfo:", error);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/viewedcategories/add",
        null, // Không gửi body, chỉ sử dụng query params
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
    return oldPrice.toString().length > 12; // Nếu số ký tự > 11 (dài hơn 8,000,000,000)
  };
  const hasMoreProducts = visibleCount < productDataAll.length;
  return (
    <>
      <section className="flat-spacing-2 pt_0 flat-seller">
        <div className="container mt-2">
          <div className="heading-product d-flex justify-center">
            <h2>
              Top <span class="highlight">60</span> sản phẩm được yêu thích nhất
              <span class="heart">❤</span>
            </h2>
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
      </section>
    </>
  );
};

export default TopFavorite;
