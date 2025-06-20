import { Box } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", form);

      if (response.status === 200) {
        alert("✅ Registration successful!");
        setForm({ username: "", password: "" });
        navigate("/login");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Registration failed. Try again.";
      alert("❌ " + msg);
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-100 to-yellow-100 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/50 to-transparent opacity-40 pointer-events-none" />

      <div className="bg-white/40 backdrop-blur-md p-10 rounded-xl shadow-md w-full max-w-md border border-white/30">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white">
            <Box className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">MakeVito</h1>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              type="text"
              placeholder="Choose a username"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition cursor-pointer"
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border border-gray-300 py-2 rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition"
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
}
