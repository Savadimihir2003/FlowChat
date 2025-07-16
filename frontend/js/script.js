// DOM Elements
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const loadingIndicator = document.getElementById('loading');
const sidebar = document.getElementById('sidebar');
const chatHistory = document.getElementById('chatHistory');
const newChatBtn = document.getElementById('newChatBtn');

// Chat session management
let currentChatId = generateChatId();
let chats = {};

// Initialize chat
function initChat() {
    loadChatHistory();
    // Only start a new chat if there are no chats in storage
    if (Object.keys(chats).length === 0) {
        startNewChat();
    } else {
        // Load the most recent chat
        const lastChatId = Object.keys(chats).sort((a, b) => new Date(chats[b].lastActive) - new Date(chats[a].lastActive))[0];
        if (lastChatId) {
            loadChat(lastChatId);
        }
    }
}

// Generate unique chat ID
function generateChatId() {
    return 'chat-' + Date.now();
}

// Start a new chat session
function startNewChat() {
    currentChatId = generateChatId();
    chats[currentChatId] = {
        messages: [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
    };
    messagesContainer.innerHTML = '';
    addMessage("Hello! I'm FlowChat, your AI assistant. How can I help you today?", false);
    saveChatsToStorage();
    updateChatHistoryUI();
}

// Load chat history from localStorage
function loadChatHistory() {
    const savedChats = localStorage.getItem('chatSessions');
    if (savedChats) {
        chats = JSON.parse(savedChats);
        updateChatHistoryUI();
    }
}

// Save chats to localStorage
function saveChatsToStorage() {
    localStorage.setItem('chatSessions', JSON.stringify(chats));
}

// Update chat history sidebar
function updateChatHistoryUI() {
    chatHistory.innerHTML = '';

    Object.entries(chats).forEach(([chatId, chatData]) => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        if (chatId === currentChatId) {
            chatItem.classList.add('active');
        }

        // Get first user message or default text
        const firstUserMessage = chatData.messages.find(m => m.isUser)?.text || "New Chat";
        const date = new Date(chatData.createdAt);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Main chat label
        const chatLabel = document.createElement('span');
        chatLabel.textContent = `${timeString} - ${firstUserMessage.substring(0, 30)}${firstUserMessage.length > 30 ? '...' : ''}`;
        chatItem.appendChild(chatLabel);

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'chat-action-btn copy-btn';
        copyBtn.title = 'Copy chat';
        copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M10 1.5A1.5 1.5 0 0 1 11.5 3v1H13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.5H4A1.5 1.5 0 0 1 2.5 10V3A1.5 1.5 0 0 1 4 1.5h6zm1.5 1.5A.5.5 0 0 0 11 2H4a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h.5V5a2 2 0 0 1 2-2h5V3z"/></svg>`;
        copyBtn.onclick = function(e) {
            e.stopPropagation();
            const chatText = chatData.messages.map(m => m.text).join('\n');
            navigator.clipboard.writeText(chatText).then(() => {
                copyBtn.classList.add('copied');
                setTimeout(() => copyBtn.classList.remove('copied'), 1000);
            });
        };
        chatItem.appendChild(copyBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'chat-action-btn delete-btn';
        deleteBtn.title = 'Delete chat';
        deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>`;
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            if (confirm('Delete this chat?')) {
                delete chats[chatId];
                saveChatsToStorage();
                updateChatHistoryUI();
                // Optionally, load another chat or clear main area
            }
        };
        chatItem.appendChild(deleteBtn);

        chatItem.setAttribute('data-chat-id', chatId);
        chatItem.addEventListener('click', () => {
            loadChat(chatId);
        });

        chatHistory.appendChild(chatItem);
    });
}

// Load a specific chat
function loadChat(chatId) {
    currentChatId = chatId;
    chats[chatId].lastActive = new Date().toISOString();
    saveChatsToStorage();
    
    messagesContainer.innerHTML = '';
    chats[chatId].messages.forEach(msg => {
        addMessage(msg.text, msg.isUser, false);
    });
    
    scrollToBottom();
    updateChatHistoryUI();
}

// Format timestamp
function getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Add a message to the chat
function addMessage(text, isUser = false, saveToHistory = true) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    const contentDiv = document.createElement('div');
    contentDiv.textContent = text;
    
    if (!isUser) {
        contentDiv.classList.add('bot-typing');
    }
    
    const timestampDiv = document.createElement('div');
    timestampDiv.classList.add('timestamp');
    timestampDiv.textContent = getTimestamp();
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timestampDiv);
    messagesContainer.appendChild(messageDiv);
    
    if (saveToHistory) {
        chats[currentChatId].messages.push({
            text,
            isUser,
            timestamp: new Date().toISOString()
        });
        chats[currentChatId].lastActive = new Date().toISOString();
        saveChatsToStorage();
        updateChatHistoryUI();
    }
    
    scrollToBottom();
}

// Scroll to the bottom of the messages
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Clear the current chat
function clearCurrentChat() {
    if (confirm('Are you sure you want to clear this chat?')) {
        messagesContainer.innerHTML = '';
        chats[currentChatId].messages = [];
        saveChatsToStorage();
        addMessage("Hello! I'm FlowChat, your AI assistant. How can I help you today?", false);
    }
}

// Get AI response from backend
async function getAIResponse(userMessage) {
    loadingIndicator.style.display = 'flex';
    
    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        return "I'm sorry, I encountered an error processing your request. Please try again.";
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Handle sending a message
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    addMessage(message, true);
    userInput.value = '';
    userInput.focus();
    
    const response = await getAIResponse(message);
    addMessage(response, false);
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

clearBtn.addEventListener('click', clearCurrentChat);

newChatBtn.addEventListener('click', startNewChat);

// Initialize chat
window.addEventListener('DOMContentLoaded', initChat);