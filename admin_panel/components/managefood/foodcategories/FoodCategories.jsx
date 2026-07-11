import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FoodCategories.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import Swal from 'sweetalert2';
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faFilter, faUtensils, faPlus, faEdit, 
  faTrash, faTimes, faCheck
} from "@fortawesome/free-solid-svg-icons";

const FoodCategories = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => { 
    localStorage.clear();
    sessionStorage.clear();
    toast.info("You have been logged out", { autoClose: 1000 });
    navigate("/adminlogin");
  };

  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category_name: '',
    status: 1
  });

  // Fetch categories from backend
  const fetchCategories = async () => {
    setLoading(true);

    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm,
        status: statusFilter === "all" ? null : (statusFilter === "active" ? 1 : 0)
      };

      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.getFoodCategoryDataTable(payload);
      const data = response.data;

      if (data.status === "success") {
        setCategories(data.data || []);
        setTotalCategories(data.total_records || 0);
      } else {
        toast.error(data.message || "Failed to load categories");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(error);
      toast.error("❌ Error fetching categories");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [statusFilter, searchTerm, currentPage, entriesPerPage]);

  // Handle submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      category_name: formData.category_name,
      status: formData.status
    };

    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      let response;

      if (editingCategory) {
        // UPDATE
        response = await ApiService.updateFoodCategory(editingCategory.category_id, payload);
      } else {
        // CREATE
        response = await ApiService.createFoodCategory(payload);
      }

      const data = response.data;

      if (data.status === "success") {
        toast.success(editingCategory ? "✅ Category updated successfully!" : "✅ Category added successfully!");
        fetchCategories();
        handleCloseForm();
      } else {
        toast.error(data.message || "⚠️ Failed to save category.");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error("Category save error:", error);
      toast.error("❌ Something went wrong while saving category.");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      category_name: category.category_name,
      status: category.status
    });
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this category?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await ApiService.deleteFoodCategory(categoryId);
        const data = response.data;

        if (data.status === "success") {
          toast.success("🗑️ Category deleted successfully!");
          fetchCategories();
        } else {
          toast.error(data.message || "⚠️ Failed to delete category.");
        }
      } catch (error) {
        if (error.response?.data?.code === "token_not_valid") {
          toast.error("Session expired. Please login again.", { autoClose: 1000 });
          handleLogout();
          return;
        }
        console.error("Category delete error:", error);
        toast.error("❌ Something went wrong while deleting the category.");
      }
    }
  };

  const handleToggleStatus = async (categoryId) => {
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.toggleFoodCategoryStatus(categoryId);
      const data = response.data;

      if (data.status === "success") {
        toast.success("✅ Category status updated!");
        fetchCategories();
      } else {
        toast.error(data.message || "⚠️ Failed to toggle status.");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error("Status toggle error:", error);
      toast.error("❌ Something went wrong while toggling status.");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      category_name: '',
      status: 1
    });
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCategories / entriesPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 10;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <span className={styles.statusActive}>
        <FontAwesomeIcon icon={faCheck} /> Active
      </span>
    ) : (
      <span className={styles.statusInactive}>
        <FontAwesomeIcon icon={faTimes} /> Inactive
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <ToastContainer 
        position="top-right"
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <FontAwesomeIcon icon={faUtensils} className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>Food Categories</h2>
              <p className={styles.subtitle}>Manage food categories for your restaurant menu</p>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.userBadge}>Admin</div>
          <button className={styles.primaryButton} onClick={() => setShowForm(true)}>
            <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconTotal}`}>
            <FontAwesomeIcon icon={faUtensils} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalCategories}</span>
            <span className={styles.statLabel}>Total Categories</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconActive}`}>
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {categories.filter(c => c.status === 1).length}
            </span>
            <span className={styles.statLabel}>Active</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconInactive}`}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {categories.filter(c => c.status === 0).length}
            </span>
            <span className={styles.statLabel}>Inactive</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersCard}>
        <div className={styles.filterRow}>
          <div className={styles.searchBox}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search categories by name..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading categories...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className="table table-bordered table-hover mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th className={styles.table_head}>S.No</th>
                <th className={styles.table_head}>Category Name</th>
                <th className={styles.table_head}>Status</th>
                <th className={styles.table_head}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.emptyRow}>No categories found.</td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr key={category.category_id}>
                    <td className={styles.serialNumber}>
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className={styles.categoryNameCell}>
                      <strong>{category.category_name}</strong>
                    </td>
                    <td className={styles.statusCell}>
                      {getStatusBadge(category.status)}
                    </td>
                    <td className={styles.actionsCell}>
                      <button 
                        className={styles.editButton} 
                        onClick={() => handleEdit(category)}
                        title="Edit Category"
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button 
                        className={styles.toggleButton} 
                        onClick={() => handleToggleStatus(category.category_id)}
                        title="Toggle Status"
                      >
                        <FontAwesomeIcon icon={category.status === 1 ? faTimes : faCheck} />
                        {category.status === 1 ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        className={styles.deleteButton} 
                        onClick={() => handleDelete(category.category_id)}
                        title="Delete Category"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.tableFooter}>
            <div className={styles.pageInfo}>
              Showing {(categories.length > 0) ? ((currentPage - 1) * entriesPerPage + 1) : 0} to{" "}
              {Math.min(currentPage * entriesPerPage, totalCategories)} of {totalCategories} entries
            </div>
            <div className={styles.pagination}>
              <button 
                onClick={() => setCurrentPage(currentPage - 1)} 
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                Previous
              </button>
              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`${styles.pageButton} ${currentPage === p ? styles.pageButtonActive : ''}`}
                >
                  {p}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>
            <div className={styles.entriesControl}>
              <label>Show</label>
              <select value={entriesPerPage} onChange={handleEntriesChange} className={styles.entriesSelect}>
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span>entries</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FontAwesomeIcon icon={faUtensils} />{' '}
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button className={styles.closeButton} onClick={handleCloseForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category Name *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  placeholder="e.g., Appetizers, Main Course, Desserts"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Status *</label>
                <select
                  className={styles.formInput}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                  required
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseForm}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  <FontAwesomeIcon icon={faCheck} />{' '}
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodCategories;
