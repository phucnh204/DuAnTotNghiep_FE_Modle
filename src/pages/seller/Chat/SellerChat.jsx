import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
// Khởi tạo Socket.io client
const socket = io("http://localhost:8000/chat");

const SellerChat = ({ onClose }) => {
 // const shopId =[60];
  const [conversations, setConversations] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [shopId,setShopId]=useState(1);
  useEffect(()=>{
    let token=Cookies.get ("tokenModel");
    //alert(token)
    if(token!=null){
        // api.post("/user/checkuser?token="+token).then(v=>v.data).then(v=>{
        //   if(v.status===200){
        //     alert("shsxgsxgj")
        //     // localStorage.setItem("userInfo",JSON.stringify(v.data))
        //     setUserId(v.data.id)
        //   }else{
        //     // navigate("/login")
        //   }
        // })
    }else{
      // navigate("/login")
    }
  },[])
  useEffect(() => {
    socket.emit("getConversations", { shopId });

    socket.on("conversations", (conversations) => {
      setConversations(conversations);
    });

    socket.on("messageHistory", (messages) => {
      setMessages(messages);
    });

    socket.on("message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: data.senderId,
          messageText: data.messageText,
          timestamp: data.timestamp,
        },
      ]);
    });

    return () => {
      socket.off("conversations");
      socket.off("messageHistory");
      socket.off("message");
    };
  }, [shopId]);

  useEffect(() => {
    // Tự động cuộn xuống
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConversationClick = (roomId) => {
    if (currentRoomId === roomId) return;
    setCurrentRoomId(roomId);
    setMessages([]);
    socket.emit("joinRoom2", { roomId, shopId });
    socket.emit("getMessagesByRoom", { roomId });
  };

  const sendMessage = () => {
    if (newMessage.trim() && currentRoomId) {
      socket.emit("sendMessage", {
        roomId: currentRoomId,
        senderId: shopId,
        message: newMessage,
      });
      setNewMessage("");
      socket.emit("getConversations", { shopId: shopId });
    } else {
      alert("Vui lòng chọn cuộc trò chuyện và nhập tin nhắn.");
    }
  };

  // Render tin nhắn
  const renderMessages = () => {
    return messages.map((message, index) => {
      const isUser = message.senderId === shopId;
      const time = new Date(message.timestamp).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return (
        <div key={message._id || index} className="mb-2">
          <div
            className={`flex items-end ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            {!isUser && (
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpU_i9dtOVy6Cj8OkGpSZw8zsCmzU2QBmilQ&s"
                alt="Avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
            )}

            {/* Tin nhắn */}
            <div
              className={`relative max-w-xs px-4 py-2 rounded-lg shadow-lg ${
                isUser ? "bg-gray-100 " : "bg-blue-200 text-black text-center"
              } `}
            >
              {message.messageText && (
                <p className="font-medium text-center">{message.messageText}</p>
              )}

              {message.files &&
                message.files.map((file, fileIndex) => (
                  <div key={fileIndex} className="mt-2">
                    {file.url.endsWith(".jpg") ||
                    file.url.endsWith(".png") ||
                    file.url.endsWith(".jpeg") ||
                    file.url.endsWith(".gif") ? (
                      <img
                        src={file.url}
                        alt="Hình ảnh"
                        className="w-20 h-20 rounded-lg"
                      />
                    ) : file.url.endsWith(".mp4") ||
                      file.url.endsWith(".avi") ||
                      file.url.endsWith(".mkv") ? (
                      <video controls className="w-40 h-40 rounded-lg">
                        <source
                          src={file.url}
                          type={`video/${file.url.split(".").pop()}`}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 underline"
                      >
                        Tải file
                      </a>
                    )}
                  </div>
                ))}

              <span
                className={`${
                  isUser ? "bottom-1 right-2" : "bottom-1 left-2"
                } text-xs text-gray-500 font-light`}
              >
                {time}
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0 && currentRoomId) {
      const formData = new FormData();
      formData.append("roomId", currentRoomId);
      formData.append("senderId", shopId);

      // Thêm từng file vào formData
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      // Gửi HTTP POST request để upload file
      axios
        .post("http://localhost:8000/chat/send-file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          //socket.emit
          alert("File đã được gửi:", response.data);
        })
        .catch((error) => {
          console.error("Lỗi khi gửi file:", error);
        });
    } else {
      alert("Vui lòng chọn một phòng chat.");
    }
  };

  useEffect(() => {
    socket.on("newFile", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("newFile");
    };
  }, [shopId]);

  return (
    <div className="max-w-[1100px] h-[720px] m-auto mt-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 border-r border-gray-300 rounded-lg shadow-sm bg-white">
        <div className="p-4 border-b flex items-center justify-between text-center text-blue-700">
          <h2 className="text-xl font-semibold mr-2">Nhắn tin</h2>
          <img
            src="https://cics.com.vn/wp-content/uploads/2020/09/mes-1-300x300.png"
            alt=""
            srcset=""
            className="size-10 "
          />
        </div>

        <ul className="max-h-[450px] overflow-y-auto md:h-auto">
          {conversations.length === 0 ? (
            <li className="p-4 text-center text-gray-500">
              Chưa có cuộc trò chuyện nào.
            </li>
          ) : (
            conversations.map((conversation) => (
              <li
                key={conversation._id}
                onClick={() => handleConversationClick(conversation._id)}
                className={`p-2 cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all duration-300 ease-in-out rounded-md mb-2 flex items-center ${
                  currentRoomId === conversation._id ? "bg-gray-200" : ""
                }`}
              >
                <img
                  src={
                    "https://img.freepik.com/premium-vector/group-people-icon_946691-723.jpg"
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-full mr-4 object-cover border border-gray-300"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {conversation.accountId || "Không rõ"}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage || "Không có tin nhắn"}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="inline-block w-6 h-6 text-center text-xs text-white bg-red-500 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Khu vực tin nhắn */}
      <div className="w-full md:w-2/3 flex flex-col">
        <div className="p-4 border-b flex items-center bg-gray-150">
          {currentRoomId ? (
            <div className="flex items-center">
              {conversations
                .filter((conversation) => conversation._id === currentRoomId)
                .map((conversation) => (
                  <span
                    key={conversation._id}
                    className="font-semibold text-gray-700"
                  >
                    Khách hàng {conversation.accountId}
                  </span>
                ))}
            </div>
          ) : (
            <span className="text-gray-500">
              Chọn một cuộc trò chuyện để bắt đầu chat
            </span>
          )}
        </div>

        <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          {currentRoomId ? (
            messages.length > 0 ? (
              <>
                {renderMessages()}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mb-4 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2h-3.5l-3.71 3.71a1 1 0 01-1.58-.83V13H4a2 2 0 01-2-2V5z" />
                </svg>
                <p className="text-lg font-semibold">Chưa có tin nhắn nào</p>
                <p className="text-sm mt-1">
                  Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên.
                </p>
              </div>
            )
          ) : (
            // Thông báo khi chưa chọn cuộc trò chuyện
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2h-3.5l-3.71 3.71a1 1 0 01-1.58-.83V13H4a2 2 0 01-2-2V5z" />
              </svg>
              <p className="text-lg font-semibold">
                Chưa có cuộc trò chuyện nào được chọn
              </p>
              <p className="text-sm mt-1">
                Hãy chọn một cuộc trò chuyện từ danh sách bên trái.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-100 flex items-center gap-2">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="cursor-pointer px-4 py-2 flex items-center rounded-lg shadow-lg hover:bg-gray-300 hover:shadow-xl transition-all duration-300"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3342/3342137.png"
              alt="Ghim"
              className="w-6 h-6"
            />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập tin nhắn..."
            disabled={!currentRoomId}
          />

          <button
            onClick={sendMessage}
            className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-green-700"
            disabled={!currentRoomId || newMessage.trim() === ""}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerChat;
