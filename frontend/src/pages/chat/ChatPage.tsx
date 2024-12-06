import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from "../../components/navbar/navbar";
import RobotIcon from "../../assets/robot.svg"
import ReactMarkdown from "react-markdown";

// Message interface for type safety
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Custom SVG Component for icons
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-blue-500">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
  </svg>
);

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initial AI welcome message
  useEffect(() => {
    const initialTutorMessage: Message = {
      id: `ai-${Date.now()}`,
      content: "Hola! Soy tu profesor de español. ¿Qué te gustaría aprender hoy? (Hi! I'm your Spanish teacher. What would you like to learn today?)",
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages([initialTutorMessage]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message to the backend
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    // Clear input and set loading state
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to FastAPI backend
      const response = await axios.post('http://localhost:8000/chat', {
        message: inputMessage
      });

      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: response.data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      // Add AI message 
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Error handling message
      const errorMessage: Message = {
        id: `ai-${Date.now()}`,
        content: "Lo siento, hubo un error. (Sorry, there was an error.)",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-row h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-100 flex justify-center items-center">
        <div className="w-full max-w-3xl h-[95vh] bg-white shadow-lg flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-green-300 flex items-center justify-center">
            <h2 className="ml-2 text-xl font-semibold text-black">Profesor de Español</h2>
          </div>

          {/* Chat Messages Container */}
          <div
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-4 space-y-4"
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                Start a conversation by typing a message
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-start' : 'justify-end'
                    }`}
                >
                  <article
                    className={`
                      max-w-[70%] p-3 rounded-lg prose 
                      ${msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-300 text-gray-800'
                      }
                    `}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </article>
                  {msg.sender === 'ai' && <img src={RobotIcon} className='w-7' alt="AI Icon" />}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-end items-start space-x-2">
                <div className="bg-green-300 text-gray-800 p-3 rounded-lg max-w-[70%]">
                  Escribiendo... (Typing...)
                </div>
                <img src={RobotIcon} className='w-7' alt="AI Icon" />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje... (Type a message...)"
              className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === '' || isLoading}
              className="
                bg-green-700 text-white p-2 rounded-r-lg 
                hover:bg-green-900 transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center
              "
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;