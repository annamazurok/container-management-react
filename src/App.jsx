import "./App.css";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import ContainersPage from "./pages/ContainersPage/ContainersPage";
import CreateContainerPage from "./pages/CreateContainerPage/CreateContainerPage";
import CreateProductPage from "./pages/CreateProductPage/CreateProductPage";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <div className="App">
      <Layout>
        <CreateContainerPage />
      </Layout>
    </div>
  );
}

export default App;
