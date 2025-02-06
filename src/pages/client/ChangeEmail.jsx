import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/APIUser";

const ChangeEmail = () => {

  const [data,setDate]=useState({
    email:"",
    token:"",
    tokenValid:""
  })

  const updateMail=()=>{
    toast.promise(api.post(`/changemail?email=${data.email}&token=
        ${data.token}&validtoken=${data.tokenValid}`).then(v=>v.data).then(v=>{
            if(v.status!==200){
                throw new Error(v.message)
            }
    }),{
      loading:"Đang kiểm tra",
      success:"Cập nhật email thành công...",
      error:error=>error.message
    })
  }

  const changeEmail=()=>{
    if(isValidEmail(data.email.trim())){
        toast.promise(api.post("/validmaailchange?email="+data.email).then(v=>v.data).then(v=>{
            if(v.status===200){
                data.token=v.data;
            }else{
                throw new Error(v.message)
            }
    
        }),{
            loading:"Đang gửi mail",
            success:"Gửi mail thành công",
            error:error=>error.message
          })
    }else{
        toast.error("Email chưa hợp lệ")
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


  return (
    <>
      <div className="col-lg-10">
        <div className="card-profile">
          <div className="head-profile">
            <span className="fw-6 fs-18">Hồ Sơ Của Tôi</span>
            <p>Cập nhật email</p>
          </div>
          <div className="body-profile mt-4">
            <div className="row">
              <div className="col-md-12">
                <form className="p-5">
                  <div className="mb-3 row align-items-center">
                    <label
                      htmlFor="new-password"
                      className="col-sm-3 col-form-label"
                    >
                      Email
                    </label>
                    <div className="col-sm-9">
                      <div className="input-group">
                        <input
                          onChange={(e)=>data.email=e.target.value}
                          type="email"
                          id="new-password"
                          className="form-control"
                          placeholder="Email"
                        />
                        <button
                          className="show-hide-password"
                          type="button"
                          id="toggle-password"
                        >
                          <i className="bi bi-eye" />
                        </button>
                      </div>
                    </div>
                    
                  </div>
                  <button type="button" onClick={()=>changeEmail()} className="btn mb-3 btn-primary">
                    Gửi mã xác nhận.
                  </button>
                  <div className="mb-3 row align-items-center">
                    <label
                      htmlFor="confirm-password"
                      className="col-sm-3 col-form-label"
                    >
                      Mã xác thực
                    </label>
                    <div className="col-sm-9">
                      <div className="input-group">
                        <input
                          onChange={(e)=>data.tokenValid=e.target.value}
                          type="text"
                          id="new-password"
                          className="form-control"
                          placeholder="Mã xác thực email"
                        />
                        <button
                          className="show-hide-password"
                          type="button"
                          id="toggle-password"
                        >
                          <i className="bi bi-eye" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={()=>updateMail()} className="btn btn-primary">
                    Cập nhật email
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeEmail;
