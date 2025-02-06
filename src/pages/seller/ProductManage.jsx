// import React from 'react';

// function ProductManage() {
//     // Dữ liệu mẫu cho 5 sản phẩm
//     const products = [
//         { name: 'Sản phẩm 1', sales: 100, price: '$20', stock: 'Còn hàng', quality: 'Tốt', actions: 'Sửa' },
//         { name: 'Sản phẩm 2', sales: 200, price: '$25', stock: 'Còn hàng', quality: 'Tốt', actions: 'Sửa' },
//         { name: 'Sản phẩm 3', sales: 150, price: '$30', stock: 'Hết hàng', quality: 'Tốt', actions: 'Sửa' },
//         { name: 'Sản phẩm 4', sales: 50, price: '$15', stock: 'Còn hàng', quality: 'Trung bình', actions: 'Sửa' },
//         { name: 'Sản phẩm 5', sales: 80, price: '$22', stock: 'Còn hàng', quality: 'Kém', actions: 'Sửa' },
//     ];

//     return (
//         <div className="flex bg-gray-100">
//             {/* Nội dung */}
//             <div className="flex-grow bg-white p-6 overflow-y-auto p-36">
//                 <div className="flex justify-between items-center border-b pb-4 mb-4 ">
//                     {['Tất cả', 'Đang hoạt động', 'Vi phạm', 'Chờ duyệt', 'Chưa được đăng'].map((tab, index) => (
//                         <button
//                             key={index}
//                             className={`py-2 px-4 transition duration-200 ${
//                                 index === 0
//                                     ? 'border-b-2 border-red-500 text-red-500'
//                                     : 'text-gray-500 hover:text-gray-800 hover:border-b-2 hover:border-gray-300'
//                             }`}
//                         >
//                             {tab}
//                         </button>
//                     ))}
//                 </div>
//                 <div className="flex items-center space-x-2 mb-6">
//                     <input type="text" className="border p-2 rounded-lg w-4/12" placeholder="Tìm Tên sản phẩm, Mã sản phẩm" />
//                     <input type="text" className="border p-2 rounded-lg w-4/12" placeholder="Tìm kiếm theo ngành hàng" />
//                     <button className="bg-blue-500 text-white py-2 rounded-lg w-2/12">Áp dụng</button>
//                     <button className="border py-2 rounded-lg w-2/12">Nhập lại</button>
//                 </div>
//                 <div className="border rounded-lg overflow-x-auto">
//                     <table className="min-w-full text-left">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="p-4">Tên sản phẩm</th>
//                                 <th className="p-4">Doanh số</th>
//                                 <th className="p-4">Giá</th>
//                                 <th className="p-4">Kho hàng</th>
//                                 <th className="p-4">Chất Lượng Nội Dung</th>
//                                 <th className="p-4">Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {products.map((product, index) => (
//                                 <tr key={index} className="border-b hover:bg-gray-50 transition">
//                                     <td className="p-4 text-gray-700">{product.name}</td>
//                                     <td className="p-4 text-gray-700">{product.sales}</td>
//                                     <td className="p-4 text-gray-700">{product.price}</td>
//                                     <td className="p-4 text-gray-700">{product.stock}</td>
//                                     <td className="p-4 text-gray-700">{product.quality}</td>
//                                     <td className="p-4">
//                                         <button className="bg-blue-500 text-white py-1 px-2 rounded-md transition hover:bg-blue-600">
//                                             {product.actions}
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

// export default ProductManage;
