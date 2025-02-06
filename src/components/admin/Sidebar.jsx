import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUserTie,
  faUsers,
  faBoxOpen,
  faFileInvoice,
  faClipboard,
  faThList,
  faTags,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>MODEL WORLD</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="sidebar-item">
            <Link to="/admin" className="sidebar-link">
              <FontAwesomeIcon icon={faChartLine} />
              <span>Tổng Quan</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/admin/sellers" className="sidebar-link">
              <FontAwesomeIcon icon={faUserTie} />
              <span>Người Bán</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/admin/users" className="sidebar-link">
              <FontAwesomeIcon icon={faUsers} />
              <span>Người Dùng</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/admin/products" className="sidebar-link">
              <FontAwesomeIcon icon={faBoxOpen} />
              <span>Sản Phẩm</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/admin/invoices" className="sidebar-link">
              <FontAwesomeIcon icon={faFileInvoice} />
              <span>Hóa Đơn</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/admin/content" className="sidebar-link">
              <FontAwesomeIcon icon={faClipboard} />
              <span>Nội Dung</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/admin/categories" className="sidebar-link">
              <FontAwesomeIcon icon={faThList} />
              <span>Danh Mục</span>
            </Link>
          </li>
          {/* <li className="sidebar-item">
            <Link to="/admin/voucher" className="sidebar-link">
              <FontAwesomeIcon icon={faTags} />
              <span>Khuyến Mãi</span>
            </Link>
          </li> */}
          <li className="sidebar-item">
            <Link to="/admin/statistics" className="sidebar-link">
              <FontAwesomeIcon icon={faChartPie} />
              <span>Thống Kê</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
