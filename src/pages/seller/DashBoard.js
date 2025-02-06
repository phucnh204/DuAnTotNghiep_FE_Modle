import { BarChart, PieChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import api from '../../config/APISeller';
function DashboardMain() {
    const [data, setData] = useState({
        OrderSoLuong: {},
        productTopSale: [],
    });

    const [uData, setUpdata] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [pData, setPpdata] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [IData, setIpdata] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const xLabels = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ];
    const datas = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // const [flag, setFlag] = useState(0);
    useEffect(() => {
        api.get('/report')
            .then((v) => v.data)
            .then((v) => {
                console.log(v);
                const grouped = v.month.reduce((acc, curr) => {
                    const key = curr[2];
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(curr);
                    return acc;
                }, {});
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((v) => {
                    const a = grouped['' + v];
                    if (a != null) {
                        a.forEach((t) => {
                            if (t[1] == 5) {
                                uData[v] = t[0];
                            } else if (t[1] == 6) {
                                pData[v] = t[0];
                            } else {
                                IData[v] = t[0];
                            }
                        });
                    }
                });
                setData(v);
            })
            .catch((error) => {
                alert('Có lỗi xảy ra');
            });
    }, []);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 ">
            <div className="xl:col-span-2 space-y-4 ">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-lg font-semibold">Danh sách cần làm</h2>
                    <p className="text-sm text-gray-600">Những việc bạn sẽ phải làm</p>
                    <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">{data.OrderSoLuong['1']}</span>
                            <span className="text-sm text-gray-600">Chờ thanh toán</span>
                        </div>
                        <div className="border-x-2 flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">
                                {data.OrderSoLuong['2'] === undefined ? 0 : data.OrderSoLuong['2']}
                            </span>
                            <span className="text-sm text-gray-600">Chuẩn bị hàng</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">{data.OrderSoLuong['7']}</span>
                            <span className="text-sm text-gray-600">Đơn hủy</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl text-indigo-600 font-medium">
                                {data.OrderSoLuong['6'] === undefined ? 0 : data.OrderSoLuong['6']}
                            </span>
                            <span className="text-sm text-gray-600">Giao thất bại</span>
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
                            <span className="text-2xl text-indigo-600 font-medium">
                                {data.sanPhamHetHang != null ? data.sanPhamHetHang : 0}
                            </span>
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
                    <div className="mt-4 ">
                        {/* Biểu đồ */}
                        <div className="w-2/2 flex flex-col ">
                            <BarChart
                                width={500}
                                height={300}
                                series={[
                                    { data: pData, label: 'Thành công', id: 'Thành công' },
                                    { data: uData, label: 'Thất bại', id: 'Thất bại' },
                                    { data: IData, label: 'Hủy', id: 'Hủy' },
                                ]}
                                xAxis={[{ data: xLabels, scaleType: 'band' }]}
                            />
                        </div>
                    </div>
                </div>

                {/* Phần kênh người bán */}
                <div class="bg-white shadow-lg rounded-lg p-6 max-w-screen-xl mx-auto">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg font-semibold">Top sản phẩm bán chạy</h2>
                        <a href="/" class="text-blue-500 text-sm no-underline">
                            Xem Thêm
                        </a>
                    </div>
                    <p class="text-gray-600 text-sm mb-6">Các sản phẩm có lượt bán cao nhất shop</p>

                    <div class="border p-6 rounded-lg mb-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-4 gap-6">
                            {data.productTopSale.map((v) => {
                                return (
                                    <div class="bg-white shadow-md rounded-sm overflow-hidden col-span-6 md:col-span-3 lg:col-span-1">
                                        <div class="relative">
                                            <img src={v[2]} alt="Nike Air MX Super 2500 - Red" class="w-full h-30 object-cover" />
                                        </div>
                                        <div class="p-4">
                                            <h3 class="text-sm truncate font-semibold">{v[1]}</h3>
                                            <p class="mt-2 text-gray-600">
                                                <span class="text-xs text-blue-500 font-bold">Tổng đơn: {v[6]} </span>
                                                <br />
                                                <span class="text-gray-500 text-xs">Số đơn : {v[3]} </span>
                                                <br />
                                                <span class="text-gray-500 text-xs">Số người mua: {v[4]}</span>
                                                <br />
                                                <span class="text-gray-500 text-xs">Số bán ra: {v[5]}</span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Phần hiểu quả hoạt động */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    {/* Tiêu đề và liên kết */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Voucher của shop</h2>
                        <a href="/" className="text-blue-500 text-sm no-underline">
                            Xem Thêm
                        </a>
                    </div>
                </div>
            </div>

            {/* */}
            <div className="xl:col-span-1 space-y-4">
                {/* Hình ảnh */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                    Đánh giá của shop
                    <img
                        src="https://files.oaiusercontent.com/file-zZErywcQdMLveaaZCaOmYMDh?se=2024-10-16T04%3A31%3A31Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dd38e9281-4b17-44b8-9e1b-958770cdea6d.webp&sig=Y3/LDMr23HSqmHUxyMlur1QYJyHDybXYGtiqadK6j7U%3D"
                        alt=""
                        className="w-full  rounded-lg shadow"
                    />
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: 10, label: 'Số lược đã dùng' },
                                    { id: 1, value: 15, label: '' },
                                    { id: 2, value: 20, label: 'series C' },
                                ],
                            },
                        ]}
                        width={400}
                        height={200}
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
