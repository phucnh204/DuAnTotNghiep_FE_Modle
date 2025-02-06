import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/APIUser";
import { AppContext } from "../../App";

const MyAccountPassword = () => {

  const [data,setDate]=useState({
    pass:"",
    newPasse:""
  })
  const {setFloadingPage } = useContext(AppContext);
  const updatePass=()=>{
    toast.promise(api.post(`/changepass?newpass=${data.newPasse}&password=${data.pass}`).then(v=>v.data).then(v=>{
      if(v.status!==200){
        throw new Error(v.message)
      }
    }),{
      loading:"Đang kiểm tra",
      success:"Đổi mật khẩu thành công",
      error:error=>error.message
    })
  }

  useEffect(()=>{
    setFloadingPage()
  },[])

  return (
    <>
      <div className="col-lg-10">
        <div className="card-profile">
          <div className="head-profile">
            <span className="fw-6 fs-18">Hồ Sơ Của Tôi</span>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
          </div>
          <div className="body-profile mt-4">
            <div className="row">
              {/* Left Column */}
              <div className="col-md-12">
                <form className="p-5">
                  <div className="mb-3 row align-items-center">
                    <label
                      htmlFor="new-password"
                      className="col-sm-3 col-form-label"
                    >
                      Mật khẩu mới
                    </label>
                    <div className="col-sm-9">
                      <div className="input-group">
                        <input
                          onChange={(e)=>data.pass=e.target.value}
                          type="password"
                          id="new-password"
                          className="form-control"
                          placeholder="Nhập mật khẩu"
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
                  <div className="mb-3 row align-items-center">
                    <label
                      htmlFor="confirm-password"
                      className="col-sm-3 col-form-label"
                    >
                      Xác nhận mật khẩu
                    </label>
                    <div className="col-sm-9">
                      <div className="input-group">
                        <input
                          onChange={(e)=>data.newPasse=e.target.value}
                          type="password"
                          id="new-password"
                          className="form-control"
                          placeholder="Nhập lại mật khẩu"
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
                  <button type="button" onClick={()=>updatePass()} className="btn btn-primary">
                    Xác nhận
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

export default MyAccountPassword;
