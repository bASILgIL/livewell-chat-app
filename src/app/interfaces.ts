// This enum was created to make choosing a role easier and typo proof.
export enum Role {
    PATIENT,
    DOCTOR
}

// A user needs a unique id, a name and a role as either a doctor or a patient in order to be identified.
export interface User {
    id: string;
    name: string;
    role: Role;
}

// A message has a unique id in order to allow for retrieval in the future from server.
// A message has the senders id, content and a timestamp for coherent message order.
export interface Message {
    id: string;
    senderId: string;
    conversationId: string;
    content: string;
    timestamp: Date;
}

// A conversation needs a unique id, an array of userIds for the participants and an array of messages
export interface Conversation {
    id: string;
    participants: string[];
    messages: Message[];
}
