import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { FaLinkedin } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { getApiUrl } from '../utils/envConfig';

export default function LinkedInLoginButton() {
  const { theme } = useAuthStore();
  const { pushToast } = useToastStore();
  const [loading, setLoading] = useState(false);

  const handleLinkedInLogin = () => {
    setLoading(true);
    const apiBaseUrl = getApiUrl();
    // Redirect browser to django OAuth initiate endpoint with dynamic origin callback
    const origin = window.location.origin;
    window.location.href = `${apiBaseUrl}/api/auth/linkedin/login/?redirect_origin=${encodeURIComponent(origin)}`;
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      disabled={loading}
      onClick={handleLinkedInLogin}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FaLinkedin style={{ color: '#0a66c2' }} />}
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
      {loading ? 'Redirecting to LinkedIn...' : 'Continue with LinkedIn'}
    </Button>
  );
}
