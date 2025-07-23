import { getEndpoints } from "../../config/EndPoint.js";

export async function fetchClients({ search, query, startRow, endRow, sortModel, filterModel }) {

  const endPoints = getEndpoints(import.meta.env.MODE);
  const endpoint = endPoints.VITE_APP_SERVER_URL; // For testing purposes only, remove in production
  const res = await fetch(`${endpoint}/clientDataService`, {
    method: 'POST',
    
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        search,
        queryBuilderFilter: query,
        startRow,
        endRow,
        sortModel,
        filterModel,
      }),
    });
  
    return await res.json();
  }