import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx"; 
import RegisterPage from "./pages/RegisterPage.jsx";
import Home from "./pages/Home.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import Contactos from "./pages/Contactos.jsx";
import Perfil from "./pages/Perfil.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/producto/:id"
        element={
          <ProtectedRoute>
            <ProductoDetalle />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contactos"
        element={
          <ProtectedRoute>
            <Contactos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            
              <Dashboard />
            
          </ProtectedRoute>
        }
      />

      {/* Ruta de error */}
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;