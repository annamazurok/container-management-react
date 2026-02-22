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
import ContainerTypesPage from "../pages/TypesPage/ContainerTypesPage";
import ProductTypesPage from "../pages/TypesPage/ProductTypesPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import UnitsPage from "../pages/UnitsPage/UnitsPage";
import EditContainerPage from "../pages/EditContainerPage/EditContainerPage";


export default function AppRoute() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<ContainersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="containers" element={<ContainersPage />} />
        <Route path="products/new" element={<CreateProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route
          path="products/:id/containers"
          element={<ProductContainersPage />}
        />
        <Route path="containers/new" element={<CreateContainerPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="container-types" element={<ContainerTypesPage />} />
        <Route path="/units" element={<UnitsPage />} />
        <Route path="product-types" element={<ProductTypesPage />} />
        <Route path="containers/edit/:id" element={<EditContainerPage />} />
        <Route path="containerdetails/:id" element={<ContainerDetailsPage />} />
        <Route path="containerhistory/:id" element={<ContainerHistoryPage />} />
      </Route>
    </Routes>
  );
}
