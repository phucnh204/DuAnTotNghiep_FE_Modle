import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ShopProductPage = () => {
  const { searchQuery } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [shopDetail, setShopDetail] = useState(null);
  const [filters, setFilters] = useState({
    theLoai: [],
    thuongHieu: [],
    mauSac: [],
    kichThuoc: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    theLoai: [],
    thuongHieu: [],
    mauSac: [],
    kichThuoc: [],
    priceRange: { min: null, max: null },
    sortBy: "best_selling", // Mặc định là bán chạy nhất
  });

  const sortProducts = (products, sortBy) => {
    console.log(products);
    switch (sortBy) {
      case "best_selling":
        return products.sort((a, b) => b.sold - a.sold);
      case "low_to_high":
        return products.sort((a, b) => a.oldPrice - b.oldPrice);
      case "high_to_low":
        return products.sort((a, b) => b.oldPrice - a.oldPrice);
      case "az":
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case "za":
        return products.sort((a, b) => b.name.localeCompare(a.name));
      case "newest_first":
        return products.sort((a, b) => b.id - a.id);
      case "oldest_first":
        return products.sort((a, b) => a.id - b.id);
      default:
        return products;
    }
  };

  // Hàm cập nhật selectedFilters và gọi API
  const handleFilterChange = (filterType, value, isChecked) => {
    setSelectedFilters((prevFilters) => {
      const updatedValues = isChecked
        ? [...prevFilters[filterType], value]
        : prevFilters[filterType].filter((item) => item !== value);

      const updatedFilters = {
        ...prevFilters,
        [filterType]: updatedValues,
      };
      setCurrentPage(0);
      // Cập nhật URL với thông tin bộ lọc
      const queryParams = new URLSearchParams({
        sortBy: updatedFilters.sortBy || "", // Đảm bảo có thông tin sắp xếp
        theLoaiIds: updatedFilters.theLoai.join(","),
        thuongHieuIds: updatedFilters.thuongHieu.join(","),
        mauSacIds: updatedFilters.mauSac.join(","),
        kichThuocIds: updatedFilters.kichThuoc.join(","),
        giaMin:
          updatedFilters.priceRange.min !== null
            ? updatedFilters.priceRange.min
            : 0,
        giaMax:
          updatedFilters.priceRange.max !== null
            ? updatedFilters.priceRange.max
            : 0,
      });

      // Điều hướng đến trang với các query parameters
      navigate(`/shop/${searchQuery}/product?${queryParams}`);
      return updatedFilters;
    });
  };

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sortBy = params.get("sortBy") || selectedFilters.sortBy;

      const response = await axios.get(
        `http://localhost:8080/shop/${searchQuery}/product`,
        {
          params: {
            page: currentPage,
            size: 24,
            theLoaiIds: params.get("theLoaiIds"),
            thuongHieuIds: params.get("thuongHieuIds"),
            mauSacIds: params.get("mauSacIds"),
            kichThuocIds: params.get("kichThuocIds"),
            giaMin: params.get("giaMin"),
            giaMax: params.get("giaMax"),
            sortBy: sortBy,
          },
        }
      );

      if (response.status === 200) {
        const { shopDetails, products, filters } = response.data.data;

        // Chuyển đổi shopDetails từ mảng thành đối tượng
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

        // Chuyển đổi dữ liệu sản phẩm
        const productList = products.content.map((product) => ({
          id: product[0],
          name: product[1],
          image: product[2],
          price: product[4],
          oldPrice: product[3],
          discount: product[5],
          sold: product[6],
        }));

        const sortedData = sortProducts(productList, sortBy);

        setProductData(sortedData);
        setShopDetail(shopDetail); // Lưu thông tin shop
        setTotalPages(products.totalPages);

        setFilters({
          theLoai: filters.theLoai,
          thuongHieu: filters.thuongHieu,
          mauSac: filters.mauSac,
          kichThuoc: filters.kichThuoc,
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const handlePriceChange = (e, priceType) => {
    const value = e.target.value;
    setSelectedFilters((prevFilters) => {
      const updatedPriceRange = {
        ...prevFilters.priceRange,
        [priceType]: value ? parseFloat(value) : null, // Cập nhật giá min hoặc max
      };

      const updatedFilters = {
        ...prevFilters,
        priceRange: updatedPriceRange,
      };
      setCurrentPage(0);
      // Cập nhật URL với giá min/max, kiểm tra giá trị null
      const queryParams = new URLSearchParams({
        theLoaiIds: updatedFilters.theLoai.join(","),
        thuongHieuIds: updatedFilters.thuongHieu.join(","),
        mauSacIds: updatedFilters.mauSac.join(","),
        kichThuocIds: updatedFilters.kichThuoc.join(","),
        giaMin:
          updatedFilters.priceRange.min !== null
            ? updatedFilters.priceRange.min
            : 0, // Giá trị mặc định nếu null
        giaMax:
          updatedFilters.priceRange.max !== null
            ? updatedFilters.priceRange.max
            : 0, // Giá trị mặc định nếu null
      });

      navigate(`/shop/${searchQuery}/product?${queryParams}`);
      return updatedFilters;
    });
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.getAttribute("data-sort");

    setSelectedFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        sortBy: selectedSort,
      };
      setCurrentPage(0);
      // Cập nhật URL với thông tin bộ lọc và sắp xếp
      const queryParams = new URLSearchParams({
        sortBy: updatedFilters.sortBy, // Sắp xếp
        theLoaiIds: updatedFilters.theLoai.join(","),
        thuongHieuIds: updatedFilters.thuongHieu.join(","),
        mauSacIds: updatedFilters.mauSac.join(","),
        kichThuocIds: updatedFilters.kichThuoc.join(","),
        giaMin:
          updatedFilters.priceRange.min !== null
            ? updatedFilters.priceRange.min
            : 0,
        giaMax:
          updatedFilters.priceRange.max !== null
            ? updatedFilters.priceRange.max
            : 0,
      });

      // Điều hướng đến trang với các query parameters
      navigate(`/shop/${searchQuery}/product?${queryParams}`);
      return updatedFilters;
    });
  };
  // Kết hợp fetchProducts và sortProducts trong useEffect
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, currentPage, selectedFilters]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <section className="">
        <div className="container">
          <div className="tf-shop-control grid-3 align-items-center">
            <div className="tf-control-filter">
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                aria-controls="offcanvasLeft"
                className="tf-btn-filter"
              >
                <span className="icon icon-filter" />
                <span className="text">Bộ lọc</span>
              </a>
            </div>
            <div className="tf-control-layout d-flex justify-content-center  flex-column align-items-center text-center">
              {shopDetail ? (
                <>
                  <a href={`/shop/${shopDetail.id}`}>
                    <img
                      src={
                        shopDetail.avatar
                          ? shopDetail.avatar
                          : "/assets/client/images/noimage.png"
                      }
                      alt="Profile"
                      className="rounded-circle mb-2"
                      style={{ width: 70, height: 70 }}
                    />
                  </a>
                  <h5 className="mb-0">
                    <a href={`/shop/${shopDetail.id}`}>{shopDetail.tenShop}</a>
                  </h5>
                </>
              ) : (
                <p>Đang tải thông tin shop...</p>
              )}
            </div>
            <div class="tf-control-sorting d-flex justify-content-end">
              <div class="tf-dropdown-sort" data-bs-toggle="dropdown">
                <div class="btn-select">
                  <span class="text-sort-value">Sắp xếp</span>
                  <span class="icon icon-arrow-down"></span>
                </div>
                <div className="dropdown-menu">
                  <div className="select-item">
                    <span
                      className="text-value-item"
                      data-sort="best_selling"
                      onClick={handleSortChange}
                    >
                      Bán chạy nhất
                    </span>
                  </div>
                  <div className="select-item">
                    <span
                      className="text-value-item"
                      data-sort="az"
                      onClick={handleSortChange}
                    >
                      Theo thứ tự chữ cái, A-Z
                    </span>
                  </div>
                  <div className="select-item">
                    <span
                      className="text-value-item"
                      data-sort="za"
                      onClick={handleSortChange}
                    >
                      Theo thứ tự chữ cái, Z-A
                    </span>
                  </div>
                  <div className="select-item">
                    <span
                      className="text-value-item"
                      data-sort="low_to_high"
                      onClick={handleSortChange}
                    >
                      Giá, thấp đến cao
                    </span>
                  </div>
                  <div className="select-item">
                    <span
                      className="text-value-item"
                      data-sort="high_to_low"
                      onClick={handleSortChange}
                    >
                      Giá, cao về thấp
                    </span>
                  </div>
                  <div className="select-item">
                    <span
                      className="text-value-item"
                      data-sort="newest_first"
                      onClick={handleSortChange}
                    >
                      Ngày, mới trở về cũ
                    </span>
                  </div>
                  <div className="select-item">
                    <span
                      className="text-value-item"
                      data-sort="oldest_first"
                      onClick={handleSortChange}
                    >
                      Ngày, cũ đi đến mới
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid-layout wrapper-shop" data-grid="grid-6">
            {productData.map((product) => (
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
          {/* pagination */}
          <ul className="tf-pagination-wrap tf-pagination-list">
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={currentPage === index ? "active" : ""}
                onClick={() => handlePageChange(index)}
              >
                <a href="#" className="pagination-link">
                  {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {/* Filter */}
      <div className="offcanvas offcanvas-start canvas-filter" id="filterShop">
        <div className="canvas-wrapper">
          <header className="canvas-header">
            <div className="filter-icon">
              <span className="icon icon-filter" />
              <span>Lọc sản phẩm</span>
            </div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </header>
          <div className="canvas-body">
            <form id="facet-filter-form" className="facet-filter-form">
              {/* Danh Mục */}
              <div className="widget-facet">
                <div className="facet-title">
                  <span>Danh Mục</span>
                </div>
                <ul className="tf-filter-group current-scrollbar mb_36">
                  {filters.theLoai.map((item, index) => (
                    <li
                      key={index}
                      className="list-item d-flex gap-12 align-items-center"
                    >
                      <input
                        type="checkbox"
                        name="theLoai"
                        className="tf-check"
                        id={`theLoai-${index}`}
                        onChange={(e) =>
                          handleFilterChange(
                            "theLoai",
                            item[0],
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor={`theLoai-${index}`} className="label">
                        <span>{item[1]}</span>&nbsp;
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Thương Hiệu */}
              <div className="widget-facet">
                <div className="facet-title">
                  <span>Thương Hiệu</span>
                </div>
                <ul className="tf-filter-group current-scrollbar mb_36">
                  {filters.thuongHieu.map((item, index) => (
                    <li
                      key={index}
                      className="list-item d-flex gap-12 align-items-center"
                    >
                      <input
                        type="checkbox"
                        name="thuongHieu"
                        className="tf-check"
                        id={`thuongHieu-${index}`}
                        onChange={(e) =>
                          handleFilterChange(
                            "thuongHieu",
                            item[0],
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor={`thuongHieu-${index}`} className="label">
                        <span>{item[1]}</span>&nbsp;
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="widget-facet">
                <div
                  className="facet-title"
                  data-bs-target="#price"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="price"
                >
                  <span>Giá</span>
                  <span className="icon icon-arrow-up" />
                </div>
                <div id="price" className="collapse show">
                  <div className="widget-price">
                    <div id="slider-range" />
                    <div className="box-title-price">
                      <div className="caption-price">
                        <input
                          type="number"
                          id="slider-range-value1"
                          placeholder="Từ"
                          value={selectedFilters.priceRange.min || ""}
                          onChange={(e) => handlePriceChange(e, "min")}
                          onBlur={(e) => handlePriceChange(e, "min")} // Cập nhật khi rời khỏi trường nhập liệu
                        />

                        <span>-</span>

                        <input
                          type="number"
                          id="slider-range-value2"
                          placeholder="Đến"
                          value={selectedFilters.priceRange.max || ""}
                          onChange={(e) => handlePriceChange(e, "max")}
                          onBlur={(e) => handlePriceChange(e, "max")} // Cập nhật khi rời khỏi trường nhập liệu
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Màu Sắc */}
              <div className="widget-facet">
                <div className="facet-title">
                  <span>Màu Sắc</span>
                </div>
                <ul className="tf-filter-group current-scrollbar mb_36">
                  {filters.mauSac.map((item, index) => (
                    <li
                      key={index}
                      className="list-item d-flex gap-12 align-items-center"
                    >
                      <input
                        type="checkbox"
                        name="mauSac"
                        className="tf-check"
                        id={`mauSac-${index}`}
                        onChange={(e) =>
                          handleFilterChange(
                            "mauSac",
                            item[0],
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor={`mauSac-${index}`} className="label">
                        <span>{item[1]}</span>&nbsp;
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Kích Thước */}
              <div className="widget-facet">
                <div className="facet-title">
                  <span>Kích Thước</span>
                </div>
                <ul className="tf-filter-group current-scrollbar">
                  {filters.kichThuoc.map((item, index) => (
                    <li
                      key={index}
                      className="list-item d-flex gap-12 align-items-center"
                    >
                      <input
                        type="checkbox"
                        name="kichThuoc"
                        className="tf-check"
                        id={`kichThuoc-${index}`}
                        onChange={(e) =>
                          handleFilterChange(
                            "kichThuoc",
                            item[0],
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor={`kichThuoc-${index}`} className="label">
                        <span>{item[1]}</span>&nbsp;
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* End Filter */}
    </>
  );
};

export default ShopProductPage;
