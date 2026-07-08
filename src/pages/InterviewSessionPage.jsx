import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../store/useInterviewStore';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Keyboard, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  SkipForward, 
  Send, 
  Loader2, 
  Volume2,
  VolumeX,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function InterviewSessionPage() {
  const { theme } = useAuthStore();
  const { 
    questions, 
    currentQuestionIndex, 
    isStarted, 
    isPaused, 
    isFinished, 
    isEvaluatingQuestion, 
    timeRemaining, 
    submitAnswer, 
    skipQuestion, 
    pauseInterview, 
    resumeInterview, 
    tickTimer, 
    resetInterview,
    isGeneratingReport
  } = useInterviewStore();

  const navigate = useNavigate();

  // Local state for candidate answer text
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [speechError, setSpeechError] = useState(null);
  
  // Web Speech API reference
  const recognitionRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  // Redirect if interview is not active or finished
  useEffect(() => {
    if (!isStarted && !isFinished && !isGeneratingReport) {
      navigate('/interview/setup');
    }
    if (isFinished) {
      navigate('/interview/results');
    }
  }, [isStarted, isFinished, isGeneratingReport, navigate]);

  // Main countdown timer ticker
  useEffect(() => {
    if (!isStarted || isPaused || isFinished) return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted, isPaused, isFinished, tickTimer]);

  // Handle Speech Recognition Setup
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback: Simulate speech transcript
      simulateVoiceTranscription();
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        setSpeechError(null);
        setRecordingTimer(0);
        // Start counting recording time
        recordingIntervalRef.current = setInterval(() => {
          setRecordingTimer(t => t + 1);
        }, 1000);
      };

      rec.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setAnswerText((prev) => prev + ' ' + finalTranscript || interimTranscript);
      };

      rec.onerror = (event) => {
        console.error('Speech error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Falling back to simulated voice.');
          simulateVoiceTranscription();
        } else {
          setSpeechError('Microphone capture error. Please retry.');
          stopSpeechRecognition();
        }
      };

      rec.onend = () => {
        setIsRecording(false);
        clearInterval(recordingIntervalRef.current);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      simulateVoiceTranscription();
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  };

  const simulateVoiceTranscription = () => {
    setIsRecording(true);
    setRecordingTimer(0);
    setSpeechError(null);

    recordingIntervalRef.current = setInterval(() => {
      setRecordingTimer(t => t + 1);
    }, 1000);

    // Simulate mock spoken words filling after some seconds
    setTimeout(() => {
      if (isRecording) {
        setAnswerText(prev => prev + " Based on my understanding of this topic, the primary mechanism relies on rendering changes efficiently inside components. ");
      }
    }, 3000);
    setTimeout(() => {
      if (isRecording) {
        setAnswerText(prev => prev + "We avoid re-triggering calculations by using hooks like useMemo or custom context selectors. This optimizes performance under heavy DOM loads.");
      }
    }, 8000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  // Submit Answer Action
  const handleSubmit = async () => {
    if (isEvaluatingQuestion) return;
    const success = await submitAnswer(answerText);
    if (success) {
      setAnswerText(''); // Reset text box for next question
    }
  };

  // Skip Question Action
  const handleSkip = async () => {
    if (isEvaluatingQuestion) return;
    await skipQuestion();
    setAnswerText('');
  };

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex] || {};
  const progressPercent = questions.length > 0 
    ? ((currentQuestionIndex) / questions.length) * 100 
    : 0;

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Session Progress Header */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${cardStyle}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Remaining Practice Time</p>
            <h4 className="text-sm font-bold font-display">{formatTime(timeRemaining)}</h4>
          </div>
        </div>

        {/* Question Counter */}
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Interview Progress</p>
          <h4 className="text-sm font-bold font-display">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h4>
        </div>
      </div>

      {/* Progress Bar indicator */}
      <div className="h-1.5 w-full bg-gray-700/20 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Question Panel */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between lg:col-span-2 min-h-[300px] ${cardStyle}`}>
          <div className="space-y-4">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
              Active Question
            </span>
            <h3 className="font-display font-bold text-lg leading-relaxed">
              {currentQuestion.text || 'Loading question...'}
            </h3>
          </div>

          <div className="flex items-center justify-between border-t border-gray-500/10 pt-4 mt-6">
            {/* Control buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={isPaused ? resumeInterview : pauseInterview}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  theme === 'dark' 
                    ? 'border-dark-border hover:bg-dark-hover text-gray-300' 
                    : 'border-light-border hover:bg-light-hover text-gray-700'
                }`}
              >
                {isPaused ? <Play className="h-4.5 w-4.5 text-green-500 fill-green-500" /> : <Pause className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500" />}
                <span>{isPaused ? 'Resume Practice' : 'Pause Practice'}</span>
              </button>
            </div>
            
            <button
              onClick={handleSkip}
              disabled={isEvaluatingQuestion}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 ${
                theme === 'dark' 
                  ? 'border-dark-border hover:bg-dark-hover text-gray-300' 
                  : 'border-light-border hover:bg-light-hover text-gray-700'
              }`}
            >
              <span>Skip Question</span>
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Answering Panel */}
        <div className="space-y-6">
          
          {/* AI Loader/Evaluator screen overlay */}
          {isEvaluatingQuestion ? (
            <div className={`p-8 rounded-2xl border text-center flex flex-col items-center justify-center min-h-[300px] ${cardStyle} space-y-4 animate-pulse`}>
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-sm">AI Score Evaluation...</h4>
                <p className="text-xs text-gray-500">Checking vocabulary and sentence layout.</p>
              </div>
            </div>
          ) : isGeneratingReport ? (
            <div className={`p-8 rounded-2xl border text-center flex flex-col items-center justify-center min-h-[300px] ${cardStyle} space-y-4`}>
              <Loader2 className="h-10 w-10 text-violet-500 animate-spin" />
              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-sm">Compiling Final Report Card...</h4>
                <p className="text-xs text-gray-500">Generating target skill analytics.</p>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl border flex flex-col justify-between min-h-[300px] ${cardStyle}`}>
              
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b pb-2.5 border-gray-500/10">
                  <span className="text-xs font-bold text-gray-400">Response Panel</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    Mode: {useInterviewStore.getState().config.mode}
                  </span>
                </div>

                {/* Mode Selector rendering */}
                {useInterviewStore.getState().config.mode === 'voice' ? (
                  /* Voice interface */
                  <div className="flex-1 flex flex-col items-center justify-center py-4 space-y-4">
                    
                    {speechError && (
                      <div className="p-2.5 rounded-lg bg-yellow-500/15 border border-yellow-500/20 text-yellow-500 text-[10px] leading-snug">
                        {speechError}
                      </div>
                    )}

                    {/* Microphone Action Button */}
                    <div className="relative">
                      {isRecording && (
                        <div className="absolute -inset-4 rounded-full bg-red-500/20 animate-ping" />
                      )}
                      <button
                        onClick={toggleRecording}
                        className={`h-16 w-16 rounded-full flex items-center justify-center border transition-all duration-300 ${
                          isRecording 
                            ? 'bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/20' 
                            : 'bg-indigo-600 border-indigo-700 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/10'
                        }`}
                      >
                        {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                      </button>
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-xs font-bold">
                        {isRecording ? 'Listening... Speak now' : 'Click to start recording'}
                      </span>
                      {isRecording && (
                        <p className="text-[10px] text-red-500 font-semibold font-mono">
                          Recording: {recordingTimer}s
                        </p>
                      )}
                    </div>

                    {/* Speech Transcript Preview Box */}
                    <div className={`w-full max-h-24 overflow-y-auto p-2 rounded-lg border text-[11px] ${
                      theme === 'dark' ? 'bg-dark-bg/50 border-dark-border' : 'bg-gray-50 border-gray-100'
                    }`}>
                      <span className="text-gray-500 font-semibold">Transcript: </span>
                      <span className={answerText ? 'text-gray-300' : 'text-gray-500 italic'}>
                        {answerText || 'Say something to generate transcript...'}
                      </span>
                    </div>

                  </div>
                ) : (
                  /* Text interface */
                  <div className="flex-1 flex flex-col space-y-3">
                    <textarea
                      placeholder="Type your structured answer here. Include relevant architectural details..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      className={`w-full flex-1 p-3 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none min-h-[120px] ${
                        theme === 'dark' 
                          ? 'bg-dark-bg border-dark-border text-white placeholder-gray-600' 
                          : 'bg-white border-light-border text-gray-800 placeholder-gray-400'
                      }`}
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                      <span>Word Count</span>
                      <span>{answerText.trim().split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleSubmit}
                disabled={isEvaluatingQuestion || !answerText.trim()}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-3 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10 disabled:opacity-50 mt-4"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Response</span>
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
