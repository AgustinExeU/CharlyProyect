import React, { useEffect, useState } from "react";
import { Layout, Card, Button, Row, Col, Typography, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../api";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Option } = Select;

const categories = ["Todos", "Emotes", "Avatares", "Pantallas"];

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    if (category === "Todos") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={styles.header}>
        <Title level={4} style={styles.company}>Company</Title>
        <div style={styles.menuContainer}>
          <Link to="/Home" style={styles.menuItem}>Inicio</Link>
          <Link to="/Perfil" style={styles.menuItem}>Perfil</Link>
          <span onClick={handleLogout} style={styles.menuItem}>Log Out</span>
        </div>
      </Header>

      <Content style={styles.container}>
        <Title level={4} style={styles.banner}>Los mejores precios aquí, ¡aprovéchalos!</Title>
        
        <Select defaultValue="Todos" onChange={handleFilterChange} style={styles.filter}>
          {categories.map((cat) => (
            <Option key={cat} value={cat}>{cat}</Option>
          ))}
        </Select>

        <Row gutter={[16, 16]} justify="center" style={styles.productRow}>
          {filteredProducts.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6} style={styles.productCol}>
              <Card
                title={product.name}
                cover={<img src={product.image || "/placeholder.png"} alt={product.name} style={styles.productImage} />}
                style={styles.productCard}
              >
                <Button type="primary" style={styles.productButton}>Comprar</Button>
                <Button type="default" onClick={() => navigate(`/producto/${product.id}`)}>Detalles</Button>
              </Card>
            </Col>
          ))}


          {filteredProducts.length < 4 &&
            [...Array(4 - filteredProducts.length)].map((_, index) => (
              <Col key={`empty-${index}`} xs={24} sm={12} md={8} lg={6} style={{ visibility: "hidden" }}>
                <Card style={styles.productCard} />
              </Col>
            ))}
        </Row>
      </Content>

      <Footer style={styles.footer}>
        <div style={styles.footerContent}>
          <Link to="/Contactos" style={styles.footerLink}>Contactos</Link>
          <span style={styles.footerDivider}>|</span>
          <Link to="/RedesSociales" style={styles.footerLink}>Redes Sociales</Link>
        </div>
      </Footer>
    </Layout>
  );
}

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "black", padding: "0 20px" },
  company: { color: "white", margin: 0 },
  menuContainer: { display: "flex", gap: "20px", color: "white" },
  menuItem: { cursor: "pointer", color: "white", textDecoration: "none" },
  container: { display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "20px 50px" },
  banner: { textAlign: "center", marginBottom: "20px" },
  filter: { width: 200, marginBottom: 20 },
  productRow: { width: "100%", maxWidth: "1200px", margin: "auto", minHeight: "400px" },
  productCol: { minWidth: "250px" },
  productImage: { width: "100%", height: 150, objectFit: "cover" },
  productCard: { borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", overflow: "hidden", textAlign: "center", minHeight: "300px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  productButton: { marginBottom: "10px" },
  footer: { background: "black", color: "white", textAlign: "center", padding: "10px 50px" },
  footerContent: { display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" },
  footerLink: { color: "white", textDecoration: "none", fontSize: "16px" },
  footerDivider: { color: "white", fontSize: "16px" },
};

export default Home;
  