import React, { useEffect, useState } from 'react';
import api from '../../../config/APISeller'; // Import Axios instance
import { Pagination, PaginationItem, Stack } from '@mui/material';
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from 'react-icons/io5';
const VoucherModal = ({map,setFlag,flag}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products,setProducts]=useState(new Map());
    const [flags,setFlags]=useState(0)
        const [page,setPage]=useState({
            "page":0
        })

    useEffect(()=>{
        fetchProduct()
    },[flags])


    const fetchProduct=()=>{
        api.get(`/voucher/getproductchoose?page=${page.page}`).then(v=>v.data).then(v=>{
            const maps = new Map(v.data.content.map(item => [item.productId, item]));
            filterFloat(maps)
            page.page=v.data.totalPages
            setProducts(maps)
        }).catch((error)=>{
        })
    }

    const filterFloat=(products)=>{
        products.forEach((value,key)=>{
            if(map.has(key)){
                products.delete(key)
            }
        })
    }

    const handleOnclick=(key)=>{
        key.isCheck=!key.isCheck;
    }

    const openModal = () => {
        setIsModalOpen(true);
        setTimeout(() => {
            document.getElementById('myModal').classList.remove('opacity-0');
            document.getElementById('modalPanel').classList.remove('scale-95');
        }, 10);
    };

    const closeModal = () => {
        document.getElementById('myModal').classList.add('opacity-0');
        document.getElementById('modalPanel').classList.add('scale-95');
        setTimeout(() => {
            setIsModalOpen(false);
        }, 300);
        products.forEach((k,v)=>{
            if(k.isCheck===true){
                map.set(v,k)
                products.delete(v)
            }
            setFlag(flag+1)
        })
    };

    return (
        <div className='text-xs' >
            <button id='togle'
                onClick={openModal}
                class="flex items-center border border-red-500 text-red-500 px-4 py-2 mt-2 md:mt-0 rounded hover:bg-red-100"
            >
                <span class="mr-2 text-lg">+</span> Thêm sản phẩm
            </button>
            {/* Modal */}
            {isModalOpen && (
                <div  id="myModal" className="relative z-10 opacity-0 transition-opacity duration-300 ease-out">
                    {/* Background backdrop */}
                    <div
                        id="modalOverlay"
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        aria-hidden="true"
                        onClick={closeModal}
                    ></div>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex items-end justify-center text-center sm:items-center sm:p-0">
                            <div id="modalPanel"
                                className="relative transform scale-95 transition-transform duration-300 ease-out overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-4xl"
                            >
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4" >
                                    <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4" id="modal-title">
                                        Danh sách sản phẩm
                                    </h3>

                                    {/* Search Bar */}
                                    <div className="relative mb-4">
                                        <input
                                            type="text"
                                            placeholder="Tên hoặc mã sản phẩm"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                                        />
                                        
                                    </div>
                                    <Stack spacing={2}> 
                                        <Pagination
                                            onChange={(event,value)=>{
                                                page.page=value-1
                                                setFlags(flags+1)
                                            }}
                                            count={page.page}
                                            renderItem={(item) => (
                                            <PaginationItem
                                                slots={{ previous: IoArrowBackCircleOutline, next: IoArrowForwardCircleOutline }}
                                                {...item}
                                            />
                                            )}
                                        />
                                    </Stack>
                                    <div style={{height:"400px",overflow:"auto"}}>

                                    <table class="min-w-full border border-gray-300">
                                        <thead class="bg-gray-100">
                                            <tr>
                                                <th class="px-4 py-2 border-b text-left">
                                                    <input type="checkbox" class="form-checkbox" />
                                                </th>
                                                <th class="px-4 py-2 border-b text-left">Sản Phẩm</th>
                                                <th class="px-4 py-2 border-b text-right">Doanh số</th>
                                                <th class="px-4 py-2 border-b text-right">Giá</th>
                                                <th class="px-4 py-2 border-b text-right">Kho hàng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.from(products.entries()).map(([key, value]) => (
                                                <tr class="bg-white py-2">
                                                <td class="px-4 py-2 border-b text-left">
                                                    <input type="checkbox" onClick={()=>handleOnclick(value)} class="form-checkbox" />
                                                </td>
                                                <td class="px-4 py-2 border-b text-left">
                                                    <div class="flex items-center">
                                                        <img
                                                            src={value.productImage}
                                                            alt="Product Image"
                                                            class="w-10 h-10 rounded"
                                                        />
                                                        <div class="ml-2">
                                                            <div class="text-sm font-semibold">{value.productName}</div>
                                                            <div class="text-xs text-gray-500">Mã: {key}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-4 py-2 border-b text-right">0</td>
                                                <td class="px-4 py-2 border-b text-right">{value.minPrice}  - {value.maxPrice} (VND)</td>
                                                <td class="px-4 py-2 border-b text-right">{value.soLuong}</td>
                                            </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    </div>
                                    {/* Category Selection with Horizontal Scroll */}
                                   
                                </div>

                                <div className="flex mt-2 ml-2 mr-2" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                    <p>
                                        Đã chọn: <strong>2 sản phẩm</strong>
                                    </p>
                                    <div
                                        className="flex  px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
                                        style={{ alignItems:"center",justifyContent:"center" }}
                                    >
                                        <button onClick={closeModal}
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        >
                                            Xác nhận
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default  React.memo(VoucherModal);
