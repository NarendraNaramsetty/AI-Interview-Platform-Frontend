
import styles from './Role.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import Swal from 'sweetalert2';
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect, useRef } from 'react';
import useClickOutside from "../../../hooks/useClickOutside";
const Role = () => {
  const modalRef = useRef(null);
  useClickOutside(modalRef, () => setShowForm(false));
  const handleLogout = () => { 
  localStorage.clear();
  sessionStorage.clear();
  toast.info("You have been logged out", { autoClose: 1000 });
  navigate("/adminlogin");
};
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userRole = user?.id_role || "";
  
  const [Role, setRole] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingrole, setEditingrole] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRole, setTotalRole] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 const [formData, setFormData] = useState({
  name: '',
  description: '',
  icon: '📄',
  order: 1,
  status: 'active'
});
 const [permissions, setPermissions] = useState({
  add: false,
  edit: false,
  delete: false,
  view: false
});
const [formErrors, setFormErrors] = useState({
  name: "",
  description: ""
});
  // Set permissions from menu data
  useEffect(() => {
    const menuData = JSON.parse(localStorage.getItem("sidebarMenu")) || []; 
    let collegePerm = { add: false, edit: false, delete: false, view: false };
    console.log(menuData)
    for (const menu of menuData) {
  
       console.log("-----",menu.submenus)
      if (!menu.submenus) continue;
      const sub = menu.submenus.find(sm => sm.path === "/settings/role");
      console.log("sub")
  
      if (sub) {
        collegePerm = {
          add: sub.add,
          edit: sub.edit,
          delete: sub.delete,
          view: sub.view
        };
        break;
      }
    }
    setPermissions(collegePerm);
  }, []);
  
     const getWelcomeText = () => {
    return "Welcome back! Here's your system overview";
};
  // 🔹 Fetch Role from backend
  const fetchRole = async () => {
    setLoading(true);

    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: debouncedSearch,
        id_role:userRole,
        is_active: filter === "all" ? null : filter === "active",
      };

      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.getRoleDataTable(payload);
      const data = response.data;

      if (data.status === "success") {
        setRole(
          (data.data || []).map((role) => ({
            id: role.id_role,
            name: role.name,
            description: role.description,
            is_active: role.is_active, // keep original boolean
            status: role.is_active ? "active" : "inactive", // string for display
          }))
        );

        setTotalRole(data.total_records);
      } else {
        toast.error(data.message || "Failed to load Role");
      }
    } catch (error) {
       if (err.response?.data?.code === "token_not_valid") {
            toast.error("Session expired. Please login again.", { autoClose: 1000 });
            handleLogout();
            return;
          }
      console.error(error);
       toast.error("❌ Error fetching role data");
    }

    setLoading(false);
  };


  useEffect(() => {
    fetchRole();
  }, [filter, debouncedSearch, currentPage, entriesPerPage]);

  // 🔹 Add role
const handleSubmit = async (e) => {
  e.preventDefault();

  let errors = {};

  if (!formData.name.trim()) {
    errors.name = "Role name is required";
  }

  if (!formData.description.trim()) {
    errors.description = "Description is required";
  }

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return; // ⛔ stop API call
  }

  setFormErrors({ name: "", description: "" });

  const payload = {
    name: formData.name,
    description: formData.description,
  };

  try {
    let response;

    if (editingrole) {
      response = await ApiService.updateRole(editingrole.id, payload);
    } else {
      response = await ApiService.addRole(payload);
    }

    const data = response.data;

    if (data.status === "success") {
      toast.success(editingrole ? "✅ role updated successfully!" : "✅ role added successfully!");
      fetchRole();
      handleCloseForm();
    } else {
      toast.error(data.message || "⚠️ Failed to save role.");
    }
  } catch (error) {
    toast.error("❌ Something went wrong while saving role.");
  }
};

const handleEdit = (role) => {
  setFormData({
    name: role.name,
    description: role.description
  });
  setEditingrole(role); // keep track of which role is being edited
  setShowForm(true);
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "Are you sure you want to delete this role?",
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
      const response = await ApiService.deleteRole(id);
      const data = response.data;

      if (data.status === "success") {
         toast.success("🗑️ role deleted successfully!");
        fetchRole();
      } else {
        toast.error(data.message || "⚠️ Failed to delete role.");
      }
    } catch (error) {
       if (error.response?.data?.code === "token_not_valid") {
            toast.error("Session expired. Please login again.", { autoClose: 1000 });
            handleLogout();
            return;
          }
      console.error("role delete error:", error);
       toast.error("❌ Something went wrong while deleting the role.");
    }
  }
};


