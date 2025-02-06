import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import api from "../../../config/ApiNormal";
import toast from "react-hot-toast";

const socket = io("http://localhost:8000/chat");

const ClientChat = ({ onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [isShopNamesUpdated, setIsShopNamesUpdated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    let token = Cookies.get("tokenModel");
    //alert(token)
    if (token != null) {
      api
        .post("/user/checkuser?token=" + token)
        .then((v) => v.data)
        .then((v) => {
          if (v.status === 200) {
            setUserId(v.data.id);
            // alert(v.data.id);
          } else {
            // navigate("/login")
          }
        });
    }
  }, []);

  useEffect(() => {
    socket.emit("getConversations", { userId });

    socket.on("conversations", async (conversations) => {
      const updatedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          if (conversation.shopId) {
            const shopName = await fetchShopInfo(conversation.shopId);
            return { ...conversation, shopName };
          }
          return conversation;
        })
      );
      setConversations(updatedConversations);
    });

    // Lắng nghe lịch sử tin nhắn
    socket.on("messageHistory", (messages) => {
      setMessages(messages);
    });

    socket.on("file", (message) => {
      console.log("Nhận file:", message);
      const fileContainer = document.getElementById("fileContainer");
      const fileElement = document.createElement("div");
      fileElement.innerHTML = `
        <a href="${message.fileUrl}" target="_blank">${message.fileName}</a>
      `;
      fileContainer.appendChild(fileElement);
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
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConversationClick = (roomId) => {
    if (currentRoomId === roomId) return;
    setCurrentRoomId(roomId);
    setMessages([]);
    socket.emit("joinRoom", { roomId, userId,currentRoomId });
    socket.emit("getMessagesByRoom", { roomId });
    
  };

  // Xử lý gửi tin nhắn
  const sendMessage = () => {
    if (newMessage.trim() && currentRoomId) {
      socket.emit("sendMessage", {
        roomId: currentRoomId,
        senderId: userId,
        message: newMessage,
      });
      setNewMessage("");
      socket.emit("getConversations", { userId: userId });
    } else {
      alert("Vui lòng chọn cuộc trò chuyện và nhập tin nhắn.");
    }
  };

  // Render tin nhắn
  const renderMessages = () => {
    return messages.map((message, index) => {
      const isUser = message.senderId == userId;

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
            {/* Tin nhắn */}
            <div
              className={`relative max-w-xs px-4 py-2 rounded-lg shadow-lg ${
                isUser ? "bg-gray-100 " : "bg-blue-200 text-black text-center"
              } `}
            >
              {message.messageText && (
                <p className="font-medium text-right">{message.messageText}</p>
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
                      <video controls className="rounded-lg w-40 h-44">
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
      formData.append("senderId", userId);

      // Thêm từng file vào formData
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      // Gửi HTTP POST request để upload file
      toast.promise(
        axios
          .post("http://localhost:8000/chat/send-file", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            //alert("File đã được gửi:", response.data);
          }),
        {
          loading: "Đang tải ảnh",
          success: "Tải ảnh thành công",
          error: "Lỗi tải ảnh vì file bạn gửi quá 10MB",
        }
      );
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
  }, [userId]);

  const fetchShopInfo = async (shopId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/getshopinfo1?id=${shopId}`
      );
      if (response.data) {
        // alert(
        //   "DS shop: " + response.data.shopId + ":" + response.data.shopName
        // );
        return response.data.shopName;
      }
    } catch (error) {
      alert("Lỗi khi lấy thông tin shop:", error);
      return "Tên shop không xác định";
    }
  };
  useEffect(() => {
    if (conversations.length > 0 && !isShopNamesUpdated) {
      const updateConversationsWithShopNames = async () => {
        const updatedConversations = await Promise.all(
          conversations.map(async (conversation) => {
            if (conversation.shopId) {
              const shopName = await fetchShopInfo(conversation.shopId);
              // alert(
              //   "tên sho ở DS " +
              //     conversation.shopId +
              //     "các shop có tên: " +
              //     shopName
              // );
              return { ...conversation, shopName };
            }
            return conversation;
          })
        );
        setConversations(updatedConversations);
        setIsShopNamesUpdated(true);
      };

      updateConversationsWithShopNames();
    }
  }, [conversations, isShopNamesUpdated]);

  return (
    <div className="min-w-[700px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
      <button
        onClick={onClose}
        className="text-red-500 font-semibold absolute ml-auto -right-0 mr-4 mt-4"
        title="Đóng Chat"
      >
        Đóng
      </button>

      <div className="w-full md:w-1/3 border-r border-gray-300 rounded-lg shadow-sm bg-white">
        <div className="px-4 py-2  flex items-center justify-center text-blue-700">
          <h2 className="text-xl font-semibold mr-2">Nhắn tin</h2>
          <img
            src="https://cics.com.vn/wp-content/uploads/2020/09/mes-1-300x300.png"
            alt=""
            srcset=""
            className="size-10 "
          />
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm hội thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[220px] ml-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <ul className="max-h-[450px] mt-2 overflow-y-auto md:h-auto">
          {filteredConversations.length === 0 ? (
            <li className="p-4 text-center text-gray-500">
              Không tìm thấy hội thoại nào.
            </li>
          ) : (
            filteredConversations.map((conversation) => (
              <li
                key={conversation._id}
                onClick={() => handleConversationClick(conversation._id)}
                className={`p-2 cursor-pointer border-b border-solid border-gray-200 hover:bg-gray-100 hover:shadow-md transition-all duration-300 ease-in-out rounded-md mb-2 flex items-center ${
                  currentRoomId === conversation._id ? "bg-gray-200" : ""
                }`}
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpU_i9dtOVy6Cj8OkGpSZw8zsCmzU2QBmilQ&s"
                  alt="Shop Avatar"
                  className="w-10 h-10 rounded-full mr-4 object-cover border border-gray-300"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {conversation.shopName || "Không rõ"}
                  </p>
                  <p className="text-sm text-gray-800 truncate">
                    {conversation.lastMessage || ""}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Khu vực tin nhắn */}
      <div className="w-full md:w-2/3 flex flex-col">
        <div className="p-4 border-b flex items-center bg-gray-50">
          {currentRoomId ? (
            <div className="flex justify-between items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2649/2649359.png"
                alt=""
                className="size-6 mr-4"
              />
              {conversations
                .filter((conversation) => conversation._id === currentRoomId)
                .map((conversation) => (
                  <span
                    key={conversation._id}
                    className="font-semibold text-gray-700"
                  >
                    Cửa hàng {conversation.shopName}
                  </span>
                ))}
            </div>
          ) : (
            <span className="text-gray-700">
              Hãy bắt đầu với một cuộc trò chuyện nào!
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
              // Thông báo khi chưa có tin nhắn
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
            className="cursor-pointer flex items-center rounded-lg shadow-lg hover:bg-gray-300 hover:shadow-xl transition-all duration-300"
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
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tin nhắn..."
            disabled={!currentRoomId}
          />
          <button
            onClick={sendMessage}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!currentRoomId || newMessage.trim() === ""}
            title="Gửi tin nhắn"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientChat;
