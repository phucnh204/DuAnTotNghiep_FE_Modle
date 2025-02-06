import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function demoApp() {
  const handleConfirm = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Bạn có chắc chắn muốn thực hiện hành động này?</p>
          <button
            onClick={() => {
              console.log("Người dùng chọn OK");
              closeToast(); // Đóng thông báo
            }}
          >
            OK
          </button>
          <button
            onClick={() => {
              console.log("Người dùng chọn Cancel");
              closeToast(); // Đóng thông báo
            }}
          >
            Cancel
          </button>
        </div>
      ),
      { autoClose: false } // Giữ thông báo cho đến khi người dùng tương tác
    );
  };

  return (
    <div>
      <button onClick={handleConfirm}>Hiển thị thông báo</button>
      qqqqqqqqqqqqqqqqqqqqqqqqq
    </div>
  );
}

export default demoApp;
