import React, { useState, useEffect } from 'react';
import styles from './PostStatus.module.css';
import Swal from 'sweetalert2';

const poststatus = () => {
  const [poststatuss, setpoststatuss] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingpoststatus, setEditingpoststatus] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalpoststatuss, setTotalpoststatuss] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    status_name: '',
    status_color: '',
    description: '',
    status: 'active'
  });

  // 🔹 Fetch poststatuss from backend
  const fetchPoststatus = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm,
        is_active: filter === 'all' ? null : filter === 'active'
      };

      const response = await fetch("http://127.0.0.1:8000/api/setting/poststatustype/datatable/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log("poststatus datatable response:", data);

      if (response.ok && data.status === "success") {
        setpoststatuss(
          (data.data || []).map((poststatus) => {
            const activeBool = poststatus.is_active === 1 || poststatus.is_active === true;
            return {
              id: poststatus.id,
              status_name: poststatus.status_name,
              status_color: poststatus.status_color,
              description: poststatus.description ?? poststatus.description,
              status: activeBool ? 'active' : 'inactive',
            };
          })
        );
        setTotalpoststatuss(data.recordsTotal || data.data.length || 0);
      } else {
        Swal.fire('Error', data.message || "Failed to load poststatuss.", 'error');
      }
    } catch (error) {
      console.error("poststatus fetch error:", error);
      Swal.fire('Error', "Failed to load poststatus data.", 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPoststatus();
  }, [filter, searchTerm, currentPage, entriesPerPage]);

  // 🔹 Add poststatus
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.status_name || !formData.description) {
    Swal.fire('Warning', 'Please fill in required fields: Status Name and Description.', 'warning');
    return;
  }

  const payload = {
    status_name: formData.status_name,
    status_color: formData.status_color || "settings",
    description: String(formData.description).trim(),
  };

  try {
    let url = "http://127.0.0.1:8000/api/setting/poststatustype/";
    let method = "POST";

    // If editing existing poststatus → use PUT
    if (editingpoststatus) {
      url = `http://127.0.0.1:8000/api/setting/poststatustype/${editingpoststatus.id}/`;
      method = "PUT";
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Post Status type save response:", data);

    if (response.ok && data.status === "success") {
      Swal.fire('Success', editingpoststatus ? "Post Status type updated successfully!" : "Post Status type added successfully!", 'success');
      fetchPoststatus(); // refresh the datatable
      handleCloseForm();
    } else {
      Swal.fire('Error', data.message || "Failed to save poststatus.", 'error');
    }
  } catch (error) {
    console.error("poststatus save error:", error);
    Swal.fire('Error', "Something went wrong while saving poststatus.", 'error');
  }
};

