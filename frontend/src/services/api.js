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

export const railFenceApi = {
  encrypt: (text, rails) => api.post("/rail-fence/encrypt", { text, rails }),

  decrypt: (text, rails) => api.post("/rail-fence/decrypt", { text, rails }),

  visualize: (text, rails, operation) =>
    api.get("/rail-fence/visualize", { params: { text, rails, operation } }),
};

export const rsaApi = {
  generateKeys: (keySize = 2048) =>
    api.post("/rsa/generate-keys", { key_size: keySize }),

  encrypt: (plaintext, publicKey) =>
    api.post("/rsa/encrypt", { plaintext, public_key: publicKey }),

  decrypt: (ciphertext, privateKey) =>
    api.post("/rsa/decrypt", { ciphertext, private_key: privateKey }),

  visualize: (plaintext, publicKey) =>
    api.post("/rsa/visualize", { plaintext, public_key: publicKey }),
};
