import React, { useState, useEffect, useRef } from "react";
import "./BotKnee.css";

// Backend API URL - can be moved to environment variables for different environments
const API_URL = "http://localhost:5000";

const BotKnee = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true); // Track backend connection status
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Example suggestions for empty state
  const suggestions = [
    "What exercises help with knee pain?",
    "How long should I rest after injury?",
    "Track my recovery progress",
    "Schedule a therapy session"
  ];

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Check if backend is available
    checkBackendConnection();
  }, []);

  // Check if the backend server is running
  const checkBackendConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_URL}/chatbot`, {
        method: "OPTIONS",
        signal: controller.signal
      }).catch(() => null);
      
      clearTimeout(timeoutId);
      setIsConnected(response && response.ok);
    } catch (error) {
      console.error("Backend connection check failed:", error);
      setIsConnected(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const appendMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender, timestamp: new Date() }]);
  };

  const handleSuggestion = (text) => {
    setInput(text);
    inputRef.current.focus();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    appendMessage(userMessage, "user");
    setInput("");
    setIsTyping(true);

    // If backend is disconnected, show error message
    if (!isConnected) {
      setTimeout(() => {
        setIsTyping(false);
        appendMessage("Sorry, I'm unable to connect to the server. Please check if the backend is running on port 5000.", "bot");
      }, 1000);
      return;
    }

    try {
      // Set a timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      // Send the message to the backend
      const response = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          user_id: "user123", // This could be dynamically set or stored in state
          message: userMessage,
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setIsTyping(false);

      if (data && data.response) {
        appendMessage(data.response, "bot");
      } else {
        appendMessage("I received your message but couldn't generate a proper response. Please try again.", "bot");
      }
    } catch (error) {
      setIsTyping(false);
      console.error("Error sending message to backend:", error);
      
      if (error.name === 'AbortError') {
        appendMessage("Request timed out. The server took too long to respond.", "bot");
      } else if (error.message.includes('Failed to fetch')) {
        appendMessage("I'm having trouble connecting to the server. Please check if the backend is running.", "bot");
        setIsConnected(false);
      } else {
        appendMessage("Something went wrong while processing your request. Please try again later.", "bot");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Group messages by sender for better visual styling
  const groupedMessages = () => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((msg, index) => {
      // Start a new group if this is the first message or sender changed
      if (!currentGroup || currentGroup.sender !== msg.sender) {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = { sender: msg.sender, messages: [msg] };
      } else {
        // Add to existing group if same sender
        currentGroup.messages.push(msg);
      }
      
      // Push the last group
      if (index === messages.length - 1) {
        groups.push(currentGroup);
      }
    });

    return groups;
  };

  // Render connection status
  const renderConnectionStatus = () => {
    return (
      <div className="header-status">
        <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
        <span>{isConnected ? 'Online' : 'Offline'}</span>
      </div>
    );
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-title">
        <h1>BotKnee Virtual Assistant</h1>
        <p>Get personalized help with your knee rehabilitation journey</p>
      </div>
      
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
              <line x1="16" y1="8" x2="2" y2="22"></line>
              <line x1="17.5" y1="15" x2="9" y2="15"></line>
            </svg>
            <span>BotKnee Assistant</span>
          </div>
          {renderConnectionStatus()}
        </div>
        
        <div className="chat-box">
          {messages.length === 0 ? (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <h3>Welcome to KneeRevive</h3>
              <p>Ask me anything about your knee rehabilitation or recovery process!</p>
              <div className="suggestions">
                {suggestions.map((text, idx) => (
                  <div 
                    key={idx} 
                    className="suggestion-chip"
                    onClick={() => handleSuggestion(text)}
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-container">
              {groupedMessages().map((group, groupIdx) => (
                <div key={groupIdx} className={`message-group ${group.sender}-group`}>
                  <div className="message-sender">
                    {group.sender === "user" ? "You" : "KneeRevive Assistant"}
                  </div>
                  {group.messages.map((msg, msgIdx) => (
                    <div key={`${groupIdx}-${msgIdx}`} className={`message ${msg.sender}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
              ))}
              {isTyping && (
                <div className="message-group bot-group">
                  <div className="message-sender">KneeRevive Assistant</div>
                  <div className="message bot-typing">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="chat-input">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!isConnected && messages.length > 0}
            />
            <button 
              onClick={sendMessage} 
              disabled={!isConnected && messages.length > 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Send
            </button>
          </div>
          {!isConnected && messages.length > 0 && (
            <div className="connection-error">
              Backend server is offline. <button onClick={checkBackendConnection}>Retry connection</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotKnee;