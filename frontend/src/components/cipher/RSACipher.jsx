import { useState } from "react";
import toast from "react-hot-toast";
import { Key, Lock, Unlock, Eye, Copy, Check } from "lucide-react";
import { rsaApi } from "../../services/api";

// ✅ Component defined OUTSIDE the main component
const VisualizationSteps = ({ steps }) => {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-semibold text-blue-400">
        🔍 RSA Encryption Steps
      </h4>
      {steps.map((step) => (
        <div
          key={step.step}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3"
        >
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
              {step.step}
            </span>
            <div className="flex-1">
              <h5 className="font-medium text-gray-200">{step.title}</h5>
              <p className="text-sm text-gray-400 mt-1">{step.description}</p>
              <div className="mt-2 bg-gray-900/70 p-2 rounded font-mono text-xs text-gray-300 overflow-x-auto">
                {Object.entries(step.details).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="text-blue-400">{key}:</span>
                    <span className="text-gray-300">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const RSACipher = () => {
  const [keySize, setKeySize] = useState(2048);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [visualization, setVisualization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("encrypt");
  const [copied, setCopied] = useState({
    public: false,
    private: false,
    result: false,
  });

  const handleGenerateKeys = async () => {
    setLoading(true);
    try {
      const response = await rsaApi.generateKeys(keySize);
      setPublicKey(response.data.public_key);
      setPrivateKey(response.data.private_key);
      toast.success(`RSA ${keySize}-bit key pair generated!`);
    } catch (error) {
      const detail = error.response?.data?.detail;
      const message =
        typeof detail === "string" ? detail : "Key generation failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEncrypt = async () => {
    if (!plaintext.trim()) {
      toast.error("Please enter text to encrypt");
      return;
    }
    if (!publicKey.trim()) {
      toast.error("Please generate or paste a public key");
      return;
    }
    setLoading(true);
    try {
      const response = await rsaApi.encrypt(plaintext, publicKey);
      setCiphertext(response.data.ciphertext);
      toast.success("Text encrypted successfully!");
    } catch (error) {
      const detail = error.response?.data?.detail;
      const message = typeof detail === "string" ? detail : "Encryption failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext.trim()) {
      toast.error("Please paste ciphertext to decrypt");
      return;
    }
    if (!privateKey.trim()) {
      toast.error("Please generate or paste a private key");
      return;
    }
    setLoading(true);
    try {
      const response = await rsaApi.decrypt(ciphertext, privateKey);
      setPlaintext(response.data.plaintext);
      toast.success("Decryption successful!");
    } catch (error) {
      const detail = error.response?.data?.detail;
      const message = typeof detail === "string" ? detail : "Decryption failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVisualize = async () => {
    if (!plaintext.trim()) {
      toast.error("Please enter text to visualize");
      return;
    }
    if (!publicKey.trim()) {
      toast.error("Please generate or paste a public key");
      return;
    }
    setLoading(true);
    try {
      const response = await rsaApi.visualize(plaintext, publicKey);
      setVisualization(response.data);
      setCiphertext(response.data.ciphertext);
      toast.success("Visualization generated!");
    } catch (error) {
      const detail = error.response?.data?.detail;
      const message =
        typeof detail === "string" ? detail : "Visualization failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied({ ...copied, [type]: true });
      setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
      toast.success("Copied to clipboard!");
    }
  };

  const clearAll = () => {
    setPlaintext("");
    setCiphertext("");
    setPublicKey("");
    setPrivateKey("");
    setVisualization(null);
    toast.success("Cleared all fields");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-400 mb-2">
          RSA Encryption
        </h2>
        <p className="text-gray-400">
          Asymmetric cipher using public/private key pairs.
        </p>
      </div>

      {/* Key Generation Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-37.5">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Key Size: {keySize} bits
            </label>
            <select
              value={keySize}
              onChange={(e) => setKeySize(parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white focus:outline-none focus:border-purple-500"
            >
              <option value={1024}>1024 (fast)</option>
              <option value={2048}>2048 (recommended)</option>
              <option value={4096}>4096 (secure)</option>
            </select>
          </div>
          <button
            onClick={handleGenerateKeys}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <Key className="w-4 h-4" />
            {loading ? "Generating..." : "Generate Keys"}
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Key Display */}
        {(publicKey || privateKey) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">
                  Public Key
                </label>
                <button
                  onClick={() => copyToClipboard(publicKey, "public")}
                  className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-1"
                >
                  {copied.public ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied.public ? "Copied" : "Copy"}
                </button>
              </div>
              <textarea
                value={publicKey}
                readOnly
                className="w-full h-24 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-xs font-mono text-gray-300 resize-none focus:outline-none"
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">
                  Private Key
                </label>
                <button
                  onClick={() => copyToClipboard(privateKey, "private")}
                  className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-1"
                >
                  {copied.private ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied.private ? "Copied" : "Copy"}
                </button>
              </div>
              <textarea
                value={privateKey}
                readOnly
                className="w-full h-24 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-xs font-mono text-gray-300 resize-none focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Operation Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {["encrypt", "decrypt", "visualize"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setVisualization(null);
            }}
            className={`px-6 py-2 font-medium transition-colors ${
              activeTab === tab
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          {activeTab === "encrypt" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plaintext
                </label>
                <textarea
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  placeholder="Enter text to encrypt..."
                  className="w-full h-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white resize-none"
                />
              </div>
              <button
                onClick={handleEncrypt}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {loading ? "Encrypting..." : "Encrypt"}
              </button>
            </>
          )}

          {activeTab === "decrypt" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ciphertext
                </label>
                <textarea
                  value={ciphertext}
                  onChange={(e) => setCiphertext(e.target.value)}
                  placeholder="Paste base64 ciphertext..."
                  className="w-full h-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white resize-none"
                />
              </div>
              <button
                onClick={handleDecrypt}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Unlock className="w-4 h-4" />
                {loading ? "Decrypting..." : "Decrypt"}
              </button>
            </>
          )}

          {activeTab === "visualize" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plaintext
                </label>
                <textarea
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  placeholder="Enter text to visualize..."
                  className="w-full h-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white resize-none"
                />
              </div>
              <button
                onClick={handleVisualize}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                {loading ? "Visualizing..." : "Visualize"}
              </button>
            </>
          )}
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                {activeTab === "decrypt" ? "Decrypted Text" : "Ciphertext"}
              </label>
              {(ciphertext || plaintext) && (
                <button
                  onClick={() =>
                    copyToClipboard(
                      activeTab === "decrypt" ? plaintext : ciphertext,
                      "result",
                    )
                  }
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300"
                >
                  {copied.result ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied.result ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <textarea
              value={activeTab === "decrypt" ? plaintext : ciphertext}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none font-mono"
            />
          </div>

          {/* Visualization Steps */}
          {visualization && <VisualizationSteps steps={visualization.steps} />}

          {/* Public Key Info */}
          {visualization?.public_key_info && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
              <h5 className="text-sm font-semibold text-gray-300">
                Public Key Info
              </h5>
              <div className="mt-2 text-xs font-mono text-gray-400 space-y-1">
                <div>
                  Modulus (n):{" "}
                  {String(visualization.public_key_info.n).slice(0, 30)}…
                </div>
                <div>Exponent (e): {visualization.public_key_info.e}</div>
                <div>
                  Bit length: {visualization.public_key_info.bit_length}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Info */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-purple-400 mb-2">
          🧠 How RSA Works
        </h3>
        <p className="text-gray-300 text-sm">
          RSA is an asymmetric cipher: you have a <strong>public key</strong>{" "}
          for encryption and a <strong>private key</strong> for decryption. The
          security relies on the difficulty of factoring large numbers.
        </p>
        <p className="text-gray-300 text-sm mt-2">
          <strong>Encryption:</strong> c = m<sup>e</sup> mod n &nbsp;|&nbsp;{" "}
          <strong>Decryption:</strong> m = c<sup>d</sup> mod n
        </p>
        <div className="mt-3 text-xs text-gray-400">
          💡 We use a 2048‑bit key by default. Larger keys are more secure but
          slower.
        </div>
      </div>
    </div>
  );
};

export default RSACipher;
