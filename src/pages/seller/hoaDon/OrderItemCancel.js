import React, { useState } from "react"

const OrderItemCancel=({order,isCheckTab})=>{
    const [flag,setFlag]=useState(0)
    return <div className="w-11/12 mx-auto bg-white shadow-md rounded-sm overflow-hidden mb-4">
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
                    order.orderDetails.map(v=><div className="p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-12/12">
                        <div className="flex-shrink-0">
                            <img style={{width:'70px'}} src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmzl2bj75yhkc1_tn" alt="5D Mask"  />
                        </div>
                        <div className="flex-grow w-12/12">
                            <h2 className="font-semibold text-sm text-green-600">{v.product.product.tenSanPham}</h2>
                            <p className="text-gray-500 text-xs">{v.product.mauSac.tenMau} - {v.product.kichThuoc.tenKichThuoc}</p>
                            <div className="flex items-center justify-between mt-2">
                                <p className='text-xs'>x{v.soLuong} x {v.giaBan}</p>
                                <p className='text-xs text-red-500'><sup>đ</sup>{v.soLuong*v.giaBan}</p>
                            </div>
                        </div>
                    </div>)
                }
                <div  className='w-[95%] h-[1px] bg-lightgray mx-auto my-1.5 mb-3'></div>
                <p  className='text-xs text-right mr-5 pr-1'>Voucher shop: <span className='text-sm text-red-500'> 
                    <sup>đ</sup>{order.tienTru}</span></p>
                <p className='text-xs text-right mr-5 pr-1'>Voucher sàn: <span className='text-sm text-red-500'><sup>đ</sup>{order.tienTruVoucherSan}</span></p>
                <p className='text-xs text-right mr-5 pr-1'>Thành tiền: <span className='text-sm text-red-500'><sup>đ</sup>{order.tongTien}</span></p>
                <div className="flex space-x-2 p-4 justify-content-between w-12/12 " >
                    {/* <button className="bg-red-600 text-white text-sm px-4 py-2 rounded-sm">Report</button> */}
                    <div>
                    <button onClick={()=>alert(order.lyDo)} className="bg-red-600 text-white text-sm px-4 py-2 rounded-sm">Xem lý do hủy đơn</button>
                    <button className="border text-sm border-gray-300 text-black px-4 py-2 rounded-sm lg:ml-2">Xem chi tiết đơn hàng</button>
                    <button  className="border text-sm border-gray-300 text-black px-4 py-2 rounded-sm lg:ml-2">Hoàn tất đơn</button>
                    </div>
                        
                </div>
    </div>
}
export default (OrderItemCancel)