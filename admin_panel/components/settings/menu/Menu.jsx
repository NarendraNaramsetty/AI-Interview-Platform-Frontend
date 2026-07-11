import React, { useState, useEffect } from 'react';
import styles from './Menu.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import Swal from 'sweetalert2';
import "react-toastify/dist/ReactToastify.css";
const Menu = () => {
      const handleLogout = () => { 
      localStorage.clear();
      sessionStorage.clear();
      toast.info("You have been logged out", { autoClose: 1000 });
      navigate("/adminlogin");
    };
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userRole = user?.id_role || "";
  const [menus, setMenus] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalMenus, setTotalMenus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📄',
    order: 1,
    status: 'active'
  });

  // 🔹 Fetch menus from backend
  const fetchMenus = async () => {
    setLoading(true);

    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm,
        is_active: filter === "all" ? null : filter === "active",
        id_role:userRole
      };

      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.getMenuDataTable(payload);
      const data = response.data;

      if (data.status === "success") {
        setMenus(
          (data.data || []).map((menu) => ({
            id: menu.id_menu,
            name: menu.menu_name,
            icon: menu.menu_icons,
            order: menu.display_order,
            status: menu.is_active === 1 ? "active" : "inactive",
            id_role:userRole
          }))
        );

        setTotalMenus(data.total_records);
      } else {
        toast.error(data.message || "Failed to load menus");
      }
    } catch (error) {
       if (err.response?.data?.code === "token_not_valid") {
            toast.error("Session expired. Please login again.", { autoClose: 1000 });
            handleLogout();
            return;
          }
      console.error(error);
       toast.error("❌ Error fetching menu data");
    }

    setLoading(false);
  };


  useEffect(() => {
    fetchMenus();
  }, [filter, searchTerm, currentPage, entriesPerPage]);

  // 🔹 Add menu
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    menu_name: formData.name,
    menu_icons: formData.icon || "settings",
    display_order: Number(formData.order),
  };

  try {
    let response;

    if (editingMenu) {
      // 🔹 UPDATE MENU
      response = await ApiService.updateMenu(editingMenu.id, payload);
    } else {
      // 🔹 CREATE MENU
      response = await ApiService.addMenu(payload);
    }

    const data = response.data;

    if (data.status === "success") {
        toast.success(editingMenu ? "✅ Menu updated successfully!" : "✅ Menu added successfully!");
      fetchMenus(); // Refresh the table
      handleCloseForm();
    } else {
       toast.error(data.message || "⚠️ Failed to save menu.");
    }
  } catch (error) {
     if (err.response?.data?.code === "token_not_valid") {
          toast.error("Session expired. Please login again.", { autoClose: 1000 });
          handleLogout();
          return;
        }
    console.error("Menu save error:", error);
    toast.error("❌ Something went wrong while saving menu.");
  }
};

