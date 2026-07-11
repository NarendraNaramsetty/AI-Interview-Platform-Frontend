import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RoomAvailablity.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, faSearch, faCheckCircle, faTimesCircle,
  faBed, faUsers, faDoorOpen, faChartLine
} from "@fortawesome/free-solid-svg-icons";

const RoomAvailablity = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => { 
    localStorage.clear();
    sessionStorage.clear();
    toast.info("You have been logged out", { autoClose: 1000 });
    navigate("/adminlogin");
  };

  const [activeTab, setActiveTab] = useState('check'); // 'check', 'calendar', 'stats'
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  
  // Check Availability State
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [availabilityResults, setAvailabilityResults] = useState(null);
  
  // Calendar State
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [calendarData, setCalendarData] = useState(null);
  
  // Stats State
  const [statsData, setStatsData] = useState(null);

  const getLocalDateString = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts.map(Number);
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  };

  const today = getLocalDateString();

  const getMinCheckOutDate = () => {
    if (!checkInDate) return today;
    try {
      const d = parseLocalDate(checkInDate);
      if (!d) return today;
      d.setDate(d.getDate() + 1);
      return getLocalDateString(d);
    } catch {
      return today;
    }
  };

  // Fetch room types on mount
  useEffect(() => {
    fetchRoomTypes();
    fetchOccupancyStats();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.getAllRoomTypes();
      const data = response.data;

      if (data.status === "success") {
        setRoomTypes(data.data || []);
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(error);
    }
  };

  const checkAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const payload = {
        check_in: checkInDate,
        check_out: checkOutDate
      };

      if (selectedRoomType) {
        payload.room_type_id = parseInt(selectedRoomType);
      }

      const response = await ApiService.checkRoomAvailability(payload);
      const data = response.data;

      if (data.status === "success") {
        setAvailabilityResults(data.data);
        toast.success("✅ Availability checked successfully!");
      } else {
        toast.error(data.message || "Failed to check availability");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(error);
      toast.error("❌ Error checking availability");
    }

    setLoading(false);
  };

  const fetchCalendarData = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const params = {
        year: calendarYear,
        month: calendarMonth
      };

      if (selectedRoomType) {
        params.room_type_id = selectedRoomType;
      }

      const response = await ApiService.getRoomAvailabilityCalendar(params);
      const data = response.data;

      if (data.status === "success") {
        setCalendarData(data.data);
      } else {
        toast.error(data.message || "Failed to load calendar");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(error);
      toast.error("❌ Error loading calendar");
    }

    setLoading(false);
  };

  const fetchOccupancyStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.getRoomOccupancyStats();
      const data = response.data;

      if (data.status === "success") {
        setStatsData(data.data);
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeTab === 'calendar') {
      fetchCalendarData();
    }
  }, [activeTab, calendarYear, calendarMonth, selectedRoomType]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
          <h2 className={styles.title}>
            <FontAwesomeIcon icon={faCalendarAlt} /> Room Availability
          </h2>
          <p className={styles.subtitle}>Check availability, view calendar, and monitor occupancy</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.userBadge}>Admin</div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'check' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('check')}
        >
          <FontAwesomeIcon icon={faSearch} /> Check Availability
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'calendar' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <FontAwesomeIcon icon={faCalendarAlt} /> Calendar View
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'stats' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <FontAwesomeIcon icon={faChartLine} /> Occupancy Stats
        </button>
      </div>

      {/* Check Availability Tab */}
      {activeTab === 'check' && (
        <div className={styles.tabContent}>
          <div className={styles.checkForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Check-In Date</label>
                <input
                  type="date"
                  className={styles.input}
                  value={checkInDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCheckInDate(val);
                    if (val) {
                      const checkInDateObj = parseLocalDate(val);
                      const checkOutDateObj = parseLocalDate(checkOutDate);
                      if (checkInDateObj && (!checkOutDateObj || checkOutDateObj <= checkInDateObj)) {
                        const nextDay = new Date(checkInDateObj.getFullYear(), checkInDateObj.getMonth(), checkInDateObj.getDate() + 1);
                        setCheckOutDate(getLocalDateString(nextDay));
                      }
                    }
                  }}
                  min={today}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Check-Out Date</label>
                <input
                  type="date"
                  className={styles.input}
                  value={checkOutDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    const checkInDateObj = parseLocalDate(checkInDate);
                    const checkOutDateObj = parseLocalDate(val);
                    if (checkOutDateObj && checkInDateObj && checkOutDateObj <= checkInDateObj) {
                      const nextDay = new Date(checkInDateObj.getFullYear(), checkInDateObj.getMonth(), checkInDateObj.getDate() + 1);
                      setCheckOutDate(getLocalDateString(nextDay));
                    } else {
                      setCheckOutDate(val);
                    }
                  }}
                  min={getMinCheckOutDate()}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Room Type (Optional)</label>
                <select
                  className={styles.input}
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                >
                  <option value="">All Room Types</option>
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>&nbsp;</label>
                <button
                  className={styles.checkButton}
                  onClick={checkAvailability}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faSearch} /> Check Availability
                </button>
              </div>
            </div>
          </div>

          {availabilityResults && (
            <div className={styles.resultsSection}>
              <div className={styles.resultsHeader}>
                <h3>Availability Results</h3>
                <p>
                  {availabilityResults.check_in} to {availabilityResults.check_out} ({availabilityResults.nights} nights)
                </p>
              </div>

              <div className={styles.roomTypeGrid}>
                {availabilityResults.availability.map((room) => (
                  <div key={room.room_type_id} className={styles.roomCard}>
                    <div className={styles.roomCardHeader}>
                      <h4>{room.room_type_name}</h4>
                      {room.is_available ? (
                        <span className={styles.availableBadge}>
                          <FontAwesomeIcon icon={faCheckCircle} /> Available
                        </span>
                      ) : (
                        <span className={styles.unavailableBadge}>
                          <FontAwesomeIcon icon={faTimesCircle} /> Fully Booked
                        </span>
                      )}
                    </div>
                    <div className={styles.roomCardBody}>
                      <p className={styles.roomDescription}>{room.description}</p>
                      <div className={styles.roomDetails}>
                        <div className={styles.detail}>
                          <FontAwesomeIcon icon={faBed} />
                          <span>{room.bed_type}</span>
                        </div>
                        <div className={styles.detail}>
                          <FontAwesomeIcon icon={faUsers} />
                          <span>{room.capacity} Guests</span>
                        </div>
                        <div className={styles.detail}>
                          <span className={styles.price}>₹{parseFloat(room.price).toFixed(2)}/night</span>
                        </div>
                      </div>
                      <div className={styles.availabilityStats}>
                        <div className={styles.stat}>
                          <span className={styles.statLabel}>Total Units</span>
                          <span className={styles.statValue}>{room.total_units}</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statLabel}>Available</span>
                          <span className={`${styles.statValue} ${styles.available}`}>{room.available_units}</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statLabel}>Booked</span>
                          <span className={`${styles.statValue} ${styles.booked}`}>{room.booked_units}</span>
                        </div>
                      </div>
                      {room.available_room_numbers.length > 0 && (
                        <div className={styles.availableRooms}>
                          <strong>Available Rooms:</strong>
                          <div className={styles.roomNumbers}>
                            {room.available_room_numbers.map((r) => (
                              <span key={r.id} className={styles.roomNumber}>
                                {r.room_number}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className={styles.tabContent}>
          <div className={styles.calendarControls}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Room Type</label>
              <select
                className={styles.input}
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
              >
                <option value="">All Room Types</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Month</label>
              <select
                className={styles.input}
                value={calendarMonth}
                onChange={(e) => setCalendarMonth(parseInt(e.target.value))}
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Year</label>
              <select
                className={styles.input}
                value={calendarYear}
                onChange={(e) => setCalendarYear(parseInt(e.target.value))}
              >
                {[2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading calendar...</p>
            </div>
          ) : calendarData ? (
            <div className={styles.calendarSection}>
              {calendarData.calendar.map((roomType) => (
                <div key={roomType.room_type_id} className={styles.calendarCard}>
                  <div className={styles.calendarHeader}>
                    <h4>{roomType.room_type_name}</h4>
                    <span className={styles.priceTag}>₹{roomType.price}/night</span>
                  </div>
                  <div className={styles.calendarGrid}>
                    <div className={styles.calendarDay}>
                      <strong>Date</strong>
                    </div>
                    <div className={styles.calendarDay}>
                      <strong>Available</strong>
                    </div>
                    <div className={styles.calendarDay}>
                      <strong>Booked</strong>
                    </div>
                    <div className={styles.calendarDay}>
                      <strong>Total</strong>
                    </div>
                    {roomType.daily_availability.map((day, index) => (
                      <React.Fragment key={index}>
                        <div className={styles.calendarCell}>
                          {new Date(day.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className={`${styles.calendarCell} ${styles.availableCell}`}>
                          {day.available}
                        </div>
                        <div className={`${styles.calendarCell} ${styles.bookedCell}`}>
                          {day.booked}
                        </div>
                        <div className={styles.calendarCell}>
                          {day.total}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && statsData && (
        <div className={styles.tabContent}>
          <div className={styles.statsOverview}>
            <div className={styles.statsCard}>
              <div className={styles.statsIcon} style={{ background: '#3498db' }}>
                <FontAwesomeIcon icon={faDoorOpen} />
              </div>
              <div className={styles.statsInfo}>
                <h3>{statsData.overall.total_rooms}</h3>
                <p>Total Rooms</p>
              </div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.statsIcon} style={{ background: '#27ae60' }}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div className={styles.statsInfo}>
                <h3>{statsData.overall.available}</h3>
                <p>Available</p>
              </div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.statsIcon} style={{ background: '#e74c3c' }}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
              <div className={styles.statsInfo}>
                <h3>{statsData.overall.occupied}</h3>
                <p>Occupied</p>
              </div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.statsIcon} style={{ background: '#f39c12' }}>
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div className={styles.statsInfo}>
                <h3>{statsData.overall.occupancy_rate}%</h3>
                <p>Occupancy Rate</p>
              </div>
            </div>
          </div>

          <div className={styles.statsTable}>
            <h3>Room Type Breakdown</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>Total Units</th>
                  <th>Available</th>
                  <th>Occupied</th>
                  <th>Maintenance</th>
                  <th>Occupancy Rate</th>
                </tr>
              </thead>
              <tbody>
                {statsData.by_room_type.map((type) => (
                  <tr key={type.room_type_id}>
                    <td><strong>{type.room_type_name}</strong></td>
                    <td>{type.total_units}</td>
                    <td className={styles.availableText}>{type.available}</td>
                    <td className={styles.occupiedText}>{type.occupied}</td>
                    <td className={styles.maintenanceText}>{type.maintenance}</td>
                    <td>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ width: `${type.occupancy_rate}%` }}
                        >
                          {type.occupancy_rate}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAvailablity;
