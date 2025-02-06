import React, { useState, useEffect } from 'react';
// import CUProduct from './product/CUproduct';
// import ViewProduct from './viewproduct/ViewProduct';
// import nextbutton from "../../utils/images/seller/next-button.png";
// import loading from "../../utils/images/seller/loading.gif";
// import VoucherView from './voucher/VoucherView';
// import ListVoucher from './voucher/ListVoucher';
// import KhuyenMaiView from './KhuyenMai/KhuyenMaiView';
// import CUKhuyenMai from './KhuyenMai/CUKhuyenMai';
import HoaDonView from './hoaDon/HoaDonView';
import ViewProduct from './viewproduct/ViewProduct';
import KhuyenMaiView from './KhuyenMai/KhuyenMaiView';
import CUKhuyenMai from './KhuyenMai/CUKhuyenMai';
import { RiBillLine } from 'react-icons/ri';
import { AiOutlineProduct } from 'react-icons/ai';
import { SiMakerbot } from 'react-icons/si';
import ListVoucher from './voucher/ListVoucher';

const Sidebar = () => {
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
      // Kiểm tra kích thước màn hình và cập nhật biến isOpen
      if (window.innerWidth < 640) {
        setIsOpen(false);
      } else {
        // Có thể để true nếu cần mở lại khi màn hình lớn hơn
        setIsOpen(true);
      }
    };

    // Lắng nghe sự kiện resize
    window.addEventListener('resize', handleResize);

    // Gọi hàm handleResize một lần để kiểm tra kích thước màn hình ban đầu
    handleResize();

    // Cleanup listener khi component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
      style={{borderRadius:"0 25px 0 0"}}
        className={`bg-white p-3 h-full border-r-2 border-gray-300 relative transition-all duration-500
          ${isOpen ? 'w-4/12 sm:w-4/12 lg:w-1/6' : 'w-1/12 sm:w-3/12 lg:w-1/12'}`}
      >
        {
          isOpen ? (
            <>
              <img
                style={{ width: "30px", display: "inline-block", marginRight: "2px" }}
                src="https://cf.shopee.vn/file/6b1ffcde1ff12621088110f419a5283a"
                alt="Sidebar Icon"
              /> 
              LOGO
            </>
          ) : null
        }
        <div
          onClick={toggleSidebar}
          style={{ backgroundColor: "white", zIndex: "999" }}
          className="text-white  rounded-full absolute top-5 -right-4 cursor-pointer"
        >
          <span onClick={toggleSidebar} style={{width:"10px",height:"10px",fontSize:"5px"}} 
           class="text-center  relative inline-flex items-center px-3 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-full hover:text-white group hover:bg-gray-50">
            <span class="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
            <span class="absolute right-0 text-center flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            {/* <span class="relative">Button Text</span> */}
          </span>
          {/* Icon toggle sidebar */}
          {/* Bạn có thể thêm icon ở đây */}
        </div>

        {/* Accordion Section */}
        <div className="mt-6 space-y-4" style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
          {/* Accordion Item 1 */}
          <div className="accordion-item hover:bg-gray-50 
            text-black rounded-md transition ease-in-out duration-150 hover:bg-indigo-50 hover:scale-105 transform
          ">
            <button
              className="w-full flex justify-between items-center p-3"
              onClick={() => toggleAccordion(1)}
            >
              <div className="flex items-center text-center">
              <RiBillLine color='blue' className='mr-2'/>  
                {isOpen && <span className="text-xs font-semibold text-black-600 ">Hóa đơn</span>}
              </div>
              {isOpen && (
                <svg
                color='gray'
                  className={`w-5 h-5 transition-transform duration-300 ${expandedItem === 1 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
            <div className={`mt-2 overflow-hidden transition-max-height duration-500 ${expandedItem === 1 ? 'max-h-40' : 'max-h-0'}`}>
              {isOpen && (
                <>
                  <span className="block px-4 py-2 text-xs">Đơn hủy</span>
                  <span className="block px-4 py-2 text-xs">Đơn thêm</span>
                </>
              )}
            </div>
          </div>

          {/* Accordion Item 2 */}
          <div className="accordion-item hover:bg-gray-50 text-black rounded-md transition ease-in-out duration-150 hover:bg-indigo-50 hover:scale-105 transform">
            <button
              className="w-full flex justify-between items-center p-3"
              onClick={() => toggleAccordion(2)}
            >
              <div className="flex items-center">
              <AiOutlineProduct color='blue' className='mr-2'/>  
                {isOpen && <span className="text-xs font-semibold text-black-600">Sản phẩm</span>}
              </div>
              {isOpen && (
                <svg
                color='gray'
                  className={`w-5 h-5 transition-transform duration-300 ${expandedItem === 2 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
            <div className={`mt-2 overflow-hidden transition-max-height duration-500 ${expandedItem === 2 ? 'max-h-40' : 'max-h-0'}`}>
              {isOpen && (
                <>
                  <span className="block px-4 py-2 text-xs">Tất cả sản phẩm</span>
                  <span className="block px-4 py-2 text-xs">Thêm sản phẩm</span>
                </>
              )}
            </div>
          </div>

          {/* ** */}
          <div className="accordion-item hover:bg-gray-50 text-black rounded-md transition ease-in-out duration-150 hover:bg-indigo-50 hover:scale-105 transform">
            <button
              className="w-full flex justify-between items-center p-3"
              onClick={() => toggleAccordion(3)}
            >
              <div className="flex items-center">
              <SiMakerbot color='blue' className='mr-2'/>  
                {isOpen && <span className="text-xs font-semibold text-black-600">Khuyến mãi</span>}
              </div>
              {isOpen && (
                <svg color='gray'
                  className={`w-5 h-5 transition-transform duration-300 ${expandedItem === 3 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
            <div className={`mt-2 overflow-hidden transition-max-height duration-500 ${expandedItem === 3 ? 'max-h-40' : 'max-h-0'}`}>
              {isOpen && (
                <>
                  <span className="block px-4 py-2 text-xs">Xem Khuyến mãi</span>
                  <span className="block px-4 py-2 text-xs">Thêm Khuyến mãi</span>
                </>
              )}
            </div>
          </div>
          {/* Tiếp tục các mục khác tương tự như trên */}
        </div>
      </div>

      {/* Main content */}
      <div   className={`ml-0 flex-grow h-full transition-all duration-500 
        ${isOpen ? 'w-8/12 sm:w-8/12 lg:w-5/6' : 'w-11/12 sm:w-9/12 lg:w-11/12'}`}>
        {/* Nội dung bên phải */}
        {/* <ViewProduct /> */}
        {/* <Voucher/> */}
        {/* <Vi/>/>
        <Khuyen */}
        <KhuyenMaiView/>
        {/* <HoaDonView/> */}
        {/* <CUKhuyenMai/> */}
        {/* Bạn có thể thêm các component khác như VoucherView, KhuyenMaiView ở đây */}
      </div>
    </div>
  );
};

export default Sidebar;
