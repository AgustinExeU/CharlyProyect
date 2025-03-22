import React from "react";
import { Layout, Typography, Card, Button } from "antd";
import { Link } from "react-router-dom";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const ErrorPage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <Header style={styles.header}>
        <Title level={4} style={styles.company}>Company</Title>
        <div style={styles.menu}>
          <Link to="/" style={styles.menuItem}>Inicio</Link>
        </div>
        <div>
          <Link to="/profile" style={styles.menuItem}>Perfil</Link>
          <Link to="/logout" style={styles.menuItem}>Log Out</Link>
        </div>
      </Header>

      {/* Contenido principal */}
      <Content style={styles.content}>
        <div style={styles.errorContainer}>
          <div style={styles.errorBanner}>Error</div>
          <Card style={styles.card}>
            <CloseCircleOutlined style={styles.icon} />
            <Text>Lo sentimos, algo salió mal. Por favor, recargue la página.</Text>
            <Button type="primary" style={styles.errorButton}>404</Button>
          </Card>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={styles.footer}>
        <Text>Contactos</Text>
        <Text>Redes sociales</Text>
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
  menu: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  menuItem: {
    color: "white",
    marginLeft: 20,
    textDecoration: "none",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  errorContainer: {
    background: "#5a6b7a",
    padding: 40,
    borderRadius: 20,
    textAlign: "center",
    width: "50%",
  },
  errorBanner: {
    background: "red",
    color: "white",
    padding: "10px 0",
    fontWeight: "bold",
    marginBottom: 20,
    borderRadius: 5,
  },
  card: {
    background: "white",
    borderRadius: 10,
    padding: 20,
    textAlign: "center",
  },
  icon: {
    fontSize: 40,
    color: "red",
    marginBottom: 10,
  },
  errorButton: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    width: "100%",
  },
  footer: {
    background: "black",
    color: "white",
    textAlign: "center",
    padding: "10px 0",
  },
};

export default ErrorPage;
