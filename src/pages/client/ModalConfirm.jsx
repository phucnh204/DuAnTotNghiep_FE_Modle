import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import { useState } from "react";
import { Textarea } from "@mui/joy";
import { BiAddToQueue } from "react-icons/bi";
import { Rating } from "@mui/material";
import { BsCloudUploadFill, BsTrash } from "react-icons/bs";
import api from "../../config/APIUser";
import toast from "react-hot-toast";

export default function RatingModal({ orderDetail, setFlag }) {
  const [open, setOpen] = useState(false);
  const [flags, setFlags] = useState(1);
  const [rating, setRating] = useState({
    soSao: 5,
    orderDetail: orderDetail,
    images: [],
    noiDungDanhGia: "",
  });

  const submit = () => {
    rating.chiTietDanhGias = rating.images;
    toast.promise(
      api
        .post("/adddanhgia", rating, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((v) => v.data)
        .then((v) => {
          if (v.status === 200) {
            setFlags(0);
          } else {
            throw new Error(v.message);
          }
        }),
      {
        loading: "Đang thêm đánh giá",
        success: "Đã thêm đánh giá của bạn, chúc bạn mua sắm vui vẻ",
        error: (error) => error.message,
      }
    );
  };

  function handleFileChangese(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('files', file);
    // setLoading(true);
    fetch('http://localhost:8080/upload-single-files-video', {
        method: 'POST',
        body: formData,
    })
        .then((v) => v.json())
        .then((v) => {
          rating.images.push({
            link:v.data,
            type:"VIDEO"
          })
          setFlags(flags+1)
        })
        .catch((error) => {
            alert('Có lỗi xảy ra ');
        })
        // .finally(() => {
        //     setLoading(false);
        // });
}

  function handleFileChanges(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("files", file);
    toast.promise(
      fetch("http://localhost:8080/upload-single-files-video", {
        method: "POST",
        body: formData,
      })
        .then((v) => v.json())
        .then((v) => {
          rating.images.push({
            link:v.data,
            type:"VIDEO"
          })
          setFlags(flags+1)
        }),
      {
        loading: "Đang tải ảnh",
        success: "Tải ảnh thành công",
        error: (error) => error.messge,
      }
    );
  }

  const handleFileChange = (e) => {
    let selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      selectedFiles = selectedFiles.slice(0, 5);
    } else {
    }
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    toast.promise(
      fetch("http://localhost:8080/upload-multiple-files", {
        method: "POST",
        body: formData,
      })
        .then((v) => v.json())
        .then((v) => {
          v.data.forEach((v) => {
            rating.images.push({
              link: v.hinhAnh,
              type: "IMAGE",
            });
          });
          setFlags(flags + 1);
        })
        .catch((error) => {
          alert("Có lỗi xảy ra ");
        }),
      {
        loading: "Đang tải ảnh",
        success: "Tải thành công",
        error: (error) => error.message,
      }
    );
  };
  return (
    <>
      {flags !== 0 ? (
        <>
          <Button
            variant="outlined"
            color="neutral"
            className="mt-2 mb-2"
            startDecorator={<BiAddToQueue />}
            onClick={() => setOpen(true)}
          >
            Đánh giá sản phẩm
          </Button>
          <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog>
              <DialogTitle>Đánh giá sản phẩm</DialogTitle>
              <DialogContent>
                Hãy nêu cảm nhận của bạn về chất lượng nhé
              </DialogContent>
              <form
              // onSubmit={(event) => {
              //   event.preventDefault();
              //   setOpen(false);
              // }}
              >
                <Stack spacing={2}>
                  {/* <FormControl> */}
                  <p>Sản phẩm</p>
                  <div class="flex flex-wrap items-center">
                    <div class="w-full md:w-2/12">
                      <img
                        src={orderDetail.product.hinhAnh}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div class="w-full md:w-10/12 p-2">
                      <h1 class="text-xs font-bold truncate">
                        {rating.orderDetail != null
                          ? rating.orderDetail.product.product.tenSanPham
                          : ""}
                      </h1>
                      <p class="text-xs">
                        {rating.orderDetail != null
                          ? rating.orderDetail.soLuong +
                            " x " +
                            rating.orderDetail.giBan
                          : ""}
                      </p>
                    </div>
                  </div>
                  <p>Số sao đánh giá</p>
                  <Rating
                    name="simple-controlled"
                    value={rating.soSao}
                    onChange={(event, newValue) => {
                      setRating((prevRating) => ({
                        ...prevRating,
                        soSao: newValue,
                      }));
                    }}
                  />
                  <p>Cảm nhận của bạn</p>
                  <input
                    onChange={handleFileChange}
                    type="file"
                    id="im"
                    multiple
                    style={{ display: "none" }}
                  ></input>
                  <input
                    onChange={(e)=>handleFileChangese(e)}
                    type="file"
                    id="vi"
                    multiple
                    style={{ display: "none" }}
                  ></input>
                  <Textarea
                    minRows={2}
                    onChange={(e) => (rating.noiDungDanhGia = e.target.value)}
                  />
                  <p>Hình ảnh của bạn</p>
                  <div className="flex align-items-center">
                    <span
                      className="text-xs p-3 border mr-2 rounded-sm"
                      onClick={() => {
                        document.getElementById("im").click();
                      }}
                    >
                      Thên ảnh{" "}
                      <BsCloudUploadFill style={{ display: "inline" }} />
                    </span>
                    <span
                      onClick={() => {
                        document.getElementById("vi").click();
                      }}
                      className="text-xs p-3 border rounded-sm"
                    >
                      Video <BsCloudUploadFill style={{ display: "inline" }} />
                    </span>
                  </div>
                  <div className="container mx-auto p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rating.images.map((image, index) => (
                        <div key={index} className="relative">
                          <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                            <BsTrash
                              onClick={() => {
                                rating.images.splice(index, 1);
                                setFlags(flags + 1);
                              }}
                            />
                          </button>
                          {image.type==="IMAGE"?<img
                            src={image.link}
                            alt={`image-${index}`}
                            style={{ width: "50px" }}
                            className="w-full h-auto rounded-md"
                          />:<video style={{ width: '50px', height: '50px' }} controls>
                          <source src={image.link} type="video/mp4" />
                          Your browser does not support the video tag.
                      </video>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      submit();
                    }}
                  >
                    Submit
                  </Button>
                </Stack>
              </form>
            </ModalDialog>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
