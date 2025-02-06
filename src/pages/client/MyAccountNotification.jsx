import React from "react";

const MyAccountNotification = () => {
  return (
    <>
      <div className="col-lg-10">
        <div className="card-address">
          <div className="d-flex justify-content-between align-items-center">
            <div className>
              <span className="fw-6 fs-18">Email thông báo</span>
              <p>
                Thông báo và nhắc nhở quan trong về tài khoản sẽ không thể bị
                tắt
              </p>
            </div>
            <div className>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider" />
              </label>
            </div>
          </div>
          <div className="body-profile pt-4">
            <div className="row nof-list ps-5">
              {/* Left Column */}
              <div className="col-md-8">
                <span className="fw-5 fs-16">Cập nhật đơn hàng</span>
                <p>Cập nhật về tình trạng vận chuyển của tất cả đơn hàng</p>
              </div>
              {/* Right Column */}
              <div className="col-md-4 text-center body-profile-right">
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider" />
                </label>
              </div>
            </div>
            <div className="row nof-list pt-3 ps-5 pb-3 head-address">
              {/* Left Column */}
              <div className="col-md-8">
                <span className="fw-5 fs-16">Khuyến mãi</span>
                <p>Cập nhật về các ưu đãi và khuyến mãi sắp tới</p>
              </div>
              {/* Right Column */}
              <div className="col-md-4 text-center body-profile-right">
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider" />
                </label>
              </div>
            </div>
            <div className="row nof-list pt-3 ">
              {/* Left Column */}
              <div className="col-md-8">
                <span className="fw-6 fs-18">Khuyến mãi</span>
                <p>Cập nhật về các ưu đãi và khuyến mãi sắp tới</p>
              </div>
              {/* Right Column */}
              <div className="col-md-4 text-center body-profile-right">
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider" />
                </label>
              </div>
            </div>
            <div className="row nof-list pt-3 ps-5 ">
              {/* Left Column */}
              <div className="col-md-8">
                <span className="fw-5 fs-16">Khuyến mãi</span>
                <p>Cập nhật về các ưu đãi và khuyến mãi sắp tới</p>
              </div>
              {/* Right Column */}
              <div className="col-md-4 text-center body-profile-right">
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccountNotification;
