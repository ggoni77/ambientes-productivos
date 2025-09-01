from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "https://ggoni77.github.io",
    "http://localhost:5501"
]}})

@app.get("/health")
def health():
    return {"ok": True, "status": "healthy"}

@app.post("/process")
def process():
    payload = request.get_json(silent=True) or {}
    return {"ok": True, "echo": payload}
