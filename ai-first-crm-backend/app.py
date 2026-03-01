from flask import Flask, jsonify
from flask_cors import CORS
from routes import api

app = Flask(__name__)
CORS(app)

# Health check route (important for Render + sanity checks)
@app.route("/")
def health():
    return jsonify({
        "status": "AI-CRM backend running",
        "service": "ai-first-crm",
        "version": "1.0"
    })

# API routes
app.register_blueprint(api, url_prefix="/api")

# Local development only
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
