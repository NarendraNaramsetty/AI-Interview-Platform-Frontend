import { create } from 'zustand';
import { MOCK_QUESTIONS, MOCK_INTERVIEW_HISTORY } from '../constants/mockData';
import { mockAiService } from '../services/mockAiService';

export const useInterviewStore = create((set, get) => ({
  history: JSON.parse(localStorage.getItem('interview_history')) || MOCK_INTERVIEW_HISTORY,
  
  // Current active interview configuration
  config: {
    role: 'frontend',
    techStack: [],
    experienceLevel: 'mid',
    difficulty: 'medium',
    duration: 10, // minutes
    questionCount: 3,
    mode: 'text' // text or voice
  },

  // Active session details
  sessionId: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [], // Array of { questionId, questionText, answerText, evaluation: {} }
  isStarted: false,
  isPaused: false,
  isFinished: false,
  isEvaluatingQuestion: false,
  timeRemaining: 0, // seconds
  currentReport: null,
  isGeneratingReport: false,

  setSetupConfig: (newConfig) => {
    set((state) => ({ config: { ...state.config, ...newConfig } }));
  },

  startInterview: () => {
    const { config } = get();
    
    // Select questions based on role and difficulty
    const roleQuestions = MOCK_QUESTIONS[config.role] || MOCK_QUESTIONS['frontend'];
    const difficultyQuestions = roleQuestions[config.difficulty] || roleQuestions['medium'];
    
    // Shuffle and pick requested number of questions (or maximum available)
    const shuffled = [...difficultyQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(config.questionCount, shuffled.length));

    set({
      sessionId: `sess-${Date.now()}`,
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      answers: [],
      isStarted: true,
      isPaused: false,
      isFinished: false,
      isEvaluatingQuestion: false,
      timeRemaining: config.questionCount * 120, // 2 minutes per question
      currentReport: null
    });
  },

  tickTimer: () => {
    const { isStarted, isPaused, timeRemaining, finishInterview } = get();
    if (!isStarted || isPaused) return;

    if (timeRemaining <= 1) {
      // Auto-finish if time runs out completely
      finishInterview();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  pauseInterview: () => set({ isPaused: true }),
  resumeInterview: () => set({ isPaused: false }),

  submitAnswer: async (answerText) => {
    const { questions, currentQuestionIndex, answers } = get();
    const currentQuestion = questions[currentQuestionIndex];
    
    set({ isEvaluatingQuestion: true });

    try {
      const evaluation = await mockAiService.evaluateAnswer(
        currentQuestion.text,
        answerText,
        currentQuestion.expectedKeywords
      );

      const updatedAnswers = [
        ...answers,
        {
          questionId: currentQuestion.id,
          questionText: currentQuestion.text,
          answerText: answerText || '(No answer provided)',
          evaluation
        }
      ];

      set({ 
        answers: updatedAnswers, 
        isEvaluatingQuestion: false 
      });

      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex >= questions.length) {
        await get().finishInterview();
      } else {
        set({ currentQuestionIndex: nextIndex });
      }
      return true;
    } catch (error) {
      set({ isEvaluatingQuestion: false });
      console.error(error);
      return false;
    }
  },

  skipQuestion: async () => {
    const { currentQuestionIndex, questions } = get();
    // Submit an empty answer and trigger auto-evaluation
    await get().submitAnswer('Question skipped by candidate.');
  },

  finishInterview: async () => {
    const { answers, config, history } = get();
    
    set({ 
      isStarted: false, 
      isGeneratingReport: true 
    });

    try {
      const finalReport = await mockAiService.generateFinalReport(answers);
      
      const newHistoryItem = {
        id: `int-${Date.now()}`,
        role: config.role === 'frontend' ? 'Frontend Engineer' : config.role === 'backend' ? 'Backend Engineer' : config.role === 'fullstack' ? 'Full Stack Engineer' : 'Product Manager',
        level: config.experienceLevel === 'junior' ? 'Junior' : config.experienceLevel === 'mid' ? 'Mid-Level' : 'Senior',
        difficulty: config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1),
        date: new Date().toISOString().split('T')[0],
        duration: `${Math.round(((config.questionCount * 120) - get().timeRemaining) / 60)} mins`,
        overallScore: finalReport.overallScore,
        technicalScore: finalReport.technicalScore,
        communicationScore: finalReport.communicationScore,
        confidenceScore: finalReport.confidenceScore,
        status: 'Completed',
        questionsCount: answers.length
      };

      const updatedHistory = [newHistoryItem, ...history];
      localStorage.setItem('interview_history', JSON.stringify(updatedHistory));

      set({
        history: updatedHistory,
        currentReport: finalReport,
        isGeneratingReport: false,
        isFinished: true
      });
    } catch (error) {
      set({ isGeneratingReport: false });
      console.error(error);
    }
  },

  resetInterview: () => {
    set({
      sessionId: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      isStarted: false,
      isPaused: false,
      isFinished: false,
      isEvaluatingQuestion: false,
      timeRemaining: 0,
      currentReport: null
    });
  }
}));
