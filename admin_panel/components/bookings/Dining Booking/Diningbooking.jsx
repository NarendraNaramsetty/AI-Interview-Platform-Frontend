import React, { useState, useEffect } from 'react';
import styles from './Diningbooking.module.css';
import ApiService from '../../../service/Apiservice.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPermissions } from '../../../utils/permissionHelper.js';

const STATUS_COLORS = {
  Pending: '#ffc107',
  Confirmed: '#28a745',
  Cancelled: '#dc3545',
  // legacy order status
  Preparing: '#17a2b8',
  Served: '#6f42c1',
  Completed: '#28a745',
  Paid: '#28a745',
  'Charged to Room': '#007bff',
};

const DINING_STATUS_OPTIONS = ['Pending', 'Confirmed', 'Cancelled'];

// Utility to normalize status for display
const normalizeStatus = (s) => {
  if (!s) return 'Pending';
  const lower = s.toLowerCase();
  if (lower === 'confirmed' || lower === 'completed' || lower === 'served') return 'Confirmed';
  if (lower === 'cancelled') return 'Cancelled';
  return 'Pending';
};

// ── Create / Edit Modal ───────────────────────────────────────────────────────
const BookingFormModal = ({ booking, onClose, onSaved }) => {
  const isEdit = !!booking;
  const [form, setForm] = useState(
    isEdit
      ? {
        guest_name: booking.guest_name || '',
        guest_phone: booking.guest_phone || '',
        order_type: booking.order_type || 'Dining',
        table_number: booking.table_number || '',
        room_number: booking.room_number || '',
        order_status: normalizeStatus(booking.order_status),
        total_amount: booking.total_amount || '',
      }
      : {
        guest_name: '',
        guest_phone: '',
        order_type: 'Dining',
        table_number: '',
        room_number: '',
        order_status: 'Pending',
        total_amount: '',
      }
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.guest_name) {
      toast.error('Guest name is required');
      return;
    }
    setSaving(true);
    try {
      // Map our simplified status back to FoodOrder status values
      const statusMap = {
        Pending: 'Pending',
        Confirmed: 'Completed',
        Cancelled: 'Cancelled',
      };
      const payload = {
        ...form,
        order_status: statusMap[form.order_status] || 'Pending',
        total_amount: form.total_amount || 0,
      };

      let res;
      if (isEdit) {
        res = await ApiService.updateFoodOrder(booking.order_id, payload);
      } else {
        res = await ApiService.addFoodOrder(payload);
      }
      if (res.data.status === 'success') {
        toast.success(isEdit ? 'Dining booking updated!' : 'Dining booking created!');
        onSaved();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save dining booking');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{isEdit ? 'Edit Dining Booking' : 'New Dining Booking'}</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Guest Name *</label>
                <input type="text" className={styles.formInput} name="guest_name" value={form.guest_name}
                  onChange={handleChange} placeholder="Enter guest name" required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Guest Phone</label>
                <input type="text" className={styles.formInput} name="guest_phone" value={form.guest_phone}
                  onChange={handleChange} placeholder="10-digit number" />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Order Type</label>
                <select className={styles.formSelect} name="order_type" value={form.order_type} onChange={handleChange}>
                  <option value="Dining">Dining (Table)</option>
                  <option value="Room Service">Room Service</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                {form.order_type === 'Dining' ? (
                  <>
                    <label className={styles.formLabel}>Table Number</label>
                    <input type="text" className={styles.formInput} name="table_number" value={form.table_number}
                      onChange={handleChange} placeholder="e.g. 5" />
                  </>
                ) : (
                  <>
                    <label className={styles.formLabel}>Room Number</label>
                    <input type="text" className={styles.formInput} name="room_number" value={form.room_number}
                      onChange={handleChange} placeholder="e.g. 101" />
                  </>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Booking Status</label>
                <select className={styles.formSelect} name="order_status" value={form.order_status} onChange={handleChange}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Total Amount (₹)</label>
                <input type="number" className={styles.formInput} name="total_amount" value={form.total_amount}
                  onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update Booking' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ order, onClose }) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>Dining Booking #{order.order_id} Details</h3>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      <div className={styles.detailGrid}>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Booking ID</span><span>#{order.order_id}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Guest Name</span><span>{order.guest_name || 'Walk-in Guest'}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Phone</span><span>{order.guest_phone || '—'}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Service Type</span><span>{order.order_type}</span></div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Location</span>
          <span>{order.order_type === 'Dining'
            ? (order.table_number ? `Table ${order.table_number}` : 'Dining')
            : (order.room_number ? `Room ${order.room_number}` : 'Room Service')
          }</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Status</span>
          <span className={styles.statusBadge}
            style={{
              background: (STATUS_COLORS[normalizeStatus(order.order_status)] || '#6c757d') + '22',
              color: STATUS_COLORS[normalizeStatus(order.order_status)] || '#6c757d'
            }}>
            {normalizeStatus(order.order_status)}
          </span>
        </div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Total Amount</span><strong>₹{Number(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Order Date</span><span>{order.order_date ? new Date(order.order_date).toLocaleString() : '—'}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Payment Status</span><span>{order.payment_status || '—'}</span></div>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const DiningBooking = () => {
  const permissions = getPermissions('/bookings/diningbooking');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.ceil(totalRecords / entriesPerPage);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ApiService.getFoodOrderDataTable({
        page: currentPage,
        length: entriesPerPage,
        search,
        from_date: fromDate,
        to_date: toDate,
        order_status: statusFilter
      });
      if (res.data.status === 'success') {
        setOrders(res.data.data);
        setTotalRecords(res.data.total_records);
      }
    } catch {
      toast.error('Failed to load dining bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [currentPage, entriesPerPage, search, fromDate, toDate, statusFilter]);

  const openCreate = () => { setEditOrder(null); setShowForm(true); };
  const openEdit = async (id) => {
    try {
      const res = await ApiService.getFoodOrderById(id);
      if (res.data.status === 'success') { setEditOrder(res.data.data); setShowForm(true); }
    } catch { toast.error('Failed to load booking'); }
  };
  const openDetail = async (id) => {
    try {
      const res = await ApiService.getFoodOrderById(id);
      if (res.data.status === 'success') setDetailOrder(res.data.data);
    } catch { toast.error('Failed to load details'); }
  };

  const handleStatusChange = async (id, newStatus) => {
    const statusMap = { Pending: 'Pending', Confirmed: 'Completed', Cancelled: 'Cancelled' };
    try {
      const res = await ApiService.updateFoodOrderStatus(id, { order_status: statusMap[newStatus] || newStatus });
      if (res.data.status === 'success') { toast.success('Status updated'); fetchOrders(); }
    } catch { toast.error('Failed to update status'); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await ApiService.deleteFoodOrder(deleteTarget.order_id);
      if (res.data.status === 'success') {
        toast.success('Dining booking deleted');
        setDeleteTarget(null);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) if (i > 0) pages.push(i);
    return pages;
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Dining Booking Management</h2>
          <p className={styles.subtitle}>View, create, edit, and manage dining reservations and room service orders</p>
        </div>
        {permissions.add && (
          <button className={styles.createButton} onClick={openCreate}>＋ New Dining Booking</button>
        )}
      </div>

      {/* Table */}
      <div className={styles.tabContent}>
        <div className={styles.actions} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search by guest name, table, room..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            style={{ flex: '1', minWidth: '240px' }}
          />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6c757d' }}>From:</label>
            <input
              type="date"
              className={styles.searchInput}
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
              style={{ minWidth: '130px', padding: '0.5rem 0.8rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6c757d' }}>To:</label>
            <input
              type="date"
              className={styles.searchInput}
              value={toDate}
              min={fromDate}
              onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }}
              style={{ minWidth: '130px', padding: '0.5rem 0.8rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6c757d' }}>Status:</label>
            <select
              className={styles.searchInput}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              style={{ minWidth: '120px', padding: '0.5rem 0.8rem' }}
            >
              <option value="">All status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          {(search || fromDate || toDate || statusFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setFromDate('');
                setToDate('');
                setStatusFilter('');
                setCurrentPage(1);
              }}
              style={{
                padding: '0.55rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingText}>Loading dining bookings...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className="table table-bordered table-hover mb-0">
              <thead>
                <tr>
                  <th className={styles.table_head}>#</th>
                  <th className={styles.table_head}>Guest</th>
                  <th className={styles.table_head}>Type</th>
                  <th className={styles.table_head}>Table / Room</th>
                  <th className={styles.table_head}>Total (₹)</th>
                  <th className={styles.table_head}>Order Date</th>
                  <th className={styles.table_head}>Status</th>
                  <th className={styles.table_head}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="8" className={styles.emptyRow}>No dining bookings found.</td></tr>
                ) : (
                  orders.map((o) => {
                    const displayStatus = normalizeStatus(o.order_status);
                    return (
                      <tr key={o.order_id}>
                        <td><strong>#{o.order_id}</strong></td>
                        <td>
                          <strong>{o.guest_name || 'Walk-in Guest'}</strong>
                          {o.guest_phone && <div className={styles.subText}>{o.guest_phone}</div>}
                        </td>
                        <td>{o.order_type}</td>
                        <td>
                          {o.order_type === 'Dining'
                            ? (o.table_number ? `Table ${o.table_number}` : '—')
                            : (o.room_number ? `Room ${o.room_number}` : '—')
                          }
                        </td>
                        <td>₹{Number(o.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>{o.order_date ? new Date(o.order_date).toLocaleDateString() : '—'}</td>
                        <td>
                          <span
                            className={styles.statusBadge}
                            style={{ background: (STATUS_COLORS[displayStatus] || '#6c757d') + '22', color: STATUS_COLORS[displayStatus] || '#6c757d' }}
                          >
                            {displayStatus}
                          </span>
                        </td>
                        <td className={styles.actionsCell}>
                          <button className={styles.viewButton} onClick={() => openDetail(o.order_id)}>View</button>
                          {permissions.edit && (
                            <>
                              <button className={styles.editButton} onClick={() => openEdit(o.order_id)}>Edit</button>
                              <select
                                className={styles.statusSelect}
                                value={displayStatus}
                                onChange={(e) => handleStatusChange(o.order_id, e.target.value)}
                              >
                                {DINING_STATUS_OPTIONS.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </>
                          )}
                          {permissions.delete && (
                            <button className={styles.deleteButton} onClick={() => setDeleteTarget(o)}>Delete</button>
                          )}
                        </td>
                      </tr>
                    );
                  })
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
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <BookingFormModal
          booking={editOrder}
          onClose={() => setShowForm(false)}
          onSaved={fetchOrders}
        />
      )}

      {/* Detail Modal */}
      {detailOrder && (
        <DetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: 420 }}>
            <div className={styles.modalHeader} style={{ background: 'linear-gradient(135deg,#dc3545,#b02a37)' }}>
              <h3 className={styles.modalTitle}>Confirm Delete</h3>
              <button className={styles.closeButton} onClick={() => setDeleteTarget(null)}>×</button>
            </div>
            <div className={styles.modalBody} style={{ textAlign: 'center', padding: '1.5rem' }}>
              <p>Delete <strong>Dining Booking #{deleteTarget.order_id}</strong> for <strong>{deleteTarget.guest_name || 'Walk-in Guest'}</strong>?</p>
              <p style={{ color: '#dc3545', fontSize: '0.9rem' }}>This action cannot be undone.</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className={styles.deleteConfirmButton} onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiningBooking;
