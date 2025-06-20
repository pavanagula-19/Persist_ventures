import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/login";
import Register from "./pages/register";
import Header from "./pages/header";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-100 to-purple-200 font-sans">
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && location.pathname === "/") {
      navigate("/login");
    }
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          ) : (
            <LoginPage setIsAuthenticated={setIsAuthenticated} />
          )
        }
      />
      <Route
        path="/login"
        element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
