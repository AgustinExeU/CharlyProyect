import React, { useState } from "react";
import { Button, Input, Card, Typography, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [requiresMfa, setRequiresMfa] = useState(false);
  

  const onFinish = async () => {
    setLoading(true);
    console.log("Datos enviados al backend:", { email, password, mfaToken });

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        token: mfaToken, 
      });
      const data = response.data;

   
      if (data.msg === "Se requiere MFA") {
        setRequiresMfa(true); 
        message.info("Ingrese su código MFA");
        return;
      }

      // Si no se requiere MFA, guarda el token y redirige
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      message.success("Inicio de sesión exitoso!");

      // Redirección según el rol
      if (data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.response && error.response.data && error.response.data.msg) {
        message.error(error.response.data.msg);
      } else {
        message.error("Error al iniciar sesión");
      }
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <Card style={styles.card}>
        <Title level={4} style={styles.siteName}>Nombre del sitio web</Title>
        <div style={styles.logo}>Logo</div>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Text>Correo Electrónico</Text>
          <Input placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Text>Contraseña</Text>
          <Input.Password placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />

          {/* Campo para el token MFA (siempre visible, pero opcional) */}
          <Text>Token MFA (opcional)</Text>
          <Input
            placeholder="Código MFA"
            value={mfaToken}
            onChange={(e) => setMfaToken(e.target.value)}
          />

          {/* Botón de inicio de sesión */}
          <Button
            type="primary"
            block
            style={styles.loginButton}
            loading={loading}
            onClick={onFinish}
          >
            Iniciar sesión
          </Button>

          <Button block style={styles.registerButton} onClick={() => navigate("/register")}>
            Registrarse
          </Button>
          {/* Botón para recuperar contraseña */}
          <Button block style={styles.forgotPasswordButton} onClick={() => navigate("/forgot-password")}>
            ¿Olvidaste tu contraseña?
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
  forgotPasswordButton: {
    background: "transparent",
    border: "none",
    color: "#1890ff",
    textDecoration: "underline",
  },
};

export default LoginPage;