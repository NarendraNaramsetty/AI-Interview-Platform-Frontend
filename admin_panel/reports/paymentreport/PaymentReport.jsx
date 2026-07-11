import React, { useState, useEffect } from 'react';
import styles from './PaymentReport.module.css';
import ApiService from '../../service/Apiservice';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PaymentReport = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [paymentType, setPaymentType] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Aggregated Stats
  const [stats, setStats] = useState({
    total_revenue: 0,
    room_revenue: 0,
    dining_revenue: 0,
    completed_count: 0,
    pending_count: 0,
    failed_count: 0,
    refunded_count: 0,
    method_breakdown: {}
  });

  const fetchPaymentReport = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm,
        payment_type: paymentType,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        start_date: startDate || null,
        end_date: endDate || null
      };

      const response = await ApiService.getPaymentReportDataTable(payload);
      if (response.data?.status === 'success') {
        setPayments(response.data.data || []);
        setTotalRecords(response.data.total_records || 0);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } else {
        toast.error('Failed to fetch payment report');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Error fetching payments');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentReport();
  }, [currentPage, entriesPerPage, paymentType, paymentMethod, paymentStatus, startDate, endDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPaymentReport();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPaymentType('all');
    setPaymentMethod('all');
    setPaymentStatus('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (payments.length === 0) {
      toast.warning("No data available to export");
      return;
    }
    // Prepare export data
    const exportData = payments.map((p, idx) => ({
      "S.No": (currentPage - 1) * entriesPerPage + idx + 1,
      "Transaction ID": p.transaction_id,
      "Type": p.type,
      "Reference ID": p.reference_id,
      "Customer Name": p.customer_name,
      "Customer Contact": p.customer_contact,
      "Amount (INR)": p.amount,
      "Payment Method": p.payment_method,
      "Status": p.payment_status,
      "Payment Date": p.payment_date
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments_Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `Payment_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
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
          <h2 className={styles.title}>Payment Report</h2>
          <p className={styles.subtitle}>Unified transaction summary for room bookings and dining orders</p>
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
          <span className={styles.statLabel}>Total Revenue</span>
          <span className={`${styles.statValue} ${styles.greenText}`}>₹{stats.total_revenue.toLocaleString('en-IN')}</span>
          <span className={styles.statSub}>All completed payments</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Room Bookings Revenue</span>
          <span className={styles.statValue}>₹{stats.room_revenue.toLocaleString('en-IN')}</span>
          <span className={styles.statSub}>Completed room payments</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Dining Orders Revenue</span>
          <span className={styles.statValue}>₹{stats.dining_revenue.toLocaleString('en-IN')}</span>
          <span className={styles.statSub}>Completed restaurant bills</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Transactions Status</span>
          <div className={styles.statusSummary}>
            <span className={styles.statusIndicator}><b className={styles.greenText}>{stats.completed_count}</b> Paid</span>
            <span className={styles.statusIndicator}><b className={styles.orangeText}>{stats.pending_count}</b> Pending</span>
            <span className={styles.statusIndicator}><b className={styles.redText}>{stats.failed_count}</b> Failed</span>
          </div>
        </div>
      </div>

      {/* Filters Area */}
      <div className={styles.filterSection}>
        <form onSubmit={handleSearch} className={styles.filterForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Search Text</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transaction ID, customer..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Type</label>
              <select value={paymentType} onChange={(e) => { setPaymentType(e.target.value); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="all">All Types</option>
                <option value="room">Room Booking</option>
                <option value="dining">Dining Order</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Method</label>
              <select value={paymentMethod} onChange={(e) => { setPaymentMethod(e.target.value); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="all">All Methods</option>
                <option value="razorpay">Razorpay</option>
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select value={paymentStatus} onChange={(e) => { setPaymentStatus(e.target.value); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="all">All status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                className={styles.dateInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>End Date</label>
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
          <div className={styles.loadingText}>Fetching payment logs...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.table_head}>S.No</th>
                  <th className={styles.table_head}>Transaction ID</th>
                  <th className={styles.table_head}>Type</th>
                  <th className={styles.table_head}>Ref ID</th>
                  <th className={styles.table_head}>Customer</th>
                  <th className={styles.table_head}>Contact</th>
                  <th className={styles.table_head}>Amount</th>
                  <th className={styles.table_head}>Method</th>
                  <th className={styles.table_head}>Status</th>
                  <th className={styles.table_head}>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="10" className={styles.emptyRow}>No payment records found.</td>
                  </tr>
                ) : (
                  payments.map((p, index) => (
                    <tr key={p.id}>
                      <td className={styles.serialNumber}>
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className={styles.textBold}>{p.transaction_id}</td>
                      <td>
                        <span className={`${styles.typeBadge} ${p.type === 'Room Booking' ? styles.roomType : styles.diningType}`}>
                          {p.type}
                        </span>
                      </td>
                      <td>#{p.reference_id}</td>
                      <td className={styles.textBold}>{p.customer_name}</td>
                      <td>{p.customer_contact}</td>
                      <td className={styles.amountText}>₹{p.amount.toFixed(2)}</td>
                      <td>{p.payment_method}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[p.payment_status.toLowerCase()] || ''}`}>
                          {p.payment_status}
                        </span>
                      </td>
                      <td className={styles.dateCell}>{p.payment_date}</td>
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

export default PaymentReport;
