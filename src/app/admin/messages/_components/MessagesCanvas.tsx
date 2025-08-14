"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/use-socket";
import { MessagingService } from "@/services/MessagingService";
import { Claim } from "@/types/claims";
import { Conversation, Message } from "@/types/messaging";
import { User } from "@/types/user";
import { EllipsisIcon, Info, Link, Mic, Send, SmilePlus } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
    claims: Claim;
    users: User[];
    selected: Conversation;
    setConversations?: (i: Conversation[]) => void;
}

export function MessagesCanvas({ claims, users, selected, setConversations }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

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
 
        onUserTyping: handleUserTyping,
        onUserStoppedTyping: handleUserStoppedTyping,
    });

    useEffect(() => {
        async function fetchMessages() {
            if (!selected) return;
            
            try {
                const data = await MessagingService.getMessages(selected.id, claims.userId);
                setMessages(data);
                
                if (isAuthenticated) {
                    joinConversation(selected.id);
                }
            } catch (error) { 
                toast.error(`${error}`) 
            }
        }
        
        fetchMessages();
        
        // return () => {
        //     if (selected && isAuthenticated) {
        //         leaveConversation(selected.id);
        //     }
        // };
    }, [selected?.id]);

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

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selected || !isAuthenticated) return;

        const optimisticMessage: Message = {
            id: Date.now(), 
            content: messageInput.trim(),
            senderId: claims.userId,
            conversationId: selected.id!,
            messageType: 'text',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimisticMessage]);

        sendMessage(selected.id, messageInput.trim());
        
        setMessageInput('');
        if (isTyping) {
            setIsTyping(false);
            stopTyping(selected.id);
        }
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getTypingIndicator = () => {
        if (typingUsers.size === 0) return null;
        
        const typingUserNames = Array.from(typingUsers).map(userId => {
            const user = users.find(u => u.id === userId);
            return user ? `${user.firstName} ${user.lastName}` : 'Someone';
        });
        
        if (typingUserNames.length === 1) {
            return `${typingUserNames[0]} is typing...`;
        } else {
            return `${typingUserNames.join(', ')} are typing...`;
        }
    };

    // const handleCreateDirectConversation = async (userId: number) => {
    //     await MessagingService.createDirectConversation([claims.userId, userId]);
    // }

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
                            {selected.participant[0].id !== claims.userId ? 
                                `${selected.participant[0].firstName ?? ''} ${selected.participant[0].lastName ?? ''}` :
                                `${selected.participant[1].firstName ?? ''} ${selected.participant[1].lastName ?? ''}`
                            }
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
                    <div className="flex-col w-full flex-1 bg-white overflow-y-auto pb-8">
                        {messages.map((message, index) => {
                            const isOwnMessage = message.senderId === claims.userId;
                            
                            return (
                                <Fragment key={message.id || index}> {/* Use message.id if available */}
                                <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} my-2`}>
                                    <div 
                                    className={`
                                        w-fit max-w-[60%] text-xs p-3 
                                        ${isOwnMessage 
                                        ? 'bg-darkorange text-light mr-2 rounded-t-lg rounded-bl-lg' 
                                        : 'bg-light ml-2 rounded-t-lg rounded-br-lg'
                                        }
                                    `}
                                    >
                                        {message.content}
                                    {/* Optional: Add timestamp
                                    <div className={`text-xs mt-1 opacity-70 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                                        {new Date(message.createdAt).toLocaleTimeString()}
                                    </div> */}
                                    </div>
                                </div>
                                </Fragment>
                            );
                        })}
                        
                        {/* TYPING INDICATOR */}
                        {getTypingIndicator() && (
                            <div className="w-fit max-w-6/10 text-xs bg-gray-200 p-2 my-2 ml-2 rounded-t-lg rounded-br-lg italic">
                                {getTypingIndicator()}
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