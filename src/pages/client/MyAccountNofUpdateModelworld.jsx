import React, { useState } from "react";
import modelworldUpdatesData from "../../data/json/modelworldUpdates.json"; // Import JSON data

const MyAccountNofUpdateModelworld = () => {
  const [updates] = useState(modelworldUpdatesData.updates); // Load JSON data into state

  return (
    <>
      <div className="col-lg-10">
        <div className="card-nof">
          <div className="head-profile">
            <span className="fw-5 fs-18 d-flex justify-content-end">
              <a href="#">Đánh dấu đã đọc tất cả</a>
            </span>
          </div>
          <div className="body-profile mt-4">
            {updates.map((update) => (
              <div
                key={update.id}
                className={`row card-nof-oder ${
                  update.read ? "bg-white" : "bg-light-blue"
                } p-3`}
                style={{
                  backgroundColor: update.read ? "#ffffff" : "#e0f4ff",
                }} // Set background color based on read status
              >
                <div className="col-md-2">
                  <img
                    src={update.image}
                    alt="Product Image"
                    className="img-fluid"
                  />
                </div>
                <div className="col-md-7">
                  <p className="fw-6 fs-16">{update.title}</p>
                  <p>{update.content}</p>
                  <p>{update.time}</p>
                </div>
                <div className="col-md-3 text-center">
                  <a href="#" className="btn btn-light btn-outline-secondary">
                    Xem Chi Tiết
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccountNofUpdateModelworld;
