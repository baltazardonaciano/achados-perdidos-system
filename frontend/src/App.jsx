import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminReivindicacoesPage from "./pages/AdminReivindicacoesPage";
import AdminUtilizadoresPage from "./pages/AdminUtilizadoresPage";
import HomePage from "./pages/HomePage";
import ObjetosPage from "./pages/ObjetosPage";
import ReportarPage from "./pages/ReportarPage";
import PerfilPage from "./pages/PerfilPage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 ROTAS ABERTAS */}
        <Route path="/" element={<LoginPage />} />

        {/* 🔒 ROTAS PROTEGIDAS (UTILIZADOR NORMAL) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/objetos"
          element={
            <ProtectedRoute>
              <ObjetosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportar"
          element={
            <ProtectedRoute>
              <ReportarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <PerfilPage />
            </ProtectedRoute>
          }
        />

        {/* 🔥 ROTAS ADMIN */}
        <Route
          path="/admin/reivindicacoes"
          element={
            <ProtectedRoute>
              <AdminReivindicacoesPage />
            </ProtectedRoute>
          }
        />

        {/* 🟣 NOVA ROTA ADMIN - UTILIZADORES */}
        <Route
          path="/admin/utilizadores"
          element={
            <ProtectedRoute>
              <AdminUtilizadoresPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}