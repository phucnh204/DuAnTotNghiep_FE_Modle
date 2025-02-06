import { FaChevronDown, FaMapMarkerAlt, FaShippingFast } from "react-icons/fa";
import { MdCardGiftcard, MdOutlineSpeakerNotes } from "react-icons/md";
import { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { FcShop } from "react-icons/fc";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { BiSolidDiscount } from "react-icons/bi";
import toast from "react-hot-toast";
import api from "../../config/APIUser";
import formatToVND from "../../components/client/FormatVND";
import VariableWidth from "./VariableWidth";
import VoucherSanChoose from "./VoucherSanChoose";
import { AppContext } from "../../App";
function Checkouts() {
  const [cartList, setCartList] = useState(new Map());
  const [diaChi, setDiaChi] = useState(null);
  const navigate = useNavigate();
  const [flag, setFlag] = useState(0);
  const [order, setOrder] = useState({
    thanhToan: {
      id: 2,
    },
  });
  const [data, setData] = useState({
    voucherSan: 0,
    voucherShop: 0,
    tienHang: 0,
    phiShip: 0,
  });
  const submit = () => {
    order.diaChi = diaChi;
    let cartItem = [];
    const result = {};
    cartList.forEach((v, k) => {
      v.data.forEach((v) => {
        cartItem.push(v.id);
      });
      v.data = [];
      result[k] = v;
      if (v.voucherShop !== undefined) {
        v.voucherShopId = {
          id: v.voucherShop.voucherId,
        };
        v.voucherShop = undefined;
      }
    });
    order.items = cartItem;
    order.orderShop = result;
    toast.promise(
      api
        .post("/order/addorder", order, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((v) => v.data)
        .then((v) => {
          if (v.status == 200) {
            localStorage.getItem("ids");
            if (order.thanhToan.id === 2) {
              window.open(v.data, "_blank");
            } else {
              navigate("/client/my-account-order");
            }
          } else {
            throw new Error(v.message);
          }
        }),
      {
        loading: "Đang chuẩn bị",
        success: "Đã đặt đơn thành công",
        error: (error) => error.message,
      }
    );
  };
  
  
  useEffect(() => {
    cacul();
  }, [flag]);
  const cacul = () => {
    let tongs = 0;
    data.voucherShop = 0;
    data.phiShip = 0;
    cartList.forEach((v, k) => {
      let ton = v.data.reduce((subtotal, sanPham) => {
        sanPham.giaDaGiam = 0;
        // console.log("Giá bán là: "+(sanPham.giaBan *  sanPham.sanPhamSoLuong) * (sanPham.giaTriKhuyenMai / 100))
        sanPham.giaDaGiam += (sanPham.giaBan *  sanPham.sanPhamSoLuong) * (sanPham.giaTriKhuyenMai / 100);
        // alert(v.sanPhamSoLuong)
        let giaSauKhuyenMai = (sanPham.giaBan * sanPham.sanPhamSoLuong) - sanPham.giaDaGiam;
        if (
          sanPham.liveId != null &&
          (sanPham.soLuongGioHan < 0 ||
            sanPham.sanPhamSoLuong <= sanPham.soLuongGioHan)
        ) {
          sanPham.giaDaGiam += giaSauKhuyenMai * (sanPham.giaGiam / 100);
        }
       
        // return subtotal + giaSauKhuyenMai
        return subtotal + ((sanPham.giaBan*sanPham.sanPhamSoLuong)-sanPham.giaDaGiam)
      }, 0);
      v.tongTien = ton;
      tongs += ton;
      if (v.voucherShop !== undefined) {
        data.voucherShop += v.voucherShop.priceDiscount;
      }
      data.phiShip += v.phiShip;
    });
    data.tienHang = tongs;
    if (order.voucherSan != null) {
      let tienTru = 0;
      if (order.voucherSan.hinhThucApDung == 1) {
        tienTru = tongs - data.voucherShop;
      } else {
        tienTru = data.phiShip;
      }
      if (order.voucherSan.loaiVoucher == 1) {
        let t = order.voucherSan.giaTriGiam;
        data.voucherSan =
          (t / 100) * tienTru > order.voucherSan.gioiHanGiam &&
          order.voucherSan.gioiHanGiam > 0
            ? order.voucherSan.gioiHanGiam
            : (t / 100) * tienTru;
      } else {
        let t = order.voucherSan.giaTriGiam;
        data.voucherSan = tienTru - t < 0 ? tienTru : tienTru - t;
      }
    }
    setKey(key+1)
  };
  const [key,setKey]=useState(0)
  const { setFloadingPage } = useContext(AppContext);
  const tableRef = useRef(null);
  const [diaChis, setDiaChis] = useState([]);

  const getCartInList = () => {
    let a = JSON.parse(localStorage.getItem("ids"));
    setFloadingPage();
    api
      .post("/cart/getcartinlist", a, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((v) => v.data)
      .then((v) => {
        const a = new Map(Object.entries(v.data));
        let map = new Map();
        a.forEach((k, v) => {
          map.set(v, {
            data: k,
            ghiChu: "",
            phiShip: 26000,
          });
        });
        if (a.size < 1) {
          navigate("/client/cart");
        }
        cacul();
        setCartList(map);
        gsap.fromTo(
          tableRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
      });
  };
  async function calculateShipping(toDistrictId, toWardCode) {
    if (diaChi != null) {
      const token = "1c0642bd-4891-11ef-af01-5a4abb38d4d4";
      const shopId = "5146217";
      const requestData = {
        from_district_id: diaChi.districtId,
        from_ward_code: diaChi.wardCode,
        service_id: null,
        service_type_id: 2,
        to_district_id: toDistrictId,
        to_ward_code: toWardCode,
        height: 20,
        length: 20,
        width: 20,
        weight: 500,
        insurance_value: 100000,
        cod_failed_amount: 0,
        coupon: null,
        items: [
          {
            name: "TEST1",
            quantity: 1,
            height: 20,
            weight: 500,
            length: 20,
            width: 20,
          },
        ],
      };

      const response = await fetch(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Token: token,
            ShopId: shopId,
          },
          body: JSON.stringify(requestData),
        }
      ).catch((error) => {
        alert(error.message);
      });

      const result = await response.json();
      if (result.code === 200) {
        return result.data.total;
      } else {
        alert(`Có lỗi xảy ra: ${result.message}`);
      }
    }
  }

  const getDiaChiOfUser = () => {
    api
      .get("/diachi/getdiachi")
      .then((v) => v.data)
      .then((v) => {
        setDiaChis(v);
        if (v == null || v.length < 1) {
          navigate("/client/my-account-address");
          toast("Bạn chưa có địa chỉ", {
            icon: "⚠️",
            style: {
              color: "orange",
            },
          });
        } else {
          setDiaChi(v[0]);
        }
      });
  };
  useEffect((v) => {
    getCartInList();
  }, []);

  useEffect(() => {
    if (cartList != null && cartList.size > 0) {
      getDiaChiOfUser();
    }
  }, [cartList]);

  useEffect(() => {
    if (diaChi !== null) {
      cartList.forEach((v, k) => {
        let a = v.data[0].shop.diaChi;
        calculateShipping(a.districtId, a.wardCode).then((vv) => {
          const updatedCart = {
            ...v,
            phiShip: vv,
          };
          cartList.set(k, updatedCart)
          cacul()
        });
      });
    }
  }, [diaChi]);
  return (
    <div className="container w-full lg:w-[1200px] mx-auto px-4 py-8 bg-white rounded-lg m-4 shadow">
      <h1 className="text-2xl font-bold mb-2  pb-2">Thanh Toán</h1>
      {/* <hr /> */}
      <form>
        <div className="container mx-auto mb-6">
          <Accordion>
            <AccordionSummary
              expandIcon={<FaChevronDown />}
              aria-controls="panel1-content"
              id="panel1-header"
              className=" border rounded-lg hover:bg-blue-100 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <FaMapMarkerAlt
                  size="22"
                  className="mr-3 text-blue-600 transition-transform duration-200 transform hover:scale-110"
                />
                <div className="flex">
                  <span className="text-md text-gray-800 ">
                    Địa chỉ nhận hàng:
                  </span>
                  <span className="ml-2 text-md text-gray-700 font-meidum block max-w-lg truncate hover:text-blue-600 transition-colors duration-300">
                    {diaChi != null ? diaChi.toanBoDiaChi : "Chưa có địa chỉ"}
                  </span>
                </div>
              </div>
            </AccordionSummary>

            <AccordionDetails>
              <div id="diachis" className="">
                {diaChis.map((v, index) => (
                  <div
                    key={index}
                    className="border-b border-solid border-gray-100 p-4 flex justify-between items-center space-x-4 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-900">{`SDT: ${v.soDienThoai}`}</p>
                      <p className="text-sm text-gray-600 truncate max-w-xs">
                        {v.toanBoDiaChi}
                      </p>
                    </div>

                    <div className="ml-auto pr-4 flex items-center space-x-2">
                      <input
                        name="a"
                        onClick={() => setDiaChi(v)}
                        type="radio"
                        id={`checkbox-${index}`}
                        checked={
                          diaChi && diaChi.toanBoDiaChi === v.toanBoDiaChi
                        }
                        className="h-5 w-5 text-blue-500 border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:ring-2 hover:ring-blue-300"
                      />
                      <label
                        htmlFor={`checkbox-${index}`}
                        className="cursor-pointer text-sm ml-auto text-blue-500 hover:text-blue-700"
                      >
                        Chọn
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>

        {/* */}
        <div className="mb-1 mx-8" ref={tableRef}>
          {Array.from(cartList).map(([key, value]) => (
            <div className="bg-white py-4 shadow-md w-full mx-auto px-8 border-b border-solid border-gray-100">
              <div className="flex items-center gap-3 border-b border-solid border-gray-100">
                <span className="flex items-center gap-2 text-gray-600 text-sm font-bold">
                  <FcShop className="size-8 ml-4 " />
                  {value.data.length > 0 ? value.data[0].shopName : ""}
                </span>{" "}
                |
                <button class="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-md">
                  Xem shop
                </button>
              </div>
              {value.data.map((v) => {
                return (
                  <>
                    <div className="grid  px-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4 border-b border-solid border-gray-200">
                      {/* Cột 1 */}
                      <div className="flex items-center gap-8">
                        <img
                          src={v.hinhAnh}
                          alt="Tao Do Tan Cuong"
                          className="w-24 h-24 object-cover rounded-lg shadow-md"
                        />
                        <div className="flex flex-col">
                          <span
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              wordWrap: "break-word",
                              whiteSpace: "normal",
                            }}
                            className="text-md font-semibold text-gray-800"
                          >
                            {v.tenSanPham}
                          </span>

                          <span className="text-sm text-gray-500">
                            Loại: {v.tenBienThe}
                          </span>
                          {v.liveId != null && (
                            <span className="mt-2 px-2 text-xs text-red-500 font-bold rounded-md bg-red-50 border border-red-500">
                              Live Giảm: {v.giaGiam}% - còn: {v.soLuongGioHan}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cột 2:  */}
                      <div className="flex flex-col space-y-2 lg:ml-8 mt-4">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-800">
                            Giá bán:{" "}
                          </span>
                          <span className="text-blue-500 font-semibold ml-1">
                            {formatToVND(
                              v.giaBan * (1 - v.giaTriKhuyenMai / 100)
                            )}
                          </span>
                          {v.giaTriKhuyenMai > 0 && (
                            <span className="text-gray-500 line-through ml-2 text-sm">
                              {formatToVND(v.giaBan)}
                            </span>
                          )}
                        </div>

                        {v.giaTriKhuyenMai > 0 && (
                          <span className="text-xs text-blue-500 font-medium">
                            Giảm: {v.giaTriKhuyenMai} %
                          </span>
                        )}
                      </div>

                      {/* Cột 3:  */}
                      <div className="flex flex-col mt-4 justify-between lg:ml-32">
                        <span className="mt-3 text-gray-500">
                          Số lượng:{" "}
                          <span className="font-semibold ml-4 text-gray-800">
                            {v.sanPhamSoLuong}
                          </span>
                        </span>
                      </div>

                      {/* Cột 4 */}
                      <div className="flex flex-col text-right mt-8">
                        {/* <span className=" text-blue-700">
                          Tiền giảm: {formatToVND(v.giaDaGiam)}
                        </span> */}
                        <div className=" text-lg font-semibold text-blue-700">
                          {/* Tổng tiền:{" "} */}
                          {formatToVND(
                            v.giaBan * v.sanPhamSoLuong - v.giaDaGiam
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
              {/* <hr class="border-t border-gray-500 border-dashed" /> */}
              <div className="flex items-center justify-center py-3  border-gray-300 relative">
                {/* <div className="flex items-center text-red-500">
                  <BiSolidDiscount size={20} className="inline mr-2 " />
                  <span className="text-sm text-gray-700">
                    Voucher của Shop
                  </span>
                </div> */}
                <div className="absolute right-0">
                  <VariableWidth
                    cacu={cacul}
                    setFlag={setFlag}
                    flag={flag}
                    values={value}
                    keys={key}
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6  px-6 shadow-sm border-t border-solid border-gray-200 ">
                {/* Lời nhắn */}
                <div className="flex flex-col flex-1 mt-1 rounded-lg">
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <MdOutlineSpeakerNotes
                      className="inline text-blue-500"
                      size="18"
                    />
                    <span className="text-sm">Lời nhắn</span>
                  </span>
                  <textarea
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      value.ghiChu = e.target.value;
                    }}
                    rows={1}
                    className="mt-2 border border-gray-200 p-3 rounded-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Lưu ý cho người bán..."
                  ></textarea>
                </div>

                {/*  */}
                <div className="flex flex-col lg:w-1/3  p-2 rounded-lg  text-right">
                  {/* Voucher */}
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-700">
                      Tiền trừ voucher:
                    </span>
                    <span className="text-sm sm:text-md text-gray-700">
                      {value.voucherShop != null
                        ? formatToVND(value.voucherShop.priceDiscount)
                        : "0 đ"}
                    </span>
                  </div>

                  {/*  */}
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-700">
                      Phí vận chuyển:
                    </span>
                    <span className="text-sm sm:text-md text-gray-700">
                      {formatToVND(value.phiShip)}
                    </span>
                  </div>

                  {/* Tổng tiền */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800 text-xl">
                      Tổng tiền:
                    </span>
                    <span className="text-2xl font-medium text-blue-600">
                      {formatToVND(value.tongTien)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: `${cartList.size < 1 ? "299px" : "0px"}` }}></div>
        <div className="mt-1 shawdow-sm border-blue-300 p-6 m-2.5 rounded-sm">
          <div className="flex flex-wrap justify-between items-center mb-1 p-4  rounded-lg shadow-sm">
            {/*  */}
            <div className="flex items-center text-gray-800">
              <BiSolidDiscount color="red" size={20} />
              <span className="ml-3 font-semibold text-lg">
                Model World Voucher
              </span>
            </div>

            {/*  */}
            <div className="flex text-blue-500 hover:underline no-underline items-center">
              {order.voucherSan != null &&
              order.voucherSan.hinhThucApDung == 1 ? (
                <MdCardGiftcard />
              ) : (
                <FaShippingFast />
              )}
              <VoucherSanChoose
                datas={data}
                flag={flag}
                setFlag={setFlag}
                order={order}
              />
            </div>
          </div>

          <hr className="text-gray-400 border-dotted" />

          <div className="flex flex-wrap justify-between items-center my-1 p-4  rounded-lg shadow-sm">
            {/*  */}
            <div className="flex items-center text-gray-800">
              <span className="text-blue-500 mr-3 text-lg">💳</span>
              <span className="font-semibold text-md">
                Phương thức thanh toán
              </span>
            </div>

            {/*  */}
            <div className="flex items-center space-x-4">
              {/* VNPay */}
              <label className="flex items-center cursor-pointer space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="form-radio text-blue-500 focus:ring focus:ring-blue-300"
                  onClick={() => {
                    order.thanhToan.id = 2;
                  }}
                  defaultChecked
                />
                <span className="text-sm text-gray-600">VNPay</span>
              </label>

              {/*  */}
              <label className="flex items-center cursor-pointer space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="form-radio text-blue-500 focus:ring focus:ring-blue-300"
                  onClick={() => {
                    order.thanhToan.id = 1;
                  }}
                />
                <span className="text-sm text-gray-600">
                  Thanh toán khi nhận hàng
                </span>
              </label>
            </div>
          </div>

          <hr className="border-dotted text-gray-400" />

          {/*  */}
          <div className="my-4">
            <div className="flex justify-between mb-2">
              <span></span>
              <span className="text-gray-500 text-md">
                Tổng tiền hàng:{" "}
                <span className="text-gray-900 font-semibold">
                  {formatToVND(data.tienHang)}
                </span>
              </span>
            </div>
            <div className="mt-3 flex justify-between mb-2">
              <span></span>
              <span className="text-gray-500 text-sm">
                Phí vận chuyển:{" "}
                <span className="text-gray-900 font-semibold">
                  {formatToVND(data.phiShip)}
                </span>
              </span>
            </div>
            <div className="mt-3 flex justify-between mb-2">
              <span></span>
              <span className="text-gray-500 text-sm">
                Tiền voucherShop:{" "}
                <span className="text-gray-900 font-semibold">
                  {formatToVND(data.voucherShop)}
                </span>
              </span>
            </div>
            <div className="mt-3 flex justify-between mb-2">
              <span></span>
              <span className="text-gray-500 text-sm">
                Tiền voucherSan:{" "}
                <span className="text-gray-900 font-semibold">
                  {formatToVND(data.voucherSan)}
                </span>
              </span>
            </div>
            <div className="mt-3 flex justify-between mb-2">
              <span></span>
              <span className="text-gray-500 text-sm">
                Tổng thanh toán:
                {/* <sup className="ml-4" style={{ color: "red" }}>
                  đ
                </sup> */}
                <span className=" text-blue-500 text-2xl font-semibold">
                  {formatToVND(
                    data.tienHang +
                      data.phiShip -
                      data.voucherSan -
                      data.voucherShop
                  )}
                </span>
              </span>
            </div>
          </div>

          <hr />
          <div className="mt-6 flex justify-end align-content-start justify-content-between">
            <p className="text-xs sm:text-xs text-gray-500 mt-4">
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
              className="bg-blue-700 text-white px-10 py-3 rounded-sm shadow hover:bg-blue-600"
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkouts;
