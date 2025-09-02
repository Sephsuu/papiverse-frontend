// MessagesCanvas.tsx - With Read Receipts
"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessagesSkeleton } from "@/components/ui/skeleton";
import { useSocket } from "@/hooks/use-socket";
import { MessagingService } from "@/services/MessagingService";
import { Claim } from "@/types/claims";
import { Conversation, Message } from "@/types/messaging";
import { User } from "@/types/user";
import { Item } from "@radix-ui/react-dropdown-menu";
import { EllipsisIcon, Info, Link, Mic, Send, SmilePlus } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
    claims: Claim;
    selected: Conversation;
}

export function MessagesCanvas({ claims, selected }: Props) {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const readTimeoutRef = useRef<NodeJS.Timeout>(null);

    // Store pending optimistic messages to track them
    const pendingMessagesRef = useRef<Set<string>>(new Set());
    // Track which messages we've already marked as read
    const markedAsReadRef = useRef<Set<number | string>>(new Set());

    // Memoize callback functions to prevent infinite re-renders
    const handleNewMessage = useCallback((message: Message, conversationId: number) => {
        if (selected?.id === conversationId) {
            // Create a key to identify this message
            const messageKey = `${message.senderId}_${message.content}_${conversationId}`;
            
            setMessages(prev => {
                // If this is our own message and we have a pending optimistic message
                if (message.senderId === claims.userId && pendingMessagesRef.current.has(messageKey)) {
                    // Find and replace the optimistic message
                    const optimisticIndex = prev.findIndex(m => 
                        m.senderId === claims.userId && 
                        m.content === message.content && 
                        m.conversationId === conversationId &&
                        (typeof m.id === 'number' && m.id > Date.now() - 10000) // Recent timestamp ID
                    );
                    
                    if (optimisticIndex !== -1) {
                        // Remove from pending and replace the optimistic message
                        pendingMessagesRef.current.delete(messageKey);
                        const newMessages = [...prev];
                        newMessages[optimisticIndex] = message;
                        return newMessages;
                    }
                }
                
                // For other users' messages or if no optimistic message found
                if (message.senderId !== claims.userId) {
                    return [...prev, message];
                }
                
                // If it's our message but no optimistic version found, add it
                return [...prev, message];
            });

            // Mark new messages from others as read after a short delay
            if (message.senderId !== claims.userId && !markedAsReadRef.current.has(message.id!)) {
                if (readTimeoutRef.current) {
                    clearTimeout(readTimeoutRef.current);
                }
                readTimeoutRef.current = setTimeout(() => {
                    markMessageAsRead(Number(message.id));
                    markedAsReadRef.current.add(message.id!);
                }, 1000); // 1 second delay
            }
        }
    }, [selected?.id, claims.userId]);

    const handleUserTyping = useCallback((userId: number, conversationId: number) => {
        if (selected?.id === conversationId && userId !== claims.userId) {
            setTypingUsers(prev => new Set(prev).add(userId));
        }
    }, [selected?.id, claims.userId]);

    const handleUserStoppedTyping = useCallback((userId: number, conversationId: number) => {
        if (selected?.id === conversationId) {
            setTypingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    }, [selected?.id]);

    const {
        isConnected,
        isAuthenticated,
        joinConversation,
        leaveConversation,
        sendMessage,
        startTyping,
        stopTyping,
        markMessageAsRead,
    } = useSocket({
        userId: claims!.userId,
        onNewMessage: handleNewMessage,
        onUserTyping: handleUserTyping,
        onUserStoppedTyping: handleUserStoppedTyping,
    });

    // Mark messages as read when they come into view
    const markVisibleMessagesAsRead = useCallback(() => {
        if (!selected?.id || !isAuthenticated) return;

        const unreadMessages = messages.filter(msg => 
            msg.senderId !== claims.userId && 
            !markedAsReadRef.current.has(msg.id!)
        );

        console.log(messages);
        

        unreadMessages.forEach(message => {
            markMessageAsRead(Number(message.id));
            markedAsReadRef.current.add(message.id!);
        });
    }, [messages, selected?.id, claims.userId, isAuthenticated, markMessageAsRead]);

    // Mark messages as read when conversation becomes active or messages change
    useEffect(() => {
        if (messages.length > 0 && selected?.id && isAuthenticated) {
            // Small delay to ensure user is actually viewing the messages
            const timer = setTimeout(() => {
                markVisibleMessagesAsRead();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [messages, selected?.id, isAuthenticated, markVisibleMessagesAsRead]);

    // Optional: Mark messages as read when user scrolls to bottom
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

        if (isNearBottom) {
            markVisibleMessagesAsRead();
        }
    }, [markVisibleMessagesAsRead]);

    useEffect(() => {
        async function fetchMessages() {
            setLoading(true);
            if (!selected?.id) return;
            
            try {
                const data = await MessagingService.getMessages(selected.id, claims.userId);
                setMessages(data);
                // Reset marked as read for new conversation
                markedAsReadRef.current.clear();
            } catch (error) { 
                toast.error(`${error}`) 
            }
            finally { setLoading(false) }
        }
        
        fetchMessages();
    }, [selected?.id, claims.userId]);

    useEffect(() => {
        if (selected?.id && isAuthenticated) {
            joinConversation(selected.id);
        }
        
        return () => {
            if (selected?.id && isAuthenticated) {
                leaveConversation(selected.id);
            }
            // Clear timeouts on unmount
            if (readTimeoutRef.current) {
                clearTimeout(readTimeoutRef.current);
            }
        };
    }, [selected?.id, isAuthenticated, joinConversation, leaveConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMessageInput(value);
        
        if (!selected || !isAuthenticated) return;

        if (value.trim() && !isTyping) {
            setIsTyping(true);
            startTyping(selected.id);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            if (isTyping) {
                setIsTyping(false);
                stopTyping(selected.id);
            }
        }, 2000);
    };

    const handleSendMessage = useCallback(() => {
        if (!messageInput.trim() || !selected || !isAuthenticated) return;

        const messageContent = messageInput.trim();
        const messageKey = `${claims.userId}_${messageContent}_${selected.id}`;
        
        pendingMessagesRef.current.add(messageKey);

        const optimisticMessage: Message = {
            id: Date.now(), 
            content: messageContent,
            senderId: claims.userId,
            conversationId: selected.id!,
            messageType: 'text',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimisticMessage]);

        sendMessage(selected.id, messageContent);
        
        setMessageInput('');
        if (isTyping) {
            setIsTyping(false);
            stopTyping(selected.id);
        }
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        setTimeout(() => {
            pendingMessagesRef.current.delete(messageKey);
        }, 10000);
    }, [messageInput, selected, isAuthenticated, claims.userId, sendMessage, isTyping, stopTyping]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getTypingIndicator = (conversation: Conversation) => {
        if (!conversation || !conversation.participants) return null;
        if (typingUsers.size === 0) return null;

        const typingUserNames = Array.from(typingUsers)
            .map(userId => {
                const user = conversation.participants.find((p) => p.id === userId);
                return user ? `${user.firstName} ${user.lastName}` : 'Someone';
            });

        if (typingUserNames.length === 1) {
            return `${typingUserNames[0]} is typing...`;
        } else {
            return `${typingUserNames.join(', ')} are typing...`;
        }
    };

    if (loading) return <MessagesSkeleton />
    return(
        <section className="relative flex flex-col col-span-2 border-1 h-[95vh]">
            {selected && (
                <>
                    {/* Header */}
                    <div className="flex px-4 py-2 gap-2 sticky top-0 shadow-sm bg-light">
                        <div className="flex font-semibold justify-center items-center bg-darkbrown text-light w-9 h-9 rounded-full">
                            {"KP"}
                        </div>
                        <div className="my-auto font-semibold text-sm truncate text-[16px]">
                            {selected.name === "none" ? (
                                selected.participants.length > 2 ? (
                                    selected.participants.slice(0, 3).map(p => p.lastName).join(', ')
                                ) : (
                                    selected.participants[0].id !== claims.userId
                                        ? `${selected.participants[0].firstName ?? ''} ${selected.participants[0].lastName ?? ''}`
                                        : `${selected.participants[1].firstName ?? ''} ${selected.participants[1].lastName ?? ''}`
                                )
                            ) : (
                                selected.name
                            )}
                        </div>
                        <div className="ms-auto flex gap-2">
                            <button>
                                <Info className="w-4 h-4" strokeWidth={2} />
                            </button>
                            <button>
                                <EllipsisIcon className="w-4 h-4" strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div 
                        ref={messagesContainerRef}
                        className="flex-col w-full flex-1 bg-white overflow-y-auto pb-8"
                        onScroll={handleScroll}
                    >
                        {messages.map((message, index) => {
                            const isOwnMessage = message.senderId === claims.userId;
                            const prevMessage = index > 0 ? messages[index - 1] : null;

                            const showSenderName = !prevMessage || prevMessage.senderId !== message.senderId;
                            
                            return (
                                <Fragment key={message.id || index}>
                                    {showSenderName && (
                                        <div className={`text-gray text-[10px] -mb-1.5 ${isOwnMessage ? "text-end pr-2" : "pl-2 text-start"}`}>
                                            {selected.participants.find(i => i.id === message.senderId)?.firstName}
                                        </div>
                                    )}
                                <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} my-2`}>
                                    <div 
                                        className={`
                                            w-fit max-w-[60%] text-xs p-2
                                            ${isOwnMessage 
                                            ? 'bg-darkorange text-light mr-2 rounded-t-lg rounded-bl-lg' 
                                            : 'bg-light ml-2 rounded-t-lg rounded-br-lg'
                                            }
                                        `}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                                </Fragment>
                            );
                        })}
                        
                        {/* TYPING INDICATOR */}
                        {getTypingIndicator(selected) && (
                            <div className="w-fit max-w-6/10 text-xs bg-gray-200 p-2 my-2 ml-2 rounded-t-lg rounded-br-lg italic">
                                {getTypingIndicator(selected)}
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="absolute w-full bottom-0 px-4 border-t-1">
                        <div className="flex items-center w-full bg-white">
                            <button className="mx-2">
                                <Link className="w-4 h-4" strokeWidth={2} />
                            </button>
                            <Input
                                value={messageInput}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                className="w-full border-0 focus:!outline-none focus:!ring-0"
                                placeholder="Enter your message here" 
                                disabled={!isAuthenticated}
                            />
                            <div className="flex gap-2">
                                <button>
                                    <SmilePlus className="w-4 h-4" strokeWidth={2} />
                                </button>
                                <button>
                                    <Mic className="w-4 h-4" strokeWidth={2} />
                                </button>
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim() || !isAuthenticated}
                                    size="sm"
                                    className="bg-blue rounded-full text-xs h-fit py-1.5"
                                >
                                    <Send className="!w-3 !h-3"/>Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}