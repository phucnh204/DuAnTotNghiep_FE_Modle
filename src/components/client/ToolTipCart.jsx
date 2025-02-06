// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
// import { Typography, useMediaQuery } from '@mui/material';
// import { AppContext } from '../../App';
// import formatToVND from './FormatVND';
// import { Link } from 'react-router-dom';
// const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
//     [`& .${tooltipClasses.tooltip}`]: {
//         backgroundColor: 'white',
//         color: 'rgba(0, 0, 0, 0.87)',
//         maxWidth: 420,
//         fontSize: theme.typography.pxToRem(12),
//     },
// }));

//  function  VariableWidth() {
//     const isSmallScreen = useMediaQuery('(max-width:600px)');
//     const tooltipPlacement = isSmallScreen ? 'top' : 'left-start';
//     const {carts } = React.useContext(AppContext);

//     return (
//         <div style={{zIndex:9999}}>
//             <HtmlTooltip
//                 className="shadow-md"
//                 arrow
//                 placement={tooltipPlacement}
//                 title={
//                     <React.Fragment>
//                         <Link to={"/client/cart"}   className="text-xs" style={{ width: '300px' }} color="inherit">
//                             Giỏ hàng
//                         </Link>
//                         <div className="canvas-body " style={{height:"250px ",overflowY: "auto", overflowX: "hidden"}}>
//                             { carts!=null&&
//                                 carts.map((v,index)=><div className="mt-2 hover:bg-gray-100 mb-2 flex items-center bg-white rounded-lg shadow-xs p-4 relative overflow-hidden w-96">
//                                     {v.liveId!==null&&<div style={{backgroundColor:"red"}} className="absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded-sm">
//                                         Live
//                                     </div>}
    
//                                     <Link to={"/product/"+v.sanPhamId} className="w-16 h-16 rounded-full overflow-hidden mr-4">
//                                         <img style={{width:"70px"}} src={v.hinhAnh}  />
//                                     </Link>
    
//                                     <div className="flex" style={{ alignItems: 'center' }}>
//                                         <div>
//                                             <p className="font-bold text-gray-800">{v.tenSanPham} </p>
//                                             <p className="text-red-600 text-sm"> { formatToVND(v.sanPhamSoLuong*v.giaBan)}đ</p>
//                                         </div>
//                                         <div className="absolute right-0 top-0 h-full w-8 bg-white mt-2">
                                      
//                                         </div>
//                                     </div>
//                                     {v.giaTriKhuyenMai!=null&&<div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
//                                         {v.giaTriKhuyenMai} %
//                                     </div>}
                                    
//                                 </div>)
//                             }
//                         </div>
//                     </React.Fragment>
//                 }
//             >
//                 <img
//                           src="/assets/client/images/icon/grocery-store.png"
//                           alt
//                           className
//                         />
//             </HtmlTooltip>
//         </div>
//     );
// }
// export default React.memo(VariableWidth)