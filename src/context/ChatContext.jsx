import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { chatbotApi } from '../services/chatbotApi';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [skipHistoryFetch, setSkipHistoryFetch] = useState(false);

  // Fetch all user active chat sessions
  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await chatbotApi.getSessions();
      const sessionList = response?.data || response || [];
      setSessions(sessionList);
      
      // Auto-select the first active session if none is currently selected
      if (sessionList.length > 0 && !currentSession) {
        setCurrentSession(sessionList[0]);
      }
    } catch (err) {
      console.error("Error loading chat sessions:", err);
      setError(err?.message || "Failed to load chat sessions.");
    } finally {
      setIsLoading(false);
    }
  }, [currentSession]);

  // Fetch chat history for selected session
  const fetchHistory = useCallback(async (sessionId) => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await chatbotApi.getHistory(sessionId);
      const historyList = response?.data || response || [];
      setMessages(historyList);
    } catch (err) {
      console.error("Error loading messages history:", err);
      setError("Failed to retrieve conversation history.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await chatbotApi.getCategories();
      setCategories(response?.data || response || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  // Initialize context data
  useEffect(() => {
    fetchSessions();
    fetchCategories();
  }, []);

  // Listen to currentSession changes to load history
  useEffect(() => {
    if (currentSession?.id) {
      if (skipHistoryFetch) {
        setSkipHistoryFetch(false);
        return;
      }
      fetchHistory(currentSession.id);
    } else {
      setMessages([]);
    }
  }, [currentSession, fetchHistory, skipHistoryFetch]);

  // Create a new session
  const createNewSession = useCallback(async (title = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await chatbotApi.createSession({ session_title: title });
      const newSess = response?.data || response;
      setSessions(prev => [newSess, ...prev]);
      setSkipHistoryFetch(true);
      setCurrentSession(newSess);
      return newSess;
    } catch (err) {
      setError(err?.message || "Failed to create a new session.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a session
  const removeSession = useCallback(async (id) => {
    try {
      await chatbotApi.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSession?.id === id) {
        setCurrentSession(null);
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
      throw err;
    }
  }, [currentSession]);

  // Send user message
  const sendUserMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    setError(null);

    let activeSession = currentSession;
    
    try {
      // 1. Create a session on-the-fly if none exists
      if (!activeSession) {
        activeSession = await createNewSession("New Chat Session");
      }

      // 2. Append user message locally
      const tempUserMsg = {
        id: Date.now(),
        sender: 'USER',
        message: text,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempUserMsg]);
      setIsTyping(true);

      // 3. Send query to backend API
      const response = await chatbotApi.sendMessage({
        session_id: activeSession.id,
        message: text
      });

      const responseData = response?.data || response;
      
      // 4. Update messages with actual saved bot message
      setMessages(prev => [...prev, responseData]);

      // If the session title was auto-generated, refresh the sessions list
      if (activeSession.session_title === "New Chat Session") {
        fetchSessions();
      }
    } catch (err) {
      console.error("Message delivery failed:", err);
      // Append an error indicator message bubble
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'BOT',
        message: "⚠️ Apologies, I encountered a communication error. Please check your network and try again.",
        response_source: "ERROR",
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
      setError("Failed to deliver message. Please retry.");
    } finally {
      setIsTyping(false);
    }
  }, [currentSession, createNewSession, fetchSessions]);

  // Submit feed ratings
  const submitRating = useCallback(async (messageId, rating, comment = "") => {
    try {
      const response = await chatbotApi.submitFeedback({
        message_id: messageId,
        rating,
        comment
      });
      
      // Update local message list to reflect feedback status
      setMessages(prev => prev.map(m => {
        if (m.id === messageId) {
          return { ...m, feedback: response?.data || response };
        }
        return m;
      }));
      return response?.data || response;
    } catch (err) {
      console.error("Feedback submission error:", err);
      throw err;
    }
  }, []);

  const contextValue = React.useMemo(() => ({
    sessions,
    currentSession,
    setCurrentSession,
    messages,
    categories,
    isLoading,
    isTyping,
    error,
    fetchSessions,
    createNewSession,
    removeSession,
    sendUserMessage,
    submitRating
  }), [
    sessions,
    currentSession,
    messages,
    categories,
    isLoading,
    isTyping,
    error,
    fetchSessions,
    createNewSession,
    removeSession,
    sendUserMessage,
    submitRating
  ]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
