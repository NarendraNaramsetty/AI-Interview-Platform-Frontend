import { create } from 'zustand';
import { interview } from '../services/interview';
import { feedback } from '../services/feedback';

const ROLE_LABELS = {
  frontend: 'Frontend Engineer',
  backend: 'Backend Engineer',
  fullstack: 'Full Stack Engineer',
  product: 'Product Manager'
};

const LEVEL_LABELS = {
  junior: 'Junior',
  mid: 'Mid-Level',
  senior: 'Senior'
};

const buildFallbackQuestion = (config) => ({
  id: `q-${Date.now()}`,
  text: `${config.role} interview question`,
  expectedKeywords: []
});

const mapHistoryItem = (item) => ({
  id: String(item?.id || item?.uuid || `int-${Date.now()}`),
  role: item?.target_role || item?.role || 'Interview',
  level: item?.experience_level || item?.level || 'Mid-Level',
  difficulty: item?.difficulty || 'Medium',
  date: String(item?.started_at || item?.created_at || new Date().toISOString()).split('T')[0],
  duration: item?.duration_minutes ? `${item.duration_minutes} mins` : item?.duration || '30 mins',
  overallScore: item?.overall_score ?? item?.overallScore ?? 0,
  technicalScore: item?.technical_score ?? item?.technicalScore ?? 0,
  communicationScore: item?.communication_score ?? item?.communicationScore ?? 0,
  confidenceScore: item?.confidence_score ?? item?.confidenceScore ?? 0,
  status: item?.status || 'Completed',
  questionsCount: item?.total_questions ?? item?.questionsCount ?? 0
});

const mapEvaluation = (evaluation, answerText) => ({
  overallScore: evaluation?.overall_score ?? evaluation?.overallScore ?? 0,
  technicalScore: evaluation?.technical_score ?? evaluation?.technicalScore ?? 0,
  communicationScore: evaluation?.communication_score ?? evaluation?.communicationScore ?? 0,
  confidenceScore: evaluation?.confidence_score ?? evaluation?.confidenceScore ?? 0,
  feedbackSummary: evaluation?.feedback_summary || evaluation?.feedbackSummary || 'Backend analysis completed successfully.',
  constructiveAdvice: evaluation?.constructive_advice || evaluation?.constructiveAdvice || 'Review the detailed report for next steps.',
  idealSample: evaluation?.ideal_sample || evaluation?.idealSample || 'Backend-provided answer template.',
  matchedKeywords: evaluation?.matched_keywords || evaluation?.matchedKeywords || [],
  unmatchedKeywords: evaluation?.unmatched_keywords || evaluation?.unmatchedKeywords || [],
  rawAnswer: answerText
});

