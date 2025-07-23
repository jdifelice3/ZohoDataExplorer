import { getEndpoints } from "../../config/EndPoint.js";

const endpoints = getEndpoints(process.env.NODE_ENV);

export const putContactsForClient = async (clientId, industry) => {
    try {
      const res = await fetch(`${endpoints.VITE_APP_SERVER_URL}/putContactsForClient`, {
        method: 'PUT',
        

        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "clientId": clientId,
          "industry": industry
        }),
      });
    
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }