import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Typography, Card, Spin, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
        setProducto(response.data);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spin size="large" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (!producto) {
    return <p style={styles.errorText}>Producto no encontrado</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Menú superior */}
      <Header style={styles.header}>
        <Title level={4} style={styles.company}>Company</Title>
        <div style={styles.menuContainer}>
          <Link to="/Home" style={styles.menuItem}>Inicio</Link>
          <Link to="/Perfil" style={styles.menuItem}>Perfil</Link>
          <span onClick={handleLogout} style={styles.menuItem}>Log Out</span>
        </div>
      </Header>

      {/* Contenido */}
      <Content style={styles.container}>
        <Card style={styles.productCard}>
          {/* Imagen del producto */}
          <div style={styles.imageContainer}>
            <img
              src={producto.image ? producto.image : "/placeholder.png"}
              alt={producto.name}
              style={styles.productImage}
            />
          </div>

          {/* Detalles del producto */}
          <div style={styles.detailsContainer}>
            <Title level={2} style={styles.productTitle}>{producto.name}</Title>
            <Paragraph style={styles.productDescription}>{producto.description}</Paragraph>
            {producto.price && <Title level={3} style={styles.productPrice}>${producto.price}</Title>}
            <Paragraph style={styles.productCategory}>Categoría: {producto.category}</Paragraph>
            <Button type="primary" onClick={() => console.log("Comprar producto")}>Comprar</Button>
          </div>
        </Card>
      </Content>

      {/* Pie de página */}
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
    flexDirection: "column",
    padding: "20px 50px",
  },
  productCard: {
    display: "flex",
    flexDirection: "row",
    gap: "30px",
    padding: "30px",
    width: "90%",
    maxWidth: "1000px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    borderRadius: "10px",
  },
  imageContainer: {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    maxWidth: "500px", 
    borderRadius: "10px",
    objectFit: "cover",
  },
  detailsContainer: {
    flex: "2",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  productTitle: {
    fontWeight: "bold",
    color: "#333",
  },
  productDescription: {
    fontSize: "16px",
    color: "#555",
  },
  productPrice: {
    color: "#ff4d4f",
    fontWeight: "bold",
  },
  productCategory: {
    fontSize: "14px",
    color: "#888",
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
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  errorText: {
    textAlign: "center",
    fontSize: "18px",
    color: "red",
    marginTop: "20px",
  },
};

export default ProductoDetalle;
