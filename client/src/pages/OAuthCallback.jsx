// client/src/pages/OAuthCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      const domain = `${process.env.APP_SERVER_URL}:${process.env.APP_SERVER_PORT}`; 
      fetch(`${domain}/auth/zoho/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          navigate('/dashboard');
        })
        .catch(err => {
          console.error('OAuth error:', err);
        });
    }
  }, [navigate]);

  return <div>Logging in with Zoho...</div>;
};

export default OAuthCallback;
