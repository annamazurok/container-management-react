import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ContainersPage from "../pages/ContainersPage/ContainersPage";
import CreateProductPage from "../pages/CreateProductPage/CreateProductPage";
import EditProductPage from "../pages/EditProductPage/EditProductPage";
import ProductContainersPage from "../pages/ProductContainersPage/ProductContainersPage";
import CreateContainerPage from "../pages/CreateContainerPage/CreateContainerPage";
import UsersPage from "../pages/UsersPage/UsersPage";
import ContainerDetailsPage from "../pages/ContainerDetailsPage/ContainerDetailsPage";
import ContainerHistoryPage from "../pages/ContainerHistoryPage/ContainerHistoryPage";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";


export default function AppRoute() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProductsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="containers" element={<ContainersPage />} />
        <Route path="products/new" element={<CreateProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="products/:id/containers" element={<ProductContainersPage />} />
        <Route path="containers/new" element={<CreateContainerPage />} />

        {/* Тільки Admin */}
        <Route
          path="users"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route path="containerdetails" element={<ContainerDetailsPage />} />
        <Route path="containerhistory" element={<ContainerHistoryPage />} />
      </Route>

    </Routes>
  );
}
