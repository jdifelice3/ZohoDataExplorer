import { getEndpoints } from "../../config/EndPoint.js";

const endpoints = getEndpoints(process.env.NODE_ENV);

export async function fetchViewLog({ search, query, startRow, endRow, sortModel, filterModel }) {
    const res = await fetch(`${endpoints.VITE_APP_SERVER_URL}/logDataService`, {
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
  