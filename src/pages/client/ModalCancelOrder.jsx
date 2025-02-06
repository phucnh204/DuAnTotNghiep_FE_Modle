import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Stack from '@mui/joy/Stack';
import { useState } from 'react';
import { BiAddToQueue } from 'react-icons/bi';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import toast from 'react-hot-toast';
import api from '../../config/APIUser';
// import gsap from 'gsap';

export default function ModalCancel({id,index,reload}) {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState(0); // State để theo dõi lý do hủy
  const cancelOrder = () => {
    toast.promise(
      api
        .post(`/order/cancelsingle/${id}/${reasons[selectedReason]}`)
        .then((v) => v.data)
        .then((v) => {
          if (v.status == 200) {
 
            reload(index);
          } else {
            throw new Error(v.message);
          }
        }),
      {
        loading: "Đang thực hiện",
        success: "Hủy đơn thành công",
        error: (error) => error.message,
      }
    );
  };
  const reasons = [
    "Tôi muốn thay đổi một số thông tin đơn hàng" ,
    "Tôi muốn thêm mã giảm giá" ,
    "Tôi muốn thay đổi sản phẩm" ,
    "Tôi muốn thay đổi số lượng đặt hàng" ,
    "Không có nhu cầu mua nữa" ,
    "Lý do khác" ,
  ];
  return (
    <>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<BiAddToQueue />}
        onClick={() => setOpen(true)}
      >
        Hủy đơn hàng
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          sx={{
            marginLeft:"10px",
            width: '600px', // Tăng chiều rộng modal
            maxWidth: '90%', // Đảm bảo không vượt màn hình nhỏ
          }}
        >
          <DialogTitle>Nội dung hủy đơn</DialogTitle>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              console.log("Lý do hủy:", selectedReason); // Log lý do hủy đơn
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                {/* <FormLabel id="demo-controlled-radio-buttons-group">Lý do hủy đơn</FormLabel> */}
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={selectedReason}
                  onChange={(e) =>{
                    setSelectedReason(Number(e.target.value))
                  }}
                >
                  <FormControlLabel checked={0==selectedReason} value="0" control={<Radio />} label="Tôi muốn thay đổi một số thông tin đơn hàng" />
                  <FormControlLabel checked={1==selectedReason} value="1" control={<Radio />} label="Tôi muốn thêm mã giảm giá" />
                  <FormControlLabel checked={2==selectedReason} value="2" control={<Radio />} label="Tôi muốn thay đổi sản phẩm" />
                  <FormControlLabel checked={3==selectedReason} value="3" control={<Radio />} label="Tôi muốn thay đổi số lượng đặt hàng" />
                  <FormControlLabel checked={4==selectedReason} value="4" control={<Radio />} label="Không có nhu cầu mua nữa" />
                  <FormControlLabel checked={5==selectedReason} value="5" control={<Radio />} label="Lý do khác" />
                </RadioGroup>
              </FormControl>
              <Button onClick={()=>cancelOrder()} type="buttin">Hủy đơn</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}
