import { getEndpoints } from '../../config/EndPoint.js';
export async function postEtlStartJob() {
    const endpoints = getEndpoints(process.env.NODE_ENV);
    try {
        const response = await fetch(`${endpoints.VITE_APP_SERVER_URL}/etl-start-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({dummy: 'variable'}),
      });
      return await response.json();
    } catch (error) {
      console.error('Error starting job:', error);
    }
}