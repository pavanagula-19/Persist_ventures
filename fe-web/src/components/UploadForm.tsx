import { useState } from "react";
import {
  Upload,
  MessageSquareText,
  Scissors,
  Loader2,
  ImagePlus,
} from "lucide-react";
import api from "../api";

export default function UploadForm() {
  const [video, setVideo] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [matchedCaptions, setMatchedCaptions] = useState<
    { start: number; end: number; text: string }[]
  >([]);
  const [filename, setFilename] = useState<string | null>(null);
  const [clipPaths, setClipPaths] = useState<string[]>([]);
  const [gifPaths, setGifPaths] = useState<string[]>([]);

  const handleGenerateGifs = async () => {
    if (clipPaths.length === 0 || matchedCaptions.length === 0) {
      setMessage("⚠️ No clips or captions to process.");
      return;
    }

    setMessage("🖼️ Generating GIFs...");
    setLoading(true);

    try {
      const response = await api.post("/videos/generate-gifs", {
        clips: clipPaths.map((path) => path.split("/").pop()),
        captions: matchedCaptions.map((caption) => caption.text),
      });

      setGifPaths(response.data.gifs);
      setMessage("✅ GIFs created!");
    } catch (error) {
      console.error("GIF generation error:", error);
      setMessage("❌ GIF generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !prompt) return;

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("video", video);

    try {
      setLoading(true);
      setMessage("");
      setMatchedCaptions([]);
      setClipPaths([]);
      setGifPaths([]);

      const uploadRes = await api.post("/videos/upload", formData);
      const uploadedFilename = uploadRes.data.filename;
      setFilename(uploadedFilename);
      setMessage("✅ Uploaded. Transcribing...");

      const transcriptRes = await api.get(
        `/videos/transcribe/${uploadedFilename}`
      );
      const transcript = transcriptRes.data;

      setMessage("🔍 Matching captions...");

      const matchRes = await api.post("/videos/match", { prompt, transcript });
      setMatchedCaptions(matchRes.data);
      setMessage("✅ Captions matched!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleClip = async () => {
    if (!filename || matchedCaptions.length === 0) return;
    setMessage("✂️ Clipping video segments...");

    try {
      setLoading(true);
      const clipRes = await api.post("/videos/clip", {
        filename,
        segments: matchedCaptions.map(({ start, end }) => ({ start, end })),
      });
      setClipPaths(clipRes.data.clips);
      setMessage("✅ Clips generated!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Clipping failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <form
        className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-3">
          <MessageSquareText className="text-blue-500" />
          <input
            type="text"
            placeholder="Enter prompt (e.g. inspirational quotes)"
            className="border border-gray-300 px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <Upload className="text-green-500" />
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
            required
            className="text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 text-white px-6 py-2 rounded transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {loading ? "Processing..." : "Upload & Generate"}
        </button>
      </form>

      {message && (
        <div
          className={`text-sm px-4 py-2 rounded-md shadow-sm ${message.includes("❌") ? "text-red-600 bg-red-100" : "text-green-700 bg-green-100"}`}
        >
          {message}
        </div>
      )}

      {matchedCaptions.length > 0 && (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">🎯 Matched Captions</h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-1 text-sm">
            {matchedCaptions.map((cap, idx) => (
              <li key={idx}>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {cap.start.toFixed(2)}s – {cap.end.toFixed(2)}s
                </code>{" "}
                - {cap.text}
              </li>
            ))}
          </ul>

          <button
            onClick={handleClip}
            disabled={loading}
            className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded transition flex items-center gap-2"
          >
            <Scissors className="w-4 h-4" /> Clip Segments
          </button>
        </div>
      )}

      {clipPaths.length > 0 && (
        <div className="bg-white shadow-md p-6 rounded-lg space-y-4">
          <h3 className="text-xl font-semibold mb-4">🎬 Clipped Segments</h3>
          {clipPaths.map((path, idx) => (
            <video
              key={idx}
              controls
              className="w-full rounded shadow border"
              src={`http://localhost:8080/${path}`}
            />
          ))}
          <button
            onClick={handleGenerateGifs}
            disabled={loading}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2 transition"
          >
            <ImagePlus className="w-4 h-4" /> Generate GIFs
          </button>
        </div>
      )}

      {gifPaths.length > 0 && (
        <div className="bg-white shadow-md p-6 rounded-lg mt-6">
          <h3 className="text-xl font-semibold mb-4">🖼️ Final GIFs</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {gifPaths.map((gif, idx) => (
              <div
                key={idx}
                className="space-y-3 bg-gray-50 p-4 rounded-lg shadow"
              >
                <img
                  src={`http://localhost:8080/${gif}`}
                  alt={`GIF ${idx + 1}`}
                  className="rounded border border-gray-300"
                />
                <a
                  href={`http://localhost:8080/${gif}`}
                  download={`captioned-${idx + 1}.gif`}
                  className="inline-block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                  ⬇️ Download GIF {idx + 1}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
