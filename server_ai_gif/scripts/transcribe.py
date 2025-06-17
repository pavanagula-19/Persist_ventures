import sys
import whisper
import json
import contextlib

# Get video path from command-line argument
video_path = sys.argv[1]

# Suppress all unwanted stdout/stderr except final JSON
with open('/dev/null', 'w') as devnull, contextlib.redirect_stdout(devnull), contextlib.redirect_stderr(devnull):
    model = whisper.load_model("base")
    result = model.transcribe(video_path)

# Extract transcript
transcript = [
    {
        "start": round(seg["start"], 2),
        "end": round(seg["end"], 2),
        "text": seg["text"]
    }
    for seg in result["segments"]
]

# Only this line prints to stdout — clean JSON
print(json.dumps(transcript))
