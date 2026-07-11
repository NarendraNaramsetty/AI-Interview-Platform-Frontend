import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Foodorders.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import Swal from 'sweetalert2';
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faFilter, faUtensils, faUser, faCalendarAlt, 
  faMoneyBillWave, faClock, faCheckCircle, faTimesCircle,
  faExclamationTriangle, faEdit, faTrash, faEye, faPlus
} from "@fortawesome/free-solid-svg-icons";
import {
  isJQueryValidateReady,
  defaultValidateOptions,
  destroyValidator,
} from '../../../../utils/jqValidation';

const Foodorders = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => { 
    localStorage.clear();
    sessionStorage.clear();
    toast.info("You have been logged out", { autoClose: 1000 });
    navigate("/adminlogin");
  };

  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    guest_id: '',
    table_id: '',
    order_status: 'Pending',
    total_amount: 0
  });

  // Create Order Form states
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [orderType, setOrderType] = useState('Dining');
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [orderItems, setOrderItems] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);

  const submitCreateOrderRef = useRef(null);

  // Dropdown list data
  const [foodItems, setFoodItems] = useState([]);

  // Fetch dropdown data on mount
  const fetchDropdownData = async () => {
    try {
      const itemsRes = await ApiService.getAllFoodItems();
      if (itemsRes.data?.status === 'success') {
        setFoodItems(itemsRes.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  // ── jQuery Validate: Create Food Order form ────────────────────────────
  useEffect(() => {
    if (!showModal) return;
    if (!isJQueryValidateReady()) return;

    const t = setTimeout(() => {
      destroyValidator('#createOrderForm');
      window.$('#createOrderForm').validate({
        ...defaultValidateOptions(() => submitCreateOrderRef.current()),
        rules: {
          guest_name: { required: true, minlength: 2 },
          guest_phone: { required: true, digits: true, minlength: 10, maxlength: 10 },
          order_type: { required: true }
        },
        messages: {
          guest_name: {
            required: 'Guest name is required.',
            minlength: 'Name must be at least 2 characters.'
          },
          guest_phone: {
            required: 'Phone number is required.',
            digits: 'Please enter only digits.',
            minlength: 'Phone number must be exactly 10 digits.',
            maxlength: 'Phone number must be exactly 10 digits.'
          },
          order_type: { required: 'Please select order type.' }
        }
      });
    }, 100);
    return () => {
      clearTimeout(t);
      destroyValidator('#createOrderForm');
    };
  }, [showModal]);

  const handleOpenCreateModal = () => {
    setGuestName('');
    setGuestPhone('');
    setGuestEmail('');
    setOrderType('Dining');
    setPaymentStatus('Pending');
    setOrderItems([]);
    setSelectedFoodId('');
    setItemQuantity(1);
    setShowModal(true);
  };

  const handleAddItem = () => {
    if (!selectedFoodId) {
      toast.warning("Please select a food item first.");
      return;
    }
    const food = foodItems.find(f => f.food_id === parseInt(selectedFoodId));
    if (!food) return;

    const existing = orderItems.find(item => item.food_id === food.food_id);
    if (existing) {
      setOrderItems(prev => prev.map(item => 
        item.food_id === food.food_id 
          ? { ...item, quantity: item.quantity + parseInt(itemQuantity) } 
          : item
      ));
    } else {
      setOrderItems(prev => [...prev, {
        food_id: food.food_id,
        food_name: food.food_name,
        price: parseFloat(food.price),
        quantity: parseInt(itemQuantity)
      }]);
    }
    setSelectedFoodId('');
    setItemQuantity(1);
  };

  const handleRemoveItem = (foodId) => {
    setOrderItems(prev => prev.filter(item => item.food_id !== foodId));
  };

  const calculatedTotalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (isJQueryValidateReady() && window.$('#createOrderForm').length) {
      const $form = window.$('#createOrderForm');
      if ($form.valid()) {
        submitCreateOrder();
      }
    } else {
      submitCreateOrder();
    }
  };

  const submitCreateOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Please add at least one food item to the order.");
      return;
    }

    const payload = {
      guest_name: guestName,
      guest_phone: guestPhone,
      guest_email: guestEmail || '',
      order_type: orderType,
      table_id: null,
      room_id: null,
      payment_status: paymentStatus,
      order_status: 'Pending',
      order_items: orderItems.map(item => ({
        food_id: item.food_id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    setLoading(true);
    try {
      const response = await ApiService.addFoodOrder(payload);
      if (response.data?.status === 'success') {
        toast.success("✅ Food order placed successfully!");
        fetchOrders();
        handleCloseModal();
      } else {
        toast.error(response.data?.message || "Failed to place food order.");
      }
    } catch (error) {
      console.error("Place order error:", error);
      toast.error(error.response?.data?.message || "❌ Error placing food order.");
    } finally {
      setLoading(false);
    }
  };

  submitCreateOrderRef.current = submitCreateOrder;

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);

    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm,
        order_status: statusFilter === "all" ? null : statusFilter,
        from_date: fromDate,
        to_date: toDate
      };

      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.getFoodOrderDataTable(payload);
      const data = response.data;

      if (data.status === "success") {
        setOrders(data.data || []);
        setTotalOrders(data.total_records || 0);
      } else {
        toast.error(data.message || "Failed to load orders");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(error);
      toast.error("❌ Error fetching orders");
    }

    setLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, fromDate, toDate]);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm, currentPage, entriesPerPage, fromDate, toDate]);

  // Handle view order details
  const handleViewDetails = async (order) => {
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.getFoodOrderById(order.order_id);
      const data = response.data;

      if (data.status === "success") {
        setSelectedOrder(data.data);
        setShowDetailsModal(true);
      } else {
        toast.error(data.message || "Failed to load order details");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(error);
      toast.error("❌ Error loading order details");
    }
  };

  // Handle update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.updateFoodOrderStatus(orderId, {
        order_status: newStatus
      });
      const data = response.data;

      if (data.status === "success") {
        toast.success(`✅ Order status updated to ${newStatus}!`);
        fetchOrders();
        if (showDetailsModal) {
          setShowDetailsModal(false);
        }
      } else {
        toast.error(data.message || "⚠️ Failed to update status.");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error("Status update error:", error);
      toast.error("❌ Something went wrong while updating status.");
    }
  };

  // Handle delete order
  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this order?",
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

        const response = await ApiService.deleteFoodOrder(orderId);
        const data = response.data;

        if (data.status === "success") {
          toast.success("🗑️ Order deleted successfully!");
          fetchOrders();
        } else {
          toast.error(data.message || "⚠️ Failed to delete order.");
        }
      } catch (error) {
        if (error.response?.data?.code === "token_not_valid") {
          toast.error("Session expired. Please login again.", { autoClose: 1000 });
          handleLogout();
          return;
        }
        console.error("Order delete error:", error);
        toast.error("❌ Something went wrong while deleting the order.");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalOrders / entriesPerPage);

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
    const statusConfig = {
      'Pending': { icon: faClock, class: styles.statusPending },
      'Preparing': { icon: faUtensils, class: styles.statusPreparing },
      'Served': { icon: faCheckCircle, class: styles.statusServed },
      'Completed': { icon: faCheckCircle, class: styles.statusCompleted },
      'Cancelled': { icon: faTimesCircle, class: styles.statusCancelled }
    };

    const config = statusConfig[status] || statusConfig['Pending'];

    return (
      <span className={`${styles.statusBadge} ${config.class}`}>
        <FontAwesomeIcon icon={config.icon} /> {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Group and sort food items by category
  const groupedFoodItems = foodItems.reduce((acc, item) => {
    const cat = item.category_name || 'Others';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedFoodItems).sort();
  sortedCategories.forEach(cat => {
    groupedFoodItems[cat].sort((a, b) => a.food_name.localeCompare(b.food_name));
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
          <div className={styles.titleSection}>
            <FontAwesomeIcon icon={faUtensils} className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>Food Orders Management</h2>
              <p className={styles.subtitle}>Manage restaurant orders and track order status</p>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.userBadge}>Admin</div>
          <button className={styles.primaryButton} onClick={handleOpenCreateModal}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '6px' }} />
            Create Order
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
            <span className={styles.statValue}>{totalOrders}</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconPending}`}>
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {orders.filter(o => o.order_status === 'Pending').length}
            </span>
            <span className={styles.statLabel}>Pending</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconPreparing}`}>
            <FontAwesomeIcon icon={faUtensils} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {orders.filter(o => o.order_status === 'Preparing').length}
            </span>
            <span className={styles.statLabel}>Preparing</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconCompleted}`}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {orders.filter(o => o.order_status === 'Completed').length}
            </span>
            <span className={styles.statLabel}>Completed</span>
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
              placeholder="Search by order ID, guest name..."
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
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Served">Served</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#718096' }}>From:</span>
            <input
              type="date"
              className={styles.filterSelect}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ padding: '8px 12px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#718096' }}>To:</span>
            <input
              type="date"
              className={styles.filterSelect}
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ padding: '8px 12px' }}
            />
          </div>
          {(fromDate || toDate) && (
            <button
              onClick={() => {
                setFromDate('');
                setToDate('');
              }}
              style={{
                padding: '10px 18px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.85'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading orders...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className="table table-bordered table-hover mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th className={styles.table_head}>Order ID</th>
                <th className={styles.table_head}>Guest Name</th>
                <th className={styles.table_head}>Table</th>
                <th className={styles.table_head}>Order Date</th>
                <th className={styles.table_head}>Total Amount</th>
                <th className={styles.table_head}>Status</th>
                <th className={styles.table_head}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.emptyRow}>No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id}>
                    <td className={styles.orderIdCell}>
                      <strong>#MR-{order.order_id}</strong>
                    </td>
                    <td className={styles.guestCell}>
                      <FontAwesomeIcon icon={faUser} className={styles.cellIcon} />
                      {order.guest_name || 'N/A'}
                    </td>
                    <td className={styles.tableCell}>
                      {order.table_number || 'N/A'}
                    </td>
                    <td className={styles.dateCell}>
                      <FontAwesomeIcon icon={faCalendarAlt} className={styles.cellIcon} />
                      {formatDate(order.order_date)}
                    </td>
                    <td className={styles.amountCell}>
                      <FontAwesomeIcon icon={faMoneyBillWave} className={styles.cellIcon} />
                      {formatAmount(order.total_amount)}
                    </td>
                    <td className={styles.statusCell}>
                      {getStatusBadge(order.order_status)}
                    </td>
                    <td className={styles.actionsCell}>
                      <button 
                        className={styles.viewButton} 
                        onClick={() => handleViewDetails(order)}
                        title="View Details"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button 
                        className={styles.deleteButton} 
                        onClick={() => handleDelete(order.order_id)}
                        title="Delete Order"
                      >
                        <FontAwesomeIcon icon={faTrash} />
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
              Showing {(orders.length > 0) ? ((currentPage - 1) * entriesPerPage + 1) : 0} to{" "}
              {Math.min(currentPage * entriesPerPage, totalOrders)} of {totalOrders} entries
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

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FontAwesomeIcon icon={faUtensils} /> Order Details #MR-{selectedOrder.order_id}
              </h3>
              <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>
            <div className={styles.modalBody}>
              {/* Order Info */}
              <div className={styles.orderInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Guest Name:</span>
                  <span className={styles.infoValue}>{selectedOrder.guest_name || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Table Number:</span>
                  <span className={styles.infoValue}>{selectedOrder.table_number || 'N/A'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Order Date:</span>
                  <span className={styles.infoValue}>{formatDate(selectedOrder.order_date)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Current Status:</span>
                  <span className={styles.infoValue}>{getStatusBadge(selectedOrder.order_status)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className={styles.orderItems}>
                <h4>Order Items</h4>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <table className={styles.itemsTable}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.food_name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatAmount(item.price)}</td>
                          <td>{formatAmount(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className={styles.noItems}>No items in this order</p>
                )}
              </div>

              {/* Total */}
              <div className={styles.orderTotal}>
                <span className={styles.totalLabel}>Total Amount:</span>
                <span className={styles.totalValue}>{formatAmount(selectedOrder.total_amount)}</span>
              </div>

              {/* Status Update */}
              <div className={styles.statusUpdate}>
                <h4>Update Order Status</h4>
                <div className={styles.statusButtons}>
                  {['Pending', 'Preparing', 'Served', 'Completed', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      className={`${styles.statusBtn} ${selectedOrder.order_status === status ? styles.statusBtnActive : ''}`}
                      onClick={() => handleUpdateStatus(selectedOrder.order_id, status)}
                      disabled={selectedOrder.order_status === status}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FontAwesomeIcon icon={faPlus} /> Book Offline Food Order
              </h3>
              <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>
            <form id="createOrderForm" onSubmit={handleSubmit} className={styles.modalBody} noValidate>
              
              {/* Guest Details */}
              <h4 style={{ margin: '0 0 16px 0', borderBottom: '2px solid #39ab49', paddingBottom: '6px', display: 'inline-block' }}>Guest & Order Info</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Guest Name *</label>
                  <input
                    id="guestNameInput"
                    name="guest_name"
                    type="text"
                    className={styles.formInput}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="e.g., Ramesh Kumar"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number *</label>
                  <input
                    id="guestPhoneInput"
                    name="guest_phone"
                    type="text"
                    className={styles.formInput}
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    placeholder="e.g., 9876543210"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input
                    id="guestEmailInput"
                    name="guest_email"
                    type="email"
                    className={styles.formInput}
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="e.g., ramesh@example.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Order Type *</label>
                  <select
                    id="orderTypeSelect"
                    name="order_type"
                    className={styles.formSelect}
                    value={orderType}
                    onChange={(e) => {
                      setOrderType(e.target.value);
                    }}
                    required
                  >
                    <option value="Dining">Dining</option>
                    <option value="Room Service">Room Service</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Payment Status *</label>
                  <select
                    className={styles.formSelect}
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    {orderType === 'Room Service' && <option value="Charged to Room">Charged to Room</option>}
                  </select>
                </div>
              </div>

              {/* Add Food Items */}
              <h4 style={{ margin: '24px 0 12px 0', borderBottom: '2px solid #39ab49', paddingBottom: '6px', display: 'inline-block' }}>Order Items</h4>
              
              <div className={styles.addItemRow}>
                <div className={styles.formGroup} style={{ marginBottom: 0, flex: 1 }}>
                  <label className={styles.formLabel}>Select Food Item</label>
                  <select
                    className={styles.formSelect}
                    value={selectedFoodId}
                    onChange={(e) => setSelectedFoodId(e.target.value)}
                  >
                    <option value="">-- Choose Food Item --</option>
                    {sortedCategories.map(cat => (
                      <optgroup key={cat} label={cat}>
                        {groupedFoodItems[cat].map(item => (
                          <option key={item.food_id} value={item.food_id}>
                            {item.food_name} (₹{parseFloat(item.price).toFixed(2)})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup} style={{ marginBottom: 0, width: '100px' }}>
                  <label className={styles.formLabel}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className={styles.formInput}
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <button type="button" className={styles.addItemBtn} onClick={handleAddItem}>
                  <FontAwesomeIcon icon={faPlus} /> Add
                </button>
              </div>

              {/* Order Items List */}
              <div className={styles.orderItems}>
                {orderItems.length > 0 ? (
                  <table className={styles.itemsTable}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, index) => (
                        <tr key={index}>
                          <td style={{ fontWeight: '600', color: '#2d3748' }}>{item.food_name}</td>
                          <td>₹{item.price.toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              className={styles.removeBtn}
                              onClick={() => handleRemoveItem(item.food_id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className={styles.noItems}>No food items added to order yet.</p>
                )}
              </div>

              {/* Order Total Display */}
              <div className={styles.orderTotal}>
                <span className={styles.totalLabel}>Total Amount:</span>
                <span className={styles.totalValue}>₹{calculatedTotalAmount.toFixed(2)}</span>
              </div>

              {/* Modal Actions */}
              <div className={styles.modalFooter} style={{ padding: '20px 0 0 0', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Foodorders;
