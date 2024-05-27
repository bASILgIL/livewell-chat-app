"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Role, User, Message, Conversation } from "./interfaces"
import {format} from 'date-fns/format';

// Example User Data
const randomUsers: User[] = [
  { id: "1", role: Role.PATIENT, name: 'Alice' },
  { id: "2", role: Role.DOCTOR, name: 'Dr. Bob' }
];

// Example Conversations Data
const exampleConversations: Conversation[] = [
  { id: "1", participants: ["1", "2"], messages: [] }
];

// Example Messages Data
const exampleMessages: Message[] = [
  { id: "1", conversationId: "1", senderId: "1", content: 'Hello, doctor!', timestamp: new Date() },
  { id: "2", conversationId: "1", senderId: "2", content: 'Hello, Alice! How can I help you?', timestamp: new Date() }
];

export default function Home() {
  const [users, setUsers] = useState<User[]>(randomUsers);
  const [conversations, setConversations] = useState<Conversation[]>(exampleConversations);
  const [messages, setMessages] = useState<Message[]>(exampleMessages);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
  };

  const handleNewConversation = () => {
    if (!currentUser) return;
    const newConversation: Conversation = { id: Date.now().toString(), participants: [currentUser.id, "0"], messages: [] };
    setConversations([...conversations, newConversation]);
    setCurrentConversation(newConversation);
  };

  const handleSendMessage = () => {
    if (!messageContent || !currentUser || !currentConversation) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: currentConversation.id,
      senderId: currentUser.id,
      content: messageContent,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    // Also update the messages in the conversation object
    setConversations(conversations.map(conv => 
      conv.id === currentConversation.id 
      ? {...conv, messages: [...conv.messages, newMessage]}
      : conv
    ));
    setMessageContent('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the conversation container after every render
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEscapeButton = () => {
    window.location.reload(); // Reload the page
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 font-mono">
        {!currentUser && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 backdrop-blur-2xl">Select Your Role</h2>
            <div className="flex space-x-4 w-3/5 justify-between">
              <button
                onClick={() => handleUserSelect(users[0])}
                className="bg-black text-white px-4 py-2 rounded mb-2 shadow-md hover:bg-gray-800 w-3/5"
              >
                PATIENT
              </button>
              <button
                onClick={() => handleUserSelect(users[1])}
                className="bg-black text-white px-4 py-2 rounded mb-2 shadow-md hover:bg-gray-800 w-3/5"
              >
                DOCTOR
              </button>
            </div>
          </div>
        )}
        {currentUser && !currentConversation && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Welcome, {currentUser.name}!</h2>
            <button
              onClick={handleNewConversation}
              className="bg-black text-white px-4 py-2 rounded shadow-md hover:bg-gray-800 w-3/5"
            >
              Start a new conversation
            </button>
          </div>
        )}
        {currentConversation && (
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-row items-center justify-between w-full m-2">
              <h2 className="text-xl font-semibold mb-2">Conversation</h2>
              <button onClick={handleEscapeButton}
                      className="bg-gray-600 text-white px-6 py-2 rounded shadow-md hover:bg-gray-400">
                Leave
              </button>
            </div>
            <div
              className="w-full h-64 overflow-y-scroll bg-gray-50 p-4 mb-4 border rounded shadow-inner scrollbar-hide"
              ref={messageContainerRef}
            >
              {messages
                .filter(msg => msg.conversationId === currentConversation.id)
                .map(msg => {
                  const user = users.find(user => user.id === msg.senderId);
                  return (
                    <div key={msg.id} className="mb-2 flex items-start justify-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          {user?.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className={`ml-3 min-w-[75%] max-w-[75%]`} style={{ maxWidth: '75%' }}>
                        <div className="text-sm text-gray-500">
                          <strong className="text-black">{user?.name}</strong>
                          <span className="ml-2">{format(new Date(msg.timestamp), 'Pp')}</span>
                        </div>
                        <div className="rounded text-black">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="w-full flex">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow p-2 border rounded-l bg-gray-100 mr-2"
              />
              <button
                onClick={handleSendMessage}
                className="bg-black text-white px-6 py-2 rounded shadow-md hover:bg-gray-600"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
