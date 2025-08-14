"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PapiverseLoading } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { useSocket } from "@/hooks/use-socket";
import { fromatMessageDateTime } from "@/lib/formatter";
import { MessagingService } from "@/services/MessagingService";
import { UserService } from "@/services/UserService";
import { Conversation, Message } from "@/types/messaging";
import { User } from "@/types/user";
import { EllipsisIcon, Info, Link, Mic, Plus, Search, Send, SmilePlus } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const tabs = ['DIRECT', 'GROUPS', 'PUBLIC'];

export default function MessagesPage() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('DIRECT');
    const [selected, setSelected] = useState<Conversation>();
    const [users, setUsers] = useState<User[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
    const [isTyping, setIsTyping] = useState(false);

    const [reload, setReload] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

    const handleNewMessage = useCallback((message: Message, conversationId: number) => {
        if (selected?.id === conversationId) {
            setMessages(prev => [...prev, message]);
        }
        
        setConversations(prev => 
            prev.map(conv => 
                conv.id === conversationId 
                    ? { ...conv, updated_at: new Date().toISOString() }
                    : conv
            )
        );
    }, [selected?.id]);

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

    useEffect(() => {
        async function fetchData() {
            try {
                const usersRes = await UserService.getAllUsers(0, 100);
                const convoRes = await MessagingService.getConversations(claims.userId);
                setUsers(usersRes);
                
                const mappedConvos = convoRes.map((convo: Conversation) => ({
                    ...convo,
                    participant: convo.participants.map(item => {
                        const user = usersRes.find((i: User) => i.id === item);
                        return {
                            id: user?.id,
                            firstName: user?.firstName,
                            lastName: user?.lastName
                        }
                    }),
                }));
                setConversations(mappedConvos);
            } catch (error) { 
                toast.error(`${error}`) 
            } finally { 
                setLoading(false) 
            }
        }
        
        if (claims.userId) {
            fetchData();
        }
    }, [claims.userId, reload]);

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
        
        return () => {
            if (selected && isAuthenticated) {
                leaveConversation(selected.id);
            }
        };
    }, [selected?.id, messages]);

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

    const handleCreateDirectConversation = async (userId: number) => {
        await MessagingService.createDirectConversation([claims.userId, userId]);
        setReload(!reload);
    }

    // Step 1: Extract all participant IDs from all conversations
    const allParticipantIds = conversations.flatMap(conv => conv.participants);

    // Step 2: Create a Set for efficient lookup
    const participantIdSet = new Set(allParticipantIds);

    // Step 3: Filter users whose id is NOT in participantIdSet
    const usersNotInConversations = users.filter(user => !participantIdSet.has(user.id!));

    if (loading || authLoading) return <PapiverseLoading />
    
    return(
        <section className="w-full px-2 py-4">
            <Toaster closeButton position="top-center" />
            
            {/* Connection status indicator */}
            {!isConnected && (
                <div className="mb-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-sm">
                    Connecting to chat server...
                </div>
            )}
            
            <div className="grid grid-cols-4 bg-light h-full rounded-md shadow-sm">
                {/* Conversations List */}
                <div className="flex flex-col border-1 py-2.5 h-[95vh]">
                    <div className="flex flex-col gap-2 px-4">
                        <div className="flex justify-between items-center">
                            <div className="text-lg font-semibold">Chats</div>
                            <button 
                                className="w-6 h-6 flex justify-center items-center bg-darkorange rounded-full"
                            >
                                <Plus className="w-3 h-3 text-light" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            {tabs.map((item, index) => (
                                <button
                                    onClick={() => setActiveTab(item)}
                                    key={index}
                                    className={`text-[10px] flex gap-[2px] ${activeTab === item && "font-semibold"}`}
                                >
                                    {item} <div className="w-1 h-1 bg-darkred rounded-full mt-[2px]"></div>
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center rounded-md bg-white">
                            <div className="flex w-10">
                                <Search className="w-4 h-4 mx-auto" strokeWidth={2} />
                            </div>
                            <Input
                                placeholder="Search"
                                className="!h-fit border-0 pl-0 focus:!outline-none focus:!ring-0"
                            />  
                        </div>
                    </div>
                    <div className="mt-2 pl-4 pr-0.5 pb-4 overflow-y-auto flex-1">
                        {conversations.map((item, index) => (
                            <button 
                                onClick={() => setSelected(item)}
                                key={index}
                                className={`w-full flex p-2 shadow-sm bg-white rounded-md my-1.5 ${selected?.id === item.id && "!bg-orange-200"}`}
                            >
                                <div className="flex col-span-2">
                                    <div className="mx-auto flex font-semibold justify-center items-center bg-darkbrown text-light w-9 h-9 rounded-full">
                                        {"KP"}
                                    </div>
                                </div>
                                <div className="col-span-6 pl-1">
                                    <div className="text-start font-semibold text-sm truncate">
                                        {item.participant[0].id !== claims.userId ? 
                                            `${item.participant[0].firstName} ${item.participant[0].lastName}` :
                                            `${item.participant[1].firstName} ${item.participant[1].lastName}`
                                        }
                                    </div>
                                    <div className="text-start text-xs text-gray truncate">{"Message"}</div>
                                </div>
                                <div className="flex flex-col col-span-2">
                                    {/* TIME STAMP AND UNREAD */}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* MESSAGE CANVAS */}
                <div className="relative flex flex-col col-span-2 border-1 h-[95vh]">
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
                                {messages.map((item, index) => (
                                    <Fragment key={index}>
                                        {item.senderId === claims.userId ? (
                                            
                                            <div className="ms-auto w-fit max-w-6/10 text-xs bg-darkorange p-2 text-light my-2 mr-2 rounded-t-lg rounded-bl-lg">
                                                {item.content}
                                            </div>
                                        ) : (
                                            <div className="w-fit max-w-6/10 text-xs bg-light p-2 my-2 ml-2 rounded-t-lg rounded-br-lg">
                                                {item.content}
                                            </div>
                                        )}
                                    </Fragment>
                                ))}
                                
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
                </div>

                {/* NOTIF AND SUGGESTIONS */}
                <div className="fle flex-col">
                    <div className="p-4">
                        <div className="text-lg font-semibold">Suggestions</div>
                        <div>
                            {usersNotInConversations.map((item, index) => (
                                <div 
                                    key={ index }
                                    className="flex items-center gap-1 bg-white shadow-sm my-1 p-2 rounded-md"
                                >
                                    <div className="w-8 h-8 text-light rounded-full bg-darkbrown flex font-semibold justify-center items-center p-2">
                                        KP
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold truncate">{ `${item.firstName} ${item.lastName}` }</div>
                                        <div className="text-[10px] text-gray truncate">{ item.branch?.branchName }</div>
                                    </div>
                                    <button
                                        onClick={ () => handleCreateDirectConversation(item.id!) }
                                        className="ms-auto bg-blue rounded-sm p-1"
                                    >
                                        <Send className="w-2.5 h-2.5 text-light" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}