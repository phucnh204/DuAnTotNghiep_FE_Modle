// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { RiBillLine } from 'react-icons/ri';
// import { FaChevronDown, FaChevronUp, FaHeadset, FaStore } from 'react-icons/fa';
// import { AiOutlineProduct } from 'react-icons/ai';
// import { SiMakerbot } from 'react-icons/si';
// import { BiMoneyWithdraw } from 'react-icons/bi';
// import { DiDatabase } from 'react-icons/di';

// function Sidebar({ onSelectContent }) {
//     const navigate = useNavigate();
//     const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
//     const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

//     // Mảng menuItems chứa các mục chính và submenu tương ứng
//     const menuItems = [
//         {
//             icon: <RiBillLine />,
//             text: 'Quản Lý Đơn Hàng',
//             subMenu: [
//                 { text: 'Tất cả', link: 'tat-ca-hoa-don' },
//                 { text: 'Đơn hủy', link: 'don-huy' },
//                 { text: 'Trả hàng/Hoàn tiền', link: 'tra-hang-hoan-tien' },
//             ],
//             isOpen: isOrderMenuOpen,
//             toggle: () => setIsOrderMenuOpen(!isOrderMenuOpen),
//         },
//         {
//             icon: <AiOutlineProduct />,
//             text: 'Quản Lý Sản Phẩm',
//             subMenu: [
//                 { text: 'Tất Cả Sản Phẩm', link: 'tat-ca-san-pham' },
//                 { text: 'Thêm Sản Phẩm', link: 'them-san-pham' },
//             ],
//             isOpen: isProductMenuOpen,
//             toggle: () => setIsProductMenuOpen(!isProductMenuOpen),
//         },

//         { icon: <SiMakerbot />, text: 'Kênh Marketing', link: 'kenh-marketing' },
//         { icon: <FaHeadset />, text: 'Khách Hàng', link: 'khach-hang' },
//         { icon: <BiMoneyWithdraw />, text: 'Tài Chính', link: 'tai-chinh' },
//         { icon: <DiDatabase />, text: 'Dữ Liệu', link: 'du-lieu' },
//         { icon: <FaStore />, text: 'Quản Lý Shop', link: 'quan-ly-shop' },
//     ];

//     // Hàm handleNavigation để điều hướng hoặc thay đổi nội dung khi nhấn vào mục menu
//     const handleNavigation = (link) => {
//         if (link === 'tat-ca-hoa-don') {
//             onSelectContent('tat-ca-hoa-don');
//         } else if (link === 'tat-ca-san-pham') {
//             onSelectContent('tat-ca-san-pham');
//         } else if (link === 'tra-hang-hoan-tien') {
//             onSelectContent('tra-hang-hoan-tien');
//         } else if (link === 'them-san-pham') {
//             onSelectContent('them-san-pham');
//         } else {
//             navigate(`/${link}`);
//         }
//     };

//     return (
//         <aside className="w-72 bg-white shadow-lg text-slate-500 fixed lg:relative flex-shrink-0">
//             {' '}
//             <a className="text-center no-underline block py-6 border-b" href="/seller/Dashboard">
//                 <h1 className="text-2xl font-bold text-indigo-600">MODEL WORLD</h1>
//             </a>
//             <ul className="mt-4 space-y-2 px-3">
//                 {menuItems.map((item, index) => (
//                     <li key={index}>
//                         <div onClick={item.toggle} className="cursor-pointer">
//                             <button className="w-full flex items-center py-3 px-4 text-black rounded-md transition ease-in-out duration-150 hover:bg-indigo-50 hover:scale-105 transform">
//                                 <span className="mr-3 text-indigo-600">{item.icon}</span>
//                                 <span className="flex-grow font-medium">{item.text}</span>
//                                 {item.subMenu ? (
//                                     item.isOpen ? (
//                                         <FaChevronUp className="text-gray-400 ml-auto" />
//                                     ) : (
//                                         <FaChevronDown className="text-gray-400 ml-auto" />
//                                     )
//                                 ) : null}
//                             </button>
//                         </div>
//                         {/* Hiển thị menu con nếu isOpen */}
//                         {item.isOpen && item.subMenu && (
//                             <ul className="ml-8 mt-2 space-y-2 text-sm text-gray-700">
//                                 {item.subMenu.map((subItem, subIndex) => (
//                                     <li key={subIndex}>
//                                         <button
//                                             onClick={() => handleNavigation(subItem.link)}
//                                             className={`hover:text-blue-600 hover:underline ${
//                                                 subItem.text === 'Tất cả' ? 'text-red-500' : ''
//                                             }`}
//                                         >
//                                             {subItem.text}
//                                         </button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </li>
//                 ))}
//             </ul>
//         </aside>
//     );
// }

// export default Sidebar;
