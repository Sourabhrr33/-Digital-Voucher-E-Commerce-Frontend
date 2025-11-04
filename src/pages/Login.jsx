import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.warn("Please fill all fields");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { username, password });
      login(data.user, data.token);
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="border p-6 rounded-lg shadow-md bg-white w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="border p-2 rounded focus:outline-blue-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border p-2 rounded focus:outline-blue-400"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* 🔽 Added this section */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 font-medium hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
