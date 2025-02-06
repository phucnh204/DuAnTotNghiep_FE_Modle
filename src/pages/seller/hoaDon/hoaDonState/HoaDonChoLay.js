import { useEffect, useRef, useState } from 'react';
import OrderItemChuanBi from '../OrderItems';
import api from "../../../../config/APISeller";
import gsap from 'gsap';
import order from "../../../../utils/images/seller/order.png"

const ChuanBiHang = () => {
    const tableRef = useRef(null);
    const [filter, setFilter] = useState({
        "key": "",
        "sortBy": 1,
        page: 0
    });
    const [isCheckTab, setIsCheckTab] = useState(false);
    const [orders, setOrders] = useState([]);
    
    const getOrrder = () => {
        api.get(`/order/getallchuanbihang?page=${filter.page}&key=${filter.key}&sortBy=${filter.sortBy}`)
            .then(v => v.data)
            .then(v => {
                setOrders(v.content);
                gsap.fromTo(
                    tableRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 0.7, y: 0, duration: 0.6, ease: 'power3.out' }
                );
            });
    };

    const endOfPageRef = useRef(null);
    const [flage, setFlag] = useState(0);

    const changEcheckTab = () => {
        const updatedOrders = orders.map(v => ({ ...v, isCheck: !isCheckTab }));
        setOrders(updatedOrders);
        setIsCheckTab(!isCheckTab);
    };

    const addpage = () => {
        const newPage = filter.page + 1;
        api.get(`/order/getallchuanbihang?page=${newPage}&key=${filter.key}&sortBy=${filter.sortBy}`)
            .then(v => v.data)
            .then(v => {
                setOrders(prevOrders => [...prevOrders, ...v.content]);
                setFlag(flage + 1);
            });
    };

    const submit = (l,message) => {
        let listOrder = orders.filter(v => v.isCheck).map(obj => obj.id);
        
        if (listOrder.length > 0) {
            if (window.confirm("Bạn có chắc muốn cập nhật trạng thái các đơn hàng")) {
                if (l === true) {
                    api.post(`/order/chuanbidon/pdf?message=${message}`, listOrder, {
                        headers: { 'Content-Type': 'application/json' },
                        responseType: 'blob'
                    })
                    .then(response => {
                        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'generated.pdf');
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                    })
                    .catch(error => {
                        console.error("Error downloading the PDF:", error);
                    });
                } else {
                    api.post("/order/chuanbidon", listOrder, {
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .then(v => v.data)
                    .then(v => {
                        alert(v.message);
                    })
                    .catch(error => {
                        console.error("Error updating orders:", error);
                    });
                }
                filter.page=0
                getOrrder()
            }
        } else {
            alert("Bạn chưa chọn đơn nào");
        }
    };

    useEffect(() => {
        getOrrder();
    }, []);
    
    return (
        <>
            <div>
                <br />
                <div className="flex align-items-center">
                    <div className="w-12/12 mr-1 lg:w-5/12 p-1 ml-10 focus:outline-none text-sm">
                        <div className="relative">
                            <input
                                value={filter.key}
                                onChange={(e) => {
                                    setFilter((prevFilter) => ({
                                        ...prevFilter,
                                        key: e.target.value
                                    }));
                                }}
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                placeholder="Mã đơn hàng, tên người mua"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <select
                                    onChange={(e) => {}}
                                    id="currency"
                                    className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                >
                                    <option value={1} className='font-bold'>Tên khách hàng</option>
                                    <option value={2} className='font-bold'>Mã Hóa đơn</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <select  className="h-[38px] mr-1 rounded w-12/12 lg:w-5/12 border border-gray-200 text-sm">
                        <option>Sort theo ngày đặt đơn</option>
                        <option>Sort theo giá tiền</option>
                    </select>
                    <button onClick={() => {
                        setFilter((prevFilter) => ({ ...prevFilter, page: 0 }));
                        getOrrder();
                    }} className="text-red-600 border-2 border-red-600 p-2 text-sm rounded">Áp dụng</button>
                </div>
                <ChuanBiHangModal submit={submit}/>
                <br />
                <div className="mb-3 ml-11">
                    <input onClick={changEcheckTab} type="checkbox" /> <span className='text-sm font-semibold'></span>
                </div>
                <div  className={`${orders.length > 0 ? "hidden" : "block"} h-[300px]`}>
                <img className='block w-[90px] mx-auto' src={order}/>

                    <p className=' text-center text-sm'>Không có dữ liệu...</p>
                    </div>
                <div ref={tableRef}>
                    {orders.map(v => <OrderItemChuanBi key={v.id}  isCheckTab={isCheckTab} order={v} />)}
                </div>
                <a ref={endOfPageRef} className=' text-white'></a>
            </div>
        </>
    );
};


export default ChuanBiHang;


const ChuanBiHangModal = ({submit}) => {
    const [isPdf,setPdf]=useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        submit(isPdf,document.getElementById("message").value)
        setTimeout(() => {
            setIsModalOpen(false);
        }, 300);
    };

    return (
        <div className="text-xs ">
    <button 
        onClick={openModal}
        className="rounded-[2px] text-yellow-700 d-inline-block border-2 border-yellow-700 pl-4 pr-4 pb-2 pt-2 mt-2 ml-11"
    >
        Hoàn tất chuẩn bị
    </button>

    {isModalOpen && (
        <div id="myModal" className="relative z-10 opacity-0 transition-opacity duration-300 ease-out">
            <div
                id="modalOverlay"
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
                onClick={closeModal}
            ></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex items-end justify-center text-center sm:items-center sm:p-0">
                    <div
                        id="modalPanel"
                        className="relative transform scale-95 transition-transform duration-300 ease-out overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-5/12 sm:max-w-5/12"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4" id="modal-title">
                                Thông tin chuẩn bị hàng
                            </h3>

                            <div className="relative mb-1">
                                <p>Ghi chú với đơn vị vận chuyển</p>
                                <textarea
                                    style={{ backgroundColor: 'white', color: 'black' }}
                                    id="message"
                                    rows="7"
                                    className="block p-2.5 w-full text-sm text-gray-900  rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Write your thoughts here..."
                                ></textarea>

                                <label className="mt-3 py-2 text-sm text-gray-700">
                                    <input onClick={() => setPdf(!isPdf)} type="checkbox" /> Xuất mẫu đơn
                                </label>
                            </div>
                        </div>

                               <button
                                    onClick={closeModal}
                                    type="button"
                                    className=" mb-2 ml-4 w-full  rounded-sm text-red-600 border-2 border-red-600 px-3 py-2 text-sm font-semibold  shadow-sm ml-3 sm:w-auto"
                                >
                                     Xác nhận
                                </button>
                                
                    </div>
                </div>
            </div>
        </div>
    )}
</div>

    );
};
