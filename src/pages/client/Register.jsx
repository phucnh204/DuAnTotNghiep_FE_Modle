import React, { useState } from 'react';
import { BiLogoFacebookSquare } from 'react-icons/bi';
import { IoLogoGoogleplus } from 'react-icons/io';
import api from '../../config/ApiNormal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import loginIcon from "../../assets/admin/images/users/loginicon.png"
function RegisterForm() {
    const navigate=useNavigate()
    const [data,setData]=useState({
        soDienThoai:"",
        password:"",
        token:"",
        validToken:"",
        tenTaiKhoan:""
    })

    const register=()=>{
        if(isValidVietnamPhoneNumber(data.soDienThoai)){
            if(data.password.length>4||data.validToken.length>5||data.tenTaiKhoan.trim().length<5){
                toast.promise(api.post(`/account/register?soDienThoai=${data.soDienThoai.trim()}&password=${data.password.trim()}
                    &token=${data.token.trim()}&validToken=${data.validToken.trim()}&tenTaiKhoan=${data.tenTaiKhoan}`).then(v=>v.data).then(v=>{
                        if(v.status!==200){
                            throw new Error(v.message)
                        }else{
                            navigate("/login")
                        }
                }),{
                    loading:"Đang xử lý",
                    success:"Đăng ký tài khoản thành công",
                    error:error=>error.message
                })
            }else{
                toast.error("Vui lòng nhập đầy đủ thông tin đăng ký")
            }
        }else{
            toast.error("Số điện thoại không hợp lệ")
        }
    }

    const sendOTP=()=>{
        if(isValidVietnamPhoneNumber(data.soDienThoai)){
            toast.promise(api.post("/account/sendotp?phone="+data.soDienThoai.trim()).then(v=>v.data).then(v=>{
                if(v.status!==200){
                    throw new Error(v.message)
                }else{
                    console.log(v.data)
                    data.token=v.data
                }
            }),{
                loading:"Đang gửi OTP",
                success:"Gửi thành công OTP vui lòng nhập vào ô xác nhận mã",
                error:error=>error.message
            })
        }else{
            toast.error("Số điện thoại không hợp lệ")
        }
    }




    // Kiểm tra định dạng số điện thoại
    function isValidVietnamPhoneNumber(phone) {
        // Biểu thức chính quy kiểm tra số điện thoại Việt Nam
        const phoneRegex = /^(?:\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
        return phoneRegex.test(phone);
      }

    return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
              <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="w-full md:w-1/2 relative ">
                  <img src={loginIcon}alt="" />
                </div>
                {/* Form đăng ký */}
                <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-white to-blue-50 shadow-inner">
                  <h2 className="text-3xl md:text-4xl mb-6 font-bold text-center text-gray-800">
                    Đăng ký
                  </h2>
                  <form className="space-y-5">
                    <input
                      type="tel"
                      id="password"
                      name="password"
                      onChange={(e) => (data.soDienThoai = e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Số điện thoại"
                    />
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                      <span></span>
                      <span
                        onClick={() => sendOTP()}
                        className="text-blue-500 cursor-pointer"
                      >
                        Gửi OTP
                      </span>
                    </div>
                    <input
                      type="password"
                      id="confirmPassWord"
                      name="confirmPassWord"
                      onChange={(e) => data.password=(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Mật khẩu"
                    />

                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      onChange={(e) => (data.tenTaiKhoan = e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Tên đăng nhập"
                    />
                    <input
                      type="password"
                      id="phone"
                      name="phone"
                      onChange={(e) => (data.validToken = e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Mã OTP"
                    />
        
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                      <span>Bạn đã có tài khoản?</span>
                      <button className="text-blue-500 hover:underline">
                        Đăng nhập
                      </button>
                    </div>
        
                    <button
                      onClick={() => register()}
                      type="button"
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105"
                    >
                      Đăng ký
                    </button>
                  </form>
        
                </div>
        
                {/* Phần bên phải có hình ảnh */}
              </div>
            </div>
          
    );
}

export default RegisterForm;
