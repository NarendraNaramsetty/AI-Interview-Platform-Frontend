import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import api from '../services/api';
import { getApiUrl } from '../utils/envConfig';

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const { pushToast } = useToastStore();
  const { setUser, theme } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      pushToast({ message: "VITE_GOOGLE_CLIENT_ID is not set in frontend .env.", type: "error" });
      return;
    }

    const apiBaseUrl = getApiUrl();
    const stateObj = { provider: 'google', apiBaseUrl };
    const stateStr = encodeURIComponent(JSON.stringify(stateObj));

    const redirectUri = `${window.location.origin}/auth-callback.html`;
    const nonce = Math.random().toString(36).substring(2);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20email%20profile&nonce=${nonce}&state=${stateStr}`;

    const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = authUrl;
    } else {
      const popup = window.open(
        authUrl,
        'google-oauth-popup',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        alert("Popup blocker is enabled! Please allow popups to sign in with Google.");
      }
    }
  };

  useEffect(() => {
    const handleMessage = async (event) => {
      // Ensure message comes from our origin
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'google-auth-success') {
        const { credential } = event.data;
        if (!credential) return;

        setLoading(true);
        try {
          // Send ID Token to backend for verification
          const response = await api.post('/api/auth/google/', { token: credential });
          const responseData = response.data || response;
          const { access, refresh, user } = responseData.data || responseData;

          if (access && refresh) {
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('auth_user', JSON.stringify(user));
            
            // Sync user state in Zustand store
            setUser(user);

            pushToast({ message: "Successfully logged in with Google!", type: "success" });
            navigate('/dashboard');
          } else {
            throw new Error("Tokens were not returned by the backend.");
          }
        } catch (error) {
          console.error("Google authentication failed:", error);
          const errorMsg = error.response?.data?.message || error.message || "Google authentication failed.";
          pushToast({ message: errorMsg, type: "error" });
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, pushToast, setUser]);

  return (
    <Button
      variant="outlined"
      fullWidth
      disabled={loading}
      onClick={handleGoogleLogin}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FaGoogle style={{ color: '#ea4335' }} />}
      sx={{
        py: 1.2,
        borderRadius: 3,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.825rem',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
        color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        '&:hover': {
          borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : '#6b7280',
          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#f9fafb',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1
      }}
    >
      {loading ? 'Connecting Google...' : 'Continue with Google'}
    </Button>
  );
}
