import React, { useState, useEffect } from 'react';
import styles from './RoomPayment.module.css';
import ApiService from '../../../service/Apiservice.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STATUS_COLORS = {
  confirmed: '#28a745',
  cancelled: '#dc3545',
  pending: '#ffc107',
  completed: '#28a745',
  failed: '#dc3545',
  refunded: '#6c757d',
};

const PAYMENT_STATUS_OPTIONS = ['pending', 'completed', 'failed', 'refunded'];
const BOOKING_STATUS_OPTIONS = ['confirmed', 'cancelled'];

// ── Tab: Bookings ─────────────────────────────────────────────────────────────
const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const totalPages = Math.ceil(totalRecords / entriesPerPage);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await ApiService.getBookingDataTable({
        page: currentPage,
        length: entriesPerPage,
        search,
      });
      if (res.data.status === 'success') {
        setBookings(res.data.data);
        setTotalRecords(res.data.total_records);
      }
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [currentPage, entriesPerPage, search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await ApiService.updateBookingStatus(id, { status: newStatus });
      if (res.data.status === 'success') {
        toast.success('Booking status updated');
        fetchBookings();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await ApiService.getBookingDetail(id);
      if (res.data.status === 'success') {
        setSelectedBooking(res.data.data);
        setShowDetail(true);
      }
    } catch {
      toast.error('Failed to load booking details');
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 10;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div>
      {/* Search */}
      <div className={styles.actions}>
        <input
          type="text"
          placeholder="Search by customer, room, status..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {loading ? (
        <div className={styles.loadingText}>Loading bookings...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className="table table-bordered table-hover mb-0">
            <thead>
              <tr>
                <th className={styles.table_head}>S.No</th>
                <th className={styles.table_head}>Customer</th>
                <th className={styles.table_head}>Room</th>
                <th className={styles.table_head}>Room Type</th>
                <th className={styles.table_head}>Check-In</th>
                <th className={styles.table_head}>Check-Out</th>
                <th className={styles.table_head}>Nights</th>
                <th className={styles.table_head}>Total (₹)</th>
                <th className={styles.table_head}>Status</th>
                <th className={styles.table_head}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan="10" className={styles.emptyRow}>No bookings found.</td></tr>
              ) : (
                bookings.map((b, idx) => (
                  <tr key={b.id}>
                    <td>{(currentPage - 1) * entriesPerPage + idx + 1}</td>
                    <td>
                      <strong>{b.customer_name}</strong>
                      <div className={styles.subText}>{b.customer_email}</div>
                    </td>
                    <td>{b.room_number}</td>
                    <td>{b.room_type_name}</td>
                    <td>{b.check_in}</td>
                    <td>{b.check_out}</td>
                    <td>{b.nights}</td>
                    <td>₹{Number(b.total_price).toLocaleString()}</td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ background: STATUS_COLORS[b.status] + '22', color: STATUS_COLORS[b.status] }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button className={styles.viewButton} onClick={() => openDetail(b.id)}>View</button>
                      <select
                        className={styles.statusSelect}
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      >
                        {BOOKING_STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.tableFooter}>
            <div className={styles.pageInfo}>
              Showing {bookings.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} entries
            </div>
            <div className={styles.pagination}>
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={styles.pageButton}>Prev</button>
              {getPageNumbers().map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`${styles.pageButton} ${currentPage === p ? styles.pageButtonActive : ''}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className={styles.pageButton}>Next</button>
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
      {showDetail && selectedBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Booking #{selectedBooking.id} Details</h3>
              <button className={styles.closeButton} onClick={() => setShowDetail(false)}>×</button>
            </div>
            <div className={styles.detailGrid}>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Customer</span><span>{selectedBooking.customer_name}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Email</span><span>{selectedBooking.customer_email}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Phone</span><span>{selectedBooking.customer_phone}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Room Number</span><span>{selectedBooking.room_number}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Room Type</span><span>{selectedBooking.room_type_name}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Check-In</span><span>{selectedBooking.check_in}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Check-Out</span><span>{selectedBooking.check_out}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Nights</span><span>{selectedBooking.nights}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Total Price</span><span>₹{Number(selectedBooking.total_price).toLocaleString()}</span></div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.statusBadge} style={{ background: STATUS_COLORS[selectedBooking.status] + '22', color: STATUS_COLORS[selectedBooking.status] }}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Tab: Payments ─────────────────────────────────────────────────────────────
const PaymentsTab = () => {
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
      const res = await ApiService.getPaymentDataTable({
        page: currentPage,
        length: entriesPerPage,
        search,
      });
      if (res.data.status === 'success') {
        setPayments(res.data.data);
        setTotalRecords(res.data.total_records);
      }
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [currentPage, entriesPerPage, search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await ApiService.updatePaymentStatus(id, { payment_status: newStatus });
      if (res.data.status === 'success') {
        toast.success('Payment status updated');
        fetchPayments();
      }
    } catch {
      toast.error('Failed to update payment status');
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await ApiService.getPaymentDetail(id);
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
    const max = 10;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div>
      <div className={styles.actions}>
        <input
          type="text"
          placeholder="Search by customer, method, status, transaction ID..."
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
                <th className={styles.table_head}>S.No</th>
                <th className={styles.table_head}>Booking #</th>
                <th className={styles.table_head}>Customer</th>
                <th className={styles.table_head}>Room</th>
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
                <tr><td colSpan="10" className={styles.emptyRow}>No payments found.</td></tr>
              ) : (
                payments.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{(currentPage - 1) * entriesPerPage + idx + 1}</td>
                    <td>#{p.booking_id}</td>
                    <td>
                      <strong>{p.customer_name}</strong>
                      <div className={styles.subText}>{p.customer_email}</div>
                    </td>
                    <td>{p.room_number}</td>
                    <td>₹{Number(p.amount).toLocaleString()}</td>
                    <td className={styles.capitalize}>{p.payment_method}</td>
                    <td><code className={styles.txnId}>{p.transaction_id || '—'}</code></td>
                    <td>{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : '—'}</td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ background: STATUS_COLORS[p.payment_status] + '22', color: STATUS_COLORS[p.payment_status] }}
                      >
                        {p.payment_status}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button className={styles.viewButton} onClick={() => openDetail(p.id)}>View</button>
                      <select
                        className={styles.statusSelect}
                        value={p.payment_status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                      >
                        {PAYMENT_STATUS_OPTIONS.map(s => (
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
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className={styles.pageButton}>Next</button>
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
            <div className={styles.detailGrid}>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Booking #</span><span>#{selectedPayment.booking_id}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Customer</span><span>{selectedPayment.customer_name}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Email</span><span>{selectedPayment.customer_email}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Room Number</span><span>{selectedPayment.room_number}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Amount</span><span>₹{Number(selectedPayment.amount).toLocaleString()}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Method</span><span className={styles.capitalize}>{selectedPayment.payment_method}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Transaction ID</span><span>{selectedPayment.transaction_id || '—'}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Razorpay Order ID</span><span>{selectedPayment.razorpay_order_id || '—'}</span></div>
              <div className={styles.detailRow}><span className={styles.detailLabel}>Razorpay Payment ID</span><span>{selectedPayment.razorpay_payment_id || '—'}</span></div>
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
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const RoomPayment = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Room Payment Management</h2>
          <p className={styles.subtitle}>View and manage all room bookings and payments</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'bookings' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          🛏 Bookings
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'payments' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          💳 Payments
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'bookings' ? <BookingsTab /> : <PaymentsTab />}
      </div>
    </div>
  );
};

export default RoomPayment;
