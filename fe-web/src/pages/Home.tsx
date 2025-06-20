import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-purple-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-10 transition-all duration-300">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">
          🎬 Upload Your Video with a Prompt
        </h2>
        <p className="text-sm sm:text-lg text-gray-600 mb-6 text-center">
          Use AI to transcribe, find matching quotes, and generate GIFs
          instantly.
        </p>
        <UploadForm />
      </div>
    </div>
  );
}
