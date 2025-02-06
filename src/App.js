import { ClientRoutes } from "./routes/clientRoute";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { createContext, useEffect, useState, Suspense } from "react";
import api from "./config/APIUser";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import CustomRoute from "./routes/CustomeRoute";
import loadings from "../src/utils/images/loading.gif";
// import SellerChat from "./pages/seller/Chat/SellerChat";
import RegisterShop from "./pages/client/RegisterShop";
import WatchLive from "./pages/client/Live/Rename";
// const MainSeller = React.lazy(() => import("../src/pages/seller/MainSeller"));
// const OrderDetail = React.lazy(() => import("../src/pages/seller/hoaDon/OrderDetail"));
// const DashboardMain = React.lazy(() => import("../src/pages/seller/DashboardMain"));
// const ViewProduct = React.lazy(() => import("../src/pages/seller/viewproduct/ViewProduct"));
// const CUProduct = React.lazy(() => import("../src/pages/seller/product/CUproduct"));
// const UpdateProduct = React.lazy(() => import("../src/pages/seller/product/UpdateProduct"));
// const CUKhuyenMai = React.lazy(() => import("../src/pages/seller/KhuyenMai/CUKhuyenMai"));
// const KhuyenMaiView = React.lazy(() => import("../src/pages/seller/KhuyenMai/KhuyenMaiView"));
// const UpdateKhuyenMai = React.lazy(() => import("../src/pages/seller/KhuyenMai/UpdateKhuyenMai"));
// const HoaDonView = React.lazy(() => import("../src/pages/seller/hoaDon/HoaDonView"));
// const ReviewList = React.lazy(() => import("../src/pages/seller/Rating"));
// const ListVoucher = React.lazy(() => import("../src/pages/seller/voucher/ListVoucher"));
// const VoucherView = React.lazy(() => import("../src/pages/seller/voucher/VoucherView"));
// const VoucherUpdate = React.lazy(() => import("../src/pages/seller/voucher/VoucherUpdate"));
// const OrderConfirmation = React.lazy(() => import("../src/pages/seller/voucher/VoucherDetail"));
const Page404 = React.lazy(() => import("../src/pages/Page404"));

export const AppContext = createContext();

function App() {
  const [loading, setLoading] = useState(true); // State loading
  const [announces, getAnnouces] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [carts, setCarts] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);


  const setFloadingPage=()=>{
    setLoading(true);
    setTimeout(()=>{
      setLoading(false)
    },300)
  }
  useEffect(()=>{
    setFloadingPage()
  },[])
  const fetchCart = () => {
    api
      .get("/getcountcart")
      .then((v) => v.data)
      .then((v) => {
        if (v.status === 200) {
          setCarts(v.data);
        }
      })
      .catch((error) => {
      });
  };

  const getAnnounces = () => {
    api
      .get("/gettrangthaithongbao")
      .then((v) => v.data)
      .then((v) => {
        v.data = v.data.content;
        getAnnouces(v);
      })
      .catch((error) => {
        console.log("Có lỗi");
      });
  };

  useEffect(() => {
    const token = Cookies.get("tokenModel");
    const userInfos = Cookies.get("userInfo");
    if (token && userInfos) {
      setUserInfo(userInfos);
      fetchCart();
      getAnnounces();
    } else {
      
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        userInfo,
        setUserInfo,
        carts,
        setCarts,
        shopInfo,
        setShopInfo,
        fetchCart,
        announces,
        setFloadingPage
      }}
    >
      <div className="relative">
        {/* Modal Loading */}
        {loading && (
          <div className="fixed inset-0 z-50 bg-white bg-opacity-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16 mx-auto mb-4"></div>
              <p className="text-lg font-medium"><img width="100px" src={loadings} alt="Loading..." /></p>
            </div>
          </div>
        )}
        <Toaster />
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 bg-white bg-opacity-80 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16 mx-auto mb-4"></div>
                <p className="text-lg font-medium">Loading...</p>
              </div>
            </div>
          }
        >
          <Routes>
          <Route path="/live/:liveId" element={<WatchLive />} />
            <Route path="/admin/*" element={<CustomRoute />} />
            <Route path="/*" element={<ClientRoutes />} />
            <Route path="/registershop" element={<RegisterShop />} />
            <Route path="/404" element={<Page404 />} />
            {/* <Route path="/seller" element={<MainSeller />}>
              <Route path="orderdetail/:id" element={<OrderDetail />} />
              <Route path="*" element={<DashboardMain />} />
              <Route path="product" element={<ViewProduct />} />
              <Route path="newproduct" element={<CUProduct />} />
              <Route path="updateproduct/:id" element={<UpdateProduct />} />
              <Route path="khuyenmai" element={<CUKhuyenMai />} />
              <Route path="newkhuyenmai" element={<KhuyenMaiView />} />
              <Route path="updatekhuyenmai/:id?" element={<UpdateKhuyenMai />} />
              <Route path="order" element={<HoaDonView />} />
              <Route path="review" element={<ReviewList />} />
              <Route path="voucher/:type?" element={<ListVoucher />} />
              <Route path="newvoucher/" element={<VoucherView />} />
              <Route path="updatevoucher/:type?" element={<VoucherUpdate />} />
              <Route path="voucherinfo/:id" element={<OrderConfirmation />} />
              <Route path="chat" element={<SellerChat />} />
            </Route> */}
          </Routes>
        </Suspense>
{/* 
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        /> */}
      </div>
    </AppContext.Provider>
  );
}

export default App;
