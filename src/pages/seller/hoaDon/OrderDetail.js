import { useEffect, useState } from "react"
import api from "../../../config/APISeller"
import { Box,Step, StepLabel, Stepper } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"

const OrderDetail=()=>{
    const {id}=useParams()
    const steps = [
        'Chờ thanh toán',
        'Chuẩn bị hàng',
        'Chờ lấy hàng',
        "Chờ giao hàng",
        'Giao thành công',
        'Giao thất bại',
        'Hủy đơn',
      ];
    const [order,setOrder]=useState({
        "id": 30037,
        "ngayTaoDon": "2024-11-03T15:48:53.000+00:00",
        "voucherShopId": null,
        "tongTien": 3.6963E7,
        "ghiChu": null,
        "lyDo": null,
        "phiShip": 0.0,
        "tienTru": 0.0,
        "tienTruVoucherSan": 0.0,
        "shop": {
            "shopId": 1,
            "shopName": "Hammi"
        },
        "thanhToanId": {
            "id": 2,
            "trangThai": 1,
            "hinhThucThanhToan": "Thanh toán trực tuyến"
        },
        "diaChiId": {
            "id": 1,
            "districtId": 1454,
            "provinceId": 1,
            "wardCode": "21211",
            "toanBoDiaChi": "12, phố hàng kiếm, đống đa, hà nội",
            "soDienThoai": "948484847"
        },
        "voucherSanId": null,
        "accountId": null,
        "trangThai": {
            "id": 7,
            "tenTrangThai": "Đơn hủy"
        },
        "orderDetails": [
            {
                "id": null,
                "product": {
                    "id": 0,
                    "soLuong": 0,
                    "giaBan": 0.0,
                    "hinhAnh": "http://res.cloudinary.com/doa9sdr6z/image/upload/v1730173265/yhptwmj0l8rrqecwxpuv.png",
                    "mauSac": {
                        "id": 0,
                        "tenMau": "Đỏ"
                    },
                    "kichThuoc": {
                        "id": 0,
                        "tenMau": "LG",
                        "tenKichThuoc": "LG"
                    },
                    "isActive": null,
                    "trangThai": null,
                    "product": {
                        "id": 1925,
                        "tenSanPham": "Túi Đeo Chéo Vải Canvas Hàng Sẵn Kho Tại HN, Túi Nam Chống Trầy Xước Và Chống Thấm Nước Mã 01 DODANA",
                        "soLuong": 0,
                        "moTa": null,
                        "hinhAnh": null,
                        "trangThai": 0,
                        "video": null,
                        "productDetails": null,
                        "duocMuaKhiHetHang": null,
                        "shop": null,
                        "thuongHieu": null,
                        "category": null,
                        "productImages": null
                    }
                },
                "productId": 0,
                "shopId": 0,
                "soLuong": 4,
                "giaBan": 999000.0
            },
            {
                "id": null,
                "product": {
                    "id": 0,
                    "soLuong": 0,
                    "giaBan": 0.0,
                    "hinhAnh": "http://res.cloudinary.com/doa9sdr6z/image/upload/v1730173265/yhptwmj0l8rrqecwxpuv.png",
                    "mauSac": {
                        "id": 0,
                        "tenMau": "Tím"
                    },
                    "kichThuoc": {
                        "id": 0,
                        "tenMau": "LG",
                        "tenKichThuoc": "LG"
                    },
                    "isActive": null,
                    "trangThai": null,
                    "product": {
                        "id": 1924,
                        "tenSanPham": "Túi Đeo Chéo Vải Canvas Hàng Sẵn Kho Tại HN, Túi Nam Chống Trầy Xước Và Chống Thấm Nước Mã 01 DODANA",
                        "soLuong": 0,
                        "moTa": null,
                        "hinhAnh": null,
                        "trangThai": 0,
                        "video": null,
                        "productDetails": null,
                        "duocMuaKhiHetHang": null,
                        "shop": null,
                        "thuongHieu": null,
                        "category": null,
                        "productImages": null
                    }
                },
                "productId": 0,
                "shopId": 0,
                "soLuong": 33,
                "giaBan": 999000.0
            }
        ],
        "tienTinhDuoc": 0.0
    }
)
        useEffect(()=>{
            api.get(`/order/getorderdetail/${id}`).then(v=>v.data).then(v=>{
                if(v.data==null){
                    navigate("/seller/order")
                }
                setOrder(v.data)
            })
        },[])

        const navigate=useNavigate()

        const huyDon=()=>{
            api.post(`/order/cancelsingle/${order.id}/Quá hạn thanh toán`).then(v=>v.data).then(v=>{
                if(v.status===200){
                    alert(v.message)
                    navigate("/seller/order")
                }else{
                    alert(v.message)
                }
            })
        }

    return <div class="w-full p-6 bg-white shadow-md">
    <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-semibold">Order ID: {order.id}</h1>
        <div class="space-x-2">
            <span class="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded">{order.trangThai.tenTrangThai}</span>
            {/* <span class="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded">Unfulfilled</span> */}
        </div>
    </div>
    <p class="text-sm text-gray-500 mb-4">{order.ngayTaoDon} from Draft Orders</p>
    <Box sx={{ width: '100%' }}>
      <Stepper 
      activeStep={order.trangThai.id-1}
       alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
    <div class="mt-4 border rounded-lg p-4 mb-6">
        <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-semibold">Order Item</h2>
            {/* <span class="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded">{order.orderDetails.length}</span> */}
        </div>
        <p class="text-sm text-gray-500 mb-4">Use this personalized guide to get your store up and running.</p>
        
        {order.orderDetails.map(v=>{
            return <div class="flex items-center space-x-4 mb-4">
            <img src={v.product.hinhAnh} alt="Product image" class="w-16 h-16 rounded-md border"/>
            <div>
                <h3 class="font-medium">Laptop</h3>
                <p class="text-sm text-gray-600">Macbook Air</p>
                <div class="flex items-center text-sm text-gray-600">
                    <span>{v.product.mauSac.tenMau}</span>
                    <span class="mx-1">•</span>
                    <span>{v.product.kichThuoc.tenKichThuoc}</span>
                    <span class="w-3 h-3 bg-black rounded-full ml-2"></span>
                </div>
            </div>
            <div class="ml-auto text-right">
                <p>{v.soLuong} x ${v.giaBan}</p>
                <p class="font-semibold">$ {v.soLuong*v.giaBan}</p>
            </div>
        </div>
        })}
        
        <div class="flex justify-between">
            <p class="text-sm text-gray-500">Effortlessly manage your orders with our intuitive Order List page.</p>
            <div class="space-x-2">
                <button class="px-4 py-1 bg-purple-600 text-white text-sm font-medium rounded">Giá bán đã bao gồm giá khuyến mãi</button>
            </div>
        </div>
    </div>

    <div class="border rounded-lg p-4 mb-6">
        <div class="flex items-center justify-between mb-2">
            <h2 class="text-lg font-semibold">Order Summary</h2>
            <span class="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded">Payment pending</span>
        </div>
        <p class="text-sm text-gray-500 mb-4">Use this personalized guide to get your store up and running.</p>
        
        <div class="space-y-2 text-sm">
            <div class="flex justify-between">
                <span>Subtotal</span>
                {/* <span>{order.orderDetails} item</span> */}
                <span>$ {order.tongTien}</span>
            </div>
            <div class="flex justify-between">
                <span>VoucherShop</span>
                <span>Có</span>
                <span>-$ {order.tienTru}</span>
            </div>
            <div class="flex justify-between">
                <span>Shipping</span>
                <span>Free shipping (0.0 lb)</span>
                <span>$ {order.phiShip}</span>
            </div>
            <div class="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>$2282882</span>
            </div>
        </div>
        
        
        <div class="flex justify-between items-center mt-4">
            <p class="text-sm text-gray-500">Hình thức thanh toán: {order.thanhToanId.hinhThucThanhToan}</p>
            <div class="space-x-2">

                {
                    (new Date()-new Date(order.ngayTaoDon))/(1000 * 60 * 60)>=2&&order.trangThai.id===1?<button onClick={()=>huyDon()} class="px-4 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded border">Hủy đơn ngay (Quán hạn thanh toán)</button>:<></>
                }
            </div>
        </div>
    </div>

    {/* <div class="border rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-2">Timeline</h2>
        <p class="text-sm text-gray-500 mb-4">Use this personalized guide to get your store up and running.</p>
        
        <div class="flex items-center space-x-2 mb-4">
            <span class="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">JS</span>
            <p class="font-medium">Alex Jander</p>
        </div>
        
        <textarea class="w-full border rounded p-2 text-sm" placeholder="Leave a comment..."></textarea>
    </div> */}
</div>

}
export default OrderDetail