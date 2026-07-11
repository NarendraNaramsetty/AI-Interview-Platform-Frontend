import React, { useState, useEffect } from 'react';
import styles from './DiningReport.module.css';
import ApiService from '../../service/Apiservice';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DiningReport = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [orderType, setOrderType] = useState('all');
  const [orderStatus, setOrderStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Aggregated Stats
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    dining_count: 0,
    room_service_count: 0,
    average_order_value: 0,
    top_items: []
  });

  const fetchDiningReport = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm,
        order_type: orderType,
        order_status: orderStatus,
        payment_status: paymentStatus,
        start_date: startDate || null,
        end_date: endDate || null
      };

      const response = await ApiService.getDiningReportDataTable(payload);
      if (response.data?.status === 'success') {
        setOrders(response.data.data || []);
        setTotalRecords(response.data.total_records || 0);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } else {
        toast.error('Failed to fetch dining report');
      }
    } catch (error) {
      console.error('Error fetching dining reports:', error);
      toast.error('Error fetching dining reports');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDiningReport();
  }, [currentPage, entriesPerPage, orderType, orderStatus, paymentStatus, startDate, endDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDiningReport();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setOrderType('all');
    setOrderStatus('all');
    setPaymentStatus('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (orders.length === 0) {
      toast.warning("No data available to export");
      return;
    }
    const exportData = orders.map((o, idx) => ({
      "S.No": (currentPage - 1) * entriesPerPage + idx + 1,
      "Order ID": o.order_id,
      "Guest Name": o.guest_name,
      "Phone": o.guest_phone,
      "Location": o.location,
      "Order Type": o.order_type,
      "Order Status": o.order_status,
      "Payment Status": o.payment_status,
      "Total Amount (INR)": o.total_amount,
      "Order Date": o.order_date
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dining_Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `Dining_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
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
          <h2 className={styles.title}>Dining Report</h2>
          <p className={styles.subtitle}>Restaurant sales, dine-in occupancy, room service demand, and popular dishes</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryButton} onClick={handleExport}>
            💾 Export Excel
          </button>
        </div>
      </div>

      {/* KPI Cards & Top Items */}
      <div className={styles.statsLayout}>
        <div className={styles.statsCardsCol}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Food Orders</span>
              <span className={styles.statValue}>{stats.total_orders}</span>
              <span className={styles.statSub}>Transactions logs</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Food Revenue</span>
              <span className={`${styles.statValue} ${styles.greenText}`}>₹{stats.total_revenue.toLocaleString('en-IN')}</span>
              <span className={styles.statSub}>Completed payments</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Dine-in vs Room Service</span>
              <div className={styles.statusSummary}>
                <span className={styles.statusIndicator}>🍽️ Dine-in: <b>{stats.dining_count}</b></span>
                <span className={styles.statusIndicator}>🚪 Room Service: <b>{stats.room_service_count}</b></span>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Average Ticket</span>
              <span className={styles.statValue}>₹{stats.average_order_value.toLocaleString('en-IN')}</span>
              <span className={styles.statSub}>Avg completed order total</span>
            </div>
          </div>
        </div>

        {/* Top Items Table */}
        <div className={styles.topItemsCard}>
          <h3 className={styles.cardTitle}>🔥 Top Selling Dishes</h3>
          {stats.top_items && stats.top_items.length > 0 ? (
            <div className={styles.topItemsList}>
              {stats.top_items.map((item, idx) => (
                <div className={styles.topItemRow} key={idx}>
                  <span className={styles.topItemRank}>{idx + 1}</span>
                  <span className={styles.topItemName}>{item.item_name}</span>
                  <span className={styles.topItemQty}>{item.quantity} orders</span>
                  <span className={styles.topItemSales}>₹{item.sales.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyTopItems}>No items data available.</div>
          )}
        </div>
      </div>

      {/* Filters Area */}
      <div className={styles.filterSection}>
        <form onSubmit={handleSearch} className={styles.filterForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Search Order</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search order ID, guest, table..."
                className={styles.searchInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Service Type</label>
              <select value={orderType} onChange={(e) => { setOrderType(e.target.value); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="all">All Services</option>
                <option value="Dining">Dining (Dine-in)</option>
                <option value="Room Service">Room Service</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Order Status</label>
              <select value={orderStatus} onChange={(e) => { setOrderStatus(e.target.value); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="all">All status</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Served">Served</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Payment Status</label>
              <select value={paymentStatus} onChange={(e) => { setPaymentStatus(e.target.value); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="all">All Payments</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Charged to Room">Charged to Room</option>
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
          <div className={styles.loadingText}>Fetching food order logs...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.table_head}>S.No</th>
                  <th className={styles.table_head}>Order ID</th>
                  <th className={styles.table_head}>Guest</th>
                  <th className={styles.table_head}>Phone</th>
                  <th className={styles.table_head}>Location</th>
                  <th className={styles.table_head}>Service</th>
                  <th className={styles.table_head}>Order Status</th>
                  <th className={styles.table_head}>Payment Status</th>
                  <th className={styles.table_head}>Total Amount</th>
                  <th className={styles.table_head}>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="10" className={styles.emptyRow}>No food orders found.</td>
                  </tr>
                ) : (
                  orders.map((o, index) => (
                    <tr key={o.order_id}>
                      <td className={styles.serialNumber}>
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className={styles.textBold}>Order #{o.order_id}</td>
                      <td className={styles.textBold}>{o.guest_name}</td>
                      <td>{o.guest_phone}</td>
                      <td>{o.location}</td>
                      <td>
                        <span className={`${styles.typeBadge} ${o.order_type === 'Dining' ? styles.roomType : styles.diningType}`}>
                          {o.order_type}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[o.order_status.toLowerCase()] || ''}`}>
                          {o.order_status}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.paymentBadge} ${o.payment_status === 'Paid' ? styles.completed : styles.pending}`}>
                          {o.payment_status}
                        </span>
                      </td>
                      <td className={styles.amountText}>₹{o.total_amount ? o.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</td>
                      <td className={styles.dateCell}>{o.order_date}</td>
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

export default DiningReport;
