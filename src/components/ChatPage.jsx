import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosConfig';
import { API_URL } from '../utils/constants';
import { FaArrowLeft } from 'react-icons/fa';

const DEMO_USERS = [
  {
    _id: 'demo1',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    headline: 'Frontend Developer',
    about: 'This is a demo user for chat UI.',
    skills: ['React', 'Node.js'],
  },
];

const ChatPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUser = useSelector((state) => state.user.user);
  let connections = useSelector((state) => state.feed.connections) || [];
  if (connections.length === 0) connections = DEMO_USERS;

  // Fetch chat user if userId is present
  useEffect(() => {
    if (userId) {
      // For demo, use demo user if not found
      const found = connections.find(u => u._id === userId);
      if (found) setChatUser(found);
      else setChatUser(DEMO_USERS[0]);
    } else {
      setChatUser(null);
    }
  }, [userId, connections]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: currentUser?._id || 'me',
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      // handle error
    }
  };

  // Filter connections by search
  const filteredConnections = connections.filter(user => {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    return (
      name.includes(search.toLowerCase()) || email.includes(search.toLowerCase())
    );
  });

  // If no userId, show search and user list
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#101624] via-[#1a2233] to-[#2563eb] flex flex-col items-center py-8 px-2 sm:px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-white dark:text-white">Start a Chat</h1>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search your connections..."
          className="w-full max-w-md mb-6 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="w-full max-w-md bg-[#161d2a] rounded-lg shadow-xl p-6">
          {filteredConnections.length === 0 ? (
            <p className="text-lg text-white text-center">No connections found.</p>
          ) : (
            <ul className="space-y-4">
              {filteredConnections.map((user) => (
                <li
                  key={user._id || user.id}
                  className="flex items-center space-x-4 p-3 bg-gray-700 rounded-md shadow-sm cursor-pointer hover:bg-blue-800 transition-colors"
                  onClick={() => setSelectedUser(user)}
                >
                  <img
                    src={user.photoUrl || 'https://via.placeholder.com/150'}
                    alt={user.firstName || user.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white">{user.firstName || user.name}</h3>
                    {user.headline && <p className="text-gray-300">{user.headline}</p>}
                    {user.email && <p className="text-gray-400 text-sm">{user.email}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* User Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80" onClick={() => setSelectedUser(null)}>
            <div className="bg-white dark:bg-[#232b3b] rounded-2xl shadow-2xl p-8 w-full max-w-md relative text-gray-900 dark:text-white mx-2" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-3xl font-bold focus:outline-none"
                onClick={() => setSelectedUser(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center">
                <img
                  src={selectedUser.photoUrl || 'https://via.placeholder.com/150'}
                  alt={selectedUser.firstName || selectedUser.name || 'User'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow mb-4"
                />
                <h2 className="text-2xl font-bold mb-1 text-center">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <p className="text-base text-gray-700 dark:text-gray-200 mb-2 text-center">{selectedUser.email}</p>
                {selectedUser.headline && (
                  <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">{selectedUser.headline}</p>
                )}
                <div className="mb-2 w-full">
                  <h3 className="font-semibold text-lg">About:</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedUser.about || "No information provided."}
                  </p>
                </div>
                {selectedUser.skills && selectedUser.skills.length > 0 && (
                  <div className="mb-2 w-full">
                    <h3 className="font-semibold text-lg">Skills:</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {Array.isArray(selectedUser.skills) ? selectedUser.skills.join(', ') : selectedUser.skills}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => {
                    navigate(`/chat/${selectedUser._id}`);
                    setSelectedUser(null);
                  }}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If userId is present, show chat window
  if (!chatUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#101624]">
        <span className="loading loading-spinner loading-lg text-blue-700 dark:text-white"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#101624] via-[#1a2233] to-[#2563eb] items-center justify-center">
      <div className="flex flex-col max-w-2xl w-full mx-auto bg-[#181f2e] rounded-2xl shadow-2xl overflow-hidden border border-blue-900" style={{minHeight: '70vh'}}>
        {/* Chat Header */}
        <div className="sticky top-0 z-10 bg-[#181f2e] p-4 flex items-center border-b border-blue-900 shadow-sm">
          <button
            className="mr-4 p-2 rounded-full hover:bg-blue-100/10 transition-colors text-white"
            onClick={() => navigate('/chat')}
            title="Back"
          >
            <FaArrowLeft size={20} />
          </button>
          <img
            src={chatUser.photoUrl || 'https://via.placeholder.com/40'}
            alt={chatUser.firstName}
            className="w-10 h-10 rounded-full mr-3 border-2 border-blue-400"
          />
          <div>
            <h2 className="text-white font-semibold text-lg">
              {chatUser.firstName} {chatUser.lastName}
            </h2>
            <p className="text-blue-300 text-xs">Online</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#1a2233]" style={{paddingBottom: '80px'}}>
          {messages.length === 0 && (
            <div className="text-center text-blue-200 opacity-60 mt-10">No messages yet. Say hello!</div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === (currentUser?._id || 'me') ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-md transition-all duration-200 text-base font-medium break-words ${
                  message.sender === (currentUser?._id || 'me')
                    ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-br-none'
                    : 'bg-gray-700 text-white rounded-bl-none'
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs opacity-70 block mt-1 text-right">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#181f2e] border-t border-blue-900 flex items-center" style={{position: 'relative', zIndex: 1}}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-900"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-2 font-semibold shadow"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage; 