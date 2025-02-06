import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginss from "../../utils/images/login.png";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/ApiNormal";
import apiUser from "../../config/APIUser";
import toast from "react-hot-toast";
import { AppContext } from "../../App";
import Cookies from "js-cookie";

function LoginForm() {
  const [data, setData] = useState({
    soDienThoai: "",
    password: "",
  });
  const { setUserInfo, setCarts, userInfo } = useContext(AppContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const login = () => {
    toast.promise(
      api
        .post(
          `/account/login?userName=${data.soDienThoai}&password=${data.password}`,
          null,
          {
            headers: {
              valid: "valid",
            },
          }
        )
        .then((v) => v.data)
        .then((v) => {
          console.log(v.data);
          if (v.status !== 200) {
            throw new Error(v.message);
          } else {
            localStorage.setItem("tokenModel", v.data.token);
            Cookies.set("tokenModel", v.data.token, {
              path: "/",
              domain: "localhost",
              secure: false,
              sameSite: "Lax",
              expires: 30,
            });
            Cookies.set("userInfo", JSON.stringify(v.data.userInfo), {
              path: "/",
              domain: "localhost",
              secure: false,
              sameSite: "Lax",
              expires: 30,
            });

            if (v.data.role === "QuanTri") {
              window.location.href = "/admin";
              return;
            }

            api
              .get("/getcountcart")
              .then((v) => v.data)
              .then((v) => {
                if (v.status === 200) {
                  setCarts(v.data);
                }
              })
              .catch((error) => {
                alert("Có lỗi xảy ra");
              });

            setUserInfo(v.data.userInfo);
            apiUser
              .get("/getcountcart")
              .then((v) => v.data)
              .then((v) => {
                if (v.status === 200) {
                  setCarts(v.data);
                }
              });

            window.location.href = "/";
          }
        }),
      {
        loading: "Đang đăng nhập",
        success: "Đăng nhập thành công",
        error: (error) => error.message,
      }
    );
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen lg:w-[1000px] mx-auto flex items-center justify-center">
      <div className="w-full p-5 bg-white border border-gray-300  shadow  rounded- grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Form đăng nhập */}
        <div className="bg-gray-50">
          <h2 className="my-8 text-3xl md:text-4xl font-bold text-center text-gray-800">
            Đăng nhập
          </h2>
          {loginError && (
            <p className="text-red-500 text-center mb-4">{loginError}</p>
          )}
          <form className="space-y-6 p-3">
            <div className="flex flex-col items-center">
              <input
                type="text"
                id="username"
                name="username"
                onChange={(e) => (data.soDienThoai = e.target.value)}
                required
                className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none focus:ring"
                placeholder="Tài khoản"
              />
            </div>
            <div className="flex flex-col items-center relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={(e) => (data.password = e.target.value)}
                required
                className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring"
                placeholder="Mật khẩu"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-lg text-gray-500" />
                ) : (
                  <FaEye className="text-lg text-gray-500" />
                )}
              </button>
            </div>

            <div className="flex justify-between items-center px-4">
              <span className="text-sm text-gray-500">
                Bạn chưa có tài khoản?
              </span>
              <Link
                to="/register"
                className="text-sm text-blue-500 hover:underline"
              >
                Đăng ký
              </Link>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => login()}
                type="button"
                className={`w-3/4 bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                 
                                `}
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>

        <div className="md:block rounded-lg transform  transition duration-300 relative">
          <div className="relative z-10  text-center">
            <img
              src={loginss}
              alt="Hình ảnh"
              className="object-cover h-[380px] rounded-r-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
