import { useEffect, useState } from 'react';
import KhuyenMaiModal from './ModalKhuyenMai';
import api from '../../../config/APISeller';
import ButtonAdd from '../utils/ButtonAdd';
import ButtonDelete from '../utils/ButtonDelete';
import { useParams } from 'react-router-dom';

const UpdateKhuyenMai = () => {
    const{ id}=useParams()
    let date = new Date();
    const [size,setSize]=useState(new Set())
    date.setHours(date.getHours() + 2);
    const [khuyenMai, setKhuyenMai] = useState({
        tenKhuyenMai: 'Khuyến mãi giá tốt',
        giaTriKhuyenMai: 2,
        ngayBatDau: new Date(),
        ngayKetThuc: date,
    });
    const [length,setLength]=useState(0)


    useEffect(()=>{
        api.get(`/khuyenmai/detail/${id}`).then(v=>v.data).then(v=>{
            setKhuyenMai(v.data.khuyenMai)
            api.post("/khuyenmai/getitem",v.data.item ,{
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(v=>v.data).then(v=>{
                setListProduct(new Map(v.data.map(item => [item.productId, item])))
                v.data.forEach(v=>{
                    v.isNew=false;
                })
                setLength(v.data.length)
            })
        })
    },[])


    const [listProduct, setListProduct] = useState(new Map());
    const [flag, setFlag] = useState(0);
    const handleSubmit = () => {
        if (listProduct.size > 0) {
            insertPromotion();
        } else {
            alert('Bạn chưa chọn sản phẩm nào ');
        }
    };


    const updateKhuyenMai=()=>{
        let a=Array.from(listProduct.keys()).splice(length)
        if(window.confirm("Bạn có chắc muốn cập nhật khuyến mãi này")){
            api.post("/khuyenmai/update",{
                "khuyenMai":khuyenMai,
                "set":a
            },{
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(v=>{
                alert("Cập nhật thành công")
            }).catch(error=>alert("Cập nhật thất bại"))
        }

    }

    const deleleItems=()=>{
        api.post(`/khuyenmai/deleteitems/${khuyenMai.id}`,Array.from(size),{
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(v=> v.data).then(v=>{
            if(v.status==200){
                alert(v.message)
                size.forEach(v=>{
                    listProduct.delete(v)
                })
                setFlag(flag+1)
                setLength(length-size.size)
                size.clear()
            }else{
                alert(v.message) 
            }
        }).catch(error=>{
            alert("Danh sách các sản phẩm ites không hợp lệ")
        })
    }


    const checkValidProduct=()=>{
        api.post("/khuyenmai/checkvalid", {
            "startDate":khuyenMai.ngayBatDau,
            "endDate":khuyenMai.ngayKetThuc,
            "l":Array.from(listProduct.keys())
        },{
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(v=>v.data).then(v=>{
            if(v.length>0){
                alert("Có một số sản phẩm còn đang ko hợp lệ cần được loại bỏ")
                v.forEach(vv => {
                    listProduct.delete(vv)
                });
                setFlag(flag+1)
            }
        })
    }

    const chooseDelete=(id)=>{
        if(size.has(id)==true){
            size.delete(id)
        }else{
            size.add(id)
        }
        setFlag(flag+1)
    }

    const deleteItem=(id)=>{
        alert(id)
        listProduct.delete(id)
        setFlag(flag+1)
    }


    const insertPromotion = () => {
        api.post(
            '/khuyenmai/insert',
            {
                khuyenMai: khuyenMai,
                set: Array.from(listProduct.keys()),
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
            .then((v) => v.data)
            .then((v) => {
                if(v.status==200){
                    alert(v.message)
                }else{
                    alert(v.message)
                }
            })
            .catch((error) => {
                alert(error.response.data.message)
            });
    };

    return (
        <>
            <div style={{ borderRadius: '7px' }} className="container mx-auto p-4 relative bg-white">
                <p className=" font-semibold">Kênh người bán * Quản lý khuyến mãi </p>
                <div className=" border-gray-200 relative"></div>
            </div>

            <div style={{ borderRadius: '7px' }} className="shadow-md mt-3 container mx-auto p-4 relative bg-white">
                <p className="font-semibold">Thông tin cơ bản</p>
                <div class="container mx-auto mt-3">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Tên khuyến mãi</div>

                        <div class="col-span-12 lg:col-span-10  ">
                            <input
                                value={khuyenMai.tenKhuyenMai}
                                onChange={(e) => {
                                    khuyenMai.tenKhuyenMai = e.target.value;
                                    setFlag(flag + 1);
                                }}
                                type="text"
                                placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                                class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                            />
                            <p className="hidden lg:block text-xs mt-2 text-danger">
                                {khuyenMai.tenKhuyenMai.length < 1 || khuyenMai.tenKhuyenMai.length > 145
                                    ? 'Độ dài tên khuyến mãi không hợp lệ'
                                    : ''}
                            </p>
                            <p className="hidden lg:block text-xs mt-2 text-warning">Giới hạn 150 ký tự ( 2/150 )</p>
                        </div>
                    </div>
                </div>

                <div class="container mx-auto mt-3">
                    <div class="container mx-auto mt-3">
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Giá trị giảm</div>

                            <div class="col-span-12 lg:col-span-10  ">
                                <input
                                    value={khuyenMai.giaTriKhuyenMai}
                                    onChange={(e) => {
                                        khuyenMai.giaTriKhuyenMai = e.target.value;
                                        setFlag(flag + 1);
                                    }}
                                    type="text"
                                    placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                                    class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                />
                                <p className="hidden lg:block text-xs mt-2 text-danger">
                                    {khuyenMai.giaTriKhuyenMai < 1 || khuyenMai.giaTriKhuyenMai > 99 ? 'Giá trị giảm không hợp lệ' : ''}
                                </p>
                                <p className="hidden lg:block text-xs mt-2 text-warning">Giới hạn 150 ký tự ( 2/150 )</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* thời gian sử dụng voucher */}
                <div class="container mx-auto mt-3">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Thời gian sử dụng mã </div>

                        <div class="col-span-12 lg:col-span-10">
                            <input
                                onChange={(e) => {
                                    khuyenMai.ngayBatDau = new Date(e.target.value);
                                    checkValidProduct()
                                }}
                                type="datetime-local"
                                placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                                class="w-5/12 lg:w-3/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                            />
                            <span className="inline-block ml-1 ml-2"> to </span>
                            <input
                                onChange={(e) => {
                                    khuyenMai.ngayKetThuc = new Date(e.target.value);
                                    checkValidProduct()
                                }}
                                type="datetime-local"
                                placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                                class="ml-2 w-5/12 lg:w-3/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                            />
                            <p class="hidden lg:block text-xs mt-2 text-warning">
                                Thời gian bắt đầu phải lớn hơn hiện tại và thời gian áp dụng phải lớn hơn 1h.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ borderRadius: '7px' }} className="mt-2 container mx-auto p-4 relative bg-white">
                <div class="flex justify-between items-center w-full p-2 flex-wrap md:flex-nowrap">
                    <div class="text-gray-500">
                        <span className="text-sm">
                            Sản phẩm được áp dụng ( <span className="text-xs ">1 sản phẩm được áp dụng</span> )
                        </span>
                    </div>
                    <KhuyenMaiModal khuyenMai={khuyenMai} map={listProduct} flag={flag} setFlag={setFlag} />
                </div>
            </div>
            

            <div style={{ borderRadius: '7px', overflow: 'auto' }} className="mt-2 mb-5 container mx-auto p-4 relative bg-white">
                <table className="rounded-lg min-w-full bg-white border border-gray-200" style={{ overflow: 'hidden' }}>
                    {/* Table Header */}
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border-b text-left font-semibold text-gray-700"> </th>
                            <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">Tên sản phẩm</th>
                            <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">Giá gốc</th>
                            <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">Giá sau giảm</th>
                            <th className="px-4 py-2 border-b text-left font-semibold text-gray-700">Kho hàng</th>
                            <th className="px-4 py-2 border-b text-left font-semibold text-gray-700"></th>
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody className="text-xs">
                        {/* Row */}
                        {Array.from(listProduct.entries()).map(([key, value]) => {
                            return (
                                <>
                                    <tr>
                                        <td className="text-center "><input onClick={()=>chooseDelete(key)} type='checkbox'></input></td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center ">
                                                <img src={value.productImage} style={{ width: '50px' }} />

                                                <div>
                                                    <div className="font-semibold text-gray-800">{value.productName}</div>
                                                    <div className="text-xs text-gray-500">SKU sản phẩm: Banh-banhcuon</div>
                                                    <div className="text-xs text-gray-500">ID Sản phẩm: {value.productId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border-b text-gray-700">- d-</td>
                                        <td className="px-4 py-4 border-b text-gray-700">- -</td>
                                        <td className="px-4 py-4 border-b text-gray-700">{value.totalProduct}</td>
                                        {value.isCheck===true?<td donClick={()=>deleteItem(key)} ><  ButtonDelete /></td>:<td></td>}
                                        {/* <td className="px-4 py-4 border-b text-gray-700" onClick={()=>deleteItem(key)}><ButtonDelete/></td> */}
                                    </tr>
                                    {value.productDetails.map((v) => {
                                        return (
                                            <>
                                                <tr >
                                                    <td></td>
                                                    <td className="px-4 py-4" style={{ backgroundColor: '#f0f0f0' }}>
                                                        <div className="flex items-center ">
                                                            <img
                                                                style={{ width: '50px' }}
                                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARoSURBVHgB7ZyJbuM6DEWVNN33BS3Q//+2ougGdN/73hxhGGgwiceRHZEyeACjCeDEMa9JkZTU0cvLy3/BUWMcHFVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGVcAGUmoULe3t7C5+dn+Pj4CF9fX2E8HofJZBI2NjbC5uZmqIlRTctSMPz9/X14f3+few5CbG9vh/39/VADVQjw8/MTDf/4+Nj6Mwhxenoa/1rGvAAY/+rqKoYbYTQaha2trRhyeA14xevrawxJQg0imBfg9vY2PD8/T9/v7u7G8ELcn8XDw0M8EA6si2A6C8LwqfEx/OHh4Vzjw97eXjS4nINHIKJVzAqA4Yj7AsZvO7Cura2Fk5OT6XvCEwO4RcwKkMbzlZWVhbMaxgfClZCKaQmzAqQZT25KmX7OqheYFEAKLIGMJwfGgfX19en7pvpBC5MCpIbCgE2D7r9IxUtTWSuYFCB9+hlQu5B6AO0LaxRLjnn6JDdvc67AZ7rE7u/v7+lrhF3kuxC/i/e1oUghxk1TzdYGWRR1xzLxdrQyRQRYthsvixK/2wVQxi3TQIkGnnuAMkXS0D4FoP9Px5P8nieUg/SSgzyfjIs+Ul/XWjZVzQnP64iKENKAQwx6SYvMoM2ihOcWE4CbaVuIzeLo6Cjs7OxM38uTzneKAKlXkL8jxsXFRbBMFQJgSDE+VfLNzc0f7YoUROBcJubTyZwcBuUBXZC+PkZvMj7QyOP4VeF37n4OLgTlIGEFiOlNxk/pYyAeTCEGfWQUbY3fF4MSIPdm0nGja2vaIuYFoJ0sIjAWlFpeUuo65ktUjC/5PCLWsNptEcx7ALCi4enpKb7G+Ofn57EuSGe7+qZEFQzmsyDh7u4uhiOphMn1ORiYyXgWyZDaUKp/VZUv4wkUV4hAoQV4BGMDR5vV09aoxgMEWWqIoQlBiCFjAr0gDsIV60O7eMTgPKDvG5IOKB5BeooHSNFGaEKI6+vr7JUQpQQYRKOe/hBewcS/9H8Q4uzsLDtjGpwAJW4oDU9yTbKlHAYnQKm0DhBA1v+UWNvThUF5QIo047huzrU9BCnjg3BCzkC6uro6fZ2TjpYKmeY9gDyf1sMiewSI+zKDljsr5nXA78+I4aX6lWp4HrKJT7C6M0Yw3YqgE3p5eRn3e8lk+/HxcZxwl93yslOep55d8qnQGD+3Gh5kLyhnYp4iCxF4svEAROB7mnbN5GzsnvVbS2BeABCDcvCUY3wG2XSGjHMQi/STENVlCYz81hJUN7OBgfta+dbEINNQXyP6N0Utwn7fGij5oBQVoJZVDWkRt2yKCkAWU0MYWva+sJSi1iCFPDg4CJahiCvpqSr/rkaWj1vaOC2FHDNpJanqX5YNEc8LlXEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlHEBlPkfJmrquXHino8AAAAASUVORK5CYII="
                                                                alt="Product Image"
                                                                class="w-10 h-10 mr-4"
                                                            />
                                                            <div>
                                                                <div className="font-semibold text-gray-800">
                                                                    {v.mauSac.tenMau} - {v.kichThuoc.tenMau}
                                                                </div>
                                                                <div className="text-sm text-gray-500">ID biến thể: {v.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ backgroundColor: '#f0f0f0' }} className="px-4 py-4 text-gray-700">
                                                        $ {v.giaBan}
                                                    </td>
                                                    <td style={{ backgroundColor: '#f0f0f0' }} className="px-4 py-4 text-gray-700">
                                                        $ {v.giaBan - v.giaBan * (khuyenMai.giaTriGiam / 100)}
                                                    </td>
                                                    <td style={{ backgroundColor: '#f0f0f0' }} className="px-4 py-4 text-gray-700">
                                                        {v.soLuong}
                                                    </td>
                                                    <td style={{ backgroundColor: '#f0f0f0' }} className="px-4 py-4 text-gray-700">
                                                    </td>
                                                </tr>
                                            </>
                                        );
                                    })}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            
            </div>
            <div
                onClick={() => {
                    updateKhuyenMai();
                }}
                style={{ position: 'fixed', bottom: '20px', right: '8%' }}
            >
                <ButtonAdd />
            </div>

            <div 
                onClick={() => {
                    
                }}
                style={{ position: 'fixed',zIndex:"22",visibility:`${size.size>0?"visible":"hidden"}`, bottom: '20px', left: '8%' }}
            >
                <button onClick={()=>{
                    deleleItems()
                }} style={{backgroundColor:"red"}}>Xóa</button>
            </div>
        </>
    );
};
export default UpdateKhuyenMai;



