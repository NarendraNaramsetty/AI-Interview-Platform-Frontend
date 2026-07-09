import React, { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { HelpCircle, Search, Plus, Filter, Edit, Trash2, Download, Upload, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { questions as questionsService } from '../../services/questions';

export default function AdminQuestionsPage() {
  const { theme } = useAuthStore();
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [topics, setTopics] = useState([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('');
  
  // Add & Edit Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Form Fields
  const [formText, setFormText] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formDiff, setFormDiff] = useState('Easy');
  const [formCat, setFormCat] = useState('Frontend');
  const [formTags, setFormTags] = useState('');
  const [formError, setFormError] = useState('');

  // Actions
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    Promise.all([
      questionsService.list(),
      questionsService.categories(),
      questionsService.companies(),
      questionsService.topics()
    ]).then(([questionData, categoryData, companyData, topicData]) => {
      setQuestions(Array.isArray(questionData) ? questionData : questionData?.results || questionData?.data || []);
      setCategories(Array.isArray(categoryData) ? categoryData : categoryData?.results || categoryData?.data || []);
      setCompanies(Array.isArray(companyData) ? companyData : companyData?.results || companyData?.data || []);
      setTopics(Array.isArray(topicData) ? topicData : topicData?.results || topicData?.data || []);
    }).catch(() => {
      setQuestions([]);
      setCategories([]);
      setCompanies([]);
      setTopics([]);
    });
  }, []);

  const normalizedQuestions = useMemo(() => questions.map((item) => ({
    id: item.id,
    text: item.question || item.text || '',
    topic: item.topic_details?.name || item.topic?.name || item.topic || '',
    company: item.company_details?.name || item.company?.name || item.company || '',
    difficulty: item.difficulty || '',
    category: item.category_details?.name || item.category?.name || item.category || '',
    tags: Array.isArray(item.tags) ? item.tags : []
  })), [questions]);

  const categoryOptions = useMemo(() => categories.map((category) => ({ id: category.id, name: category.name })), [categories]);
  const resolveCategoryId = (name) => categoryOptions.find((category) => category.name.toLowerCase() === String(name || '').toLowerCase())?.id || null;
  const resolveTopicId = (name, categoryId) => topics.find((topic) => topic.category === categoryId && topic.name.toLowerCase() === String(name || '').toLowerCase())?.id || null;
  const resolveCompanyId = (name) => companies.find((company) => company.name.toLowerCase() === String(name || '').toLowerCase())?.id || null;

  const handleOpenAdd = () => {
    setFormText('');
    setFormTopic('');
    setFormCompany('');
    setFormDiff('Easy');
    setFormCat('Frontend');
    setFormTags('');
    setFormError('');
    setShowAddModal(true);
  };

  const buildPayload = () => ({
    question: formText,
    short_description: formText.slice(0, 240),
    category: resolveCategoryId(formCat),
    topic: resolveTopicId(formTopic, resolveCategoryId(formCat)),
    company: resolveCompanyId(formCompany),
    role: null,
    difficulty: formDiff,
    expected_duration: 30,
    answer_type: 'Text',
    tags: formTags ? formTags.split(',').map(t => t.trim()) : [],
    hints: [],
    reference_links: [],
    expected_answer: '',
    explanation: '',
    source: 'Manual',
    is_active: true
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const categoryId = resolveCategoryId(formCat);
    if (!categoryId) {
      setFormError('Select a backend category first.');
      return;
    }
    try {
      await questionsService.create(buildPayload());
      const refreshed = await questionsService.list();
      setQuestions(Array.isArray(refreshed) ? refreshed : refreshed?.results || refreshed?.data || []);
      setShowAddModal(false);
    } catch (error) {
      setFormError(error?.message || 'Unable to create question.');
    }
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setFormText(q.text);
    setFormTopic(q.topic);
    setFormCompany(q.company);
    setFormDiff(q.difficulty);
    setFormCat(q.category);
    setFormTags(q.tags.join(', '));
    setFormError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const categoryId = resolveCategoryId(formCat);
    if (!categoryId) {
      setFormError('Select a backend category first.');
      return;
    }
    try {
      await questionsService.update(editingQuestion.id, buildPayload());
      const refreshed = await questionsService.list();
      setQuestions(Array.isArray(refreshed) ? refreshed : refreshed?.results || refreshed?.data || []);
      setEditingQuestion(null);
    } catch (error) {
      setFormError(error?.message || 'Unable to update question.');
    }
  };

  const handleDelete = async (id) => {
    const conf = window.confirm('Are you sure you want to delete this question?');
    if (conf) {
      try {
        await questionsService.remove(id);
        const refreshed = await questionsService.list();
        setQuestions(Array.isArray(refreshed) ? refreshed : refreshed?.results || refreshed?.data || []);
      } catch (error) {
        setFormError(error?.message || 'Unable to delete question.');
      }
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await questionsService.export({});
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      await questionsService.import(new FormData());
    } finally {
      setIsImporting(false);
    }
  };

  // Filter & Search Logic
  const filtered = normalizedQuestions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topicFilter === 'all' ? true : q.topic.toLowerCase() === topicFilter.toLowerCase();
    const matchesDiff = diffFilter === 'all' ? true : q.difficulty === diffFilter;
    const matchesCompany = companyFilter ? q.company.toLowerCase().includes(companyFilter.toLowerCase()) : true;

    return matchesSearch && matchesTopic && matchesDiff && matchesCompany;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const cardStyle = theme === 'dark' 
    ? 'bg-dark-card border-dark-border text-gray-200' 
    : 'bg-white border-light-border text-gray-800 shadow-sm';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl">Admin Question Bank</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Maintain technical query catalogs, inject behavioral requirements, or sync with global categories.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="px-4 py-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Upload className="h-4 w-4 text-gray-400" />
            <span>{isImporting ? 'Importing...' : 'Import JSON'}</span>
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="h-4 w-4 text-gray-400" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className={`p-5 rounded-2xl border ${cardStyle} grid grid-cols-1 md:grid-cols-4 gap-4`}>
        <div className="relative flex items-center col-span-1 md:col-span-2">
          <Search className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search questions keyword or topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs focus:outline-none"
          />
        </div>

        <select
          value={diffFilter}
          onChange={(e) => { setDiffFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs focus:outline-none"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <input
          type="text"
          value={companyFilter}
          onChange={(e) => { setCompanyFilter(e.target.value); setCurrentPage(1); }}
          placeholder="Filter by company (e.g. Google)..."
          className="w-full px-3 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Questions Data Grid Table */}
      <div className={`p-6 rounded-2xl border ${cardStyle}`}>
        {paginated.length > 0 ? (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border text-xs text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3.5 px-2 w-[45%]">Question Text</th>
                    <th className="pb-3.5 px-2">Topic</th>
                    <th className="pb-3.5 px-2">Category</th>
                    <th className="pb-3.5 px-2">Company</th>
                    <th className="pb-3.5 px-2">Difficulty</th>
                    <th className="pb-3.5 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {paginated.map((q) => (
                    <tr key={q.id} className="hover:bg-light-hover/20 dark:hover:bg-dark-hover/10 transition-colors">
                      <td className="py-4 px-2">
                        <div className="font-semibold text-gray-800 dark:text-gray-100">{q.text}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {q.tags.map((tag, idx) => (
                            <span key={idx} className="text-[9px] px-1.5 py-0.2 bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border rounded text-gray-400 font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-2 font-medium">{q.topic}</td>
                      <td className="py-4 px-2">{q.category}</td>
                      <td className="py-4 px-2 font-semibold text-indigo-500">{q.company}</td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          q.difficulty === 'Hard' ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' :
                          q.difficulty === 'Medium' ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500' :
                          'border-green-500/20 bg-green-500/5 text-green-500'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(q)}
                            className="p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg text-gray-400 hover:text-indigo-500"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg text-gray-400 hover:text-rose-500"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-light-border dark:border-dark-border pt-4 text-xs font-semibold text-gray-500">
                <span>Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} questions</span>
                
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">No questions found matching your search parameter.</div>
        )}
      </div>

      {/* Add / Edit Modal Drawer */}
      {(showAddModal || editingQuestion) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl overflow-hidden shadow-2xl p-6 relative">
            
            <button
              onClick={() => { setShowAddModal(false); setEditingQuestion(null); }}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-display font-bold mb-4">
              {showAddModal ? 'Add New Interview Question' : 'Edit Question Parameter'}
            </h3>

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 text-xs">
                  {formError}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Question Content</label>
                <textarea
                  required
                  rows={4}
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs leading-relaxed"
                  placeholder="Explain how..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Topic Area</label>
                  <input
                    type="text"
                    required
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="e.g. React.js"
                    className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Target Company</label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Difficulty</label>
                  <select
                    value={formDiff}
                    onChange={(e) => setFormDiff(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Category</label>
                  <select
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg focus:outline-none"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="System Design">System Design</option>
                    <option value="Behavioral">Behavioral</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Tags (comma split)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="state, props"
                    className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingQuestion(null); }}
                  className="px-4 py-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
                >
                  Confirm Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
