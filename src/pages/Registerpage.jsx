import React, { useState } from "react";
import { Button, Input, Card, Typography, Space, message, Checkbox, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    mfaEnabled: false,
    securityQuestion: "", 
    securityAnswer: "", 
  });
  const [qrCode, setQrCode] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [isMfaModalVisible, setIsMfaModalVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMfaChange = (e) => {
    setFormData({ ...formData, mfaEnabled: e.target.checked });
    console.log("Estado de mfaEnabled:", e.target.checked);
  };

  const onFinish = async () => {
    setLoading(true);
    console.log("Datos enviados al backend:", formData);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      console.log("Respuesta del backend:", response.data);

      if (formData.mfaEnabled) {
        console.log("qrCode recibido:", response.data.qrCode);
        setQrCode(response.data.qrCode);
        setIsMfaModalVisible(true);
      } else {
        message.success("Usuario registrado. Ahora inicie sesión.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      message.error(error.response?.data?.msg || "Error al registrar.");
    }
    setLoading(false);
  };

  const verifyMfa = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/verify-mfa", { email: formData.email, code: mfaCode });
      message.success("MFA activado correctamente. Ahora inicie sesión.");
      setIsMfaModalVisible(false);
      navigate("/login");
    } catch (error) {
      console.error("Error al verificar MFA:", error);
      message.error("Código incorrecto. Intente nuevamente.");
    }
  };

  return (
    <div className="login-container" style={styles.page}>
      <Card style={styles.card}>
        <Title level={4} style={styles.siteName}>Nombre del sitio web</Title>
        <div style={styles.logo}>Logo</div>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>Correo Electrónico</Text>
          <Input name="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleChange} />
          <Text>Usuario</Text>
          <Input name="username" placeholder="Usuario" value={formData.username} onChange={handleChange} />
          <Text>Contraseña</Text>
          <Input.Password name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
          <Text>Pregunta Secreta</Text>
          <Input
            name="securityQuestion"
            placeholder="Pregunta Secreta"
            value={formData.securityQuestion}
            onChange={handleChange}
          />
          <Text>Respuesta Secreta</Text>
          <Input
            name="securityAnswer"
            placeholder="Respuesta Secreta"
            value={formData.securityAnswer}
            onChange={handleChange}
          />
          <Checkbox checked={formData.mfaEnabled} onChange={handleMfaChange}>
            Activar MFA (Google Authenticator)
          </Checkbox>
          <Button type="primary" block style={styles.loginButton} onClick={onFinish} loading={loading}>
            Registrarse
          </Button>
          <Button block style={styles.registerButton}>
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </Space>
      </Card>

      <Modal title="Configurar MFA" visible={isMfaModalVisible} onOk={verifyMfa} onCancel={() => setIsMfaModalVisible(false)}>
        <p>Escanee este código QR con Google Authenticator:</p>
        {qrCode ? (
          <img src={qrCode} alt="QR Code" style={{ width: "100%" }} />
        ) : (
          <p>Generando QR Code...</p>
        )}
        <Input placeholder="Ingrese el código MFA" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} />
      </Modal>
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

export default RegisterPage;