import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import { useContext, useEffect, useState } from "react";
import api from "../../config/APIUser";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

export default function ModalChooseCart({ orderDetail, open, setOpen }) {
  const navigate = useNavigate();
  const { fetchCart } = useContext(AppContext);
  const [quantity, setQuantity] = useState(1);
  const [indexChoose, setIndexChoose] = useState(0);

  const changeQuantity = (value) => {
    if (!isNaN(value) && value > 0) {
      setQuantity(Number(value));
    }
  };

  const addToCart = () => {
    toast.promise(
      api
        .post(
          "/cart/addtocart",
          {
            productDetailId: orderDetail.product.productDetails[indexChoose].id,
            soLuong: quantity,
          },
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
        .then((v) => v.data)
        .then((v) => {
          if (v.status === 200) {
            fetchCart();
          } else if (v.status === 401) {
            navigate("/login");
            throw new Error("Tài khoản không hợp lệ");
          } else {
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

  useEffect(() => {
    setIndexChoose(0);
  }, [open]);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        {orderDetail && (
          <form>
            <Stack spacing={2}>
              <p>Sản phẩm</p>
              <div className="flex flex-wrap items-center">
                <div className="lg:w-6/12 sm:w-12/12">
                  <img
                    src={orderDetail.product.hinhAnh}
                    alt={orderDetail.product.tenSanPham}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="w-full sm:w-10/12 p-2">
                  <h1 style={{width:"100px",overflow:"hidden"}} className="text-xs font-bold truncate">
                    {orderDetail.product.tenSanPham}
                  </h1>
                  <p className="text-xs">Shop: {orderDetail.product.shop.shopName}</p>
                </div>
              </div>

              <p>Chọn biến thể</p>
              <div className="container mx-auto p-4">
                <div
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  style={{ height: "230px", overflow: "auto" }}
                >
                  {orderDetail.product.productDetails.map((v, index) => (
                    <div
                      key={index}
                      onClick={() => setIndexChoose(index)}
                      style={{
                        position: "relative",
                        border: indexChoose === index ? "1px solid red" : "1px solid gray",
                      }}
                      className="flex items-center justify-center w-24 h-24"
                    >
                      <div className="text-center flex flex-col items-center">
                        <img
                          src={v.hinhAnh}
                          alt="Biến thể"
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
                  {orderDetail.product.productDetails[indexChoose].giaBan}
                </p>
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
                    {orderDetail.product.productDetails[indexChoose].soLuong} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              <Button type="button" onClick={addToCart}>
                Thêm vào giỏ hàng
              </Button>
            </Stack>
          </form>
        )}
      </ModalDialog>
    </Modal>
  );
}
