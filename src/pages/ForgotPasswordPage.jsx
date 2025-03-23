import React, { useState } from "react";
import { Button, Input, Card, Typography, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const onFinish = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        email,
        securityAnswer,
        newPassword,
      });
      message.success(response.data.msg);
      navigate("/login");
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      message.error(error.response?.data?.msg || "Error al recuperar contraseña.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <Card style={styles.card}>
        <Title level={4} style={styles.siteName}>Recuperar Contraseña</Title>
        <div style={styles.logo}>Logo</div>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Text>Correo Electrónico</Text>
          <Input placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Text>Respuesta a la Pregunta Secreta</Text>
          <Input placeholder="Respuesta" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} />
          <Text>Nueva Contraseña</Text>
          <Input.Password placeholder="Nueva Contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Button type="primary" block style={styles.loginButton} loading={loading} onClick={onFinish}>
            Recuperar Contraseña
          </Button>
          <Button block style={styles.registerButton} onClick={() => navigate("/login")}>
            Volver al Inicio de Sesión
          </Button>
        </Space>
      </Card>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f2f5",
  },
  card: {
    width: 400,
    textAlign: "center",
    padding: 20,
    borderRadius: 10,
  },
  siteName: {
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    background: "#ddd",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  loginButton: {
    background: "#a7c7fc",
    border: "none",
    color: "black",
  },
  registerButton: {
    background: "#fff",
    border: "1px solid #ccc",
  },
};

export default ForgotPasswordPage;