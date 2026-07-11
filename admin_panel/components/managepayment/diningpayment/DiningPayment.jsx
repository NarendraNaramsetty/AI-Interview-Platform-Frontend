import React, { useState, useEffect } from 'react';
import styles from './DiningPayment.module.css';
import ApiService from '../../../service/Apiservice.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STATUS_COLORS = {
  // Order Status
  Pending: '#ffc107',
  Preparing: '#17a2b8',
  Served: '#6f42c1',
  Completed: '#28a745',
  Cancelled: '#dc3545',

  // Payment Status
  pending: '#ffc107',
  completed: '#28a745',
  failed: '#dc3545',
  refunded: '#6c757d',
  
  // Food Order Payment Status
  Paid: '#28a745',
  'Charged to Room': '#007bff',
};

const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Net Banking' }
];

const DINING_PAYMENT_STATUS_OPTIONS = ['pending', 'completed', 'failed', 'refunded'];

// ── Tab: Food Orders ──────────────────────────────────────────────────────────
const OrdersTab = ({ onPaymentRecorded }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  
  // Record Payment Form State
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('completed');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const totalPages = Math.ceil(totalRecords / entriesPerPage);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ApiService.getFoodOrderDataTable({
        page: currentPage,
        length: entriesPerPage,
        search,
      });
      if (res.data.status === 'success') {
        setOrders(res.data.data);
        setTotalRecords(res.data.total_records);
      }
    } catch (err) {
      toast.error('Failed to load food orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, entriesPerPage, search]);

  const openDetail = async (id) => {
    try {
      const res = await ApiService.getFoodOrderById(id);
      if (res.data.status === 'success') {
        setSelectedOrder(res.data.data);
        setShowDetail(true);
      }
    } catch {
      toast.error('Failed to load order details');
    }
  };

  const handleOpenRecordPayment = (order) => {
    setSelectedOrder(order);
    setPaymentMethod('cash');
    setPaymentStatus('completed');
    setTransactionId('');
    setNotes('');
    setShowRecordPayment(true);
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    setSubmittingPayment(true);
    try {
      const res = await ApiService.createDiningPayment({
        food_order: selectedOrder.order_id,
        amount: selectedOrder.total_amount,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        transaction_id: transactionId,
        notes: notes
      });
      if (res.data.status === 'success') {
        toast.success('Dining payment recorded successfully!');
        setShowRecordPayment(false);
        fetchOrders();
        if (onPaymentRecorded) onPaymentRecorded();
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to record payment';
      toast.error(errMsg);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) {
      if (i > 0) pages.push(i);
    }
    return pages;
  };

  return (
    <div>
      {/* Actions / Search */}
      <div className={styles.actions}>
        <input
          type="text"
          placeholder="Search by order ID, guest name, table, room..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {loading ? (
        <div className={styles.loadingText}>Loading food orders...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className="table table-bordered table-hover mb-0">
            <thead>
              <tr>
                <th className={styles.table_head}>Order ID</th>
                <th className={styles.table_head}>Guest</th>
                <th className={styles.table_head}>Type</th>
                <th className={styles.table_head}>Table / Room</th>
                <th className={styles.table_head}>Total (₹)</th>
                <th className={styles.table_head}>Order Date</th>
                <th className={styles.table_head}>Order Status</th>
                <th className={styles.table_head}>Payment</th>
                <th className={styles.table_head}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="9" className={styles.emptyRow}>No food orders found.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.order_id}>
                    <td><strong>#{o.order_id}</strong></td>
                    <td>
                      <strong>{o.guest_name || 'Walk-in Guest'}</strong>
                      {o.guest_phone && <div className={styles.subText}>{o.guest_phone}</div>}
                    </td>
                    <td>{o.order_type}</td>
                    <td>
                      {o.order_type === 'Dining' 
                        ? (o.table_number ? `Table ${o.table_number}` : 'Dining Table')
                        : (o.room_number ? `Room ${o.room_number}` : 'Room Service')
                      }
                    </td>
                    <td>₹{Number(o.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{new Date(o.order_date).toLocaleString()}</td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ background: (STATUS_COLORS[o.order_status] || '#6c757d') + '22', color: STATUS_COLORS[o.order_status] || '#6c757d' }}
                      >
                        {o.order_status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ background: (STATUS_COLORS[o.payment_status] || '#ffc107') + '22', color: STATUS_COLORS[o.payment_status] || '#ffc107' }}
                      >
                        {o.payment_status}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button className={styles.viewButton} onClick={() => openDetail(o.order_id)}>View Items</button>
                      {o.payment_status === 'Pending' && o.order_status !== 'Cancelled' && (
                        <button className={styles.payButton} onClick={() => handleOpenRecordPayment(o)}>Record Pay</button>
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
              Showing {orders.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} entries
            </div>
            <div className={styles.pagination}>
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={styles.pageButton}>Prev</button>
              {getPageNumbers().map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`${styles.pageButton} ${currentPage === p ? styles.pageButtonActive : ''}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0} className={styles.pageButton}>Next</button>
            </div>
            <div className={styles.entriesControl}>
              <label>Show</label>
              <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className={styles.entriesSelect}>
                {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>entries</span>
            </div>
          </div>
        </div>
      )}

      {/* Order Items Modal */}
      {showDetail && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Order #{selectedOrder.order_id} Items</h3>
              <button className={styles.closeButton} onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailRow}><span className={styles.detailLabel}>Guest Name</span><span>{selectedOrder.guest_name || 'Walk-in Guest'}</span></div>
                <div className={styles.detailRow}><span className={styles.detailLabel}>Phone Number</span><span>{selectedOrder.guest_phone || '—'}</span></div>
                <div className={styles.detailRow}><span className={styles.detailLabel}>Service Type</span><span>{selectedOrder.order_type}</span></div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Location</span>
                  <span>{selectedOrder.order_type === 'Dining' ? `Table ${selectedOrder.table_number || '—'}` : `Room ${selectedOrder.room_number || '—'}`}</span>
                </div>
                <div className={styles.detailRow}><span className={styles.detailLabel}>Order Date</span><span>{new Date(selectedOrder.order_date).toLocaleString()}</span></div>
                <div className={styles.detailRow}><span className={styles.detailLabel}>Total Amount</span><strong>₹{Number(selectedOrder.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>
              </div>

              <h4 className={styles.sectionHeading}>Items Ordered</h4>
              <div className={styles.itemsTableWrapper}>
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Food Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.order_details?.map((item) => (
                      <tr key={item.order_detail_id}>
                        <td>{item.food_name}</td>
                        <td>{item.quantity}</td>
                        <td>₹{Number(item.price).toLocaleString()}</td>
                        <td>₹{Number(item.amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showRecordPayment && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Record Payment for Order #{selectedOrder.order_id}</h3>
              <button className={styles.closeButton} onClick={() => setShowRecordPayment(false)}>×</button>
            </div>
            <form onSubmit={handleRecordPaymentSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.amountBanner}>
                  <span className={styles.bannerLabel}>Total Amount Due:</span>
                  <span className={styles.bannerAmount}>₹{Number(selectedOrder.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Payment Method</label>
                  <select 
                    className={styles.formSelect} 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {PAYMENT_METHOD_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Payment Status</label>
                  <select 
                    className={styles.formSelect} 
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Transaction ID / Reference (Optional)</label>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    placeholder="Enter bank txn ref ID, UPI ref etc."
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Notes (Optional)</label>
                  <textarea 
                    className={styles.formTextarea} 
                    placeholder="Add payment notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelButton} onClick={() => setShowRecordPayment(false)}>Cancel</button>
                <button type="submit" className={styles.submitButton} disabled={submittingPayment}>
                  {submittingPayment ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Tab: Dining Payments ──────────────────────────────────────────────────────
const PaymentsTab = ({ refreshKey }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const totalPages = Math.ceil(totalRecords / entriesPerPage);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await ApiService.getDiningPaymentDataTable({
        page: currentPage,
        length: entriesPerPage,
        search,
      });
      if (res.data.status === 'success') {
        setPayments(res.data.data);
        setTotalRecords(res.data.total_records);
      }
    } catch {
      toast.error('Failed to load dining payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, entriesPerPage, search, refreshKey]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await ApiService.updateDiningPaymentStatus(id, { payment_status: newStatus });
      if (res.data.status === 'success') {
        toast.success('Payment status updated');
        fetchPayments();
      }
    } catch (err) {
      toast.error('Failed to update payment status');
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await ApiService.getDiningPaymentDetail(id);
      if (res.data.status === 'success') {
        setSelectedPayment(res.data.data);
        setShowDetail(true);
      }
    } catch {
      toast.error('Failed to load payment details');
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) {
      if (i > 0) pages.push(i);
    }
    return pages;
  };

  return (
    <div>
      <div className={styles.actions}>
        <input
          type="text"
          placeholder="Search by customer, method, status, order ID, txn ID..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {loading ? (
        <div className={styles.loadingText}>Loading payments...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className="table table-bordered table-hover mb-0">
            <thead>
              <tr>
                <th className={styles.table_head}>Payment ID</th>
                <th className={styles.table_head}>Order ID</th>
                <th className={styles.table_head}>Guest</th>
                <th className={styles.table_head}>Location</th>
                <th className={styles.table_head}>Amount (₹)</th>
                <th className={styles.table_head}>Method</th>
                <th className={styles.table_head}>Transaction ID</th>
                <th className={styles.table_head}>Payment Date</th>
                <th className={styles.table_head}>Status</th>
                <th className={styles.table_head}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="10" className={styles.emptyRow}>No dining payments found.</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td>#P-{p.id}</td>
                    <td><strong>#Order-{p.food_order_id}</strong></td>
                    <td>
                      <strong>{p.guest_name || 'Walk-in Guest'}</strong>
                      {p.guest_phone && <div className={styles.subText}>{p.guest_phone}</div>}
                    </td>
                    <td>
                      {p.order_type === 'Dining'
                        ? (p.table_number ? `Table ${p.table_number}` : 'Dining')
                        : (p.room_number ? `Room ${p.room_number}` : 'Room Service')
                      }
                    </td>
                    <td>₹{Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={styles.capitalize}>{p.payment_method}</td>
                    <td><code className={styles.txnId}>{p.transaction_id || '—'}</code></td>
                    <td>{p.payment_date ? new Date(p.payment_date).toLocaleString() : '—'}</td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ background: STATUS_COLORS[p.payment_status] + '22', color: STATUS_COLORS[p.payment_status] }}
                      >
                        {p.payment_status}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button className={styles.viewButton} onClick={() => openDetail(p.id)}>View Details</button>
                      <select
                        className={styles.statusSelect}
                        value={p.payment_status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                      >
                        {DINING_PAYMENT_STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className={styles.tableFooter}>
            <div className={styles.pageInfo}>
              Showing {payments.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} entries
            </div>
            <div className={styles.pagination}>
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={styles.pageButton}>Prev</button>
              {getPageNumbers().map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`${styles.pageButton} ${currentPage === p ? styles.pageButtonActive : ''}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0} className={styles.pageButton}>Next</button>
            </div>
            <div className={styles.entriesControl}>
              <label>Show</label>
              <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className={styles.entriesSelect}>
                {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>entries</span>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedPayment && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Payment #{selectedPayment.id} Details</h3>
              <button className={styles.closeButton} onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailRow}><span className={styles.detailLabel}>Order ID</span><span>#Order-{selectedPayment.food_order_id}</span></div>
                <div className={styles.detailRow}><span className={styles.detailLabel}>Guest Name</span><span>{selectedPayment.guest_name || 'Walk-in Guest'}</span></div>
                {selectedPayment.guest_email && (
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Email</span><span>{selectedPayment.guest_email}</span></div>
                )}
                {selectedPayment.guest_phone && (
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Phone</span><span>{selectedPayment.guest_phone}</span></div>
                )}
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Location</span>
                  <span>{selectedPayment.order_type === 'Dining' ? `Table ${selectedPayment.table_number || '—'}` : `Room ${selectedPayment.room_number || '—'}`}</span>
                </div>
                <div className={styles.detailRow}><span className={styles.detailLabel}>Amount Paid</span><strong>₹{Number(selectedPayment.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>
                <div className={styles.detailRow}><span className={styles.detailLabel}>Payment Method</span><span className={styles.capitalize}>{selectedPayment.payment_method}</span></div>
                <div className={styles.detailRow}><span className={styles.detailLabel}>Transaction ID</span><span>{selectedPayment.transaction_id || '—'}</span></div>
                {selectedPayment.razorpay_order_id && (
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Razorpay Order ID</span><span>{selectedPayment.razorpay_order_id}</span></div>
                )}
                {selectedPayment.razorpay_payment_id && (
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Razorpay Payment ID</span><span>{selectedPayment.razorpay_payment_id}</span></div>
                )}
                <div className={styles.detailRow}><span className={styles.detailLabel}>Payment Date</span><span>{selectedPayment.payment_date ? new Date(selectedPayment.payment_date).toLocaleString() : '—'}</span></div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={styles.statusBadge} style={{ background: STATUS_COLORS[selectedPayment.payment_status] + '22', color: STATUS_COLORS[selectedPayment.payment_status] }}>
                    {selectedPayment.payment_status}
                  </span>
                </div>
                {selectedPayment.notes && (
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Notes</span><span>{selectedPayment.notes}</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Dining Payment Component ─────────────────────────────────────────────
const DiningPayment = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [paymentsRefreshKey, setPaymentsRefreshKey] = useState(0);

  const handlePaymentRecorded = () => {
    // Increment refresh key to trigger payments list reload when activeTab switches
    setPaymentsRefreshKey(prev => prev + 1);
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Dining Payment Management</h2>
          <p className={styles.subtitle}>View food orders, record cash/digital payments, and audit dining transactions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          🍔 Food Orders
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'payments' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          💳 Dining Payments
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'orders' ? (
          <OrdersTab onPaymentRecorded={handlePaymentRecorded} />
        ) : (
          <PaymentsTab refreshKey={paymentsRefreshKey} />
        )}
      </div>
    </div>
  );
};

export default DiningPayment;
