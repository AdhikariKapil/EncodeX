import { useState } from "react";
import toast from "react-hot-toast";
import { Lock, Unlock, Eye, Copy, Check } from "lucide-react";
import { railFenceApi } from "../../services/api"; // ✅ Fixed import name

// const RailVisualization = ({ visualRails }) => {
//   if (!visualRails || visualRails.length === 0) return null;
//
//   return (
//     <div className="mt-4">
//       <h4 className="text-sm font-medium text-gray-300 mb-3">
//         Rail Grid Visualization:
//       </h4>
//       <div className="space-y-2">
//         {visualRails.map((rail) => (
//           <div key={rail.rail_number} className="flex items-center gap-2">
//             <div className="w-12 text-xs text-blue-400 font-mono">
//               Rail {rail.rail_number}:
//             </div>
//             <div className="flex-1 flex gap-1 overflow-x-auto">
//               {rail.content.map((cell, idx) => (
//                 <div
//                   key={idx}
//                   className={`w-8 h-8 flex items-center justify-center rounded font-mono text-sm ${
//                     cell.char !== "."
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-800 text-gray-600"
//                   }`}
//                 >
//                   {cell.char}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="mt-2 text-xs text-gray-500">
//         💡 Each column represents a character position. Dots (.) show empty
//         spaces in the rail pattern.
//       </div>
//     </div>
//   );
// };

const RailFenceCipher = () => {
  const [inputText, setInputText] = useState("");
  const [rails, setRails] = useState(3);
  const [outputText, setOutputText] = useState("");
  const [visualRails, setVisualRails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("encrypt");
  const [copied, setCopied] = useState(false);

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to encrypt");
      return;
    }
    setLoading(true);
    try {
      const response = await railFenceApi.encrypt(inputText, rails);
      setOutputText(response.data.encrypted_text);
      setVisualRails(response.data.visual_rails || []);
      toast.success("Text encrypted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Encryption Failed");
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
      const response = await railFenceApi.decrypt(inputText, rails);
      setOutputText(response.data.decrypted_text);
      setVisualRails(response.data.visual_rails || []);
      toast.success("Text decrypted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Decryption Failed");
    } finally {
      setLoading(false);
    }
  };

  // const handleVisualize = async () => {
  //   if (!inputText.trim()) {
  //     toast.error("Please enter some text to visualize");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const response = await railFenceApi.visualize(
  //       inputText,
  //       rails,
  //       activeTab,
  //     );
  //     setOutputText(response.data.result_text);
  //     setVisualRails(response.data.visual_rails || []);
  //     toast.success("Visualization generated!");
  //   } catch (error) {
  //     toast.error(error.response?.data?.detail || "Visualization failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
    setVisualRails([]);
    toast.success("Cleared all fields");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-400 mb-2">
          Rail Fence Cipher
        </h2>
        <p className="text-gray-400">
          Write letters in a zigzag pattern across multiple rails, then read row
          by row.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {["encrypt", "decrypt"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setOutputText("");
              setVisualRails([]);
            }}
            className={`px-6 py-2 font-medium transition-colors ${
              activeTab === tab
                ? "text-green-400 border-b-2 border-green-400"
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
              Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Rails (2-10): {rails}
            </label>
            <input
              type="range"
              min="2"
              max="10"
              value={rails}
              onChange={(e) => setRails(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>2 rails (simple)</span>
              <span>5 rails (medium)</span>
              <span>10 rails (complex)</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={activeTab === "encrypt" ? handleEncrypt : handleDecrypt}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {activeTab === "encrypt" ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
              {loading
                ? "Processing..."
                : activeTab === "encrypt"
                  ? "Encrypt"
                  : "Decrypt"}
            </button>
            {/* <button */}
            {/*   onClick={handleVisualize} */}
            {/*   disabled={loading} */}
            {/*   className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50" */}
            {/* > */}
            {/*   <Eye className="w-4 h-4" /> */}
            {/*   Visualize */}
            {/* </button> */}
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
                Result
              </label>
              {outputText && (
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
            <textarea
              value={outputText}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none font-mono"
            />
          </div>

          {/* ✅ Use the extracted component */}
          {/* <RailVisualization visualRails={visualRails} /> */}
        </div>
      </div>

      {/* Educational Info */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-green-400 mb-2">
          📖 How Rail Fence Cipher Works
        </h3>
        <p className="text-gray-300 text-sm">
          The Rail Fence cipher writes the message in a zigzag pattern across
          multiple "rails" (rows), then reads it row by row. For example, "HELLO
          WORLD" with 3 rails:
        </p>
        <pre className="mt-3 p-3 bg-gray-900 rounded text-xs font-mono text-gray-300 overflow-x-auto">
          {`H . . . O . . . R . . .
. E . L . W . D . . .
. . L . . . O . . . .`}
        </pre>
        <p className="mt-3 text-gray-300 text-sm">
          Result:{" "}
          <code className="bg-gray-900 px-2 py-1 rounded">HORELWDLO</code>
        </p>
        <div className="mt-3 text-xs text-gray-400">
          💡 The number of rails determines the complexity. More rails = more
          zigzag = stronger encryption (for its time).
        </div>
      </div>
    </div>
  );
};

export default RailFenceCipher;
