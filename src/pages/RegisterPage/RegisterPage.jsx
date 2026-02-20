import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { registerWithGoogle } from '../../services/api/auth';
import './RegisterPage.css';

export default function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // If already logged in - redirect to containers
  useEffect(() => {
    if (user) {
      navigate('/containers');
    }
  }, [user, navigate]);

  /**
   * Handle Google response
   */
  const handleGoogleResponse = async (response) => {
    setError('');
    setLoading(true);

    try {
      const result = await registerWithGoogle(response.credential);
      
      if (result.token) {
        localStorage.setItem('jwt_token', result.token);
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize Google Sign-In
   */
  useEffect(() => {
    // Load Google Sign-In SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      // Render button
      window.google.accounts.id.renderButton(
        document.getElementById('google-register-button'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signup_with',
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
    <div className="register-container">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="register-icon">🚀</div>
          <h1 className="register-title">
            Register New Account
          </h1>
          <p className="register-subtitle">Containers Management System</p>
        </div>

        {!success ? (
          <>
            {/* Google Sign-In Button */}
            <div className="register-button-container">
              <div id="google-register-button"></div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="register-loading">
                Creating your account...
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="register-error">
                <p className="register-error-title">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {/* Login Link */}
            <div className="register-footer">
              <p>Already have an account?</p>
              <Link 
                to="/login" 
                className="register-link"
              >
                Sign in here
              </Link>
            </div>
          </>
        ) : (
          <div className="register-success-container">
            <div className="register-success">
              <p className="register-success-title">Success!</p>
              <p>Your account has been created.</p>
              <p className="redirect-message">Redirecting to login...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}