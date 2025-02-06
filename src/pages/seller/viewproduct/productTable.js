// import React from 'react';
import { useEffect, useRef, useState } from "react";
import api from "../../../config/APISeller";
import Tabproduct from "./tabproduct";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import CategorySearch from "./CateSearch";
import CustomizedTooltips from "./HoverPromotion";
import gsap from "gsap";
import { CiFilter } from "react-icons/ci";

const ProductTable = () => {
  const [tab, setTab] = useState(1);
  const [idC, setIdC] = useState(new Map());
  const [filter, setFilter] = useState({
    page: 0,
    size: 5,
    numPage: 0,
    key: "",
    cate: null,
    cates: [],
    sortType: 0,
  });

  function getId(id) {
    filter.cates.push(id.id);
    if (id.subCategories.length > 0) {
      id.subCategories.forEach((v) => {
        getId(v);
      });
    } else {
      return;
    }
  }
  const setCate = (cate) => {
    filter.cates = [];
    getId(cate);
  };

  const [data, setData] = useState({
    products: [],
    khuyenMaiMap: new Map(),
  });

  useEffect(() => {
    filter.page = 0;
    fectProduct();
  }, [tab]);

  const [flag, setFlag] = useState(0);
  const getProductDetailById = (index, id) => {
    api
      .get(`/product/getproductdetailbyproductid?id=${id}`)
      .then((v) => v.data)
      .then((v) => {
        let obj = data.products[index];
        obj.productDetails = v.data;
        setFlag(flag + 1);
      });
  };

  const chooseMap = (id) => {
    if (idC.has(id)) {
      idC.delete(id);
    } else {
      idC.set(id, id);
    }
    setFlag(flag + 1);
  };

  const updateState = (state) => {
    api
      .post(`/product/updatestatus?state=${state}`, Array.from(idC.keys()), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((v) => v.data)
      .then((v) => {
        if (v.status == 200) {
          alert(v.message);
          fectProduct();
        } else {
          alert(v.message);
        }
      })
      .catch((error) => {
        alert("Yêu cầu xử lý thất bại vui lòng thử lại sao ");
      });
  };
  const tableRef = useRef(null);
  const fectProduct = () => {
    api
      .post(
        `/product/getall?state=${tab}&page=${filter.page}&key=${filter.key}&sortType=${filter.sortType}`,
        filter.cates,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((v) => v.data)
      .then((v) => {
        data.products = v.page.content;
        data.khuyenMaiMap = v.chiTietKhuyenMail.reduce((acc, item) => {
          const productId = item.product.id;
          if (!acc[productId]) {
            acc[productId] = [];
          }
          acc[productId].push(item.khuyenMai);
          return acc;
        }, {});
        let t = new Map(
          v.listReport.map((item) => [item[0], [item[1], item[2], item[3]]])
        );
        data.products.forEach((v) => {
          let a = t.get(v.id);
          if (a != null) {
            v.minPrice = a[0];
            v.maxPrice = a[1];
            v.soLuong = a[2];
          }
        });

        filter.numPage = v.page.totalPages;
        setFlag(flag + 1);
        // if (tableRef.current) {
        gsap.fromTo(
          tableRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
        // }
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  };

  return (
    <div className="mt-2 rounded-[7px] container mx-auto p-4 relative bg-white">
      <div class="flex flex-wrap items-center space-x-2 space-y-2 md:space-y-0">
        <Tabproduct setTab={setTab} />

        <input
          onChange={(e) => {
            filter.key = e.target.value;
            fectProduct();
          }}
          type="text"
          placeholder="Tìm Tên sản phẩm, mã sản phẩm"
          class="w-full md:w-1/3 p-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
        />
        <CategorySearch setChon={setCate} />
        <div class="inline-flex items-center border border-gray-200 rounded focus-within:ring-1 focus-within:ring-blue-400">
          <CiFilter class=" text-gray-500" />
          <select
            onChange={(e) => {
              filter.sortType = e.target.value;
              fectProduct();
            }}
            class="w-full mr-2 p-2 border-0 focus:outline-none focus:ring-0 text-sm"
          >
            <option value={0}>Mới nhất</option>
            <option value={1}>Tên sản phẩm</option>
            <option value={2}>Số lược bán ra</option>
          </select>
        </div>
        <button
          onClick={() => {
            fectProduct();
          }}
          class="w-full md:w-auto p-1   text-sm font-medium rounded-sm text-red-600 border-2 border-red-600  transition-colors focus:outline-none focus:ring-1 focus:ring-red-400"
        >
          Áp dụng
        </button>

        <button
          onClick={() => {
            filter.cates = [];
            filter.key = "";
          }}
          class="w-full md:w-auto p-1 border-2  border-gray-200 text-gray-600 text-sm font-medium rounded-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300"
        >
          Nhập Lại
        </button>
      </div>
      <br />
      <Stack spacing={4}>
        <Pagination
          onChange={(event, value) => {
            filter.page = value - 1;
            fectProduct();
          }}
          count={filter.numPage}
          renderItem={(item) => (
            <PaginationItem
              slots={{
                previous: IoArrowBackCircleOutline,
                next: IoArrowForwardCircleOutline,
              }}
              {...item}
            />
          )}
        />
      </Stack>
      <button
        style={{
          borderRadius: "4px",
          visibility: `${idC.size > 0 ? "visible" : "hidden"}`,
        }}
        className="p-2 mt-2 mb-2 text-sm text-white bg-red-500"
        onClick={() => {
          if (tab == 1) {
            if (window.confirm("Bạn có muốn ẩn các sản phẩm ?")) {
              updateState(0);
            }
          } else if (tab == 0) {
            if (window.confirm("Bạn có muốn hiển thị các sản phẩm ?")) {
              updateState(1);
            }
          } else {
            alert(
              "Bạn không được phép thay đổi với sản phẩm cố trạng thai này,Vui lòng liên hệ shoppee"
            );
          }
          setIdC(new Map());
        }}
      >
        Cập nhật trạng thái
      </button>
      <div className="mt-4 " style={{ overflow: "hidden" }}>
        <table className="rounded-lg min-w-full bg-white border border-gray-200">
          <thead className="">
            <tr>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700"></th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Tên sản phẩm
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Biến thể
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Khoảng giá
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Kho hàng
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Ưu đãi áp dụng
              </th>
              <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody ref={tableRef} className="text-xs overflow-hidden">
            {data.products.map((v, index) => {
              return (
                <>
                  <tr>
                    <td className="text-center ">
                      <input
                        name="helo"
                        type="checkBox"
                        onClick={() => {
                          chooseMap(v.id);
                        }}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-content-lg-between">
                        <img src={v.hinhAnh} className="w-12" />

                        <div>
                          <div className="font-semibold text-gray-800">
                            {v.tenSanPham}
                          </div>
                          <div className="text-xs text-gray-500">
                            SKU sản phẩm: Banh-banhcuon
                          </div>
                          <div className="text-xs text-gray-500">
                            ID Sản phẩm: {v.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        getProductDetailById(index, v.id);
                      }}
                      className="px-4 py-4 border-b text-gray-700"
                    >
                      Xem biến thể
                    </td>
                    <td className="px-4 py-4 border-b text-gray-700">
                      <p className="mt-2">
                        {v.minPrice} -{v.maxPrice}
                      </p>
                    </td>
                    <td className="px-4 py-4 border-b text-gray-700">
                      {v.soLuong}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {data.khuyenMaiMap[`${v.id}`] !== undefined ? (
                        <>
                          <span class="text-xs  text-red-500 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            <CustomizedTooltips
                              khuyenMai={data.khuyenMaiMap[`${v.id}`]}
                            />
                          </span>
                        </>
                      ) : (
                        <>Đang không có ưu đãi</>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      <p className="text-blue-600 hover:underline">
                        <Link to={`/seller/updateproduct/${v.id}`}>
                          Cập nhật
                        </Link>
                      </p>
                      <Link
                        to={`/productdetail/${v.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Xem trước
                      </Link>
                    </td>
                  </tr>
                  {v.productDetails != null ? (
                    v.productDetails.map((v) => {
                      return (
                        <>
                          <tr>
                            <td></td>
                            <td
                              className="px-4 py-4"
                              style={{ backgroundColor: "#f0f0f0" }}
                            >
                              <div className="flex items-center justify-content-lg-between">
                                <img
                                  style={{ width: "50px" }}
                                  src={v.hinhAnh}
                                  alt="Product Image"
                                  class="w-10 h-10 mr-4"
                                />
                                <div>
                                  <div className="font-semibold text-gray-800">
                                    {v.mauSac.tenMau} -{" "}
                                    {v.kichThuoc.tenKichThuoc}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID biến thể: {v.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td
                              style={{ backgroundColor: "#f0f0f0" }}
                              className="px-4 py-4 text-gray-700"
                            >
                              ------
                            </td>
                            <td
                              style={{ backgroundColor: "#f0f0f0" }}
                              className="px-4 py-4 text-gray-700"
                            >
                              {v.giaBan}
                            </td>
                            <td
                              style={{ backgroundColor: "#f0f0f0" }}
                              className="px-4 py-4 text-gray-700"
                            >
                              {v.soLuong}
                            </td>
                            <td
                              style={{ backgroundColor: "#f0f0f0" }}
                              className="px-4 py-4 text-gray-700"
                            ></td>
                          </tr>
                        </>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProductTable;
