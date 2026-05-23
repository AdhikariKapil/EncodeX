import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const caesarApi = {
  // Encrypt text
  encrypt: (text, shift) => api.post("/caesar/encrypt", { text, shift }),

  // Decrypt text
  decrypt: (text, shift) => api.post("/caesar/decrypt", { text, shift }),

  // Bruteforce text
  bruteforce: (text) => api.post("/caesar/bruteforce", { text }),

  // Visualization
  visualize: (text, shift) =>
    api.get("/caesar/visualize", {
      params: { text, shift },
    }),
};

export default api;
