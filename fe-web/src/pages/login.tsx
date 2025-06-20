import { Box } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface LoginProps {
  setIsAuthenticated: (v: boolean) => void;
}

export default function LoginPage({ setIsAuthenticated }: LoginProps) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      const { token, username } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Invalid username or password";
      alert("Login failed: " + errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-100 to-yellow-100">
      <div className="bg-white/40 backdrop-blur-md p-10 rounded-xl shadow-md w-full max-w-md border border-white/30">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white">
            <Box className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">MakeVito</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            className="w-full mt-2 border py-2 rounded-lg"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
