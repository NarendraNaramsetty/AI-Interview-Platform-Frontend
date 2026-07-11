import React, { useState, useEffect, useRef } from 'react';
import styles from './Business.module.css';
import submenuStyles from '../../../components/settings/submenu/Submenu.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faEdit, faTrash, faFileExport, 
  faEye, faTimes, faUpload, faBuilding, faInfoCircle, 
  faMapMarkerAlt, faFileInvoiceDollar, faCheckCircle, faExclamationCircle 
} from "@fortawesome/free-solid-svg-icons";
import PageLoader from '../../../components/common/PageLoader.jsx';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from 'sweetalert2';
import useClickOutside from "../../../hooks/useClickOutside.js";

const Business = () => {
  const modalRef = useRef(null);
  useClickOutside(modalRef, () => setShowModal(false));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Table & Filter State
  const [businessesList, setBusinessesList] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // UI / Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: "",
    toDate: ""
  });

  // Modal / Form State
  const [showModal, setShowModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [activeTab, setActiveTab] = useState("basic"); // "basic", "tax", "location", "branding"

  // Files State
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  // File Inputs Refs
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  // Address lookup options
  const countries = [{ id: 1, name: "India" }];
  const states = [
    { id: 1, name: "Goa" },
    { id: 2, name: "Maharashtra" },
    { id: 3, name: "Karnataka" }
  ];
  const cities = [
    { id: 1, name: "Panaji", stateId: 1 },
    { id: 2, name: "Margao", stateId: 1 },
    { id: 3, name: "Mumbai", stateId: 2 },
    { id: 4, name: "Pune", stateId: 2 },
    { id: 5, name: "Bengaluru", stateId: 3 }
  ];

  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    business_category: "",
    registration_number: "",
    gst_number: "",
    pan_number: "",
    email: "",
    mobile_number: "",
    alternate_mobile_number: "",
    website: "",
    address1: "",
    address2: "",
    landmark: "",
    pincode: "",
    id_city: "",
    id_state: "",
    id_country: 1,
    established_date: "",
    annual_turnover: "",
    employee_count: "",
    description: ""
  });

  const [permissions, setPermissions] = useState({
    add: true,
    edit: true,
    delete: true,
    view: true
  });

  useEffect(() => {
    const menuData = JSON.parse(localStorage.getItem("sidebarMenu")) || [];
    let perm = { add: true, edit: true, delete: true, view: true };
    for (const menu of menuData) {
      if (!menu.submenus) continue;
      const sub = menu.submenus.find(sm => sm.path === "/configure/business");
      if (sub) {
        perm = {
          add: sub.add,
          edit: sub.edit,
          delete: sub.delete,
          view: sub.view
        };
        break;
      }
    }
    setPermissions(perm);
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const body = {
        page,
        length: pageSize,
        search: debouncedSearch,
        from_date: appliedFilters.fromDate,
        to_date: appliedFilters.toDate
      };

      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await ApiService.getBusinessDataTable(body);
      const result = response?.data;
      if (result?.status !== "success") throw new Error(result?.message || "Failed to load Businesses");

      setBusinessesList(result.data || []);
      setTotalEntries(result.total_records ?? 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load business list");
      setBusinessesList([]);
      setTotalEntries(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [page, pageSize, appliedFilters, debouncedSearch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaviconFile(file);
      setFaviconPreview(URL.createObjectURL(file));
    }
  };

  const handleAddBusiness = () => {
    setEditingBusiness(null);
    setLogoFile(null);
    setFaviconFile(null);
    setLogoPreview(null);
    setFaviconPreview(null);
    setActiveTab("basic");
    setFormData({
      business_name: "",
      business_type: "",
      business_category: "",
      registration_number: "",
      gst_number: "",
      pan_number: "",
      email: "",
      mobile_number: "",
      alternate_mobile_number: "",
      website: "",
      address1: "",
      address2: "",
      landmark: "",
      pincode: "",
      id_city: "",
      id_state: "",
      id_country: 1,
      established_date: "",
      annual_turnover: "",
      employee_count: "",
      description: ""
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditBusiness = (b) => {
    setEditingBusiness(b);
    setLogoFile(null);
    setFaviconFile(null);
    setLogoPreview(b.logo_url || null);
    setFaviconPreview(b.favicon_url || null);
    setActiveTab("basic");
    setFormData({
      business_name: b.business_name || "",
      business_type: b.business_type || "",
      business_category: b.business_category || "",
      registration_number: b.registration_number || "",
      gst_number: b.gst_number || "",
      pan_number: b.pan_number || "",
      email: b.email || "",
      mobile_number: b.mobile_number || "",
      alternate_mobile_number: b.alternate_mobile_number || "",
      website: b.website || "",
      address1: b.address1 || "",
      address2: b.address2 || "",
      landmark: b.landmark || "",
      pincode: b.pincode || "",
      id_city: b.id_city || "",
      id_state: b.id_state || "",
      id_country: b.id_country || 1,
      established_date: b.established_date || "",
      annual_turnover: b.annual_turnover || "",
      employee_count: b.employee_count || "",
      description: b.description || ""
    });
    setErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.business_name.trim()) newErrors.business_name = "Business name is required";
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (formData.mobile_number.trim() && !/^\d{10,15}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = "Enter a valid mobile number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const startFakeProgress = () => {
    setProgress(0);
    return setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);
    const progressInterval = startFakeProgress();
    let res;

    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        payload.append(key, formData[key]);
      }
    });

    if (logoFile) {
      payload.append("logo", logoFile);
    }
    if (faviconFile) {
      payload.append("favicon", faviconFile);
    }

    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (editingBusiness) {
        res = await ApiService.updateBusiness(editingBusiness.id, payload);
      } else {
        res = await ApiService.addBusiness(payload);
      }

      setProgress(100);
      if (res.data?.status === "success") {
        toast.success(res.data.message || "Saved successfully");
        setShowModal(false);
        fetchBusinesses();
      } else {
        toast.error(res.data?.message || "Operation failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit business details");
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsSubmitting(false);
        setProgress(0);
      }, 400);
    }
  };

  const handleDeleteBusiness = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this business? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await ApiService.deleteBusiness(id);
        if (res.data?.status === "success") {
          toast.success("Business deleted!");
          fetchBusinesses();
        } else {
          toast.error(res.data?.message || "Failed to delete");
        }
      } catch (err) {
        toast.error("Failed to delete business");
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await ApiService.toggleBusinessActive(id);
      if (res.data?.status === "success") {
        toast.success(res.data.message || "Status updated");
        fetchBusinesses();
      } else {
        toast.error(res.data?.message || "Status update failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleCloseModal = () => setShowModal(false);

  // View Sidebar Drawer State
  const [showViewPanel, setShowViewPanel] = useState(false);
  const [viewBusiness, setViewBusiness] = useState(null);

  const handleViewBusiness = (b) => {
    setViewBusiness(b);
    setShowViewPanel(true);
  };

  const getCityName = (id) => cities.find(c => c.id === Number(id))?.name || "—";
  const getStateName = (id) => states.find(s => s.id === Number(id))?.name || "—";
  const getCountryName = (id) => countries.find(co => co.id === Number(id))?.name || "—";

  const handleExport = () => {
    if (!businessesList || businessesList.length === 0) return;
    const tableData = businessesList.map(b => ({
      "Business Name": b.business_name,
      Type: b.business_type,
      Category: b.business_category,
      Email: b.email,
      Mobile: b.mobile_number,
      GSTIN: b.gst_number,
      Status: b.is_active ? "Active" : "Inactive",
      "Created At": formatDate(b.created_at)
    }));
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Businesses");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Businesses.xlsx");
  };

  const totalPages = totalEntries === 0 ? 0 : Math.ceil(totalEntries / pageSize);
  const startIndex = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = totalEntries === 0 ? 0 : Math.min(page * pageSize, totalEntries);

  const generatePageNumbers = (current, total) => {
    const pages = [];
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    pages.push(1);
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push("...");
    pages.push(total);
    return pages;
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" style={{ marginTop: "25px" }} autoClose={5000} />

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Business Configuration</h2>
          <p className={styles.subtitle}>
            <span className={styles.highlightText}>Configure business profile information, contact numbers, branding logo, and favicons.</span>
          </p>
        </div>
        <div className={styles.headerActions}>
          {permissions.add && (
            <button className={styles.addButton} onClick={handleAddBusiness}>
              <FontAwesomeIcon icon={faPlus} /> Register Business
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <div className={styles.searchWrapper}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email or website..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setDebouncedSearch(searchTerm);
                  setPage(1);
                }
              }}
              className={styles.searchInput}
              style={{ borderRadius: "6px 0 0 6px", borderRight: "none" }}
            />
            <button
              onClick={() => { setDebouncedSearch(searchTerm); setPage(1); }}
              style={{
                padding: "8px 14px",
                background: "#39ab49",
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
          <button className={styles.exportButton} onClick={handleExport}>
            <FontAwesomeIcon icon={faFileExport} /> Export list
          </button>

          <div className={styles.entriesControl}>
            <label>Show</label>
            <select className={styles.entriesSelect} value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} ref={modalRef} style={{ maxWidth: '850px' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingBusiness ? "Edit Business details" : "Register Business details"}</h3>
              <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>

            {/* TAB CONTROLS */}
            <div className={styles.tabsContainer}>
              <button 
                type="button" 
                className={`${styles.tabButton} ${activeTab === 'basic' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '6px' }} /> Basic Profile
              </button>
              <button 
                type="button" 
                className={`${styles.tabButton} ${activeTab === 'tax' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('tax')}
              >
                <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ marginRight: '6px' }} /> Tax & Legal
              </button>
              <button 
                type="button" 
                className={`${styles.tabButton} ${activeTab === 'location' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('location')}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '6px' }} /> Contact & Location
              </button>
              <button 
                type="button" 
                className={`${styles.tabButton} ${activeTab === 'branding' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('branding')}
              >
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '6px' }} /> Assets & Branding
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* TAB 1: BASIC PROFILE */}
              {activeTab === 'basic' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Business Name <span className={styles.required}>*</span></label>
                      <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Enter business name"
                        required
                      />
                      {errors.business_name && <small className={styles.errorText}>{errors.business_name}</small>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Business Type</label>
                      <input
                        type="text"
                        name="business_type"
                        value={formData.business_type}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Hotel, Resort, Spa, Restaurant"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Business Category</label>
                      <input
                        type="text"
                        name="business_category"
                        value={formData.business_category}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="e.g. Luxury, Budget, Eco-friendly"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Established Date</label>
                      <input
                        type="date"
                        name="established_date"
                        value={formData.established_date}
                        onChange={handleInputChange}
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Annual Turnover</label>
                      <input
                        type="number"
                        name="annual_turnover"
                        value={formData.annual_turnover}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Turnover amount"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Employee Count</label>
                      <input
                        type="number"
                        name="employee_count"
                        value={formData.employee_count}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Number of staff"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Website URL</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      placeholder="About this business branch/entity..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: TAX & LEGAL */}
              {activeTab === 'tax' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Registration Number</label>
                    <input
                      type="text"
                      name="registration_number"
                      value={formData.registration_number}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Enter Registration/license number"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>GSTIN (GST Number)</label>
                      <input
                        type="text"
                        name="gst_number"
                        value={formData.gst_number}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="22AAAAA0000A1Z5"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>PAN Number</label>
                      <input
                        type="text"
                        name="pan_number"
                        value={formData.pan_number}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CONTACT & LOCATION */}
              {activeTab === 'location' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="business@example.com"
                      />
                      {errors.email && <small className={styles.errorText}>{errors.email}</small>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Mobile Number</label>
                      <input
                        type="text"
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Main contact number"
                      />
                      {errors.mobile_number && <small className={styles.errorText}>{errors.mobile_number}</small>}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Alternate Mobile Number</label>
                    <input
                      type="text"
                      name="alternate_mobile_number"
                      value={formData.alternate_mobile_number}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Backup contact number"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Address Line 1</label>
                      <input
                        type="text"
                        name="address1"
                        value={formData.address1}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Street address, building name"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Address Line 2</label>
                      <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Locality, Floor, Room No"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Landmark</label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Near hotel, mall, etc."
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        placeholder="Pincode / ZIP"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow} style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Country</label>
                      <select
                        name="id_country"
                        value={formData.id_country}
                        onChange={handleInputChange}
                        className={styles.formInput}
                      >
                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>State</label>
                      <select
                        name="id_state"
                        value={formData.id_state}
                        onChange={handleInputChange}
                        className={styles.formInput}
                      >
                        <option value="">-- Select State --</option>
                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>City</label>
                      <select
                        name="id_city"
                        value={formData.id_city}
                        onChange={handleInputChange}
                        className={styles.formInput}
                      >
                        <option value="">-- Select City --</option>
                        {cities
                          .filter(c => !formData.id_state || c.stateId === Number(formData.id_state))
                          .map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                        }
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ASSETS & BRANDING */}
              {activeTab === 'branding' && (
                <div className={styles.uploadContainer}>
                  {/* LOGO UPLOAD */}
                  <div className={styles.formGroup} style={{ background: '#fcfcfc', border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                    <label className={styles.formLabel}>Business Logo</label>
                    <div 
                      className={styles.uploadCard} 
                      onClick={() => logoInputRef.current.click()}
                    >
                      <FontAwesomeIcon icon={faUpload} className={styles.uploadIcon} />
                      <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#666' }}>Click to select Logo file</span>
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>(Max 2MB, PNG / JPG)</span>
                    </div>
                    <input 
                      type="file" 
                      ref={logoInputRef} 
                      style={{ display: 'none' }} 
                      accept="image/*" 
                      onChange={handleLogoChange} 
                    />

                    {logoPreview && (
                      <div className={styles.previewContainer}>
                        <img src={logoPreview} alt="Logo preview" className={styles.previewImage} />
                        <button 
                          type="button" 
                          className={styles.removeFileBtn} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setLogoFile(null);
                            setLogoPreview(null);
                            if (logoInputRef.current) logoInputRef.current.value = "";
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  {/* FAVICON UPLOAD */}
                  <div className={styles.formGroup} style={{ background: '#fcfcfc', border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                    <label className={styles.formLabel}>Browser Favicon</label>
                    <div 
                      className={styles.uploadCard} 
                      onClick={() => faviconInputRef.current.click()}
                    >
                      <FontAwesomeIcon icon={faUpload} className={styles.uploadIcon} />
                      <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#666' }}>Click to select Favicon file</span>
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>(Max 500KB, ICO / PNG)</span>
                    </div>
                    <input 
                      type="file" 
                      ref={faviconInputRef} 
                      style={{ display: 'none' }} 
                      accept="image/*" 
                      onChange={handleFaviconChange} 
                    />

                    {faviconPreview && (
                      <div className={styles.previewContainer}>
                        <img src={faviconPreview} alt="Favicon preview" className={styles.previewImage} />
                        <button 
                          type="button" 
                          className={styles.removeFileBtn} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFaviconFile(null);
                            setFaviconPreview(null);
                            if (faviconInputRef.current) faviconInputRef.current.value = "";
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? `${progress}% Saving...` : "Submit details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <PageLoader message="Loading Businesses list..." />
        ) : (
          <table className="table table-bordered table-hover mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th className={styles.table_head}>Actions</th>
                <th className={styles.table_head}>Sno</th>
                <th className={styles.table_head}>Logo</th>
                <th className={styles.table_head}>Business Name</th>
                <th className={styles.table_head}>Type & Category</th>
                <th className={styles.table_head}>GSTIN</th>
                <th className={styles.table_head}>Contact Mobile</th>
                <th className={styles.table_head}>Status</th>
              </tr>
            </thead>
            <tbody>
              {businessesList.length > 0 ? businessesList.map((u, index) => (
                <tr key={u.id}>
                  <td>
                    <button className={styles.iconButton} onClick={() => handleViewBusiness(u)} title="View details" style={{ background: '#17a2b8' }}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    {permissions.edit && (
                      <button className={styles.iconButton} onClick={() => handleEditBusiness(u)} title="Edit Business">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    )}
                    {permissions.delete && (
                      <button className={`${styles.iconButton} ${styles.delete}`} onClick={() => handleDeleteBusiness(u.id)} title="Delete Business">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </td>
                  <td>{(page - 1) * pageSize + index + 1}</td>
                  <td>
                    {u.logo_url ? (
                      <img src={u.logo_url} alt="Logo" className={styles.logoThumbnail} />
                    ) : (
                      <div className={styles.logoThumbnail} style={{ display: 'flex', alignItems: 'center', justify: 'center', background: '#e9ecef', color: '#6c757d', fontWeight: 'bold', fontSize: '0.8rem' }}>NA</div>
                    )}
                  </td>
                  <td>{u.business_name}</td>
                  <td>
                    <div>{u.business_type || '—'}</div>
                    <small style={{ color: '#888' }}>{u.business_category || ''}</small>
                  </td>
                  <td>{u.gst_number || '—'}</td>
                  <td>{u.mobile_number || '—'}</td>
                  <td>
                    <div className={submenuStyles.statusToggle} onClick={() => handleToggleActive(u.id)}>
                      <div className={`${submenuStyles.toggleSwitch} ${u.is_active ? submenuStyles.active : submenuStyles.inactive}`}>
                        <div className={submenuStyles.toggleKnob}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className={styles.noData}>No businesses configured yet.</td>
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
                <span key={`dots-${index}`} className={styles.paginationBtn}>...</span>
              ) : (
                <button
                  key={p}
                  className={`${styles.paginationBtn} ${page === p ? styles.activePage : ""}`}
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

      {/* DETAILS VIEW PANEL */}
      {showViewPanel && viewBusiness && (
        <>
          <div className={styles.panelOverlay} onClick={() => setShowViewPanel(false)} />
          <div className={styles.viewPanel}>
            <div className={styles.viewPanelHeader}>
              <h3 className={styles.viewPanelTitle}>Business Profile</h3>
              <button className={styles.closeButton} onClick={() => setShowViewPanel(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className={styles.viewPanelBody}>
              <div className={styles.viewAvatar} style={{ overflow: 'hidden', padding: '5px', background: '#fff', border: '1px solid #ddd' }}>
                {viewBusiness.logo_url ? (
                  <img src={viewBusiness.logo_url} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  viewBusiness.business_name.charAt(0).toUpperCase()
                )}
              </div>
              <div className={styles.viewName}>
                {viewBusiness.business_name}
              </div>
              <div className={styles.viewBadge} style={{ color: viewBusiness.is_active ? '#155724' : '#721c24', background: viewBusiness.is_active ? '#d4edda' : '#f8d7da' }}>
                {viewBusiness.is_active ? 'Active' : 'Inactive'}
              </div>

              <div className={styles.viewGrid}>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Type</span>
                  <span className={styles.viewValue}>{viewBusiness.business_type || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Category</span>
                  <span className={styles.viewValue}>{viewBusiness.business_category || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Reg No.</span>
                  <span className={styles.viewValue}>{viewBusiness.registration_number || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>GSTIN</span>
                  <span className={styles.viewValue}>{viewBusiness.gst_number || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>PAN</span>
                  <span className={styles.viewValue}>{viewBusiness.pan_number || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Email</span>
                  <span className={styles.viewValue} style={{ fontSize: '0.78rem' }}>{viewBusiness.email || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Mobile</span>
                  <span className={styles.viewValue}>{viewBusiness.mobile_number || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Website</span>
                  <span className={styles.viewValue} style={{ fontSize: '0.78rem' }}>{viewBusiness.website || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Established</span>
                  <span className={styles.viewValue}>{viewBusiness.established_date || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Turnover</span>
                  <span className={styles.viewValue}>{viewBusiness.annual_turnover ? `₹ ${viewBusiness.annual_turnover}` : '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Employees</span>
                  <span className={styles.viewValue}>{viewBusiness.employee_count || '—'}</span>
                </div>
              </div>

              <h4 style={{ margin: "25px 0 10px 0", color: "#39ab49", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Address Details</h4>
              <div className={styles.viewGrid}>
                <div className={styles.viewItem} style={{ gridColumn: "span 2" }}>
                  <span className={styles.viewLabel}>Address line 1</span>
                  <span className={styles.viewValue}>{viewBusiness.address1 || '—'}</span>
                </div>
                <div className={styles.viewItem} style={{ gridColumn: "span 2" }}>
                  <span className={styles.viewLabel}>Address line 2</span>
                  <span className={styles.viewValue}>{viewBusiness.address2 || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Landmark</span>
                  <span className={styles.viewValue}>{viewBusiness.landmark || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Pincode</span>
                  <span className={styles.viewValue}>{viewBusiness.pincode || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>City</span>
                  <span className={styles.viewValue}>{getCityName(viewBusiness.id_city)}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>State</span>
                  <span className={styles.viewValue}>{getStateName(viewBusiness.id_state)}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Country</span>
                  <span className={styles.viewValue}>{getCountryName(viewBusiness.id_country)}</span>
                </div>
              </div>

              {viewBusiness.description && (
                <>
                  <h4 style={{ margin: "25px 0 10px 0", color: "#39ab49", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Description</h4>
                  <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: '1.5', background: '#fafafa', padding: '10px', borderRadius: '6px', border: '1px solid #eee' }}>{viewBusiness.description}</p>
                </>
              )}

              {viewBusiness.favicon_url && (
                <>
                  <h4 style={{ margin: "25px 0 10px 0", color: "#39ab49", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Favicon Asset</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fafafa', padding: '10px', borderRadius: '6px', border: '1px solid #eee' }}>
                    <img src={viewBusiness.favicon_url} alt="Favicon" className={styles.faviconThumbnail} />
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>Active business tab favicon</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Business;
