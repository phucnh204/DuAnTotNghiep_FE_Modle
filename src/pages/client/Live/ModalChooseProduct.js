import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../config/APIUser';

const ModalChooseProductLive = ({ product,sendMessage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [indexs, setIndex] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const addToCart = () => {
        toast.promise(
            api.post( '/cart/addtocart',
                    {
                        productDetailId: product.p.productDetails[indexs].id,
                        soLuong: quantity,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )
                .then((v) => v.data)
                .then((v) => {
                    if (v.status !== 200) {
                        throw new Error(v.message)
                    } else{
                        sendMessage(2)
                    }
                }),
            {
                loading: 'Đang thêm vào giỏ hàng...',
                success: 'Thêm thành công vào giỏ hàng...',
                error: (error)=>error.message,
            },
        );
    };

    useEffect(() => {
        setIsOpen(true);
    }, [product]);
    return (
        <div>
            {isOpen &&product!=null && (
                <div style={{zIndex:"77"}} className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-10/12 lg:w-10/12 relative">
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                            &times;
                        </button>
                        <div className="flex gap-4">
                            <img src={product.p.hinhAnh} alt="Product" className="w-24 h-24 rounded" />
                            <div>
                                <div className="text-red-500 text-sm font-bold  w-full overflow-hidden">{product.p.tenSanPham}</div>
                                <div className="text-gray-700 text-sm">Giảm: <span className='text-red-600 font-bold'>{product.giaGiam}%</span></div>
                                <div style={{background: 'linear-gradient(to right, #ffcc00, #ff6600)'}} className="text-white-900 p-1 rounded-md text-sm">Giá chỉ có trên Live</div>
                                <div className="text-gray-600 text-sm">
                                    Chỉ còn: {product.soLuongLive < 1 ? 'Không giới hạn' : product.soLuongLive +" lượt"}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="text-gray-700 font-semibold mb-2">Biến thể</div>
                            <div className="grid grid-cols-2 gap-2" style={{ height: '200px', overflow: 'auto' }}>
                                {product.p.productDetails.length > 0 ? (
                                    product.p.productDetails.map((v, index) => (
                                        <button
                                            onClick={() => setIndex(index)}
                                            key={index}
                                            className={`  bg-gray-100 border p-1 flex align-items-center   ${
                                                index === indexs ? ' border-red-500  font-semibold text-red-500' : 'text-gray-800'
                                            } `}
                                        >
                                            <img width={'50px'} src={v.hinhAnh} />
                                            <div className={`text-center text-xs ml-1 `}>
                                                {v.kichThuoc.tenKichThuoc} - {v.mauSac.tenMau}
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded">
                    <button
                      type="button"
                      onClick={() => {
                        if (quantity - 1 > 0) {
                            setQuantity(quantity - 1);
                        }
                    }}
                    //   onClick={() => changeQuantity(quantity - 1)}
                      className="px-4 py-2 border-r text-gray-700 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <input
                    //   onChange={(e) => changeQuantity(e.target.value)}
                      type="text"
                      value={quantity}
                      className="w-12 text-center text-red-500 focus:outline-none"
                    />
                    <button
                    onClick={() => {
                        if (quantity < product.p.productDetails[indexs].soLuong) {
                            setQuantity(quantity + 1);
                        }
                    }}
                      type="button"
                      className="px-4 py-2 border-l text-gray-700 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-500">
                    {/* {orderDetail.product.productDetails[indexChoose].soLuong} sản phẩm có sẵn */}
                  </span>
                </div>
                        </div>
                        <div className="mt-6">
                            <button onClick={() => addToCart()} className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600">
                                Thêm vào Giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default React.memo(ModalChooseProductLive);
