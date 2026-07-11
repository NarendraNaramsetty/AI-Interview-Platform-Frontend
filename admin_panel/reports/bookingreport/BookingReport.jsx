import React, { useState, useEffect } from 'react';
import styles from './BookingReport.module.css';
import ApiService from '../../service/Apiservice';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const BookingReport = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [bookingStatus, setBookingStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Aggregated Stats
  const [stats, setStats] = useState({
    total_bookings: 0,
    confirmed_count: 0,
    cancelled_count: 0,
    total_revenue: 0,
    avg_stay_duration: 0,
    room_type_popularity: {}
  });

  const fetchBookingReport = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm,
        booking_status: bookingStatus,
        start_date: startDate || null,
        end_date: endDate || null
      };

      const response = await ApiService.getBookingReportDataTable(payload);
      if (response.data?.status === 'success') {
        setBookings(response.data.data || []);
        setTotalRecords(response.data.total_records || 0);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } else {
        toast.error('Failed to fetch booking report');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error fetching bookings');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookingReport();
  }, [currentPage, entriesPerPage, bookingStatus, startDate, endDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBookingReport();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setBookingStatus('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (bookings.length === 0) {
      toast.warning("No data available to export");
      return;
    }
    const exportData = bookings.map((b, idx) => ({
      "S.No": (currentPage - 1) * entriesPerPage + idx + 1,
      "Booking ID": b.id,
      "Customer Name": b.customer_name,
      "Contact Info": b.customer_contact,
      "Room Number": b.room_number,
      "Room Type": b.room_type,
      "Check In": b.check_in,
      "Check Out": b.check_out,
      "Nights": b.nights,
      "Total Price (INR)": b.total_price,
      "Status": b.status,
      "Booked Date": b.created_at
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings_Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `Booking_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
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
          <h2 className={styles.title}>Booking Report</h2>
          <p className={styles.subtitle}>Detailed analysis of reservations, room allocations, and check-ins</p>
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
          <span className={styles.statLabel}>Total Bookings</span>
          <span className={styles.statValue}>{stats.total_bookings}</span>
          <span className={styles.statSub}>Reservations placed</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Revenue</span>
          <span className={`${styles.statValue} ${styles.greenText}`}>₹{stats.total_revenue.toLocaleString('en-IN')}</span>
          <span className={styles.statSub}>Confirmed bookings value</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Booking Status</span>
          <div className={styles.statusSummary}>
            <span className={styles.statusIndicator}><b className={styles.greenText}>{stats.confirmed_count}</b> Confirmed</span>
            <span className={styles.statusIndicator}><b className={styles.redText}>{stats.cancelled_count}</b> Cancelled</span>
          </div>
        </div>
      </div>

      {/* Filters Area */}
      <div className={styles.filterSection}>
        <form onSubmit={handleSearch} className={styles.filterForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Search Reservation</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search booking ID, customer, room..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select value={bookingStatus} onChange={(e) => { setBookingStatus(e.target.value); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="all">All status</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Start Check-In Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                className={styles.dateInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>End Check-In Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                className={styles.dateInput}
              />
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
          <div className={styles.loadingText}>Fetching reservation logs...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.table_head}>S.No</th>
                  <th className={styles.table_head}>Booking ID</th>
                  <th className={styles.table_head}>Customer</th>
                  <th className={styles.table_head}>Contact Info</th>
                  <th className={styles.table_head}>Room No</th>
                  <th className={styles.table_head}>Room Type</th>
                  <th className={styles.table_head}>Check In</th>
                  <th className={styles.table_head}>Check Out</th>
                  <th className={styles.table_head}>Nights</th>
                  <th className={styles.table_head}>Total Price</th>
                  <th className={styles.table_head}>Status</th>
                  <th className={styles.table_head}>Booked Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="12" className={styles.emptyRow}>No reservation records found.</td>
                  </tr>
                ) : (
                  bookings.map((b, index) => (
                    <tr key={b.id}>
                      <td className={styles.serialNumber}>
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className={styles.textBold}>#{b.id}</td>
                      <td className={styles.textBold}>{b.customer_name}</td>
                      <td>{b.customer_contact}</td>
                      <td className={styles.textCenter}>{b.room_number}</td>
                      <td>{b.room_type}</td>
                      <td>{b.check_in}</td>
                      <td>{b.check_out}</td>
                      <td className={styles.textCenter}>{b.nights}</td>
                      <td className={styles.amountText}>₹{b.total_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${b.status.toLowerCase() === 'confirmed' ? styles.confirmed : styles.cancelled}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className={styles.dateCell}>{b.created_at}</td>
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

export default BookingReport;
