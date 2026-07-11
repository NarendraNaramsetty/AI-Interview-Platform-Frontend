import React, { useState } from 'react';
import styles from './VolunteerJourneyList.module.css';

const VolunteerJourneyList = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJourneys, setSelectedJourneys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Mock data for volunteer journeys
  const volunteerJourneys = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      program: 'Education Support',
      status: 'active',
      joinDate: '2024-01-15',
      hoursCompleted: 45,
      milestones: 3,
      lastActivity: '2024-03-20',
      avatar: '👩‍🏫',
      location: 'New York, USA'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      program: 'Environmental Cleanup',
      status: 'pending',
      joinDate: '2024-02-10',
      hoursCompleted: 12,
      milestones: 1,
      lastActivity: '2024-03-18',
      avatar: '👨‍💼',
      location: 'Toronto, Canada'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.r@email.com',
      program: 'Community Kitchen',
      status: 'active',
      joinDate: '2023-11-05',
      hoursCompleted: 89,
      milestones: 5,
      lastActivity: '2024-03-22',
      avatar: '👩‍🍳',
      location: 'London, UK'
    },
    {
      id: 4,
      name: 'James Wilson',
      email: 'james.w@email.com',
      program: 'Youth Mentoring',
      status: 'completed',
      joinDate: '2023-09-20',
      hoursCompleted: 120,
      milestones: 6,
      lastActivity: '2024-03-15',
      avatar: '👨‍🏫',
      location: 'Sydney, Australia'
    },
    {
      id: 5,
      name: 'Priya Patel',
      email: 'priya.p@email.com',
      program: 'Healthcare Outreach',
      status: 'on-hold',
      joinDate: '2024-01-30',
      hoursCompleted: 28,
      milestones: 2,
      lastActivity: '2024-03-10',
      avatar: '👩‍⚕️',
      location: 'Mumbai, India'
    },
    {
      id: 6,
      name: 'David Kim',
      email: 'david.k@email.com',
      program: 'Disaster Relief',
      status: 'active',
      joinDate: '2024-02-28',
      hoursCompleted: 35,
      milestones: 2,
      lastActivity: '2024-03-21',
      avatar: '👨‍🚒',
      location: 'Seoul, South Korea'
    },
    {
      id: 7,
      name: 'Maria Garcia',
      email: 'maria.g@email.com',
      program: 'Elderly Care',
      status: 'pending',
      joinDate: '2024-03-05',
      hoursCompleted: 8,
      milestones: 0,
      lastActivity: '2024-03-19',
      avatar: '👵',
      location: 'Madrid, Spain'
    },
    {
      id: 8,
      name: 'Alex Thompson',
      email: 'alex.t@email.com',
      program: 'Animal Rescue',
      status: 'active',
      joinDate: '2023-12-12',
      hoursCompleted: 67,
      milestones: 4,
      lastActivity: '2024-03-23',
      avatar: '👨‍🌾',
      location: 'Portland, USA'
    },
    {
      id: 9,
      name: 'Lisa Wang',
      email: 'lisa.w@email.com',
      program: 'Education Support',
      status: 'completed',
      joinDate: '2023-10-08',
      hoursCompleted: 95,
      milestones: 5,
      lastActivity: '2024-03-14',
      avatar: '👩‍🎓',
      location: 'Beijing, China'
    },
    {
      id: 10,
      name: 'Robert Brown',
      email: 'robert.b@email.com',
      program: 'Environmental Cleanup',
      status: 'on-hold',
      joinDate: '2024-02-15',
      hoursCompleted: 15,
      milestones: 1,
      lastActivity: '2024-03-12',
      avatar: '👨‍🔬',
      location: 'Berlin, Germany'
    }
  ];

  const stats = {
    total: volunteerJourneys.length,
    active: volunteerJourneys.filter(v => v.status === 'active').length,
    pending: volunteerJourneys.filter(v => v.status === 'pending').length,
    completed: volunteerJourneys.filter(v => v.status === 'completed').length
  };

  const filteredJourneys = volunteerJourneys.filter(journey => {
    const matchesFilter = filter === 'all' || journey.status === filter;
    const matchesSearch = journey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journey.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journey.program.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredJourneys.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredJourneys.length);
  const currentJourneys = filteredJourneys.slice(startIndex, endIndex);

  const handleSelectJourney = (journeyId) => {
    setSelectedJourneys(prev =>
      prev.includes(journeyId)
        ? prev.filter(id => id !== journeyId)
        : [...prev, journeyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedJourneys.length === currentJourneys.length) {
      setSelectedJourneys([]);
    } else {
      setSelectedJourneys(currentJourneys.map(journey => journey.id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', class: styles.active },
      pending: { label: 'Pending', class: styles.pending },
      completed: { label: 'Completed', class: styles.completed },
      'on-hold': { label: 'On Hold', class: styles.onHold }
    };

    const config = statusConfig[status];
    return (
      <span className={`${styles.statusBadge} ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const getProgressPercentage = (hours) => {
    const maxHours = 120;
    return Math.min((hours / maxHours) * 100, 100);
  };

  const exportJourneys = () => {
    const journeysToExport = selectedJourneys.length > 0
      ? volunteerJourneys.filter(journey => selectedJourneys.includes(journey.id))
      : volunteerJourneys;

    console.log('Exporting journeys:', journeysToExport);
    alert(`Exported ${journeysToExport.length} volunteer journeys successfully!`);
  };

  const sendBulkMessage = () => {
    if (selectedJourneys.length === 0) {
      alert('Please select at least one volunteer to message');
      return;
    }
    console.log('Sending message to:', selectedJourneys);
    alert(`Message sent to ${selectedJourneys.length} volunteers!`);
  };

  return (
    <div className={styles.container}>
      {/* Header - Updated with University component style */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Volunteer Journey Management</h2>
          <p className={styles.subtitle}>Browse volunteer journeys and track their progress and status</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.primaryButton} onClick={exportJourneys}>
            <span className={styles.buttonIcon}>📤</span>
            Export Data
          </button>
          <button className={styles.secondaryButton} onClick={sendBulkMessage}>
            <span className={styles.buttonIcon}>✉️</span>
            Send Message
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconTotal}>👥</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.total}</h3>
            <p className={styles.statLabel}>Total Volunteers</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconActive}>✅</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.active}</h3>
            <p className={styles.statLabel}>Active</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconPending}>⏳</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.pending}</h3>
            <p className={styles.statLabel}>Pending</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconCompleted}>🎓</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.completed}</h3>
            <p className={styles.statLabel}>Completed</p>
          </div>
        </div>
      </div>

      {/* Search and Controls - Updated with University component style */}
      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search volunteers by name, email, or program..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select>
          <span>entries</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All Volunteers
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'active' ? styles.active : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'pending' ? styles.active : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'on-hold' ? styles.active : ''}`}
            onClick={() => setFilter('on-hold')}
          >
            On Hold
          </button>
        </div>
      </div>

      {/* Volunteer Journeys Grid */}
      <div className={styles.journeysGrid}>
        {currentJourneys.map((volunteer) => (
          <div key={volunteer.id} className={styles.journeyCard}>
            <div className={styles.cardHeader}>
              <div className={styles.volunteerInfo}>
                <div className={styles.avatar}>{volunteer.avatar}</div>
                <div className={styles.nameSection}>
                  <h3 className={styles.volunteerName}>{volunteer.name}</h3>
                  <p className={styles.volunteerEmail}>{volunteer.email}</p>
                </div>
              </div>
              <div className={styles.cardActions}>
                <input
                  type="checkbox"
                  checked={selectedJourneys.includes(volunteer.id)}
                  onChange={() => handleSelectJourney(volunteer.id)}
                  className={styles.selectCheckbox}
                />
                {getStatusBadge(volunteer.status)}
              </div>
            </div>

            <div className={styles.programInfo}>
              <span className={styles.programLabel}>Program</span>
              <span className={styles.programName}>{volunteer.program}</span>
            </div>

            <div className={styles.location}>
              <span className={styles.locationIcon}>📍</span>
              {volunteer.location}
            </div>

            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span>Progress</span>
                <span className={styles.hours}>{volunteer.hoursCompleted} hrs</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${getProgressPercentage(volunteer.hoursCompleted)}%` }}
                ></div>
              </div>
              <div className={styles.milestones}>
                <span className={styles.milestoneIcon}>🏆</span>
                {volunteer.milestones} milestones achieved
              </div>
            </div>

            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Joined</span>
                <span className={styles.metaValue}>{volunteer.joinDate}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Last Active</span>
                <span className={styles.metaValue}>{volunteer.lastActivity}</span>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <button className={styles.viewButton}>
                View Journey
              </button>
              <button className={styles.messageButton}>
                Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - Updated with University component style */}
      {filteredJourneys.length > 0 && (
        <div className={styles.tableFooter}>
          <div className={styles.pageInfo}>
            Showing {filteredJourneys.length === 0 ? 0 : startIndex + 1} to {endIndex} of {filteredJourneys.length} entries
          </div>
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`${styles.pageButton} ${currentPage === i + 1 ? styles.pageButtonActive : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {currentJourneys.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <h3 className={styles.emptyTitle}>No volunteers found</h3>
          <p className={styles.emptyMessage}>
            {searchTerm || filter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No volunteer journeys available at the moment'
            }
          </p>
          {(searchTerm || filter !== 'all') && (
            <button
              className={styles.resetButton}
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerJourneyList;