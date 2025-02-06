import axios from "axios";
import Cookies from "js-cookie"; // Thư viện để làm việc với cookies
import { useNavigate } from "react-router-dom";

// Tạo instance của axios
const api = axios.create({
  baseURL: "http://localhost:8080/admin/",
  timeout: 10000,
});
let token = Cookies.get("tokenModel");
api.defaults.headers.common["token"] = token === null ? "kk.dd.ww" : token;
// let navigate = useNavigate();

window.addEventListener("focus", () => {
  const updatedToken = Cookies.get("tokenModel");
  api.defaults.headers.common["token"] =
    updatedToken === null ? "kk.dd.ww" : updatedToken;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // alert("sao không đăng nhập");
      window.location.href = "/login";

      return new Promise(() => {});
    } else if(error.response && error.response.status === 404) {
      // alert("sao không 404");
      window.location.href = "/404";
    }
    return Promise.reject(error);
  }
);

export default api;
