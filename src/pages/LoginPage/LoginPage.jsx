import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Якщо вже залогінений - redirect на головну
  useEffect(() => {
    if (user) {
      navigate('/containers');
    }
  }, [user, navigate]);

  /**
   * Обробка відповіді від Google
   */
  const handleGoogleResponse = async (response) => {
    setError('');
    setLoading(true);

    const result = await login(response.credential);

    if (result.success) {
      navigate('/containers');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  /**
   * Ініціалізація Google Sign-In
   */
  useEffect(() => {
    // Завантажуємо Google Sign-In SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Ініціалізуємо Google Sign-In
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      // Рендеримо кнопку
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      );
    };

    // Cleanup
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h1 className="login-title">
            Вхід до системи
          </h1>
          <p className="login-subtitle">Containers Management System</p>
        </div>

        {/* Google Sign-In Button */}
        <div className="login-button-container">
          <div id="google-signin-button"></div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="login-loading">
            Авторизація...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="login-error">
            <p className="login-error-title">Помилка:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Info */}
        <div className="login-footer">
          <p>Don't have an account?</p>
          <Link 
            to="/register" 
            className="login-link"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}