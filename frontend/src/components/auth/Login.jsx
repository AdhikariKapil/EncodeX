import { useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Lock,
  Shield,
  CheckCircle,
  XCircle,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { authApi } from "../../services/api";

const Login = () => {
  const [activeTab, setActiveTab] = useState("register"); // 'register' or 'login'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showHashes, setShowHashes] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await authApi.register(username, password, algorithm);
      setResult({
        type: "success",
        message: response.data.message,
        hashed: response.data.hashed_password,
        algorithm: response.data.algorithm,
      });
      toast.success("Registration successful!");
    } catch (error) {
      const detail = error.response?.data?.detail || "Registration failed";
      setResult({ type: "error", message: detail });
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await authApi.login(username, password);
      setResult({
        type: "success",
        message: response.data.message,
      });
      toast.success("Login successful!");
    } catch (error) {
      const detail = error.response?.data?.detail || "Login failed";
      setResult({ type: "error", message: detail });
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleShowUsers = async () => {
    try {
      const response = await authApi.getUsers();
      setUsers(response.data);
      setShowUsers(true);
      toast.success(`Found ${response.data.length} users`);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const toggleHashVisibility = (userId) => {
    setShowHashes((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">
          🔐 Login System
        </h2>
        <p className="text-gray-400">
          Register with MD5 or SHA‑256 password hashing
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          {["register", "login"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setResult(null);
                setUsername("");
                setPassword("");
              }}
              className={`px-6 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                placeholder="Enter password"
              />
            </div>
          </div>

          {activeTab === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Hashing Algorithm
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                >
                  <option value="md5">MD5</option>
                  <option value="sha256">SHA-256</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            onClick={activeTab === "register" ? handleRegister : handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : activeTab === "register"
                ? "Register"
                : "Login"}
          </button>
        </form>

        {/* Result Display */}
        {result && (
          <div
            className={`mt-4 p-3 rounded-lg border ${
              result.type === "success"
                ? "bg-green-900/20 border-green-700 text-green-300"
                : "bg-red-900/20 border-red-700 text-red-300"
            }`}
          >
            <div className="flex items-start gap-2">
              {result.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium">{result.message}</p>
                {result.hashed && (
                  <div className="mt-2 bg-gray-900 p-2 rounded text-xs font-mono text-gray-400 overflow-x-auto">
                    <div>Hash: {result.hashed}</div>
                    <div>Algorithm: {result.algorithm}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Show Users Button */}
        <button
          onClick={handleShowUsers}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Users className="w-4 h-4" />
          Show All Registered Users
        </button>

        {/* Users List */}
        {showUsers && (
          <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Registered Users
            </h4>
            {users.length === 0 ? (
              <p className="text-xs text-gray-500">No users registered yet.</p>
            ) : (
              <ul className="space-y-2">
                {users.map((user) => (
                  <li key={user.id} className="border-b border-gray-800 pb-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-gray-300">{user.username}</span>
                      <span className="text-yellow-400">{user.algorithm}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500 text-xs">Hash:</span>
                      <span className="text-gray-400 text-xs font-mono truncate max-w-[200px]">
                        {showHashes[user.id]
                          ? user.password_hash
                          : user.password_hash.slice(0, 16) + "…"}
                      </span>
                      <button
                        onClick={() => toggleHashVisibility(user.id)}
                        className="text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showHashes[user.id] ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-sm font-semibold text-yellow-400 mb-2">
          📖 Educational Purpose
        </h3>
        <p className="text-xs text-gray-400">
          This demo stores passwords using MD5 or SHA‑256 hashes. In production,
          always use a strong, salted hashing algorithm like bcrypt or Argon2.
        </p>
      </div>
    </div>
  );
};

export default Login;
