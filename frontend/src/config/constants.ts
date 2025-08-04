// For debugging - log the API URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
console.log("API_URL:", apiUrl);

export const API_URL = apiUrl;
