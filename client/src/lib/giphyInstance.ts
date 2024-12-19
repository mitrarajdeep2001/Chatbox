import { GiphyFetch } from "@giphy/js-fetch-api";

// Initialize the Giphy API with your API key
const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);

export default gf;
