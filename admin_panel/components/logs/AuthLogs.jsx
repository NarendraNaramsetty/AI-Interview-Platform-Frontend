import React, { useState, useEffect } from 'react';
import styles from './Logs.module.css';
import { toast, ToastContainer } from 'react-toastify';
import ApiService, { api } from '../../service/Apiservice.jsx';

const AuthLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [userType, setUserType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('logs/authentication/', {
        params: {
          page: currentPage,
          page_size: entriesPerPage,
          search,
          user_type: userType,
          start_date: startDate,
          end_date: endDate
        },
        headers: { 'Authorization': `Bearer ${token}` }
      });

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
  }, [currentPage, entriesPerPage, search, userType, startDate, endDate]);

  const totalPages = Math.ceil(totalRecords / entriesPerPage);

  return (
    <div className={styles.logsContainer}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className={styles.header}>
        <h2>Authentication Logs</h2>
        <p>User login, logout, and password reset activities</p>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.filterRow}>
          <input
            type="text"
            placeholder="Search remarks or action..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />

          <select
            value={userType}
            onChange={(e) => {
              setUserType(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.selectInput}
          >
            <option value="">All User Types</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.dateInput}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.dateInput}
          />

          <button onClick={() => {
            setSearch('');
            setUserType('');
            setStartDate('');
            setEndDate('');
            setCurrentPage(1);
          }} className={styles.resetBtn}>
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading logs...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.logsTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Module</th>
                  <th>User ID</th>
                  <th>Action</th>
                  <th>Remarks</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.noData}>No logs found</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.module_name}</td>
                      <td>{log.id_adminuser || log.id_customer}</td>
                      <td><span className={styles.badge}>{log.action}</span></td>
                      <td>{log.remarks}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.footer}>
            <div className={styles.pageInfo}>
              Showing {logs.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} entries
            </div>

            <div className={styles.pagination}>
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={styles.pageBtn}>Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
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

export default AuthLogs;
