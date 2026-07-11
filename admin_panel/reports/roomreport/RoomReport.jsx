import React, { useState, useEffect } from 'react';
import styles from './RoomReport.module.css';
import ApiService from '../../service/Apiservice';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const RoomReport = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [roomType, setRoomType] = useState('all');
  const [roomStatus, setRoomStatus] = useState('all');

  // Aggregated Stats
  const [stats, setStats] = useState({
    total_rooms: 0,
    available_rooms: 0,
    maintenance_rooms: 0,
    average_occupancy_rate: 0,
    total_revenue: 0
  });

  const fetchRoomTypes = async () => {
    try {
      const response = await ApiService.getAllRoomTypes();
      if (response.data?.status === 'success') {
        setRoomTypes(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const fetchRoomReport = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm,
        room_type: roomType,
        room_status: roomStatus
      };

      const response = await ApiService.getRoomReportDataTable(payload);
      if (response.data?.status === 'success') {
        setRooms(response.data.data || []);
        setTotalRecords(response.data.total_records || 0);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } else {
        toast.error('Failed to fetch room report');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Error fetching rooms');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    fetchRoomReport();
  }, [currentPage, entriesPerPage, roomType, roomStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRoomReport();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setRoomType('all');
    setRoomStatus('all');
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (rooms.length === 0) {
      toast.warning("No data available to export");
      return;
    }
    const exportData = rooms.map((r, idx) => ({
      "S.No": (currentPage - 1) * entriesPerPage + idx + 1,
      "Room Number": r.room_number,
      "Room Type": r.room_type,
      "Base Price (INR)": r.price,
      "Status": r.status,
      "Total Bookings": r.booking_count,
      "Revenue Generated (INR)": r.revenue,
      "Est Occupancy (30 Days)": `${r.occupancy_rate_30d}%`
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rooms_Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `Room_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel exported successfully!");
  };

  const totalPages = Math.ceil(totalRecords / entriesPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) {
      if (i > 0) pages.push(i);
    }
    return pages;
  };

  return (
    <div className={styles.container}>
      <ToastContainer theme="colored" />
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Room Report</h2>
          <p className={styles.subtitle}>Analysis of room status, occupancy cycles, and room type revenue generation</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryButton} onClick={handleExport}>
            💾 Export Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Rooms</span>
          <span className={styles.statValue}>{stats.total_rooms}</span>
          <span className={styles.statSub}>Physical inventory</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Occupancy Rate (30d)</span>
          <span className={`${styles.statValue} ${styles.blueText}`}>{stats.average_occupancy_rate}%</span>
          <span className={styles.statSub}>Avg active room use</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Room Revenue</span>
          <span className={`${styles.statValue} ${styles.greenText}`}>₹{stats.total_revenue.toLocaleString('en-IN')}</span>
          <span className={styles.statSub}>Lifetime room sales</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Room Inventory Status</span>
          <div className={styles.statusSummary}>
            <span className={styles.statusIndicator}><b className={styles.greenText}>{stats.available_rooms}</b> Ready</span>
            <span className={styles.statusIndicator}><b className={styles.orangeText}>{stats.maintenance_rooms}</b> Maintenance</span>
          </div>
        </div>
      </div>

      {/* Filters Area */}
      <div className={styles.filterSection}>
        <form onSubmit={handleSearch} className={styles.filterForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Search Room Number</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search room number..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Room Type</label>
              <select value={roomType} onChange={(e) => { setRoomType(e.target.value); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="all">All Types</option>
                {roomTypes.map((t) => (
                  <option key={t.id_roomtype || t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Room Status</label>
              <select value={roomStatus} onChange={(e) => { setRoomStatus(e.target.value); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="all">All status</option>
                <option value="available">Available</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.searchButton}>Search</button>
              <button type="button" onClick={handleResetFilters} className={styles.resetButton}>Reset</button>
            </div>
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingText}>Fetching inventory logs...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.table_head}>S.No</th>
                  <th className={styles.table_head}>Room Number</th>
                  <th className={styles.table_head}>Room Type</th>
                  <th className={styles.table_head}>Base Price</th>
                  <th className={styles.table_head}>Current Status</th>
                  <th className={styles.table_head}>Total Bookings</th>
                  <th className={styles.table_head}>Lifetime Revenue</th>
                  <th className={styles.table_head}>Est Occupancy (30d)</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="8" className={styles.emptyRow}>No room records found.</td>
                  </tr>
                ) : (
                  rooms.map((r, index) => (
                    <tr key={r.id}>
                      <td className={styles.serialNumber}>
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className={styles.textBold}>Room {r.room_number}</td>
                      <td>{r.room_type}</td>
                      <td>₹{r.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${r.status.toLowerCase() === 'available' ? styles.statusAvailable : styles.statusMaintenance}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className={styles.textCenter}>{r.booking_count}</td>
                      <td className={styles.amountText}>₹{r.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>
                        <div className={styles.progressContainer}>
                          <div className={styles.progressBar} style={{ width: `${r.occupancy_rate_30d}%` }}></div>
                          <span className={styles.progressLabel}>{r.occupancy_rate_30d}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Table Footer with Pagination */}
            {totalPages > 0 && (
              <div className={styles.tableFooter}>
                <div className={styles.pageInfo}>
                  Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} entries
                </div>
                <div className={styles.pagination}>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                  >
                    Prev
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
                  <span>Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => { setEntriesPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                    className={styles.entriesSelect}
                  >
                    {[10, 25, 50, 100].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span>entries</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomReport;
