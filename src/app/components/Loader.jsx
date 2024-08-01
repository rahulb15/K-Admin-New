import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

export default function Loader() {
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  };

  return (
    <div style={overlayStyle}>
      <ClipLoader color={"#000"} loading={true} size={50} />
    </div>
  );
}
