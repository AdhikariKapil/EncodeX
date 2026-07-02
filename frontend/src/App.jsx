import { useState } from "react";
import { Toaster } from "react-hot-toast";
import CaesarCipher from "./components/cipher/CaesarCipher";
import RailFenceCiper from "./components/cipher/RailFenceCipher";
import RSACipher from "./components/cipher/RSACipher";

function App() {
  const [activeCipher, setActiveCipher] = useState("caesar");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        }}
      />

      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-blue-400">🔐 EncodeX</h1>
              <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
                v1.0
              </span>
            </div>
            <nav className="flex gap-4">
              {["caesar", "railfence", "rsa"].map((cipher) => (
                <button
                  key={cipher}
                  onClick={() => setActiveCipher(cipher)}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeCipher === cipher
                      ? cipher === "caesar"
                        ? "bg-blue-600 text-white"
                        : cipher === "railfence"
                          ? "bg-green-600 text-white"
                          : "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {cipher === "caesar"
                    ? "Caesar"
                    : cipher === "railfence"
                      ? "Rail Fence"
                      : "RSA"}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeCipher === "caesar" && <CaesarCipher />}
        {activeCipher === "railfence" && <RailFenceCiper />}
        {activeCipher === "rsa" && <RSACipher />}
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
          EncodeX - Learning cryptography through visualization
        </div>
      </footer>
    </div>
  );
}

export default App;
