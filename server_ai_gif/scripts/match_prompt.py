import sys
import json
from sentence_transformers import SentenceTransformer, util

# Get prompt from argument
prompt = sys.argv[1]

# Read transcript from stdin
transcript_json = sys.stdin.read()
transcript = json.loads(transcript_json)

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Prepare corpus
texts = [seg['text'] for seg in transcript]

# Encode both prompt and transcript
prompt_emb = model.encode(prompt, convert_to_tensor=True)
texts_emb = model.encode(texts, convert_to_tensor=True)

# Compute similarities
cos_scores = util.cos_sim(prompt_emb, texts_emb)[0]

# Sort and pick top 3
top_indices = cos_scores.argsort(descending=True)[:3]
top_segments = [transcript[i] for i in top_indices]

# Output JSON
print(json.dumps(top_segments))
