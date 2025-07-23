import axios from 'axios';
import qs from 'qs';

export const getAccessToken = async (REFRESH_TOKEN) => {
  
  const client_id = process.env.ZOHO_CLIENT_ID;
  const client_secret = process.env.ZOHO_CLIENT_SECRET;
  const redirect_uri = process.env.ZOHO_API_TOKEN_REDIRCT_URL;
  const refreshToken = REFRESH_TOKEN;
  
  const url = process.env.ZOHO_API_ACCESS_TOKEN_URL;

  const data = {
    grant_type: 'refresh_token',
    client_id,
    client_secret,
    redirect_uri,
    refresh_token: refreshToken
  };

  try {
      const response = await axios.post(url, qs.stringify(data), {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      });
      console.log('Access Token Response:', response.data);

      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error.response?.data || error.message);
      
      throw new Error('Failed to fetch access token: ' + error.message);  
    }
}