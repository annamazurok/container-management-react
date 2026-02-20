import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoute from "./components/AppRoute";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
          <AppRoute />
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
