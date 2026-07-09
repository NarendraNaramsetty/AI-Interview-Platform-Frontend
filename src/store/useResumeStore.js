import { create } from 'zustand';
import { resume } from '../services/resume';

const mapAnalysis = (analysis) => ({
  atsScore: analysis?.ats_score ?? analysis?.atsScore ?? analysis?.overall_score ?? 0,
  parsedSkills: analysis?.missing_skills || analysis?.parsed_skills || analysis?.parsedSkills || [],
  recommendedRoles: analysis?.recommended_roles || analysis?.recommendedRoles || [],
  strengths: analysis?.strengths || [],
  weaknesses: analysis?.weaknesses || [],
  actionableTips: analysis?.summary ? [analysis.summary] : []
});

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
      const formData = new FormData();
      formData.append('file', uploadedFile);
      set({ parsingProgress: 25, parsingStatus: 'Uploading...' });
      const response = await resume.upload(formData);
      const analysis = response?.analysis || response?.analysis || response;
      const parsedData = mapAnalysis(analysis);

      localStorage.setItem('parsed_resume', JSON.stringify(parsedData));
      set({ parsedData, isParsing: false, parsingProgress: 100, parsingStatus: 'Completed' });
      return true;
    } catch (err) {
      set({ error: err?.message || 'Failed to process resume. Please try again.', isParsing: false });
      return false;
    }
  },

  clearResume: () => {
    localStorage.removeItem('parsed_resume');
    set({ file: null, parsedData: null, error: null, parsingProgress: 0, parsingStatus: '' });
  },

  hydrateResume: async () => {
    try {
      const list = await resume.list();
      const items = Array.isArray(list) ? list : list?.results || list?.data || [];
      if (items.length > 0) {
        const latest = items[0];
        const detail = await resume.detail(latest.id);
        const analysis = detail?.analysis || detail;
        const parsedData = mapAnalysis(analysis);
        localStorage.setItem('parsed_resume', JSON.stringify(parsedData));
        set({ parsedData });
        return parsedData;
      }
      return null;
    } catch (err) {
      console.error('Failed to hydrate resume details:', err);
      return null;
    }
  }
}));
