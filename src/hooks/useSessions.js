import { useChatContext } from '../context/ChatContext';

export function useSessions() {
  const {
    sessions,
    currentSession,
    setCurrentSession,
    createNewSession,
    removeSession,
    isLoading,
    fetchSessions
  } = useChatContext();

  return {
    sessions,
    currentSession,
    selectSession: setCurrentSession,
    createSession: createNewSession,
    deleteSession: removeSession,
    isLoading,
    refreshSessions: fetchSessions
  };
}
