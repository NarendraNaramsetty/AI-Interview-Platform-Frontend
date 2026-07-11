import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCheckCircle,
  faClock,
  faTasks,
  faSearch,
  faFilter,
  faTimes,
  faEye,
  faEdit,
  faTrash,
  faEnvelope,
  faChartBar,
  faFileAlt,
  faPlus,
  faDownload,
  faUpload,
  faSync,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import styles from './VolunteerJourneyManagement.module.css';

const VolunteerJourneyManagement = () => {
  const [volunteers, setVolunteers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2024-01-15',
      status: 'Active',
      totalHours: 45,
      completedTasks: 12,
      currentStage: 'Onboarding',
      nextTask: 'Complete Training Module',
      lastActivity: '2024-01-20',
      skills: ['Teaching', 'Mentoring', 'Communication'],
      assignedProgram: 'Youth Education'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      phone: '+1 (555) 234-5678',
      joinDate: '2024-01-10',
      status: 'Active',
      totalHours: 78,
      completedTasks: 18,
      currentStage: 'Active Volunteering',
      nextTask: 'Weekly Progress Report',
      lastActivity: '2024-01-19',
      skills: ['Technical', 'Leadership', 'Problem Solving'],
      assignedProgram: 'Tech Mentorship'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.r@email.com',
      phone: '+1 (555) 345-6789',
      joinDate: '2023-12-05',
      status: 'On Hold',
      totalHours: 120,
      completedTasks: 25,
      currentStage: 'Review',
      nextTask: 'Performance Evaluation',
      lastActivity: '2024-01-15',
      skills: ['Counseling', 'Organization', 'Event Planning'],
      assignedProgram: 'Community Support'
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Complete Orientation',
      description: 'Watch orientation videos and complete quiz',
      volunteerId: 1,
      volunteerName: 'Sarah Johnson',
      dueDate: '2024-01-25',
      status: 'In Progress',
      priority: 'High',
      type: 'Training'
    },
    {
      id: 2,
      title: 'Mentor Session Planning',
      description: 'Prepare lesson plans for next mentoring session',
      volunteerId: 2,
      volunteerName: 'Michael Chen',
      dueDate: '2024-01-22',
      status: 'Completed',
      priority: 'Medium',
      type: 'Planning'
    }
  ]);

  const [activeTab, setActiveTab] = useState('volunteers');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    stage: '',
    program: ''
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const statusOptions = ['All', 'New', 'Active', 'On Hold', 'Completed'];
  const stageOptions = ['All', 'Application', 'Onboarding', 'Training', 'Active Volunteering', 'Review', 'Graduated'];
  const programOptions = ['All', 'Youth Education', 'Tech Mentorship', 'Community Support', 'Sports Development'];

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = 
      volunteer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || filters.status === 'All' || volunteer.status === filters.status;
    const matchesStage = !filters.stage || filters.stage === 'All' || volunteer.currentStage === filters.stage;
    const matchesProgram = !filters.program || filters.program === 'All' || volunteer.assignedProgram === filters.program;

    return matchesSearch && matchesStatus && matchesStage && matchesProgram;
  });

  // Pagination calculations
  const totalEntries = filteredVolunteers.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);
  const paginatedVolunteers = filteredVolunteers.slice(startIndex, endIndex);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      stage: '',
      program: ''
    });
  };

  const handleViewVolunteer = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowVolunteerModal(true);
  };

  const handleUpdateVolunteerStatus = (volunteerId, newStatus) => {
    setVolunteers(volunteers.map(volunteer =>
      volunteer.id === volunteerId ? { ...volunteer, status: newStatus } : volunteer
    ));
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': '#3498db',
      'Active': '#27ae60',
      'On Hold': '#f39c12',
      'Completed': '#95a5a6'
    };
    return colors[status] || '#95a5a6';
  };

  const getStageColor = (stage) => {
    const colors = {
      'Application': '#3498db',
      'Onboarding': '#9b59b6',
      'Training': '#f39c12',
      'Active Volunteering': '#27ae60',
      'Review': '#e67e22',
      'Graduated': '#95a5a6'
    };
    return colors[stage] || '#95a5a6';
  };

  const getStats = () => {
    const totalVolunteers = volunteers.length;
    const activeVolunteers = volunteers.filter(v => v.status === 'Active').length;
    const totalHours = volunteers.reduce((sum, v) => sum + v.totalHours, 0);
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

    return {
      totalVolunteers,
      activeVolunteers,
      totalHours,
      pendingTasks
    };
  };

  const stats = getStats();

  return (
    <div className={styles.container}>
      {/* Header - Updated Style */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Volunteer Journey Management</h2>
          <p className={styles.subtitle}>Manage volunteer progression and program assignments</p>
        </div>
        <button className={styles.primaryButton}>
          <span className={styles.buttonIcon}>+</span>
          Add Volunteer
        </button>
      </div>

      {/* Statistics */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.totalVolunteers}</div>
            <div className={styles.statLabel}>Total Volunteers</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.activeVolunteers}</div>
            <div className={styles.statLabel}>Active Volunteers</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.totalHours}</div>
            <div className={styles.statLabel}>Total Hours</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faTasks} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.pendingTasks}</div>
            <div className={styles.statLabel}>Pending Tasks</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'volunteers' ? styles.active : ''}`}
          onClick={() => setActiveTab('volunteers')}
        >
          <FontAwesomeIcon icon={faUsers} />
          Volunteers
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'tasks' ? styles.active : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <FontAwesomeIcon icon={faTasks} />
          Tasks
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'reports' ? styles.active : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FontAwesomeIcon icon={faChartBar} />
          Reports
        </button>
      </div>

      {/* Search and Controls - Updated Style */}
      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Search volunteers by name, email, or program..." 
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

      {/* Additional Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <select
            className={styles.filterSelect}
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            {statusOptions.filter(opt => opt !== 'All').map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.filterSelect}
            value={filters.stage}
            onChange={(e) => handleFilterChange('stage', e.target.value)}
          >
            <option value="">All Stages</option>
            {stageOptions.filter(opt => opt !== 'All').map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.filterSelect}
            value={filters.program}
            onChange={(e) => handleFilterChange('program', e.target.value)}
          >
            <option value="">All Programs</option>
            {programOptions.filter(opt => opt !== 'All').map(program => (
              <option key={program} value={program}>{program}</option>
            ))}
          </select>
        </div>

        <button className={styles.clearButton} onClick={handleClearFilters}>
          <FontAwesomeIcon icon={faTimes} />
          Clear
        </button>
      </div>

      {/* Volunteers Table */}
      {activeTab === 'volunteers' && (
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h3>Volunteers ({filteredVolunteers.length})</h3>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Program</th>
                  <th>Stage</th>
                  <th>Hours</th>
                  <th>Tasks</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVolunteers.map(volunteer => (
                  <tr key={volunteer.id}>
                    <td>
                      <div className={styles.volunteerInfo}>
                        <div className={styles.name}>{volunteer.name}</div>
                        <div className={styles.email}>{volunteer.email}</div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.program}>{volunteer.assignedProgram}</span>
                    </td>
                    <td>
                      <span 
                        className={styles.stage}
                        style={{ color: getStageColor(volunteer.currentStage) }}
                      >
                        {volunteer.currentStage}
                      </span>
                    </td>
                    <td>
                      <div className={styles.hours}>{volunteer.totalHours}h</div>
                    </td>
                    <td>
                      <div className={styles.tasks}>{volunteer.completedTasks}</div>
                    </td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        style={{ borderColor: getStatusColor(volunteer.status) }}
                        value={volunteer.status}
                        onChange={(e) => handleUpdateVolunteerStatus(volunteer.id, e.target.value)}
                      >
                        {statusOptions.filter(opt => opt !== 'All').map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button 
                          className={styles.viewBtn}
                          onClick={() => handleViewVolunteer(volunteer)}
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button 
                          className={styles.editBtn}
                          onClick={() => console.log('Edit:', volunteer.id)}
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button 
                          className={styles.messageBtn}
                          onClick={() => console.log('Message:', volunteer.id)}
                          title="Send Message"
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredVolunteers.length === 0 && (
              <div className={styles.noData}>
                <FontAwesomeIcon icon={faUsers} className={styles.noDataIcon} />
                <p>No volunteers found</p>
              </div>
            )}
          </div>

          {/* Pagination - Updated Style */}
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
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className={styles.tasksSection}>
          <div className={styles.tableHeader}>
            <h3>Tasks ({tasks.length})</h3>
          </div>
          <div className={styles.tasksGrid}>
            {tasks.map(task => (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <h4>{task.title}</h4>
                  <span className={styles.priority}>{task.priority}</span>
                </div>
                <p className={styles.taskDescription}>{task.description}</p>
                <div className={styles.taskMeta}>
                  <span>Volunteer: {task.volunteerName}</span>
                  <span>Due: {task.dueDate}</span>
                </div>
                <div className={styles.taskFooter}>
                  <span className={styles.status}>{task.status}</span>
                  <div className={styles.taskActions}>
                    <button className={styles.viewBtn}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className={styles.editBtn}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className={styles.reportsSection}>
          <div className={styles.reportsHeader}>
            <h3>Reports & Analytics</h3>
          </div>
          <div className={styles.reportsGrid}>
            <div className={styles.reportCard}>
              <FontAwesomeIcon icon={faChartBar} className={styles.reportIcon} />
              <h4>Volunteer Progress</h4>
              <p>Track volunteer journey progression</p>
              <button className={styles.reportBtn}>
                <FontAwesomeIcon icon={faDownload} />
                Generate Report
              </button>
            </div>
            <div className={styles.reportCard}>
              <FontAwesomeIcon icon={faFileAlt} className={styles.reportIcon} />
              <h4>Program Performance</h4>
              <p>Analyze program effectiveness</p>
              <button className={styles.reportBtn}>
                <FontAwesomeIcon icon={faDownload} />
                Generate Report
              </button>
            </div>
            <div className={styles.reportCard}>
              <FontAwesomeIcon icon={faUsers} className={styles.reportIcon} />
              <h4>Volunteer Engagement</h4>
              <p>Monitor volunteer participation</p>
              <button className={styles.reportBtn}>
                <FontAwesomeIcon icon={faDownload} />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Details Modal */}
      {showVolunteerModal && selectedVolunteer && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Volunteer Details</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowVolunteerModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.detailRow}>
                <label>Name:</label>
                <span>{selectedVolunteer.name}</span>
              </div>
              <div className={styles.detailRow}>
                <label>Email:</label>
                <span>{selectedVolunteer.email}</span>
              </div>
              <div className={styles.detailRow}>
                <label>Phone:</label>
                <span>{selectedVolunteer.phone}</span>
              </div>
              <div className={styles.detailRow}>
                <label>Program:</label>
                <span>{selectedVolunteer.assignedProgram}</span>
              </div>
              <div className={styles.detailRow}>
                <label>Stage:</label>
                <span style={{ color: getStageColor(selectedVolunteer.currentStage) }}>
                  {selectedVolunteer.currentStage}
                </span>
              </div>
              <div className={styles.detailRow}>
                <label>Total Hours:</label>
                <span>{selectedVolunteer.totalHours}</span>
              </div>
              <div className={styles.detailRow}>
                <label>Completed Tasks:</label>
                <span>{selectedVolunteer.completedTasks}</span>
              </div>
              <div className={styles.detailRow}>
                <label>Skills:</label>
                <div className={styles.skills}>
                  {selectedVolunteer.skills.map(skill => (
                    <span key={skill} className={styles.skill}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.secondaryButton}
                onClick={() => setShowVolunteerModal(false)}
              >
                Close
              </button>
              <button className={styles.primaryButton}>
                Edit Volunteer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h4>Quick Actions</h4>
        <div className={styles.actionButtons}>
          <button className={styles.actionBtn}>
            <FontAwesomeIcon icon={faEnvelope} />
            Send Message
          </button>
          <button className={styles.actionBtn}>
            <FontAwesomeIcon icon={faDownload} />
            Export Data
          </button>
          <button className={styles.actionBtn}>
            <FontAwesomeIcon icon={faSync} />
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerJourneyManagement;