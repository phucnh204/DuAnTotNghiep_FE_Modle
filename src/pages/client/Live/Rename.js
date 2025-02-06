import React, { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import {
  BiAccessibility,
  BiCartAdd,
  BiHeartCircle,
  BiLike,
  BiSend,
  BiUser,
} from "react-icons/bi";
import { Badge } from "@mui/joy";
import api from "../../../config/APIUser";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import SwipeableTemporaryDrawer from "./ClientCart";
import ModalChooseProductLive from "./ModalChooseProduct";
import ProductInlive from "./ModalProducClient";
import ApiUser from "../../../config/ApiNormal";
import Cookies from "js-cookie";
import formatToVND from "../../../components/client/FormatVND";
import { useRef } from "react";
import birthday from "../../../utils/images/birthday.jpg";
import { BsJournalMinus } from "react-icons/bs";
import ListLive from "./LiveCard";
import EmojiTooltip from "./EmojiTooltip";
const socket = io("http://localhost:4000");
const WatchLive = () => {
  const { liveId } = useParams();
  const [datas, setDatas] = useState({
    device: null,
    recvTransport: null,
    liveId:liveId
  });
  
  const formatMilliseconds = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60)); // Tính giờ
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)); // Tính phút
    const seconds = Math.floor((ms % (1000 * 60)) / 1000); // Tính giây

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  


  const navigate =useNavigate()
  const [liveInfo, setLiveInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [countMember, setCountRoom] = useState(0);
  const [productPin, setProductPin] = useState(null);
  const [activeCart, setActiveCart] = useState({
    carts: [],
    member: 0,
  });


  const changeLive=(id)=>{
    api.get("/checkalive?id="+id).then(v=>v.data).then(v=>{
        if(v.status===200){
            if(data.consumer!=null){
              datas.liveId=id
              socket.emit("message", {type: 3 ,liveId:id});
            }
        }else{
          toast.error("Phiên live có thể không tồn tại hoặc đã kết thúc")
        }
    }).catch(error=>{
      alert(error)
    })
  }

  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);
  const sendMessage = (type) => {
    switch (type) {
      case 1:
        let message = document.getElementById("comments").value;
        socket.emit("message", { text: message, type: 1 });
        break;
      case 2:
        socket.emit("message", { user: {}, type: 2 });
        break;
      default:
        break;
    }
  };
  const [data, setData] = useState({
    consumer: null,
  });
  const [timeLine, setTimeLine] = useState({
    timeLine: -1,
    interval: null,
  });
  // const [flag, setFlag] = useState(0);
  const [product, setProduct] = useState(null);
  const intervalRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    socket.emit("hostconnect", {
      liveId: datas.liveId,
      token: Cookies.get("tokenModel") != null ? Cookies.get("tokenModel") : "",
      role: "member",
    });

    socket.on("message", (data) => {
      switch (data.type) {
        case "COMMENT":
          setComments((prevComments) => [data, ...prevComments]);
          break;
        case "NEWMEMBER":
          activeCart.member++;
          break;
        case "ADDTOCART":
          activeCart.carts.push(data.user);
          break;
        case "PIN":
          handleAnimate();

          if (data.data.data.conner.time !== -1) {
            setTimeout(() => {
              setProductPin(null);
            }, data.data.data.conner.time);
          }
          setProductPin(data.data.data);
          break;
        case "RELOAD":
          if (data.timeOut > 0) {
            setTimeLine((prevProduct) => ({
              ...prevProduct,
              timeLine: data.timeOut,
            }));
            setIsShow(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(() => {
              setTimeLine((prevProduct) => ({
                ...prevProduct,
                timeLine: prevProduct.timeLine - 1000,
              }));
            }, 1000);
          }
          getProduct();
          showVouher();
          break;
        case "HOSTDISCONNECT":
          toast.error("Host đang discinnect ");
          break;
        case "CLEARPIN":
          handleAnimate();
          setProductPin(null);
          break;
        case "ENDLIVE":
          socket.close()
          window.location.href = "http://localhost:3001/";
          break;
        case "HOSTRECONNECT":
          toast.success("Người bán vừa mới trở lại");
          if (data.consumer != null) {
            data.consumer.close();
            alert(data.recvTransport.closed);
          }
          resetVideo();
          setTimeout(() => {
            consume();
          }, 2000);
          break;
        case "ADDTOCART":
          activeCart.carts.push(data.user);
          break;
        case "ENDTIMEOUT":
          setIsShow(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setTimeLine((prevProduct) => ({
            ...prevProduct,
            interval: null,
          }));
          break;
        case "CHANGEROOMSUCCESS":
          createReceiveTransport()
          // consume()
          break;
        default:
          break;
      }
    });

    const resetVideo = () => {
      const container = document.getElementById("containervideo");
      const oldVideoElement = document.getElementById("remoteVideo");
      container.removeChild(oldVideoElement);
      container.innerHTML = `<video
                                id="remoteVideo"
                                className="w-full h-[90%] rounded-[5px]"                                
                                // src="https://www.youtube.com/embed/yrviw5RysnE"
                                title="SHOPEE 9.9 SIÊU NHẠC HỘI - SIÊU NHÓM BÍ ẨN | Đắm chìm cùng các tiết mục từ SOOBIN, Rhymastic,..."
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                autoplay
                                // playsinline
                            ></video>`;
    };
    const showVouher = () => {
      const announceDiv = document.getElementById("voucher");
      gsap.to(announceDiv, { left: "5px", duration: 0.2 });
      setTimeout(() => {
        gsap.to(announceDiv, { left: "-400px", duration: 0.3 });
      }, 1500);
    };

    socket.on("connectfail", (data) => {
      toast.error("Phiên live có vẻ không hợp lệ")
      navigate("/")
    });

    socket.once("connectsuccess", async (data) => {
      socket.emit("getRtpCapabilities");
      socket.on("sendRtpCapabilities", async (rtpCapabilities) => {
        await loadDevice(rtpCapabilities);
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [liveId]);

  const loadDevice = async (rtpCapabilities) => {
    try {
      datas.device = new mediasoupClient.Device();
      await datas.device.load({ routerRtpCapabilities: rtpCapabilities });
      createReceiveTransport();
    } catch (error) {}
  };

  const createReceiveTransport = async () => {
    socket.emit("createTransport");
    if(socket.createTransport===undefined){
      socket.createTransport=1
      socket.on(
        "transportCreated",
        async ({ id, iceParameters, iceCandidates, dtlsParameters }) => {
          datas.recvTransport = datas.device.createRecvTransport({
            id,
            iceParameters,
            iceCandidates,
            dtlsParameters,
          });
          datas.recvTransport.on(
            "connect",
            ({ dtlsParameters }, callback, errback) => {
              socket.emit("connectTransport", { dtlsParameters }, (error) => {
                if (error) {
                  errback(error);
                } else {
                  callback();
                }
              });
            }
          );
  
          datas.recvTransport.on("connectionstatechange", (state) => {
            if (state === "connected") {
              console.log("Receive Transport connected");
            } else if (state === "failed") {
              console.error("Receive Transport connection failed");
            }
          });
        }
      );
    }
  };

  const consume = async () => {
    socket.emit( "consume", { rtpCapabilities: datas.device.rtpCapabilities, liveId: datas.liveId },
      async ({ id, producerId, kind, rtpParameters }) => {
        if (id !== null) {
          data.consumer = await datas.recvTransport.consume({
            id,
            producerId,
            kind,
            rtpParameters,
          });
          const { track } = data.consumer;
          const mediaStream = new MediaStream();
          mediaStream.addTrack(track);
          if (kind === "video") {
            getProduct();
            ApiUser.get("/getinfolive?id=" + datas.liveId)
              .then((v) => v.data)
              .then((v) => {
                if (v.status === 200) {
                  setLiveInfo(v.data);
                } else {

                }
              });
            const videoElement = document.getElementById("remoteVideo");
            videoElement.srcObject = mediaStream;
            try {
              await videoElement.play();
            } catch (error) {
              alert("Có lỗi xảy ra ");
            }
            showMessage();
          }
        } else {
                toast.error("Phiên live có vẻ không hợp lệ")
      navigate("/")
        }
      }
    );
  };

  const getProduct = () => {
    api
      .get(`/productinlives?id=${datas.liveId}`)
      .then((v) => v.data)
      .then((v) => {
        setProducts(v.data);
      })
      .catch((error) => {});
  };

  const showDiv = () => {
    const announceDiv = document.getElementById("announce");
    gsap.to(announceDiv, { left: "5px", duration: 0.2 });
    setTimeout(() => {
      gsap.to(announceDiv, { left: "-400px", duration: 0.3 });
      activeCart.carts = [];
    }, 1500);
  };
  const showVouhers = () => {
    const announceDiv = document.getElementById("vouchers");
    gsap.to(announceDiv, { left: "5px", duration: 0.2 });
    setTimeout(() => {
      gsap.to(announceDiv, { left: "-400px", duration: 0.3 });
      activeCart.carts = [];
    }, 1500);
  };
  const showMessage = useCallback(() => {
    setInterval(() => {
      if (activeCart.member > 0) {
        showVouhers();
        activeCart.member = 0;
      }
      if (activeCart.carts.length > 0) {
        if (activeCart.carts.length > 1) {
          setMessage(
            activeCart.carts[0].tenTaiKhoan +
              " Và một số người khác đang mua hàng"
          );
        } else {
          setMessage(activeCart.carts[0].tenTaiKhoan + " đang mua hàng");
        }
        showDiv();
      }
    }, 4000);
  }, []);

  const handleAnimate = () => {
    const element = document.getElementById("product");
    if (element) {
      gsap.to(element, {
        scale: 0, // Thu nhỏ lại
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(element, {
            scale: 1, // To ra trở lại kích thước ban đầu
            duration: 1,
            ease: "elastic.out(1, 0.3)", // Hiệu ứng bật đàn hồi
          });
        },
      });
    }
  };

  return (
    <>
      <div className="bg-black w-full">
    
        <div class="flex flex-wrap w-full p-6 bg-black">
          <div class="w-full lg:w-9/12 p-1 bg-black-900 text-white lg:h-[590px] h-[450px]">
            <div className="flex position-relative items-center mb-1 bg-gray-900 text-white p-2 rounded-lg w-full space-x-4">
              <ProductInlive
                setProduct={setProduct}
                sendMessage={sendMessage}
                products={products}
              ></ProductInlive>
              <ModalChooseProductLive
                sendMessage={sendMessage}
                product={product}
              />
              {/* <Produc */}
              {productPin != null && (
                <div
                  id="product"
                  className={`absolute  overflow-hidden bg-white rounded-md ${
                    productPin.conner.age === 1 ? "left-0" : "right-0"
                  }`}
                  style={{
                    zIndex: "66",
                    width: "130px",
                    top: "130px",
                    // pointerEvents: 'none', // Không chiếm sự tương tác
                  }}
                >
                  <div className="flex justify-between">
                    <span
                      className="bg-gray-600 p-1 rounded-sm text-sm text-white"
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        zIndex: "1000",
                        pointerEvents: "none",
                      }}
                    >
                      {productPin.soLuongGioiHan}
                    </span>
                    <span
                      className="bg-red-100 p-1 rounded-sm text-sm text-red-600"
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        zIndex: "1000",
                        pointerEvents: "none",
                      }}
                    >
                      {productPin.giaGiam} %
                    </span>
                  </div>

                  <img
                    className="w-full"
                    src={`${productPin != null ? productPin.p.hinhAnh : ""}`}
                  />
                  <span
                    className="ml-1 text-red-500 mt-2 mb-2 text-xs font-bold"
                    style={{ fontSize: "10px" }}
                  >
                    {productPin != null
                      ? formatToVND(productPin.minPrice) +
                        "-" +
                        formatToVND(productPin.minPrice)
                      : ""}
                  </span>
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setProduct(productPin);
                      }}
                      className="pl-3 pr-3 cursor-pointer rounded-md pt-1 pb-2 mb-1 border-red-500 text-sm bg-red-600 text-white text-center"
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              )}

              <img
                src={liveInfo != null && liveInfo.shop.hinhAnh}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-semibold mr-4">
                    {liveInfo != null && liveInfo.shop.shopName} |{" "}
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                    <span className="material-icons">
                      <BiUser size={13} className="d-inline" />
                    </span>
                    <span>
                      {" "}
                      {countMember}{" "}
                      <BiHeartCircle 
                        onClick={()=>{
                          socket.emit("message",{type:4})
                        }}
                        color="red"
                        size={30}
                        className="d-inline-block ml-3"
                      />{" "}
                    </span>
                  </span>
                </div>
                <div className="text-xs text-gray-400 flex items-center space-x-1">
                  <span>{liveInfo != null && liveInfo.tieuDe} 🔥🔥🔥</span>
                </div>
              </div>
              <div
                id="announce"
                style={{
                  position: "absolute",
                  left: "-400px",
                  top: "300px",
                  zIndex: "999999",
                }}
              >
                <span class="inline-flex items-center bg-amber-50 text-amber-600 text-xs font-medium mr-2 pl-2 pr-2.5 rounded-full py-1">
                  <BiCartAdd color="red" size={20} />
                  {message}
                </span>
              </div>
              {isShow && (
                <div
                  style={{
                    zIndex: 99993399,
                    position: "absolute",
                    left: "10%",
                    top: "100px",
                    backgroundColor: "rgba(255, 0, 0, 0.5)",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <h1
                    className="p-1 pl-2 pr-2 rounded-lg text-red-100 text-sm font-bold"
                    style={{
                      backgroundColor: "transparent",
                      color: "#fee2e2",
                    }}
                  >
                    <BiAccessibility
                      className="mr-2"
                      style={{ display: "inline-block" }}
                    />{" "}
                    <span className="text-yellow-500">
                      còn {formatMilliseconds(timeLine.timeLine)}
                    </span>
                  </h1>
                </div>
              )}

              <div
                id="voucher"
                style={{
                  position: "absolute",
                  left: "-400px",
                  top: "200px",
                  zIndex: "999999",
                }}
              >
                <span class="inline-flex items-center bg-green-100 text-green-600 text-xs font-medium mr-2 pl-2 pr-2.5 rounded-full py-1">
                  <img style={{ width: "30px" }} src={birthday} />
                  <span class="w-1 h-1 mr-1 rounded-full bg-green-200 flex"></span>
                  Một số khuyến mãi vừa được áp dụng
                </span>
              </div>
              <div
                id="vouchers"
                style={{
                  position: "absolute",
                  left: "-400px",
                  top: "200px",
                  zIndex: "999999",
                }}
              >
                <span class="inline-flex items-center bg-red-50 text-red-600 text-xs font-medium mr-2 pl-2 pr-2.5 rounded-full py-1">
                  {/* <span class="w-1 h-1 mr-1 rounded-full bg-amber-400 flex"></span> */}
                  <BsJournalMinus color="red" size={20} /> {activeCart.member}{" "}
                  người vừa mới tham gia
                </span>
              </div>
              <CountLike socket={socket}/>
              <div className="flex items-center space-x-2">
                <Badge
                  badgeContent={products != null && products.length}
                  color="warning"
                  sx={{
                    "& .MuiBadge-dot": {
                      backgroundColor: "white", 
                    },
                    "& .MuiBadge-dot span": {
                      color: "red",
                    },
                  }}
                >
                  <SwipeableTemporaryDrawer
                    setProduct={setProduct}
                    products={products}
                  />
                </Badge>
              </div>
            </div>
            <div id="containervideo">
              <video
                id="remoteVideo"
                className="w-full h-full overflow-hidden"
                title="SHOPEE 9.9 SIÊU NHẠC HỘI - SIÊU NHÓM BÍ ẨN | Đắm chìm cùng các tiết mục từ SOOBIN, Rhymastic,..."
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                playsinline
              ></video>
            </div>
          </div>

          <div class="w-full lg:w-3/12 p-2 relative mt-1 lg:bg-gray-900 sm:bg-black-800 text-white lg:h-[590px] h-[200px]">
            <div
              className="relative h-full absolute left-0 bottom-0 sm:h-2/2  flex flex-col-reverse overflow-y-auto pb-4"
              style={{
                overflow: "hidden",
                scrollbarWidth: "thin",
                scrollbarColor: "gray ", 
                scrollBehavior: "smooth",
                boxSizing: "border-box",
              }}
            >
              <AnimatePresence className="canvas-body" initial={false}>
                {comments.map((v, index) => {
                  return (
                    <motion.div
                      key={v.index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Comment data={v} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="relative w-full max-w-sm min-w-[200px]">
              <input
                id="comments"
                type="text"
                className="w-full rounded-full pl-3  pt-2 pb-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Bạn đang nghĩ gì..."
              />
              <EmojiTooltip/>
              <BiSend
                onClick={() => sendMessage(1)}
                className="absolute right-3 top-2.5 text-slate-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <br />
        <br />
       
        <button
          className="bg-white"
          onClick={() => {
            consume();
          }}
        >
          Tham gia
        </button>
        <br />
        <h2
          className="text-2xl bg-black font-semibold text-white px-6 p-12 pt-14 m-0"
          style={{ borderTop: "1px dashed white" }}
        >
          Video LIVE được đề xuất
        </h2>
        <ListLive changeLive={changeLive} liveId={datas.liveId}/>
      </div>
    </>
  );
};

export default WatchLive;

const Comment = ({ data }) => (
  <div className="flex mt-4 items-center space-x-3 p-1 text-white rounded-lg max-w-sm align-items-start">
    <img className="w-9 h-9 rounded-full" src={data.avatar} />
    <div>
      <p className="text-sm  text-yellow-100">{data.from}</p>
      <p className="text-xs  text-white">{data.text}</p>
    </div>
  </div>
);

const CountLike=React.memo(({socket})=>{
  const [countLike,setCountLike]=useState("1k")
  useEffect(()=>{
    socket.on("message", (data) => {
      switch (data.type) {
        case "COUNTLIKE":
          setCountLike(data.data)
          break;
        default:
          break;
      }
    });
    

  },[])
  return <div className="flex items-center space-x-4 text-gray-400 text-sm">
    <div className="flex items-center space-x-1">
      <span className="material-icons">
        {" "}
        <BiLike />{" "}
      </span>
      <span>{countLike}</span>
    </div>
</div>
})


