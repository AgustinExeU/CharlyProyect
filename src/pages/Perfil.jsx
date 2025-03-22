import React, { useState, useEffect } from "react";
import { Layout, Card, Button, Typography, Avatar } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons"; 
import axios from "axios"; 

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Datos del usuario obtenidos:", response.data); 
          setUser(response.data); 
          setLoading(false); 
        })
        .catch((error) => {
          console.error("Error al obtener el perfil:", error);
          localStorage.removeItem("token");
          navigate("/login"); 
        });
    } else {
      navigate("/login"); 
    }
  }, [navigate]);

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={styles.header}>
        <Title level={4} style={styles.company}>
          Company
        </Title>
        <div style={styles.menuContainer}>
          <Link to="/Home" style={styles.menuItem}>
            Inicio
          </Link>
          <span style={styles.menuItem}>Perfil</span>
          <span onClick={handleLogout} style={styles.menuItem}>
            Log Out
          </span>
        </div>
      </Header>

      <Content style={styles.container}>
        <Card style={styles.profileCard}>
          <div style={styles.profileImage}>
            <Avatar icon={<UserOutlined />} size={80} />
          </div>

          <Button style={styles.nameButton}>
            {loading ? "Cargando..." : user?.username || "No hay nombre de usuario"}
          </Button>

          <Button style={styles.logoutButton} onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Card>
      </Content>

      <Footer style={styles.footer}>
        <div style={styles.footerContent}>
          <Link to="/Contactos" style={styles.footerLink}>
            Contactos
          </Link>
          <span style={styles.footerDivider}>|</span>
          <Link to="/RedesSociales" style={styles.footerLink}>
            Redes Sociales
          </Link>
        </div>
      </Footer>
    </Layout>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "black",
    padding: "0 20px",
  },
  company: {
    color: "white",
    margin: 0,
  },
  menuContainer: {
    display: "flex",
    gap: "20px",
    color: "white",
  },
  menuItem: {
    cursor: "pointer",
    color: "white",
    textDecoration: "none",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  profileCard: {
    background: "#5a6b7a",
    padding: "40px",
    textAlign: "center",
    borderRadius: "20px",
    width: "400px",
  },
  profileImage: {
    width: "80px",
    height: "80px",
    background: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  nameButton: {
    marginBottom: "10px",
  },
  logoutButton: {
    background: "red",
    color: "white",
    border: "none",
  },
  footer: {
    background: "black",
    color: "white",
    textAlign: "center",
    padding: "10px 50px",
  },
  footerContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  footerLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },
  footerDivider: {
    color: "white",
    fontSize: "16px",
  },
};

export default Perfil;
