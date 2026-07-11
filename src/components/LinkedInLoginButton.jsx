import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { FaLinkedin } from 'react-icons/fa';
import { useToastStore } from '../store/useToastStore';
import { getApiUrl } from '../utils/envConfig';

export default function LinkedInLoginButton() {
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
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FaLinkedin />}
      sx={{
        py: 1.2,
        borderRadius: 3,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.825rem',
        borderColor: 'rgba(0,0,0,0.12)',
        color: 'text.primary',
        '&:hover': {
          borderColor: 'text.primary',
          backgroundColor: 'action.hover',
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
