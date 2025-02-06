import { Input, Stack, Textarea } from '@mui/joy';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Pagination, PaginationItem, prerelease, Rating } from '@mui/material';
import { pink } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import api from '../../config/APISeller';
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from 'react-icons/io5';
import { BsClipboard2, BsOpencollective } from 'react-icons/bs';


const ReviewCard = React.memo(({ review }) => {

    const getOrderDetail=()=>{
        api.get(`/danhgia/getorderdetailbyid?id=${review.productId}`).then(v=>v.data).then(v=>{
            review.orderDetail=v;
            setFlag(flag+1)
        })
    }

    const updateComment=(value)=>{
        api.post(`/danhgia/updatecommentdanhgia?comment=${value}&danhGiaId=${review.id}`).then(v=>v.data).then(v=>{
            alert(v.message)
        })
    }

    const [flag,setFlag]=useState(0)
    return  <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
    <div className="flex items-center mb-4">
        <img src="https://via.placeholder.com/50" alt="Profile" className="w-12 h-12 rounded-full" />
        <div className="ml-4">
            <h3 className="font-medium text-sm">Id tài khoản: {review.account.id}</h3>
            <p className="text-sm text-gray-500">Tên tài khoản: {review.account.hoVaTen}</p>
        </div>
    </div>
    <div className="flex mb-4 align-items-center">
        <div className="space-x-1">
            <Rating defaultValue={review.soSao} />
        </div>
        <p className="text-sm text-gray-500 ml-2">{review.ngayDanhGia}</p>
    </div>
    <p className="text-gray-700 mb-2">{review.noiDungDanhGia}</p>
    <div class="flex flex-wrap  gap-2 p-2">
        {review.chiTietDanhGias!=null&&review.chiTietDanhGias.map(v=>
            v.type==="IMAGE"?<img src={v.link} alt="Image 1" class="w-12 h-12 object-cover rounded-lg" />:<video controls src={v.link} alt="Image 1" class="w-12 h-12 object-cover rounded-lg" />
        )}
    </div>
    <Accordion sx={{ boxShadow: 'none' }}>
        <AccordionSummary sx={{ boxShadow: 'none' }}
          expandIcon={<BsOpencollective />}
          aria-controls="panel2-content"
          id="panel2-header"
          onClick={()=>getOrderDetail()}
        >
         <div className="inline-block px-4 py-2 bg-pink-50 text-pink-500 rounded-lg text-sm font-semibold border border-pink-500 ">
            Chi tiết sản phẩm
        </div>
        </AccordionSummary>
        <AccordionDetails>
        <div className="flex flex-wrap">
            <div className="w-full md:w-1/12 p-1">
                <img style={{width:"50px"}} src={review.orderDetail!=null?review.orderDetail.product.hinhAnh:""} alt="Example" className=" object-cover rounded-lg" />
            </div>
            <div className="w-full md:w-6/12 p-1">
                <h2 className="text-sm font-bold mb-4">ID đơn hàng: {review.orderDetail!=null?review.orderDetail.order.id:""} </h2>
                <p className="text-sm text-gray-700">
                    {review.orderDetail!=null?review.orderDetail.product.product.tenSanPham:""}
                </p>
                <p className="text-sm text-gray-700">
                    {review.orderDetail!=null?review.orderDetail.product.mauSac.tenMau+ " - "+review.orderDetail.product.kichThuoc.tenKichThuoc:""}
                </p>
            </div>
        </div>
        </AccordionDetails>
      </Accordion>
    <div className="space-x-2">
        <span className="text-xs text-gray-500 ml-2">Phản hồi của bạn</span>
        <Textarea onBlur={(e)=>{
            updateComment(e.target.value)
        }} onChange={e=>{
            review.shopPhanHoi=e.target.value
            setFlag(flag+1)
        }} value={review.shopPhanHoi} />
    </div>
</div>
}); 



