import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Roombooking.module.css';
import ApiService from '../../../service/Apiservice.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getPermissions } from '../../../utils/permissionHelper.js';

const STATUS_COLORS = {
  pending: '#ffc107',
  confirmed: '#28a745',
  cancelled: '#dc3545',
};

const BOOKING_STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled'];

const EMPTY_FORM = {
  customer_id: '',
  room_unit_id: '',
  check_in: '',
  check_out: '',
  status: 'pending',
  total_price: '',
};

// ── Create / Edit Modal ───────────────────────────────────────────────────────
const BookingFormModal = ({ booking, customers, roomUnits, onClose, onSaved }) => {
  const isEdit = !!booking;
  const [form, setForm] = useState(
    isEdit
      ? {
        customer_id: booking.customer ?? '',
        room_unit_id: booking.room_unit ?? '',
        check_in: booking.check_in ?? '',
        check_out: booking.check_out ?? '',
        status: booking.status ?? 'pending',
        total_price: booking.total_price ?? '',
      }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_id || !form.room_unit_id || !form.check_in || !form.check_out) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      let res;
      if (isEdit) {
        res = await ApiService.updateRoomBooking(booking.id, form);
      } else {
        res = await ApiService.createRoomBooking(form);
      }
      if (res.data.status === 'success') {
        toast.success(isEdit ? 'Booking updated successfully!' : 'Booking created successfully!');
        onSaved();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save booking');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{isEdit ? 'Edit Booking' : 'New Room Booking'}</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Customer */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Customer *</label>
              <select className={styles.formSelect} name="customer_id" value={form.customer_id} onChange={handleChange} required>
                <option value="">-- Select Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.email ? `(${c.email})` : ''}</option>
                ))}
              </select>
            </div>

            {/* Room */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Room *</label>
              <select className={styles.formSelect} name="room_unit_id" value={form.room_unit_id} onChange={handleChange} required>
                <option value="">-- Select Room --</option>
                {roomUnits.map(r => (
                  <option key={r.id} value={r.id}>Room {r.room_number} — {r.room_type_name}</option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Check-In Date *</label>
                <input type="date" className={styles.formInput} name="check_in" value={form.check_in} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Check-Out Date *</label>
                <input type="date" className={styles.formInput} name="check_out" value={form.check_out} onChange={handleChange} required />
              </div>
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Booking Status</label>
              <select className={styles.formSelect} name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Total Price */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Total Price (₹)</label>
              <input type="number" className={styles.formInput} name="total_price" value={form.total_price}
                onChange={handleChange} placeholder="Leave blank to auto-calculate" min="0" step="0.01" />
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

// ── Booking Detail Modal ─────────────────────────────────────────────────────
const BookingDetailModal = ({ booking, onClose }) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>Booking #{booking.id} Details</h3>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      <div className={styles.detailGrid}>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Booking ID</span><span>#{booking.id}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Customer</span><span>{booking.customer_name || '—'}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Email</span><span>{booking.customer_email || '—'}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Phone</span><span>{booking.customer_phone || '—'}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Room</span><span>Room {booking.room_number}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Room Type</span><span>{booking.room_type_name || '—'}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Check-In</span><span>{booking.check_in}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Check-Out</span><span>{booking.check_out}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Nights</span><span>{booking.nights}</span></div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Status</span>
          <span className={styles.statusBadge}
            style={{ background: (STATUS_COLORS[booking.status] || '#6c757d') + '22', color: STATUS_COLORS[booking.status] || '#6c757d' }}>
            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
          </span>
        </div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Total Price</span><strong>₹{Number(booking.total_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Created</span><span>{booking.created_at ? new Date(booking.created_at).toLocaleString() : '—'}</span></div>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const RoomBooking = () => {
  const permissions = getPermissions('/bookings/roombooking');
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const getInitialFilters = () => {
    const stat = location.state?.status;
    if (stat === 'confirmed') return { booking: '', room: 'check_in' };
    if (stat === 'cancelled') return { booking: '', room: 'check_out' };
    if (stat === 'pending') return { booking: 'pending', room: '' };
    return { booking: '', room: '' };
  };
  const init = getInitialFilters();
  const [bookingStatusFilter, setBookingStatusFilter] = useState(init.booking);
  const [roomStatusFilter, setRoomStatusFilter] = useState(init.room);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Dropdown data
  const [customers, setCustomers] = useState([]);
  const [roomUnits, setRoomUnits] = useState([]);

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [detailBooking, setDetailBooking] = useState(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.ceil(totalRecords / entriesPerPage);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await ApiService.getBookingDataTable({
        page: currentPage,
        length: entriesPerPage,
        search,
        from_date: fromDate,
        to_date: toDate,
        booking_status: bookingStatusFilter,
        room_status: roomStatusFilter
      });
      if (res.data.status === 'success') {
        setBookings(res.data.data);
        setTotalRecords(res.data.total_records);
      }
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [custRes, roomRes] = await Promise.all([
        ApiService.getAllCustomers(),
        ApiService.getAllRoomUnits(),
      ]);
      if (custRes.data.status === 'success') setCustomers(custRes.data.data);
      if (roomRes.data.status === 'success') setRoomUnits(roomRes.data.data);
    } catch {
      // non-fatal
    }
  };

  useEffect(() => { fetchBookings(); }, [currentPage, entriesPerPage, search, fromDate, toDate, bookingStatusFilter, roomStatusFilter]);
  useEffect(() => { fetchDropdowns(); }, []);

  useEffect(() => {
    if (location.state && location.state.status !== undefined) {
      const stat = location.state.status;
      if (stat === 'confirmed') {
        setRoomStatusFilter('check_in');
        setBookingStatusFilter('');
      } else if (stat === 'cancelled') {
        setRoomStatusFilter('check_out');
        setBookingStatusFilter('');
      } else if (stat === 'pending') {
        setBookingStatusFilter('pending');
        setRoomStatusFilter('');
      } else {
        setBookingStatusFilter('');
        setRoomStatusFilter('');
      }
    }
  }, [location.state]);

  const openCreate = () => { setEditBooking(null); setShowForm(true); };
  const openEdit = (b) => { setEditBooking(b); setShowForm(true); };

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
      if (res.data.status === 'success') setDetailBooking(res.data.data);
    } catch {
      toast.error('Failed to load booking details');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await ApiService.deleteRoomBooking(deleteTarget.id);
      if (res.data.status === 'success') {
        toast.success('Booking deleted');
        setDeleteTarget(null);
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete booking');
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
          <h2 className={styles.title}>Room Booking Management</h2>
          <p className={styles.subtitle}>View, create, edit, and manage room bookings with status tracking</p>
        </div>
        {permissions.add && (
          <button className={styles.createButton} onClick={openCreate}>＋ New Room Booking</button>
        )}
      </div>

      {/* Search */}
      <div className={styles.tabContent}>
        <div className={styles.actions} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search by guest name, room number..."
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
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6c757d' }}>Booking Status:</label>
            <select
              className={styles.searchInput}
              value={bookingStatusFilter}
              onChange={(e) => { setBookingStatusFilter(e.target.value); setCurrentPage(1); }}
              style={{ minWidth: '120px', padding: '0.5rem 0.8rem' }}
            >
              <option value="">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6c757d' }}>Room Status:</label>
            <select
              className={styles.searchInput}
              value={roomStatusFilter}
              onChange={(e) => { setRoomStatusFilter(e.target.value); setCurrentPage(1); }}
              style={{ minWidth: '120px', padding: '0.5rem 0.8rem' }}
            >
              <option value="">All</option>
              <option value="check_in">Check In</option>
              <option value="check_out">Check Out</option>
            </select>
          </div>
          {(search || fromDate || toDate || bookingStatusFilter || roomStatusFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setFromDate('');
                setToDate('');
                setBookingStatusFilter('');
                setRoomStatusFilter('');
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
          <div className={styles.loadingText}>Loading bookings...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className="table table-bordered table-hover mb-0">
              <thead>
                <tr>
                  <th className={styles.table_head}>#</th>
                  <th className={styles.table_head}>Guest</th>
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
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td><strong>#{b.id}</strong></td>
                      <td>
                        <strong>{b.customer_name || '—'}</strong>
                        {b.customer_phone && <div className={styles.subText}>{b.customer_phone}</div>}
                      </td>
                      <td>Room {b.room_number}</td>
                      <td>{b.room_type_name || '—'}</td>
                      <td>{b.check_in}</td>
                      <td>{b.check_out}</td>
                      <td>{b.nights}</td>
                      <td>₹{Number(b.total_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{ background: (STATUS_COLORS[b.status] || '#6c757d') + '22', color: STATUS_COLORS[b.status] || '#6c757d' }}
                        >
                          {b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                        </span>
                      </td>
                      <td className={styles.actionsCell}>
                        <button className={styles.viewButton} onClick={() => openDetail(b.id)}>View</button>
                        {permissions.edit && (
                          <>
                            <button className={styles.editButton} onClick={() => openEdit(b)}>Edit</button>
                            <select
                              className={styles.statusSelect}
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            >
                              {BOOKING_STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </>
                        )}
                        {permissions.delete && (
                          <button className={styles.deleteButton} onClick={() => setDeleteTarget(b)}>Delete</button>
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
                Showing {bookings.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{' '}
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
          booking={editBooking}
          customers={customers}
          roomUnits={roomUnits}
          onClose={() => setShowForm(false)}
          onSaved={fetchBookings}
        />
      )}

      {/* Detail Modal */}
      {detailBooking && (
        <BookingDetailModal booking={detailBooking} onClose={() => setDetailBooking(null)} />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: 420 }}>
            <div className={styles.modalHeader} style={{ background: 'linear-gradient(135deg,#dc3545,#b02a37)' }}>
              <h3 className={styles.modalTitle}>Confirm Delete</h3>
              <button className={styles.closeButton} onClick={() => setDeleteTarget(null)}>×</button>
            </div>
            <div className={styles.modalBody} style={{ textAlign: 'center', padding: '1.5rem' }}>
              <p>Are you sure you want to delete <strong>Booking #{deleteTarget.id}</strong> for <strong>{deleteTarget.customer_name}</strong>?</p>
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

export default RoomBooking;
