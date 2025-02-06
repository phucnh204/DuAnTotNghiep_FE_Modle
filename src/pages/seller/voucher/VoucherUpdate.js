import { useEffect, useRef, useState } from "react";
import VoucherModal from "./ModalVoucher";
import gsap from "gsap";
import { Checkbox } from "@mui/material";
import React from 'react';
import styled from 'styled-components';
import { useNavigate,useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { TbRestore } from "react-icons/tb";

const VoucherUpdate = () => {
    const {type}=useParams()
    const componentRef = useRef(null);
    const  [objectRespone,setObjectRespone]=useState({
        "productDeleteVoucher":[]
    })
    const [flag,setFlag]=useState(1)
    const [size,setSize]=useState(0);
    const [voucher,setVoucher]=useState({voucher:{
        loaiVoucher:1,giaTriGiam:2
        },voucherProducts:new Map()
    })
    const [isApply,setIsApply]=useState(false)
    const [listProduct,setListProduct]=useState(new Map())
    const deleteVoucherInsert=(obj)=>{
        if(obj.isCheck===false){
            objectRespone.productDeleteVoucher.push(obj.productId)
            obj.isDelete=true
        }else{
            listProduct.delete(obj.productId)
        }
        setFlag(flag+1)
    }

    const removeDeleteVoucherInsert=(obj)=>{
        objectRespone.productDeleteVoucher=objectRespone.productDeleteVoucher.filter(v=>v!==obj.productId)
        obj.isDelete=false
        setFlag(flag+1)
    }

    useEffect(()=>{
        if(type!=null){
            fetch(`http://localhost:8080/sale/voucher/getvoucherbyid?id=${type}`).then(v=>v.json()).then(v=>{
                voucher.voucher=v.data.voucher
                const newProductMap = new Map(v.data.voucherDetail.map(item => [item.productId, item]));
                setSize(newProductMap.size)
                setListProduct(newProductMap); 
                newProductMap.forEach((value, key) => {
                    value.isCheck = false;
                });
                let date=new Date()
                if(date>=new Date(voucher.voucher.ngayBatDau)&&date<=new Date(voucher.voucher.ngayKetThuc)){
                    setIsApply(true)
                }
             })
        }        
    },[])

    const handleSubmit=()=>{
            let a= Array.from(listProduct.keys()).map(key => parseInt(key, 10));
            objectRespone.voucherShop=voucher.voucher;
            objectRespone.productInsertVoucher=a.splice(size)
            objectRespone.id=voucher.voucher.id
            updateVoucher()
    }
    const navigate = useNavigate()

    async function updateVoucher() {
        try {
           if(window.confirm("Bạn chắc muốn cập nhật voucher này")){
            fetch('http://localhost:8080/sale/voucher/updatevoucher', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(objectRespone)
              }).then(v=>v.json()).then(v=>{
                if(v.status==200){
                    alert(v.message)
                    navigate("/seller/voucher/0")
                }else{
                    alert(v.message)
                }
              })
           }
        } catch (error) {
            alert("Có lỗi xảy ra")
        }
    }
      

    useEffect(() => {
        gsap.fromTo(
          componentRef.current,
            { x: -100, opacity: 0 }, 
            { x: 0, opacity: 1, duration: 0.3 } 
        );
    }, []);
    return (
        <>
            <div ref={componentRef} className="mb-3">
                <div style={{ borderRadius: '7px' }} className="container mx-auto p-4 relative bg-white">
                    <p className="text-orange-400 font-semibold">Kênh người bán * Quản lý voucher * thao tac voucher</p>
                    <div className=" border-gray-200 relative"></div>
                </div>
                <div style={{ borderRadius: '7px' }} className="shadow-md mt-3 container mx-auto p-4 relative bg-white">
                    <p className="font-semibold">Thông tin cơ bản</p>

                    {/* form */}
                    {/* Tên chương trình */}
                    <div className=" border-gray-200 relative"></div>
                    <div class="container mx-auto mt-3">
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Tên voucher</div>

                            <div class="col-span-12 lg:col-span-10  ">
                                <input
                                    value={voucher.voucher.tenVoucher}
                                    onChange={(e)=>{
                                        voucher.voucher.tenVoucher=e.target.value
                                        setFlag(flag+1)
                                    }}
                                    type="text"
                                    placeholder="Tên voucher hiển thị với người dùng"
                                    class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                />
                                <p className=" hidden lg:block text-xs mt-2 text-warning">Tên Voucher sẽ không được hiển thị cho Người mua</p>
                            </div>
                        </div>
                    </div>
                    {/* mã voucher */}
                    <div class="container mx-auto mt-3">
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Mã giảm giá</div>

                            <div class="col-span-12 lg:col-span-10  ">
                                <input 
                                    disabled
                                    value={voucher.voucher.maVoucher}
                                    maxLength="5"
                                    type="text"
                                    placeholder="Mã voucher áp dụng đối với hóa đơn"
                                    class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                />
                                <p className="hidden lg:block text-xs mt-2 text-warning">Mã giảm giá giới hạn 5 ký tự</p>
                            </div>
                        </div>
                    </div>
                    {/* thời gian sử dụng voucher */}
                    <div class="container mx-auto mt-3">
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Thời gian sử dụng mã </div>

                            <div class="col-span-12 lg:col-span-10">
                                
                                <input
                                disabled
                                value={voucher.voucher.ngayBatDau}
                                    type="datetime-local"
                                    placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                                    class="w-5/12 lg:w-3/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                />
                                <input
                                    onChange={(e)=>{
                                        voucher.voucher.ngayKetThuc= new Date(e.target.value);
                                    }}
                                    type="datetime-local"
                                    placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                                    class="ml-2 w-5/12 lg:w-3/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                />
                                <p class="hidden lg:block text-xs mt-2 text-warning">Thời gian bắt đầu phải lớn hơn hiện tại.</p>
                                <p class="hidden lg:block text-xs mt-2 text-danger">{voucher.voucher.ngayBatDau<voucher.voucher.ngayketThuc?"":"Ngày Bắt đâu phải lớn hơn ngày hiện tại"}</p>
                            </div>
                        </div>
                    </div>

                    {/* mô tả  */}
                    <div class="container mx-auto mt-3">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Mô tả chi tiết</div>

                                <div class="col-span-12 lg:col-span-10  ">
                                    <textarea rows={7}
                                    value={voucher.voucher.moTa}
                                    onChange={(e)=>{
                                        voucher.voucher.moTa=e.target.value
                                        setFlag(flag+1)
                                        // alert(ỏ)
                                    }}
                                        // type="text"
                                        placeholder="Để áp dụng voucher này.."
                                        class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                    />
                                    <p className="hidden lg:block text-xs mt-2 text-danger"></p>
                                    <p className="hidden lg:block text-xs mt-2 text-warning">Giới hạn 150 ký tự ( 2/150 )</p>
                                </div>
                            </div>
                        </div>
                </div>

                {/* thông tin 2 */}
                <div style={{ borderRadius: '7px' }} className="shadow-md mt-3 container mx-auto p-4 relative bg-white">
                    <p className="font-semibold">Thiết lập giảm giá</p>

                    {/* form */}
                    {/* Tên chương trình */}
                    <div className=" border-gray-200 relative"></div>
                    <div class="container mx-auto mt-3">
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Giảm theo phần trăm</div>

                            <div class="col-span-12 lg:col-span-10  ">
                                <Checkbox {..."hhhs"} onChange={()=>{
                                voucher. voucher.loaiVoucher= voucher.voucher.loaiVoucher===1?0:1
                                setFlag(flag+1)
                                }} defaultChecked size="small" />
                            </div>
                        </div>
                    </div>
                    <div class="container mx-auto mt-3">
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">giá trị giảm</div>

                            <div class="col-span-12 lg:col-span-10  ">
                                <input
                                disabled={isApply}
                                    value={voucher.voucher.giaTriGiam}
                                    onChange={(e)=>{
                                        voucher.voucher.giaTriGiam= e.target.value;
                                        // alert(vouch)
                                        setFlag(flag+1)
                                    }}
                                    type="number"
                                    placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                                    class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                />
                                {/* {voucher.voucher.loaiVoucher} */}
                                <p className=" hidden lg:block text-xs mt-2 text-red-600">{voucher.voucher.loaiVoucher==0&&voucher.voucher.giaTriGiam<1000?"Giá vui lòng lớn hơn 1000":""}</p>
                                <p className=" hidden lg:block text-xs mt-2 text-red-600">{voucher.voucher.loaiVoucher==1&&(voucher.voucher.giaTriGiam<1||voucher.voucher.giaTriGiam>99)?"Vui lòng nhập trong khoản 1-99":""}</p>
                                <p className=" hidden lg:block text-xs mt-2 text-warning"> Giảm tiền tối thiểu 1000 VND - 1 đến 99 nếu giảm theo phần trăm</p>
                            </div>
                        </div>
                    </div>
                    {/* mã voucher */}
                    <div class="container mx-auto mt-3">
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Giá trị đơn tối thiểu</div>

                            <div class="col-span-12 lg:col-span-10  ">
                                <input
                                    disabled={isApply}
                                    value={voucher.voucher.donToiThieu}
                                    onChange={(e)=>{
                                        voucher.voucher.donToiThieu= e.target.value;
                                        setFlag(flag+1)
                                    }}
                                    type="number"
                                    placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                                    class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                />
                                <p className=" hidden lg:block text-xs mt-2 text-danger">{voucher.voucher.donToiThieu<0?"Tối thiểu 0":""}</p>
                                <p className="hidden lg:block text-xs mt-2 text-warning">Nhập 0đ nếu không bắt buộc</p>
                            </div>
                        </div>
                    </div>
                    {/* số lược dụng tối đa */}
                    <div class="container mx-auto mt-3">
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Tổng lượt sử dụng tối đa</div>

                            <div class="col-span-12 lg:col-span-10  ">
                                <input
                                    value={voucher.voucher.soLuocDung}
                                    onChange={(e)=>{
                                        voucher.voucher.soLuocDung= e.target.value;
                                        setFlag(flag+1)
                                    }}
                                    type="text"
                                    placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                                    class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                />
                                <p className="hidden lg:block text-xs mt-2 text-danger">{voucher.voucher.soLuocDung<1?<span style={{color: "red", fontWeight: "bolder"}}>&#33; Số lược dùng tối thiểu 1</span>:""}</p>
                            </div>
                        </div>
                    </div>
                    {/* số lược tối đa / người  */}
                    <div class="container mx-auto mt-5">
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left">Tổng lượt sử dụng tối đa/ người</div>

                            <div class="col-span-12 lg:col-span-10  ">
                                <input
                                    disabled={isApply}
                                    value={voucher.voucher.soLuocMoiNguoi}
                                    onChange={(e)=>{
                                        voucher.voucher.soLuocMoiNguoi= e.target.value;
                                        setFlag(flag+1)
                                    }}
                                    type="number"
                                    placeholder="Tìm Tên sản phẩm, SKU sản phẩm, SKU phân loại, Mã sản phẩm"
                                    class="w-11/12 lg:w-9/12 p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                                />
                                <p className="hidden lg:block text-xs mt-2 text-warning">{voucher.voucher.soLuocMoiNguoi<1||voucher.voucher.soLuocMoiNguoi>voucher.voucher.soLuocDung?"Lượt dùng / người phải >0 và < số lượt dùng":""}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* thông tin 2 */}
                <div style={{ borderRadius: '7px' }} className="shadow-md mt-3 container mx-auto p-4 relative bg-white">
                    <p className="font-semibold">Danh sách sản phẩm</p>
                    <div class="flex justify-between items-center w-full p-4 flex-wrap md:flex-nowrap">
                        <div class="text-gray-500">
                            <span className="text-sm">Sản phẩm được áp dụng({listProduct.size }) </span>
                        </div>
                        
                    </div>
                    {/* số lược tối đa / người  */}
                    <div class="container mx-auto mt-2">
                        <div class="grid grid-cols-12 gap-4">
                            {/* <div class="col-span-12 lg:col-span-2 text-sm  lg:text-right sm:text-left"></div> */}

                            <div class="col-span-12 lg:col-span-10  " style={{overflow:"auto",height:"400px"}}>
                                <table class="border w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" >
                                    <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-light-200 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" class="px-6 py-3">
                                                Thông tin sản phẩm
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Khoảng giá bán 
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Tổng số lượng hàng
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Giá ước lượng giảm
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                <span class="sr-only">Thao tác</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from(listProduct.entries()).map(([key, value]) => (
                                                    <tr style={{borderBottom:"1px dotted gray"}} class="bg-white  dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        <img style={{width:"50px"}} src={value.productImage} />
                                                        <p className="text-black">{value.productName} - {value.productId}</p>
                                                    </th>
                                                    <td class="px-6 py-4">{value.minPrice} - {value.maxPrice} (VND)</td>
                                                    <td class="px-6 py-4">{value.soLuong}</td>
                                                    <td class="px-6 py-4">Từ 1000-2000</td>
                                                    <td class="px-6 py-4 text-right">
                                                        {value.isDelete==undefined||value.isDelete==false?<a style={{cursor:"pointer"}} 
                                                        onClick={()=>deleteVoucherInsert(value)} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                            <MdDelete/>
                                                        </a>:<a onClick={()=>{
                                                            removeDeleteVoucherInsert(value)
                                                        }}><TbRestore/></a>}
                                                    </td>
                                                </tr>
                                        ))}
                                        
                                    </tbody>
                                </table>
                                <p className="hidden lg:block text-xs mt-2 text-warning">Không vược quá số lượt tối đa</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div onClick={()=>{
                handleSubmit()
            }} style={{position:"fixed" ,bottom:"20px",right:"8%"}}>
                <MyComponents />
            </div>
            <div  style={{position:"fixed" ,bottom:"80px",right:"2%"}}>
                            <VoucherModal  flag={flag} map={listProduct} setFlag={setFlag}/>
            </div>
         </>
    );
};
export default VoucherUpdate;


