import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import { useContext, useEffect, useState } from "react";
import api from "../../config/APIUser";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

 function ModalChooseCartVoucher({
  voucherShop,
  open,
  setOpen,
}) {
  const navigate = useNavigate();
  const { fetchCart } = useContext(AppContext);

  const [quantity, setQuantity] = useState(1);
const [orderDetail,setOrderDetail]=useState(null);
  const changeQuantity = (value) => {
    if (!isNaN(value)) {
      if (value > 0) {
        setQuantity(Number(value));
      }
    }
  };

  useEffect(()=>{
    if(voucherShop!=null){
        setIndexChoose(0)
        setOrderDetail(voucherShop.voucherShopDetails[0].product.productDetails)
    }
  },[voucherShop])
  const addToCart = () => {
    toast.promise(
      api
        .post(
          "/cart/addtocart",
          {
            productDetailId:orderDetail[indexChoose].id,
            soLuong: quantity,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((v) => v.data)
        .then((v) => {
          if (v.status === 200) {
            fetchCart();
          } else if (v.status === 401) {
            navigate("/login");
            throw new Error("Tài khoản không hợp lệ");
          } else if (v.status !== 200) {
            throw new Error(v.message);
          }
        }),
      {
        loading: "Đang thêm vào giỏ hàng",
        success: "Thêm thành công vào giỏ hàng",
        error: (error) => error.message,
      }
    );
  };

  const [indexChoose, setIndexChoose] = useState(0);

  useEffect(() => {
    setIndexChoose(0);
  }, [open]);

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <Grid container spacing={2} sx={{ maxWidth: "800px", margin: "0 auto" }}>
            {/* Cột 1: Voucher Shop */}
            {voucherShop != null && (
              <Grid item xs={12} sm={6}>
                <Grid  container spacing={2} sx={{ maxHeight: "400px", overflowY: "auto" }}>
                  {voucherShop.voucherShopDetails.map((v, index) => (
                    <Grid  item xs={12} sm={12} md={10} key={index}>
                      <Card  sx={{ maxWidth: "100%" }}>
                        <CardActionArea>
                          <img
                            style={{ height: "150px", width: "100%", objectFit: "cover" }}
                            src={v.product.hinhAnh}
                            alt={v.product.tenSanPham}
                          />
                          <CardContent>
                            <Typography onClick={()=>{
                                // console.log(v.product.productDetails);
                                setOrderDetail(v.product.productDetails)
                            }}
                              gutterBottom
                              variant="p"
                              component="div"
                              sx={{
                                whiteSpace: "nowrap", // Ngăn không cho xuống dòng
                                overflow: "hidden", // Ẩn phần vượt ngoài
                                textOverflow: "ellipsis", // Thêm dấu "..." khi quá dài
                              }}
                            >
                              {v.product.tenSanPham}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}></Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Cột 2: Order Detail */}
            {orderDetail !== null && (
              <Grid item xs={12} sm={6}>
                <form>
                  <Stack spacing={2}>
                    <p>Chọn biến thể</p>
                    <div className="container mx-auto p-4">
                      <div
                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 body-canvas"
                        style={{ height: "230px", overflow: "auto" }}
                      >
                        {orderDetail.map((v, index) => (
                          <div
                            onClick={() => setIndexChoose(index)}
                            style={{
                              position: "relative",
                              border: indexChoose === index ? "1px solid red" : "1px solid gray",
                            }}
                            className="flex items-center justify-center w-30 h-24"
                          >
                            <div className="text-center flex flex-col items-center">
                              <img
                                src={v.hinhAnh}
                                alt="Trắng"
                                className="mx-auto w-10 h-10 object-cover"
                              />
                              <p className="font-medium text-xs mt-1">TRẮNG</p>
                            </div>
                            {indexChoose === index && (
                              <span
                                style={{
                                  position: "absolute",
                                  bottom: "0",
                                  right: "0",
                                  zIndex: "9909",
                                  color: "red",
                                }}
                                className="text-red-500"
                              >
                                ✔
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <p className="mt-2 font-semibold">
                        Giá bán:{" "}
                        {orderDetail!=null?orderDetail[indexChoose].giaBan:""}
                      </p>
                      {orderDetail != null && (
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border rounded">
                            <button
                              type="button"
                              onClick={() => changeQuantity(quantity - 1)}
                              className="px-4 py-2 border-r text-gray-700 hover:bg-gray-100"
                            >
                              −
                            </button>
                            <input
                              onChange={(e) => changeQuantity(e.target.value)}
                              type="text"
                              value={quantity}
                              className="w-12 text-center text-red-500 focus:outline-none"
                            />
                            <button
                              onClick={() => changeQuantity(quantity + 1)}
                              type="button"
                              className="px-4 py-2 border-l text-gray-700 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-gray-500">
                          {orderDetail!=null?orderDetail[indexChoose].soLuong:""}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button type="button" onClick={addToCart}>
                      Thêm vào giỏ hàng
                    </Button>
                  </Stack>
                </form>
              </Grid>
            )}
          </Grid>
        </ModalDialog>
      </Modal>
    </>
  );
}

export default React.memo(ModalChooseCartVoucher)