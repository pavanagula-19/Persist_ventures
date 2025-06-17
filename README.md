📼 AI-Powered Video to GIF Generator
Automatically convert YouTube videos or uploaded MP4 files into captioned GIFs using AI transcription + prompt matching.

🧠 Features
Upload MP4 or YouTube video

Enter a prompt (e.g. “funny moments”, “motivational quotes”)

AI-based transcription (via Whisper)

Caption extraction using semantic similarity (SBERT)

Video segment clipping with FFmpeg

GIF generation with caption overlay

Full-stack: Spring Boot + PostgreSQL + React (Vite + TypeScript + TailwindCSS)

🏗️ Project Structure
📦 Backend: Spring Boot + PostgreSQL
Component	Description
Video entity	Stores video file, prompt, status
Caption entity	Transcript lines matched to prompt
Gif entity	Stores final generated GIF paths
Whisper	Transcribes video audio (Python CLI)
SBERT	Matches transcript lines to prompt (Python)
FFmpeg	Clips segments and generates captioned GIFs
/api/videos/*	REST API for upload, transcribe, match, clip, gif

🔌 APIs
Endpoint	Method	Description
/videos/upload	POST	Upload video and prompt
/videos/transcribe/:filename	GET	Transcribe video using Whisper
/videos/match	POST	Match prompt with transcript lines
/videos/clip	POST	Clip matched video segments (MP4)
/videos/generate-gifs	POST	Generate GIFs with captions (FFmpeg)

🗃️ Database: PostgreSQL
Tables:

video: stores prompt and uploaded filename

caption: stores start-end-text + associated video

gif: stores generated gif paths linked to caption

🌐 Frontend: React (Vite + TypeScript + TailwindCSS + Lucide)
Page/Component	Feature
UploadForm.tsx	Prompt + MP4 upload form
Home.tsx	Renders the form and processing flow
api.ts	Axios wrapper for backend API calls

💡 Flow
Upload prompt + MP4

Show matched captions (after Whisper + SBERT)

Preview MP4 clips (after FFmpeg cut)

Generate and preview GIFs

⚙️ Setup Instructions
🖥️ Backend (Spring Boot)
bash
Copy
Edit
cd backend
# PostgreSQL should be running on port 5432
# DB name: gifdb
# Configure username/password in `application.properties`
./mvnw spring-boot:run
Make sure:

python3 and ffmpeg are installed and in PATH

Python dependencies:

bash
Copy
Edit
pip install openai-whisper sentence-transformers
🌍 Frontend (React)
bash
Copy
Edit
cd video-to-gif-frontend
npm install
npm run dev
🧪 Sample Prompt Ideas
"funny quotes"

"sad moments"

"motivational speeches"

"inspirational words"

📝 What You Can Improve
Add YouTube URL support (via ytdl-core or similar)

Store full processing status per video in DB

Add login + user history

Deploy to cloud (Render for backend, Vercel for frontend)


👨‍💻 Author
Built with ❤️ by Pavan Agulla
Stack: Java, Python, React, PostgreSQL, FFmpeg, OpenAI Whisper