export const useInterviewStore = create((set, get) => ({
  history: JSON.parse(localStorage.getItem('interview_history')) || [],
  
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
  activeSessionId: null,

  setSetupConfig: (newConfig) => {
    set((state) => ({ config: { ...state.config, ...newConfig } }));
  },

  startInterview: async (targetRoleName) => {
    const { config } = get();
    try {
      const response = await interview.start({
        target_role: targetRoleName || ROLE_LABELS[config.role] || 'Frontend Engineer',
        target_company: 'Your Company',
        interview_type: 'Technical',
        difficulty: String(config.difficulty || 'Medium').charAt(0).toUpperCase() + String(config.difficulty || 'Medium').slice(1),
        interview_mode: String(config.mode || 'Text').charAt(0).toUpperCase() + String(config.mode || 'Text').slice(1),
        language: 'English',
        total_questions: config.questionCount,
        duration_minutes: config.duration,
        resume_id: null
      });

      const sessionId = response?.id || response?.session_id || response?.uuid || `sess-${Date.now()}`;
      
      let sessionQuestions = [];
      try {
        const detailResponse = await interview.detail(sessionId);
        sessionQuestions = detailResponse?.questions || [];
      } catch (detailError) {
        console.error('Failed to fetch generated questions from database:', detailError);
      }
      
      if (!sessionQuestions.length) {
        sessionQuestions = [buildFallbackQuestion(config)];
      }

      set({
        sessionId,
        activeSessionId: sessionId,
        questions: sessionQuestions.map((question) => ({
          id: question.id,
          text: question.question_text || question.text || question.title || 'Backend-generated question',
          expectedKeywords: question.expected_keywords || question.expectedKeywords || []
        })),
        currentQuestionIndex: 0,
        answers: [],
        isStarted: true,
        isPaused: false,
        isFinished: false,
        isEvaluatingQuestion: false,
        timeRemaining: config.questionCount * 120,
        currentReport: null
      });
    } catch (error) {
      set({ isStarted: false, isPaused: false, isFinished: false });
      throw error;
    }
  },

  tickTimer: () => {
    const { isStarted, isPaused, timeRemaining, finishInterview } = get();
    if (!isStarted || isPaused) return;

    if (timeRemaining <= 1) {
      finishInterview();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  pauseInterview: () => set({ isPaused: true }),
  resumeInterview: () => set({ isPaused: false }),

  submitAnswer: async (answerText) => {
    const { questions, currentQuestionIndex, answers, sessionId } = get();
    const currentQuestion = questions[currentQuestionIndex];
    
    set({ isEvaluatingQuestion: true });

    try {
      const response = await interview.answer(sessionId, {
        question_id: currentQuestion.id,
        answer_text: answerText,
        answer_duration: 0
      });

      const evaluationData = response?.evaluation || response?.data?.evaluation || response || {};
      const evaluation = mapEvaluation(evaluationData, answerText);

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
    const { sessionId, currentQuestionIndex, questions } = get();
    try {
      set({ isEvaluatingQuestion: true });
      await interview.skip(sessionId);
      set({ isEvaluatingQuestion: false });
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex >= questions.length) {
        await get().finishInterview();
      } else {
        set({ currentQuestionIndex: nextIndex });
      }
    } catch (error) {
      set({ isEvaluatingQuestion: false });
      console.error('Failed to skip question:', error);
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex >= questions.length) {
        await get().finishInterview();
      } else {
        set({ currentQuestionIndex: nextIndex });
      }
    }
  },

  finishInterview: async () => {
    const { answers, config, history, sessionId } = get();
    
    set({ 
      isStarted: false, 
      isGeneratingReport: true 
    });

    try {
      const response = await interview.end(sessionId);
      const reportData = response?.result || response?.data || response || {};

      let evalResponse = null;
      try {
        evalResponse = await feedback.generate({ interview_id: sessionId });
      } catch (evalError) {
        console.error('Failed to generate full evaluation details, fetching details:', evalError);
        try {
          evalResponse = await feedback.detail(sessionId);
        } catch (detailErr) {
          console.error('Failed to load detail evaluation:', detailErr);
        }
      }

      const techEval = evalResponse?.technical_evaluation || {};
      const commEval = evalResponse?.communication_evaluation || {};
      const hrEval = evalResponse?.hr_evaluation || {};
      const overallEval = evalResponse?.overall_evaluation || {};

      const finalReport = {
        overallScore: overallEval?.overall_score ?? reportData?.overall_score ?? reportData?.overallScore ?? 0,
        technicalScore: techEval?.technical_score ?? reportData?.technical_score ?? reportData?.technicalScore ?? 0,
        communicationScore: commEval?.communication_score ?? reportData?.communication_score ?? reportData?.communicationScore ?? 0,
        confidenceScore: hrEval?.confidence_score ?? reportData?.confidence_score ?? reportData?.confidenceScore ?? 0,
        strengths: techEval?.strengths || ["Demonstrated clear technical vocabulary during explanations."],
        weaknesses: techEval?.weaknesses || ["Could expand on edge cases or code testability parameters."],
        recommendedTopics: techEval?.recommendations || ["Advanced Component Lifecycle Design Patterns"],
        feedbackSummary: overallEval?.final_feedback || reportData?.feedback_placeholder || '',
        constructiveAdvice: overallEval?.next_learning_plan || '',
        idealSample: '',
        matchedKeywords: [],
        unmatchedKeywords: []
      };
      
      const newHistoryItem = {
        id: String(sessionId),
        role: ROLE_LABELS[config.role] || 'Interview',
        level: LEVEL_LABELS[config.experienceLevel] || 'Mid-Level',
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

      const updatedHistory = [newHistoryItem, ...history.filter(h => h.id !== String(sessionId))];
      localStorage.setItem('interview_history', JSON.stringify(updatedHistory));

      set({
        history: updatedHistory,
        currentReport: finalReport,
        isGeneratingReport: false,
        isFinished: true,
        activeSessionId: null
      });
    } catch (error) {
      set({ isGeneratingReport: false });
      console.error(error);
    }
  },

  loadHistory: async () => {
    try {
      const data = await interview.history();
      const items = Array.isArray(data) ? data : data?.results || [];
      const history = items.map(mapHistoryItem);
      localStorage.setItem('interview_history', JSON.stringify(history));
      set({ history });
      return history;
    } catch (error) {
      console.error('Failed to load interview history from database:', error);
      return get().history;
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
