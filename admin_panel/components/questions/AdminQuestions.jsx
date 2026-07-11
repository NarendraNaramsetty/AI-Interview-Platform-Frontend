import React, { useState, useEffect } from 'react';
import ApiService from '../../service/Apiservice';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaEdit, FaUpload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [catId, setCatId] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState(5);

  // Bulk Upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchQuestions = () => {
    setLoading(true);
    ApiService.getQuestions({
      search,
      category: categoryFilter,
      difficulty: difficultyFilter,
      page,
      page_size: pageSize
    })
      .then(res => {
        const data = res.data || res;
        setQuestions(data.results || []);
        setTotalCount(data.total_count || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    ApiService.getInterviews()
      .then(res => {
        const data = res.data || res;
        setCategories(data.categories || []);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchQuestions();
  }, [search, categoryFilter, difficultyFilter, page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionText || !catId) {
      alert("Question prompt and Category are required.");
      return;
    }

    const payload = {
      question: questionText,
      category_id: parseInt(catId),
      difficulty,
      expected_duration: parseInt(duration)
    };

    try {
      if (editQuestion) {
        await ApiService.updateQuestion({ id: editQuestion.id, ...payload });
      } else {
        await ApiService.createQuestion(payload);
      }
      setShowModal(false);
      setEditQuestion(null);
      fetchQuestions();
    } catch (err) {
      alert("Failed to save question.");
    }
  };

  const handleToggleQuestion = async (id, is_active) => {
    try {
      await ApiService.updateQuestion({ id, is_active });
      fetchQuestions();
    } catch (err) {
      alert("Failed to toggle question status.");
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question prompt?")) return;
    try {
      await ApiService.deleteQuestion({ id });
      fetchQuestions();
    } catch (err) {
      alert("Failed to delete question.");
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please choose a CSV file to upload.");
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await ApiService.uploadQuestionsCSV(formData);
      const data = res.data || res;
      alert(data.message || "Bulk upload completed successfully.");
      setShowUploadModal(false);
      setSelectedFile(null);
      fetchQuestions();
    } catch (err) {
      alert("Failed to upload CSV file.");
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setEditQuestion(null);
    setQuestionText('');
    setCatId(categories[0]?.id || '');
    setDifficulty('Medium');
    setDuration(5);
    setShowModal(true);
  };

  const openEditModal = (q) => {
    setEditQuestion(q);
    setQuestionText(q.question);
    setCatId(q.category_id || '');
    setDifficulty(q.difficulty);
    setDuration(q.expected_duration);
    setShowModal(true);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-gray-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-display">System Question Bank</h2>
          <p className="text-xs text-gray-400 mt-1">Audit mock questions, define prompts, and manage CSV bulk inserts.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-1.5 border border-light-border dark:border-dark-border"
          >
            <FaUpload /> CSV Import
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
          >
            <FaPlus /> Add Question
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm text-xs font-semibold">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search questions by text prompt..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full px-4 py-2.5 rounded-lg border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg focus:outline-none text-gray-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 md:w-80">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg focus:outline-none text-gray-300"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => { setDifficultyFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-bg focus:outline-none text-gray-300"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions list */}
      <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-xs text-gray-400">Loading catalog items...</div>
        ) : questions.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border text-xs text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-2">Question Prompt</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Difficulty</th>
                    <th className="pb-3 px-2">Duration</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {questions.map(q => (
                    <tr key={q.id} className="hover:bg-light-hover/10 dark:hover:bg-dark-hover/10">
                      <td className="py-3.5 px-2 max-w-md truncate font-medium text-gray-200">{q.question}</td>
                      <td className="py-3.5 px-2 text-gray-400 font-semibold">{q.category_name}</td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          q.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 font-semibold text-gray-400">{q.expected_duration} min</td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          q.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {q.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEditModal(q)}
                            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded text-gray-400 hover:text-indigo-400 transition-colors"
                            title="Edit prompt"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleToggleQuestion(q.id, !q.is_active)}
                            className={`p-2 rounded hover:bg-light-hover dark:hover:bg-dark-hover transition-colors ${
                              q.is_active ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                            title={q.is_active ? 'Disable Question' : 'Enable Question'}
                          >
                            {q.is_active ? <FaTimes /> : <FaCheck />}
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded text-gray-400 hover:text-rose-400 transition-colors"
                            title="Delete question"
                          >
                            <FaTrash />
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
              <div className="flex items-center justify-between border-t border-light-border dark:border-dark-border pt-4 text-xs font-semibold text-gray-400">
                <span>Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg disabled:opacity-40"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg disabled:opacity-40"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-xs">No questions loaded.</div>
        )}
      </div>

      {/* Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl p-6 relative text-gray-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-md font-bold font-display mb-4">{editQuestion ? 'Modify Question Prompt' : 'Create Question'}</h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-gray-400 block">Question Prompt</label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  placeholder="Enter simulated prompt..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 block">Category</label>
                  <select
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none text-gray-300 font-semibold"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 block">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none text-gray-300"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 block">Estimated Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg mt-2"
              >
                Save Question
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl p-6 relative text-gray-200">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-md font-bold font-display mb-2">CSV Bulk Importer</h3>
            <p className="text-[10px] text-gray-400 mb-4">Upload a CSV formatted file. Column headers must be: Question, Category, Difficulty, Duration.</p>

            <form onSubmit={handleBulkUpload} className="space-y-4 text-xs font-semibold">
              <div className="border border-dashed border-light-border dark:border-dark-border p-6 rounded-lg text-center bg-light-hover/10 dark:bg-dark-bg">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                  id="csv-file-picker"
                  required
                />
                <label htmlFor="csv-file-picker" className="cursor-pointer text-indigo-400 block hover:underline">
                  {selectedFile ? selectedFile.name : "Choose CSV file..."}
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:opacity-50"
                disabled={uploading}
              >
                {uploading ? "Parsing file..." : "Import Database"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;
