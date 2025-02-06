import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/APIUser";
import { Link } from "react-router-dom";
import { AppContext } from "../../App";

const MyAccountProfile = () => {
  const {setFloadingPage } = useContext(AppContext);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    setFloadingPage()
    api.get("/getprofile").then(v=>v.data).then(v=>{
      if(v.status===200){
        if(v.data.sinhNhat!=null){
          v.data.sinhNhat=new Date(v.data.sinhNhat)
        }else{
          v.data.sinhNhat=new Date()
        }
        setProfile(v.data)
      }else{
        toast.error("Có lỗi lấy dữ liệu")
      }
    })
  }, []);


  if (!profile) {
    return <p>Loading...</p>;
  }

  const handleFileChangePopu=(e)=>{
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('files', file);
    toast.promise(fetch('http://localhost:8080/upload-single-files', {
      method: 'POST',
      body: formData,
  })
      .then((v) => v.json())
      .then((v) => {
         if(v.status!=200){
          throw new Error(v.message)
         }
        setProfile({ ...profile, hinhAnh:v.data})
         
      }),{
        loading:"Đang upload ảnh...",
        success:"Upload thành công",
        error:error=>error.message
      })
}
  const updateProfile=()=>{
    profile.tenTaiKhoan=profile.tenTaiKhoan.trim()
    profile.hoVaTen=profile.hoVaTen.trim()
    toast.promise(api.post("/updateprofile",profile,{
      headers:{
        "Content-Type":"application/json"
      }
    }).then(v=>v.data).then(v=>{
      if(v.status!==200){
        throw new Error(v.message)
      }
    }),{
      loading:"Đang upload ảnh...",
      success:"Upload thành công",
      error:error=>error.message
    })
  }

  return (
    <div className="col-lg-10">
      <div className="card-profile">
        <div className="head-profile">
          <span className="fw-6 fs-18">Hồ Sơ Của Tôi</span>
          <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
        </div>
        <div className="body-profile mt-4">
          <form>
            <div className="row">
              {/* Left Column */}
              <div className="col-md-8 body-profile-left">
                <div className="mb-3 row align-items-center">
                  <label htmlFor="username" className="col-sm-3 col-form-label">
                    Tên tài khoản
                  </label>
                  <div className="col-sm-9">
                    <input value={profile.tenTaiKhoan} onChange={(e)=>setProfile({ ...profile, tenTaiKhoan:e.target.value})} id="Name" className="fw-6 p-2 w-8/12 border border-gray-500 focus:border-gray-200"/>
                  </div>
                </div>
                <div className="mb-3 row align-items-center">
                  <label htmlFor="fullName" className="col-sm-3 col-form-label">
                    Tên
                  </label>
                  <div className="col-sm-9">
                  <input onChange={(e)=>setProfile({ ...profile, hoVaTen:e.target.value})} value={profile.hoVaTen} id="Name" className="fw-6 p-2 w-8/12 border border-gray-500 focus:border-gray-200"/>
                  </div>
                </div>
                <div className="mb-3 row align-items-center">
                  <label htmlFor="email" className="col-sm-3 col-form-label">
                    Email
                  </label>
                  <div className="col-sm-9">
                    <span id="email">{profile.email}</span>
                    <Link to={"/client/my-account-changeemail"} className="text-primary ms-3">
                      Thay đổi
                    </Link>
                  </div>
                </div>
                <div className="mb-3 row align-items-center">
                  <label htmlFor="phone" className="col-sm-3 col-form-label">
                    Số điện thoại
                  </label>
                  <div className="col-sm-9">
                    <span id="phone">{profile.soDienThoai}</span>
                   
                  </div>
                </div>
                <div className="mb-3 row align-items-center">
                  <label htmlFor="gender" className="col-sm-3 col-form-label">
                    Giới tính
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="Nam"
                      checked={profile.gioiTinh == 0}
                      onChange={() => setProfile({ ...profile,gioiTinh: 0  })}
                    />{" "}
                    Nam
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="Nữ"
                      checked={profile.gioiTinh == 1}
                      onChange={() => setProfile({ ...profile, gioiTinh: 1  })}
                    />{" "}
                    Nữ
                    <input
                      type="radio"
                      id="other"
                      name="gender"
                      value="Khác"
                      checked={profile.gioiTinh == 2}
                      onChange={() =>
                        setProfile({ ...profile, gioiTinh: 2 })
                      }
                    />{" "}
                    Khác
                  </div>
                </div>

                <div className="mb-3 row align-items-center">
                  <label htmlFor="birthday" className="col-sm-3 col-form-label">
                    Ngày sinh
                  </label>
                  <div className="col-sm-6">
                    <span>{profile.sinhNhat.toLocaleDateString('en-CA')}</span>
                  <input onChange={(e)=>setProfile({ ...profile, sinhNhat:new Date(e.target.value)})} type="date" id="Name" className="fw-6 p-2 w-8/12 border border-gray-500 focus:border-gray-200"/>
                  </div>
                </div>
                <button type="button" onClick={()=>updateProfile()} className="btn btn-primary">
                  Lưu
                </button>
              </div>

              {/* Right Column */}
              <div className="col-md-4 d-flex flex-column align-items-center">
                <img
                  src={profile.hinhAnh}
                  alt="Avatar"
                  className="rounded-circle mb-3"
                  style={{ width: 150 }}
                />
                <div className="text-center">
                  <input
                    type="file"
                    accept=".jpeg,.jpg,.png"
                    onChange={handleFileChangePopu}
                    style={{ display: "none" }}
                    id="avatarInput"
                  />
                  <label
                    htmlFor="avatarInput"
                    className="btn btn-outline-secondary"
                  >
                    Chọn Ảnh
                  </label>
                  <p className="mt-2 text-muted">
                    Dung lượng file tối đa 1MB
                    <br />
                    Định dạng: .JPEG, .PNG
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyAccountProfile;
