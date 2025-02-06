import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
import { BsCartPlus } from 'react-icons/bs';
import { BiCart, BiShoppingBag } from 'react-icons/bi';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';

function SwipeableTemporaryDrawer({products,setProduct}) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 400 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
      <div class="container mx-auto p-2 space-y-4" style={{height:"450px",overflow:"auto",scrollbarWidth: 'thin', // Firefox
                                scrollbarColor: 'gray', // Firefox
                                scrollBehavior: 'smooth'}} >
                {products.map((v, index) =>  {
                    const { minPrice, maxPrice } = v.p.productDetails.reduce((acc, item) => {
                        acc.minPrice = acc.minPrice === null ? item.giaBan : Math.min(acc.minPrice, item.giaBan);
                        acc.maxPrice = acc.maxPrice === null ? item.giaBan : Math.max(acc.maxPrice, item.giaBan);
                        return acc;
                    }, { minPrice: null, maxPrice: null });
                    return (
                        <div key={index} class="bg-white shadow-md rounded-sm overflow-hidden flex p-1 items-start space-x-4">
                        
                        <div class="relative w-24 h-24 flex-shrink-0">
                            <img src={v.p.hinhAnh} />
                         </div>
                        <div class="flex-1">
                            <h2 class="text-sm text-truncate font-semibold truncate">{v.p.tenSanPham}</h2>
                            
                            <div class="flex items-center space-x-2 mt-1">
                            <span class="text-xs bg-red-500 text-white px-2 py-1 rounded-sm">Giá chỉ có trên Live <span className='text-yellow-500'>{v.giaGiam} %</span> <span className='text-yellow-500'>{v.giaTriKhuyenMai!=null?`+ Khuyến mãi${v.giaTriKhuyenMai} %`:""}</span></span>
                            </div>
                            <span class="text-gray-400  text-xs">Giá gốc: <span className='line-through'>{minPrice} - {maxPrice}</span></span>
                            <p class="text-xs text-red-500 font-bold mt-1">Còn: {minPrice-v.giaGiam} -{maxPrice-v.giaGiam}</p>
                            <div class="flex items-center mt-2">
                                <BsCartPlus onClick={()=>{
                                    setProduct(v)
                                }} color='red' size={30} style={{padding:"7px"}}  className='hover:scale-110 transition-transform duration-100 bg-red-200 rounded-sm'/>
                                <BiShoppingBag color='red' size={30} style={{padding:"7px"}} className='bg-red-200 ml-2 rounded-sm'/>

                            </div>
                        </div>
                        </div>
                    )
                })}
                </div>
      </List>
      <Divider />
      <List>
        
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}> <BiCart color='yellow' size={23}/> </Button>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
    </div>
  );
}
export default  React.memo(SwipeableTemporaryDrawer)