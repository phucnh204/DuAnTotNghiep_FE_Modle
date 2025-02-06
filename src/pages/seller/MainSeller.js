import { Link, Outlet } from "react-router-dom";
import Header from "./Header";
// import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { RiBillLine } from "react-icons/ri";
import { AiOutlineProduct } from "react-icons/ai";
import { SiMakerbot } from "react-icons/si";
// import KhuyenMaiView from "./KhuyenMai/KhuyenMaiView";
import { FaStore } from "react-icons/fa";
import { DiDatabase } from "react-icons/di";


import React from 'react';
import { FcRating, FcRatings } from "react-icons/fc";
// import styled from 'styled-components';

const MainSeller = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleAccordion = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      <Header />
      <div className="flex  bg-gray-100">
        {/* Sidebar */}
        <div style={{ borderRadius: "0 25px 0 0" ,height:"640px"}} 
        className={`bg-white p-3  border-r-2 border-gray-300 relative transition-all duration-500 ${
            isOpen ? "w-4/12 sm:w-4/12 lg:w-1/6" : "w-1/12 sm:w-3/12 lg:w-1/12" }`} 
        >
          {isOpen ? (
            <>
              <img
                style={{ width: "30px", display: "inline-block", marginRight: "2px" }}
                src="https://cf.shopee.vn/file/6b1ffcde1ff12621088110f419a5283a"
                alt="Sidebar Icon"
              />
              LOGO
            </>
          ) : null}

          <div
            onClick={toggleSidebar}
            style={{ backgroundColor: "white", zIndex: "999" }}
            className="text-white rounded-full absolute top-5 -right-4 cursor-pointer"
          >
            <span
              onClick={toggleSidebar}
              style={{ width: "10px", height: "10px", fontSize: "5px" }}
              className="text-center relative inline-flex items-center px-3 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-full hover:text-white group hover:bg-gray-50"
            >
              <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
              <span className="absolute right-0 text-center flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </span>
          </div>

          {/* Accordion Section */}
          <div className="mt-6 space-y-4" style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
          
            <div className="accordion-item hover:bg-gray-50 text-black rounded-md transition ease-in-out duration-150 hover:bg-indigo-50 hover:scale-105 transform">
              <button
                className="w-full flex justify-between items-center p-3"
                onClick={() => toggleAccordion(1)}
              >
                <div className="flex items-center text-center">
                  <RiBillLine color="blue" className="mr-2" />
                  {isOpen && <span className="text-sm font-semibold text-black-600">Hóa đơn</span>}
                </div>
                {isOpen && (
                  <svg
                    color="gray"
                    className={`w-5 h-5 transition-transform duration-300 ${
                      expandedItem === 1 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
              <div
                className={`mt-2 overflow-hidden transition-max-height duration-500 ${
                  expandedItem === 1 ? "max-h-40" : "max-h-0"
                }`}
              >
                {isOpen && (
                  <>
                    <Link to={"/seller/order"} style={{textDecoration:"none"}}><span className="block px-4 py-2 text-xs">Hóa đơn </span></Link>
                    <Link to={"/seller/dashboard"} style={{textDecoration:"none"}}><span className="block px-4 py-2 text-xs">Tổng quan </span></Link>
                  </>
                )}
              </div>
            </div>

            <div className="accordion-item hover:bg-gray-50 text-black rounded-md transition ease-in-out duration-150 hover:bg-indigo-50 hover:scale-105 transform">
              <button
                className="w-full flex justify-between items-center p-3"
                onClick={() => toggleAccordion(2)}
              >
                <div className="flex items-center">
                  <AiOutlineProduct color="blue" className="mr-2" />
                  {isOpen && <span className="text-sm font-semibold text-black-600">Sản phẩm</span>}
                </div>
                {isOpen && (
                  <svg
                    color="gray"
                    className={`w-5 h-5 transition-transform duration-300 ${
                      expandedItem === 2 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
              <div
                className={`mt-2 overflow-hidden transition-max-height duration-500 ${
                  expandedItem === 2 ? "max-h-40" : "max-h-0"
                }`}
              >
                {isOpen && (
                  <>
                    <Link to={"/seller/product"} style={{textDecoration:"none"}}><span className="block px-4 py-2 text-xs">Sản phẩm </span></Link>
                    <Link to={"/seller/newproduct"} style={{textDecoration:"none"}}><span className="block px-4 py-2 text-xs">Thêm sản phẩm </span></Link>
                  </>
                )}
              </div>
            </div>

            <div className="accordion-item hover:bg-gray-50 text-black rounded-md transition ease-in-out duration-150 hover:bg-indigo-50 hover:scale-105 transform">
              <button
                className="w-full flex justify-between items-center p-3"
                onClick={() => toggleAccordion(3)}
              >
                <div className="flex items-center">
                  <SiMakerbot color="blue" className="mr-2" />
                  {isOpen && (
                    <span className="text-sm font-semibold text-black-600">Khuyến mãi</span>
                  )}
                </div>
                {isOpen && (
                  <svg
                    color="gray"
                    className={`w-5 h-5 transition-transform duration-300 ${
                      expandedItem === 3 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
              <div
                className={`mt-2 overflow-hidden transition-max-height duration-500 ${
                  expandedItem === 3 ? "max-h-40" : "max-h-0"
                }`}
              >
                {isOpen && (
                  <>
                    <Link to={"/seller/khuyenmai"} style={{textDecoration:"none"}}><span className="block px-4 py-2 text-xs">Khuyến mãi </span></Link>
                    <Link to={"/seller/newkhuyenmai"} style={{textDecoration:"none"}}><span className="block px-4 py-2 text-xs">Thêm khuyến mãi </span></Link>
                  </>
                )}
              </div>
            </div>

            <div className="accordion-item hover:bg-gray-50 text-black rounded-md transition ease-in-out duration-150 hover:bg-indigo-50 hover:scale-105 transform">
              <button
                className="w-full flex justify-between items-center p-3"
                onClick={() => toggleAccordion(4)}
              >
                <div className="flex items-center">
                  <DiDatabase color="blue" className="mr-2" />
                  {isOpen && (
                    <span className="text-sm font-semibold text-black-600">Voucher</span>
                  )}
                </div>
                {isOpen && (
                  <svg
                    color="gray"
                    className={`w-5 h-5 transition-transform duration-300 ${
                      expandedItem === 4 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
              <div
                className={`mt-2 overflow-hidden transition-max-height duration-500 ${
                  expandedItem === 4 ? "max-h-40" : "max-h-0"
                }`}
              >
                {isOpen && (
                  <>
                    <Link to={"/seller/voucher/0"} style={{textDecoration:"none"}}><span className="block px-4 py-2 text-xs">Voucher</span></Link>
                    <Link to={"/seller/newvoucher/"} style={{textDecoration:"none"}}><span className="block px-4 py-2 text-xs">Thêm voucher</span></Link>
                  </>
                )}
              </div>
            </div>
            <div className="accordion-item hover:bg-gray-50 text-black rounded-md transition ease-in-out duration-150 hover:bg-indigo-50 hover:scale-105 transform">
              <button
                className="w-full flex justify-between items-center p-3"
                onClick={() => toggleAccordion(5)}
              >
                <div className="flex items-center">
                  <FcRatings color="blue" className="mr-2" />
                  {isOpen && <Link to={"/seller/review"} className="text-sm font-semibold text-black-600">Đánh giá</Link>}
                </div>
                {isOpen && (
                  <svg
                    color="gray"
                    className={`w-5 h-5 transition-transform duration-300 ${
                      expandedItem === 2 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
              
            </div>
            <div className="accordion-item hover:bg-gray-50 text-black rounded-md transition ease-in-out duration-150 hover:bg-indigo-50 hover:scale-105 transform">
              <button
                className="w-full flex justify-between items-center p-3"
                onClick={() => toggleAccordion(10)}
              >
                <div className="flex items-center">
                  <FaStore color="blue" className="mr-2" />
                  {isOpen && (
                    <span className="text-sm font-semibold text-black-600">Shop của bạn</span>
                  )}
                </div>
                
              </button>
              <div
                className={`mt-2 overflow-hidden transition-max-height duration-500 ${
                  expandedItem === 4 ? "max-h-40" : "max-h-0"
                }`}
              >
              </div>
            </div>

          </div>
        </div>

        {/* Main content */}
        <div  style={{height:"640px"}}
        // style={{overflow:"scroll"}}
          className={`md:overflow-scroll ml-0 flex-grow h-full transition-all duration-500 ${
            isOpen ? "w-8/12 sm:w-8/12 lg:w-5/6" : "w-11/12 sm:w-9/12 lg:w-11/12"
          }`}
        >
        <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default MainSeller;
