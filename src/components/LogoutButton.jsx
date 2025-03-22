import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} style={styles.button}>
      Cerrar Sesión
    </button>
  );
};

const styles = {
  button: {
    padding: "10px 20px",
    background: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default LogoutButton;