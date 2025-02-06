import { useNavigate } from "react-router-dom";
import { FaCommentDots } from "react-icons/fa";
// import Header from '../../components/client/Header';
// import api from '../../config/APIClient';
import { useContext, useEffect, useState } from "react";
// import { BsShop } from "react-icons/bs";
// import formatToVND from './FormatVnd';
import toast from "react-hot-toast";
import api from "../../config/APIUser";
import formatToVND from "../../components/client/FormatVND";
import { AppContext } from "../../App";
// import Button from "@mui/material/Button";
// import { DiW3C } from "react-icons/di";
import { FcShop } from "react-icons/fc";
function Checkout() {
  const navigate = useNavigate();
  const [cartList, setCartList] = useState(new Map());
  const [data, setData] = useState({
    voucherSan: 0,
    voucherShop: 0,
    tienHang: 0,
    phiShip: 0,
  });
  const { setFloadingPage } = useContext(AppContext);
  const deleteCart = (id, index, key) => {
    toast.promise(
      api
        .post("/cart/deletecart/" + id)
        .then((v) => v.data)
        .then((v) => {
          if (v.status === 200) {
            cartList.get(key).data.splice(index, 1);
            setFlag(flag + 1);
          } else {
            throw new Error(v.message);
          }
        }),
      {
        loading: "Đang xử lý",
        success: "Xóa thành công giỏ hàng",
        error: (error) => error.message,
      }
    );
  };

  const [flag, setFlag] = useState(0);
  const submit = () => {
    let ids = [];
    cartList.forEach((v, k) => {
      v.data.forEach((v) => {
        if (v.isCheck === true) {
          ids.push(v.id);
        }
      });
    });

    localStorage.setItem("ids", JSON.stringify(ids));
    navigate("/client/checkout");
  };

  const updatePlus = (v, p) => {
    if (v.sanPhamSoLuong + p > 0) {
      toast.promise(
        api
          .post(
            "/cart/updatecart",
            {
              id: v.id,
              productDetailId: v.id,
              soLuong: v.sanPhamSoLuong + p,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((v) => v.data)
          .then((vv) => {
            if (vv.status === 200) {
              v.sanPhamSoLuong += p;
              if (
                v.liveId != null &&
                v.soLuocDaDung + v.sanPhamSoLuong > v.soLuongGioHan &&
                p > 0
              ) {
                toast.error(
                  "Số lượng vược quá giới hạn đặt của live sẽ không còn áp dụng giá giảm"
                );
              }
              setFlag(flag + 1);
            } else {
              throw new Error(vv.message);
            }
          }),
        {
          loading: "Đang thêm vào giỏ hàng",
          success: "Cập nhật thành công vào giỏ hàng",
          error: (error) => error.message,
        }
      );
    } else {
      toast.error("Số lượng không được nhỏ hơn 1");
    }
  };

  useEffect(() => {
    let tongs = 0;
    cartList.forEach((v, k) => {
      v.tongDon = v.data.reduce((subtotal, sanPham) => {
        let giaSauKhuyenMai =
          sanPham.isCheck === true
            ? sanPham.giaBan * sanPham.sanPhamSoLuong -
              sanPham.giaBan *
                sanPham.sanPhamSoLuong *
                (sanPham.giaTriKhuyenMai / 100)
            : 0;
        return subtotal + giaSauKhuyenMai;
      }, 0);
      tongs += v.tongDon;
    });
    data.tienHang = tongs;
    setH(h + 1);
  }, [flag, cartList]);

  const [h, setH] = useState(0);
  // const tableRef = useRef(null);

  const getCartInList = () => {
    setFloadingPage();
    api
      .get("/cart/getcart")
      .then((v) => v.data)
      .then((v) => {
        const a = new Map(Object.entries(v.data));
        let map = new Map();
        a.forEach((k, v) => {
          map.set(v, {
            data: k,
          });
        });
        setCartList(map);
      });
  };

  useEffect((v) => {
    getCartInList();
  }, []);

  return (
    <div className="container w-full lg:w-[1200px] mx-auto bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-2 pb-2">Giỏ hàng</h1>
      <hr />
      <div>
        <div className="mb-6">
          {Array.from(cartList).map(([key, value]) => (
            <div className=" m-2.5  rounded-sm p-8 shadow">
              <div className="flex items-center justify-between bg-white flex-wrap pb-1 border-b border-solid border-gray-400">
                <div className="flex items-center ">
                  <div class="flex items-center ml-2">
                    <input
                      onClick={(e) => {
                        value.data.forEach((v) => {
                          if (v.sanPhamSoLuong <= v.soLuong) {
                            v.isCheck = e.target.checked;
                          }
                        });
                        setFlag(flag + 1);
                      }}
                      id="checked-checkbox"
                      type="checkbox"
                      value=""
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <FcShop className="size-8 ml-4 " />
                  <h2 className="text-lg sm:text-xl font-bold text-black-600">
                    {value.data[0].shopName}
                  </h2>
                </div>
                <button className="text-xs p-2 rounded-full hover:bg-blue-100 text-blue-500 flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
                  <FaCommentDots />
                  <span>Chat với shop</span>
                </button>
              </div>

              {value.data.map((v, index) => (
                <div className="flex flex-wrap mr-2 items-center justify-between px-4 mt-2 bg-white border-b border-solid border-gray-200 shadow-sm">
                  <div className=" mt-1 flex items-center space-x-4 w-full ">
                    <input
                      onClick={() => {
                        if (v.isCheck == undefined) {
                          v.isCheck = true;
                        } else {
                          v.isCheck = !v.isCheck;
                        }
                        setFlag(flag + 1);
                      }}
                      checked={v.isCheck === true}
                      disabled={v.sanPhamSoLuong > v.soLuong}
                      //type="radio"
                      type="checkbox"
                      // name="size"
                      //className="tf-check"
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      // id="s"
                    />

                    <img
                      src={v.hinhAnh}
                      alt="Chi Dện Bộ LED Unit Gold Dơn MG 1/100 Unicorn Banshee Phenex"
                      className="w-20 h-20 sm:w-25 sm:h-25 object-cover rounded"
                    />
                    <div className="flex flex-col w-full sm:w-4/12 bg-white py-4 rounded-lg">
                      <p className="text-lg font-bold text-gray-800 mb-2 overflow-hidden text-ellipsis whitespace-normal line-clamp-2">
                        {v.tenSanPham}
                      </p>

                      <span className="text-sm text-gray-600 flex items-center mb-1">
                        <span className="font-medium text-gray-700">
                          Phân loại hàng:
                        </span>
                        <span className="ml-2 text-gray-800">
                          {v.tenBienThe}
                        </span>
                      </span>

                      <span
                        className={`text-sm font-medium flex items-center ${
                          v.sanPhamSoLuong > v.soLuong
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        Trạng thái:{" "}
                        {v.sanPhamSoLuong > v.soLuong
                          ? "Hết hàng"
                          : `Còn ${v.soLuong} sản phẩm`}
                      </span>
                    </div>
                    <div className="w-full fl sm:w-2/12 text-center flex items-center justify-between space-x-2">
                      <div>
                        {v.giaTriKhuyenMai > 0 && (
                          <span className={"text-md sm:text-md text-gray-800"}>
                            <span className="line-through">
                              {formatToVND(v.giaBan)} {"   "}
                            </span>
                            <span className="text-md font-bold"> - </span>
                          </span>
                        )}
                        {
                          <span className="text-md sm:text-md text-blue-700">
                            {formatToVND(
                              v.giaBan - v.giaBan * (v.giaTriKhuyenMai / 100)
                            )}{" "}
                          </span>
                        }
                      </div>
                      {v.liveId != null && v.giaGiam > 0 && (
                        <div
                          className="inline-block text-red-500 font-semibold rounded-sm"
                          style={{ border: "1px solid red", fontSize: "10px" }}
                        >
                          SH Live{" "}
                          {v.giaGiam +
                            " % - " +
                            (v.soLuongGioHan < 0
                              ? "Không giới hạn"
                              : "còn: " + v.soLuongGioHan)}
                        </div>
                      )}
                    </div>
                    <div class="ml-4 flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => {
                          updatePlus(v, -1);
                        }}
                        class="px-3 py-2  border-l text-xl font-medium border-gray-300 text-gray-900 hover:bg-gray-100 focus:outline-none"
                      >
                        {" "}
                        -{" "}
                      </button>

                      <input
                        onChange={(e) => {
                          if (Number(e.target.value)) {
                            updatePlus(v, e.target.value - v.sanPhamSoLuong);
                          }
                        }}
                        value={v.sanPhamSoLuong}
                        style={{ width: "60px" }}
                        class=" text-center  text-gray-700 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => updatePlus(v, 1)}
                        class="px-3 py-2 border-r border-gray-300 text-gray-900 hover:bg-gray-100 text-lg font-medium focus:outline-none"
                      > + 
                      </button>
                    </div>

                    <div className="w-full sm:w-2/12 text-right">
                      <p className="text-base sm:text-md text-right text-blue-700 font-medium">
                        {formatToVND(
                          (v.giaBan - v.giaBan * (v.giaTriKhuyenMai / 100)) *
                            v.sanPhamSoLuong
                        )}
                      </p>
                    </div>
                    <div className="w-full sm:w-2/12 text-right ">
                      <button
                        onClick={() => {
                          deleteCart(v.id, index, key);
                        }}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-12 gap-4 mt-3 items-start">
                <div className="col-span-12 lg:col-span-6  "></div>

                <div className="font-medium col-span-12 lg:col-span-6 text-right mt-2">
                  <span className="text-md sm:text-md mr-2 ">
                    Tiền sản phẩm:{" "}
                  </span>
                  <span className="text-lg sm:text-md text-blue-700">
                    {" "}
                    {formatToVND(value.tongDon)}
                  </span>
                  <br />
                  <br />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: `${cartList.size < 1 ? "299px" : "0px"}` }}></div>
        <div className="mt-3 shawdow-sm border-blue-300 p-6 m-2.5 rounded-sm">
          <hr className="text-gray-900 border-dotted" />
          <div className="my-4">
            <div className="flex justify-between mb-2">
              <span></span>
              <span className="font-medium text-blue-700 text-lg">
                Tổng tiền hàng: {formatToVND(data.tienHang)}
              </span>
            </div>
          </div>
          <hr />
          <div className="mt-6 flex  justify-end">
            <p className="text-xs sm:text-xs text-gray-500 mt-4 lg:pr-[480px]">
              Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo
              <a href="//" className="text-blue-500 hover:underline">
                {" "}
                Điều khoản Model World
              </a>
            </p>
            <button
              onClick={() => {
                submit();
              }}
              type="button"
              className="bg-blue-500 text-white px-8 py-3 rounded-sm shadow hover:bg-blue-600"
            >
              Mua hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