// Styled components
const TooltipContainer = styled.div`
  position: relative;
  background-color: #ff3cac;
  background-image: linear-gradient(225deg, #ff3cac 0%, #784ba0 50%, #2b86c5 100%);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 17px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: #fff;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  
  &:hover .tooltip {
    transform: unset;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: -10;
  }

  &:hover .icon {
    transform: rotate(360deg);
    transition: 0.5s linear;
  }
`;

const BordeBack = styled.div`
  width: 60px;
  height: 60px;
  background-color: rgba(248, 250, 252, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: none;
`;

const Icon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background-color: #ff3cac;
  background-image: linear-gradient(225deg, #ff3cac 0%, #784ba0 50%, #2b86c5 100%);
  cursor: pointer;
  transition: 0.4s ease-in-out;
`;

const Tooltip = styled.span`
  position: absolute;
  top: -2;
  z-index: -10;
  transform: scaleX(0);
  transform-origin: left center;
  margin-left: 5px;
  height: 50px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.6s;
  border-radius: 0 50px 50px 0;
  background-color: #ff3cac;
  background-image: linear-gradient(225deg, #ff3cac 0%, #784ba0 50%, #2b86c5 100%);
  display: flex;
  align-items: center;
  justify-content: right;
  padding-right: 16px;
  color: #fff;
  font-size: 18px;
  font-family: sans-serif;
  font-weight: 800px;
  padding-left: 40px;
  margin-left: -25px;
  left: 100%;
`;

const MyComponents = () => {
  return (
    <TooltipContainer>
      <Tooltip className="tooltip text-xs">Thêm</Tooltip>
      <span className="text">
        <BordeBack>
          <Icon className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="37"
              height="37"
              className="bi bi-discord"
              viewBox="0 0 16 16"
            >
              <path
                d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"
              ></path>
            </svg>
          </Icon>
        </BordeBack>
      </span>
    </TooltipContainer>
  );
};
