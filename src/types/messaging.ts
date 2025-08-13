import { User } from "./user";

export interface Conversation {
    id: number;
    type: string;
    name: string;
    updated_at: string,
    participants: number[];
    participant: {
        id: number,
        firstName: string;
        lastName: string;
    }[];
}

export interface Message {
    id: number;
    senderId: number;
    content: string;
    messageType: string;
    createdAt: string;
    updatedAt: string;
    parentMessage: number | null;
}