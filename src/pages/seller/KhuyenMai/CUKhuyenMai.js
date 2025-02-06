import { useEffect, useRef, useState } from "react";
import TabVoucher from "../voucher/tabVoucher";
import gsap from "gsap";
// import { Pagination, Stack } from "react-bootstrap";
// import { PaginationItem } from "@mui/material";
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from "react-icons/io5";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { BiSortDown } from "react-icons/bi";

const CUKhuyenMai = () => {
    const [khuyenMai,setKhuyenMai]=useState([])
    const [typeFetch,setTypeFetch]=useState(0);
    const [numPage,setNumPage]=useState(3)
    const [page,setPage]=useState(0)
    const [size,setSize]=useState(5)
    const componentRef = useRef(null);
    const [key,setkey]=useState('')
    const [filter,setFilter]=useState({
        typeSort:0,
        startDate:null,
        endDate:null
    })

    useEffect(()=>{
        fetchData()
    },[typeFetch])
    

    const fetchData=()=>{
        fetch(`http://localhost:8080/sale/khuyenmai/getall?page=${page}&size=${size}&type=${typeFetch}&key=${key}
            ${filter.startDate!=null&&filter.endDate!=null?`&startDate=${filter.startDate.toISOString()}&endDate=${filter.endDate.toISOString()}`:``}`).then(v=>v.json()).then(v=>{
            setKhuyenMai(v.data.content)
            setNumPage(v.data.totalPages)
        })
    }

    return (
        <div ref={componentRef}>
            <div style={{ borderRadius: '7px' }} className="container mx-auto p-4 relative bg-white">
                <p className="text-black-800 font-semibold">Kênh người bán > Quản lý khuyến mãi > Thêm khuyến mãi</p>
                <div className=" border-gray-200 relative"></div>
            </div>
            

            <div style={{ borderRadius: '7px' }} className="mt-2 container mx-auto p-4 relative bg-white">
                <input
                    value={key}
                    
                    onChange={(e)=>setkey(e.target.value)}
                    type="text"
                    placeholder="Tên chương trình - tên sản phẩm"
                    class="mr-2 w-10/12 mb-2 lg:w-5/12 p-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                />
                <div class="inline-flex items-center border border-gray-200 rounded focus-within:ring-1 focus-within:ring-blue-400">
                    <BiSortDown class=" text-gray-500" />
                    <select onChange={(e)=>{
                        filter.typeSort=e.target.value
                        fetchData()
                    }} class="w-full mr-2 p-2 border-0 focus:outline-none focus:ring-0 text-sm">
                        <option value={0}>Mới nhất</option>
                        <option value={1}>Theo giá trị giảm</option>
                        <option value={2}>Theo tên khuyến mãi</option>
                    </select>
                </div>
                <br></br>
                <input
                    onChange={(e)=>{
                        filter.startDate=new Date(e.target.value)
                    }}
                    type="date"
                    placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                    class="mr-2 w-5/12 lg:w-3/12 p-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                /> 
                <input
                    onChange={(e)=>{
                        filter.endDate=new Date(e.target.value)
                        
                    }}
                    type="date"
                    placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                    class="w-5/12 lg:w-3/12 p-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                />
                <span onClick={()=>{
                    fetchData()
                }} href="#_" style={{border:"1px solid violet"}} class="mt-2 relative inline-flex items-center justify-start px-3 py-2 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group">
                    <span class="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                    <span  class="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">Tìm kiếm</span>
                </span>
                <br />
                <TabVoucher setTypeFetch={setTypeFetch}/>
                <br />
                <Stack spacing={2}> 
                    <Pagination
                        onChange={(event,value)=>setPage(value-1)}
                        count={numPage}
                        renderItem={(item) => (
                        <PaginationItem
                            slots={{ previous: IoArrowBackCircleOutline, next: IoArrowForwardCircleOutline }}
                            {...item}
                        />
                        )}
                    />
                </Stack>
                <div class="mt-2   shadow-md sm:rounded-lg" style={{overflow:"auto"}}>
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" >
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Tên mã giảm giá
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Sản phẩm
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Giá trị giảm
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Số lượt tối đa
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Tổng số sản phẩm áp dụng
                                </th>
                                <th scope="col" class="px-6 py-3">
                                   Thời gian áp dụng
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    <span class="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className='text-black'>

                        {khuyenMai.map(v => (
                            // <div key={v.id}>
                                <tr class="bg-white border-b dark:bg-gray-200 dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-4 py-4">
                                    <div className="flex items-center justify-content-lg-between">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAHXPluq6GtTRPDIHRv5kJPy86uFjp5sO7hg&s"
                                            style={{ width: '50px' }}
                                        />

                                        <div>
                                            <div className="text-xs text-gray-500">
                                                <span class="bg-yellow-100 text-black-200 text-xs  me-2 px-2.5 py-0.5 rounded dark:bg-orange-150 dark:text-orange-500">
                                                    Đã kết thúc
                                                </span>
                                            </div>
                                            <div className="font-semibold text-gray-800">{v.tenKhuyenMai}</div>
                                            <div className="text-xs text-gray-500">Mã voucher: hdjsm</div>
                                            
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBPoM8KLXM5hfkQdUNZlwvaf5KyT5YjLS1-A&s"
                                     style={{width:"40px"}}/>
                                     <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBPoM8KLXM5hfkQdUNZlwvaf5KyT5YjLS1-A&s"
                                     style={{width:"40px"}}/>
                                </td>
                                <td class="px-6 py-4">{v.giaTriGiam}%</td>
                                <td class="px-6 py-4">-</td>
                                <td class="px-6 py-4"><strong>{v.images.length} </strong> sản phẩm</td>
                                <td class="px-6 py-4">{v.ngayBatDau} - {v.ngayKetThuc}</td>
                                <td class="px-6 py-4"><Link to={"/seller/updatekhuyenmai/"+v.id}>Cập nhật</Link></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default CUKhuyenMai;
