import { MdOutlineSell } from 'react-icons/md';
function DashboardMain() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 ">
            {/*  */}
            <div className="xl:col-span-2 space-y-4 ">
                {/*  */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-lg font-semibold">Danh sách cần làm</h2>
                    <p className="text-sm text-gray-600">Những việc bạn sẽ phải làm</p>
                    <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">0</span>
                            <span className="text-sm text-gray-600">Chờ Xác Nhận</span>
                        </div>
                        <div className="border-x-2 flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">0</span>
                            <span className="text-sm text-gray-600">Chờ Lấy Hàng</span>
                        </div>
                        <div className="border-r-2 flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">0</span>
                            <span className="text-sm text-gray-600">Đã Xử Lý</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">0</span>
                            <span className="text-sm text-gray-600">Đơn Hủy</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">0</span>
                            <span className="text-sm text-gray-600">
                                Trả Hàng / <br /> Hoàn Tiền Chờ Xử Lý
                            </span>
                        </div>
                        <div className="border-x-2 flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">0</span>
                            <span className="text-sm text-gray-600">Sản Phẩm Bị Tạm Khóa</span>
                        </div>
                        <div className="border-r-2 flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">0</span>
                            <span className="text-sm text-gray-600">Sản Phẩm Hết Hàng</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">0</span>
                            <span className="text-sm text-gray-600">
                                Chương Trình <br /> Khuyến Mãi Chờ Xử Lý
                            </span>
                        </div>
                    </div>
                </div>

                {/* Phân Tích Bán Hàng */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Phân Tích Bán Hàng</h2>
                        <a href="/" className="text-blue-500 text-sm font-bold no-underline">
                            Xem Thêm
                        </a>
                    </div>
                    <p className="text-xs text-gray-500">Hôm nay 00:00 GMT+7 18:00</p>
                    <p className="text-sm text-gray-600">Tổng quan dữ liệu của shop đối với đơn hàng đã xác nhận</p>
                    <div className="mt-4 flex">
                        {/* Biểu đồ */}
                        <div className="w-1/2 flex flex-col ">
                            <p className="text-xs font-semibold mb-2">Doanh Số: 0</p>
                            <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                <img src="" alt="Biểu đồ Doanh Số" className="rounded-lg " />
                            </div>
                        </div>

                        {/* Số liệu thống kê */}
                        <div className="w-1/2 flex flex-col justify-between ml-6">
                            <div className="flex justify-between border-b pb-2">
                                <div className="text-center">
                                    <p className="text-xl font-bold">0</p>
                                    <p className="text-xs text-gray-500">Lượt truy cập</p>
                                    <p className="text-xs text-gray-400">Với hôm qua 0.00%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold">0</p>
                                    <p className="text-xs text-gray-500">Lượt xem</p>
                                    <p className="text-xs text-gray-400">Với hôm qua 0.00%</p>
                                </div>
                            </div>
                            <div className="flex justify-between pt-2">
                                <div className="text-center">
                                    <p className="text-xl font-bold">0</p>
                                    <p className="text-xs text-gray-500">Đơn hàng</p>
                                    <p className="text-xs text-gray-400">Với hôm qua 0.00%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold">0</p>
                                    <p className="text-xs text-gray-500">Tỷ lệ chuyển đổi</p>
                                    <p className="text-xs text-gray-400">Với hôm qua 0.00%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phần kênh người bán */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    {/* Tiêu đề và liên kết */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Kênh Marketing</h2>
                        <a href="/" className="text-blue-500 text-sm no-underline">
                            Xem Thêm
                        </a>
                    </div>
                    <p className="text-gray-600 text-sm mb-6">Công cụ Marketing & Đăng ký chương trình Khuyến Mãi</p>

                    {/* Tabs */}
                    <div className="border-b mb-4">
                        <ul className="flex">
                            <li className="mr-4 text-purple-600 font-semibold border-b-2 border-purple-600 pb-2">Lịch</li>
                            <li className="mr-4 text-gray-500">Chương Trình Giảm Giá Sản Phẩm</li>
                            <li className="mr-4 text-gray-500">Chương Trình Mã Giảm Giá</li>
                            <li className="text-gray-500">Shopee Live</li>
                        </ul>
                    </div>

                    {/* Lịch */}
                    <div className="border p-6 rounded-lg mb-6 text-center flex">
                        <div className="mb-4 w-1/2 border p-8">
                            <h3 className="text-gray-600">Tháng 9 - 2024</h3>
                            <table className="w-full mt-2 text-sm text-gray-600">
                                <thead>
                                    <tr>
                                        <th>CN</th>
                                        <th>T2</th>
                                        <th>T3</th>
                                        <th>T4</th>
                                        <th>T5</th>
                                        <th>T6</th>
                                        <th>T7</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-gray-300">1</td>
                                        <td className="text-gray-300">2</td>
                                        <td className="text-gray-300">3</td>
                                        <td className="text-gray-300">4</td>
                                        <td className="text-gray-300">5</td>
                                        <td className="text-gray-300">6</td>
                                        <td className="text-gray-300">7</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-300">8</td>
                                        <td className="text-gray-300">9</td>
                                        <td className="text-gray-300">10</td>
                                        <td className="text-gray-300">11</td>
                                        <td className="text-gray-300">12</td>
                                        <td className="text-gray-300">13</td>
                                        <td className="text-gray-300">14</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-300">15</td>
                                        <td className="text-gray-300">16</td>
                                        <td className="text-gray-300">17</td>
                                        <td className="text-purple-600 font-semibold border-2 border-purple-600 rounded">24</td>
                                        <td className="text-gray-300">18</td>
                                        <td className="text-gray-300">19</td>
                                        <td className="text-gray-300">20</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-gray-500 w-1/2 m-auto">
                            Hiện không có chương trình hoặc sự kiện nào cho tháng này. Shop vui lòng thử lại hoặc xem các tháng sau.
                        </p>
                    </div>

                    {/* Công cụ Marketing */}
                    <div className="flex justify-around mt-6">
                        {/* Mã Giảm Giá Của Shop */}
                        <div className="flex flex-col items-center text-center mx-4">
                            <div className="bg-purple-200 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                                <MdOutlineSell size={24} />
                            </div>
                            <p className="font-semibold">Mã Giảm Giá Của Shop</p>
                            <p className="text-gray-500 text-xs mt-1">Công cụ giảm giá cho phép bạn sử dụng mã giảm giá riêng của shop</p>
                        </div>

                        {/* Chương Trình Của Shop */}
                        <div className="flex flex-col items-center text-center mx-4">
                            <div className="bg-blue-200 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                                <MdOutlineSell size={24} />
                            </div>
                            <p className="font-semibold">Chương Trình Của Shop</p>
                            <p className="text-gray-500 text-xs mt-1">Đăng ký tham gia các chương trình giảm giá sản phẩm của shop</p>
                        </div>
                    </div>
                </div>

                {/* Phần hiểu quả hoạt động */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    {/* Tiêu đề và liên kết */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Hiệu Quả Hoạt Động</h2>
                        <a href="/" className="text-blue-500 text-sm no-underline">
                            Xem Thêm
                        </a>
                    </div>
                    <p className="text-gray-600 text-sm mb-6">
                        Bảng Hiệu Quả Hoạt Động giúp Người Bán hiểu rõ hơn về hoạt động buôn bán của Shop mình dựa trên những chỉ tiêu sau:
                    </p>

                    {/* Tabs */}
                    <div className="border-b mb-4">
                        <ul className="flex">
                            <li className="mr-4 text-purple-600 font-semibold border-b-2 border-purple-600 pb-2 cursor-pointer">
                                Hết hiệu lực
                            </li>
                            <li className="mr-4 text-gray-500 cursor-pointer">Vi phạm về đăng bán</li>
                            <li className="text-gray-500 cursor-pointer">Chăm sóc khách hàng</li>
                        </ul>
                    </div>

                    {/* Bảng chỉ tiêu */}
                    <div className="overflow-x-auto">
                        <table className="w-full border text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 border text-gray-600">Tiêu Chí</th>
                                    <th className="p-4 border text-gray-600">Shop Của Tôi</th>
                                    <th className="p-4 border text-gray-600">Chỉ Tiêu</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-4 border text-gray-800">Tỷ lệ đơn hàng không thành công</td>
                                    <td className="p-4 border text-center text-gray-800">-</td>
                                    <td className="p-4 border text-center text-gray-800">&lt;10.00%</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-4 border text-gray-800">Tỷ lệ giao hàng trễ</td>
                                    <td className="p-4 border text-center text-gray-800">-</td>
                                    <td className="p-4 border text-center text-gray-800">&lt;10.00%</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border text-gray-800">Thời gian chuẩn bị hàng</td>
                                    <td className="p-4 border text-center text-gray-800">-</td>
                                    <td className="p-4 border text-center text-gray-800">&lt;1.50 days</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* */}
            <div className="xl:col-span-1 space-y-4">
                {/* Hình ảnh */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <img
                        src="https://files.oaiusercontent.com/file-zZErywcQdMLveaaZCaOmYMDh?se=2024-10-16T04%3A31%3A31Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dd38e9281-4b17-44b8-9e1b-958770cdea6d.webp&sig=Y3/LDMr23HSqmHUxyMlur1QYJyHDybXYGtiqadK6j7U%3D"
                        alt=""
                        className="w-full  rounded-lg shadow"
                    />
                </div>

                {/* Thông Báo */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Thông Báo</h2>
                        <a href="/" className="text-blue-500 text-sm font-bold no-underline">
                            Xem Thêm
                        </a>
                    </div>
                    <div className="mt-4 text-sm">
                        <div className="mb-3">
                            <p className="font-bold text-yellow-600">✨ BÌNH DƯƠNG ƠI</p>
                            <p>
                                Chương trình Shopee KOL Sellers - Người bán kinh nghiệm đang tìm kiếm thêm những người bán kinh nghiệm tại
                                khu vực Bình Dương. Tìm hiểu về chương trình ngay TẠI ĐÂY.
                            </p>
                            <p className="text-gray-500 text-xs">Hôm Qua 00:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardMain;
