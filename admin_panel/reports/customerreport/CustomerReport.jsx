import React, { useState, useEffect } from 'react';
import styles from './CustomerReport.module.css';
import ApiService from '../../service/Apiservice';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const CustomerReport = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [customerType, setCustomerType] = useState('all');
  const [isActive, setIsActive] = useState('all');

  // Aggregated Stats
  const [stats, setStats] = useState({
    total_customers: 0,
    online_count: 0,
    offline_count: 0,
    average_stays: 0,
    average_spend: 0,
    total_revenue: 0
  });

  const fetchCustomerReport = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm,
        customer_type: customerType,
        is_active: isActive
      };

      const response = await ApiService.getCustomerReportDataTable(payload);
      if (response.data?.status === 'success') {
        setCustomers(response.data.data || []);
        setTotalRecords(response.data.total_records || 0);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } else {
        toast.error('Failed to fetch customer report');
      }
    } catch (error) {
      console.error('Error fetching customer report:', error);
      toast.error('Error fetching customer report');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomerReport();
  }, [currentPage, entriesPerPage, customerType, isActive]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomerReport();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCustomerType('all');
    setIsActive('all');
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (customers.length === 0) {
      toast.warning("No data available to export");
      return;
    }
    const exportData = customers.map((c, idx) => ({
      "S.No": (currentPage - 1) * entriesPerPage + idx + 1,
      "Customer ID": c.id,
      "Name": c.name,
      "Email": c.email,
      "Mobile": c.mobile,
      "Type": c.customer_type,
      "Status": c.status,
      "Stays Count": c.stays_count,
      "Lifetime Spend (INR)": c.total_spend,
      "Registration Date": c.created_at
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers_Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `Customer_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
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
          <h2 className={styles.title}>Customer Report</h2>
          <p className={styles.subtitle}>Demographic analyses, registration trends, staying history, and spending profiles</p>
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
          <span className={styles.statLabel}>Registered Customers</span>
          <span className={styles.statValue}>{stats.total_customers}</span>
          <span className={styles.statSub}>Total guest base</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Registration Sources</span>
          <div className={styles.statusSummary}>
            <span className={styles.statusIndicator}>🌐 Online (Web/App): <b>{stats.online_count}</b></span>
            <span className={styles.statusIndicator}>📝 Offline (Walk-in): <b>{stats.offline_count}</b></span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Avg Spend per Guest</span>
          <span className={`${styles.statValue} ${styles.greenText}`}>₹{stats.average_spend.toLocaleString('en-IN')}</span>
          <span className={styles.statSub}>Lifetime spending avg</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Avg Stays per Guest</span>
          <span className={`${styles.statValue} ${styles.blueText}`}>{stats.average_stays} stays</span>
          <span className={styles.statSub}>Average visit cycles</span>
        </div>
      </div>

      {/* Filters Area */}
      <div className={styles.filterSection}>
        <form onSubmit={handleSearch} className={styles.filterForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Search Customer</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email, mobile..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Registration Type</label>
              <select value={customerType} onChange={(e) => { setCustomerType(e.target.value); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="all">All Sources</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select value={isActive} onChange={(e) => { setIsActive(e.target.value); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
          <div className={styles.loadingText}>Fetching profile logs...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.table_head}>S.No</th>
                  <th className={styles.table_head}>Customer ID</th>
                  <th className={styles.table_head}>Full Name</th>
                  <th className={styles.table_head}>Email</th>
                  <th className={styles.table_head}>Mobile</th>
                  <th className={styles.table_head}>Type</th>
                  <th className={styles.table_head}>Status</th>
                  <th className={styles.table_head}>Stays Count</th>
                  <th className={styles.table_head}>Lifetime Spend</th>
                  <th className={styles.table_head}>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="10" className={styles.emptyRow}>No customer records found.</td>
                  </tr>
                ) : (
                  customers.map((c, index) => (
                    <tr key={c.id}>
                      <td className={styles.serialNumber}>
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className={styles.textBold}>CUST-{c.id}</td>
                      <td className={styles.textBold}>{c.name}</td>
                      <td>{c.email}</td>
                      <td>{c.mobile}</td>
                      <td>
                        <span className={`${styles.typeBadge} ${c.customer_type === 'Online' ? styles.roomType : styles.diningType}`}>
                          {c.customer_type}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${c.status === 'Active' ? styles.statusActive : styles.statusInactive}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className={styles.textCenter}>{c.stays_count}</td>
                      <td className={styles.amountText}>₹{c.total_spend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className={styles.dateCell}>{c.created_at}</td>
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

export default CustomerReport;
