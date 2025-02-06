import { useEffect, useRef, useState } from 'react';
import api from '../../../config/APISeller';
import OrderItemCancel from './OrderItemCancel';
import gsap from 'gsap';
import order from "../../../utils/images/seller/order.png"
const DonHuy = () => {
    const tableRef = useRef(null);
    const [filter,setFilter]=useState({
        "key":"",
        "sortBy":1,
        page:0
    })
    const endOfPageRef = useRef(null);
    const [isCheckTab,setIsCheckTab]=useState(false)
    const [orders,setOrders]=useState([])
    const getOrrder=()=>{
        api.get(`/order/getAllOrderNormal/donhuy?page=${filter.page}&key=${filter.key}&sortBy=${filter.sortBy}&trangThaiId=7`).then(v=>v.data).then(v=>{
            setOrders(v.content)
            console.log(v.content)
            gsap.fromTo(
                tableRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );
            
        })
    }
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting &&addpage()
        );
        observer.observe(endOfPageRef.current);

        return () => observer.disconnect();
    }, []);


    const changEcheckTab=()=>{
        orders.forEach(v=>{
            v.isCheck=!isCheckTab;
        })
        setIsCheckTab(!isCheckTab);
    }

    const addpage=()=>{
        filter.page=filter.page+1
        api.get(`/order/getallchuanbihang?page=${filter.page}&key=${filter.key}&sortBy=${filter.sortBy}&trangT`).then(v=>v.data).then(v=>{
            setOrders(prevOrders => [...prevOrders, ...v.content]);
            setIsCheckTab(!isCheckTab);
        })
    }
    useEffect(()=>{
        getOrrder()
    },[])
    return (
        <>
        <div  >
            
            <br />
            <div className="flex align-content-center ">
                <div className="w-12/12 mr-1 lg:w-5/12 p-1 ml-10    focus:outline-none  text-sm ">
                    <div class=" relative  ">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                        <input
                            value={filter.key}
                            onChange={(e)=>{
                                setFilter((prevFilter) => ({
                                    ...prevFilter,
                                    key: e.target.value
                                }));
                            }}
                            type="text"
                            name="price"
                            id="price"
                            class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            placeholder="0.00"
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center">
                            <label for="currency" class="sr-only">
                                Currency
                            </label>
                            <select
                                onChange={(e)=>{
                                    
                                }}
                                id="currency"
                                name="currency"
                                class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                            >
                                <option value={1} name={1} className='font-bold'>Tên khách hàng</option>
                                <option value={2} name={2} className='font-bold'>Mã Hóa đơn</option>
                            </select>
                        </div>
                    </div>
                </div>
                <select style={{ height: '38px' }} class="mr-1 rounded w-12/12 lg:w-5/12  border border-gray-200  text-sm">
                    <option>Sort theo ngày đặt đơn</option>
                    <option>Sort theo giá tiền</option>
                </select>
                <button onClick={()=>{
                    filter.page=0
                    getOrrder()
                }} className="bg-red-500 d-inline-block text-white p-2 text-sm rounded">Áp dụng</button>
            </div>
            <br />
            {/* <div className="mb-3 ml-11">
                <input onClick={()=>{
                    changEcheckTab()
                }} type="checkbox"/> <span className='text-sm font-semibold'></span>
            </div> */}
            <div className={`${orders.length > 0 ? 'hidden' : 'block'} h-[300px] mt-5 `}>
                    <img style={{ width: '90px', margin: '0 auto' }} src={order} />
                    <p className="text-gray-400 text-center text-sm">Không có dữ liệu...</p>
                </div>
            <div ref={tableRef}>
                {
                    orders.map(v=><OrderItemCancel isCheckTab={isCheckTab}  order={v}/>)
                }
            </div>
            <a ref={endOfPageRef}  className="bg-blue-500 text-white">
               
            </a>
        </div>
        </>
    );
};
export default DonHuy;

