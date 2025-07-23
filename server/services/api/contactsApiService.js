import { getAccessToken } from '../auth/authService.js';
import axios from 'axios';

export async function getContacts(clientId) {
    
    const url = `https://recruit.zoho.com/recruit/v2/Contacts/search?criteria=(Client_Name:equals:${clientId})`;

    try {
        const accessToken = await getAccessToken(process.env.ZOHO_RECRUIT_SEARCH_READ_REFRESH_TOKEN);
         
        const results = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'Zoho-oauthtoken ' + accessToken            }
          });

        return results.data;
    } catch (error) {
        console.error('Error fetching contacts:', error.response?.data || error.message);
        throw new Error('Failed to fetch contacts: ' + error.message);
    }   
}