import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosConfig';
import { API_URL } from '../utils/constants';

const ChatPage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState(null);
  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchChatUser = async () => {
      try {
        const response = await axiosInstance.get(`${API_URL}/user/${userId}`);
        setChatUser(response.data);
      } catch (error) {
        console.error('Error fetching chat user:', error);
      }
    };

    fetchChatUser();
  }, [userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Here you would typically send the message to your backend
      // For now, we'll just add it to the local state
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: currentUser._id,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!chatUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#101624]">
        <span className="loading loading-spinner loading-lg text-blue-700 dark:text-white"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#101624]">
      {/* Chat Header */}
      <div className="bg-[#161d2a] p-4 flex items-center border-b border-gray-700">
        <img
          src={chatUser.photoUrl || 'https://via.placeholder.com/40'}
          alt={chatUser.firstName}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h2 className="text-white font-semibold">
            {chatUser.firstName} {chatUser.lastName}
          </h2>
          <p className="text-gray-400 text-sm">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === currentUser._id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === currentUser._id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              <p>{message.text}</p>
              <span className="text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[#161d2a] border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage; 