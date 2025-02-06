import React from "react";

const CustomTooltip = () => {
  const styles = {
    container: {
      position: "relative",
      display: "inline-block",
    },
    button: {
      padding: "12px 25px",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      boxShadow: "0 8px 15px rgba(0, 123, 255, 0.4)",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    tooltipContent: {
      position: "absolute",
      bottom: "140%",
      left: "50%",
      transform: "translateX(-50%)",
      visibility: "hidden",
      opacity: 0,
      width: "240px",
      background: "linear-gradient(135deg, #007bff 0%, #00c6ff 100%)",
      color: "#fff",
      textAlign: "center",
      padding: "15px",
      fontSize: "14px",
      borderRadius: "15px",
      transition: "all 0.4s ease",
      zIndex: 1,
      boxShadow: "0px 10px 20px rgba(0, 123, 255, 0.3)",
      clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
    },
    tooltipVisible: {
      visibility: "visible",
      opacity: 1,
      transform: "translateX(-50%) translateY(-10px)",
    },
    arrow: {
      position: "absolute",
      top: "100%",
      left: "50%",
      marginLeft: "-10px",
      width: 0,
      height: 0,
      borderLeft: "10px solid transparent",
      borderRight: "10px solid transparent",
      borderTop: "10px solid #007bff",
    },
    text: {
      fontSize: "14px",
      lineHeight: 1.5,
      letterSpacing: "0.5px",
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.button}>Hover me</button>
      <div style={styles.tooltipContent}>
        <span style={styles.arrow}></span>
        <p style={styles.text}>
          Warning: Hovering too long may result in a sudden craving for cookies!
        </p>
      </div>
    </div>
  );
};

export default CustomTooltip;
