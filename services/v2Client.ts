import axios from "axios";

const v2Client = axios.create({
  baseURL: "https://www.thesportsdb.com/api/v2/json",
});

v2Client.interceptors.request.use((config) => {
  config.headers["X-API-KEY"] = process.env.EXPO_PUBLIC_SPORTSDB_API_KEY;
  return config;
});

export default v2Client;
