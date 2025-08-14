// hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/messaging';

interface UseSocketProps {
  userId: number;
  onNewMessage?: (message: Message, conversationId: number) => void;
  onUserTyping?: (userId: number, conversationId: number) => void;
  onUserStoppedTyping?: (userId: number, conversationId: number) => void;
}

export const useSocket = ({ userId, onNewMessage, onUserTyping, onUserStoppedTyping }: UseSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log('useSocket effect running with userId:', userId);
    
    // Don't initialize socket if userId is not available
    if (!userId) {
      console.log('No userId provided, skipping socket initialization');
      return;
    }

    console.log('Initializing socket connection to:', `${process.env.NEXT_PUBLIC_API_URL}`);

    // Initialize socket connection
    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}messaging`, {
      transports: ['websocket'],
      autoConnect: true,
    });

    const socket = socketRef.current;

    // Connection handlers
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      
      // Authenticate user only when userId is available
      if (userId) {
        console.log('Sending authenticate event with userId:', userId);
        socket.emit('authenticate', { userId });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    // Authentication handlers
    socket.on('authenticated', (data) => {
      console.log('User authenticated successfully:', data);
      setIsAuthenticated(true);
    });

    socket.on('error', (error) => {
      console.error('Socket authentication error:', error);
      setIsAuthenticated(false);
    });

    // Message handlers
    socket.on('new_message', (data: { message: Message; conversationId: number }) => {
      console.log('New message received:', data);
      onNewMessage?.(data.message, data.conversationId);
    });

    socket.on('message_sent', (data: { messageId: number }) => {
      console.log('Message sent confirmation:', data);
    });

    // Typing handlers
    socket.on('user_typing_start', (data: { userId: number; conversationId: number }) => {
      onUserTyping?.(data.userId, data.conversationId);
    });

    socket.on('user_typing_stop', (data: { userId: number; conversationId: number }) => {
      onUserStoppedTyping?.(data.userId, data.conversationId);
    });

    // Error handlers
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setIsAuthenticated(false);
    });

    // Cleanup
    return () => {
      console.log('Cleaning up socket connection');
      socket.disconnect();
      setIsConnected(false);
      setIsAuthenticated(false);
    };
  }, [userId, onNewMessage, onUserTyping, onUserStoppedTyping]);

  const joinConversation = (conversationId: number) => {
    if (socketRef.current && isAuthenticated) {
      socketRef.current.emit('join_conversation', { conversationId });
      setCurrentConversationId(conversationId);
    }
  };

  const leaveConversation = (conversationId: number) => {
    if (socketRef.current && isAuthenticated) {
      socketRef.current.emit('leave_conversation', { conversationId });
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    }
  };

  const sendMessage = (conversationId: number, content: string, messageType: string = 'text') => {
    console.log('CLAIMS ID: ', userId);
    
    if (socketRef.current && isAuthenticated) {
      socketRef.current.emit('send_message', {
        conversationId,
        content,
        messageType,
        senderId: userId, // This will be overridden by the server
      });
    }
  };

  const startTyping = (conversationId: number) => {
    if (socketRef.current && isAuthenticated) {
      socketRef.current.emit('typing_start', { conversationId });
    }
  };

  const stopTyping = (conversationId: number) => {
    if (socketRef.current && isAuthenticated) {
      socketRef.current.emit('typing_stop', { conversationId });
    }
  };

  const markMessageAsRead = (messageId: number) => {
    if (socketRef.current && isAuthenticated) {
      socketRef.current.emit('mark_message_read', { messageId });
    }
  };

  return {
    isConnected,
    isAuthenticated,
    currentConversationId,
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    markMessageAsRead,
  };
};