import { UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between sm:px-6">
      <div className="flex items-center gap-2">
        <UploadCloud className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" />
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-purple-700 whitespace-nowrap">
          AI GIF Dashboard
        </h1>
      </div>

      <button
        onClick={handleLogout}
        className="text-xs sm:text-sm md:text-base bg-red-500 hover:bg-red-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg transition"
      >
        Logout
      </button>
    </header>
  );
}
