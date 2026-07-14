import { useChatContext } from '../context/ChatContext';

export function useChat() {
  const {
    messages,
    isTyping,
    error,
    sendUserMessage,
    submitRating,
    currentSession
  } = useChatContext();

  return {
    messages,
    isTyping,
    error,
    sendMessage: sendUserMessage,
    submitRating,
    session: currentSession
  };
}
