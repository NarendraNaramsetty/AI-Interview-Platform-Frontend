import React, { useState } from 'react';
import styles from './StudentLogs.module.css';

const StudentLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      studentId: 'STU001',
      studentName: 'John Smith',
      action: 'Login',
      module: 'Authentication',
      description: 'User logged in successfully',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0 on Windows 10',
      timestamp: '2024-01-15 14:30:25',
      status: 'Success',
      severity: 'Low'
    },
    {
      id: 2,
      studentId: 'STU002',
      studentName: 'Emma Johnson',
      action: 'Assignment Submission',
      module: 'Learning Management',
      description: 'Submitted assignment "Math Homework 3"',
      ipAddress: '192.168.1.101',
      userAgent: 'Firefox 121.0 on macOS',
      timestamp: '2024-01-15 14:25:10',
      status: 'Success',
      severity: 'Medium'
    },
    {
      id: 3,
      studentId: 'STU003',
      studentName: 'Michael Brown',
      action: 'Failed Login',
      module: 'Authentication',
      description: 'Invalid password attempt',
      ipAddress: '192.168.1.102',
      userAgent: 'Safari 17.0 on iOS',
      timestamp: '2024-01-15 14:20:45',
      status: 'Failed',
      severity: 'High'
    },
    {
      id: 4,
      studentId: 'STU001',
      studentName: 'John Smith',
      action: 'Course Access',
      module: 'Learning Management',
      description: 'Accessed course "Advanced Mathematics"',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0 on Windows 10',
      timestamp: '2024-01-15 14:15:30',
      status: 'Success',
      severity: 'Low'
    },
    {
      id: 5,
      studentId: 'STU004',
      studentName: 'Sarah Davis',
      action: 'Profile Update',
      module: 'User Management',
      description: 'Updated personal information',
      ipAddress: '192.168.1.103',
      userAgent: 'Edge 120.0 on Windows 11',
      timestamp: '2024-01-15 14:10:15',
      status: 'Success',
      severity: 'Low'
    },
    {
      id: 6,
      studentId: 'STU005',
      studentName: 'David Wilson',
      action: 'Quiz Attempt',
      module: 'Assessment',
      description: 'Completed quiz "Science Basics" - Score: 85%',
      ipAddress: '192.168.1.104',
      userAgent: 'Chrome 120.0 on Android',
      timestamp: '2024-01-15 14:05:00',
      status: 'Success',
      severity: 'Medium'
    },
    {
      id: 7,
      studentId: 'STU002',
      studentName: 'Emma Johnson',
      action: 'File Download',
      module: 'Resources',
      description: 'Downloaded "Lecture Notes.pdf"',
      ipAddress: '192.168.1.101',
      userAgent: 'Firefox 121.0 on macOS',
      timestamp: '2024-01-15 14:00:45',
      status: 'Success',
      severity: 'Low'
    },
    {
      id: 8,
      studentId: 'STU006',
      studentName: 'Lisa Anderson',
      action: 'Password Change',
      module: 'Security',
      description: 'Password changed successfully',
      ipAddress: '192.168.1.105',
      userAgent: 'Safari 17.0 on macOS',
      timestamp: '2024-01-15 13:55:20',
      status: 'Success',
      severity: 'Medium'
    },
    {
      id: 9,
      studentId: 'STU003',
      studentName: 'Michael Brown',
      action: 'Suspicious Activity',
      module: 'Security',
      description: 'Multiple failed login attempts from different locations',
      ipAddress: '192.168.1.106',
      userAgent: 'Unknown',
      timestamp: '2024-01-15 13:50:10',
      status: 'Warning',
      severity: 'Critical'
    },
    {
      id: 10,
      studentId: 'STU007',
      studentName: 'Robert Taylor',
      action: 'Course Enrollment',
      module: 'Registration',
      description: 'Enrolled in "Computer Science 101"',
      ipAddress: '192.168.1.107',
      userAgent: 'Chrome 120.0 on Windows 10',
      timestamp: '2024-01-15 13:45:35',
      status: 'Success',
      severity: 'Low'
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    student: '',
    action: '',
    module: '',
    status: '',
    severity: '',
    dateFrom: '',
    dateTo: ''
  });

  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const actions = ['All', 'Login', 'Logout', 'Assignment Submission', 'Quiz Attempt', 'Course Access', 'Profile Update', 'Password Change', 'File Download', 'Course Enrollment', 'Failed Login', 'Suspicious Activity'];
  const modules = ['All', 'Authentication', 'Learning Management', 'Assessment', 'User Management', 'Resources', 'Security', 'Registration'];
  const status = ['All', 'Success', 'Failed', 'Warning', 'Pending'];
  const severities = ['All', 'Low', 'Medium', 'High', 'Critical'];

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.studentId.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.ipAddress.includes(filters.search);

    const matchesStudent = !filters.student || filters.student === 'All' || log.studentId === filters.student;
    const matchesAction = !filters.action || filters.action === 'All' || log.action === filters.action;
    const matchesModule = !filters.module || filters.module === 'All' || log.module === filters.module;
    const matchesStatus = !filters.status || filters.status === 'All' || log.status === filters.status;
    const matchesSeverity = !filters.severity || filters.severity === 'All' || log.severity === filters.severity;

    const logDate = new Date(log.timestamp);
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo + ' 23:59:59') : null;

    const matchesDateFrom = !fromDate || logDate >= fromDate;
    const matchesDateTo = !toDate || logDate <= toDate;

    return matchesSearch && matchesStudent && matchesAction && matchesModule &&
      matchesStatus && matchesSeverity && matchesDateFrom && matchesDateTo;
  });

  // Pagination calculations
  const totalEntries = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      student: '',
      action: '',
      module: '',
      status: '',
      severity: '',
      dateFrom: '',
      dateTo: ''
    });
    setPage(1);
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const handleExportLogs = () => {
    // Simulate export functionality
    console.log('Exporting logs:', filteredLogs);
    alert(`Exporting ${filteredLogs.length} logs to CSV file`);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Success': '#27ae60',
      'Failed': '#e74c3c',
      'Warning': '#f39c12',
      'Pending': '#3498db'
    };
    return colors[status] || '#95a5a6';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Low': '#27ae60',
      'Medium': '#f39c12',
      'High': '#e67e22',
      'Critical': '#e74c3c'
    };
    return colors[severity] || '#95a5a6';
  };

  const getActionIcon = (action) => {
    const icons = {
      'Login': '🔐',
      'Logout': '🚪',
      'Assignment Submission': '📝',
      'Quiz Attempt': '📊',
      'Course Access': '📚',
      'Profile Update': '👤',
      'Password Change': '🔑',
      'File Download': '📥',
      'Course Enrollment': '🎓',
      'Failed Login': '❌',
      'Suspicious Activity': '⚠️'
    };
    return icons[action] || '📄';
  };

  const getStats = () => {
    const totalLogs = logs.length;
    const successLogs = logs.filter(log => log.status === 'Success').length;
    const failedLogs = logs.filter(log => log.status === 'Failed').length;
    const warningLogs = logs.filter(log => log.status === 'Warning').length;
    const uniqueStudents = [...new Set(logs.map(log => log.studentId))].length;

    return {
      totalLogs,
      successLogs,
      failedLogs,
      warningLogs,
      uniqueStudents,
      successRate: ((successLogs / totalLogs) * 100).toFixed(1)
    };
  };

  const stats = getStats();

  return (
    <div className={styles.container}>
      {/* Header - Updated Style */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Student Activity Logs</h2>
          <p className={styles.subtitle}>Monitor and analyze student activities and system interactions</p>
        </div>
        <button
          className={styles.primaryButton}
          onClick={handleExportLogs}
          disabled={filteredLogs.length === 0}
        >
          <span className={styles.buttonIcon}>📊</span>
          Export Logs
        </button>
      </div>

      {/* Statistics Cards */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.totalLogs}</div>
            <div className={styles.statLabel}>Total Logs</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.uniqueStudents}</div>
            <div className={styles.statLabel}>Unique Students</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.successRate}%</div>
            <div className={styles.statLabel}>Success Rate</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.warningLogs}</div>
            <div className={styles.statLabel}>Warnings</div>
          </div>
        </div>
      </div>

      {/* Search and Controls - Updated Style */}
      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search students, IDs, descriptions, or IP addresses..."
            className={styles.searchInput}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <button className={styles.searchButton}>Search</button>
        </div>
        <div className={styles.entriesControl}>
          <label>Show</label>
          <select
            className={styles.entriesSelect}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>
      </div>

      {/* Filters Section */}
      <div className={styles.filtersSection}>
        <div className={styles.filtersHeader}>
          <h3 className={styles.sectionTitle}>Filter Logs</h3>
          <button
            className={styles.clearButton}
            onClick={handleClearFilters}
          >
            Clear All Filters
          </button>
        </div>

        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Student</label>
            <select
              className={styles.filterSelect}
              value={filters.student}
              onChange={(e) => handleFilterChange('student', e.target.value)}
            >
              <option value="">All Students</option>
              {[...new Set(logs.map(log => log.studentId))].map(studentId => (
                <option key={studentId} value={studentId}>
                  {studentId} - {logs.find(log => log.studentId === studentId)?.studentName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Action</label>
            <select
              className={styles.filterSelect}
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            >
              <option value="">All Actions</option>
              {actions.filter(action => action !== 'All').map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Module</label>
            <select
              className={styles.filterSelect}
              value={filters.module}
              onChange={(e) => handleFilterChange('module', e.target.value)}
            >
              <option value="">All Modules</option>
              {modules.filter(module => module !== 'All').map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status</label>
            <select
              className={styles.filterSelect}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              {status.filter(status => status !== 'All').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Severity</label>
            <select
              className={styles.filterSelect}
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
            >
              <option value="">All Severity</option>
              {severities.filter(severity => severity !== 'All').map(severity => (
                <option key={severity} value={severity}>{severity}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Date From</label>
            <input
              type="date"
              className={styles.dateInput}
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Date To</label>
            <input
              type="date"
              className={styles.dateInput}
              value={filters.dateTo}
              min={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.filterSummary}>
          <span className={styles.summaryText}>
            Showing {filteredLogs.length} of {logs.length} logs
            {filters.search && ` matching "${filters.search}"`}
          </span>
        </div>
      </div>

      {/* Logs Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3 className={styles.sectionTitle}>Activity Logs</h3>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.th}>Student</th>
                <th className={styles.th}>Action</th>
                <th className={styles.th}>Module</th>
                <th className={styles.th}>Description</th>
                <th className={styles.th}>IP Address</th>
                <th className={styles.th}>Timestamp</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Severity</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {currentLogs.map(log => (
                <tr key={log.id} className={styles.tableRow}>
                  <td className={styles.td}>
                    <div className={styles.studentInfo}>
                      <div className={styles.studentName}>{log.studentName}</div>
                      <div className={styles.studentId}>{log.studentId}</div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionCell}>
                      <span className={styles.actionIcon}>
                        {getActionIcon(log.action)}
                      </span>
                      <span className={styles.actionText}>{log.action}</span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.module}>{log.module}</span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.description}>
                      {log.description}
                    </div>
                  </td>
                  <td className={styles.td}>
                    <code className={styles.ipAddress}>{log.ipAddress}</code>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.timestamp}>
                      <div className={styles.date}>{log.timestamp.split(' ')[0]}</div>
                      <div className={styles.time}>{log.timestamp.split(' ')[1]}</div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(log.status) }}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span
                      className={styles.severityBadge}
                      style={{ backgroundColor: getSeverityColor(log.severity) }}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.viewButton}
                        onClick={() => handleViewDetails(log)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className={styles.flagButton}
                        onClick={() => console.log('Flag log:', log.id)}
                        title="Flag for Review"
                      >
                        🚩
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className={styles.noData}>
              <div className={styles.noDataIcon}>🔍</div>
              <h4>No logs found</h4>
              <p>Try adjusting your filters or search criteria</p>
              <button
                className={styles.clearButton}
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination - Updated Style */}
        {filteredLogs.length > 0 && (
          <div className={styles.tableFooter}>
            <div className={styles.pageInfo}>
              Showing {totalEntries === 0 ? 0 : startIndex + 1} to {endIndex} of {totalEntries} entries
            </div>
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`${styles.pageButton} ${page === i + 1 ? styles.pageButtonActive : ''}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className={styles.pageButton}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Log Details</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <label>Student ID</label>
                  <span>{selectedLog.studentId}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Student Name</label>
                  <span>{selectedLog.studentName}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Action</label>
                  <span>
                    <span className={styles.actionIcon}>
                      {getActionIcon(selectedLog.action)}
                    </span>
                    {selectedLog.action}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>Module</label>
                  <span>{selectedLog.module}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Description</label>
                  <span>{selectedLog.description}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>IP Address</label>
                  <span>{selectedLog.ipAddress}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>User Agent</label>
                  <span>{selectedLog.userAgent}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Timestamp</label>
                  <span>{selectedLog.timestamp}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Status</label>
                  <span style={{ color: getStatusColor(selectedLog.status) }}>
                    {selectedLog.status}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>Severity</label>
                  <span style={{ color: getSeverityColor(selectedLog.severity) }}>
                    {selectedLog.severity}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
              <button
                className={styles.submitButton}
                onClick={() => {
                  console.log('Take action on log:', selectedLog.id);
                  setShowDetailsModal(false);
                }}
              >
                Take Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.quickActionsTitle}>Quick Actions</h3>
        <div className={styles.actionButtons}>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>📊</span>
            Generate Report
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>🔔</span>
            Set Up Alerts
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>🔄</span>
            Refresh Data
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>📋</span>
            Audit Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogs;