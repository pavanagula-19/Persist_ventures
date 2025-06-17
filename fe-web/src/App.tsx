import { UploadCloud } from "lucide-react";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <UploadCloud className="text-blue-500" /> Video to GIF Generator
        </h1>
      </header>
      <main className="p-6">
        <Home />
      </main>
    </div>
  );
}
