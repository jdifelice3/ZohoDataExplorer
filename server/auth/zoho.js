import express from 'express';
import { ZOHO_CREDENTIALS } from '../config/constants.js';
import { ROUTES } from '../config/api.js';

const router = express.Router();
router.post('/callback', async (req, res) => {
  const { code } = req.body;

  try {
    const params = new URLSearchParams({
      code,
      client_id: ZOHO_CREDENTIALS.CLIENT_ID,
      client_secret: ZOHO_CREDENTIALS.CLIENT_SECRET,
      redirect_uri: ROUTES.TOKEN_REDIRCT_URL,
      grant_type: 'authorization_code',
    });

    const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Zoho token error: ${error}`);
    }

    const data = await tokenResponse.json();
    const { access_token, refresh_token } = data;

    res.json({ access_token, refresh_token });
  } catch (err) {
    console.error('Token exchange failed:', err.message);
    res.status(500).json({ error: 'Failed to exchange token' });
  }
});

export default router;