const ReviewList = () => {
    const [star, setStar] = useState(new Map([ [1, 1], [2, 2],
        [3, 3],
        [4, 4],
        [5, 5]
      ]));
    const [filter,setFilter]=useState({
        type:0,
        key:"",
        page:0,
        numPage:1,
        spaceTime:7
    })
    const [flag,setFlag]=useState(0)
    const getDanhGia=()=>{
        api.post(`/danhgia/getdanhgiashop?page=${filter.page}&type=${filter.type}&key=${filter.key}&spaceDate=${filter.spaceTime}`,Array.from(star.keys()),{
            headers:{
                "Content-Type":"application/json"
            }
        }).then(v=>v.data).then(v=>{
            filter.numPage=v.totalPages
            setRatings(v.content)
        })
    }
    useEffect(()=>{
        getDanhGia()
    },[])

    const checkStar=(id)=>{
        if(star.get(id)!=null){
            star.delete(id)
        }else{
            star.set(id,id)
        }
        filter.page=0
        getDanhGia()
    }
    const [ratings,setRatings]=useState([])
    return (
        <div className="bg-white min-h-screen py-8 px-4">
            <div class="p-4">
                <div class="flex items-center space-x-4 mb-4">
                    <span class="text-gray-600">Trạng thái</span>
                    <button  onClick={()=>{
                        filter.type=0
                        getDanhGia()
                    }}   class="px-4 py-2 rounded-full border border-red-500 text-red-500 font-medium hover:border-red-600">Tất cả </button>
                    <button onClick={()=>{
                        filter.type=1
                        getDanhGia()
                    }} class="px-4 py-2 rounded-full border border-red-500 text-red-500 font-medium">Chưa phản hồi </button>
                    <button  onClick={()=>{
                        filter.type=2
                        getDanhGia()
                    }}  class="px-4 py-2 rounded-full border border-red-500 text-red-500 font-medium">Đã phản hồi</button>
                </div>

                <div class="flex items-center space-x-2">
                    <span class="text-gray-600">Số sao đánh giá</span>
                    
                    <Checkbox onClick={()=>checkStar(5)}  defaultChecked sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] } }} />
                    <span>5 sao</span>
                    <Checkbox onClick={()=>checkStar(4)}  defaultChecked sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] } }} />
                    <span>4 sao</span>
                    <Checkbox onClick={()=>checkStar(3)}  defaultChecked sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] } }} />
                    <span>3 sao</span>
                    <Checkbox onClick={()=>checkStar(2)}  defaultChecked sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] } }} />
                    <span>2 sao</span>
                    <Checkbox onClick={()=>checkStar(1)} defaultChecked sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] } }} />
                    <span>1 sao</span>
                </div>
                <br/>
                <select onChange={(e)=>{
                    filter.spaceTime=e.target.value;
                    getDanhGia()
                }} class="mr-2 w-5/12 lg:w-3/12 p-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                >
                    <option value={7}>7 ngày trước</option>
                    <option value={30}>Tháng này</option>
                    <option value={180}>6 tháng trước</option>
                    <option value={365}>năm trước</option>
                    <option value={36500}>Tất cả</option>
                </select>
                
               
        
                <Stack spacing={4}>

                <Input onBlur={()=>{
                    getDanhGia()
                }} onChange={(e)=>{
                    filter.key=e.target.value
                }} className="w-6/12 mt-3 d-inline-block " placeholder='Tên tài khoản, nội dung đánh giá'/>
                
                <Pagination
                    onChange={(event, value) => {
                        filter.page = value - 1;
                        getDanhGia()
                    }}
                    count={filter.numPage}
                    renderItem={(item) => (
                        <PaginationItem slots={{ previous: IoArrowBackCircleOutline, next: IoArrowForwardCircleOutline }} {...item} />
                    )}
                />
            </Stack>
            </div>

            {ratings.map((review, index) => (
                <ReviewCard review={review} />
            ))}
        </div>
    );
};

export default ReviewList;
