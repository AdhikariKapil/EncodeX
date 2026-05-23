import { useState } from "react";
import toast from "react-hot-toast";
import { Lock, Unlock, Eye, Scan, Copy, Check } from "lucide-react";
import { caesarApi } from "../../services/api";
import VisualizationStep from "./VisualizaitonStep";

const CaesarCipher = () => {
  const [inputText, setInputText] = useState("");
  const [shift, setShift] = useState(3);
  const [outputText, setOutputText] = useState("");
  const [visualization, setVisualization] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("encrypt"); // encrypt, decrypt, bruteforce
  const [bruteforceResults, setBruteforceResults] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to encrypt");
      return;
    }

    setLoading(true);
    try {
      const response = await caesarApi.encrypt(inputText, shift);
      setOutputText(response.data.ciphered_text);
      setVisualization(response.data.visualization);
      toast.success("Text encrypted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Encryption failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to decrypt");
      return;
    }

    setLoading(true);
    try {
      const response = await caesarApi.decrypt(inputText, shift);
      setOutputText(response.data.ciphered_text);
      setVisualization(response.data.visualization);
      toast.success("Text decrypted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Decryption failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVisualize = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to visualize");
      return;
    }

    setLoading(true);
    try {
      const response = await caesarApi.visualize(inputText, shift);
      setOutputText(response.data.result_text);
      setVisualization(response.data.visualization_steps);
      toast.success("Visualization generated!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Visualization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBruteforce = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter ciphertext to bruteforce");
      return;
    }

    setLoading(true);
    try {
      const response = await caesarApi.bruteforce(inputText);
      setBruteforceResults(response.data.results);
      toast.success(`Found ${response.data.total_attempts} possible shifts!`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Bruteforce failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard!");
    }
  };

  const clearAll = () => {
    setInputText("");
    setOutputText("");
    setVisualization([]);
    setBruteforceResults([]);
    toast("Cleared all fields", { icon: "🧹" });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-400 mb-2">Caesar Cipher</h2>
        <p className="text-gray-400">
          Shift letters by a fixed number of positions. Also known as shift
          cipher.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {["encrypt", "decrypt", "bruteforce"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setOutputText("");
              setVisualization([]);
              setBruteforceResults([]);
            }}
            className={`px-6 py-2 font-medium transition-colors ${
              activeTab === tab
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {activeTab === "bruteforce" ? "Ciphertext" : "Text"}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === "bruteforce"
                  ? "Enter encrypted text to bruteforce..."
                  : "Enter your text here..."
              }
              className="w-full h-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-none"
            />
          </div>

          {activeTab !== "bruteforce" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Shift Amount (1-25)
              </label>
              <input
                type="range"
                min="1"
                max="25"
                value={shift}
                onChange={(e) => setShift(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>Shift: {shift}</span>
                <span className="font-mono">
                  {shift === 1
                    ? "A→B"
                    : shift === 25
                      ? "A→Z"
                      : `A→${String.fromCharCode(65 + shift)}`}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {activeTab === "encrypt" && (
              <button
                onClick={handleEncrypt}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {loading ? "Processing..." : "Encrypt"}
              </button>
            )}
            {activeTab === "decrypt" && (
              <button
                onClick={handleDecrypt}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Unlock className="w-4 h-4" />
                {loading ? "Processing..." : "Decrypt"}
              </button>
            )}
            {activeTab === "bruteforce" && (
              <button
                onClick={handleBruteforce}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Scan className="w-4 h-4" />
                {loading ? "Bruteforcing..." : "Bruteforce"}
              </button>
            )}
            <button
              onClick={handleVisualize}
              disabled={loading || activeTab === "bruteforce"}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              Visualize
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                {activeTab === "bruteforce" ? "Possible Decryptions" : "Result"}
              </label>
              {outputText && activeTab !== "bruteforce" && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>

            {activeTab === "bruteforce" ? (
              <div className="h-96 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg p-4">
                {bruteforceResults.length > 0 ? (
                  <div className="space-y-2">
                    {bruteforceResults.map((result, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors cursor-pointer"
                        onClick={() => {
                          setInputText(result.decrypted_text);
                          toast.success(`Shift ${result.shift} selected`);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-blue-400 font-mono">
                            Shift {result.shift}
                          </span>
                          <span className="text-xs text-gray-400">
                            Click to use
                          </span>
                        </div>
                        <p className="font-mono text-sm mt-1">
                          {result.decrypted_text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">
                    Click "Bruteforce" to see all possible shifts
                  </p>
                )}
              </div>
            ) : (
              <textarea
                value={outputText}
                readOnly
                placeholder="Result will appear here..."
                className="w-full h-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none font-mono"
              />
            )}
          </div>

          {/* Visualization Section */}
          {visualization &&
            visualization.length > 0 &&
            activeTab !== "bruteforce" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Step-by-Step Visualization ({visualization.length} steps)
                </label>
                <div className="h-64 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg p-2">
                  {visualization.map((step, idx) => (
                    <VisualizationStep key={idx} step={step} index={idx} />
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Educational Info */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-blue-400 mb-2">
          📖 How it works
        </h3>
        <p className="text-gray-300 text-sm">
          The Caesar cipher shifts each letter in the plaintext by a fixed
          number of positions down the alphabet. For example, with a shift of 3,
          A becomes D, B becomes E, and so on. The alphabet wraps around, so Z
          becomes C. This cipher is named after Julius Caesar, who used it to
          encrypt military messages.
        </p>
        <div className="mt-3 text-xs text-gray-400">
          Formula:{" "}
          <code className="bg-gray-900 px-2 py-1 rounded">
            C = (P + K) mod 26
          </code>{" "}
          where P is the plaintext position, K is the shift, and C is the
          ciphertext position.
        </div>
      </div>
    </div>
  );
};

export default CaesarCipher;
