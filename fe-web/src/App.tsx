import Header from "./pages/header";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6">
          <Home />
        </main>
      </div>
    </div>
  );
}
