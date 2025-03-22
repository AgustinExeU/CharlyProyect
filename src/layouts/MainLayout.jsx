import React from "react";
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
import { AppstoreOutlined, UserOutlined, ShopOutlined, LogoutOutlined } from "@ant-design/icons";

const { Sider, Content, Footer } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" width={200}>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["products"]}>
          <Menu.Item key="products" icon={<ShopOutlined />}>
            <Link to="/Dashboard">Gestión de Productos</Link>
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/admin/users">Gestión de Usuarios</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: "20px" }}>
        <Content style={{ padding: 20, minHeight: "calc(100vh - 150px)" }}>
          <Outlet /> {/* Aquí se renderizan las vistas específicas */}
        </Content>
        <Footer style={{ textAlign: "center", background: "black", color: "white" }}>
          Admin Panel ©2024
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