const handleCloseForm = () => {
  setShowForm(false);
  setEditingrole(null);
  setFormData({
    name: '',
    description: '',
    status: 'active'
  });
  setFormErrors({
    name: "",
    description: ""
  });
};

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

 


  const handlehandleToggleStatus = async (role, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await ApiService.toggleRoleActive(role.id);
      toast.success(`✅ role status changed to ${newStatus}!`);
      await fetchRole();
    } catch (error) {
      
       if (err.response?.data?.code === "token_not_valid") {
            toast.error("Session expired. Please login again.", { autoClose: 1000 });
            handleLogout();
            return;
          }
      console.error('Error toggling role status:', error);
      toast.error(`❌ ${error.message || 'An error occurred while toggling role status'}`);
      setError(error.message || 'An error occurred while toggling role status');
      setroles(prevroles =>
        prevroles.map(s =>
          s.id === role.id ? { ...s, status: role.is_active } : s
        )
      );
    } finally {
      setLoading(false);
    }
  };
const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));

  // clear field error while typing
  setFormErrors((prev) => ({
    ...prev,
    [name]: ""
  }));
};
  const StatusToggle = ({ role }) => {
    const [localStatus, setLocalStatus] = useState(role.is_active ? 'active' : 'inactive');

    useEffect(() => {
      setLocalStatus(role.is_active ? 'active' : 'inactive');
    }, [role.is_active]);

    const handleClick = () => {
      const newStatus = localStatus === 2 ? 'inactive' : 'active';
      setLocalStatus(newStatus);
      handlehandleToggleStatus(role, newStatus);
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
const totalPages = Math.ceil(totalRole / entriesPerPage);

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
          <h2 className={styles.title}>Role List</h2>
               <p className={styles.subtitle}>
                  <span className={styles.highlightText}>{getWelcomeText()}</span>
                </p>
        </div>
        <div className={styles.headerActions}>
          {/* <div className={styles.userBadge}>Admin</div> */}

          {permissions.add && (
              <button className={styles.primaryButton} onClick={() => setShowForm(true)}>
                <span className={styles.buttonIcon}>+</span>
                Create role
              </button>
          )}


        </div>
      </div>

      {/* Filters */}
      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              placeholder="Search Role by name..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { setDebouncedSearch(searchTerm); setCurrentPage(1); }
              }}
              style={{ borderRadius: "6px 0 0 6px", borderRight: "none" }}
            />
            <button
              onClick={() => { setDebouncedSearch(searchTerm); setCurrentPage(1); }}
              style={{
                padding: "8px 14px",
                background: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "0 6px 6px 0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "500",
                whiteSpace: "nowrap"
              }}
            >
              🔍 Search
            </button>
          </div>
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
          <p className={styles.loading}>Loading Role List...</p>
        ) : (
        <div className={styles.tableContainer}>
            <table className="table table-bordered table-hover mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th   class={styles.table_head}>S.No</th>
                <th   class={styles.table_head}>Role Name</th>
                <th   class={styles.table_head}>Description</th>
                <th   class={styles.table_head}>Status</th>
                    {(permissions.edit || permissions.delete) && (
                  <th class={styles.table_head}>Actions</th>
                  )}
              </tr>
            </thead>
            <tbody>
              {Role.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyRow}>No Role found.</td>
                </tr>
              ) : (
                Role.map((role, index) => (
                  <tr key={role.id}>
                    <td className={styles.serialNumber}>
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className={styles.roleNameCell}>
                      <strong>{role.name}</strong>
                    </td>
                    <td className={styles.iconCell}>
                      <span className={styles.roleIcon}>{role.description}</span>
                    </td>
                    <td className={styles.statusCell}>
                      <StatusToggle role={role} />
                    </td>

                   {(permissions.edit || permissions.delete) && (
                    <td className={styles.actionsCell}>
                       {permissions.edit && (
                          <button 
                            className={styles.editButton} 
                            onClick={() => handleEdit(role)}
                          >
                            Edit
                          </button>
                         )}

                         {permissions.delete && (
                              <button 
                                className={styles.deleteButton} 
                                onClick={() => handleDelete(role.id)}
                              >
                                Delete
                              </button>
                       )}
                    </td>
                   )}

                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.tableFooter}>
            <div className={styles.pageInfo}>
              Showing {(Role.length > 0) ? ((currentPage - 1) * entriesPerPage + 1) : 0} to{" "}
              {Math.min(currentPage * entriesPerPage, totalRole)} of {totalRole} entries
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
                {[10, 25, 50, 100,1000,2500,5000].map((n) => (
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
          <div className={styles.modal} ref={modalRef}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingrole ? 'Edit Role' : 'Create Role'}
              </h3>
              <button className={styles.closeButton} onClick={handleCloseForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Role Name <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      name="name"
                      className={styles.formInput}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {formErrors.name && (
                      <small className={styles.errorText}>{formErrors.name}</small>
                    )}

                 
                  </div>
               <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description <span className={styles.required}>*</span></label>
                     <input
                      type="text"
                      name="description"
                      className={styles.formInput}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                    {formErrors.description && (
                      <small className={styles.errorText}>{formErrors.description}</small>
                    )}
                </div>

               
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseForm}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingrole ? 'Submit' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Role;
