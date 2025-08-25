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
import MessageSuggestions from "./_components/MessageSuggestions";

const tabs = ['DIRECT', 'GROUPS', 'PUBLIC'];

export default function MessagesPage() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Conversation>();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
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
            <div className="grid grid-cols-4 bg-light h-full rounded-md shadow-sm">
                {/* Conversations List */}
                <MessagesSidebar 
                    claims={ claims }
                    setReload={ setReload }
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

                <MessageSuggestions 
                    userId={ claims.userId }
                    users={ users }
                    conversations={ conversations }
                    setRealod={ setReload }
                />
            </div>

                {/* NOTIF AND SUGGESTIONS */}
                
        </section>
    );
}