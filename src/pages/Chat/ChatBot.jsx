import React from 'react';
import { ChatProvider } from '../../context/ChatContext';
import SidebarSessions from '../../components/chatbot/SidebarSessions';
import ChatWindow from '../../components/chatbot/ChatWindow';

export default function ChatBot() {
  return (
    <ChatProvider>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Branding Panel */}
        <div>
          <h2 className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 tracking-tight text-3xl py-1">
            AI Career Advisor Chat
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            Level up your career preparation with our interactive coach. Instantly search core Q&As locally or get detailed AI responses for advanced programming or behavioral questions.
          </p>
        </div>

        {/* Dashboard layout structure */}
        <div className="flex flex-col md:flex-row gap-6">
          <SidebarSessions />
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  );
}
