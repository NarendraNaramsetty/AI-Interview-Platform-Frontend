
import styles from './Staff.module.css';
import submenuStyles from '../../settings/submenu/Submenu.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faEdit, faTrash, faFileExport, faFilter, faCircleXmark, faEye, faTimes } from "@fortawesome/free-solid-svg-icons";
import PageLoader from '../../common/PageLoader.jsx';
import ProfileImageUpload from '../../common/ProfileImageUpload.jsx';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from 'sweetalert2';
import React, { useState, useEffect, useRef } from 'react';
import useClickOutside from "../../../hooks/useClickOutside";
const Staff = () => {
  const modalRef = useRef(null);
  useClickOutside(modalRef, () => setShowModal(false));
  const importmodalRef = useRef(null);
  useClickOutside(importmodalRef, () => setShowImportModal(false));


  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.info("You have been logged out", { autoClose: 1000 });
  };
  const MAIN_URL = import.meta.env.VITE_APP_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const userRole = user?.id_role || "";
  const userRoleCode = user?.role_code || "";
  const role_hierarchy = user?.role_hierarchy || "0";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // table / filter state
  const [Staffs, setStaffs] = useState([]);
  const [filterRole, setFilterRole] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedFilterRole, setSelectedFilterRole] = useState("");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState("");

  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);

  const [importForm, setImportForm] = useState({
    id_role: ""
  });


  // modal / form state
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    id_adminuser: "",
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    id_role: "",
    additional_role: "",
    profile_image: ""
  });

  // Image upload state
  const [imageData, setImageData] = useState({
    type: null, // 'file', 'webcam', or 'remove'
    data: null,
    format: null
  });
  const [appliedFilters, setAppliedFilters] = useState({
    role: "",
    fromDate: "",
    toDate: "",
    status: ""
  });

  const rolesWithAdditionalRole = [3, 5, 6, 7];
  const showAdditionalRole = rolesWithAdditionalRole.includes(Number(formData.id_role));

  const [permissions, setPermissions] = useState({
    add: false,
    edit: false,
    delete: false,
    view: false
  });

  useEffect(() => {
    const menuData = JSON.parse(localStorage.getItem("sidebarMenu")) || [];
    let collegePerm = { add: false, edit: false, delete: false, view: false };
    for (const menu of menuData) {
      if (!menu.submenus) continue;
      const sub = menu.submenus.find(sm => sm.path === "/accounts/staff");
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

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  };

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getRole = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await ApiService.getRolesList(userRole);
      const list = res?.data?.data || [];
      setFilterRole(list);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  useEffect(() => {
    getRole();
  }, []);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const body = {
        page,
        length: pageSize,
        search: debouncedSearch,
        from_date: appliedFilters.fromDate,
        to_date: appliedFilters.toDate,
        id_role: appliedFilters.role,
        is_active: appliedFilters.status,
        role_hierarchy: role_hierarchy
      };


      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await ApiService.getStaffDataTable(body);
      const result = response?.data;
      if (result?.status !== "success") throw new Error(result?.message || "Failed to load Staff");

      const rows = Array.isArray(result.data) ? result.data : [];
      setStaffs(rows.map(item => ({
        id_adminuser: item.id_adminuser,
        first_name: item.first_name || "",
        last_name: item.last_name || "",
        additional_role: item.additional_role || "",
        mobile: item.mobile || "",
        email: item.email || "",
        id_role: item.id_role ?? "",
        role_name: item.role_name ?? "",
        profile_image: item.profile_image || "",
        created_at: formatDate(item.created_at),
        is_active: !!item.is_active,
        is_deleted: !!item.is_deleted
      })));
      setTotalEntries(result.total_records ?? 0);
    } catch (err) {
      if (err.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      setStaffs([]);
      setTotalEntries(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [page, pageSize, appliedFilters, debouncedSearch]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleAddStaff = () => {
    setEditingStaff(null);
    setFormData({
      id_adminuser: "",
      first_name: "",
      last_name: "",
      mobile: "",
      email: "",
      id_role: "",
      additional_role: "",
      profile_image: ""
    });
    setImageData({
      type: null,
      data: null,
      format: null
    });
    setShowModal(true);
  };

  const handleEditStaff = (s) => {
    setEditingStaff(s);
    setFormData({
      id_adminuser: s.id_adminuser ?? "",
      first_name: s.first_name ?? "",
      last_name: s.last_name ?? "",
      mobile: s.mobile ?? "",
      email: s.email ?? "",
      id_role: s.id_role ?? "",
      additional_role: s.additional_role ?? "",
      profile_image: s.profile_image ?? ""
    });
    setImageData({
      type: null,
      data: null,
      format: null
    });
    setShowModal(true);
  };

  const handleImageChange = (imageInfo) => {
    setImageData({
      type: imageInfo.type,
      data: imageInfo.data,
      format: imageInfo.format || 'jpeg'
    });
  };

  const handleImageRemove = () => {
    setImageData({
      type: 'remove',
      data: null,
      format: null
    });
    setFormData(prev => ({ ...prev, profile_image: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    const firstName = String(formData.first_name || "").trim();
    const lastName = String(formData.last_name || "").trim();
    const mobile = String(formData.mobile || "").trim();
    const email = String(formData.email || "").trim();

    if (!firstName) {
      newErrors.first_name = "First name is required";
    }

    if (!mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.id_role) {
      newErrors.id_role = "Role is required";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const progressInterval = startFakeProgress();
    let res;

    const submitData = new FormData();

    // Add form fields
    submitData.append('first_name', formData.first_name);
    submitData.append('last_name', formData.last_name);
    submitData.append('mobile', formData.mobile);
    submitData.append('email', formData.email);
    submitData.append('id_role', formData.id_role);
    submitData.append('additional_role', showAdditionalRole ? formData.additional_role : "");

    // Add image data based on type
    if (imageData.type === 'file') {
      submitData.append('profile_image', imageData.data);
    } else if (imageData.type === 'webcam') {
      submitData.append('image_data', imageData.data);
      submitData.append('upload_method', 'webcam');
      submitData.append('image_format', imageData.format);
    } else if (imageData.type === 'remove') {
      submitData.append('remove_profile_image', 'true');
    }

    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (editingStaff) {
        res = await api.put(`/staff/update/${editingStaff.id_adminuser}/`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        res = await api.post('/staff/add/', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setProgress(100);

      if (res.data?.status === "success") {
        toast.success(res.data.message || "Saved successfully");
        setShowModal(false);
        fetchStaffs();
      } else {
        toast.error(res.data?.message || "Operation failed");
      }

    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to submit";

      toast.error(errorMessage);

    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsSubmitting(false);
        setProgress(0);
      }, 400);
    }
  };


  const handleDeleteStaff = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this Staff? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
    });

    const token = localStorage.getItem("accessToken");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (result.isConfirmed) {
      try {
        const res = await ApiService.deleteStaff(id);
        if (res.data?.status === "success") {
          toast.success("Staff deleted!");
          fetchStaffs();
        } else {
          toast.error(res.data?.message || "Failed to delete");
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          toast.error("Session expired. Please login again.", { autoClose: 1000 });
          handleLogout();
          return;
        }
        toast.error("Failed to delete Staff");
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      toast.info("Deletion cancelled");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await ApiService.toggleStaffActive(id);
      if (res.data?.status === "success") {
        toast.success(res.data.message || "Status updated");
        fetchStaffs();
      } else {
        toast.error(res.data?.message || "Status update failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleCloseModal = () => setShowModal(false);

  // View Panel state
  const [showViewPanel, setShowViewPanel] = useState(false);
  const [viewStaff, setViewStaff] = useState(null);

  const handleViewStaff = (s) => {
    setViewStaff(s);
    setShowViewPanel(true);
  };

  const handleExport = () => {
    if (!Staffs || Staffs.length === 0) return;
    const tableData = Staffs.map(u => ({
      FirstName: u.first_name,
      LastName: u.last_name,
      Mobile: u.mobile,
      Email: u.email,
      RoleName: u.role_name,
      Status: u.is_active ? "Active" : "Inactive",
      CreatedAt: u.created_at
    }));
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staffs");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Staffs.xlsx");
  };

  const totalPages = totalEntries === 0 ? 0 : Math.ceil(totalEntries / pageSize);
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = totalEntries === 0 ? 0 : Math.min(page * pageSize, totalEntries);

  const generatePageNumbers = (current, total) => {
    const pages = [];

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total - 1) {
      pages.push("...");
    }

    // Always show last page
    pages.push(total);

    return pages;
  };


  const toTitleCase = (str) => {
    if (!str) return "";
    return str.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };


  const getColSpan = () => {
    let count = 0;
    if (permissions.edit || permissions.delete) count += 1;
    count += 6; // Sno, Profile, Name, Mobile, Email, Role Name, Status
    return count;
  };

  const handleImportFile = async () => {
    if (!importFile) {
      toast.error("Please select a file");
      return;
    }

    if (!importForm.id_role) {
      toast.error("Please select a role");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);
    formData.append("id_role", importForm.id_role);
    setIsSubmitting(true);
    const progressInterval = startFakeProgress();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await ApiService.importStaff(formData, token);
      setProgress(100);

      if (res.data.status === "success") {
        toast.success(res.data.message);
        setShowImportModal(false);
        setImportForm({ id_role: "" });
        setImportFile(null);
        fetchStaffs();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      // Display detailed error message from backend
      const errorMessage = err.response?.data?.message || "Import failed";
      const missingColumns = err.response?.data?.missing_columns;

      if (missingColumns && missingColumns.length > 0) {
        toast.error(`${errorMessage}: ${missingColumns.join(", ")}`, { autoClose: 8000 });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsSubmitting(false);
        setProgress(0);
      }, 400);
    }
  };

  const handleImportInputChange = (e) => {
    const { name, value } = e.target;
    setImportForm(prev => ({ ...prev, [name]: value }));
  };


  const startFakeProgress = () => {
    setProgress(0);
    return setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 300);
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" style={{ marginTop: "25px" }} autoClose={5000} />

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Users List</h2>
          <p className={styles.subtitle}>
            <span className={styles.highlightText}>Welcome back! Here's your system overview</span>
          </p>

        </div>
        <div className={styles.headerActions}>
          {permissions.add && (
            <button className={styles.addButton} onClick={handleAddStaff}>
              <FontAwesomeIcon icon={faPlus} /> Create User
            </button>
          )}
        </div>
      </div>

      {/* Filters - Professional Design */}
      <div className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <div className={styles.filterTitleSection}>
            <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
            <h4 className={styles.filterTitle}>Filter Users</h4>
          </div>
        </div>
        <div className={styles.filterBody}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <span className={styles.labelIcon}>👤</span>
                Select Role
              </label>
              <select
                className={styles.filterSelect}
                value={selectedFilterRole}
                onChange={(e) => setSelectedFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                {filterRole.map(d => (
                  <option key={d.id_role ?? d.id} value={d.id_role ?? d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <span className={styles.labelIcon}>📅</span>
                From Date
              </label>
              <input
                type="date"
                className={styles.filterSelect}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <span className={styles.labelIcon}>📅</span>
                To Date
              </label>
              <input
                type="date"
                className={styles.filterSelect}
                value={toDate}
                min={fromDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                <span className={styles.labelIcon}>🟢</span>
                Active Status
              </label>
              <select
                className={styles.filterSelect}
                value={selectedFilterStatus}
                onChange={(e) => setSelectedFilterStatus(e.target.value)}
              >
                <option value="">All status</option>
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
              </select>
            </div>

            <div className={styles.filterActions}>
              <button
                className={styles.applyFilterBtn}
                onClick={() => {
                  setAppliedFilters({
                    role: selectedFilterRole,
                    fromDate,
                    toDate,
                    status: selectedFilterStatus
                  });
                  setPage(1);
                }}
              >
                <FontAwesomeIcon icon={faFilter} />
                Apply Filter
              </button>

              <button
                className={styles.clearFilterBtn}
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setSelectedFilterRole("");
                  setSelectedFilterStatus("");
                  setSearchTerm("");
                  setDebouncedSearch("");
                  setAppliedFilters({ role: "", fromDate: "", toDate: "", status: "" });
                  setPage(1);
                }}
              >
                <FontAwesomeIcon icon={faCircleXmark} />
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <div className={styles.searchWrapper}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search ..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") { setDebouncedSearch(searchTerm); setPage(1); }
              }}
              className={styles.searchInput}
              style={{ borderRadius: "6px 0 0 6px", borderRight: "none" }}
            />
            <button
              onClick={() => { setDebouncedSearch(searchTerm); setPage(1); }}
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

        <div className={styles.controlsRight}>
          <button className={styles.addButton} onClick={() => setShowImportModal(true)}>
            Import Users
          </button>

          <button className={styles.exportButton} onClick={handleExport}>
            <FontAwesomeIcon icon={faFileExport} /> Export
          </button>

          <div className={styles.entriesControl}>
            <label>Show</label>
            <select className={styles.entriesSelect} value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
              <option value={5000}>5000</option>
              <option value={10000}>10000</option>
            </select>
            <span>entries</span>
          </div>
        </div>
      </div>



      {showImportModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} ref={importmodalRef}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Import Staff</h3>
              <button className={styles.closeButton} onClick={() => setShowImportModal(false)}>×</button>
            </div>

            {/* Role */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Role <span className={styles.required}>*</span></label>
              <select
                name="id_role"
                value={importForm.id_role}
                onChange={handleImportInputChange}
                className={styles.formInput}
              >
                <option value="">-- Select Role --</option>
                {filterRole.map(r => (
                  <option key={r.id_role} value={r.id_role}>
                    {toTitleCase(r.name)}
                  </option>
                ))}
              </select>
              {errors.id_role && <small className={styles.errorText}>{errors.id_role}</small>}
            </div>





            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label className='mt-3'>Upload File</label>
                <div className={styles.customFileUpload}>
                  <input type="file" id="fileUpload" accept=".csv, .xlsx" onChange={(e) => setImportFile(e.target.files[0])} />
                  <label htmlFor="fileUpload">{importFile ? importFile.name : "Choose a file..."}</label>
                </div>
                <small>Accepted formats: .csv, .xlsx</small>

                <div style={{ marginTop: "8px" }}>
                  <a href={`${MAIN_URL}/media/excel/sample-user.xlsx`} download style={{ color: "#39ab49", textDecoration: "underline", cursor: "pointer" }}>
                    Click here to download sample Excel
                  </a>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setShowImportModal(false)}>Cancel</button>
                <button type="button" className={styles.submitButton} disabled={isSubmitting} onClick={handleImportFile}>{isSubmitting ? (
                  <>
                    <span className={styles.loader}></span>
                    {progress}%
                  </>
                ) : (
                  "Import"
                )}</button>
              </div>
            </div>
          </div>
        </div>


      )}

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} ref={modalRef}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingStaff ? "Edit User" : "Create User"}</h3>
              <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                {/* First Name */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>First Name <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="First name"
                  />
                  {errors.first_name && <small className={styles.errorText}>{errors.first_name}</small>}
                </div>

                {/* Last Name */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Last name"
                  />
                  {errors.last_name && <small className={styles.errorText}>{errors.last_name}</small>}
                </div>

                {/* Mobile Number */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mobile Number <span className={styles.required}>*</span></label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{
                      padding: "13px 12px",
                      background: "#f1f1f1",
                      border: "1px solid #ccc",
                      borderRadius: "6px 0 0 6px",
                      fontWeight: "600"
                    }}>+91</span>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      className={styles.formInput}
                      placeholder="Enter Mobile Number"
                      style={{ borderRadius: "0 6px 6px 0", borderLeft: "0" }}
                      maxLength={10}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, "");
                        setFormData(prev => ({ ...prev, mobile: onlyNumbers }));
                        setErrors(prev => ({ ...prev, mobile: "" }));
                      }}
                    />
                  </div>
                  {errors.mobile && <small className={styles.errorText}>{errors.mobile}</small>}
                  <small style={{ color: "#666", fontSize: "11px" }}>Default password will be the mobile number</small>
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email ID</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={styles.formInput} placeholder="Email" />
                  {errors.email && <small className={styles.errorText}>{errors.email}</small>}
                </div>

                {/* Role */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Role <span className={styles.required}>*</span></label>
                  <select
                    name="id_role"
                    value={formData.id_role}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  >
                    <option value="">-- Select Role --</option>
                    {filterRole.map(r => (
                      <option key={r.id_role} value={r.id_role}>
                        {toTitleCase(r.name)}
                      </option>
                    ))}
                  </select>
                  {errors.id_role && <small className={styles.errorText}>{errors.id_role}</small>}
                </div>

                {/* Additional Role */}
                {showAdditionalRole && (
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Additional Role
                    </label>
                    <select
                      name="additional_role"
                      value={formData.additional_role}
                      onChange={handleInputChange}
                      className={styles.formInput}
                    >
                      <option value="">-- Select Additional Role --</option>
                      <option value="4">Mentor</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Profile Image Upload Component */}
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.formLabel}>Profile Image</label>
                <ProfileImageUpload
                  existingImage={formData.profile_image}
                  onImageChange={handleImageChange}
                  onImageRemove={handleImageRemove}
                />
              </div>

              <div className={`${styles.formActions} ${styles.formFull}`}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Cancel</button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.loader}></span>
                      {progress}%
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <PageLoader message="Loading User List..." />
        ) : (
          <table className="table table-bordered table-hover mb-0">
            <thead className="bg-primary text-white">
              <tr>
                {(permissions.edit || permissions.delete) && <th className={styles.table_head}>Actions</th>}
                <th className={styles.table_head}>Sno</th>
                <th className={styles.table_head} style={{ textAlign: 'center' }}>Profile</th>
                <th className={styles.table_head}>Name</th>
                <th className={styles.table_head}>Mobile</th>
                <th className={styles.table_head}>Email</th>
                <th className={styles.table_head}>Role Name</th>
                <th className={styles.table_head}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Staffs.length > 0 ? Staffs.map((u, index) => (!u.is_deleted && (
                <tr key={u.id_adminuser ?? u.id}>
                  {(permissions.edit || permissions.delete) && (
                    <td>
                      <button className={styles.iconButton} onClick={() => handleViewStaff(u)} title="View Details" style={{ background: '#17a2b8' }}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      {permissions.edit && (
                        <button className={styles.iconButton} onClick={() => handleEditStaff(u)} title="Edit Staff">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}
                      {permissions.delete && (
                        <button className={`${styles.iconButton} ${styles.delete}`} onClick={() => handleDeleteStaff(u.id_adminuser ?? u.id)} title="Delete Staff">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </td>
                  )}
                  <td>{(page - 1) * pageSize + index + 1}</td>
                  <td>
                    {u.profile_image ? (
                      <img
                        src={u.profile_image}
                        alt={u.first_name}
                        className={styles.tableProfileImage}
                      />
                    ) : (
                      <div className={styles.noImagePlaceholder}>
                        {toTitleCase(u.first_name).charAt(0)}
                        {toTitleCase(u.last_name).charAt(0)}
                      </div>
                    )}
                  </td>
                  <td>{`${toTitleCase(u.first_name)} ${toTitleCase(u.last_name)}`.trim()}</td>
                  <td>{u.mobile}</td>
                  <td>{u.email}</td>

                  <td>{toTitleCase(u.role_name)}</td>
                  <td>
                    <div className={submenuStyles.statusToggle} onClick={() => handleToggleActive(u.id_adminuser)}>
                      <div className={`${submenuStyles.toggleSwitch} ${u.is_active ? submenuStyles.active : submenuStyles.inactive}`}>
                        <div className={submenuStyles.toggleKnob}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))) : (
                <tr>

                  <td colSpan={getColSpan()} className={styles.noData}>
                    No staffs found
                  </td>

                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 0 && (
        <div className={styles.tableFooter}>
          <div>Showing {startIndex} to {endIndex} of {totalEntries} entries</div>
          <div className={styles.paginationContainer}>
            <button
              className={`${styles.paginationBtn} ${page === 1 ? styles.disabledBtn : ""}`}
              onClick={() => page > 1 && setPage(page - 1)}
            >Prev</button>
            {generatePageNumbers(page, totalPages).map((p, index) =>
              p === "..." ? (
                <span key={`dots-${index}`} className={styles.paginationBtn}>
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  className={`${styles.paginationBtn} ${page === p ? styles.activePage : ""
                    }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              )
            )}

            <button
              className={`${styles.paginationBtn} ${page === totalPages ? styles.disabledBtn : ""}`}
              onClick={() => page < totalPages && setPage(page + 1)}
            >Next</button>
          </div>
        </div>
      )}
      {/* VIEW PANEL */}
      {showViewPanel && viewStaff && (
        <>
          <div className={styles.panelOverlay} onClick={() => setShowViewPanel(false)} />
          <div className={styles.viewPanel}>
            <div className={styles.viewPanelHeader}>
              <h3 className={styles.viewPanelTitle}>User Details</h3>
              <button className={styles.closeButton} onClick={() => setShowViewPanel(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className={styles.viewPanelBody}>
              <div className={styles.viewAvatar}>
                {toTitleCase(viewStaff.first_name).charAt(0)}{toTitleCase(viewStaff.last_name).charAt(0) || ''}
              </div>
              <div className={styles.viewName}>
                {toTitleCase(viewStaff.first_name)} {toTitleCase(viewStaff.last_name)}
              </div>
              <div className={styles.viewBadge}>{viewStaff.is_active ? 'Active' : 'Inactive'}</div>

              <div className={styles.viewGrid}>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Mobile</span>
                  <span className={styles.viewValue}>{viewStaff.mobile || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Email</span>
                  <span className={styles.viewValue}>{viewStaff.email || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Role</span>
                  <span className={styles.viewValue}>{toTitleCase(viewStaff.role_name) || '—'}</span>
                </div>

                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Created At</span>
                  <span className={styles.viewValue}>{viewStaff.created_at || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Staff;
