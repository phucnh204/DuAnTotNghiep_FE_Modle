// import React from 'react';

// const ReturnRefundManage = () => {
//     return (
//         <div className="p-4 bg-gray-50 min-h-screen">
//             <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
//                 <h1 className="text-2xl font-bold mb-4">Trả hàng / Hoàn tiền</h1>

//                 {/* Tabs */}
//                 <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
//                     <div className="space-x-4">
//                         <button className="text-red-600 font-semibold border-b-2 border-red-600">Tất cả</button>
//                         <button className="text-gray-600">Shopee đang xem xét</button>
//                         <button className="text-gray-600">Đang trả hàng</button>
//                         <button className="text-gray-600">Đã hoàn tiền cho Người mua</button>
//                         <button className="text-gray-600">Yêu cầu THHT bị hủy/không hợp lệ</button>
//                     </div>
//                     <button className="text-blue-600">Tỷ lệ trả hàng/hoàn tiền</button>
//                 </div>

//                 {/* Form Fields */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//                     <input
//                         type="text"
//                         className="px-3 py-2 border border-gray-300 rounded-md w-full"
//                         placeholder="Điền Mã yêu cầu trả hàng/ Mã đơn hàng hoàn/ Tài khoản..."
//                     />
//                     <select className="px-3 py-2 border border-gray-300 rounded-md w-full">
//                         <option value="">Trạng thái</option>
//                     </select>
//                     <select className="px-3 py-2 border border-gray-300 rounded-md w-full">
//                         <option value="">Vận chuyển chiều hoàn hàng</option>
//                     </select>
//                     <select className="px-3 py-2 border border-gray-300 rounded-md w-full">
//                         <option value="">Phương án cho Người mua</option>
//                     </select>
//                     <input type="text" className="px-3 py-2 border border-gray-300 rounded-md w-full" placeholder="Dự kiến hoàn tiền" />
//                     <input type="text" className="px-3 py-2 border border-gray-300 rounded-md w-full" placeholder="Toàn bộ thao tác" />
//                     <select className="px-3 py-2 border border-gray-300 rounded-md w-full">
//                         <option value="">Vận chuyển chiều giao hàng</option>
//                     </select>
//                     <select className="px-3 py-2 border border-gray-300 rounded-md w-full">
//                         <option value="">Lý do</option>
//                     </select>
//                     <select className="px-3 py-2 border border-gray-300 rounded-md w-full">
//                         <option value="">Khiếu nại được đền bù</option>
//                     </select>
//                     <input type="date" className="px-3 py-2 border border-gray-300 rounded-md w-full" placeholder="Ngày yêu cầu" />
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex items-center space-x-4 mb-4">
//                     <button className="px-4 py-2 bg-red-600 text-white rounded-md">Tìm kiếm</button>
//                     <button className="px-4 py-2 border border-gray-300 rounded-md">Đặt lại</button>
//                     <button className="text-blue-600">Thu nhỏ</button>
//                 </div>

//                 {/* Footer */}
//                 <div className="flex justify-between items-center border-b border-gray-300 pb-4">
//                     <span>0 Yêu cầu</span>
//                     <div className="flex items-center space-x-4">
//                         <button className="border border-gray-300 px-4 py-2 rounded-md">Sắp xếp theo Ngày yêu cầu gần nhất</button>
//                         <button className="border border-gray-300 px-4 py-2 rounded-md">Xuất</button>
//                     </div>
//                 </div>

//                 {/* Empty State */}
//                 <div className="mt-4 bg-gray-100 p-6 rounded-md">
//                     <p className="text-center text-gray-500">Không có yêu cầu nào</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ReturnRefundManage;
