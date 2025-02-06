import React, { lazy, Suspense, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/APIUser";
const ModalDiaChi = lazy(() => import("./ChooseDiaChi"));
const RegisterShop = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [s, setS] = useState({
    hinhAnh:
      "data:image/jpeg;base64,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",
  });
  const [address, setAddress] = useState({
    provinceId: -1,
    wardCode: "",
    districtId: -1,
    ghiChu: "Nguyễn Vấ",
    toanBoDiaChi: "",
    chiTietDiaChi: "",
  });
  function isValidEmail() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(s.email);
  }
  const [token, setToken] = useState({});

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChang = (e, fill) => {
    setS((prevState) => ({
      ...prevState,
      ["" + fill]: e.target.value,
    }));
  };

  const submit = () => {
    toast.promise(
      api
        .post(
          "/createshop",
          {
            shop: s,
            diaChi: address,
            token: token.token,
            validToken: token.validToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((v) => v.data)
        .then((v) => {
          if (v.status !== 200) {
            throw new Error(v.message);
          } else {
            window.location.href = "http://localhost:3001/seller/dashboard";
          }
        }),
      {
        loading: "Creating product.....",
        success: "Create product successfully.",
        error: (error) => error.message,
      }
    );
  };

  const [isLoading, setLoading] = useState(false);

  const handleFileChangeImage = async (e, fill) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("files", selectedFile);
    setLoading(true);
    fetch("http://localhost:8080/upload-single-files", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setS((prevState) => ({
            ...prevState,
            ["" + fill]: data.data,
          }));
        } else {
          toast.error("Tải ảnh thất bại vui lòng thử lại sao");
        }
      })
      .catch((error) => {
        toast.error("Tải ảnh thất bại vui lòng thử lại sao");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validMail = () => {
    toast.promise(
      api
        .post("/validmail?email=" + s.email)
        .then((v) => v.data)
        .then((v) => {
          if (v.status !== 200) {
            throw new Error(v.message);
          } else {
            token.token = v.data;
          }
        }),
      {
        loading: "Sending mail.....",
        success: "Đã gửi mã xác nhận, hiệu lực mã 5 phút",
        error: (error) => error.message,
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`absolute right-1 top-[11%] z-[13] ${
          isLoading ? "visible" : "hidden"
        }`}
      >
        {/* <DescriptionAlerts /> */}
      </div>
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl px-4 ">
        <div className="border px-8 md:p-6 lg:p-10 shadow">
          <h2 className="text-xl md:text-2xl font-bold text-center text-blue-700 mb-4">
            Đăng ký trở thành nhà bán hàng
          </h2>
          {/* Thanh bước tiến trình */}
          <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 pb-6 border-b border-solid border-gray-400">
            {[
              "Thông tin cửa hàng",
              "Thông tin mã thuế",
              "Thông tin định danh",
              "Hoàn tất",
            ].map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center md:space-x-2"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 border-2 rounded-sm ${
                      currentStep === index + 1
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 bg-white text-gray-500"
                    } flex items-center justify-center`}
                  >
                    {index + 1}
                  </div>
                  <div
                    className={`${
                      currentStep === index + 1
                        ? "text-blue-500 font-semibold"
                        : "text-gray-500"
                    } mt-2 text-sm md:text-base`}
                  >
                    {step}
                  </div>
                </div>
                {index !== 3 && (
                  <div
                    className={`hidden md:block w-24 h-1 ${
                      currentStep > index + 1 ? "bg-blue-500" : "bg-gray-300"
                    } mx-3`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Form 1 */}
          {currentStep === 1 && (
            <form className="space-y-4 py-6 px-2 md:px-6 lg:px-10 border-b max-h-[400px]">
              <div className="flex items-center justify-between">
                <label className="block text-gray-700 font-semibold w-1/4">
                  Tên cửa hàng
                </label>
                <input
                  value={s.shopName}
                  onChange={(e) => handleChang(e, "shopName")}
                  type="text"
                  className={`${
                    s.tenShop !== undefined && s.tenShop.length < 5
                      ? "border border-red-500"
                      : "border-yellow-500"
                  } w-3/4 px-4 py-2 border  focus:outline-none focus:border-blue-500`}
                  placeholder="Nhập tên cửa hàng"
                />
              </div>

              <div className="flex items-center justify-between mt-6">
                <label className="block text-gray-700 font-semibold text-sm w-1/4">
                  Địa chỉ
                </label>
                <div className="w-3/4 flex justify-between ml-8 items-center space-x-4 cursor-pointer">
                  <span className="text-sm text-gray-600">
                    {address.toanBoDiaChi}
                  </span>
                  <Suspense fallback={<div>Loading...</div>}>
                    <ModalDiaChi address={address} setAddress={setAddress} />
                  </Suspense>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="block text-gray-700 font-semibold w-1/4">
                  Tên công ty (nếu có)
                </label>
                <input
                  value={s.tenCongTy}
                  onChange={(e) => {
                    handleChang(e, "tenCongTy");
                  }}
                  type="text"
                  className="w-3/4 px-4 py-2 border border-gray-300  focus:outline-none focus:border-blue-500"
                  placeholder="Nhập tên công ty"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="block text-gray-700 font-semibold w-1/4">
                  Email
                </label>
                <div className="w-3/4">
                  <input
                    value={s.email}
                    onChange={(e) => {
                      handleChang(e, "email");
                    }}
                    type="email"
                    className="w-3/4 px-4 py-2 border border-gray-300  focus:outline-none focus:border-blue-500"
                    placeholder="Nhập email"
                  />
                  <button
                    disabled={!isValidEmail()}
                    onClick={() => validMail()}
                    type="button"
                    className="w-2/4 text-blue-500 fomt-semibold border border-blue-600 p-2"
                  >
                    {!isValidEmail()
                      ? "Email chưa có hoặc chưa chính xác"
                      : "Gửi mã"}{" "}
                  </button>
                  <input
                    disabled={!isValidEmail()}
                    onChange={(e) => (token.validToken = e.target.value)}
                    placeholder="Nhập mã xác thực email"
                    className="w-2/4 mt-3 focus:border-gray-200 p-2 text-blue-500 fomt-semibold rounded-sm"
                  ></input>
                </div>
              </div>

              <div className="flex items-center justify-between ">
                <label className="block text-gray-700 font-semibold w-1/4">
                  Mô tả cửa hàng
                </label>
                <textarea
                  value={s.moTa}
                  onChange={(e) => {
                    handleChang(e, "moTa");
                  }}
                  rows={2}
                  className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Mô tả cửa hàng"
                />
              </div>
              <div className="flex items-center">
                <label className="block text-gray-700 font-semibold w-1/4">
                  Ảnh đại diện
                </label>
                <img
                  onClick={() => {
                    document.getElementById("hinhanh").click();
                  }}
                  src={s.hinhAnh}
                  width={"150px"}
                  className="rounded"
                />
                <input
                  onChange={(e) => handleFileChangeImage(e, "hinhAnh")}
                  id="hinhanh"
                  type="file"
                  hidden
                />
              </div>
            </form>
          )}

          {/* Form 2 */}
          {currentStep === 2 && (
            <form className="space-y-20 py-6 px-2 md:px-6 lg:px-10 border-b min-h-[400px]">
              <div className="flex items-center justify-between mt-10">
                <label className="block text-gray-700 font-semibold w-1/4">
                  Loại hình kinh doanh
                </label>
                <div className="w-3/4 flex space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      checked
                      onClick={(e) => {
                        handleChang(e, "loaiHinhKinhDoanh");
                      }}
                      type="radio"
                      name="businessType"
                      value="1"
                      className="text-blue-600"
                    />
                    <span>Cá nhân</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="businessType"
                      onClick={(e) => {
                        handleChang(e, "loaiHinhKinhDoanh");
                      }}
                      value="2"
                      className="text-blue-600"
                    />
                    <span>Hộ kinh doanh</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="businessType"
                      onClick={(e) => {
                        handleChang(e, "loaiHinhKinhDoanh");
                      }}
                      value="3"
                      className="text-blue-600"
                    />
                    <span>Công ty</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <label className="block text-gray-700 font-semibold w-1/4">
                    Mã số thuế
                  </label>
                  <input
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        handleChang(e, "maSoThue");
                      }
                    }}
                    value={s.maSoThue}
                    type="text"
                    className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Nhập mã số thuế"
                  />
                </div>
                <p className="text-sm text-gray-300 mt-1 ml-1/4">
                  Người bán phải cung cấp thông tin Mã số thuế cho sàn thương
                  mại điện tử.
                </p>
              </div>
            </form>
          )}

          {/* Form 3 */}
          {currentStep === 3 && (
            <form className="space-y-20 py-6 px-2 min-h-[400px] md:px-6 lg:px-10 border-b">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <label className="block text-gray-700 font-semibold w-1/4">
                    Họ và tên
                  </label>
                  <input
                    onChange={(e) => handleChang(e, "hoVaTen")}
                    type="text"
                    value={s.hoVaTen}
                    className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-1/4">
                  Theo CMND/CCCD/Hộ Chiếu
                </p>
              </div>

              <div className="flex space-x-6 mt-3">
                <div className="flex flex-col items-center w-1/3">
                  <label
                    htmlFor="cccd"
                    className="text-gray-700 font-semibold mb-2 text-center"
                  >
                    Hình chụp của thẻ CCCD
                  </label>
                  <div className="relative w-24 h-24 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                    {/* <span className="text-gray-400 text-2xl">+</span> */}
                    <img src={s.hinhChupThe} style={{ width: "100%" }} />
                    <input
                      onChange={(e) => handleFileChangeImage(e, "hinhChupThe")}
                      type="file"
                      id="cccd"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center w-1/3">
                  <label
                    htmlFor="mas"
                    className="text-gray-700 font-semibold mb-2 text-center"
                  >
                    Ảnh cầm CCCD
                  </label>
                  <div className="relative w-24 h-24 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                    <img src={s.anhDangCam} style={{ width: "100%" }} />
                    <input
                      onChange={(e) => handleFileChangeImage(e, "anhDangCam")}
                      type="file"
                      id="mas"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center w-1/3">
                  <label
                    htmlFor="gpkd"
                    className="text-gray-700 font-semibold mb-2 text-center"
                  >
                    Giấy phép kinh doanh
                  </label>
                  <div className="relative w-24 h-24 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                    <img src={s.giayPhepKinhDoanh} style={{ width: "100%" }} />
                    <input
                      onChange={(e) =>
                        handleFileChangeImage(e, "giayPhepKinhDoanh")
                      }
                      id="gpkd"
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Form 4 */}
          {currentStep === 4 && (
            <div className="flex items-center justify-center my-5 bg-gray-100">
              <form className="bg-white border border-gray-300 rounded-lg shadow-lg p-8 text-center max-w-md">
                <div className="text-green-500 text-6xl mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m7 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Yêu cầu đăng ký bán hàng đã thành công!
                </h2>
                <p className="text-gray-600 mb-6">
                  Chúng tôi rất vui được hỗ trợ bạn. Đội ngũ của chúng tôi sẽ
                  xem xét yêu cầu của bạn và sẽ liên hệ với bạn trong thời gian
                  sớm nhất. Vui lòng kiểm tra email của bạn để biết thêm thông
                  tin chi tiết.
                </p>
              </form>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between mt-6 items-center space-y-4 md:space-y-0 ">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="bg-gray-300 text-gray-700 font-medium text-sm py-3 px-6 rounded-md shadow hover:bg-gray-400 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Trở về
              </button>
            )}

            {currentStep < 3 && (
              <button
                onClick={nextStep}
                className={`${
                  currentStep > 1 ? "ml-0 md:ml-auto" : "ml-auto"
                } bg-blue-600 text-white font-semibold text-sm py-3 px-6 rounded-lg shadow-md hover:bg-blue-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300`}
              >
                {currentStep === 4 ? "Hoàn tất" : "Tiếp theo"}
              </button>
            )}

            {currentStep === 3 && (
              <button
                onClick={submit}
                className={`${
                  currentStep > 1 ? "ml-0 md:ml-auto" : "ml-auto"
                } bg-blue-600 text-white font-semibold text-sm py-3 px-6 rounded-lg shadow-md hover:bg-blue-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300`}
              >
                Hoàn tất đăng ký
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterShop;
