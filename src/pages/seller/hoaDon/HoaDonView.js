import {useState } from "react";
import HoaDonTab from "./Tab";
import ChoThanhToan from "./ChoThanhToan";
import ChuanBiHang from "./hoaDonState/HoaDonChoLay";
import OrderDefaault from "./OrderDefault";
import DonHuy from "./DonHuy";
import OrderFinish from "./OrderFinish";
const HoaDonView=()=>{   
    const [orderTab,setOrderTab]=useState(1)
    
    return <>
        <div  className="bg-light container mx-auto p-4  bg-white rounded-[7px]">
            <p className="text-black-800 font-semibold">Kênh người bán &gt; Hóa đơn &gt; Danh sách hóa đơn</p>
            
            <HoaDonTab setTab={setOrderTab} />
            {(() => {
                        switch (orderTab) {
                            case 1:
                                return <ChoThanhToan />
                            case 2:
                                return <ChuanBiHang />
                            case 3:
                                return <OrderDefaault key={1} trangThai={3} />
                            case 4:
                                return <OrderDefaault key={2} trangThai={4}/>
                            case 5:
                                return <OrderFinish key={3} trangThai={5}/>
                            case 6:
                                return <OrderDefaault key={4} trangThai={6}/>
                            default:
                                return <DonHuy />
                        }
            })()}
            
            <br/>
            
        </div>

    </>
}
export default HoaDonView;