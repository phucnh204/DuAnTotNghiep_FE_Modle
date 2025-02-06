import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import VariableWidth from "./ToolTipCart";
import AnnounceTooltip from "./AnnounceTooltip";
import Cookies from "js-cookie";
import { Avatar } from "@mui/material";
import SwipeableTemporaryDrawer from "./CartSidebar";
const Header = () => {
  const { carts, setCarts, userInfo, setUserInfo } = useContext(AppContext);
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]); // Lưu lịch sử tìm kiếm
  const [isFocused, setIsFocused] = useState(false); // Trạng thái focus
  const [isHistoryHovered, setIsHistoryHovered] = useState(false); // Kiểm tra có hover lịch sử không

  useEffect(() => {
    // Kiểm tra thông tin đăng nhập từ cookie
    const userCookie = Cookies.get("userInfo");
    if (userCookie) {
      const user = JSON.parse(userCookie); // Parse dữ liệu từ cookie
      setLoggedInUser({
        tenTaiKhoan: user.tenTaiKhoan,
        hinhAnh: user.hinhAnh,
        vaiTro: user.vaiTro || "Thành viên", // Mặc định là "Thành viên" nếu không có vaiTro
      });
    }
  }, []);

  const logout = () => {
    setCarts(null);
    setUserInfo(null);
    setLoggedInUser(null); // Xóa trạng thái người dùng
    Cookies.remove("tokenModel");
    Cookies.remove("userInfo");
    navigate("/");
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (searchQuery.trim() !== "") {
      const userInfo = Cookies.get("userInfo");
      const parsedUserInfo = JSON.parse(userInfo);
      const id = parsedUserInfo.id;

      try {
        const response = await fetch(
          `http://localhost:8080/add/searchHistory?userId=${id}&search_term=${encodeURIComponent(
            searchQuery
          )}`,
          { method: "POST" }
        );

        if (response.ok) {
          // Thêm từ khóa vào lịch sử hiện tại
          setSearchHistory((prevHistory) => {
            const updatedHistory = [
              searchQuery,
              ...prevHistory.filter((item) => item !== searchQuery),
            ];
            return updatedHistory.slice(0, 5); // Lưu tối đa 5 từ khóa
          });
        } else {
          console.error("Failed to save search history");
        }
      } catch (error) {
        console.error("Error saving search history:", error);
      }

      navigate(`/home/find/${searchQuery}`);
      setSearchQuery("");
    }
  };
  const handleHistoryClick = (keyword) => {
    setSearchQuery(keyword);
    navigate(`/home/find/${keyword}`);
  };

  const handleDeleteHistory = async (keyword, event) => {
    event.stopPropagation(); // Ngăn sự kiện lan lên phần tử cha

    const userInfo = Cookies.get("userInfo");
    if (!userInfo) return;

    const parsedUserInfo = JSON.parse(userInfo);
    const id = parsedUserInfo.id;

    try {
      const response = await fetch(
        `http://localhost:8080/delete/searchHistory?userId=${id}&search_term=${encodeURIComponent(
          keyword
        )}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        // Xóa từ khóa khỏi state
        setSearchHistory((prevHistory) =>
          prevHistory.filter((item) => item !== keyword)
        );
      } else {
        console.error("Failed to delete search history");
      }
    } catch (error) {
      console.error("Error deleting search history:", error);
    }
  };

  const handleBlur = () => {
    if (!isHistoryHovered) {
      setIsFocused(false); // Ẩn lịch sử khi blur nếu không hover vào lịch sử
    }
  };

  const handleHistoryMouseEnter = () => {
    setIsHistoryHovered(true); // Khi hover vào lịch sử
  };

  const handleHistoryMouseLeave = () => {
    setIsHistoryHovered(false); // Khi rời khỏi lịch sử
  };
  const getRoleName = (role) => {
    switch (role) {
      case "NguoiDung":
        return "Khách hàng";
      case "NguoiBan":
        return "Người bán";
      case "QuanTri":
        return "Quản trị";
      default:
        return "Không rõ";
    }
  };

  // Hàm lấy màu nền theo vai trò
  const getRoleClass = (role) => {
    switch (role) {
      case "NguoiDung":
        return "bg-blue-500 text-white"; // Nền xanh
      case "NguoiBan":
        return "bg-yellow-500 text-white"; // Nền vàng
      case "QuanTri":
        return "bg-red-500 text-white"; // Nền đỏ
      default:
        return "bg-gray-500 text-white"; // Nền xám cho vai trò không xác định
    }
  };

  useEffect(() => {
    const fetchSearchHistory = async () => {
      const userInfo = Cookies.get("userInfo");
      if (!userInfo) return;

      const parsedUserInfo = JSON.parse(userInfo);
      const id = parsedUserInfo.id; // Lấy ID từ userInfo

      try {
        const response = await fetch(
          `http://localhost:8080/get/searchHistory?userId=${id}`
        );

        if (response.ok) {
          const data = await response.json();
          // Cập nhật searchHistory với các search_term từ API
          setSearchHistory(data.map((item) => item.search_term));
        } else {
          console.error("Failed to fetch search history");
        }
      } catch (error) {
        console.error("Error fetching search history:", error);
      }
    };

    fetchSearchHistory();
  }, []); // Chỉ chạy một lần khi component được mount

  return (
    <div className="modelworld">
      <header id="header" className="header-default">
        <div className="container">
          <div className="preload preload-container">
            <div className="preload-logo">
              <div className="spinner" />
            </div>
          </div>
          <div id="wrapper">
            {/* top bar */}
            <div className="tf-top-bar ">
              <div className="container-full px_15 lg-px_40">
                <div className="tf-top-bar_wrap grid-2 gap-30 align-items-center">
                  <div className="tf-top-bar_left">
                    <div className="d-flex gap-30 text_dark fw-5">
                      <a href={"http://localhost:3000/seller/dashboard"}>
                        Kênh Người bán
                      </a>
                      <Link to={"/registershop"}>Đăng ký người bán</Link>
                      <span>Kết Nối</span>
                    </div>
                  </div>
                  <div className="top-bar-language tf-cur justify-content-end">
                    <div className="d-flex align-items-center gap-30 text_dark fw-5">
                      <span>
                        <AnnounceTooltip />
                      </span>
                      <span>Hỗ Trợ</span>
                      <span>Về chúng tôi</span>
                      <span className="">
                        {userInfo != null ? (
                          <div className="inline-flex items-center space-x-2">
                            <Link to={"/client/my-account-profile"}>
                              <Avatar
                                className="inline-block"
                                alt="Remy Sharp"
                                src={loggedInUser.hinhAnh}
                              />
                            </Link>
                            <span
                              className="cursor-pointer text-blue-500 hover:text-blue-700"
                              onClick={() => logout()}
                            >
                              Đăng xuất
                            </span>
                          </div>
                        ) : (
                          <Link
                            to={"/login"}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Đăng nhập
                          </Link>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /top bar */}
            {/* header */}
            <div className="container-full px_15 lg-px_40">
              <div className="row wrapper-header align-items-center">
                <div className="col-2 col-md-2 tf-lg-hidden mobile-menu">
                  <a
                    href="#mobileMenu"
                    data-bs-toggle="offcanvas"
                    aria-controls="offcanvasLeft"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={16}
                      viewBox="0 0 24 16"
                      fill="none"
                    >
                      <path
                        d="M2.00056 2.28571H16.8577C17.1608 2.28571 17.4515 2.16531 17.6658 1.95098C17.8802 1.73665 18.0006 1.44596 18.0006 1.14286C18.0006 0.839753 17.8802 0.549063 17.6658 0.334735C17.4515 0.120408 17.1608 0 16.8577 0H2.00056C1.69745 0 1.40676 0.120408 1.19244 0.334735C0.978109 0.549063 0.857702 0.839753 0.857702 1.14286C0.857702 1.44596 0.978109 1.73665 1.19244 1.95098C1.40676 2.16531 1.69745 2.28571 2.00056 2.28571ZM0.857702 8C0.857702 7.6969 0.978109 7.40621 1.19244 7.19188C1.40676 6.97755 1.69745 6.85714 2.00056 6.85714H22.572C22.8751 6.85714 23.1658 6.97755 23.3801 7.19188C23.5944 7.40621 23.7148 7.6969 23.7148 8C23.7148 8.30311 23.5944 8.59379 23.3801 8.80812C23.1658 9.02245 22.8751 9.14286 22.572 9.14286H2.00056C1.69745 9.14286 1.40676 9.02245 1.19244 8.80812C0.978109 8.59379 0.857702 8.30311 0.857702 8ZM0.857702 14.8571C0.857702 14.554 0.978109 14.2633 1.19244 14.049C1.40676 13.8347 1.69745 13.7143 2.00056 13.7143H12.2863C12.5894 13.7143 12.8801 13.8347 13.0944 14.049C13.3087 14.2633 13.4291 14.554 13.4291 14.8571C13.4291 15.1602 13.3087 15.4509 13.0944 15.6653C12.8801 15.8796 12.5894 16 12.2863 16H2.00056C1.69745 16 1.40676 15.8796 1.19244 15.6653C0.978109 15.4509 0.857702 15.1602 0.857702 14.8571Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </div>
                <div className="col-6 col-md-4 col-6 Logo-ModelWorld">
                  <Link to={"/"} className="logo">
                    {" "}
                    MODEL WORLD{" "}
                  </Link>
                  <div className=" Find-ModelWorld2">
                    <nav className="box-navigation text-center">
                      <form
                        onSubmit={handleSearchSubmit}
                        className="relative search-container d-flex"
                      >
                        <input
                          type="search"
                          className="block find text-gray-900"
                          placeholder="Tìm kiếm ModelWorld"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setIsFocused(true)} // Hiển thị lịch sử khi focus
                          onBlur={handleBlur} // Xử lý blur hợp lý
                        />
                        <button type="submit" className="search-button p-3">
                          <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                          </svg>
                          <span className="sr-only">Search</span>
                        </button>
                     

                      {/* Hiển thị lịch sử tìm kiếm khi focus */}
                      {isFocused && searchHistory.length > 0 && (
                        <ul
                          className="history-list"
                          onMouseEnter={handleHistoryMouseEnter}
                          onMouseLeave={handleHistoryMouseLeave}
                        >
                          {searchHistory.map((item, index) => (
                            <li
                              key={index}
                              className="d-flex justify-content-between"
                              onClick={() => handleHistoryClick(item)}
                            >
                              <span className="color-black">{item}</span>
                              <button
                                onClick={(event) =>
                                  handleDeleteHistory(item, event)
                                }
                                className="delete-btn"
                              >
                                ✕
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                       </form>
                    </nav>
                  </div>
                </div>
                <div className="col-3 col-md-6 tf-md-hidden Find-ModelWorld">
                  <nav className="box-navigation text-center">
                    <form
                      onSubmit={handleSearchSubmit}
                      className="relative search-container d-flex"
                    >
                      <input
                        type="search"
                        className="block find text-gray-900"
                        placeholder="Tìm kiếm ModelWorld"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)} // Hiển thị lịch sử khi focus
                        onBlur={handleBlur} // Xử lý blur hợp lý
                      />
                      <button type="submit" className="search-button p-3">
                        <svg
                          className="w-4 h-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
                        </svg>
                        <span className="sr-only">Search</span>
                      </button>
                    

                    {/* Hiển thị lịch sử tìm kiếm khi focus */}
                    {isFocused && searchHistory.length > 0 && (
                      <ul
                        className="history-list"
                        onMouseEnter={handleHistoryMouseEnter}
                        onMouseLeave={handleHistoryMouseLeave}
                      >
                        {searchHistory.map((item, index) => (
                          <li
                            key={index}
                            className="d-flex justify-content-between"
                            onClick={() => handleHistoryClick(item)}
                          >
                            <span className="color-black">{item}</span>
                            <button
                              onClick={(event) =>
                                handleDeleteHistory(item, event)
                              }
                              className="delete-btn"
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    </form>
                  </nav>
                </div>
                <div className="col-2 col-md-2 Cart-ModelWorld">
                  <ul className="nav-icon d-flex justify-content-center align-items-center gap-20">
                    <li className="nav-cart">
                      <span className="nav-icon-item ">
                        {carts != null && (
                          <span className="count-box">{carts.length}</span>
                        )}
                        {/* <VariableWidth /> */}
                        <SwipeableTemporaryDrawer />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
        <span
          className="icon-close icon-close-popup"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
        <div className="mb-canvas-content">
          <div className="mb-body">
            {loggedInUser ? (
              <div className="card-user">
                <div className="row">
                  <div className="col-lg-12 d-flex justify-content-start">
                    <img
                      src={userInfo!=null?userInfo.hinhAnh:""}
                      alt="Avatar"
                      className="avatar"
                    />
                    <p className="fw-6 d-flex align-items-center ps-1">
                      {loggedInUser.tenTaiKhoan}
                    </p>
                    <p className="d-flex align-items-center fs-10 ms-2">
                      <a
                        className={`border rounded-pill ps-1 pe-1 ${getRoleClass(
                          loggedInUser.vaiTro
                        )}`}
                      >
                        {getRoleName(loggedInUser.vaiTro)}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-user">
                <p className="fw-6 text-center">Bạn chưa đăng nhập</p>
              </div>
            )}
            {/* Menu và các phần khác */}
            <ul className="nav-ul-mb" id="wrapper-menu-navigation">
              <li className="nav-mb-item">
                <a href="" className="mb-menu-link">
                  Thông báo
                </a>
              </li>
              <li className="nav-mb-item">
                <a href="" className="mb-menu-link">
                  Hỗ trợ
                </a>
              </li>
              <li className="nav-mb-item">
                <a href="" className="mb-menu-link">
                  Kênh người bán
                </a>
              </li>
            </ul>

            <div className="mb-other-content">
              <div className="d-flex group-icon">
                <a href="wishlist.html" className="site-nav-icon">
                  <i className="icon icon-heart" />
                  Yêu thích
                </a>
                <a href="home-search.html" className="site-nav-icon">
                  <i className="icon icon-search" />
                  Đơn hàng
                </a>
              </div>
            </div>
          </div>
          <div className="mb-bottom">
            {loggedInUser ? (
              <a
                onClick={logout}
                className="site-nav-icon"
                style={{ cursor: "pointer" }}
              >
                <i className="icon icon-account" />
                Đăng xuất
              </a>
            ) : (
              <a href="/login" className="site-nav-icon">
                <i className="icon icon-account" />
                Đăng nhập
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
