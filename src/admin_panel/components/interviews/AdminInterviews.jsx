import React, { useState, useEffect } from 'react';
import ApiService from '../../service/Apiservice';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaBriefcase, FaEdit, FaDatabase } from 'react-icons/fa';

const AdminInterviews = () => {
  const [categories, setCategories] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = () => {
    setLoading(true);
    ApiService.getInterviews()
      .then(res => {
        const data = res.data || res;
        setCategories(data.categories || []);
        setTotalSessions(data.total_sessions || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Category name is required.");
      return;
    }
    
    const payload = { name, description };
    try {
      if (editCat) {
        await ApiService.updateCategory({ id: editCat.id, ...payload });
      } else {
        await ApiService.createCategory(payload);
      }
      setShowModal(false);
      setEditCat(null);
      fetchCategories();
    } catch (err) {
      alert("Failed to save category.");
    }
  };

  const handleToggleCategory = async (id, is_active) => {
    try {
      await ApiService.updateCategory({ id, is_active });
      fetchCategories();
    } catch (err) {
      alert("Failed to toggle category active status.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? All associated questions might lose their category reference.")) return;
    try {
      await ApiService.deleteCategory({ id });
      fetchCategories();
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  const openCreateModal = () => {
    setEditCat(null);
    setName('');
    setDescription('');
    setShowModal(true);
  };

  const openEditModal = (c) => {
    setEditCat(c);
    setName(c.name);
    setDescription(c.description || '');
    setShowModal(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-gray-800 dark:text-gray-200">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-display">Interview Categories</h2>
          <p className="text-xs text-gray-400 mt-1">Configure language templates, job categories, and track simulated sessions count.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex items-center gap-4">
          <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <FaBriefcase className="text-lg" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">Total Categories</div>
            <div className="text-xl font-bold font-display mt-0.5">{categories.length}</div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <FaDatabase className="text-lg" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">Simulated Sessions Conducted</div>
            <div className="text-xl font-bold font-display mt-0.5">{totalSessions} sessions</div>
          </div>
        </div>
      </div>

      {/* Categories table */}
      <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-xs text-gray-400">Loading templates...</div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border text-xs text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-2">Order</th>
                  <th className="pb-3 px-2">Category Name</th>
                  <th className="pb-3 px-2">Description</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {categories.map((c, i) => (
                  <tr key={c.id} className="hover:bg-light-hover/10 dark:hover:bg-dark-hover/10">
                    <td className="py-3.5 px-2 font-mono text-gray-400">{c.display_order || i + 1}</td>
                    <td className="py-3.5 px-2 font-bold text-gray-800 dark:text-gray-200">{c.name}</td>
                    <td className="py-3.5 px-2 text-gray-600 dark:text-gray-300 max-w-sm truncate">{c.description || "No description provided."}</td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        c.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {c.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded text-gray-400 hover:text-indigo-400 transition-colors"
                          title="Modify details"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleToggleCategory(c.id, !c.is_active)}
                          className={`p-2 rounded hover:bg-light-hover dark:hover:bg-dark-hover transition-colors ${
                            c.is_active ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                          title={c.is_active ? 'Disable Category' : 'Enable Category'}
                        >
                          {c.is_active ? <FaTimes /> : <FaCheck />}
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
                          className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded text-gray-400 hover:text-rose-400 transition-colors"
                          title="Delete category"
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
        ) : (
          <div className="text-center py-8 text-gray-400 text-xs">No categories available.</div>
        )}
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl p-6 relative text-gray-800 dark:text-gray-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-md font-bold font-display mb-4">{editCat ? 'Modify Category' : 'Add New Category'}</h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-gray-400 block">Category name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  placeholder="Details detailing questions in this template..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg mt-2"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInterviews;
