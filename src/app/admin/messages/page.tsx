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
import { MessagesSidebar } from "./_components/MessagesSidebar";
import { MessagesCanvas } from "./_components/MessagesCanvas";

const tabs = ['DIRECT', 'GROUPS', 'PUBLIC'];

export default function MessagesPage() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Conversation>();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    const [reload, setReload] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const usersRes = await UserService.getAllUsers(0, 100);
                const convoRes = await MessagingService.getConversations(claims.userId);
                setUsers(usersRes.content);
                
                const mappedConvos = convoRes.map((convo: Conversation) => ({
                    ...convo,
                    participant: convo.participants.map(item => {
                        const user = usersRes.content.find((i: User) => i.id === item);
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

    if (loading || authLoading) return <PapiverseLoading />
    return(
        <section className="w-full px-2 py-4">
            <Toaster closeButton position="top-center" />
            
            {/* Connection status indicator */}
            {/* {!isConnected && (
                <div className="mb-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-sm">
                    Connecting to chat server...
                </div>
            )} */}
            
            <div className="grid grid-cols-4 bg-light h-full rounded-md shadow-sm">
                {/* Conversations List */}
                <MessagesSidebar 
                    claims={ claims }
                    conversations={ conversations }
                    selected={ selected! }
                    setSelected={ setSelected }
                />

                {/* MESSAGE CANVAS */}
                <MessagesCanvas
                    claims={ claims }
                    selected={ selected! }
                    users={ users }
                />

                {/* NOTIF AND SUGGESTIONS */}
                {/* <div className="fle flex-col">
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
                </div> */}
            </div>
        </section>
    );
}