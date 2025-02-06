import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { Badge, useMediaQuery } from '@mui/material';
import { AppContext } from '../../App';
// import formatToVND from './FormatVND';
import { Link } from 'react-router-dom';
// import { BiNotification } from 'react-icons/bi';
import { MdNotifications } from 'react-icons/md';
const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'white',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 420,
        fontSize: theme.typography.pxToRem(12),
    },
}));

 function  AnnounceTooltip() {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const tooltipPlacement = isSmallScreen ? 'top' : 'left-start';
    const {announces } = React.useContext(AppContext);

    return (
        <div>
            <HtmlTooltip
                className="shadow-md"
                arrow
                placement={tooltipPlacement}
                title={
                    <React.Fragment>
                        <Link to={"/client/my-account-nof-promotions"}  className="text-xs" style={{ width: '300px' }} color="inherit">
                            Xem tất cả
                        </Link>
                        
                        <div style={{height:"250px ",overflowY: "auto", overflowX: "hidden"}} className='canvas-body tf-filter-group filter-color current-scrollbar mb_36 collapse show'>
                            { announces!=null&&
                                announces.data.map((v,index)=><div className="mt-2 hover:bg-gray-100 mb-2 flex items-center bg-white rounded-lg shadow-xs p-4 relative overflow-hidden w-96">
                                    {v.trangThaiDoc==0&&<div style={{backgroundColor:"red",zIndex:"999"}} className=" rounded-md absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded-sm">
                                        Chưa đọc
                                    </div>}
    
                                    <Link to={"/product/"+v.sanPhamId} className="w-16 h-16 rounded-sm overflow-hidden mr-4">
                                        <img style={{width:"70px"}} src={v.thongBao.hinhAnh}  />
                                    </Link>
    
                                    <div className="flex" style={{ alignItems: 'center' }}>
                                        <div>
                                            <p className="font-bold text-gray-800">{v.thongBao.tieuDe} </p>
                                            <p className="text-sm">Loại thông báo: {v.thongBao.loaiThongBao}</p>
                                            <p className="text-red-600 text-sm">Từ: {v.thongBao.account.tenTaiKhoan}</p>
                                        </div>
                                        <div className="absolute right-0 top-0 h-full w-8 bg-white mt-2">
                                      
                                        </div>
                                    </div>
                                    
                                </div>)
                            }
                        </div>
                    </React.Fragment>
                }
            >
            {announces!=null&&<Badge color="secondary" badgeContent={announces.countNotReaded}>
                <MdNotifications size={20}/>
                </Badge>}
            </HtmlTooltip>
        </div>
    );
}
export default React.memo(AnnounceTooltip)