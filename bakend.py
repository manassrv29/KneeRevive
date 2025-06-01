from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta
import requests
import os
import tensorflow as tf
import json  # Added for better error handling
import time  # Added for retry backoff in chatbot endpoint
from datetime import datetime, timedelta, timezone


# Constants for retry logic
INITIAL_BACKOFF = 1  # Initial backoff in seconds
MAX_RETRIES = 3      # Maximum number of retry attempts

# Load Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("⚠️ Warning: GEMINI_API_KEY environment variable not set")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Modified to allow all origins for testing

# MongoDB setup
try:
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client["kneeReviveDB"]
    collection = db["kneeData"]
    print("MongoDB connected successfully")
except Exception as e:
    print(f"⚠️ MongoDB Connection Failed: {e}")
    collection = None

# Load TFLite model
try:
    interpreter = tf.lite.Interpreter(model_path="model.tflite")
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    print("Model Loaded Successfully")
    print("Input Details:", input_details)
    print("Output Details:", output_details)
except Exception as e:
    print(f"⚠️ Model Loading Failed: {e}")
    interpreter = None
    input_details, output_details = None, None

CLASS_NAMES = ["normal", "abnormal", "mild", "severe"]

def predict_model(input_data):
    if interpreter is None:
        print("⚠️ Model not loaded, returning default prediction")
        return "normal"
        
    try:
        # Check if input_data shape matches what model expects
        if input_data.shape != (1, 7):  # Assuming model expects 7 features
            print(f"⚠️ Input shape mismatch. Expected (1, 7), got {input_data.shape}")
            # Reshape or pad data if needed
            if len(input_data.shape) == 1:
                input_data = np.reshape(input_data, (1, -1))
            
            # Ensure we have exactly 7 features
            if input_data.shape[1] < 7:
                pad_width = ((0, 0), (0, 7 - input_data.shape[1]))
                input_data = np.pad(input_data, pad_width, 'constant')
            elif input_data.shape[1] > 7:
                input_data = input_data[:, :7]
                
        interpreter.set_tensor(input_details[0]['index'], input_data.astype(np.float32))
        interpreter.invoke()
        output = interpreter.get_tensor(output_details[0]['index'])
        print("Model output:", output)

        predicted_index = int(np.argmax(output))
        
        # Safety check for index out of bounds
        if predicted_index < 0 or predicted_index >= len(CLASS_NAMES):
            print(f"⚠️ Predicted index {predicted_index} out of bounds")
            predicted_index = 0
            
        predicted_class = CLASS_NAMES[predicted_index]
        print("Predicted Index:", predicted_index)
        print("Predicted Class:", predicted_class)

        return predicted_class
    except Exception as e:
        print(f"⚠️ Error in prediction: {e}")
        return "normal"  # Default fallback

@app.route("/")
def home():
    return "Backend is running!"

@app.route("/health", methods=["GET"])
def health():
    status = {
        "status": "OK",
        "mongodb": "connected" if collection is not None else "disconnected",
        "model": "loaded" if interpreter is not None else "not loaded",
        "gemini_api": "configured" if GEMINI_API_KEY else "not configured"
    }
    return jsonify(status)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    try:
        print("Received data:", data)

        required_keys = ['x', 'y', 'z', 'gx', 'gy', 'gz']
        missing_keys = [key for key in required_keys if key not in data]

        if missing_keys:
            return jsonify({"error": f"Missing keys: {missing_keys}"}), 400

        input_data = np.array([
            [
                float(data['x']), float(data['y']), float(data['z']), 
                float(data['gx']), float(data['gy']), float(data['gz']), 
                float(data.get('knee_angle', 0))
            ]
        ], dtype=np.float32)

        print("Input data shape:", input_data.shape)
        print("Input data content:", input_data)

        prediction = predict_model(input_data)
        return jsonify({"prediction_class": prediction})

    except Exception as e:
        print(f"Error in /predict route: {e}")
        return jsonify({"error": str(e)}), 400

@app.route("/record", methods=["POST"])
def record_data():
    if collection is None:
        return jsonify({"error": "MongoDB connection not established"}), 500

    data = request.json
    try:
        if "user_id" not in data:
            return jsonify({"error": "user_id is required"}), 400

        # Ensure timestamp is a datetime object
        if "timestamp" in data and isinstance(data["timestamp"], str):
            try:
                data["timestamp"] = datetime.fromisoformat(data["timestamp"].replace("Z", "+00:00"))
            except ValueError:
                data["timestamp"] = datetime.utcnow()
        else:
            data["timestamp"] = datetime.utcnow()
            
        input_data = np.array([[
            float(data['x']), float(data['y']), float(data['z']), 
            float(data['gx']), float(data['gy']), float(data['gz']), 
            float(data.get('knee_angle', 0))
        ]])
        
        prediction = predict_model(input_data)
        data["prediction"] = prediction
        collection.insert_one(data)
        return jsonify({"status": "saved", "prediction_class": prediction})
    except Exception as e:
        print(f"Error in /record route: {e}")
        return jsonify({"error": str(e)}), 400

