import { Toaster } from "react-hot-toast";
import CaesarCipher from "./components/cipher/CaesarCipher";

function App() {
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

      {/* Header */}
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
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Caesar
              </a>
              <a href="#" className="text-gray-500">
                More coming soon...
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CaesarCipher />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 text-sm">
          EncodeX - Learning cryptography through visualization
        </div>
      </footer>
    </div>
  );
}

export default App;
