import React from "react"
import { useNavigate } from "react-router-dom"

const OrderItemChuanBi=({order,isCheckTab})=>{
    const [flag,setFlag]=React.useState(0)
    const navigate=useNavigate()
    return <div className="w-11/12 mx-auto bg-white shadow-lg rounded-sm overflow-hidden mb-4 transition-all duration-500 ease-out"
    id={'order'+order.id}>
       <div className="flex items-center justify-between p-2 justify-content-between"  >
           <div className="flex items-center space-x-2 w-10/12 ml-4">
               <input
                   onClick={() => {
                       order.isCheck = !order.isCheck;
                       setFlag(flag + 1);
                   }}
                   checked={order.isCheck === true}
                   type="checkbox"
               />
               <span className="font-medium text-sm">
                   {order.accountId.hoVaTen} - {order.accountId.soDienThoai}
               </span>
           </div>
       </div>
       <div className="flex items-center justify-between p-2 mb-3 justify-content-between" >
           <div className="flex items-center space-x-2 w-10/12">
               <span className="font-semibold text-sm ml-4">{new Date(order.ngayTaoDon).toDateString()}  .   ID đơn hàng: {order.id}</span>
           </div>
       </div>
       <div className="w-[95%] h-[1px] bg-gray-300 mx-auto"></div>
       
       {
           order.orderDetails !== null && order.orderDetails.map((v, i) => (
               <div key={i} className="p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-12/12">
                   <div className="flex-shrink-0 border rounded-sm border-pink-900">
                       <img className="w-[70px]" src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmzl2bj75yhkc1_tn" alt="5D Mask" />
                   </div>
                   <div className="flex-grow w-12/12">
                       <h2 className="font-semibold text-sm text-blue-700">
                           {v.product.product.tenSanPham}
                       </h2>
                       <p className="text-gray-500 text-xs">
                           Phân loại: {v.product.mauSac.tenMau} - {v.product.kichThuoc.tenKichThuoc}
                       </p>
                       <div className="flex items-center justify-between align-items-start mt-2">
                           <p className='text-xs'>{v.soLuong} x {v.giaBan}</p>
                           <p className='text-xs text-red-500'><sup>đ</sup>{v.soLuong * v.giaBan}</p>
                       </div>
                   </div>
               </div>
           ))
       }

       <div className='mb-3 w-[95%] h-[1px] bg-lightgray my-1.5 mx-auto'></div>
       <p  className='text-xs text-right  mr-5 pr-1'>Voucher shop: <span className='text-sm text-red-500'> 
           <sup>đ</sup>{order.tienTru}</span></p>
       <p className='text-xs  text-right mr-5 pr-1'>Voucher sàn: <span className='text-sm text-red-500'><sup>đ</sup>{order.tienTruVoucherSan}</span></p>
       <p  className='text-xs text-right   mr-5 pr-1'>Thành tiền: <span className='text-sm text-red-500'><sup>đ</sup>{order.tongTien}</span></p>
       
       <div className="flex space-x-2 p-4 w-12/12 justify-between">
           <div>
               <button  className="bg-red-600 text-white text-sm px-4 py-2 rounded-sm">
                   Chuẩn bị đơn hàng
               </button>
               <button onClick={()=>navigate(`/seller/orderdetail/${order.id}`)} className="border text-sm border-gray-300 text-black px-4 py-2 rounded-sm lg:ml-2">
                   Xem chi tiết đơn hàng
               </button>
           </div>
       </div>
   </div>
}
export default React.memo(OrderItemChuanBi)