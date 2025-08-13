"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PapiverseLoading } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";
import { conversation, messages } from "@/lib/data-array";
import { fromatMessageDateTime } from "@/lib/formatter";
import { MessagingService } from "@/services/MessagingService";
import { UserService } from "@/services/UserService";
import { Conversation, Message } from "@/types/messaging";
import { User } from "@/types/user";
import { error } from "console";
import { EllipsisIcon, Info, Link, Mic, Plus, Search, Send, SmilePlus } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
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

    useEffect(() => {
        async function fetchData() {
            try {
                const usersRes = await UserService.getAllUsers(0, 100);
                const convoRes = await MessagingService.getConversations(claims.userId);
                setUsers(usersRes);
                console.log('Convo response: ', convoRes);
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
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [claims]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await MessagingService.getMessages(selected!.id, claims.userId);
                setMessages(data);
            } catch (error) { toast.error(`${error}`) }
        }
        fetchData();
    }, [selected]);
    console.log('Messages: ',messages);
    

    if (loading || authLoading) return <PapiverseLoading />
    return(
        <section className="w-full px-2 py-4">
            <Toaster closeButton position="top-center" />
            <div className="grid grid-cols-4 bg-light h-full rounded-md shadow-sm">

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
                                    onClick={ () => setActiveTab(item) }
                                    key={ index }
                                    className={ `text-[10px] flex gap-[2px] ${activeTab === item && "font-semibold"}` }
                                >
                                    { item } <div className="w-1 h-1 bg-darkred rounded-full mt-[2px]"></div>
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
                                onClick={ () => setSelected(item) }
                                key={ index }
                                className={ `grid grid-cols-10 p-2 shadow-sm bg-white rounded-md my-1.5 ${selected?.id === item.id && "!bg-orange-200"}` }
                            >
                                <div className="flex col-span-2">
                                    <div className="mx-auto flex font-semibold justify-center items-center bg-darkbrown text-light w-9 h-9 rounded-full">
                                        { "KP" }
                                    </div>
                                </div>
                                <div className="col-span-6 pl-1">
                                    <div className="text-start font-semibold text-sm truncate">
                                        { item.participant[0].id !== claims.userId ? 
                                            `${item.participant[0].firstName} ${item.participant[0].lastName}` :
                                            `${item.participant[1].firstName} ${item.participant[1].lastName}`
                                        }
                                    </div>
                                    <div className="text-start text-xs text-gray truncate">{ "Message" }</div>
                                </div>
                                <div className="flex flex-col col-span-2">
                                    {/* <div className={ `ms-auto text-[10px] ${selected?.id > 0 && "font-semibold"}` }>{ fromatMessageDateTime(item.updated_at) }</div> */}
                                    {/* {item.unreads > 0 && (
                                        <div className="ms-auto mt-1 text-[8px] flex items-center justify-center bg-darkred h-3.5 w-5 rounded-full text-light">{ item.unreads }</div>
                                    )} */}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative flex flex-col col-span-2 border-1 h-[95vh]">
                    <div className="flex px-4 py-2 gap-2 sticky top-0 shadow-sm bg-light">
                        <div className="flex font-semibold justify-center items-center bg-darkbrown text-light w-9 h-9 rounded-full">
                            { "KP" }
                        </div>
                        <div className="my-auto font-semibold text-sm truncate text-[16px]">
                            {/* { selected!.participant[0].id !== claims.userId ? 
                                `${selected!.participant[0].firstName ?? ''} ${selected!.participant[0].lastName ?? ''}` :
                                `${selected!.participant[1].firstName ?? ''} ${selected!.participant[1].lastName ?? ''}`
                            }   */}
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

                    <div className="flex-col w-full flex-1 bg-white overflow-y-auto pb-8">
                        {messages.map((item, index) => (
                            <Fragment key={ index }>
                                {item.senderId !== claims.userId ? (
                                    <div className="w-fit max-w-6/10 text-xs bg-light p-2 my-2 ml-2 rounded-t-lg rounded-br-lg">
                                        { item.content }
                                    </div>
                                ) : (
                                    <div className="ms-auto w-fit max-w-6/10 text-xs bg-darkorange p-2 text-light my-2 mr-2 rounded-t-lg rounded-bl-lg">
                                        { item.content }
                                    </div>
                                )}
                            </Fragment>
                        ))}
                    </div>

                    <div className="absolute w-full bottom-0 px-4 border-t-1">
                        <div className="flex items-center w-full bg-white">
                            <button
                                className="mx-2"
                            >
                                <Link className="w-4 h-4" strokeWidth={2} />
                            </button>
                            <Input
                                className="w-full border-0 focus:!outline-none focus:!ring-0"
                                placeholder="Enter your message here" 
                            />
                            <div className="flex gap-2">
                                <button
                                    className=""
                                >
                                    <SmilePlus className="w-4 h-4" strokeWidth={2} />
                                </button>
                                <button
                                    className=""
                                >
                                    <Mic className="w-4 h-4" strokeWidth={2} />
                                </button>
                                <Button
                                    size="sm"
                                    className="bg-blue rounded-full text-xs h-fit py-1.5"
                                >
                                    <Send className="!w-3 !h-3"/>Send
                                </Button>
                            </div>
                        </div>
                        
                    </div>
                </div>

                
            </div>
        </section>
    );
}