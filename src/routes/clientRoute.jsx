import React, { useContext, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ClientLayout from "../layouts/Clientlayout";
import HomePage from "../pages/client/HomePage";
import Sidebar from "../components/client/Sidebar";
import MyAccountProfile from "../pages/client/MyAccountProfile";
import MyAccountOrder from "../pages/client/MyAccountOrder";
import MyAccountAddress from "../pages/client/MyAccountAddress";
import MyAccountPassword from "../pages/client/MyAccountPassword";
import MyAccountNotification from "../pages/client/MyAccountNotification";
import MyAccountPrivacySettings from "../pages/client/MyAccountPrivacySettings";
import MyAccountNofOder from "../pages/client/MyAccountNofOder";
import MyAccountNofPromotion from "../pages/client/MyAccountNofPromotion";
import MyAccountNofUpdateModelworld from "../pages/client/MyAccountNofUpdateModelworld";
import MyAccountVoucher from "../pages/client/MyAccountVoucher";
import DetailProduct from "../pages/client/DetailProduct";
import MyAccountOrderDetail from "../pages/client/MyAccountOrderDetail";
import Shop from "../pages/client/Shop";
import ChangeEmail from "../pages/client/ChangeEmail";
import LoginForm from "../pages/client/Login";
import RegisterForm from "../pages/client/Register";
import VoucherHistory from "../pages/client/VoucherHistory";
import api from "../config/ApiNormal";
import { AppContext } from "../App";
import ProductPage from "../pages/client/ProductPage";
import Checkout from "../pages/client/Cart";
import Checkouts from "../pages/client/Checkout";
import Cookies from 'js-cookie';
import MyFavorite from "../pages/client/MyFavorite";
// import RegisterShop from "../pages/client/RegisterShop";
import ShopProductPage from "../pages/client/ShopProductPage";
import WatchLive from "../pages/client/Live/Rename";
import TopFavorite from "../pages/client/TopFavorite";
import PromotionalProducts from "../pages/client/PromotionalProducts";


export const  ClientRoutes = () => (
  
  <ClientLayout>
      
    <Routes>
    <Route path="/home/find/:searchQuery" element={<ProductPage />} />
    <Route path="/shop/:searchQuery/product" element={<ShopProductPage />} />
      <Route path="login" element={< LoginForm/>} />
      <Route path="register" element={< RegisterForm/>} />
      {/* <Route path="/detailvoucher/:voucherId" element={<DetailVoucher />} /> */}
      <Route path="/favoriteProduct" element={<TopFavorite />} />
      <Route path="/PromotionalProducts" element={<PromotionalProducts />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<DetailProduct />} />
      <Route path="/test" element={<test />} />
      {/* <Route path="/live/:liveId" element={<WatchLive />} /> */}
      <Route path="shop/:id" element={<Shop />} />
      <Route path="/client/*" element={<UserCheckLoginRoute />} />
    </Routes>
  </ClientLayout>
);


// Import tất cả các component khác ở đây...

const UserCheckLoginRoute = () => {
  const { setUserInfo } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    let token = Cookies.get("tokenModel");
    if (token != null) {
      api.post("/user/checkuser?token=" + token)
        .then((v) => v.data)
        .then((v) => {
          if (v.status === 200) {
            localStorage.setItem("userInfo", JSON.stringify(v.data));
            setUserInfo(v.data);
          } else {
            navigate("/login");
          }
        });
    } else {
      navigate("/login");
    }
  }, [setUserInfo, navigate]); // Đảm bảo useEffect có phụ thuộc đúng

  const location = useLocation();
  const showSidebar = location.pathname !== "/client/checkout" && location.pathname !== "/client/cart";

  return (
    <>
      <Routes>
        <Route path="cart" element={<Checkout />} />
        <Route path="checkout" element={<Checkouts />} />
      </Routes>
      {showSidebar && <Sidebar />}
      <Routes>
        {/* <Route path="registershop" element={<RegisterShop />} /> */}
        <Route path="my-account-profile" element={<MyAccountProfile />} />
        <Route path="my-account-order/:id?" element={<MyAccountOrder />} />
        <Route path="my-account-changeemail" element={<ChangeEmail />} />
        <Route path="my-account-orderDetail/:id" element={<MyAccountOrderDetail />} />
        <Route path="my-account-address" element={<MyAccountAddress />} />
        <Route path="my-account-password" element={<MyAccountPassword />} />
        <Route path="my-account-notification" element={<MyAccountNotification />} />
        <Route path="my-account-privacy-settings" element={<MyAccountPrivacySettings />} />
        <Route path="my-account-nof-order" element={<MyAccountNofOder />} />
        <Route path="my-account-nof-promotions" element={<MyAccountNofPromotion />} />
        <Route path="my-account-nof-Update-Modelworld" element={<MyAccountNofUpdateModelworld />} />
        <Route path="myfavorite" element={<MyFavorite />} />
        <Route path="my-account-voucher" element={<MyAccountVoucher />} />
        <Route path="my-account-voucher-history" element={<VoucherHistory />} />
        
      </Routes>
    </>
  );
};

export default React.memo(UserCheckLoginRoute);

