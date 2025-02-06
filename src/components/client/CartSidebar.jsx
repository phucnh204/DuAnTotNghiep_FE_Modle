import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { AppContext } from '../../App';
import formatToVND from './FormatVND';
import { Link } from 'react-router-dom';

export default function SwipeableTemporaryDrawer() {
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
  const {carts } = React.useContext(AppContext);
  console.log(carts)

  const list = (
    <Box
      sx={{ width: 300 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2 }}>
        <h6>Cart</h6>
      </Box>
      <Divider />
      <List>
        {carts!=null&&carts.map((item) => (
          <ListItem key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src={item.hinhAnh} alt={item.name} style={{ width: 50, height: 50 }} />
            <Box sx={{ flexGrow: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.tenSanPham} <span className='text-red-500'>{item.giaTriKhuyenMai>0?"Giảm "+item.giaTriKhuyenMai+" %":""}</span></div>
              <div style={{ fontSize: '12px', color: '#777' }}>
                {item.sanPhamSoLuong} x {formatToVND(item.productGiaBan)} đ
              </div>
            </Box>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <div style={{ marginBottom: 8, fontSize: '16px', fontWeight: 'bold' }}>
          Tổng tiền: {carts!=null&&formatToVND(carts.reduce((acc, item) => {
  const priceAfterDiscount = item.giaBan -(item.giaBan*( item.giaGiam/100));
  return acc + priceAfterDiscount * item.sanPhamSoLuong;
}, 0))}
          {/* Total: {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)} € */}
        </div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 1 }}
        >
          
          <Link to={"/client/cart"} style={{textDecoration:"none"}}>Xem giỏ hàng</Link>
        </Button>
      
      </Box>
    </Box>
  );

  return (
    <div>
     {carts!=null&& <Button onClick={toggleDrawer(true)}><img
                          src="/assets/client/images/icon/grocery-store.png"
                          alt
                          className
                        /></Button>}
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list}
      </SwipeableDrawer>
    </div>
  );
}
