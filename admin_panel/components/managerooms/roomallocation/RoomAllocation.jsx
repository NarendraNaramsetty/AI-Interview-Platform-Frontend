import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RoomAllocation.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBed, faUser, faCalendarAlt, faDoorOpen, 
  faCheckCircle, faExchangeAlt, faSearch, faFilter
} from "@fortawesome/free-solid-svg-icons";

const RoomAllocation = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => { 
    localStorage.clear();
    sessionStorage.clear();
    toast.info("You have been logged out", { autoClose: 1000 });
    navigate("/adminlogin");
  };

  const [roomUnits, setRoomUnits] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRooms, setTotalRooms] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [assignFormData, setAssignFormData] = useState({
    room_type_id: '',
    room_number: '',
    status: 'available'
  });

  // Fetch room units
  const fetchRoomUnits = async () => {
    setLoading(true);

    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm
      };

      if (statusFilter !== 'all') {
        payload.status = statusFilter;
      }

      if (roomTypeFilter) {
        payload.room_type_id = roomTypeFilter;
      }

      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.getRoomUnitDataTable(payload);
      const data = response.data;

      if (data.status === "success") {
        setRoomUnits(data.data || []);
        setTotalRooms(data.total_records);
      } else {
        toast.error(data.message || "Failed to load room units");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(error);
      toast.error("❌ Error fetching room units");
    }

    setLoading(false);
  };

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
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    fetchRoomUnits();
  }, [searchTerm, statusFilter, roomTypeFilter, currentPage, entriesPerPage]);

  const handleAssignRoom = (room) => {
    setSelectedRoom(room);
    setAssignFormData({
      room_type_id: room.room_type_id,
      room_number: room.room_number,
      status: room.status
    });
    setShowAssignModal(true);
  };

  const handleSubmitAssign = async (e) => {
    e.preventDefault();

    const payload = {
      room_type_id: parseInt(assignFormData.room_type_id),
      room_number: assignFormData.room_number,
      status: assignFormData.status
    };

    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.updateRoomUnit(selectedRoom.id, payload);
      const data = response.data;

      if (data.status === "success") {
        toast.success("✅ Room updated successfully!");
        fetchRoomUnits();
        handleCloseModal();
      } else {
        toast.error(data.message || "⚠️ Failed to update room.");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error("Room update error:", error);
      toast.error("❌ Something went wrong while updating room.");
    }
  };

  const handleToggleStatus = async (room) => {
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.toggleRoomUnitStatus(room.id);
      const data = response.data;

      if (data.status === "success") {
        toast.success(`✅ Room ${room.room_number} status updated!`);
        fetchRoomUnits();
      } else {
        toast.error(data.message || "Failed to toggle status");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(error);
      toast.error("❌ Error toggling status");
    }
  };

  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedRoom(null);
    setAssignFormData({
      room_type_id: '',
      room_number: '',
      status: 'available'
    });
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalRooms / entriesPerPage);

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
    if (status === 'available') {
      return <span className={styles.availableBadge}><FontAwesomeIcon icon={faCheckCircle} /> Available</span>;
    } else {
      return <span className={styles.maintenanceBadge}><FontAwesomeIcon icon={faExchangeAlt} /> Maintenance</span>;
    }
  };

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
            <FontAwesomeIcon icon={faDoorOpen} /> Room Allocation & Management
          </h2>
          <p className={styles.subtitle}>Manage room assignments and status</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.userBadge}>Admin</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersCard}>
        <div className={styles.filterRow}>
          <div className={styles.searchBox}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by room number..."
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
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <FontAwesomeIcon icon={faBed} className={styles.filterIcon} />
            <select
              className={styles.filterSelect}
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
            >
              <option value="">All Room Types</option>
              {roomTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#3498db' }}>
            <FontAwesomeIcon icon={faDoorOpen} />
          </div>
          <div className={styles.statInfo}>
            <h3>{totalRooms}</h3>
            <p>Total Rooms</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#27ae60' }}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className={styles.statInfo}>
            <h3>{roomUnits.filter(r => r.status === 'available').length}</h3>
            <p>Available</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f39c12' }}>
            <FontAwesomeIcon icon={faExchangeAlt} />
          </div>
          <div className={styles.statInfo}>
            <h3>{roomUnits.filter(r => r.status === 'maintenance').length}</h3>
            <p>Maintenance</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading rooms...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className="table table-bordered table-hover mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th className={styles.table_head}>S.No</th>
                <th className={styles.table_head}>Room Number</th>
                <th className={styles.table_head}>Room Type</th>
                <th className={styles.table_head}>Price</th>
                <th className={styles.table_head}>Status</th>
                <th className={styles.table_head}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomUnits.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyRow}>No rooms found.</td>
                </tr>
              ) : (
                roomUnits.map((room, index) => (
                  <tr key={room.id}>
                    <td className={styles.serialNumber}>
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className={styles.roomNumberCell}>
                      <strong>{room.room_number}</strong>
                    </td>
                    <td className={styles.roomTypeCell}>
                      {room.room_type_name}
                    </td>
                    <td className={styles.priceCell}>
                      ₹{parseFloat(room.room_type_price).toFixed(2)}
                    </td>
                    <td className={styles.statusCell}>
                      {getStatusBadge(room.status)}
                    </td>
                    <td className={styles.actionsCell}>
                      <button 
                        className={styles.editButton} 
                        onClick={() => handleAssignRoom(room)}
                      >
                        <FontAwesomeIcon icon={faExchangeAlt} /> Reassign
                      </button>
                      <button 
                        className={styles.toggleButton} 
                        onClick={() => handleToggleStatus(room)}
                      >
                        Toggle Status
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
              Showing {(roomUnits.length > 0) ? ((currentPage - 1) * entriesPerPage + 1) : 0} to{" "}
              {Math.min(currentPage * entriesPerPage, totalRooms)} of {totalRooms} entries
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

      {/* Assign/Reassign Modal */}
      {showAssignModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <FontAwesomeIcon icon={faExchangeAlt} /> Reassign Room
              </h3>
              <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmitAssign} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Room Type *</label>
                  <select
                    className={styles.formInput}
                    value={assignFormData.room_type_id}
                    onChange={(e) => setAssignFormData({ ...assignFormData, room_type_id: e.target.value })}
                    required
                  >
                    <option value="">Select Room Type</option>
                    {roomTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - ₹{type.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Room Number *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={assignFormData.room_number}
                    onChange={(e) => setAssignFormData({ ...assignFormData, room_number: e.target.value })}
                    required
                    placeholder="e.g., 101"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status *</label>
                  <select
                    className={styles.formInput}
                    value={assignFormData.status}
                    onChange={(e) => setAssignFormData({ ...assignFormData, status: e.target.value })}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Update Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAllocation;
