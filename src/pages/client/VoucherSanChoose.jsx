import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { Chip, Typography, useMediaQuery } from '@mui/material';
import { BiSolidDiscount } from 'react-icons/bi';
import api from '../../config/APIUser';
const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'white',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 420,
        fontSize: theme.typography.pxToRem(12),
    },
}));

 function VoucherSanChoose({datas,setFlag,flag,order}) {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const tooltipPlacement = isSmallScreen ? 'top' : 'left-start';
    const [isFetch,setIsfetch]=React.useState(0)
    const [data,setData]=React.useState({
        "isFetch":0,
    })

    const [vouchers,setVouchers]=React.useState([])
    const fetchVoucher=()=>{
        if(data.isFetch===0){
            api.get(`/voucher/getvouchersanapplys`).then(v=>v.data).then(v=>{
                setVouchers(v)
            })
            data.isFetch=1
        }
    }

    const getVoucher=(index,voucherId)=>{
        alert(voucherId)
        api.post(`/voucher/getvouchersan/${voucherId}`).then(v=>v.data).then(v=>{
            if(v.status===200){
                alert("Lấy thành công voucher")
                vouchers[index].accountId=111;
                setIsfetch(isFetch+1)
                
            }else{
                alert(v.message)
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
                            Voucher sàn
                        </Typography>
                        <div style={{height:"250px ",overflow:"auto"}}>
                            <div style={ {display:`${vouchers.length<1?"block":"none"}`}}>
                                <img style={{display:"block",width:"60px",margin:"0 auto"}} src={order}/>
                                <p className='text-center text-sm text-gray-400'>Không có voucher nào</p>
                            </div>
                            {
                                vouchers.map((v,index)=><div className="mt-2  mb-2 flex items-center bg-white rounded-lg shadow-xs p-4 relative overflow-hidden w-96">
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                        Tốt nhất
                                    </div>
    
                                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                                        <BiSolidDiscount color="red" size={40} />
                                    </div>
    
                                    <div className="flex" style={{ alignItems: 'center' }}>
                                        <div>
                                            <p className="font-bold text-gray-800">Giảm <sup>{v.voucher.loaiVoucher==1?"%":"đ"}</sup>{v.voucher.giaTriGiam}</p>
                                            <p className="text-gray-600 text-sm">Hình thức giảm: <sup>đ</sup>{v.voucher.hinhThucApDung===1?"Theo đơn hàng":"Theo phí ship"}</p>
                                            <p className="text-gray-600 text-sm">Đơn Tối Thiểu <sup>đ</sup> {v.voucher.donToiThieu}</p>
                                            <p className="text-gray-600 text-sm"> {v.tenVoucher}</p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                Còn lại {v.voucher.soLuocDung-v.voucher.soLuocDaDung} lượt
                                                <a href="#" className="text-blue-500 ml-1">
                                                    Điều Kiện
                                                </a>
                                            </p>
                                            <p onClick={()=>getVoucher(index,v.voucher.id)} className="cursor-pointer text-gray-600 text-sm">

                                            <Chip className='cursor-pointer'  label="Nhận ngay" variant="outlined" />
                                            </p>
                                        </div>
                                        <div className="absolute right-0 top-0 h-full w-8 bg-white mt-2">
                                            <input className='cursor-pointer' onClick={()=>{
                                                vouchers.forEach(vv=>{
                                                    if(v.voucher.id===vv.voucher.id){
                                                        vv.voucher.check=true
                                                        order.voucherSan=vv.voucher
                                                    }else{
                                                        vv.voucher.check=false;
                                                    }
                                                })
                                                setFlag(flag+1)
                                            }} checked={v.voucher.check===true}  disabled={v.accountId===null||v.voucher.donToiThieu>datas.tienHang} name={`v-${2}`} type="radio" />
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
                }}>Chọn voucher sàn</Button>
            </HtmlTooltip>
        </div>
    );
}

export default React.memo(VoucherSanChoose)