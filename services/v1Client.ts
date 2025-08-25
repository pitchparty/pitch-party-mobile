import axios from "axios";

const v1ApiKey = process.env.EXPO_PUBLIC_SPORTSDB_API_KEY;  // Make sure it's correct

const v1Client = axios.create({
  baseURL: `https://www.thesportsdb.com/api/v1/json/${v1ApiKey}`,
});

export default v1Client;
