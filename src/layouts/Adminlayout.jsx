import React, { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";
// import Footer from "../components/";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout-wrapper">
      <div className="layout-container">
        {/* Sidebar bên trái */}
        <Sidebar isOpen={isSidebarOpen} />
        {/* Phần bên phải chứa Navbar và Content */}
        <div className="layout-main">
          {/* Navbar nằm dưới Sidebar */}
          {/* <Navbar onToggleSidebar={toggleSidebar} /> */}
          <div className="page-wrapper">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
