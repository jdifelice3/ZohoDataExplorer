import { getEndpoints } from "../../config/EndPoint.js";
import { postStartJob } from "./postStartJob.js";

export async function postEtlDataService() {
  const endpoints = getEndpoints(process.env.NODE_ENV);
  try {
    const res = await fetch(`${endpoints.VITE_APP_SERVER_URL}/etlDataService`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({dummy: 'variable'})
    });
    return await res.json();
  } catch (error) {
    console.error('Error starting ETL job:', error); 
  }
}