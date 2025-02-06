import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import api from '../../../config/APISeller';
import OrderItemChoThanhToan from './OrderItemChoThanhToan';
import order from '../../../utils/images/seller/order.png';
const ChoThanhToan = () => {
    const tableRef = useRef(null);
    const [filter, setFilter] = useState({
        key: '',
        soGio: 1,
        page: 0,
        isFetched: 0,
    });

    const [isCheckTab, setIsCheckTab] = useState(false);
    const [orders, setOrders] = useState([]);
    const getOrrder = () => {
        api.get(`/order/chothanhtoan?page=${filter.page}&key=${filter.key}&soGio=${filter.soGio}`)
            .then((v) => v.data)
            .then((v) => {
                setOrders(v.content);
                gsap.fromTo(tableRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' });
            });
    };
    const endOfPageRef = useRef(null);

    const [flage, setFlag] = useState(0);

    const changEcheckTab = () => {
        orders.forEach((v) => {
            v.isCheck = !isCheckTab;
        });
        setIsCheckTab(!isCheckTab);
    };

    const addpage = () => {
        filter.page = filter.page + 1;
        api.get(`/order/chothanhtoan?page=${filter.page}&key=${filter.key}&soGio=${filter.soGio}`)
            .then((v) => v.data)
            .then((v) => {
                setOrders((prevOrders) => [...prevOrders, ...v.content]);
            });
    };

    const submit = () => {
        let listOrder = orders.filter((v) => v.isCheck === true).map((obj) => obj.id);
        if (listOrder.length > 0) {
            if (window.confirm('Bạn có chắc hủy các đơn này')) {
                api.post(`/order/cancellist/Huy don thanh cong}`, listOrder, {
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then((v) => v.data)
                    .then((v) => {
                        alert(v.message);
                        filter.page = 0;
                        getOrrder();
                    })
                    .catch((error) => {
                        console.error('Error downloading the PDF:', error);
                    });
            }
        } else {
            alert('Bạn chưa chọn đơn nào');
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && filter.isFetched !== 0) {
                addpage();
            }
            if (filter.isFetched == 0) {
                filter.isFetched = 9;
            }
        });

        observer.observe(endOfPageRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        getOrrder();
    }, []);
    return (
        <>
            <div>
                <br />
                <div className="flex align-items-center">
                    <div className="w-12/12 mr-1 lg:w-5/12 p-1 ml-10    focus:outline-none  text-sm ">
                        <div class=" relative  ">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                            <input
                                value={filter.key}
                                onChange={(e) => {
                                    setFilter((prevFilter) => ({
                                        ...prevFilter,
                                        key: e.target.value,
                                    }));
                                }}
                                type="text"
                                name="price"
                                id="price"
                                class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                placeholder="ID đơn hàng, tên khách hàng"
                            />
                            <div class="absolute inset-y-0 right-0 flex items-center">
                                <label for="currency" class="sr-only">
                                    Currency
                                </label>
                                <select
                                    onChange={(e) => {}}
                                    id="currency"
                                    name="currency"
                                    class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                >
                                    <option value={1} name={1} className="font-bold">
                                        Tên khách hàng
                                    </option>
                                    <option value={2} name={2} className="font-bold">
                                        Mã Hóa đơn
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <select
                        onChange={(e) => {
                            filter.soGio = e.target.value;
                            filter.page = 0;
                            getOrrder();
                        }}
                        class="mr-1 h-[38px] rounded w-12/12 lg:w-5/12  border border-gray-200  text-sm"
                    >
                        <option value={1}>1h</option>
                        <option value={2}>2h</option>
                        <option value={5}>5h</option>
                        <option value={10}>10h</option>
                        <option value={24}>24h</option>
                        <option value={0}>Tất cả</option>
                    </select>
                    <button
                        onClick={() => {
                            filter.page = 0;
                            getOrrder();
                        }}
                        className="text-red-600 border-2 border-red-600 p-2 text-sm rounded"
                    >
                        Áp dụng
                    </button>
                </div>
                <br />
                <div style={{ display: `${orders.length < 1 ? 'none' : 'block'}` }} className="mb-3 ml-11">
                    <input
                        onClick={() => {
                            changEcheckTab();
                        }}
                        type="checkbox"
                    />{' '}
                    <span className="text-sm font-semibold"></span>
                    <button
                        className={`text-red-600 border-2 border-red-600 d-inline-block bg-transparent pl-3 pr-3 pb-2 pt-2 mt-2 ml-7 mb-2 ${
                            orders.length < 1 ? 'hidden' : 'block'
                        } rounded-[4px]`}
                        onClick={() => submit()}  >
                        Hủy đơn hàng
                    </button>
                </div>

                <div className={`${orders.length > 0 ? 'hidden' : 'block'} h-[300px] mt-5 `}>
                    <img style={{ width: '90px', margin: '0 auto' }} src={order} />
                    <p className="text-gray-400 text-center text-sm">Không có dữ liệu...</p>
                </div>
                <div ref={tableRef}>
                    {orders.map((v, index) => (
                        <OrderItemChoThanhToan
                            index={index}
                            listOrder={orders}
                            flage={flage}
                            setFlage={setFlag}
                            isCheckTab={isCheckTab}
                            order={v}
                        />
                    ))}
                </div>
                <a ref={endOfPageRef} className="bg-blue-600 text-white"></a>
            </div>
        </>
    );
};

export default React.memo(ChoThanhToan);
