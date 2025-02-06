import React, { useEffect, useState } from "react";
import axios from "axios";
import Swiper from "../../assets/client/js/swiper-bundle.min.js";
import "../../assets/client/css/swiper-bundle.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/admin/css/admin.css";

const BannerManagement = () => {
  const [swiperImages, setSwiperImages] = useState([]);
  const [otherImages, setOtherImages] = useState({
    image1: null,
    image2: null,
  });
  const [selectedSwiperImages, setSelectedSwiperImages] = useState([]);
  const [selectedOtherImages, setSelectedOtherImages] = useState([]);
  const [loading, setLoading] = useState(false); // Trạng thái tải

  useEffect(() => {
    fetchImages();
  }, []);

  const initializeSwiper = () => {
    const swiperElement = document.querySelector(".tf-sw-slideshow");
    if (swiperElement && typeof Swiper !== "undefined") {
      return new Swiper(".tf-sw-slideshow", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: false,
        speed: 1000,
        pagination: {
          el: ".sw-pagination-slider",
          clickable: true,
        },
        lazy: true,
      });
    }
    return null;
  };

  useEffect(() => {
    if (swiperImages.length > 0) {
      const swiper = initializeSwiper();
      return () => {
        if (swiper) swiper.destroy();
      };
    }
  }, [swiperImages]);

  const fetchImages = () => {
    console.log("Fetching images...");
    axios
      .get("http://localhost:8080/getBannerSwipper")
      .then((response) => {
        console.log("Fetched data:", response.data);
        if (response.data.status === 200) {
          const data = response.data.data;
          setSwiperImages(data.swiperImages.map((img) => img.imageUrl));
          setOtherImages({
            image1: data.otherImages[0]?.imageUrl || null,
            image2: data.otherImages[1]?.imageUrl || null,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  };

  const handleSwiperImageSelect = (e) => {
    setSelectedSwiperImages(e.target.files);
  };

  const handleOtherImageSelect = (e) => {
    setSelectedOtherImages(e.target.files);
  };

  const handleSwiperImageUpload = async () => {
    if (selectedSwiperImages.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ảnh để tải lên!");
      return;
    }

    const formData = new FormData();
    Array.from(selectedSwiperImages).forEach((file) =>
      formData.append("swiperImages", file)
    );

    try {
      setLoading(true); // Bắt đầu tải
      toast.info("Đang tải ảnh lên...");
      await axios.post("http://localhost:8080/addSwiper", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchImages();
      toast.success("Đã tải ảnh Swiper thành công!");
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
      toast.error("Lỗi khi tải ảnh. Vui lòng thử lại.");
    } finally {
      setLoading(false); // Kết thúc tải
    }
  };

  const handleOtherImageUpload = async () => {
    if (selectedOtherImages.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ảnh để tải lên!");
      return;
    }

    const formData = new FormData();
    Array.from(selectedOtherImages).forEach((file) =>
      formData.append("otherImages", file)
    );

    try {
      setLoading(true); // Bắt đầu tải
      toast.info("Đang tải ảnh lên...");
      await axios.post("http://localhost:8080/addBanner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchImages();
      toast.success("Đã tải ảnh Banner thành công!");
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
      toast.error("Lỗi khi tải ảnh. Vui lòng thử lại.");
    } finally {
      setLoading(false); // Kết thúc tải
    }
  };

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="container">
        <div className="row mt-3 demo-slides">
          <div className="col-lg-7">
            <div className="tf-slideshow slider-radius slider-effect-fade position-relative">
              <div className="swiper tf-sw-slideshow">
                <div className="swiper-wrapper">
                  {swiperImages.length > 0 ? (
                    swiperImages.map((src, index) => (
                      <div className="swiper-slide" key={index}>
                        <div className="wrap-slider">
                          <img
                            className="lazyload"
                            src={src}
                            alt={`swiper-slide-${index}`}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center">No images uploaded</p>
                  )}
                </div>
              </div>
              <div className="wrap-pagination">
                <div className="container">
                  <div className="sw-dots line-white-pagination sw-pagination-slider justify-content-center"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 cot-phai">
            {otherImages.image1 && (
              <img
                src={otherImages.image1}
                alt="Other Image 1"
                className="img-fluid mb-3"
              />
            )}
            {otherImages.image2 && (
              <img
                src={otherImages.image2}
                alt="Other Image 2"
                className="img-fluid mb-3"
              />
            )}
          </div>
        </div>
      </div>
      <div className="Management-banner mt-5">
        <div className="container">
          <h5 className="text-center mb-4">Quản lý banner</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Upload images for Swiper</h5>
                  <form>
                    <label htmlFor="swiperImages" className="form-label">
                      Chọn hình ảnh (nhiều ảnh)
                    </label>
                    <input
                      type="file"
                      key="swiper-image-upload" // Thay đổi key
                      name="swiperImages"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={handleSwiperImageSelect}
                    />
                    <button
                      type="button"
                      className="btn btn-primary mt-3"
                      onClick={handleSwiperImageUpload}
                    >
                      Tải lên
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    Upload images for Other Section
                  </h5>
                  <form>
                    <label htmlFor="otherImages" className="form-label">
                      Chọn hình ảnh (nhiều ảnh)
                    </label>
                    <input
                      type="file"
                      name="otherImages"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={handleOtherImageSelect}
                    />
                    <button
                      type="button"
                      className="btn btn-primary mt-3"
                      onClick={handleOtherImageUpload}
                    >
                      Tải lên
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerManagement;
