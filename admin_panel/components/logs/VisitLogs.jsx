import React, { useState, useEffect } from 'react';
import styles from './Logs.module.css';
import { toast, ToastContainer } from 'react-toastify';
import ApiService from '../../service/Apiservice.jsx';

const VisitLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await ApiService.post('/api/logs/visit-logs/', {
        page: currentPage,
        length: entriesPerPage,
        search,
        sort_by: '-last_visitdate'
      }, { headers: { 'Authorization': `Bearer ${token}` } });

      if (response.data.status === 'success') {
        setLogs(response.data.results || []);
        setTotalRecords(response.data.total_records);
      } else {
        toast.error(response.data.message || 'Failed to load logs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, entriesPerPage, search]);

  const totalPages = Math.ceil(totalRecords / entriesPerPage);

  const handleClearSearch = () => {
    setSearch('');
    setCurrentPage(1);
  };

  return (
    <div className={styles.logsContainer}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className={styles.header}>
        <h2>Customer Visit Logs</h2>
        <p>Dashboard access and page visit tracking</p>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.filterRow}>
          <input
            type="text"
            placeholder="Search by customer ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />

          <button onClick={handleClearSearch} className={styles.resetBtn}>
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading visit logs...</p>
        </div>
      ) : (
        <>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Visits Tracked</span>
              <span className={styles.statValue}>{totalRecords}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Active Customers</span>
              <span className={styles.statValue}>{logs.length}</span>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.logsTable}>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Total Page Visits</th>
                  <th>Last Visit Date</th>
                  <th>First Visit Date</th>
                  <th>Days Active</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={styles.noData}>No visit logs found</td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const firstVisit = new Date(log.created_at);
                    const lastVisit = new Date(log.last_visitdate);
                    const daysActive = Math.floor((lastVisit - firstVisit) / (1000 * 60 * 60 * 24)) + 1;

                    return (
                      <tr key={log.id}>
                        <td><strong>{log.id_customer}</strong></td>
                        <td>
                          <span className={styles.visitBadge}>
                            {log.noof_visitpage} visits
                          </span>
                        </td>
                        <td>{new Date(log.last_visitdate).toLocaleString()}</td>
                        <td>{new Date(log.created_at).toLocaleString()}</td>
                        <td>
                          <span className={styles.daysBadge}>
                            {daysActive} {daysActive === 1 ? 'day' : 'days'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.footer}>
            <div className={styles.pageInfo}>
              Showing {logs.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} customers
            </div>

            <div className={styles.pagination}>
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={styles.pageBtn}>Previous</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const startPage = Math.max(1, currentPage - 2);
                return startPage + i <= totalPages ? startPage + i : null;
              }).filter(Boolean).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`${styles.pageBtn} ${currentPage === p ? styles.activePage : ''}`}
                >
                  {p}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className={styles.pageBtn}>Next</button>
            </div>

            <div className={styles.entriesControl}>
              <label>Show</label>
              <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(parseInt(e.target.value)); setCurrentPage(1); }} className={styles.selectInput}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VisitLogs;
