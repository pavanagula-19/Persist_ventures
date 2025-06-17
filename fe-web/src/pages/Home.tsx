import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10 transition-all duration-300">
        <h2 className="text-4xl font-bold mb-6 text-gray-800 text-center">
          🎬 Upload Your Video with a Prompt
        </h2>
        <p className="text-gray-600 mb-8 text-center text-lg">
          Use AI to transcribe, find matching quotes, and generate GIFs
          instantly.
        </p>
        <UploadForm />
      </div>
    </div>
  );
}
