import React from "react";
import { Layout, Menu, Card, List, Typography, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";


const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const contactData = [
  {
    title: "Números de contacto",
    icon: <PhoneOutlined />,
    data: ["+1 123 456 7890", "+44 987 654 3210", "+34 612 345 678", "+49 152 789 6543"],
  },
  {
    title: "Redes sociales",
    icon: [<FacebookOutlined />, <TwitterOutlined />, <LinkedinOutlined />],
    data: ["facebook.com/empresa", "twitter.com/empresa", "linkedin.com/in/empresa"],
  },
  {
    title: "Correos de contacto",
    icon: <MailOutlined />,
    data: ["contacto@empresa.com", "soporte@empresa.com", "ventas@empresa.com", "info@empresa.com"],
  },
];

const Contactos = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Navbar tomado del último código que enviaste */}
      <Header style={styles.header}>
        <Title level={4} style={styles.company}>Company</Title>
        <div style={styles.menuContainer}>
          <Link to="/Home" style={styles.menuItem}>Inicio</Link>
          <Link to="/Perfil" style={styles.menuItem}>Perfil</Link>
          <span onClick={handleLogout} style={styles.menuItem}>Log Out</span>
        </div>
      </Header>

      {/* Contenido con las tarjetas bien organizadas */}
      <Content style={styles.container}>
        <Title level={3} style={styles.banner}>Información de contacto</Title>
        <Row gutter={[24, 24]} justify="center">
          {contactData.map((section, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card title={section.title} style={styles.card}>
                <List
                  dataSource={section.data}
                  renderItem={(item, idx) => (
                    <List.Item style={styles.listItem}>
                      {Array.isArray(section.icon) ? section.icon[idx] || section.icon[0] : section.icon} {item}
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      {/* Footer tomado del último código que enviaste */}
      <Footer style={styles.footer}>
        <div style={styles.footerContent}>
          <Link to="/Contactos" style={styles.footerLink}>Contactos</Link>
          <span style={styles.footerDivider}>|</span>
          <Link to="/RedesSociales" style={styles.footerLink}>Redes sociales</Link>
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
    padding: "40px 50px",
    textAlign: "center",
  },
  banner: {
    marginBottom: "30px",
  },
  card: {
    borderRadius: "15px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    padding: "20px",
    minHeight: "250px",
  },
  listItem: {
    textAlign: "center",
    fontSize: "16px",
    padding: "5px 0",
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

export default Contactos;
