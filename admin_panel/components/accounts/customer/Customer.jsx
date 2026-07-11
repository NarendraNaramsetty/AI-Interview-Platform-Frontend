import React, { useState, useEffect, useRef } from 'react';
import { State, City } from 'country-state-city';
import styles from './Customer.module.css';
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
import useClickOutside from "../../../hooks/useClickOutside.js";

const Customer = () => {
  const modalRef = useRef(null);
  useClickOutside(modalRef, () => setShowModal(false));

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    mobile: "",
    profile_image: "",
    country: "India",
    state: "",
    city: "",
    current_address: {
      address1: "",
      address2: "",
      landmark: "",
      pincode: "",
      id_city: "",
      id_state: "",
      id_country: 1,
      is_permunant: true
    },
    permanent_address: {
      address1: "",
      address2: "",
      landmark: "",
      pincode: "",
      id_city: "",
      id_state: "",
      id_country: 1
    }
  });

  const indianStates = State.getStatesOfCountry("IN");
  const selectedStateObj = indianStates.find(s => s.name === formData.state);
  const selectedStateIsoCode = selectedStateObj ? selectedStateObj.isoCode : "";
  const citiesForSelectedState = selectedStateIsoCode ? City.getCitiesOfState("IN", selectedStateIsoCode) : [];

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setFormData(prev => ({
      ...prev,
      state: stateName,
      city: ""
    }));
    setErrors(prev => ({ ...prev, state: "", city: "" }));
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setFormData(prev => ({
      ...prev,
      city: cityName
    }));
    setErrors(prev => ({ ...prev, city: "" }));
  };

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Table & Filter State
  const [customersList, setCustomersList] = useState([]);
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
  const [customerTypeFilter, setCustomerTypeFilter] = useState("");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: "",
    toDate: "",
    status: ""
  });

  // Image upload state (new approach with webcam support)
  const [imageData, setImageData] = useState({
    type: null, // 'file', 'webcam', or 'remove'
    data: null,
    format: null
  });

  // Modal / Form State
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isSameAddress, setIsSameAddress] = useState(true);

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



  const [permissions, setPermissions] = useState({
    add: true,
    edit: true,
    delete: true,
    view: true
  });

  useEffect(() => {
    const menuData = JSON.parse(localStorage.getItem("sidebarMenu")) || [];
    let customerPerm = { add: true, edit: true, delete: true, view: true };
    for (const menu of menuData) {
      if (!menu.submenus) continue;
      const sub = menu.submenus.find(sm => sm.path === "/accounts/customer");
      if (sub) {
        customerPerm = {
          add: sub.add,
          edit: sub.edit,
          delete: sub.delete,
          view: sub.view
        };
        break;
      }
    }
    setPermissions(customerPerm);
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const body = {
        page,
        length: pageSize,
        search: debouncedSearch,
        from_date: appliedFilters.fromDate,
        to_date: appliedFilters.toDate,
        customer_type: customerTypeFilter,
        is_active: appliedFilters.status
      };

      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await ApiService.getCustomerDataTable(body);
      const result = response?.data;
      if (result?.status !== "success") throw new Error(result?.message || "Failed to load Customers");

      setCustomersList(result.data || []);
      setTotalEntries(result.total_records ?? 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customer list");
      setCustomersList([]);
      setTotalEntries(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, appliedFilters, debouncedSearch, customerTypeFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleAddressChange = (type, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: value
      }
    }));
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsSameAddress(checked);
    setFormData(prev => ({
      ...prev,
      current_address: {
        ...prev.current_address,
        is_permunant: checked
      }
    }));
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

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsSameAddress(true);
    setImageData({
      type: null,
      data: null,
      format: null
    });
    setFormData({
      first_name: "",
      last_name: "",
      password: "",
      email: "",
      mobile: "",
      profile_image: "",
      country: "India",
      state: "",
      city: "",
      current_address: {
        address1: "",
        address2: "",
        landmark: "",
        pincode: "",
        id_city: "",
        id_state: "",
        id_country: 1,
        is_permunant: true
      },
      permanent_address: {
        address1: "",
        address2: "",
        landmark: "",
        pincode: "",
        id_city: "",
        id_state: "",
        id_country: 1
      }
    });
    setShowModal(true);
  };

  const handleEditCustomer = (c) => {
    setEditingCustomer(c);
    const currAddr = c.current_address || {};
    const permAddr = c.permanent_address || {};
    const checked = currAddr.is_permunant ?? true;
    setIsSameAddress(checked);
    setImageData({
      type: null,
      data: null,
      format: null
    });

    setFormData({
      first_name: c.first_name || "",
      last_name: c.last_name || "",
      password: "",
      email: c.email || "",
      mobile: c.mobile || "",
      profile_image: c.profile_image || "",
      country: c.country || "India",
      state: c.state || "",
      city: c.city || "",
      current_address: {
        address1: currAddr.address1 || "",
        address2: currAddr.address2 || "",
        landmark: currAddr.landmark || "",
        pincode: currAddr.pincode || "",
        id_city: currAddr.id_city || "",
        id_state: currAddr.id_state || "",
        id_country: currAddr.id_country || 1,
        is_permunant: checked
      },
      permanent_address: {
        address1: permAddr.address1 || "",
        address2: permAddr.address2 || "",
        landmark: permAddr.landmark || "",
        pincode: permAddr.pincode || "",
        id_city: permAddr.id_city || "",
        id_state: permAddr.id_state || "",
        id_country: permAddr.id_country || 1
      }
    });
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!editingCustomer && !formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Validate current address
    if (!formData.current_address.address1.trim()) {
      newErrors.current_address1 = "Address line 1 is required";
    }
    if (!formData.current_address.pincode.trim()) {
      newErrors.current_pincode = "Pincode is required";
    }

    // Validate permanent address if not same
    if (!isSameAddress) {
      if (!formData.permanent_address.address1.trim()) {
        newErrors.permanent_address1 = "Address line 1 is required";
      }
      if (!formData.permanent_address.pincode.trim()) {
        newErrors.permanent_pincode = "Pincode is required";
      }
    }

    // Validate state and city
    if (!formData.state) {
      newErrors.state = "State is required";
    }
    if (!formData.city) {
      newErrors.city = "City is required";
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
    if (!validateForm()) return;

    setIsSubmitting(true);
    const progressInterval = startFakeProgress();
    let res;

    // Build FormData (supports file upload and webcam)
    const formPayload = new FormData();
    formPayload.append("first_name", formData.first_name);
    formPayload.append("last_name", formData.last_name || "");
    formPayload.append("email", formData.email);
    formPayload.append("mobile", formData.mobile);
    formPayload.append("country", formData.country || "India");
    formPayload.append("state", formData.state || "");
    formPayload.append("city", formData.city || "");
    if (formData.password && formData.password.trim()) {
      formPayload.append("password", formData.password);
    }

    const currentAddr = { ...formData.current_address };
    const permanentAddr = isSameAddress
      ? { ...formData.current_address, is_permunant: false }
      : { ...formData.permanent_address };

    formPayload.append("current_address", JSON.stringify(currentAddr));
    formPayload.append("permanent_address", JSON.stringify(permanentAddr));

    // Add image data based on type
    if (imageData.type === 'file') {
      formPayload.append('profile_image', imageData.data);
    } else if (imageData.type === 'webcam') {
      formPayload.append('image_data', imageData.data);
      formPayload.append('upload_method', 'webcam');
      formPayload.append('image_format', imageData.format);
    } else if (imageData.type === 'remove') {
      formPayload.append('remove_profile_image', 'true');
    }

    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (editingCustomer) {
        res = await api.put(`/customer/update/${editingCustomer.id}/`, formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        res = await api.post('/customer/add/', formPayload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setProgress(100);
      if (res.data?.status === "success") {
        const successMsg = res.data.message || "Saved successfully";
        setShowModal(false);
        fetchCustomers();
        // Show Swal alert for create with password info
        if (!editingCustomer) {
          Swal.fire({
            icon: 'success',
            title: 'Customer Created!',
            html: `<p style="font-size:1rem;">${successMsg}</p>`,
            confirmButtonColor: '#39ab49',
            confirmButtonText: 'OK'
          });
        } else {
          toast.success(successMsg);
        }
      } else {
        toast.error(res.data?.message || "Operation failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to submit customer details";
      toast.error(errorMessage);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsSubmitting(false);
        setProgress(0);
      }, 400);
    }
  };

  const handleDeleteCustomer = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this customer? This action cannot be undone.",
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
        const res = await ApiService.deleteCustomer(id);
        if (res.data?.status === "success") {
          toast.success("Customer deleted!");
          fetchCustomers();
        } else {
          toast.error(res.data?.message || "Failed to delete");
        }
      } catch (err) {
        toast.error("Failed to delete customer");
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await ApiService.toggleCustomerActive(id);
      if (res.data?.status === "success") {
        toast.success(res.data.message || "Status updated");
        fetchCustomers();
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
  const [viewCustomer, setViewCustomer] = useState(null);

  const handleViewCustomer = (c) => {
    setViewCustomer(c);
    setShowViewPanel(true);
  };

  const getCityName = (id) => cities.find(c => c.id === Number(id))?.name || "—";
  const getStateName = (id) => states.find(s => s.id === Number(id))?.name || "—";
  const getCountryName = (id) => countries.find(co => co.id === Number(id))?.name || "—";

  const handleExport = () => {
    if (!customersList || customersList.length === 0) return;
    const tableData = customersList.map(u => ({
      Name: u.name,
      Mobile: u.mobile,
      Email: u.email,
      Status: u.is_active ? "Active" : "Inactive",
      CreatedAt: formatDate(u.created_at)
    }));
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Customers.xlsx");
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

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  const getColSpan = () => {
    let count = 6; // Sno, Profile, Name, Mobile, Email, Status
    if (permissions.edit || permissions.delete || permissions.view) count += 1;
    return count;
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" style={{ marginTop: "25px" }} autoClose={5000} />

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Customer Management</h2>
          <p className={styles.subtitle}>
            <span className={styles.highlightText}>Create, view and manage resort customers and their addresses</span>
          </p>
        </div>
        <div className={styles.headerActions}>
          {permissions.add && (
            <button className={styles.addButton} onClick={handleAddCustomer}>
              <FontAwesomeIcon icon={faPlus} /> Create Customer
            </button>
          )}
        </div>
      </div>

      {/* Filters - Professional Design */}
      <div className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <div className={styles.filterTitleSection}>
            <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
            <h4 className={styles.filterTitle}>Filter Customers</h4>
          </div>
        </div>
        <div className={styles.filterBody}>
          <div className={styles.filterRow}>
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
                  setSelectedFilterStatus("");
                  setSearchTerm("");
                  setDebouncedSearch("");
                  setCustomerTypeFilter("");
                  setAppliedFilters({ fromDate: "", toDate: "", status: "" });
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
              placeholder="Search by name, email or mobile..."
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

        {/* Customer Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 600, color: '#2c3e50', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>Type:</label>
          <select
            value={customerTypeFilter}
            onChange={(e) => { setCustomerTypeFilter(e.target.value); setPage(1); }}
            style={{
              padding: '8px 14px',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              background: '#fff',
              color: '#2c3e50',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: '500',
              minWidth: '140px'
            }}
          >
            <option value="">All Customers</option>
            <option value="online">🌐 Online</option>
            <option value="offline">🏪 Offline</option>
          </select>
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
              <h3 className={styles.modalTitle}>{editingCustomer ? "Edit Customer Details" : "Register New Customer"}</h3>
              <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Profile Image Upload Component */}
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1', marginBottom: '15px' }}>
                <label className={styles.formLabel}>Profile Image</label>
                <ProfileImageUpload
                  existingImage={formData.profile_image}
                  onImageChange={handleImageChange}
                  onImageRemove={handleImageRemove}
                />
              </div>

              {/* Basic Details Section */}
              <h4 style={{ margin: "15px 0 5px 0", color: "#39ab49", borderBottom: "2px solid #39ab49", paddingBottom: "5px" }}>Basic Information</h4>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>First Name <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Enter first name"
                  />
                  {errors.first_name && <small className={styles.errorText}>{errors.first_name}</small>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mobile Number <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    className={styles.formInput}
                    placeholder="Enter 10 digit mobile"
                    maxLength={10}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");
                      setFormData(prev => ({ ...prev, mobile: onlyNumbers }));
                      setErrors(prev => ({ ...prev, mobile: "" }));
                    }}
                  />
                  {errors.mobile && <small className={styles.errorText}>{errors.mobile}</small>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Password {!editingCustomer && <span className={styles.required}>*</span>}</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder={editingCustomer ? "Leave blank to keep current password" : "Enter password"}
                  />
                  {errors.password && <small className={styles.errorText}>{errors.password}</small>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
                  <label className={styles.formLabel}>Email ID <span className={styles.required}>*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="customer@email.com"
                  />
                  {errors.email && <small className={styles.errorText}>{errors.email}</small>}
                </div>
              </div>

              {/* Current Address Section */}
              <h4 style={{ margin: "15px 0 5px 0", color: "#39ab49", borderBottom: "2px solid #39ab49", paddingBottom: "5px" }}>Current Address Details</h4>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Address Line 1 <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.current_address.address1}
                    onChange={(e) => handleAddressChange("current_address", e)}
                    className={styles.formInput}
                    placeholder="House/Room No, Street name"
                  />
                  {errors.current_address1 && <small className={styles.errorText}>{errors.current_address1}</small>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Address Line 2</label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.current_address.address2}
                    onChange={(e) => handleAddressChange("current_address", e)}
                    className={styles.formInput}
                    placeholder="Apartment/Locality"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.current_address.landmark}
                    onChange={(e) => handleAddressChange("current_address", e)}
                    className={styles.formInput}
                    placeholder="Near shopping mall, hospital etc."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Pincode <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.current_address.pincode}
                    onChange={(e) => handleAddressChange("current_address", e)}
                    className={styles.formInput}
                    placeholder="6-digit pincode"
                    maxLength={10}
                  />
                  {errors.current_pincode && <small className={styles.errorText}>{errors.current_pincode}</small>}
                </div>
              </div>

              <div className={styles.formRow} style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    disabled
                    className={styles.formInput}
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>State <span className={styles.required}>*</span></label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    className={styles.formInput}
                  >
                    <option value="">-- Select State --</option>
                    {indianStates.map(s => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
                  </select>
                  {errors.state && <small className={styles.errorText}>{errors.state}</small>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>City <span className={styles.required}>*</span></label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleCityChange}
                    disabled={!formData.state}
                    className={styles.formInput}
                  >
                    <option value="">-- Select City --</option>
                    {citiesForSelectedState.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  {errors.city && <small className={styles.errorText}>{errors.city}</small>}
                </div>
              </div>

              <div className={styles.formGroup} style={{ marginTop: "10px" }}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isSameAddress}
                    onChange={handleCheckboxChange}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxText}>Permanent address is same as current address</span>
                </label>
              </div>

              {/* Permanent Address Section */}
              {!isSameAddress && (
                <>
                  <h4 style={{ margin: "15px 0 5px 0", color: "#39ab49", borderBottom: "2px solid #39ab49", paddingBottom: "5px" }}>Permanent Address Details</h4>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Address Line 1 <span className={styles.required}>*</span></label>
                      <input
                        type="text"
                        name="address1"
                        value={formData.permanent_address.address1}
                        onChange={(e) => handleAddressChange("permanent_address", e)}
                        className={styles.formInput}
                        placeholder="House/Room No, Street name"
                      />
                      {errors.permanent_address1 && <small className={styles.errorText}>{errors.permanent_address1}</small>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Address Line 2</label>
                      <input
                        type="text"
                        name="address2"
                        value={formData.permanent_address.address2}
                        onChange={(e) => handleAddressChange("permanent_address", e)}
                        className={styles.formInput}
                        placeholder="Apartment/Locality"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Landmark</label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.permanent_address.landmark}
                        onChange={(e) => handleAddressChange("permanent_address", e)}
                        className={styles.formInput}
                        placeholder="Near landmark"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Pincode <span className={styles.required}>*</span></label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.permanent_address.pincode}
                        onChange={(e) => handleAddressChange("permanent_address", e)}
                        className={styles.formInput}
                        placeholder="6-digit pincode"
                        maxLength={10}
                      />
                      {errors.permanent_pincode && <small className={styles.errorText}>{errors.permanent_pincode}</small>}
                    </div>
                  </div>

                  <div className={styles.formRow} style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        disabled
                        className={styles.formInput}
                      >
                        <option value="India">India</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>State <span className={styles.required}>*</span></label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleStateChange}
                        className={styles.formInput}
                      >
                        <option value="">-- Select State --</option>
                        {indianStates.map(s => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
                      </select>
                      {errors.state && <small className={styles.errorText}>{errors.state}</small>}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>City <span className={styles.required}>*</span></label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleCityChange}
                        disabled={!formData.state}
                        className={styles.formInput}
                      >
                        <option value="">-- Select City --</option>
                        {citiesForSelectedState.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                      {errors.city && <small className={styles.errorText}>{errors.city}</small>}
                    </div>
                  </div>
                </>
              )}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? progress + "% Saving..." : "Submit details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <PageLoader message="Loading Customers list..." />
        ) : (
          <table className="table table-bordered table-hover mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th className={styles.table_head}>Actions</th>
                <th className={styles.table_head}>Sno</th>
                <th className={styles.table_head}>Profile</th>
                <th className={styles.table_head}>Customer Name</th>
                <th className={styles.table_head}>Mobile</th>
                <th className={styles.table_head}>Email ID</th>
                <th className={styles.table_head}>Type</th>
                <th className={styles.table_head}>Status</th>
              </tr>
            </thead>
            <tbody>
              {customersList.length > 0 ? customersList.map((u, index) => (
                <tr key={u.id}>
                  <td>
                    <button className={styles.iconButton} onClick={() => handleViewCustomer(u)} title="View details" style={{ background: '#17a2b8' }}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    {permissions.edit && (
                      <button className={styles.iconButton} onClick={() => handleEditCustomer(u)} title="Edit Customer">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    )}
                    {permissions.delete && (
                      <button className={`${styles.iconButton} ${styles.delete}`} onClick={() => handleDeleteCustomer(u.id)} title="Delete Customer">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </td>
                  <td>{(page - 1) * pageSize + index + 1}</td>
                  <td>
                    {u.profile_image ? (
                      <img src={u.profile_image} alt="profile" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #39ab49' }} />
                    ) : (
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#39ab49', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                        {toTitleCase(u.name || '').split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                      </div>
                    )}
                  </td>
                  <td>{toTitleCase(u.name)}</td>
                  <td>{u.mobile}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                      background: u.customer_type === 'online' ? '#d4edda' : '#fff3cd',
                      color: u.customer_type === 'online' ? '#155724' : '#856404',
                      border: `1px solid ${u.customer_type === 'online' ? '#c3e6cb' : '#ffeeba'}`
                    }}>
                      {u.customer_type === 'online' ? '🌐 Online' : '🏪 Offline'}
                    </span>
                  </td>
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
                  <td colSpan={getColSpan()} className={styles.noData}>No customers registered yet.</td>
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
      {showViewPanel && viewCustomer && (
        <>
          <div className={styles.panelOverlay} onClick={() => setShowViewPanel(false)} />
          <div className={styles.viewPanel}>
            <div className={styles.viewPanelHeader}>
              <h3 className={styles.viewPanelTitle}>Customer Full Profile</h3>
              <button className={styles.closeButton} onClick={() => setShowViewPanel(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className={styles.viewPanelBody}>
              {viewCustomer.profile_image ? (
                <img
                  src={viewCustomer.profile_image}
                  alt="Profile"
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #39ab49', display: 'block', margin: '0 auto 12px auto', boxShadow: '0 4px 16px rgba(57,171,73,0.3)' }}
                />
              ) : (
                <div className={styles.viewAvatar}>
                  {toTitleCase(viewCustomer.name).split(" ").map(n => n.charAt(0)).join("").slice(0, 2)}
                </div>
              )}
              <div className={styles.viewName}>
                {toTitleCase(viewCustomer.name)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div className={styles.viewBadge}>{viewCustomer.is_active ? 'Active' : 'Inactive'}</div>
                <span style={{
                  padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                  background: viewCustomer.customer_type === 'online' ? '#d4edda' : '#fff3cd',
                  color: viewCustomer.customer_type === 'online' ? '#155724' : '#856404',
                  border: `1px solid ${viewCustomer.customer_type === 'online' ? '#c3e6cb' : '#ffeeba'}`
                }}>
                  {viewCustomer.customer_type === 'online' ? '🌐 Online' : '🏪 Offline'}
                </span>
              </div>

              <div className={styles.viewGrid}>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Mobile</span>
                  <span className={styles.viewValue}>{viewCustomer.mobile || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Email Address</span>
                  <span className={styles.viewValue}>{viewCustomer.email || '—'}</span>
                </div>
                <div className={styles.viewItem}>
                  <span className={styles.viewLabel}>Registered On</span>
                  <span className={styles.viewValue}>{formatDate(viewCustomer.created_at) || '—'}</span>
                </div>
              </div>

              {/* Current Address Details */}
              <h4 style={{ margin: "25px 0 10px 0", color: "#39ab49", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Current Address</h4>
              {viewCustomer.current_address ? (
                <div className={styles.viewGrid}>
                  <div className={styles.viewItem} style={{ gridColumn: "span 2" }}>
                    <span className={styles.viewLabel}>Address line 1</span>
                    <span className={styles.viewValue}>{viewCustomer.current_address.address1}</span>
                  </div>
                  {viewCustomer.current_address.address2 && (
                    <div className={styles.viewItem} style={{ gridColumn: "span 2" }}>
                      <span className={styles.viewLabel}>Address line 2</span>
                      <span className={styles.viewValue}>{viewCustomer.current_address.address2}</span>
                    </div>
                  )}
                  {viewCustomer.current_address.landmark && (
                    <div className={styles.viewItem}>
                      <span className={styles.viewLabel}>Landmark</span>
                      <span className={styles.viewValue}>{viewCustomer.current_address.landmark}</span>
                    </div>
                  )}
                  <div className={styles.viewItem}>
                    <span className={styles.viewLabel}>Pincode</span>
                    <span className={styles.viewValue}>{viewCustomer.current_address.pincode}</span>
                  </div>
                  <div className={styles.viewItem}>
                    <span className={styles.viewLabel}>City</span>
                    <span className={styles.viewValue}>{viewCustomer.city || getCityName(viewCustomer.current_address.id_city)}</span>
                  </div>
                  <div className={styles.viewItem}>
                    <span className={styles.viewLabel}>State</span>
                    <span className={styles.viewValue}>{viewCustomer.state || getStateName(viewCustomer.current_address.id_state)}</span>
                  </div>
                  <div className={styles.viewItem}>
                    <span className={styles.viewLabel}>Country</span>
                    <span className={styles.viewValue}>{viewCustomer.country || getCountryName(viewCustomer.current_address.id_country)}</span>
                  </div>
                </div>
              ) : (
                <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>No current address information available.</p>
              )}

              {/* Permanent Address Details */}
              <h4 style={{ margin: "25px 0 10px 0", color: "#39ab49", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Permanent Address</h4>
              {viewCustomer.current_address?.is_permunant ? (
                <p style={{ color: "#28a745", fontSize: "0.95rem", fontWeight: "500" }}>✓ Same as current address</p>
              ) : viewCustomer.permanent_address ? (
                <div className={styles.viewGrid}>
                  <div className={styles.viewItem} style={{ gridColumn: "span 2" }}>
                    <span className={styles.viewLabel}>Address line 1</span>
                    <span className={styles.viewValue}>{viewCustomer.permanent_address.address1}</span>
                  </div>
                  {viewCustomer.permanent_address.address2 && (
                    <div className={styles.viewItem} style={{ gridColumn: "span 2" }}>
                      <span className={styles.viewLabel}>Address line 2</span>
                      <span className={styles.viewValue}>{viewCustomer.permanent_address.address2}</span>
                    </div>
                  )}
                  {viewCustomer.permanent_address.landmark && (
                    <div className={styles.viewItem}>
                      <span className={styles.viewLabel}>Landmark</span>
                      <span className={styles.viewValue}>{viewCustomer.permanent_address.landmark}</span>
                    </div>
                  )}
                  <div className={styles.viewItem}>
                    <span className={styles.viewLabel}>Pincode</span>
                    <span className={styles.viewValue}>{viewCustomer.permanent_address.pincode}</span>
                  </div>
                  <div className={styles.viewItem}>
                    <span className={styles.viewLabel}>City</span>
                    <span className={styles.viewValue}>{viewCustomer.city || getCityName(viewCustomer.permanent_address.id_city)}</span>
                  </div>
                  <div className={styles.viewItem}>
                    <span className={styles.viewLabel}>State</span>
                    <span className={styles.viewValue}>{viewCustomer.state || getStateName(viewCustomer.permanent_address.id_state)}</span>
                  </div>
                  <div className={styles.viewItem}>
                    <span className={styles.viewLabel}>Country</span>
                    <span className={styles.viewValue}>{viewCustomer.country || getCountryName(viewCustomer.permanent_address.id_country)}</span>
                  </div>
                </div>
              ) : (
                <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>No permanent address information available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Customer;
