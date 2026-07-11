import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Fooditems.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import Swal from 'sweetalert2';
import "react-toastify/dist/ReactToastify.css";
import { getPermissions } from '../../../utils/permissionHelper.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faUtensils,
  faSearch,
  faIndianRupeeSign,
  faList
} from '@fortawesome/free-solid-svg-icons';

const Fooditems = () => {
  const permissions = getPermissions('/managefood/fooditems');
  const navigate = useNavigate();
  
  const handleLogout = () => { 
    localStorage.clear();
    sessionStorage.clear();
    toast.info("You have been logged out", { autoClose: 1000 });
    setTimeout(() => navigate("/adminlogin"), 1000);
  };

  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [formData, setFormData] = useState({
    food_name: '',
    category_id: '',
    price: '',
    description: '',
    status: 1
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      const response = await ApiService.getAllFoodCategories();
      const data = response.data;
      
      if (data.status === "success") {
        setCategories(data.data || []);
      }
    } catch (err) {
      if (err.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch food items
  const fetchFoodItems = async () => {
    setLoading(true);

    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm,
        category_id: selectedCategory || null
      };

      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.getFoodItemDataTable(payload);
      const data = response.data;

      if (data.status === "success") {
        const items = (data.data || []).map((item) => ({
          id: item.food_id,
          name: item.food_name,
          category: item.category_name || 'N/A',
          category_id: item.category_id,
          price: parseFloat(item.price || 0),
          description: item.description || '',
          status: item.status === 1 ? "active" : "inactive"
        }));

        setFoodItems(items);
        setTotalItems(data.total_records);

        // Calculate stats
        setStats({
          total: data.total_records,
          active: data.active_records || 0,
          inactive: data.inactive_records || 0
        });
      } else {
        toast.error(data.message || "Failed to load food items");
      }
    } catch (err) {
      if (err.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(err);
      toast.error("❌ Error fetching food items");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFoodItems();
  }, [filter, searchTerm, currentPage, entriesPerPage, selectedCategory]);

  // Handle form submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.food_name.trim()) {
      toast.error("Food name is required");
      return;
    }

    if (!formData.category_id) {
      toast.error("Category is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    const payload = {
      food_name: formData.food_name.trim(),
      category_id: parseInt(formData.category_id),
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      status: formData.status
    };

    try {
      let response;

      if (editingItem) {
        response = await ApiService.updateFoodItem(editingItem.id, payload);
      } else {
        response = await ApiService.addFoodItem(payload);
      }

      const data = response.data;

      if (data.status === "success") {
        toast.success(editingItem ? "✅ Food item updated successfully!" : "✅ Food item added successfully!");
        fetchFoodItems();
        handleCloseForm();
      } else {
        toast.error(data.message || "⚠️ Failed to save food item.");
      }
    } catch (err) {
      if (err.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error("Food item save error:", err);
      toast.error(err.response?.data?.message || "❌ Something went wrong while saving food item.");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      food_name: item.name,
      category_id: item.category_id,
      price: item.price,
      description: item.description,
      status: item.status === 'active' ? 1 : 0
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this food item?",
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
        const response = await ApiService.deleteFoodItem(id);
        const data = response.data;

        if (data.status === "success") {
          toast.success("🗑️ Food item deleted successfully!");
          fetchFoodItems();
        } else {
          toast.error(data.message || "⚠️ Failed to delete food item.");
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          toast.error("Session expired. Please login again.", { autoClose: 1000 });
          handleLogout();
          return;
        }
        console.error("Food item delete error:", err);
        toast.error("❌ Something went wrong while deleting the food item.");
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      food_name: '',
      category_id: '',
      price: '',
      description: '',
      status: 1
    });
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const toggleStatus = async (id) => {
    const item = foodItems.find((i) => i.id === id);
    if (!item) {
      toast.error("Food item not found");
      return;
    }

    const originalStatus = item.status;

    try {
      const response = await ApiService.toggleFoodItemActive(id);
      const data = response.data;

      if (data.status === "success") {
        const newStatus = data.data.status === 1 ? "active" : "inactive";
        setFoodItems(prev =>
          prev.map(i => (i.id === id ? { ...i, status: newStatus } : i))
        );
        toast.success(`✅ Food item ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
        fetchFoodItems(); // Refresh to update stats
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (err) {
      if (err.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error("Error toggling status:", err);
      setFoodItems(prev =>
        prev.map(i => (i.id === id ? { ...i, status: originalStatus } : i))
      );
      toast.error(`❌ Error updating status: ${err.message}`);
    }
  };

  const StatusToggle = ({ item }) => {
    const [localStatus, setLocalStatus] = useState(item.status || 'inactive');

    useEffect(() => {
      setLocalStatus(item.status || 'inactive');
    }, [item.status]);

    const handleClick = async () => {
      if (!permissions.edit) {
        toast.warning("You do not have permission to edit food items");
        return;
      }
      await toggleStatus(item.id);
    };

    return (
      <div className={styles.statusToggle} onClick={handleClick}>
        <div className={`${styles.toggleSwitch} ${styles[localStatus]}`}>
          <div className={styles.toggleKnob}></div>
        </div>
        <span className={`${styles.statusText} ${styles[localStatus]}`}>
          {localStatus === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>
    );
  };

  const totalPages = Math.ceil(totalItems / entriesPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 10;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // Filtered items for display based on filter
  const displayedItems = foodItems.filter(item => {
    if (filter === 'active') return item.status === 'active';
    if (filter === 'inactive') return item.status === 'inactive';
    return true;
  });

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
          <div className={styles.iconTitleWrapper}>
            <div className={styles.headerIcon}>
              <FontAwesomeIcon icon={faUtensils} />
            </div>
            <div>
              <h2 className={styles.title}>Food Items Management</h2>
              <p className={styles.subtitle}>Manage your menu items with categories and pricing</p>
            </div>
          </div>
        </div>
        {permissions.add && (
          <button className={styles.primaryButton} onClick={() => setShowForm(true)}>
            <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} />
            Add Food Item
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.totalCard}`}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faUtensils} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Items</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.activeCard}`}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faUtensils} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>Active Items</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.inactiveCard}`}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faUtensils} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.inactive}</div>
            <div className={styles.statLabel}>Inactive Items</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search food items..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className={styles.filterGroup}>
          <select 
            className={styles.categoryFilter}
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <div className={styles.filterButtons}>
            {['all', 'active', 'inactive'].map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                onClick={() => { setFilter(f); setCurrentPage(1); }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading food items...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Food Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.emptyRow}>
                    <FontAwesomeIcon icon={faUtensils} size="3x" className={styles.emptyIcon} />
                    <p>No food items found.</p>
                  </td>
                </tr>
              ) : (
                displayedItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className={styles.serialNumber}>
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className={styles.nameCell}>
                      <strong>{item.name}</strong>
                    </td>
                    <td className={styles.categoryCell}>
                      <span className={styles.categoryBadge}>
                        <FontAwesomeIcon icon={faList} /> {item.category}
                      </span>
                    </td>
                    <td className={styles.priceCell}>
                      <span className={styles.priceTag}>
                        <FontAwesomeIcon icon={faIndianRupeeSign} />
                        {item.price.toFixed(2)}
                      </span>
                    </td>
                    <td className={styles.descriptionCell}>
                      {item.description || 'No description'}
                    </td>
                    <td className={styles.statusCell}>
                      <StatusToggle item={item} />
                    </td>
                    <td className={styles.actionsCell}>
                      {permissions.edit && (
                        <button 
                          className={styles.editButton} 
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}
                      {permissions.delete && (
                        <button 
                          className={styles.deleteButton} 
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.tableFooter}>
            <div className={styles.pageInfo}>
              Showing {displayedItems.length > 0 ? ((currentPage - 1) * entriesPerPage + 1) : 0} to{" "}
              {Math.min(currentPage * entriesPerPage, totalItems)} of {totalItems} entries
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
        <div className={styles.modalOverlay} onClick={handleCloseForm}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FontAwesomeIcon icon={editingItem ? faEdit : faPlus} className={styles.modalIcon} />
                {editingItem ? 'Edit Food Item' : 'Add Food Item'}
              </h3>
              <button className={styles.closeButton} onClick={handleCloseForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Food Name *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.food_name}
                    onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
                    placeholder="Enter food name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category *</label>
                  <select
                    className={styles.formInput}
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={styles.formInput}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status</label>
                  <select
                    className={styles.formInput}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    className={styles.formTextarea}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter food description"
                    rows="3"
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseForm}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingItem ? 'Update Food Item' : 'Add Food Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fooditems;
