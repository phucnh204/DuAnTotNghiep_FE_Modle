// import React from 'react';

// function OrderManage() {
//     const orders = [
//         { product: 'Mô hình Hutao Siêu Cute', total: 1, status: 'Chờ lấy hàng', countdown: '-', actions: 'Hủy' },
//         { product: 'Mô hình Xiao Thần Gió', total: 2, status: 'Đang giao', countdown: '-', actions: 'Hủy' },
//         { product: 'Mô hình Diluc Đỏ Lửa', total: 1, status: 'Đã giao', countdown: '-', actions: 'Chi tiết' },
//         { product: 'Mô hình Kaeya Băng Lạnh', total: 1, status: 'Trả hàng', countdown: '-', actions: 'Hủy' },
//         { product: 'Mô hình Mona Thủy Tinh', total: 3, status: 'Chờ xác nhận', countdown: '-', actions: 'Chi tiết' },
//     ];

//     return (
//         <div className="p-12 bg-white shadow-xl rounded-lg w-full flex flex-col space-y-6">
//             {/* Tabs trên cùng */}
//             <div className="flex justify-between border-b pb-4 overflow-x-auto">
//                 {[
//                     'Tất cả',
//                     'Chờ xác nhận',
//                     'Chờ lấy hàng',
//                     'Đang giao',
//                     'Đã giao',
//                     'Đơn Hủy',
//                     'Trả hàng/Hoàn tiền',
//                     'Giao không thành công',
//                 ].map((tab, index) => (
//                     <button
//                         key={index}
//                         className={`py-2 px-4 mb-2 whitespace-nowrap transition duration-200 ${
//                             index === 0
//                                 ? 'border-b-2 border-red-500 text-red-500'
//                                 : 'text-gray-500 hover:text-gray-800 hover:border-b-2 hover:border-gray-300'
//                         }`}
//                     >
//                         {tab}
//                     </button>
//                 ))}
//             </div>

//             {/* Thanh công cụ lọc */}
//             <div className="flex flex-wrap items-center justify-between">
//                 <div className="flex items-center gap-2 w-full md:w-auto">
//                     <select className="border rounded-lg p-2 w-full md:w-auto focus:ring focus:ring-red-200">
//                         <option>Mã đơn hàng</option>
//                         <option>Tên khách hàng</option>
//                     </select>
//                     <input
//                         type="text"
//                         className="border rounded-lg p-2 w-full md:w-52 focus:ring focus:ring-red-200"
//                         placeholder="Nhập Mã đơn hàng"
//                     />
//                 </div>
//             </div>

//             {/* Khu vực danh sách đơn hàng */}
//             <div className="border-t pt-4">
//                 <div className="flex justify-between items-center py-2 text-gray-600 font-semibold">
//                     <p>{orders.length} Đơn hàng</p>
//                 </div>
//                 <div className="overflow-x-auto border rounded-lg">
//                     <table className="w-full text-center">
//                         <thead>
//                             <tr className="bg-gray-100 border-b">
//                                 <th className="p-4">Sản phẩm</th>
//                                 <th className="p-4">Tổng Đơn hàng</th>
//                                 <th className="p-4">Trạng thái</th>
//                                 <th className="p-4">Đếm ngược</th>
//                                 <th className="p-4">Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {orders.map((order, index) => (
//                                 <tr key={index} className="text-center border-b hover:bg-gray-50 transition">
//                                     <td className="p-4 text-gray-700">{order.product}</td>
//                                     <td className="p-4 text-gray-700">{order.total}</td>
//                                     <td className="p-4 text-gray-700">{order.status}</td>
//                                     <td className="p-4 text-gray-700">{order.countdown}</td>
//                                     <td className="p-4">
//                                         <button className="bg-red-400 text-white py-1 px-2 rounded-md mx-1 transition hover:bg-red-500">
//                                             Hủy
//                                         </button>
//                                         <button className="bg-yellow-400 text-white py-1 px-2 rounded-md mx-1 transition hover:bg-yellow-500">
//                                             Chi tiết
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default OrderManage;
