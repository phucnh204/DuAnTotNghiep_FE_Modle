import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { Chip, Typography, useMediaQuery } from '@mui/material';
import { BiSolidDiscount } from 'react-icons/bi';
import api from '../../config/APIUser';
import toast from 'react-hot-toast';
import formatToVND from '../../components/client/FormatVND';
// import { FaAccessibleIcon } from 'react-icons/fa';
const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'white',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 420,
        fontSize: theme.typography.pxToRem(12),
    },
}));

 function  VariableWidth({keys,values,setFlag,flag}) {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const tooltipPlacement = isSmallScreen ? 'top' : 'left-start';
    const [isFetch,setIsfetch]=React.useState(0)
    const [data,setData]=React.useState({

    })
    // React.useEffect(()=>{
    
    //     setData({
    //         "isFetch":0,
    //         "dataFetch":values.data.map((v) => {
    //             return {
    //                 "giaDaGiam":v.giaDaGiam!==undefined?v.giaDaGiam:0.0,
    //                 "productId":v.sanPhamId,
    //                 "soLuong":v.sanPhamSoLuong,
    //                 "giaBan":v.giaBan
    //             }
    //         })
    //     })
    // },[flag])
    
    const [vouchers,setVouchers]=React.useState([])
    const fetchVoucher=()=>{
        data.dataFetch=values.data.map((v) => {
                return {
                    "giaDaGiam":v.giaDaGiam!==undefined?v.giaDaGiam:0.0,
                    "productId":v.sanPhamId,
                    "soLuong":v.sanPhamSoLuong,
                    "giaBan":v.giaBan
                }
            })
        // if(data.isFetch===0||1===1){
            api.post(`/cart/getvoucherapply/${keys}`,data.dataFetch,{
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(v=>v.data).then(v=>{
                
                setVouchers(v.data)
                
            })
            data.isFetch=1
        // }
    }

    const getVoucher=(index,voucherId)=>{
        api.post(`/voucher/getvoucher/${voucherId}`).then(v=>v.data).then(v=>{
            if(v.status===200){
                toast.success("Lấy voucher thành công")
                vouchers[index].accountId=111;
                setIsfetch(isFetch+1)
            }else{
                toast.error("Voucher có thể đaz hết hoặc không hợp lệ")
            }
        })
    }

    return (
        <div>
            <HtmlTooltip
                className="shadow-md"
                arrow
                placement={tooltipPlacement}
                title={
                    <React.Fragment>
                        <Typography  className="text-xs" style={{ width: '300px' }} color="inherit">
                            Tami voucher
                        </Typography>
                        <div className='canvas-body' style={{height:"250px ",overflow:"auto",overflowY: "auto", overflowX: "hidden"}}>
                            <div style={ {display:`${vouchers.length<1?"block":"none"}`}}>
                                <p className='text-center text-sm text-gray-400'>Không có voucher nào</p>
                            </div>
                            {
                                vouchers.map((v,index)=><div className="mt-2  mb-2 flex items-center bg-white rounded-lg shadow-xs p-4 relative overflow-hidden w-96">
                                    <div className="absolute border-bottom top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                        Tốt nhất
                                    </div>
    
                                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                                        <BiSolidDiscount color="red" size={40} />
                                    </div>
    
                                    <div className="flex" style={{ alignItems: 'center' }}>
                                        <div>
                                            <p className="font-bold text-gray-800">Giảm <sup>{v.loaiVoucher==1?"%":"đ"}</sup>{v.giaTriGiam}</p>
                                            <p className="font-medium text-gray-600 text-sm">Ước tính giảm cho đơn này:  {formatToVND(v.priceDiscount)}</p>
                                            <p className="font-medium text-gray-600 text-sm">Đơn Tối Thiểu: {formatToVND(v.donToiThieu)}</p>
                                            <p className="font-medium text-gray-600 text-sm"> {v.voucherName}</p>
                                            <p className="font-medium text-gray-500 text-xs mt-1">
                                                Còn lại {v.voucherSoLuocDung-v.voucherSoLuocDaDung} lượt
                                                <a  className="text-blue-500 ml-1">
                                                    {v.canApply==true?"":"Không đủ điều kiện"}
                                                </a>
                                            </p>
                                            {v.accountId==null?<p onClick={()=>getVoucher(index,v.voucherId)} className="cursor-pointer text-gray-600 text-sm"> 
                                                <Chip  label="Nhận ngay" variant="outlined" /></p>:""}
                                        </div>
                                        <div className="absolute right-0 top-0 h-full w-8 bg-white mt-2">
                                            <input  className='cursor-pointer' onClick={()=>{
                                                vouchers.forEach(vv=>{
                                                    if(v.voucherId===vv.voucherId){
                                                        vv.check=true
                                                        values.voucherShop=vouchers[index]
                                                        setFlag(flag+1)
                                                    }else{
                                                        vv.check=false;
                                                    }
                                                })
                                                setIsfetch(isFetch+1)
                                            }} checked={v.check===true} disabled={v.accountId===null||!v.canApply} name={`v-${keys}`} type="radio" />
                                        </div>
                                    </div>
    
                                </div>)
                            }
                        </div>
                    </React.Fragment>
                }
            >
                <Button onMouseOver={()=>{
                                fetchVoucher() 
                }}><span className='text-red-600 mr-1'>{values.voucherShop!=null?"Giảm "+formatToVND(values.voucherShop. priceDiscount)+"    " :""}</span>     Chọn voucher shop</Button>
            </HtmlTooltip>
        </div>
    );
}
export default React.memo( VariableWidth) 