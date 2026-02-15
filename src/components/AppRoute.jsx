import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ContainersPage from "../pages/ContainersPage/ContainersPage";
import CreateProductPage from "../pages/CreateProductPage/CreateProductPage";
import CreateContainerPage from "../pages/CreateContainerPage/CreateContainerPage";
import UsersPage from "../pages/UsersPage/UsersPage";
import ContainerDetailsPage from "../pages/ContainerDetailsPage/ContainerDetailsPage";
import ContainerHistoryPage from "../pages/ContainerHistoryPage/ContainerHistoryPage";

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProductsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="containers" element={<ContainersPage />} />
        <Route path="products/new" element={<CreateProductPage />} />
        <Route path="containers/new" element={<CreateContainerPage />} />
        <Route path="users" element={<UsersPage />} />

        <Route path="containerdetails" element={<ContainerDetailsPage />} />
        <Route path="containerhistory" element={<ContainerHistoryPage />} />
      </Route>
    </Routes>
  );
}
