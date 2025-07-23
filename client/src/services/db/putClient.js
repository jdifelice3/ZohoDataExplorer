import { getEndpoints } from "../../config/EndPoint.js";

export const putClient = async(formData) => {
  try {
    const endpoints = getEndpoints(import.meta.env.MODE);
    const res = await fetch(`${endpoints.VITE_APP_SERVER_URL}/putClient`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    if (!res.ok) {
      throw new Error(`Error updating client: ${result}`);
    }

    const result = await res.json();
    console.log('Client updated successfully:', result);
    
    return result;

  } catch (error) {
    console.error('Error updating client:', error); 
    throw error;  
  }
}