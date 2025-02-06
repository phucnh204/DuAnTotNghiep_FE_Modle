import React, { useEffect, useState } from "react";
import api from "../../config/APIUser";
import { Link } from "react-router-dom";
// import promotionsData from "../../data/json/promotions.json"; // Import JSON data
import NotNotifycation from "../../assets/client/images/NotNotifycation.png"
import toast from "react-hot-toast";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from "react-icons/io5";
const MyAccountNofPromotion = () => {
  
  const [promotions,setPromotions] = useState([]); 
  const [filter,setFilter]=useState({
      page:0,
      numPage:0
  })
  const [flag,setFlag]=useState(0)
  const getThongBao=()=>{
    api.get(`/getthongbao?type=VOUCHER&page=${filter.page}`).then(v=>v.data).then(v=>{
        filter.numPage=v.totalPages
        setPromotions(v.content)
    })

  }

  
  let  pinReadedAll=()=>{
    const ids = promotions.filter(v=>v.trangThaiDoc===0).map(obj => parseInt(obj.id, 10));
    if(ids.length>0){
      toast.promise(
        api.post("/pinreadedAll",ids,{
          headers:{
            "Content-Type":"application/json"
          }
        }).then(v=>v.data).then(v=>{
          if(v.status===200){
            promotions.forEach(v=>v.TrangThaiDoc=1)
              setFlag(flag+1)
          }else{
            throw new Error(v.message)
          }
        }),
        {
          loading:"Đang cập nhật",
          success:"Thành công",
          error:error=>error.message
        }
        )
    }
  }
  const pinReaded=(id,index)=>{
    toast.promise(
    api.post("/pinreaded?id="+id).then(v=>v.data).then(v=>{
      if(v.status===200){
          promotions[index].trangThaiDoc=1
          setFlag(flag+1)
      }else{
        throw new Error(v.message)
      }
    }),
    {
      loading:"Đang cập nhật",
      success:"Thành công",
      error:error=>error.message
    }
    )
  }


  useEffect(()=>{
    getThongBao()
  },[])
  return (
    <>
      <div className="col-lg-10">
        <div className="card-nof">
          <div className="head-profile">
            <span className="fw-5 fs-18 d-flex justify-content-end">
            <Stack spacing={4}>
            <Pagination
              onChange={(event, value) => {
                filter.page = value - 1;
                getThongBao()
              }}
              count={filter.numPage}
              renderItem={(item) => (
                <PaginationItem
                  slots={{
                    previous: IoArrowBackCircleOutline,
                    next: IoArrowForwardCircleOutline,
                  }}
                  {...item}
                />
              )}
            />
          </Stack>
              <span  onClick={()=>pinReadedAll()}  >Đánh dấu đã đọc tất cả</span>
            </span>
          </div>
          {promotions.length<1&&<div className=" w-full" style={{height:"500px"}}>
              <img src={NotNotifycation} style={{width:"70px",display:"block",margin:"auto auto",marginTop:"70px"}}/>
          </div>}
          <div className="body-profile mt-4">
            {promotions.map((notification,index) => (
              <div key={notification.id}>
              <div
                className={`row card-nof-oder ${
                  notification.trangThaiDoc!==1 ? "bg-white" : "bg-light-blue"
                } p-3`}
                style={{
                  backgroundColor: notification.read ? "#ffffff" : "#e0f4ff",
                }}
              >
                <div className="col-md-2">
                  <img
                    src={notification.thongBao.hinhAnh}
                    alt="Product"
                    className="img-fluid"
                  />
                </div>
                <div className="col-md-7">
                  <p className="fw-6 fs-16">{notification.thongBao.tieuDe} - {notification.trangThaiDoc===1?"Đã đọc":"Chưa đọc"}</p>
                  <p>{notification.thongBao.noiDung}</p>
                  <p>
                    29/09/2024
                    <a
                      className="btn-dropdown"
                      onClick={() =>
                        (document.getElementById(
                          `list-con-${notification.id}`
                        ).style.display = "block")
                      }
                    >
                      {" "}
                      v{" "}
                    </a>
                  </p>
                  {notification.trangThaiDoc===1?<></>:<p className="text-blue-500 cursor-pointer" onClick={()=>pinReaded(notification.id,index)}>Đánh dấu đã xem</p>}

                </div>
                <div className="col-md-3 text-center">
                  <Link to={"/client/my-account-order"} className="btn btn-light btn-outline-secondary">
                    Xem chi tiết
                  </Link>
                </div>
              </div>

              <div
                id={`list-con-${notification.id}`}
                className="list-con mt-3"
                style={{ display: "none" }}
              >
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccountNofPromotion;