const handleEdit = (menu) => {
  setFormData({
    name: menu.name,
    icon: menu.icon,
    order: menu.order,
  });
  setEditingMenu(menu); // keep track of which menu is being edited
  setShowForm(true);
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "Are you sure you want to delete this menu?",
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
      const response = await ApiService.deleteMenu(id);
      const data = response.data;

      if (data.status === "success") {
         toast.success("🗑️ Menu deleted successfully!");
        fetchMenus();
      } else {
        toast.error(data.message || "⚠️ Failed to delete menu.");
      }
    } catch (error) {
       if (error.response?.data?.code === "token_not_valid") {
            toast.error("Session expired. Please login again.", { autoClose: 1000 });
            handleLogout();
            return;
          }
      console.error("Menu delete error:", error);
       toast.error("❌ Something went wrong while deleting the menu.");
    }
  }
};


  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMenu(null);
    setFormData({
      name: '',
      icon: '',
      order: 1,
      status: 'active'
    });
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const toggleStatus = async (id) => {
  const menu = menus.find((m) => m.id === id);
  if (!menu) {
    toast.error("Menu not found");
    return menu?.status || 'inactive';
  }

  const originalStatus = menu.status;

  try {
    // Call API service
    const response = await ApiService.toggleMenuActive(id);
    const data = response.data;
    console.log("Toggle response:", data);

    if (data.status === "success" && data.data) {
      const serverStatus = data.data.is_active ? "active" : "inactive";
      setMenus(prev =>
        prev.map(m => (m.id === id ? { ...m, status: serverStatus } : m))
      );
      toast.success(
        `✅ Menu ${serverStatus === "active" ? "activated" : "deactivated"} successfully`
      );
      return serverStatus;
    } else {
      throw new Error(data.message || "Failed to update status on server");
    }
  } catch (error) {
     if (err.response?.data?.code === "token_not_valid") {
          toast.error("Session expired. Please login again.", { autoClose: 1000 });
          handleLogout();
          return;
        }
    console.error("Error toggling status:", error);
    // Revert local change
    setMenus(prev =>
      prev.map(m => (m.id === id ? { ...m, status: originalStatus } : m))
    );
    toast.error(`❌ Error updating status: ${error.message}`);
    return originalStatus;
  }
};


  const handleToggleStatus = async (menu, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await ApiService.toggleMenuActive(menu.id);
      toast.success(`✅ menu status changed to ${newStatus}!`);
      await fetchMenus();
    } catch (error) {
       if (err.response?.data?.code === "token_not_valid") {
            toast.error("Session expired. Please login again.", { autoClose: 1000 });
            handleLogout();
            return;
          }
      console.error('Error toggling menu status:', error);
      toast.error(`❌ ${error.message || 'An error occurred while toggling menu status'}`);
      setError(error.message || 'An error occurred while toggling menu status');
      setMenus(prevmenus =>
        prevmenus.map(s =>
          s.id === menu.id ? { ...s, status: menu.status } : s
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const StatusToggle = ({ menu }) => {
  const [localStatus, setLocalStatus] = useState(menu.status || 'inactive'); // use menu.status

  useEffect(() => {
    setLocalStatus(menu.status || 'inactive'); // update if menu changes
  }, [menu.status]);

  const handleClick = async () => {
    const newStatus = localStatus === 'active' ? 'inactive' : 'active';
    setLocalStatus(newStatus); // optimistic UI update
    await handleToggleStatus(menu, newStatus);
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
const totalPages = Math.ceil(totalMenus / entriesPerPage);

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
          <h2 className={styles.title}>Menu List</h2>
          <p className={styles.subtitle}>Configure and manage navigation menus</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.userBadge}>Admin</div>
          <button className={styles.primaryButton} onClick={() => setShowForm(true)}>
            <span className={styles.buttonIcon}>+</span>
            Create Menu
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search menus by name..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <button className={styles.searchButton} onClick={() => setCurrentPage(1)}>Search</button> */}
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
        <div className={styles.loadingText}>Loading menus...</div>
      ) : (
        <div className={styles.tableContainer}>
            <table className="table table-bordered table-hover mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th   class={styles.table_head}>S.No</th>
                <th   class={styles.table_head}>Menu Name</th>
                <th   class={styles.table_head}>Menu Icons</th>
                <th  class={styles.table_head}>Display Order</th>
                <th  class={styles.table_head}>Status</th>
                <th  class={styles.table_head}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyRow}>No menus found.</td>
                </tr>
              ) : (
                menus.map((menu, index) => (
                  <tr key={menu.id}>
                    <td className={styles.serialNumber}>
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className={styles.menuNameCell}>
                      <strong>{menu.name}</strong>
                    </td>
                    <td className={styles.iconCell}>
                      <span className={styles.menuIcon}>{menu.icon}</span>
                    </td>
                    <td className={styles.orderCell}>{menu.order}</td>
                    <td className={styles.statusCell}>
                      <StatusToggle menu={menu}/>
                    </td>
                    <td className={styles.actionsCell}>
                      <button 
                        className={styles.editButton} 
                        onClick={() => handleEdit(menu)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton} 
                        onClick={() => handleDelete(menu.id)}
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
              Showing {(menus.length > 0) ? ((currentPage - 1) * entriesPerPage + 1) : 0} to{" "}
              {Math.min(currentPage * entriesPerPage, totalMenus)} of {totalMenus} entries
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
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingMenu ? 'Edit Menu' : 'Create Menu'}
              </h3>
              <button className={styles.closeButton} onClick={handleCloseForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Menu Name *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Icon</label>
                  <div className={styles.iconSelector}>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    />
                    {/* <span className={styles.iconPreview}>{formData.icon}</span> */}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Display Order</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    required
                  />
                </div>
                </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseForm}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingMenu ? 'Submit' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;