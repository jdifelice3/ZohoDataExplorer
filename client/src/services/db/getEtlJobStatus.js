import { getEndpoints } from "../../config/EndPoint.js";

const endpoints = getEndpoints(process.env.NODE_ENV);

export async function getEtlJobStatus() {
  const response = await fetch(`${endpoints.VITE_APP_SERVER_URL}/etl-job-status`);
  const data = await response.json();
  return data;
}