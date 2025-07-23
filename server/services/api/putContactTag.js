import axios from 'axios';
import { getAccessToken } from '../auth/authService.js';

export async function putContactTag(leadEmail, tag) {
    let url = `${process.env.ZOHO_API_ASSOCIATE_CONTACT_TAG_URL}?resfmt=JSON&tagName=${tag}&lead_email=${leadEmail}`;

    try {
        const accessToken = await getAccessToken(process.env.ZOHO_CAMPAIGN_CONTACTS_UPDATE_REFRESH_TOKEN);
        console.log(`Successfully retrieved access token from Zoho Campaign for putContactTag: ${accessToken}`);
        //Call the Associate Tag endpoint
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Zoho-oauthtoken ${accessToken}`
            }
        });
        console.log(`Successfully associated tag ${tag} with email ${leadEmail}: ${response.data}`);
        return response;
      } catch (error) {
        console.error('Error fetching access token:', error.response?.data || error.message);
        
        throw new Error('Failed to fetch access token: ' + error.message);  
      }
    }
  

  