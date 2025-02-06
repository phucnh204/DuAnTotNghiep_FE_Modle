import React, { useEffect, useRef, useState } from 'react';
import api from '../../../config/APISeller';
import { useParams } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { FaChevronDown } from 'react-icons/fa';
const OrderConfirmation = () => {
    const { id } = useParams();
    const [isLoad, setIsLoad] = useState(false);
    const [data, setData] = useState({
        voucher: {},
        orders: [],
        orderDetails: [],
        isFetch:0,
        page:1
    });
    const getVoucherInfo = () => {
        api.get(`/voucher/getvoucherbyidandorderreport?id=${id}`)
            .then((v) => v.data)
            .then((v) => {
                if (v.status === 200) {
                    data.voucher = v.data.voucherShop;
                    data.orders = v.data.orders;
                    setIsLoad(true);
                    // setVoucher(v.data)
                } else {
                    alert(v.message);
                }
            });
    };

    const [flag,setFlag]=useState(0)
    const addPage=()=>{  
      api.get(`/voucher/getordernext?id=${id}&page=${data.page}`)
      .then((v) => v.data)
      .then((v) => {
          if (v.status === 200) {
              data.orders = [...data.orders, ...v.data];
              data.page++;
              console.log(data.orders.length)
              setFlag((prevFlag) => prevFlag + 1);
          } else {
              alert(v.message);
          }
      });
    }

const endOfPageRef = useRef(null);    useEffect(() => {
      const observer = new IntersectionObserver(
          ([entry]) =>{
              if( entry.isIntersecting&&data.isFetch!==0){
                addPage()
              }
              if(data.isFetch==0){
                data.isFetch=9
              }
          }

      );
      observer.observe(endOfPageRef.current);

      return () => observer.disconnect();
  }, []);

    const getOrderDetails = () => {
       if(data.orderDetails.length<1){
        api.get(`/voucher/getvoucherdetail?id=${id}`)
        .then((v) => v.data)
        .then((v) => {
            if (v.status === 200) {
                data.orderDetails = v.data;
                setIsLoad(!isLoad);
            } else {
                alert(v.message);
            }
        });
       }
    };

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    useEffect(() => {
        getVoucherInfo();
    }, []);

    return (
        <div className="w-[95%]  mx-auto bg-white p-6 sm:p-8 mt-2 shadow-lg rounded-lg">
            <div >
                <h2 className="text-2xl font-bold text-gray-800">Voucher của shop</h2>
                <div className="border-t border-gray-200 mt-6 pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <h6 className="text-lg font-medium text-gray-800">Voucherid : {data.voucher.id}</h6>
                        <a href="#" className="text-blue-500 hover:underline text-sm mt-2 md:mt-0">
                            View Invoice
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-sm text-gray-600">
                        <div>
                            <h6 className="font-semibold text-gray-800">Trạng thái</h6>
                            <span class="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded">Đang diễn ra</span>
                        </div>
                        <div>
                            <h6 className="font-semibold text-gray-800">Tên chương trình</h6>
                            <p className="text-sm">
                                {data.voucher.tenVoucher}
                                <br />
                            </p>
                        </div>
                        <div>
                            <h6 className="font-semibold text-gray-800">Loại voucher</h6>
                            <p className="text-sm">
                                {data.voucher.loaiVoucher == 1 ? 'Phan tram' : 'Gia tien'}
                                <br />
                            </p>
                        </div>
                        <div>
                            <h6 className="font-semibold text-gray-800">Đơn tối thiểu</h6>
                            <p className="flex items-center text-sm">
                                <span class="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded">
                                    {data.voucher.donToiThieu} D
                                </span>
                            </p>
                        </div>
                        <div>
                            <h6 className="font-semibold text-gray-800">Giá trị giảm</h6>
                            <p className="text-sm">
                                {data.voucher.giaTriGiam} {data.voucher.loaiVoucher == 1 ? '%' : 'D'}
                                <br />
                            </p>
                        </div>
                        <div>
                            <h6 className="font-semibold text-gray-800">Mã voucher</h6>
                            <p className="text-sm">
                                {data.voucher.maVoucher}
                                <br />
                            </p>
                        </div>
                        <div>
                            <h6 className="font-semibold text-gray-800">Số lược dùng</h6>
                            <p className="text-sm">
                                {data.voucher.soLuocDung}
                                <br />
                            </p>
                        </div>
                        <div>
                            <h6 className="font-semibold text-gray-800">Số lược mỗi người</h6>
                            <p className="flex items-center text-sm">
                                <span class="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded">
                                    {data.voucher.soLuocMoiNguoi}
                                </span>
                            </p>
                        </div>
                        <div>
                            <h6 className="font-semibold text-gray-800">Số lược đã sử dụng</h6>
                            <p className="flex items-center text-sm">
                                <span class="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded">
                                    {data.voucher.soLuocDaDung}
                                </span>
                            </p>
                        </div>
                        <div>
                            <h6 className="font-semibold text-gray-800">Thời gian sử dụng mã</h6>
                            <p className="text-sm">
                                {new Date(data.voucher.ngayBatDau).toDateString()} - {new Date(data.voucher.ngayKetThuc).toDateString()}
                                <br />
                            </p>
                        </div>
                    </div>

                    <Accordion style={{ border: '0px solid black' }} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                        <AccordionSummary
                            // expandIcon={<ExpandMoreI />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}></Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                                -------------------------- Sản phẩm của chương trình{' '}
                                <FaChevronDown
                                    onClick={() => {
                                        getOrderDetails();
                                    }}
                                    style={{ display: 'inline' }}
                                />{' '}
                                ---------------------------------------
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-6 py-3 text-left text-gray-600 font-semibold">Item</th>
                                                <th class="px-6 py-3 text-left text-gray-600 font-semibold">Số lượng</th>
                                                <th class="px-6 py-3 text-left text-gray-600 font-semibold">Min price</th>
                                                <th class="px-6 py-3 text-left text-gray-600 font-semibold">Max price</th>
                                                {/* <th class="px-6 py-3 text-left text-gray-600 font-semibold">Tax</th> */}
                                                {/* <th class="px-6 py-3 text-left text-gray-600 font-semibold">Amount</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.orderDetails.map((v) => {
                                                return (
                                                    <tr class="border-b">
                                                        <td class="px-6 py-4 flex items-center space-x-3">
                                                            <img
                                                                src={v.productImage}
                                                                alt="Product"
                                                                class="w-10 h-10 rounded"
                                                            />
                                                            <div>
                                                                <p class=" text-gray-700 text-sm ">{v.productName}</p>
                                                                {/* <p class="text-sm text-gray-500">Electronics - Small</p> */}
                                                            </div>
                                                        </td>
                                                        {/* <td class="px-6 py-4">
                                                            <span class="px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded-full">
                                                                Ready
                                                            </span>
                                                        </td> */}
                                                        <td class="px-6 py-4 text-gray-700  text-sm ">{v.soLuong}</td>
                                                        <td class="px-6 py-4 text-gray-700  text-sm ">{v.minPrice}</td>
                                                        <td class="px-6 py-4 text-gray-700  text-sm ">{v.maxPrice}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <h6 className="mt-2 text-lg font-medium text-gray-800">Đơn hàng</h6>
                    </div>

                    {data.orders.map((v) => {
                        return (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
                                <div className="col-span-2">
                                    <div className="flex items-center justify-between py-4 border-b">
                                        <div className="flex items-center">
                                            <img
                                                src="https://via.placeholder.com/60"
                                                alt="Product 1"
                                                className="w-16 h-16 object-cover rounded mr-4"
                                            />
                                            <div>
                                                <h5 className="font-medium text-sm text-gray-800">ID: {v.id}</h5>
                                                <p className="text-gray-500 text-sm">{v.accountId.hoVaTen}</p>
                                                <p className="text-gray-500 text-sm">SDT: {v.accountId.soDienThoai}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-4"> </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Total order</span>
                                            <span>$ {v.tongTien}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-gray-800">
                                            <span>Tiền voucher</span>
                                            <span>$ {v.tienTru}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <a ref={endOfPageRef}>  </a>
        </div>
    );
};

export default OrderConfirmation;
