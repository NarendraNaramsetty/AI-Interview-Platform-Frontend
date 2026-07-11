import React, { useState, useEffect, useCallback } from 'react';
import styles from './Submenu.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import Swal from 'sweetalert2';
import "react-toastify/dist/ReactToastify.css";

const Submenu = () => {
      const handleLogout = () => { 
      localStorage.clear();
      sessionStorage.clear();
      toast.info("You have been logged out", { autoClose: 1000 });
      navigate("/adminlogin");
    };
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userRole = user?.id_role || "";
  const [submenus, setSubmenus] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSubmenu, setEditingSubmenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [menuNames, setMenuNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalMenus, setTotalMenus] = useState(0);

  const [formData, setFormData] = useState({
    subMenuName: '',
    menuName: '',
    icons: '',    
    path: '',
    notify_count: 0,
    displayOrder: 1,
    status: 'active'
  });

 const fetchMenuNames = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const token = localStorage.getItem("accessToken");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await ApiService.getAllMenus(); // Use your ApiService method
    // Assuming the API returns { status, data: [...] } or just an array
    const menuArray = Array.isArray(response.data) ? response.data : response.data?.data || [];
    const menuList = menuArray.map(item => ({
      id: item.id_menu,
      name: item.menu_name,
    }));
    setMenuNames(menuList);
  } catch (error) {
     if (error.response?.data?.code === "token_not_valid") {
          toast.error("Session expired. Please login again.", { autoClose: 1000 });
          handleLogout();
          return;
        }
  
    setError('Failed to load menu names. Please try again.');
    setMenuNames([]);
  } finally {
    setLoading(false);
  }
}, []);
const fetchSubmenus = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const payload = {
      page: currentPage,
      length: entriesPerPage,
      search: searchTerm,
      id_role:userRole,
      is_active:
        statusFilter === 'active'
          ? true
          : statusFilter === 'inactive'
          ? false
          : null,
    };
    const token = localStorage.getItem("accessToken");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const result = await ApiService.getSubmenuDataTable(payload);

    // Adjust depending on API response structure
    const data = result.data?.data || [];
    const totalRecords = result.data?.total_records || data.length;

   const formattedSubmenus = data.map(item => ({
  id: item.id_submenu,
  subMenuName: item.submenuname,
  menuName: item.menu_name || menuNames.find(m => m.id === item.id_menu)?.name || '',
  icons: item.menu_icons,
  path: item.submenu_path,  
  notify_count: item.notify_count,
  displayOrder: item.display_order,
  is_active: item.is_active,           // keep original boolean
  status: item.is_active ? 'active' : 'inactive', // for UI display
  id_role:userRole
}));

    setSubmenus(formattedSubmenus);
    setTotalMenus(totalRecords);

  } catch (err) {
    console.error('Error fetching submenus:', err);
    setError(err.message || 'Failed to load submenus.');
    setSubmenus([]);
    setTotalMenus(0);
  } finally {
    setLoading(false);
  }
}, [currentPage, entriesPerPage, searchTerm, statusFilter, menuNames]);

  useEffect(() => {
    fetchMenuNames();
  }, [fetchMenuNames]);

  useEffect(() => {
    fetchSubmenus();
  }, [fetchSubmenus]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const selectedMenu = menuNames.find(menu => menu.name === formData.menuName);

      if (!selectedMenu) {
        setError('Please select a valid menu.');
        setLoading(false);
        return;
      }

      const payload = {
        id_menu: selectedMenu.id,
        submenuname: formData.subMenuName,
        submenu_path: formData.path,
        menu_icons: formData.icons,
        notify_count: formData.notify_count,
        display_order: parseInt(formData.displayOrder, 10)
      };
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (editingSubmenu) {
        await ApiService.updateSubmenu(editingSubmenu.id, payload);
        toast.success("✅ Submenu updated successfully!");
      } else {
        await ApiService.addSubmenu(payload);
        toast.success("✅ Submenu added successfully!");
      }

      await fetchSubmenus();
      handleCloseForm();

    } catch (error) {
       if (err.response?.data?.code === "token_not_valid") {
            toast.error("Session expired. Please login again.", { autoClose: 1000 });
            handleLogout();
            return;
          }
      console.error('Error saving submenu:', error);
      toast.error(`❌ ${error.message || 'Error saving submenu'}`);
      setError(error.message || 'An error occurred while saving the submenu');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (submenu) => {
    setEditingSubmenu(submenu);
    setFormData({
      subMenuName: submenu.subMenuName,
      menuName: submenu.menuName,
      icons: submenu.icons,
      path: submenu.path,
      displayOrder: submenu.displayOrder,
      notify_count: submenu.notify_count,
      status: submenu.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this submenu? This action cannot be undone.",
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
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await ApiService.deleteSubmenu(id);
        toast.success("✅ Submenu deleted successfully!");
        await fetchSubmenus();
      } catch (error) {
         if (error.response?.data?.code === "token_not_valid") {
              toast.error("Session expired. Please login again.", { autoClose: 1000 });
              handleLogout();
              return;
            }
        console.error('Error deleting submenu:', error);
        toast.error(`❌ ${error.message || 'An error occurred while deleting the submenu'}`);
        setError(error.message || 'An error occurred while deleting the submenu');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSubmenu(null);
    setFormData({
      subMenuName: '',
      menuName: '',
      icons: '',
      path: '',
      displayOrder: 1,
      notify_count:0,
      status: 'active'
    });
    setError(null);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };


  const StatusToggle = ({ submenu }) => {
 const [localStatus, setLocalStatus] = useState(submenu.is_active ? 'active' : 'inactive');

useEffect(() => {
  setLocalStatus(submenu.is_active ? 'active' : 'inactive');
}, [submenu.is_active]);

const handleClick = () => {
  const newStatus = localStatus === 2 ? 'inactive' : 'active';
  setLocalStatus(newStatus);
  handleToggleStatus(submenu, newStatus);
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

  const handleToggleStatus = async (submenu, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await ApiService.toggleSubmenuActive(submenu.id);
      toast.success(`✅ Submenu status changed to ${newStatus}!`);
      await fetchSubmenus();
    } catch (error) {
       if (err.response?.data?.code === "token_not_valid") {
            toast.error("Session expired. Please login again.", { autoClose: 1000 });
            handleLogout();
            return;
          }
      console.error('Error toggling submenu status:', error);
      toast.error(`❌ ${error.message || 'An error occurred while toggling submenu status'}`);
      setError(error.message || 'An error occurred while toggling submenu status');
      setSubmenus(prevSubmenus =>
        prevSubmenus.map(s =>
          s.id === submenu.id ? { ...s, status: submenu.status } : s
        )
      );
    } finally {
      setLoading(false);
    }
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

  const IconDisplay = ({ iconName }) => {
    const isFA = typeof iconName === 'string' && /(^|\s)fa-/.test(iconName);
    return (
      <span className={styles.iconDisplay}>
        {iconName ? (isFA ? <i className={`fas ${iconName}`}></i> : <span className={styles.iconText}>{iconName}</span>) : null}
      </span>
    );
  };

  const OrderBadge = ({ order }) => <span>{order}</span>;

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
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>SubMenu List</h2>
          <p className={styles.subtitle}>Configure and manage navigation submenus</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.userBadge}>Admin</div>
          <button className={styles.primaryButton} onClick={() => {
            setEditingSubmenu(null);
            setFormData({
              subMenuName: '',
              menuName: '',
              icons: '',
              path: '',
              displayOrder: 1,
              notify_count:0,
              status: 'active'
            });
            setShowForm(true);
          }}>
            <span className={styles.buttonIcon}>+</span>
            Create Submenu
          </button>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search submenus by name..."
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
              className={`${styles.filterBtn} ${statusFilter === f ? styles.active : ''}`}
              onClick={() => { setStatusFilter(f); setCurrentPage(1); }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingText}>Loading submenus...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th   class={styles.table_head}>S.No</th>
                <th   class={styles.table_head}>Sub Menu Name</th>
                <th   class={styles.table_head}>Menu Name</th>
                <th   class={styles.table_head}>Icons</th>
                <th   class={styles.table_head}>Path</th>
                <th   class={styles.table_head}>Display Notify Count</th>
                <th   class={styles.table_head}>Display Order</th>                
                <th   class={styles.table_head}>Status</th>
                <th   class={styles.table_head}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submenus.length === 0 ? (
                <tr>
                  <td colSpan="8" className={styles.emptyRow}>No submenus found.</td>
                </tr>
              ) : (
                submenus.map((submenu, index) => (
                  <tr key={submenu.id}>
                    <td className={styles.serialNumber}>
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className={styles.menuNameCell}>
                      <strong>{submenu.subMenuName}</strong>
                    </td>
                    <td className={styles.menuNameCell}>
                      <span className={styles.menuName}>{submenu.menuName}</span>
                    </td>
                    <td className={styles.iconCell}>
                      <IconDisplay iconName={submenu.icons} />
                    </td>
                    <td className={styles.pathCell}>
                      <code>{submenu.path}</code>
                    </td>     
                           
                    <td className={styles.orderCell}>
                      {submenu.notify_count == 1 ? (
                        <span style={{ color: 'green', fontWeight: 'bold' }}>Show</span>
                      ) : (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>Hide</span>
                      )}
                    </td>
                    <td className={styles.orderCell}>
                      <OrderBadge order={submenu.displayOrder}  />
                    </td>
                    <td className={styles.statusCell}>
                      <StatusToggle submenu={submenu} />
                    </td>
                    <td className={styles.actionsCell}>
                      <button className={styles.editButton} onClick={() => handleEditClick(submenu)}>Edit</button>
                      <button className={styles.deleteButton} onClick={() => handleDelete(submenu.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className={styles.tableFooter}>
            <div className={styles.pageInfo}>
              Showing {(submenus.length > 0) ? ((currentPage - 1) * entriesPerPage + 1) : 0} to{" "}
              {Math.min(currentPage * entriesPerPage, totalMenus)} of {totalMenus} entries
            </div>
            <div className={styles.pagination}>
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className={styles.pageButton}>Previous</button>
              {getPageNumbers().map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`${styles.pageButton} ${currentPage === p ? styles.pageButtonActive : ''}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className={styles.pageButton}>Next</button>
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

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingSubmenu ? 'Edit Submenu' : 'Create Submenu'}
              </h3>
              <button className={styles.closeButton} onClick={handleCloseForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Sub Menu Name *</label>
                  <input type="text" name="subMenuName" className={styles.formInput} value={formData.subMenuName} onChange={handleInputChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Menu Name *</label>
                  <select name="menuName" className={styles.formInput} value={formData.menuName} onChange={handleInputChange} required>
                    <option value="">Select Menu</option>
                    {menuNames.map(menu => (<option key={menu.id_menu} value={menu.id_menu}>{menu.name}</option>))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Path *</label>
                  <input type="text" name="path" className={styles.formInput} value={formData.path} onChange={handleInputChange} required placeholder="Enter path (e.g., /admin/users)" />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Display Notification Count *</label>
                  <select name="notify_count" className={styles.formInput} value={formData.notify_count} onChange={handleInputChange} required>
                    <option value="">Select Notification Count</option>
                    <option value="1">Show</option>
                    <option value="0">Hide</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Display Order</label>
                  <input type="number" name="displayOrder" className={styles.formInput} value={formData.displayOrder} onChange={handleInputChange} min="1" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Menu Icon</label>
                  <input type="text" name="icons" className={styles.formInput} value={formData.icons} onChange={handleInputChange} placeholder="e.g. fa-users (Font Awesome class)" />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseForm}>Cancel</button>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? (editingSubmenu ? 'Updating...' : 'Adding...') : (editingSubmenu ? 'Submit' : 'Submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submenu;
