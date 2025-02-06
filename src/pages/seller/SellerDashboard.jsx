// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import DashboardMain from './DashboardMain';
// import OrderManage from './OrderManage';
// import ProductManage from './ProductManage';
// import ReturnRefundManage from './ReturnRefundManage';
// import ProductAddPage from './ProductAddPage';

// function SellerDashboard() {
//     const [activeContent, setActiveContent] = useState('dashboard'); //nội dung hiện tại

//     // Hàm để thay đổi nội dung
//     const handleContentChange = (content) => {
//         setActiveContent(content);
//     };

//     return (
//         <div className="flex w-full flex-col lg:flex-row min-h-screen">
//             {/* Sidebar */}
//             <Sidebar onSelectContent={handleContentChange} />

//             <main className="flex-grow bg-gray-100 p-4 overflow-y-auto max-h-[700px]">
//                 {activeContent === 'tat-ca-hoa-don' && <OrderManage />}
//                 {activeContent === 'tat-ca-san-pham' && <ProductManage />}
//                 {activeContent === 'tra-hang-hoan-tien' && <ReturnRefundManage />}
//                 {activeContent === 'them-san-pham' && <ProductAddPage />}
//                 {/* Thêm các điều kiện khác tại đây */}
//                 {activeContent === 'dashboard' && <DashboardMain />}
//             </main>
//         </div>
//     );
// }

// export default SellerDashboard;
