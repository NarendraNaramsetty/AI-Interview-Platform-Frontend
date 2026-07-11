import { useState, useEffect } from 'react';
import styles from './Roommaintenance.module.css';
import ApiService from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faBed, faCheckCircle, faWrench, faCalendarAlt, 
  faEnvelope, faPhone, faInfoCircle, faArrowRight,
  faDoorOpen, faPlus
} from "@fortawesome/free-solid-svg-icons";
import PageLoader from '../../common/PageLoader.jsx';
import Swal from 'sweetalert2';

const Roommaintenance = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Add Room Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ room_number: '', room_type_id: '', status: 'available' });
  const [addLoading, setAddLoading] = useState(false);

  // Edit Room Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ id: null, room_number: '', room_type_id: '', status: 'available' });
  const [editLoading, setEditLoading] = useState(false);

  // Search & Filter states
  const [roomSearch, setRoomSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');

  // Pagination states
  const [roomsPage, setRoomsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const entriesPerPage = 10;

  useEffect(() => { setRoomsPage(1); }, [roomSearch]);
  useEffect(() => { setBookingsPage(1); }, [bookingSearch]);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes, typesRes] = await Promise.all([
        ApiService.getAllRoomUnits(),
        ApiService.getBookingList(),
        ApiService.getAllRoomTypes(),
      ]);
      if (roomsRes?.data?.status === 'success')   setRooms(roomsRes.data.data || []);
      if (bookingsRes?.data?.status === 'success') setBookings(bookingsRes.data.data || []);
      if (typesRes?.data?.status === 'success')   setRoomTypes(typesRes.data.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Add Room ─────────────────────────────────────────────────────────────
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!addForm.room_number.trim()) { toast.error('Room number is required'); return; }
    if (!addForm.room_type_id)       { toast.error('Please select a room type'); return; }

    setAddLoading(true);
    try {
      const res = await ApiService.addRoomUnit({
        room_number: addForm.room_number.trim(),
        room_type_id: addForm.room_type_id,
        room_type:   addForm.room_type_id,
        status:      addForm.status || 'available',
      });
      if (res?.data?.status === 'success') {
        toast.success('Room added successfully!');
        setShowAddModal(false);
        setAddForm({ room_number: '', room_type_id: '', status: 'available' });
        fetchData();
      } else {
        toast.error(res?.data?.message || 'Failed to add room');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add room');
    } finally {
      setAddLoading(false);
    }
  };

  // ── Edit Room ─────────────────────────────────────────────────────────────
  const openEditModal = (room) => {
    setEditForm({
      id: room.id,
      room_number: room.room_number,
      room_type_id: room.room_type_id || room.room_type?.id || '',
      status: room.status || 'available',
    });
    setShowEditModal(true);
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    if (!editForm.room_number.trim()) { toast.error('Room number is required'); return; }
    if (!editForm.room_type_id)       { toast.error('Please select a room type'); return; }

    setEditLoading(true);
    try {
      const res = await ApiService.updateRoomUnit(editForm.id, {
        room_number: editForm.room_number.trim(),
        room_type_id: editForm.room_type_id,
        room_type:   editForm.room_type_id,
        status:      editForm.status,
      });
      if (res?.data?.status === 'success') {
        toast.success('Room updated successfully!');
        setShowEditModal(false);
        fetchData();
      } else {
        toast.error(res?.data?.message || 'Failed to update room');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update room');
    } finally {
      setEditLoading(false);
    }
  };

  // ── Delete Room ───────────────────────────────────────────────────────────
  const handleDeleteRoom = async (room) => {
    const result = await Swal.fire({
      title: 'Delete Room?',
      text: `Are you sure you want to delete Room ${room.room_number}? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete',
    });

    if (result.isConfirmed) {
      try {
        const res = await ApiService.deleteRoomUnit(room.id);
        if (res?.data?.status === 'success') {
          toast.success(`Room ${room.room_number} deleted successfully`);
          fetchData();
        } else {
          toast.error(res?.data?.message || 'Failed to delete room');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete room');
      }
    }
  };
  const today = new Date().toISOString().split('T')[0];
  const totalRooms = rooms.length;
  const bookedRoomsCount = rooms.filter(r => r.status !== 'available' && r.status !== 'maintenance').length;
  const availableRoomsCount = rooms.filter(r => r.status === 'available').length;
  const maintenanceRoomsCount = rooms.filter(r => r.status === 'maintenance').length;

  // Toggle Room Maintenance status
  const handleToggleStatus = async (room) => {
    const isCurrentlyMaintenance = room.status === 'maintenance';
    const result = await Swal.fire({
      title: isCurrentlyMaintenance ? 'Set Room Available?' : 'Set Under Maintenance?',
      text: isCurrentlyMaintenance 
        ? `Set Room ${room.room_number} to Available status?`
        : `Mark Room ${room.room_number} as Under Maintenance?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#39ab49',
      cancelButtonColor: '#d33',
      confirmButtonText: isCurrentlyMaintenance ? 'Yes, Available' : 'Yes, Maintenance'
    });

    if (result.isConfirmed) {
      setUpdatingId(room.id);
      try {
        const res = await ApiService.toggleRoomUnitStatus(room.id);
        if (res?.data?.status === 'success') {
          toast.success(res.data.message || 'Room status updated successfully');
          fetchData();
        } else {
          toast.error(res?.data?.message || 'Failed to update status');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update room status');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  // Find active booking for a room unit
  const getActiveStay = (roomUnitId) => {
    return bookings.find(b => {
      const bid = b.room_unit?.id ?? b.room_unit;
      return bid === roomUnitId && b.status === 'confirmed'
        && b.check_in <= today && b.check_out >= today;
    });
  };

  // Filtered lists
  const filteredRooms = rooms.filter(r => {
    const searchLower = roomSearch.toLowerCase();
    const roomNum = r.room_number ? r.room_number.toLowerCase() : '';
    const roomType = (r.room_type_name || r.room_type?.name || '').toLowerCase();
    return roomNum.includes(searchLower) || roomType.includes(searchLower);
  });

  const filteredBookings = bookings.filter(b => {
    const searchLower = bookingSearch.toLowerCase();
    const guestName  = (b.customer_name  || b.customer?.name  || '').toLowerCase();
    const guestEmail = (b.customer_email || b.customer?.email || '').toLowerCase();
    const roomNum    = (b.room_number    || b.room_unit?.room_number || '').toLowerCase();
    return guestName.includes(searchLower) || guestEmail.includes(searchLower) || roomNum.includes(searchLower);
  });

  // Calculate paginated lists
  const totalRoomsPages = Math.ceil(filteredRooms.length / entriesPerPage);
  const paginatedRooms = filteredRooms.slice(
    (roomsPage - 1) * entriesPerPage,
    roomsPage * entriesPerPage
  );

  const totalBookingsPages = Math.ceil(filteredBookings.length / entriesPerPage);
  const paginatedBookings = filteredBookings.slice(
    (bookingsPage - 1) * entriesPerPage,
    bookingsPage * entriesPerPage
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className={styles.pageWrapper}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className={styles.headerContainer}>
        <div className={styles.titleSection}>
          <h1>Room Management</h1>
          <p>Monitor physical room allocations, occupancy, and check customer booking details.</p>
        </div>
        <button className={styles.actionButton} onClick={() => setShowAddModal(true)}>
          <FontAwesomeIcon icon={faPlus} />
          Add Room
        </button>
      </div>

      {/* ── Add Room Modal ── */}
      {showAddModal && (() => {
        const selectedType = roomTypes.find(rt => String(rt.id) === String(addForm.room_type_id));
        const firstImg = selectedType?.room_images?.split(',')[0]?.trim();
        return (
          <div className={styles.modalOverlay}>
            <div className={styles.addModal}>
              <div className={styles.addModalHeader}>
                <h3 className={styles.addModalTitle}>Add New Room</h3>
                <button className={styles.addModalClose} onClick={() => { setShowAddModal(false); setAddForm({ room_number: '', room_type_id: '', status: 'available' }); }}>×</button>
              </div>
              <form onSubmit={handleAddRoom} className={styles.addModalBody}>
                {/* Room Number */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Room Number <span style={{ color: '#dc3545' }}>*</span></label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g. 101, 102, A-201"
                    value={addForm.room_number}
                    onChange={e => setAddForm({ ...addForm, room_number: e.target.value })}
                    required
                  />
                </div>

                {/* Room Type */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Room Type <span style={{ color: '#dc3545' }}>*</span></label>
                  <select
                    className={styles.formInput}
                    value={addForm.room_type_id}
                    onChange={e => setAddForm({ ...addForm, room_type_id: e.target.value })}
                    required
                  >
                    <option value="">-- Select Room Type --</option>
                    {roomTypes.map(rt => (
                      <option key={rt.id} value={rt.id}>
                        {rt.name} {rt.price ? `— ₹${Number(rt.price).toLocaleString('en-IN')}/night` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status <span style={{ color: '#dc3545' }}>*</span></label>
                  <select
                    className={styles.formInput}
                    value={addForm.status}
                    onChange={e => setAddForm({ ...addForm, status: e.target.value })}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>

                {/* Room Type Preview */}
                {selectedType && (
                  <div className={styles.typePreviewBox}>
                    <h4 className={styles.previewHeading}>Room Type Details</h4>
                    <div className={styles.previewContent}>
                      {firstImg ? (
                        <img
                          src={firstImg}
                          alt={selectedType.name}
                          className={styles.previewImage}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className={styles.noImage}>No Image</div>
                      )}
                      <div className={styles.previewGrid}>
                        <div className={styles.previewItem}>
                          <span className={styles.previewLabel}>Capacity</span>
                          <span className={styles.previewValue}>{selectedType.capacity ? `${selectedType.capacity} Guests` : 'N/A'}</span>
                        </div>
                        <div className={styles.previewItem}>
                          <span className={styles.previewLabel}>Price / Night</span>
                          <span className={styles.previewValue}>₹{Number(selectedType.price).toLocaleString('en-IN')}</span>
                        </div>
                        <div className={styles.previewItem}>
                          <span className={styles.previewLabel}>Bed Type</span>
                          <span className={styles.previewValue}>{selectedType.bed_type || 'N/A'}</span>
                        </div>
                        <div className={styles.previewItem}>
                          <span className={styles.previewLabel}>Taxes</span>
                          <span className={styles.previewValue}>
                            {selectedType.taxes ? `₹${parseFloat(selectedType.taxes).toLocaleString('en-IN')}` : '₹0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.addModalFooter}>
                  <button type="button" className={styles.cancelBtn}
                    onClick={() => { setShowAddModal(false); setAddForm({ room_number: '', room_type_id: '', status: 'available' }); }}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveBtn} disabled={addLoading}>
                    {addLoading ? 'Adding...' : 'Add Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ── Edit Room Modal ── */}
      {showEditModal && (() => {
        const selectedType = roomTypes.find(rt => String(rt.id) === String(editForm.room_type_id));
        const firstImg = selectedType?.room_images?.split(',')[0]?.trim();
        const editRoomObj = rooms.find(r => r.id === editForm.id);
        const isOccupied = editRoomObj?.status === 'booked';
        return (
          <div className={styles.modalOverlay}>
            <div className={styles.addModal}>
              <div className={styles.addModalHeader}>
                <h3 className={styles.addModalTitle}>Edit Room</h3>
                <button className={styles.addModalClose} onClick={() => setShowEditModal(false)}>×</button>
              </div>
              <form onSubmit={handleEditRoom} className={styles.addModalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Room Number <span style={{ color: '#dc3545' }}>*</span></label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g. 101, A-201"
                    value={editForm.room_number}
                    onChange={e => setEditForm({ ...editForm, room_number: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Room Type <span style={{ color: '#dc3545' }}>*</span></label>
                  <select
                    className={styles.formInput}
                    value={editForm.room_type_id}
                    onChange={e => setEditForm({ ...editForm, room_type_id: e.target.value })}
                    required
                  >
                    <option value="">-- Select Room Type --</option>
                    {roomTypes.map(rt => (
                      <option key={rt.id} value={rt.id}>
                        {rt.name} {rt.price ? `— ₹${Number(rt.price).toLocaleString('en-IN')}/night` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status <span style={{ color: '#dc3545' }}>*</span></label>
                  {isOccupied ? (
                    <div className={styles.disabledStatusInfo}>
                      <span className={styles.statusPill} style={{ background: '#fdecea', color: '#dc3545' }}>Occupied (Booked)</span>
                      <p className={styles.disabledStatusHint}>Occupied rooms cannot be changed to maintenance status.</p>
                    </div>
                  ) : (
                    <select
                      className={styles.formInput}
                      value={editForm.status}
                      onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                      required
                    >
                      <option value="available">Available</option>
                      <option value="maintenance">Under Maintenance</option>
                    </select>
                  )}
                </div>

                {/* Room Type Preview */}
                {selectedType && (
                  <div className={styles.typePreviewBox}>
                    <h4 className={styles.previewHeading}>Room Type Details</h4>
                    <div className={styles.previewContent}>
                      {firstImg ? (
                        <img
                          src={firstImg}
                          alt={selectedType.name}
                          className={styles.previewImage}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className={styles.noImage}>No Image</div>
                      )}
                      <div className={styles.previewGrid}>
                        <div className={styles.previewItem}>
                          <span className={styles.previewLabel}>Capacity</span>
                          <span className={styles.previewValue}>{selectedType.capacity ? `${selectedType.capacity} Guests` : 'N/A'}</span>
                        </div>
                        <div className={styles.previewItem}>
                          <span className={styles.previewLabel}>Price / Night</span>
                          <span className={styles.previewValue}>₹{Number(selectedType.price).toLocaleString('en-IN')}</span>
                        </div>
                        <div className={styles.previewItem}>
                          <span className={styles.previewLabel}>Bed Type</span>
                          <span className={styles.previewValue}>{selectedType.bed_type || 'N/A'}</span>
                        </div>
                        <div className={styles.previewItem}>
                          <span className={styles.previewLabel}>Taxes</span>
                          <span className={styles.previewValue}>
                            {selectedType.taxes ? `₹${parseFloat(selectedType.taxes).toLocaleString('en-IN')}` : '₹0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.addModalFooter}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveBtn} disabled={editLoading}>
                    {editLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIconContainer} ${styles.iconTotal}`}>
            <FontAwesomeIcon icon={faDoorOpen} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalRooms}</span>
            <span className={styles.statLabel}>Total Rooms</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconContainer} ${styles.iconAvailable}`}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{availableRoomsCount}</span>
            <span className={styles.statLabel}>Available</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconContainer} ${styles.iconBooked}`}>
            <FontAwesomeIcon icon={faBed} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{bookedRoomsCount}</span>
            <span className={styles.statLabel}>Occupied/Booked</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconContainer} ${styles.iconMaintenance}`}>
            <FontAwesomeIcon icon={faWrench} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{maintenanceRoomsCount}</span>
            <span className={styles.statLabel}>Maintenance</span>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className={styles.mainCard}>
        {/* Navigation Tabs */}
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'rooms' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            <FontAwesomeIcon icon={faDoorOpen} />
            Room Status & Details
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'bookings' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
            Customer Bookings
          </button>
        </div>

        {/* Dynamic content */}
        {activeTab === 'rooms' ? (
          <>
            {/* Search row */}
            <div className={styles.controlsHeader}>
              <div className={styles.searchBox}>
                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                <input 
                  type="text" 
                  className={styles.searchInput}
                  placeholder="Search by Room number or Type..."
                  value={roomSearch}
                  onChange={(e) => setRoomSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Rooms Table */}
            <div className={styles.tableContainer}>
              {paginatedRooms.length > 0 ? (
                <table className={styles.customTable}>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Image</th>
                      <th>Room Number</th>
                      <th>Room Type</th>
                      <th>Capacity</th>
                      <th>Price / Night</th>
                      <th>Taxes</th>
                      <th>Current Occupancy</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRooms.map((room, idx) => {
                      const activeStay = getActiveStay(room.id);
                      const firstImg = room.room_images?.split(',')[0]?.trim();
                      return (
                        <tr key={room.id}>
                          <td>{(roomsPage - 1) * entriesPerPage + idx + 1}</td>
                          <td>
                            {firstImg ? (
                              <img
                                src={firstImg}
                                alt={`Room ${room.room_number}`}
                                className={styles.roomThumb}
                                onError={e => { e.target.src = ''; e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div className={styles.tableNoImage}>No Image</div>
                            )}
                          </td>
                          <td style={{ fontWeight: '700' }}>Room {room.room_number}</td>
                          <td>{room.room_type_name || room.room_type?.name || 'N/A'}</td>
                          <td>{room.capacity || room.room_type?.capacity || 'N/A'} Guests</td>
                          <td>₹ {(parseFloat(room.room_type_price || room.room_type?.price) || 0).toLocaleString('en-IN')}</td>
                          <td>₹ {(parseFloat(room.taxes || room.room_type?.taxes) || 0).toLocaleString('en-IN')}</td>
                          <td>
                            {activeStay ? (
                              <div className={styles.guestStayInfo}>
                                <span className={styles.guestName}>{activeStay.customer_name || activeStay.customer?.name || 'Guest'}</span>
                                <span className={styles.stayDates}>
                                  <FontAwesomeIcon icon={faCalendarAlt} />
                                  {' '}{activeStay.check_in} to {activeStay.check_out}
                                </span>
                              </div>
                            ) : (
                              <span style={{ color: '#aaa', fontSize: '13px' }}>—</span>
                            )}
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${
                              room.status === 'available' ? styles.badgeAvailable :
                              room.status === 'maintenance' ? styles.badgeMaintenance : styles.badgeBooked
                            }`}>
                              {room.status === 'available' ? 'AVAILABLE' : room.status === 'maintenance' ? 'MAINTENANCE' : 'BOOKED'}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionsCell}>
                              {/* Edit */}
                              <button
                                className={styles.editBtn}
                                onClick={() => openEditModal(room)}
                                title="Edit Room"
                              >
                                Edit
                              </button>

                              {/* Maintenance toggle */}
                              {room.status === 'booked' ? (
                                <button className={styles.toggleBtn} disabled title="Occupied rooms cannot be set to maintenance.">
                                  <FontAwesomeIcon icon={faInfoCircle} />
                                  Occupied
                                </button>
                              ) : (
                                <button
                                  className={`${styles.toggleBtn} ${
                                    room.status === 'maintenance' ? styles.toggleAvailable : styles.toggleMaintenance
                                  }`}
                                  onClick={() => handleToggleStatus(room)}
                                  disabled={updatingId === room.id}
                                >
                                  <FontAwesomeIcon icon={room.status === 'maintenance' ? faCheckCircle : faWrench} />
                                  {room.status === 'maintenance' ? 'Set Available' : 'Set Maintenance'}
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteRoom(room)}
                                title="Delete Room"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className={styles.noDataContainer}>
                  <FontAwesomeIcon icon={faInfoCircle} className={styles.noDataIcon} />
                  <p>No room units found matching your search.</p>
                </div>
              )}
            </div>
            
            {/* Rooms Table Pagination */}
            <div className={styles.paginationContainer}>
              <div className={styles.paginationInfo}>
                Showing {filteredRooms.length > 0 ? (roomsPage - 1) * entriesPerPage + 1 : 0} to{" "}
                {Math.min(roomsPage * entriesPerPage, filteredRooms.length)} of {filteredRooms.length} rooms
              </div>
              {totalRoomsPages > 1 && (
                <div className={styles.paginationButtons}>
                  <button 
                    onClick={() => setRoomsPage(roomsPage - 1)} 
                    disabled={roomsPage === 1}
                    className={styles.pageBtn}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalRoomsPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setRoomsPage(p)}
                      className={`${styles.pageBtn} ${roomsPage === p ? styles.pageBtnActive : ''}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    onClick={() => setRoomsPage(roomsPage + 1)} 
                    disabled={roomsPage === totalRoomsPages}
                    className={styles.pageBtn}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Search row */}
            <div className={styles.controlsHeader}>
              <div className={styles.searchBox}>
                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                <input 
                  type="text" 
                  className={styles.searchInput}
                  placeholder="Search by Guest, Email, or Room..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Bookings Table */}
            <div className={styles.tableContainer}>
              {paginatedBookings.length > 0 ? (
                <table className={styles.customTable}>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer Details</th>
                      <th>Room Allocated</th>
                      <th>Stay Period</th>
                      <th>Total Amount Paid</th>
                      <th>Payment Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBookings.map(b => (
                      <tr key={b.id}>
                        <td style={{ fontWeight: '700' }}>#MR-{b.id}</td>
                        <td>
                          <div className={styles.contactInfo}>
                            <span className={styles.guestName}>{b.customer_name || b.customer?.name || 'N/A'}</span>
                            <span className={styles.contactEmail}>
                              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '4px', fontSize: '11px', color: '#888' }} />
                              {b.customer_email || b.customer?.email || '—'}
                            </span>
                            <span className={styles.contactPhone}>
                              <FontAwesomeIcon icon={faPhone} style={{ marginRight: '4px', fontSize: '11px', color: '#888' }} />
                              {b.customer_phone || b.customer?.phone || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600' }}>Room {b.room_number || b.room_unit?.room_number || 'N/A'}</span>
                            <span style={{ fontSize: '12px', color: '#666' }}>{b.room_type_name || b.room_unit?.room_type?.name || ''}</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.guestStayInfo}>
                            <span className={styles.stayDates}>
                              {b.check_in}
                              <FontAwesomeIcon icon={faArrowRight} style={{ margin: '0 4px', fontSize: '10px' }} />
                              {b.check_out}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontWeight: '600', color: '#008746' }}>
                          ₹ {(parseFloat(b.total_price) || 0).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${
                            b.status === 'confirmed' ? styles.badgeAvailable :
                            b.status === 'cancelled' ? styles.badgeCancelled : styles.badgeMaintenance
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: '#666' }}>
                          {b.created_at ? new Date(b.created_at).toLocaleString('en-IN') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.noDataContainer}>
                  <FontAwesomeIcon icon={faInfoCircle} className={styles.noDataIcon} />
                  <p>No customer bookings found matching your search.</p>
                </div>
              )}
            </div>
            
            {/* Bookings Table Pagination */}
            <div className={styles.paginationContainer}>
              <div className={styles.paginationInfo}>
                Showing {filteredBookings.length > 0 ? (bookingsPage - 1) * entriesPerPage + 1 : 0} to{" "}
                {Math.min(bookingsPage * entriesPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
              </div>
              {totalBookingsPages > 1 && (
                <div className={styles.paginationButtons}>
                  <button 
                    onClick={() => setBookingsPage(bookingsPage - 1)} 
                    disabled={bookingsPage === 1}
                    className={styles.pageBtn}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalBookingsPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setBookingsPage(p)}
                      className={`${styles.pageBtn} ${bookingsPage === p ? styles.pageBtnActive : ''}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    onClick={() => setBookingsPage(bookingsPage + 1)} 
                    disabled={bookingsPage === totalBookingsPages}
                    className={styles.pageBtn}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Roommaintenance;
