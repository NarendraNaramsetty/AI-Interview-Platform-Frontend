import { useState, useEffect } from 'react';
import styles from './RoomDetails.module.css';
import ApiService from '../../../service/Apiservice.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { getPermissions } from '../../../utils/permissionHelper.js';

const STATUS_CFG = {
  available: { bg: '#e8f5e9', color: '#28a745', label: 'Available' },
  maintenance: { bg: '#fff3e0', color: '#f0ad00', label: 'Maintenance' },
  occupied: { bg: '#fdecea', color: '#dc3545', label: 'Occupied' },
};

const BOOKING_STATUS_CFG = {
  confirmed: { bg: '#e8f5e9', color: '#28a745' },
  pending: { bg: '#fff8e1', color: '#ffc107' },
  cancelled: { bg: '#fdecea', color: '#dc3545' },
};

const EMPTY_FORM = {
  room_number: '',
  room_type_id: '',
  status: 'available',
  description: '',
  price: '',
  capacity: '',
  bed_type: '',
  room_dimensions: '',
  taxes: '',
  no_of_rooms_available: '',
  room_features: '',
  available_dates: ''
};

// ── Room Form Modal (Add / Edit) ──────────────────────────────────────────────
const RoomFormModal = ({
  title,
  form,
  setForm,
  roomTypes,
  onSubmit,
  onClose,
  saving,
  isOccupied = false,
  existingImages = [],
  setExistingImages = () => { },
  selectedFiles = [],
  setSelectedFiles = () => { }
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.formModal}>
        <div className={styles.formModalHeader}>
          <h3 className={styles.formModalTitle}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <form onSubmit={onSubmit} className={styles.formModalBody}>
          <div className={styles.formGrid}>
            {/* Room Number */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Room Number <span className={styles.req}>*</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. 101, A-201"
                value={form.room_number}
                onChange={e => setForm(f => ({ ...f, room_number: e.target.value }))}
                required
              />
            </div>

            {/* Room Type */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Room Type <span className={styles.req}>*</span>
              </label>
              <select
                className={styles.formInput}
                value={form.room_type_id}
                onChange={e => setForm(f => ({ ...f, room_type_id: e.target.value }))}
                required
              >
                <option value="">-- Select Room Type --</option>
                {roomTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Status <span className={styles.req}>*</span>
              </label>
              {isOccupied ? (
                <div className={styles.disabledStatusInfo}>
                  <span className={styles.statusPill} style={{ background: '#fdecea', color: '#dc3545' }}>Occupied (Booked)</span>
                  <p className={styles.disabledStatusHint}>Occupied rooms cannot be changed to maintenance status.</p>
                </div>
              ) : (
                <select
                  className={styles.formInput}
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  required
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              )}
            </div>

            {/* Price */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Price per Night (₹) <span className={styles.req}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className={styles.formInput}
                placeholder="e.g. 2999.00"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                required
              />
            </div>

            {/* Capacity */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Capacity (Guests) <span className={styles.req}>*</span>
              </label>
              <input
                type="number"
                className={styles.formInput}
                placeholder="e.g. 2"
                value={form.capacity}
                onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                required
              />
            </div>

            {/* Bed Type */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Bed Type</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. King, Twin, Queen"
                value={form.bed_type}
                onChange={e => setForm(f => ({ ...f, bed_type: e.target.value }))}
              />
            </div>

            {/* Room Dimensions */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Room Dimensions</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. 450 sq ft"
                value={form.room_dimensions}
                onChange={e => setForm(f => ({ ...f, room_dimensions: e.target.value }))}
              />
            </div>

            {/* Taxes */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Taxes</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. 18% GST"
                value={form.taxes}
                onChange={e => setForm(f => ({ ...f, taxes: e.target.value }))}
              />
            </div>

            {/* Available Rooms */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Available Rooms Count</label>
              <input
                type="number"
                className={styles.formInput}
                placeholder="e.g. 10"
                value={form.no_of_rooms_available}
                onChange={e => setForm(f => ({ ...f, no_of_rooms_available: e.target.value }))}
              />
            </div>

            {/* Available Dates */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Available Dates</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. 2026-06-01 to 2026-12-31"
                value={form.available_dates}
                onChange={e => setForm(f => ({ ...f, available_dates: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className={styles.formGroupFull}>
              <label className={styles.formLabel}>Description</label>
              <textarea
                className={styles.formTextarea}
                placeholder="Enter room description..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows="3"
              />
            </div>

            {/* Room Features */}
            <div className={styles.formGroupFull}>
              <label className={styles.formLabel}>Room Features</label>
              <textarea
                className={styles.formTextarea}
                placeholder="e.g. AC, TV, WiFi, Mini Bar (comma-separated)"
                value={form.room_features}
                onChange={e => setForm(f => ({ ...f, room_features: e.target.value }))}
                rows="3"
              />
            </div>

            {/* Room Images */}
            <div className={styles.formGroupFull}>
              <label className={styles.formLabel}>Room Images</label>
              <div className={styles.uploadZone} onClick={() => document.getElementById("room-details-img-upload").click()}>
                <div className={styles.uploadIcon}>📤</div>
                <div className={styles.uploadText}>Click to upload room images (supports multiple)</div>
                <input
                  id="room-details-img-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => {
                    if (e.target.files) {
                      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)]);
                    }
                  }}
                />
              </div>
              {(existingImages.length > 0 || selectedFiles.length > 0) && (
                <div className={styles.previewGrid}>
                  {existingImages.map((url, i) => (
                    <div key={`e-${i}`} className={styles.previewCard}>
                      <img src={url} alt="existing preview" className={styles.previewImage} />
                      <button
                        type="button"
                        className={styles.removeBadge}
                        onClick={() => setExistingImages(prev => prev.filter((_, j) => j !== i))}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {selectedFiles.map((file, i) => (
                    <div key={`n-${i}`} className={styles.previewCard}>
                      <img src={URL.createObjectURL(file)} alt="new preview" className={styles.previewImage} />
                      <button
                        type="button"
                        className={styles.removeBadge}
                        onClick={() => setSelectedFiles(prev => prev.filter((_, j) => j !== i))}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formModalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : title === 'Add Room' ? 'Add Room' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── View Details Modal ────────────────────────────────────────────────────────
const ViewModal = ({ room, bookings, onClose }) => {
  const today = new Date().toISOString().split('T')[0];
  const roomBookings = bookings.filter(b => (b.room_unit?.id ?? b.room_unit) === room.id);
  const active = roomBookings.find(b =>
    b.status === 'confirmed' && b.check_in <= today && b.check_out >= today
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.viewModal}>
        <div className={styles.viewModalHeader}>
          <div>
            <h3 className={styles.formModalTitle}>Room {room.room_number}</h3>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem' }}>{room.room_type_name || '—'}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div className={styles.viewModalBody}>
          {/* Room image */}
          {room.room_images && (
            <img
              src={room.room_images.split(',')[0].trim()}
              alt={`Room ${room.room_number}`}
              className={styles.viewRoomImage}
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}

          {/* Info grid */}
          <div className={styles.infoGrid}>
            {[
              { label: 'Room Number', value: `Room ${room.room_number}` },
              { label: 'Room Type', value: room.room_type_name || '—' },
              { label: 'Capacity', value: room.capacity ? `${room.capacity} Guests` : '—' },
              { label: 'Price/Night', value: room.room_type_price ? `₹${Number(room.room_type_price).toLocaleString('en-IN')}` : '—' },
              { label: 'Bed Type', value: room.bed_type || 'N/A' },
              {
                label: 'Status',
                value: null,
                pill: true,
                cfg: STATUS_CFG[room.liveStatus] || STATUS_CFG.available,
              },
            ].map((item, i) => (
              <div key={i} className={styles.infoCard}>
                <span className={styles.infoLabel}>{item.label}</span>
                {item.pill
                  ? <span className={styles.statusPill} style={{ background: item.cfg.bg, color: item.cfg.color }}>{item.cfg.label}</span>
                  : <span className={styles.infoValue}>{item.value}</span>
                }
              </div>
            ))}
          </div>

          {/* Current guest */}
          {active && (
            <div className={styles.guestSection}>
              <h4 className={styles.sectionHeading}>🛎️ Current Guest</h4>
              <div className={styles.infoGrid}>
                {[
                  { label: 'Guest Name', value: active.customer_name || '—' },
                  { label: 'Phone', value: active.customer_phone || '—' },
                  { label: 'Check-In', value: active.check_in },
                  { label: 'Check-Out', value: active.check_out },
                  { label: 'Nights', value: active.nights },
                  { label: 'Total Price', value: `₹${Number(active.total_price || 0).toLocaleString('en-IN')}` },
                ].map((item, i) => (
                  <div key={i} className={styles.infoCard}>
                    <span className={styles.infoLabel}>{item.label}</span>
                    <span className={styles.infoValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking history */}
          <h4 className={styles.sectionHeading} style={{ marginTop: 16 }}>
            📋 Booking History ({roomBookings.length})
          </h4>
          {roomBookings.length === 0 ? (
            <p style={{ color: '#6c757d', textAlign: 'center', padding: '12px 0' }}>No bookings for this room.</p>
          ) : (
            <div className={styles.historyWrapper}>
              <table className="table table-sm table-bordered mb-0">
                <thead>
                  <tr>
                    <th className={styles.th}>ID</th>
                    <th className={styles.th}>Guest</th>
                    <th className={styles.th}>Check-In</th>
                    <th className={styles.th}>Check-Out</th>
                    <th className={styles.th}>Nights</th>
                    <th className={styles.th}>Total</th>
                    <th className={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {roomBookings.map(b => {
                    const cfg = BOOKING_STATUS_CFG[b.status] || BOOKING_STATUS_CFG.pending;
                    return (
                      <tr key={b.id}>
                        <td>#{b.id}</td>
                        <td>{b.customer_name || '—'}</td>
                        <td>{b.check_in}</td>
                        <td>{b.check_out}</td>
                        <td>{b.nights}</td>
                        <td>₹{Number(b.total_price || 0).toLocaleString('en-IN')}</td>
                        <td>
                          <span className={styles.statusPill} style={{ background: cfg.bg, color: cfg.color }}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const RoomDetails = () => {
  const permissions = getPermissions('/manageroom/roomdetails');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & pagination
  const [search, setSearch]               = useState('');
  const [statusFilter, setStatusFilter]   = useState('all');
  const [typeFilter, setTypeFilter]       = useState('all');
  const [fromDate, setFromDate]           = useState('');
  const [toDate, setToDate]               = useState('');
  const [currentPage, setCurrentPage]     = useState(1);
  const entriesPerPage = 10;

  // Modals
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ ...EMPTY_FORM });
  const [addSaving, setAddSaving] = useState(false);

  const [editRoom, setEditRoom] = useState(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM });
  const [editSaving, setEditSaving] = useState(false);

  const [viewRoom, setViewRoom] = useState(null);

  // Images states for Add/Edit forms
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomRes, bookingRes, typeRes] = await Promise.all([
        ApiService.getAllRoomUnits(),
        ApiService.getBookingList(),
        ApiService.getAllRoomTypes(),
      ]);
      if (roomRes?.data?.status === 'success') setRooms(roomRes.data.data || []);
      if (bookingRes?.data?.status === 'success') setBookings(bookingRes.data.data || []);
      if (typeRes?.data?.status === 'success') setRoomTypes(typeRes.data.data || []);
    } catch {
      toast.error('Failed to load room data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, typeFilter]);

  // ── Add Room ──────────────────────────────────────────────────────────────
  const handleAddRoom = async (e) => {
    e.preventDefault();
    setAddSaving(true);
    const data = new FormData();
    data.append('room_number', addForm.room_number.trim());
    data.append('room_type_id', addForm.room_type_id);
    data.append('room_type', addForm.room_type_id);
    data.append('status', addForm.status || 'available');
    data.append('price', addForm.price);
    data.append('capacity', addForm.capacity);
    data.append('description', addForm.description || '');
    data.append('bed_type', addForm.bed_type || '');
    data.append('room_dimensions', addForm.room_dimensions || '');
    data.append('taxes', addForm.taxes || '');
    data.append('no_of_rooms_available', addForm.no_of_rooms_available || '0');
    data.append('room_features', addForm.room_features || '');
    data.append('available_dates', addForm.available_dates || '');
    data.append('room_images', existingImages.join(','));
    selectedFiles.forEach(file => {
      data.append('images', file);
    });

    try {
      const res = await ApiService.addRoomUnit(data);
      if (res?.data?.status === 'success') {
        toast.success('Room added successfully!');
        setShowAdd(false);
        setAddForm({ ...EMPTY_FORM });
        setExistingImages([]);
        setSelectedFiles([]);
        fetchData();
      } else {
        toast.error(res?.data?.message || 'Failed to add room');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add room');
    } finally {
      setAddSaving(false);
    }
  };

  // ── Edit Room ─────────────────────────────────────────────────────────────
  const openEdit = (room) => {
    setEditRoom(room);
    setEditForm({
      room_number: room.room_number || '',
      room_type_id: room.room_type_id || room.room_type?.id || '',
      status: room.status || 'available',
      price: room.price || '',
      capacity: room.capacity || '',
      description: room.description || '',
      bed_type: room.bed_type || '',
      room_dimensions: room.room_dimensions || '',
      taxes: room.taxes || '',
      no_of_rooms_available: room.no_of_rooms_available || '',
      room_features: room.room_features || '',
      available_dates: room.available_dates || ''
    });
    setExistingImages(room.room_images ? room.room_images.split(',').map(url => url.trim()).filter(Boolean) : []);
    setSelectedFiles([]);
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    const data = new FormData();
    data.append('room_number', editForm.room_number.trim());
    data.append('room_type_id', editForm.room_type_id);
    data.append('room_type', editForm.room_type_id);
    data.append('status', editForm.status);
    data.append('price', editForm.price);
    data.append('capacity', editForm.capacity);
    data.append('description', editForm.description || '');
    data.append('bed_type', editForm.bed_type || '');
    data.append('room_dimensions', editForm.room_dimensions || '');
    data.append('taxes', editForm.taxes || '');
    data.append('no_of_rooms_available', editForm.no_of_rooms_available || '0');
    data.append('room_features', editForm.room_features || '');
    data.append('available_dates', editForm.available_dates || '');
    data.append('room_images', existingImages.join(','));
    selectedFiles.forEach(file => {
      data.append('images', file);
    });

    try {
      const res = await ApiService.updateRoomUnit(editRoom.id, data);
      if (res?.data?.status === 'success') {
        toast.success('Room updated successfully!');
        setEditRoom(null);
        setExistingImages([]);
        setSelectedFiles([]);
        fetchData();
      } else {
        toast.error(res?.data?.message || 'Failed to update room');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update room');
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete Room ───────────────────────────────────────────────────────────
  const handleDelete = async (room) => {
    const result = await Swal.fire({
      title: 'Delete Room?',
      text: `Room ${room.room_number} will be permanently deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await ApiService.deleteRoomUnit(room.id);
      if (res?.data?.status === 'success') {
        toast.success(`Room ${room.room_number} deleted`);
        fetchData();
      } else {
        toast.error(res?.data?.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete room');
    }
  };

  // ── Derived data ──────────────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];

  const enriched = rooms.map(room => {
    const active = bookings.find(
      b => (b.room_unit?.id ?? b.room_unit) === room.id
        && b.status === 'confirmed'
        && (
          fromDate || toDate
            ? (
                (!fromDate || b.check_out >= fromDate) &&
                (!toDate || b.check_in <= toDate)
              )
            : (b.check_in <= today && b.check_out >= today)
        )
    );
    return { ...room, liveStatus: active ? 'occupied' : room.status, activeBooking: active };
  });

  const typeOptions = [...new Set(rooms.map(r => r.room_type_name).filter(Boolean))];

  const stats = [
    { label: 'Total Rooms', value: enriched.length, color: '#39ab49', icon: '🏨' },
    { label: 'Available', value: enriched.filter(r => r.liveStatus === 'available').length, color: '#28a745', icon: '✅' },
    { label: 'Occupied', value: enriched.filter(r => r.liveStatus === 'occupied').length, color: '#dc3545', icon: '🛏️' },
    { label: 'Maintenance', value: enriched.filter(r => r.liveStatus === 'maintenance').length, color: '#f0ad00', icon: '🔧' },
  ];

  const filtered = enriched.filter(r => {
    const s = search.toLowerCase();
    const matchSearch = !s || r.room_number?.toLowerCase().includes(s) || r.room_type_name?.toLowerCase().includes(s);
    const matchStatus = statusFilter === 'all' || r.liveStatus === statusFilter;
    const matchType = typeFilter === 'all' || r.room_type_name === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const paginated = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const pageNumbers = () => {
    const pages = []; const max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) if (i > 0) pages.push(i);
    return pages;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Room Details</h2>
          <p className={styles.subtitle}>Complete overview of all rooms — occupancy, type, pricing and booking history</p>
        </div>
        {permissions.add && (
          <button className={styles.addRoomBtn} onClick={() => { setAddForm({ ...EMPTY_FORM }); setExistingImages([]); setSelectedFiles([]); setShowAdd(true); }}>
            + Add Room
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statCard} style={{ borderTop: `4px solid ${s.color}` }}>
            <div className={styles.statEmoji}>{s.icon}</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filtersRow}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by room number or type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select className={styles.filterSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Room Types</option>
          {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6c757d' }}>From:</label>
          <input
            type="date"
            className={styles.filterSelect}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ padding: '0.5rem 0.8rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6c757d' }}>To:</label>
          <input
            type="date"
            className={styles.filterSelect}
            value={toDate}
            min={fromDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ padding: '0.5rem 0.8rem' }}
          />
        </div>
        {(fromDate || toDate) && (
          <button
            onClick={() => {
              setFromDate('');
              setToDate('');
            }}
            style={{
              padding: '0.5rem 1.2rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
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

      {/* Table */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingText}>Loading room details...</div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className="table table-bordered table-hover mb-0">
                <thead>
                  <tr>
                    <th className={styles.th}>S.No</th>
                    <th className={styles.th}>Image</th>
                    <th className={styles.th}>Room Number</th>
                    <th className={styles.th}>Room Type</th>
                    <th className={styles.th}>Capacity</th>
                    <th className={styles.th}>Price / Night</th>
                    <th className={styles.th}>Bed Type</th>
                    <th className={styles.th}>Current Guest</th>
                    <th className={styles.th}>Check-In</th>
                    <th className={styles.th}>Check-Out</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={12} className={styles.emptyRow}>No rooms found.</td></tr>
                  ) : paginated.map((room, idx) => {
                    const statusCfg = STATUS_CFG[room.liveStatus] || STATUS_CFG.available;
                    const firstImg = room.room_images?.split(',')[0]?.trim();
                    return (
                      <tr key={room.id}>
                        <td>{(currentPage - 1) * entriesPerPage + idx + 1}</td>
                        <td>
                          {firstImg
                            ? <img src={firstImg} alt={`Room ${room.room_number}`} className={styles.roomThumb}
                              onError={e => { e.target.src = ''; e.target.style.display = 'none'; }} />
                            : <div className={styles.noImage}>No Image</div>
                          }
                        </td>
                        <td><strong>Room {room.room_number}</strong></td>
                        <td>{room.room_type_name || '—'}</td>
                        <td>{room.capacity ? `${room.capacity} Guests` : '—'}</td>
                        <td>₹{Number(room.price || 0).toLocaleString('en-IN')}</td>
                        <td>{room.bed_type || 'N/A'}</td>
                        <td>
                          {room.activeBooking
                            ? <strong>{room.activeBooking.customer_name}</strong>
                            : <span style={{ color: '#bbb' }}>—</span>}
                        </td>
                        <td>{room.activeBooking?.check_in || <span style={{ color: '#bbb' }}>—</span>}</td>
                        <td>{room.activeBooking?.check_out || <span style={{ color: '#bbb' }}>—</span>}</td>
                        <td>
                          <span className={styles.statusPill}
                            style={{ background: statusCfg.bg, color: statusCfg.color }}>
                            {statusCfg.label}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionsCell}>
                            <button className={styles.viewBtn} onClick={() => setViewRoom(room)}>View</button>
                            {permissions.edit && (
                              <button className={styles.editBtn} onClick={() => openEdit(room)}>Edit</button>
                            )}
                            {permissions.delete && (
                              <button className={styles.deleteBtn} onClick={() => handleDelete(room)}>Delete</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={styles.tableFooter}>
              <div className={styles.pageInfo}>
                Showing {filtered.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * entriesPerPage, filtered.length)} of {filtered.length} rooms
              </div>
              <div className={styles.pagination}>
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={styles.pageBtn}>Prev</button>
                {pageNumbers().map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`${styles.pageBtn} ${currentPage === p ? styles.pageBtnActive : ''}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0} className={styles.pageBtn}>Next</button>
              </div>
              <div className={styles.entriesControl}>Total: {filtered.length} rooms</div>
            </div>
          </>
        )}
      </div>

      {/* Add Room Modal */}
      {showAdd && (
        <RoomFormModal
          title="Add Room"
          form={addForm}
          setForm={setAddForm}
          roomTypes={roomTypes}
          onSubmit={handleAddRoom}
          onClose={() => setShowAdd(false)}
          saving={addSaving}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      )}

      {/* Edit Room Modal */}
      {editRoom && (
        <RoomFormModal
          title="Edit Room"
          form={editForm}
          setForm={setEditForm}
          roomTypes={roomTypes}
          onSubmit={handleEditRoom}
          onClose={() => setEditRoom(null)}
          saving={editSaving}
          isOccupied={editRoom?.liveStatus === 'occupied'}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      )}

      {/* View Details Modal */}
      {viewRoom && (
        <ViewModal
          room={viewRoom}
          bookings={bookings}
          onClose={() => setViewRoom(null)}
        />
      )}
    </div>
  );
};

export default RoomDetails;
