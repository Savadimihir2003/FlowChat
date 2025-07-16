import os
import json
from flask_cors import CORS
from datetime import datetime
from flask import Flask, request, jsonify
from langchain_community.chat_models import ChatOllama
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure paths
STORAGE_DIR = os.path.join(os.path.dirname(__file__), 'storage')
CHAT_FILE = os.path.join(STORAGE_DIR, 'chat.json')

# Create storage directory if needed
os.makedirs(STORAGE_DIR, exist_ok=True)

# Initialize Ollama with Gemma2 model
llm = ChatOllama(model="gemma2:2b")
memory = ConversationBufferMemory()
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True
)

def save_chat_to_json(user_message, bot_message):
    """Save conversation to JSON file"""
    timestamp = datetime.now().isoformat()
    entry = {
        "timestamp": timestamp,
        "user": user_message,
        "bot": bot_message
    }
    
    # Read existing data
    data = []
    if os.path.exists(CHAT_FILE):
        try:
            with open(CHAT_FILE, 'r') as f:
                data = json.load(f)
        except json.JSONDecodeError:
            data = []
    
    # Append new entry
    data.append(entry)
    
    # Write back to file
    with open(CHAT_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    data = request.get_json()
    user_message = data.get('message')
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    # Get response from conversation chain
    bot_response = conversation.predict(input=user_message)
    
    # Save to JSON file
    save_chat_to_json(user_message, bot_response)
    
    return jsonify({"response": bot_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)