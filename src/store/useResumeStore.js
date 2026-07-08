import { create } from 'zustand';
import { mockAiService } from '../services/mockAiService';

export const useResumeStore = create((set) => ({
  file: null,
  parsedData: JSON.parse(localStorage.getItem('parsed_resume')) || null,
  isParsing: false,
  parsingProgress: 0,
  parsingStatus: '',
  error: null,

  uploadResume: async (uploadedFile) => {
    // Basic file validation
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (!allowedTypes.includes(uploadedFile.type) && !uploadedFile.name.endsWith('.pdf') && !uploadedFile.name.endsWith('.docx')) {
      set({ error: 'Unsupported file format. Please upload a PDF or DOCX file.' });
      return false;
    }

    // Clear previous errors/data
    set({ file: uploadedFile, isParsing: true, parsingProgress: 0, parsingStatus: 'Initializing...', error: null });

    try {
      const response = await mockAiService.parseResume(uploadedFile, (progress, status) => {
        set({ parsingProgress: progress, parsingStatus: status });
      });

      localStorage.setItem('parsed_resume', JSON.stringify(response.analysis));
      set({ parsedData: response.analysis, isParsing: false });
      return true;
    } catch (err) {
      set({ error: 'Failed to process resume. Please try again.', isParsing: false });
      return false;
    }
  },

  clearResume: () => {
    localStorage.removeItem('parsed_resume');
    set({ file: null, parsedData: null, error: null, parsingProgress: 0, parsingStatus: '' });
  }
}));
