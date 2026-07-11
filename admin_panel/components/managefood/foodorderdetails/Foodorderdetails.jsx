import React, { useState, useEffect } from 'react';
import styles from './Foodorderdetails.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faBed, faCheckCircle, faWrench, faCalendarAlt, 
  faUser, faEnvelope, faPhone, faInfoCircle, faArrowRight,
  faDoorOpen, faExchangeAlt
} from "@fortawesome/free-solid-svg-icons";
import PageLoader from '../../common/PageLoader.jsx';
import Swal from 'sweetalert2';

const Foodorderdetails = () => {
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'bookings'
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Search & Filter states
  const [roomSearch, setRoomSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');

  // Pagination states
  const [roomsPage, setRoomsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const entriesPerPage = 10;

  // Reset pagination on search
  useEffect(() => {
    setRoomsPage(1);
  }, [roomSearch]);

  useEffect(() => {
    setBookingsPage(1);
  }, [bookingSearch]);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch room units
      const roomsRes = await api.get('room-units/');
      setRooms(roomsRes.data || []);

      // Fetch bookings
      const bookingsRes = await api.get('bookings/');
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error("Error fetching rooms/bookings data:", error);
      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Status counters
  const totalRooms = rooms.length;
  const bookedRoomsCount = rooms.filter(r => r.status === 'booked').length;
  const availableRoomsCount = rooms.filter(r => r.status === 'available').length;
  const maintenanceRoomsCount = rooms.filter(r => r.status === 'maintenance').length;

  // Toggle Room Maintenance status
  const handleToggleStatus = async (room) => {
    const isCurrentlyMaintenance = room.status === 'maintenance';
    const targetStatus = isCurrentlyMaintenance ? 'available' : 'maintenance';

    const result = await Swal.fire({
      title: isCurrentlyMaintenance ? 'Set Room Available?' : 'Set Under Maintenance?',
      text: isCurrentlyMaintenance 
        ? `Are you sure you want to set Room ${room.room_number} to Available status?`
        : `Are you sure you want to mark Room ${room.room_number} as Under Maintenance?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#008746',
      cancelButtonColor: '#d33',
      confirmButtonText: isCurrentlyMaintenance ? 'Yes, Available' : 'Yes, Maintenance'
    });

    if (result.isConfirmed) {
      setUpdatingId(room.id);
      try {
        const response = await api.patch(`room-units/${room.id}/toggle_status/`, {
          status: targetStatus
        });
        if (response.data?.status === 'success') {
          toast.success(response.data?.message || "Room status updated successfully");
          // Refresh list locally
          setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: targetStatus } : r));
        } else {
          throw new Error(response.data?.message || "Failed to toggle room status");
        }
      } catch (error) {
        console.error("Error toggling room status:", error);
        toast.error(error.message || "Failed to update room status");
      } finally {
        setUpdatingId(null);
      }
    }
  };

  // Find active booking for a room unit
  const getActiveStay = (roomUnitId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    // Find confirmed bookings covering today or the most recent upcoming booking
    const activeBooking = bookings.find(b => 
      b.room_unit?.id === roomUnitId && 
      b.status === 'confirmed'
    );
    return activeBooking;
  };

  // Filtered lists
  const filteredRooms = rooms.filter(r => {
    const searchLower = roomSearch.toLowerCase();
    const roomNum = r.room_number ? r.room_number.toLowerCase() : '';
    const roomType = r.room_type?.name ? r.room_type.name.toLowerCase() : '';
    return roomNum.includes(searchLower) || roomType.includes(searchLower);
  });

  const filteredBookings = bookings.filter(b => {
    const searchLower = bookingSearch.toLowerCase();
    const guestName = b.customer?.name ? b.customer.name.toLowerCase() : '';
    const guestEmail = b.customer?.email ? b.customer.email.toLowerCase() : '';
    const roomNum = b.room_unit?.room_number ? b.room_unit.room_number.toLowerCase() : '';
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

  const formatDateString = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

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
        <button className={styles.actionButton} onClick={fetchData}>
          <FontAwesomeIcon icon={faExchangeAlt} spin={updatingId !== null} />
          Refresh Data
        </button>
      </div>

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
                    {paginatedRooms.map(room => {
                      const activeStay = getActiveStay(room.id);
                      return (
                        <tr key={room.id}>
                          <td style={{ fontWeight: '700' }}>Room {room.room_number}</td>
                          <td>{room.room_type?.name || 'N/A'}</td>
                          <td>{room.room_type?.capacity || 'N/A'} Guests</td>
                          <td>₹ {(parseFloat(room.room_type?.price) || 0).toLocaleString('en-IN')}</td>
                          <td>₹ {(parseFloat(room.room_type?.taxes) || 0).toLocaleString('en-IN')}</td>
                          <td>
                            {room.status === 'booked' && activeStay ? (
                              <div className={styles.guestStayInfo}>
                                <span className={styles.guestName}>{activeStay.customer?.name || 'Guest'}</span>
                                <span className={styles.stayDates}>
                                  <FontAwesomeIcon icon={faCalendarAlt} />
                                  {formatDateString(activeStay.check_in)} to {formatDateString(activeStay.check_out)}
                                </span>
                              </div>
                            ) : (
                              <span style={{ color: '#aaa', fontSize: '13px' }}>—</span>
                            )}
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${
                              room.status === 'available' ? styles.badgeAvailable :
                              room.status === 'booked' ? styles.badgeBooked : styles.badgeMaintenance
                            }`}>
                              {room.status}
                            </span>
                          </td>
                          <td>
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
                            <span className={styles.guestName}>{b.customer?.name || 'N/A'}</span>
                            <span className={styles.contactEmail}>
                              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '4px', fontSize: '11px', color: '#888' }} />
                              {b.customer?.email}
                            </span>
                            <span className={styles.contactPhone}>
                              <FontAwesomeIcon icon={faPhone} style={{ marginRight: '4px', fontSize: '11px', color: '#888' }} />
                              {b.customer?.phone || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: '600' }}>Room {b.room_unit?.room_number || 'N/A'}</span>
                            <span style={{ fontSize: '12px', color: '#666' }}>{b.room_unit?.room_type?.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.guestStayInfo}>
                            <span className={styles.stayDates}>
                              {formatDateString(b.check_in)}
                              <FontAwesomeIcon icon={faArrowRight} style={{ margin: '0 4px', fontSize: '10px' }} />
                              {formatDateString(b.check_out)}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontWeight: '600', color: '#008746' }}>
                          ₹ {(parseFloat(b.total_price) || 0).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${
                            b.status === 'confirmed' ? styles.badgeAvailable : styles.badgeCancelled
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

export default Foodorderdetails;
