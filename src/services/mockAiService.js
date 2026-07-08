import { MOCK_RESUME_ANALYSIS } from '../constants/mockData';

// Helper to delay executions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAiService = {
  /**
   * Simulates parsing a resume PDF/Docx file
   * @param {File} file - The resume file
   * @param {Function} onProgress - Progress callback (0 to 100)
   */
  parseResume: async (file, onProgress) => {
    const steps = [
      { progress: 10, status: 'Uploading file...' },
      { progress: 35, status: 'Extracting metadata and layout structures...' },
      { progress: 60, status: 'Scanning professional experience sections...' },
      { progress: 85, status: 'Evaluating ATS keyword densities and formatting...' },
      { progress: 100, status: 'Finalizing intelligence score report...' }
    ];

    for (const step of steps) {
      await delay(600);
      if (onProgress) {
        onProgress(step.progress, step.status);
      }
    }

    return {
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      analysis: { ...MOCK_RESUME_ANALYSIS }
    };
  },

  /**
   * Simulates an AI evaluator processing a text/voice response for a specific question
   * @param {string} questionText - The question asked
   * @param {string} answerText - Candidate's text answer
   * @param {Array<string>} expectedKeywords - Target keywords to search for
   */
  evaluateAnswer: async (questionText, answerText, expectedKeywords = []) => {
    await delay(1500); // Simulate network latency

    const lowerAnswer = answerText.toLowerCase();
    const matchedKeywords = expectedKeywords.filter(keyword => 
      lowerAnswer.includes(keyword.toLowerCase())
    );

    // Calculate score based on keyword match rate + length of answer
    const keywordMatchRate = expectedKeywords.length > 0 
      ? matchedKeywords.length / expectedKeywords.length 
      : 1.0;
    
    // Simulating technical correctness based on keyword matches
    const baseTechnical = 40 + Math.round(keywordMatchRate * 50);
    const bonusLength = Math.min(10, Math.round(answerText.trim().split(/\s+/).length / 10)); // up to +10 for longer explanation
    const technicalScore = Math.min(100, baseTechnical + bonusLength);

    // Simulating communication (grammar check & structure)
    const baseComm = 50 + Math.round(Math.random() * 30);
    const commScore = Math.min(100, baseComm + (answerText.length > 80 ? 10 : 0));

    // Confidence index
    const confidenceScore = 60 + Math.round(Math.random() * 35);

    // Calculate overall average
    const overallScore = Math.round((technicalScore + commScore + confidenceScore) / 3);

    // Simple automated mock feedback summaries based on scores
    let feedbackSummary = '';
    let constructiveAdvice = '';
    let idealSample = '';

    if (overallScore >= 80) {
      feedbackSummary = 'Excellent breakdown of the topic. You structure your answer professionally, demonstrating clear ownership of the architectural terms.';
      constructiveAdvice = 'To push this answer to perfection, you could provide a quick real-world production incident where you applied this exact mechanism.';
      idealSample = `An ideal answer focuses heavily on structural terminology: "For instance, using ${expectedKeywords.join(', ')} allows developers to maintain clean pipelines, isolate modules, and scale applications seamlessly, solving typical resource bottlenecks."`;
    } else if (overallScore >= 60) {
      feedbackSummary = 'Solid answer, but feels slightly incomplete. You mentioned the core concepts but missed detailing some of the underlying mechanics.';
      constructiveAdvice = `Try incorporating key vocabulary. Make sure you explicitly reference terms like: ${expectedKeywords.slice(0, 3).join(', ')}.`;
      idealSample = `You should expand on details: "When we analyze this, we must ensure ${expectedKeywords.join(' and ')} are handled correctly to prevent side-effects, improve caching efficiency, and enhance execution speeds."`;
    } else {
      feedbackSummary = 'The explanation is too brief and fails to address the root technical parameters of the question.';
      constructiveAdvice = `Review the basic definitions of this topic. Concentrate on defining: ${expectedKeywords.join(', ')}.`;
      idealSample = `A proper structured response: "At its core, this topic involves ${expectedKeywords[0] || 'the technology'}. We use it specifically to solve issues with ${expectedKeywords[1] || 'state management'}, ensuring our services run with optimal resource allocations."`;
    }

    return {
      technicalScore,
      communicationScore,
      confidenceScore,
      overallScore,
      feedbackSummary,
      constructiveAdvice,
      idealSample,
      matchedKeywords,
      unmatchedKeywords: expectedKeywords.filter(k => !matchedKeywords.includes(k))
    };
  },

  /**
   * Simulates generating final reports after a mock interview session is complete
   * @param {Array<object>} evaluatedQuestions - List of evaluated question results
   */
  generateFinalReport: async (evaluatedQuestions) => {
    await delay(2000); // Simulate compiling final report card

    const count = evaluatedQuestions.length;
    if (count === 0) return null;

    const technicalAvg = Math.round(evaluatedQuestions.reduce((acc, q) => acc + q.evaluation.technicalScore, 0) / count);
    const communicationAvg = Math.round(evaluatedQuestions.reduce((acc, q) => acc + q.evaluation.communicationScore, 0) / count);
    const confidenceAvg = Math.round(evaluatedQuestions.reduce((acc, q) => acc + q.evaluation.confidenceScore, 0) / count);
    const overallAvg = Math.round((technicalAvg + communicationAvg + confidenceAvg) / 3);

    // Construct lists of aggregate strengths & weaknesses
    const strengths = [
      'Showed strong theoretical fundamentals across all core topics.',
      'Demonstrated high vocabulary precision and clear definitions.'
    ];
    const weaknesses = [
      'Struggled slightly to tie explanations to real-world edge cases.',
      'Pacing was slightly irregular in complex problem resolutions.'
    ];

    if (communicationAvg < 75) {
      strengths.push('Candidate showed logical intent.');
      weaknesses.push('Sentence structuring needs work; try to use transitional words (e.g. "therefore", "subsequently").');
    } else {
      strengths.push('Strong structural flow and confident speaking pace.');
    }

    return {
      overallScore: overallAvg,
      technicalScore: technicalAvg,
      communicationScore: communicationAvg,
      confidenceScore: confidenceAvg,
      strengths,
      weaknesses,
      suggestedImprovements: [
        'Practice time-boxing your answers to 2 minutes max per question to match real-world interviewer pressure.',
        'Review architecture designs related to system scalability and memory limits.',
        'Work on speaking with consistent intonation to project authoritative expertise.'
      ],
      recommendedTopics: [
        'System Design: Distributed Locking Schemes',
        'Advanced React State Synchronization Protocols',
        'Database Lock Escalation Strategies'
      ]
    };
  }
};
