import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useContext(AuthContext);

  // Поки йде перевірка токена/користувача
  if (loading) {
    return <div>Loading...</div>;
  }

  // Якщо користувач неавторизований → редірект на логін
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Якщо є перевірка ролей і роль не підходить → редірект на головну
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Якщо все ок → показуємо дочірній компонент
  return children;
}
