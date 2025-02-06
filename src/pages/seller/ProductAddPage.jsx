// import React, { useState } from 'react';

// const ProductAddPage = () => {
//     const [activeTab, setActiveTab] = useState('Thông tin cơ bản');

//     return (
//         <div className="p-4 bg-gray-50 min-h-screen">
//             <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
//                 {/* Tabs */}
//                 <div className="flex space-x-4 border-b border-gray-300 mb-6">
//                     {['Thông tin cơ bản', 'Thông tin bán hàng', 'Vận chuyển', 'Thông tin khác'].map((tab) => (
//                         <button
//                             key={tab}
//                             onClick={() => setActiveTab(tab)}
//                             className={`px-4 py-2 ${activeTab === tab ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
//                         >
//                             {tab}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Content for "Thông tin cơ bản" */}
//                 {activeTab === 'Thông tin cơ bản' && (
//                     <div className="space-y-4">
//                         {/* Image Upload Section */}
//                         <div className="flex space-x-4">
//                             {/* Product Image */}
//                             <div className="flex-1">
//                                 <p className="font-semibold">* Hình ảnh sản phẩm</p>
//                                 <div className="flex space-x-2 mt-2">
//                                     <label className="flex items-center space-x-1">
//                                         <input type="radio" name="imageRatio" value="1:1" defaultChecked />
//                                         <span>Hình ảnh tỷ lệ 1:1</span>
//                                     </label>
//                                     <label className="flex items-center space-x-1">
//                                         <input type="radio" name="imageRatio" value="3:4" />
//                                         <span>Hình ảnh tỷ lệ 3:4</span>
//                                     </label>
//                                     <a href="#" className="text-blue-500">
//                                         View Example
//                                     </a>
//                                 </div>
//                                 <div className="mt-4 border-dashed border-2 border-gray-300 rounded-lg h-28 flex items-center justify-center">
//                                     <span className="text-red-500">Thêm hình ảnh (0/9)</span>
//                                 </div>
//                             </div>
//                             {/* Cover Image */}
//                             <div className="flex-1">
//                                 <p className="font-semibold">* Ảnh bìa</p>
//                                 <div className="mt-4 border-dashed border-2 border-gray-300 rounded-lg h-28 flex items-center justify-center">
//                                     <span className="text-red-500">Thêm hình ảnh (0/1)</span>
//                                 </div>
//                             </div>
//                             {/* Video */}
//                             <div className="flex-1">
//                                 <p className="font-semibold">Video sản phẩm</p>
//                                 <div className="mt-4 border-dashed border-2 border-gray-300 rounded-lg h-28 flex items-center justify-center">
//                                     <span className="text-red-500">Thêm video</span>
//                                 </div>
//                                 <p className="text-sm text-gray-500 mt-2">Kích thước tối đa 30Mb, định dạng MP4, 10-60s.</p>
//                             </div>
//                         </div>

//                         {/* Product Information Fields */}
//                         <div>
//                             <label className="font-semibold">* Tên sản phẩm</label>
//                             <input
//                                 type="text"
//                                 className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
//                                 placeholder="Tên sản phẩm + Thương hiệu + Model + Thông số kỹ thuật"
//                             />
//                             <p className="text-right text-gray-500 text-sm">0/120</p>
//                         </div>

//                         <div>
//                             <label className="font-semibold">* Ngành hàng</label>
//                             <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md">
//                                 <option value="">Chọn ngành hàng</option>
//                                 {/* Thêm các ngành hàng khác tại đây */}
//                             </select>
//                         </div>

//                         <div>
//                             <label className="font-semibold">* Mô tả sản phẩm</label>
//                             <textarea
//                                 className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
//                                 placeholder="Mô tả sản phẩm"
//                                 rows="4"
//                             ></textarea>
//                         </div>
//                     </div>
//                 )}

//                 {/* Content for other tabs */}
//                 {activeTab !== 'Thông tin cơ bản' && (
//                     <div className="p-4 border border-gray-200 rounded-md">
//                         <p className="text-gray-500">Có thể điều chỉnh sau khi chọn ngành hàng</p>
//                     </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex justify-end space-x-4 mt-6">
//                     <button className="px-4 py-2 border border-gray-300 rounded-md">Hủy</button>
//                     <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-400 cursor-not-allowed">Lưu & Ẩn</button>
//                     <button className="px-4 py-2 bg-red-500 text-white rounded-md">Lưu & Hiển thị</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductAddPage;
