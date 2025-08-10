// components/Chat.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContexts';

export default function Chat() {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (data) => {
      setMessages(prev => [...prev, data]);
    });

    socket.on('userJoined', (data) => {
      console.log(data.message);
    });

    socket.on('userLeft', (data) => {
      console.log(data.message);
    });

    return () => {
      socket.off('newMessage');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket]);

  const joinRoom = () => {
    if (socket && username && room) {
      socket.emit('joinRoom', { room, username });
      setHasJoined(true);
    }
  };

  const sendMessage = () => {
    if (socket && messageInput.trim() && hasJoined) {
      socket.emit('sendMessage', {
        room,
        message: messageInput,
        username,
      });
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!hasJoined) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Join Chat</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={joinRoom}
          // disabled={!isConnected || !username || !room}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
        >
          Join Room
        </button>
        <p className="mt-2 text-sm">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Room: {room}</h2>
        <p className="text-sm text-gray-600">Welcome, {username}!</p>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold text-blue-600">{msg.username}: </span>
            <span>{msg.message}</span>
            <span className="text-xs text-gray-500 ml-2">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-l"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}