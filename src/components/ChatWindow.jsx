import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

const ChatWindow = () => {
  const { socket } = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('general'); 
  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', room);

      const handleReceiveMessage = (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      };

      socket.on('receiveMessage', handleReceiveMessage);

      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [socket, room]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socket && message.trim()) {
      const messageData = {
        room,
        author: socket.id, // In a real app, this would be the user's name/ID
        message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('sendMessage', messageData);
      setMessage('');
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Chat Room: {room}</h2>
        <div className="flex items-center">
          <label htmlFor="room-select" className="mr-2 text-gray-700">Join Room:</label>
          <select
            id="room-select"
            value={room}
            onChange={handleRoomChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General</option>
            <option value="tech">Tech</option>
            <option value="random">Random</option>
          </select>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 bg-white rounded-md mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold text-blue-600">{msg.author}: </span>
            <span className="text-gray-900">{msg.message}</span>
            <span className="text-gray-500 text-xs ml-2">{msg.time}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Type your message..."
          className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-r-md transition duration-200"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
