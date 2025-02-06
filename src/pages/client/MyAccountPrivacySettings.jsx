import React from "react";

const MyAccountPrivacySettings = () => {
  return (
    <>
      <div className="col-lg-10">
        <div className="card-profile">
          <div className="head-profile">
            <span className="fw-6 fs-18">Privacy Settings</span>
          </div>
          <div className="body-profile mt-4">
            <div className="row">
              {/* Left Column */}
              <div className="col-md-8 ">
                <p className="fw-5 fs-16">Yêu cầu xóa tài khoản</p>
              </div>
              {/* Right Column */}
              <div className="col-md-4 text-center">
                <a href className="btn-delete-account">
                  Xóa bỏ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccountPrivacySettings;