const handleEdit = (poststatus) => {
  setFormData({
    status_name: poststatus.status_name,
    status_color: poststatus.status_color,
    description: poststatus.description,
  });
  setEditingpoststatus(poststatus); // keep track of which poststatus is being edited
  setShowForm(true);
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "Are you sure you want to delete this poststatus?",
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
      const response = await fetch(`http://127.0.0.1:8000/api/setting/poststatustype/delete/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      const data = await response.json();
      console.log("Post status delete response:", data);

      if (response.ok && data.status === "success") {
        Swal.fire('Deleted!', "Post status deleted successfully!", 'success');
        fetchPoststatus(); // refresh poststatus list
      } else {
        Swal.fire('Error', data.message || "Failed to delete poststatus.", 'error');
      }
    } catch (error) {
      console.error("poststatus delete error:", error);
      Swal.fire('Error', "Something went wrong while deleting the poststatus.", 'error');
    }
  }
};


  const handleCloseForm = () => {
    setShowForm(false);
    setEditingpoststatus(null);
    setFormData({
      status_name: '',
      status_color: '',
      description: "",
      status: 'active'
    });
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const toggleStatus = async (id, newStatus) => {
    const row = poststatuss.find((m) => m.id === id);
    if (!row) throw new Error('poststatus not found');

    const originalStatus = row.status;
    const desiredBool = newStatus === 'active';

    // Optimistic update
    setpoststatuss(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/setting/poststatustype/toggle-active/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ is_active: desiredBool }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('Toggle response:', data);

      if (data.status === "success") {
        // Support both shapes: {data: {is_active}} or {is_active}
        const isActiveVal =
          (data && data.data && typeof data.data.is_active !== 'undefined')
            ? data.data.is_active
            : (typeof data.is_active !== 'undefined' ? data.is_active : null);

        const finalIsActive = (isActiveVal !== null) ? !!isActiveVal : desiredBool; // fallback to requested
        const serverStatus = finalIsActive ? 'active' : 'inactive';
        setpoststatuss(prev => prev.map(m => m.id === id ? { ...m, status: serverStatus } : m));
        return serverStatus;
      }
      throw new Error(data.message || 'Failed to update status on server');
    } catch (error) {
      console.error('Error toggling status:', error);
      // Rollback on error
      setpoststatuss(prev => prev.map(m => m.id === id ? { ...m, status: originalStatus } : m));
      Swal.fire('Error', 'Could not update status. ' + error.message, 'error');
      throw error;
    }
  };

  // StatusToggle Component with proper toggle handling
  const StatusToggle = ({ poststatus, onToggle }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [localStatus, setLocalStatus] = useState(poststatus.status);

    // Update local status when poststatus prop changes
    useEffect(() => {
      setLocalStatus(poststatus.status);
    }, [poststatus.status]);

    const handleClick = async (e) => {
      e.stopPropagation(); // Prevent any parent event handlers
      if (isLoading) return; // Prevent multiple clicks
      
      const newStatus = localStatus === 'active' ? 'inactive' : 'active';
      setLocalStatus(newStatus);
      setIsLoading(true);
      
      try {
        // Wait for the toggle to complete and get the final status
        const finalStatus = await onToggle(poststatus.id, newStatus);
        // Update local status with the final status from the server
        setLocalStatus(finalStatus);
      } catch (error) {
        // Revert on error
        setLocalStatus(poststatus.status);
        console.error('Toggle error:', error);
        Swal.fire('Error', error.message || 'Failed to update status', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div 
        className={`${styles.statusToggle} ${isLoading ? styles.loading : ''}`}
        onClick={handleClick}
      >
        <div className={`${styles.toggleSwitch} ${styles[localStatus]}`}>
          <div className={styles.toggleKnob}></div>
        </div>
        <span className={`${styles.statusText} ${styles[localStatus]}`}>
          {localStatus === 'active' ? 'Active' : 'Inactive'}
          {isLoading && <span className={styles.loadingSpinner}></span>}
        </span>
      </div>
    );
  };

  const totalPages = Math.ceil(totalpoststatuss / entriesPerPage);
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 10;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>poststatus Management</h2>
          <p className={styles.subtitle}>Configure and manage navigation poststatuss</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.userBadge}>Admin</div>
          <button className={styles.primaryButton} onClick={() => setShowForm(true)}>
            <span className={styles.buttonIcon}>+</span>
            Create Post Status Type
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search post status by name..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.searchButton} onClick={() => setCurrentPage(1)}>Search</button>
        </div>

        <div className={styles.filterButtons}>
          {['all', 'active', 'inactive'].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingText}>Loading poststatuss...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Status Name</th>
                <th>Status Color</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {poststatuss.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyRow}>No poststatuss found.</td>
                </tr>
              ) : (
                poststatuss.map((poststatus, index) => (
                  <tr key={poststatus.id}>
                    <td className={styles.serialNumber}>
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className={styles.poststatusNameCell}>
                      <strong>{poststatus.status_name}</strong>
                    </td>
                    <td className={styles.iconCell}>
                      <span className={styles.poststatusIcon}>{poststatus.status_color}</span>
                    </td>
                    <td className={styles.orderCell}>{poststatus.description}</td>
                    <td className={styles.statusCell}>
                      <StatusToggle poststatus={poststatus} onToggle={toggleStatus} />
                    </td>
                    <td className={styles.actionsCell}>
                      <button 
                        className={styles.editButton} 
                        onClick={() => handleEdit(poststatus)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton} 
                        onClick={() => handleDelete(poststatus.id)}
                      >
                        Delete
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
              Showing {(poststatuss.length > 0) ? ((currentPage - 1) * entriesPerPage + 1) : 0} to{" "}
              {Math.min(currentPage * entriesPerPage, totalpoststatuss)} of {totalpoststatuss} entries
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
                {[5, 10, 25, 50].map((n) => (
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
                {editingpoststatus ? 'Edit poststatus' : 'Create poststatus'}
              </h3>
              <button className={styles.closeButton} onClick={handleCloseForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status Name *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.status_name}
                    onChange={(e) => setFormData({ ...formData, status_name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status Color</label>
                  <div className={styles.iconSelector}>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={formData.status_color}
                      onChange={(e) => setFormData({ ...formData, status_color: e.target.value })}
                    />
                    <span className={styles.iconPreview}>{formData.status_color}</span>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseForm}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingpoststatus ? 'Update poststatus' : 'Add poststatus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default poststatus;
