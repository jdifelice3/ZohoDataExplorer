import { getEndpoints } from "../../config/EndPoint.js";

export async function fetchContacts({ clientId, search, query, startRow, endRow, sortModel, filterModel }) {
  const endpoints = getEndpoints(process.env.NODE_ENV);
  const res = await fetch(`${endpoints.VITE_APP_SERVER_URL}/contactDataService`, {
    method: 'POST',
    
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId,
      search,
      queryBuilderFilter: query,
      startRow,
      endRow,
      sortModel,
      filterModel,
    }),
  })

  return await res.json();
}