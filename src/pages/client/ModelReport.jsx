import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import { useState } from "react";
import { Textarea } from "@mui/joy";
import { BiAddToQueue } from "react-icons/bi";
import { BsCloudUploadFill } from "react-icons/bs";
import api from "../../config/APIUser";
import toast from "react-hot-toast";

export default function ModalReport({ order }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    order: {
      id: order.id,
    },
    noiDung: "",
    hinhAnh: "",
  });
  const submit = () => {
    toast.promise(
      api
        .post("/addreport", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((v) => v.data)
        .then((v) => {
          if (v.status !== 200) {
            throw new Error(v.message);
          }
        }),
      {
        loading: "Đang thêm report",
        success: "Đã gửi report đến quản trị, vui lòng đợi thông báo sau",
        error: (error) => error.message,
      }
    );
  };
  const [flags, setFlags] = useState(0);

  const handleFileChangePopu = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("files", file);

    toast.promise(
      fetch("http://localhost:8080/upload-single-files", {
        method: "POST",
        body: formData,
      })
        .then((v) => v.json())
        .then((v) => {
          setData((prevData) => ({
            ...prevData,
            hinhAnh: v.data,
          }));
        }),
      {
        loading: "Đang tải ảnh",
        success: "Đã tải ảnh",
        error: (error) => error.message,
      }
    );
  };
  return (
    <>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<BiAddToQueue />}
        onClick={() => setOpen(true)}
      >
        Báo cáo vi phạm
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          sx={{
            width: "600px", // Chiều rộng cố định
          }}
        >
          <DialogTitle>Báo cáo đơn hàng</DialogTitle>
          <hr />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            {/* <Stack spacing={2}>
              <p className="font-medium">Thông tin đơn hàng</p>
              <div class="flex flex-wrap items-center">
                <div class="w-full md:w-1/2">
                  <p class="text-sm font-medium mt-2 truncate">
                    Id đơn: {order.id}
                  </p>
                  <p class="text-sm font-medium  mt-2 truncate">
                    Trạng thái đơn: {order.trangThai.tenTrangThai}
                  </p>
                </div>
                <div class="w-full md:w-1/2 p-2">
                  <p class="text-sm font-medium mt-2 truncate">
                    Shop: {order.shop.shopName}
                  </p>
                  <p class="text-sm font-medium  mt-2 truncate">
                    Thông tin liên hệ: {order.shop.email}
                  </p>
                </div>
              </div>

              <p className="font-medium">Mô tả tình trạng đơn hàng</p>
              <input
                onChange={(e) => handleFileChangePopu(e)}
                type="file"
                id="im"
                multiple
                style={{ display: "none" }}
              ></input>
              <Textarea
                rows={4}
                onChange={(e) =>
                  setData((prevData) => ({
                    ...prevData,
                    noiDung: e.target.value,
                  }))
                }
                required
              />
              <div className="flex align-items-center">
                <span
                  className="text-xs mt-2 p-2 border mr-2 rounded-sm"
                  onClick={() => {
                    document.getElementById("im").click();
                  }}
                >
                  Thên ảnh <BsCloudUploadFill style={{ display: "inline" }} />
                </span>
              </div>
              <div className="">
                <img style={{ width: "150px" }} src={data.hinhAnh} />
              </div>
              <Button
                type="button"
                onClick={() => {
                  submit();
                }}
              >
                Submit
              </Button>
            </Stack> */}
            <Stack spacing={2}>
              <div className="my-4 lg:w-[500px] mx-auto p-6   border border-gray-200">
                <h2 className="text-xl font-bold text-center border-b border-solid border-gray-200">
                  Thông tin đơn hàng
                </h2>

                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Mã đơn hàng:</span>
                    <span className="text-gray-700 font-semibold">
                      {order.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Trạng thái đơn hàng:</span>
                    <span className="text-gray-700 font-semibold">
                      {order.trangThai.tenTrangThai}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Cửa hàng:</span>
                    <span className="text-gray-700 font-semibold">
                      {order.shop.shopName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Thông tin liên hệ:</span>
                    <span className="text-gray-700 font-semibold">
                      {order.shop.email}
                    </span>
                  </div>
                </div>
                <hr />
                <div className="border-t border-gray-200 mt-2">
                  <Textarea
                    rows={6}
                    onChange={(e) =>
                      setData((prevData) => ({
                        ...prevData,
                        noiDung: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-2 py-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Nhập mô tả tình trạng sản phẩm..."
                  />
                </div>

                <div className="mt-4">
                  <span
                    className="inline-flex items-center text-sm text-blue-500 cursor-pointer hover:underline"
                    onClick={() => document.getElementById("im").click()}
                  >
                    Thêm ảnh <BsCloudUploadFill className="ml-1" />
                  </span>
                  <input
                    onChange={(e) => handleFileChangePopu(e)}
                    type="file"
                    id="im"
                    multiple
                    style={{ display: "none" }}
                  />
                  <div className="mt-2">
                    {data.hinhAnh && (
                      <img
                        src={data.hinhAnh}
                        alt="Uploaded preview"
                        className="rounded border border-gray-300 w-32 h-32 object-cover mb-2"
                      />
                    )}
                  </div>
                </div>
                <hr />
                <div className="mt-3 text-end">
                  <Button
                    type="button"
                    onClick={() => submit()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}
