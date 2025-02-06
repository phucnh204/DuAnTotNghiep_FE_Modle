// import { useState } from "react";
// // import iconOpenSidebar from "../../utils/images/iconOpenSidebar.png"; // Đường dẫn đến ảnh

// const Test = () => {
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <div style={{ width: "100%", display: "flex" }}>
//       {/* Div bên trái */}
//       <div
//         style={{
//             padding:"20px",
//           width: isOpen ? "20%" : "0%",
//           position:"relative",
//           transition: "width 0.5s ease",
//           borderRight:"2px solid lightgray"
//         }}
//       >
//         {/* <img src={iconOpenSidebar}/> */}
//         <p style={{ padding:"12px",
//             border:"1px solid gray"
//             ,borderRadius:"50%",backgroundColor:"blue",position:"absolute",top:'20px',right:"-7px",marginRight:"-5px",textAlign: "left", cursor: "pointer"}} onClick={() => setIsOpen(!isOpen)}>
            
//         </p>
//         <br />
//       </div>

//       {/* Div bên phải */}
//       <div
//         style={{
//           backgroundColor: "light",
//           height: "728px",
//           flexShrink: 0,
//           width: isOpen ? "80%" : "100%", // Chiều rộng của div bên phải
//           transition: "width 0.5s ease", // Hiệu ứng chuyển đổi chiều rộng
//         }}
//       ></div>
//     </div>
//   );
// };

// export default Test;
