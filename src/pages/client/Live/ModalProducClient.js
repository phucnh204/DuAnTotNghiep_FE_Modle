import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import {  BiShoppingBag } from 'react-icons/bi';
import { BsCartPlus } from 'react-icons/bs';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'black',
  border: '1px solid violet',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

 function ProductInlive({ setProduct,products,sendMessage}) {
  const [open, setOpen] = useState(false);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button style={{display:"none"}} variant="contained" id='cartlive' color="primary" onClick={handleOpen}>
        Mở giỏ hàng
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
          <p variant="h6" component="h2" className="text-center mb-4 text-white">
            Giỏ hàng của shopcdscsd
          </p>
          {/* <ModalChooseProductLive product={product}/> */}

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
                            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFJqLSirTP61Ok4xi6Gmmu-wodHLtCpzg91w&s"} />
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
                                  // alert("Jelejljc")
                                    // setProduct(v)
                                }} color='red' size={30} style={{padding:"7px"}}  className='hover:scale-110 transition-transform duration-100 bg-red-200 rounded-sm'/>
                                <BiShoppingBag color='red' size={30} style={{padding:"7px"}} className='bg-red-200 ml-2 rounded-sm'/>

                            </div>
                        </div>
                        </div>
                    )
                })}
                </div>
          <Button 
            onClick={handleClose} 
            variant="outlined" 
            color="secondary" 
            className="mt-4 w-full"
          >
            Đóng
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
export default React.memo(ProductInlive);