@app.route("/history", methods=["GET"])
def get_history():
    if collection is None:
        return jsonify({"error": "MongoDB connection not established"}), 500

    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    try:
        three_days_ago = datetime.utcnow() - timedelta(days=3)
        cursor = collection.find({
            "user_id": user_id,
            "timestamp": {"$gte": three_days_ago}
        })
        
        # Convert MongoDB documents to list of dicts and handle ObjectId
        data = []
        for doc in cursor:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
            data.append(doc)
            
        # Make datetime objects JSON serializable
        for item in data:
            if "timestamp" in item and isinstance(item["timestamp"], datetime):
                item["timestamp"] = item["timestamp"].isoformat()
                
        return jsonify(data)
    except Exception as e:
        print(f"Error in /history route: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/assessment", methods=["GET"])
def assessment():
    if collection is None:
        return jsonify({"error": "MongoDB connection not established"}), 500

    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    try:
        three_days_ago = datetime.utcnow() - timedelta(days=3)
        records = list(collection.find({"user_id": user_id, "timestamp": {"$gte": three_days_ago}}))

        if not records:
            return jsonify({"message": "No data found"}), 404

        total = len(records)
        abnormal = sum(1 for r in records if str(r.get("prediction", "")).lower() != "normal")
        
        # Handle potential missing or non-numeric values in acceleration
        accelerations = []
        for r in records:
            try:
                x = float(r.get("x", 0))
                y = float(r.get("y", 0))
                z = float(r.get("z", 0))
                accelerations.append((x**2 + y**2 + z**2)**0.5)
            except (ValueError, TypeError):
                pass
                
        avg_accel_mag = np.mean(accelerations) if accelerations else 0

        return jsonify({
            "total_readings": total,
            "abnormal_percentage": round((abnormal / total) * 100, 2) if total > 0 else 0,
            "average_acceleration_magnitude": round(avg_accel_mag, 3)
        })
    except Exception as e:
        print(f"Error in /assessment route: {e}")
        return jsonify({"error": str(e)}), 500



@app.route("/chatbot", methods=["POST"])
def chatbot_response():
    if not GEMINI_API_KEY:
        return jsonify({"error": "Gemini API key not configured"}), 500

    if collection is None:
        return jsonify({"error": "MongoDB connection not established"}), 500

    data = request.json
    if not data:
        return jsonify({"error": "No data provided in request"}), 400

    user_id = data.get("user_id")
    user_message = data.get("message")

    if not user_id or not user_message:
        return jsonify({"error": "user_id and message are required"}), 400

    try:
        # Fetch all records for the user
        records = list(collection.find({"user_id": user_id}).sort("timestamp", -1))

        total = len(records)
        abnormal_count = sum(1 for r in records if str(r.get("prediction", "")).lower() != "normal")
        abnormal_percentage = (abnormal_count / total) * 100 if total > 0 else 0
        recent_status = [r.get("prediction", "unknown") for r in records[:3]]

        # Construct a more detailed and informative prompt
        prompt = (
        f"You are Nova, a warm, friendly, and knowledgeable knee health assistant helping user '{user_id}'.\n\n"
        f"Data summary for user '{user_id}':\n"
        f"- Total records: {total}\n"
        f"- Abnormal movements: {abnormal_count} ({abnormal_percentage:.1f}%)\n"
        f"- Recent status: {', '.join(recent_status)}\n\n"
        f"User says: '{user_message}'\n"
        "Respond in a warm, empathetic, and informative manner. You can provide advice on exercises, stretches, common knee conditions, recovery tips, general knee health, "
        "and motivational support. Be detailed, informative, and approachable. If the user asks about a specific knee condition or exercise, provide a clear explanation, like a well-informed friend."
        )

        # Send the prompt to Gemini API
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={GEMINI_API_KEY}",
            json={
                "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.8,
                    "maxOutputTokens": 350,
                    "topP": 0.85,
                    "topK": 50
                }
            },
            headers={"Content-Type": "application/json"}
        )

        # Handle the response
        if response.status_code != 200:
            print(f"Error: {response.status_code}, {response.text}")
            fallback_response = generate_fallback_response(user_message, records)
            return jsonify({"response": fallback_response})

        reply_data = response.json()
        if "candidates" in reply_data and reply_data["candidates"]:
            candidate = reply_data["candidates"][0]
            reply = candidate.get("content", {}).get("parts", [{}])[0].get("text", "")
            return jsonify({"response": reply})

    except Exception as e:
        print(f"Error in /chatbot route: {e}")
        return jsonify({"error": str(e)}), 500

    # Fallback response
    fallback_response = generate_fallback_response(user_message, records)
    return jsonify({"response": fallback_response})


def generate_fallback_response(user_message, records):
    total = len(records)
    if total == 0:
        return "I couldn't find any data on your knee health. You can ask me anything about knee exercises, common knee issues, or how to maintain knee health."

    abnormal_count = sum(1 for r in records if str(r.get("prediction", "")).lower() != "normal")
    abnormal_percentage = (abnormal_count / total) * 100 if total > 0 else 0

    if abnormal_percentage > 30:
        return f"I've noticed that {abnormal_percentage:.1f}% of your movements were classified as abnormal. Let me know how you're feeling or if you'd like some tips on exercises, stretches, or common knee issues."
    else:
        return "Your recent data seems mostly normal. Keep up the good work! If you need suggestions on exercises or have any knee-related questions, I'm here to help."


if __name__ == "__main__":
    app.run(debug=True)
