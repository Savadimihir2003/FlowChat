# FlowChat

A modern, full-stack AI chatbot web application with a beautiful UI and persistent chat history.

## Features
- Chat with an AI assistant in real time
- Persistent chat history (stored in JSON)
- Copy and delete chat sessions
- Responsive, premium UI (HTML, CSS, JS)
- Python backend (Flask)
- **Ollama integration for local LLM inference**

## Project Structure
```
FlowChat/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── storage/
│       └── chat.json
└── frontend/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

## Getting Started

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. (Optional but recommended) Create a virtual environment:
   ```sh
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # or
   source venv/bin/activate  # On macOS/Linux
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```sh
   python app.py
   ```
   The backend will run on `http://127.0.0.1:5000/` by default.

### 2. Ollama Setup (for Local LLM)

FlowChat can use [Ollama](https://ollama.com/) to run large language models (LLMs) locally on your machine.

1. **Install Ollama:**
   - Download and install Ollama from [https://ollama.com/download](https://ollama.com/download) for your OS.
2. **Start Ollama:**
   - Run `ollama serve` in your terminal to start the Ollama server.
3. **Pull a Model:**
   - For example, to use Llama 3(or any model based on your hardware requirements):
     ```sh
     ollama pull [model_name]
     ```
4. **Configure the Backend:**
   - By default, `app.py` connects to Ollama at `http://localhost:11434`.
   - You can change the model name or endpoint in `app.py` if needed.

### 3. Frontend Setup

1. Open `frontend/index.html` in your browser (Chrome, Edge, etc.).
2. The app will connect to the backend at `http://127.0.0.1:5000/`.

> **Note:** Make sure both the backend and Ollama are running before using the frontend.

## Usage
- Start a new chat, send messages, and interact with the AI (powered by Ollama LLM).
- Use the sidebar to view, copy, or delete previous chat sessions.
- All chat data is stored in `backend/storage/chat.json`.

## Customization
- Update `frontend/css/style.css` for UI changes.
- Update `backend/app.py` for backend logic, Ollama integration, or AI model selection.

## Troubleshooting
- If you see CORS errors, ensure the backend is running and accessible.
- If you get errors related to Ollama, make sure the Ollama server is running and the model is pulled.
- For any issues, restart both the backend and refresh the frontend.

<img width="1920" height="1080" alt="Screenshot (30)" src="https://github.com/user-attachments/assets/a5c9593d-6c41-4715-bb1e-20aeb04613d6" />
<img width="1920" height="1080" alt="Screenshot (29)" src="https://github.com/user-attachments/assets/0211671c-f5fe-4787-84d2-24b3378a5944" />
<img width="1920" height="1080" alt="Screenshot (28)" src="https://github.com/user-attachments/assets/2feafdb3-5126-4a86-b1b0-d6be137a201e" />
