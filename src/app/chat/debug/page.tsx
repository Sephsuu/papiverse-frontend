"use client"

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function SocketTestPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const SOCKET_URL = `${API_URL}messaging`;
    
    addLog(`Attempting to connect to: ${SOCKET_URL}`);

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      addLog(`Connected with socket ID: ${newSocket.id}`);
      setIsConnected(true);
      
      // Test authentication with hardcoded user ID
      const testUserId = 2;
      addLog(`Sending authenticate event with userId: ${testUserId}`);
      newSocket.emit('authenticate', { userId: testUserId });
    });

    newSocket.on('disconnect', () => {
      addLog('Disconnected from server');
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    newSocket.on('authenticated', (data) => {
      addLog(`Authentication successful: ${JSON.stringify(data)}`);
      setIsAuthenticated(true);
    });

    newSocket.on('error', (error) => {
      addLog(`Socket error: ${JSON.stringify(error)}`);
      setIsAuthenticated(false);
    });

    newSocket.on('connect_error', (error) => {
      addLog(`Connection error: ${error.message}`);
    });

    // Listen for all events for debugging
    newSocket.onAny((eventName, ...args) => {
      addLog(`Received event '${eventName}': ${JSON.stringify(args)}`);
    });

    return () => {
      addLog('Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, []);

  const testSendMessage = () => {
    if (socket && isAuthenticated) {
      addLog('Testing message send...');
      socket.emit('send_message', {
        conversationId: 1,
        content: 'Test message',
        messageType: 'text'
      });
    } else {
      addLog('Cannot send message - not authenticated');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Socket Connection Test</h1>
      
      {/* Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded-md">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Connection:</strong> 
            <span className={`ml-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? '✅ Connected' : '❌ Disconnected'}
            </span>
          </div>
          <div>
            <strong>Authentication:</strong> 
            <span className={`ml-2 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
              {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
            </span>
          </div>
          <div>
            <strong>Socket ID:</strong> 
            <span className="ml-2 font-mono text-xs">
              {socket?.id || 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6">
        <button
          onClick={() => socket?.emit('authenticate', { userId: 2 })}
          disabled={!isConnected}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Test Auth (User ID: 2)
        </button>
        
        <button
          onClick={testSendMessage}
          disabled={!isAuthenticated}
          className="mr-2 px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
        >
          Test Send Message
        </button>

        <button
          onClick={() => setLogs([])}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Clear Logs
        </button>
      </div>

      {/* Logs */}
      <div className="bg-black text-green-400 p-4 rounded-md h-96 overflow-y-auto font-mono text-sm">
        <div className="mb-2 text-white">Connection Logs:</div>
        {logs.map((log, index) => (
          <div key={index} className="mb-1">{log}</div>
        ))}
        {logs.length === 0 && <div className="text-gray-500">No logs yet...</div>}
      </div>

      {/* Environment Info */}
      <div className="mt-4 p-3 bg-yellow-100 rounded-md text-sm">
        <strong>Environment Variables:</strong>
        <div>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</div>
        <div>Computed Socket URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/messaging</div>
      </div>
    </div>
  );
}