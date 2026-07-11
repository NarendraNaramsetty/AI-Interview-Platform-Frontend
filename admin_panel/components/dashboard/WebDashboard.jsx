
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from "react-toastify";
import { 
  faUsers,
  faUniversity,
  faSchool,
  faChalkboardTeacher,
  faCalendarAlt,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faFilter,
  faCircleXmark,
  faMapMarkedAlt,
  faQrcode,
  faCalendarPlus
} from '@fortawesome/free-solid-svg-icons';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import ApiService, { api } from "../../service/Apiservice.jsx";
import QRCode from 'react-qr-code';
import React, { useState, useEffect, useRef } from 'react';
import useClickOutside from "../../hooks/useClickOutside";
import PageLoader from '../common/PageLoader.jsx';
import DashboardLoader from '../common/DashboardLoader.jsx';
const Dashboard = () => {
const qrModalRef = useRef(null);
useClickOutside(qrModalRef, () => setShowQRModal(false));

    const locationsModalRef = useRef(null);
    useClickOutside(locationsModalRef, () => setShowLocationsModal(false));
  
      const handleLogout = () => { 
      localStorage.clear();
      sessionStorage.clear();
      toast.info("You have been logged out", { autoClose: 1000 });
      navigate("/adminlogin");
    };
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const cardRoutes = {
    "Total Student": "/accounts/students",
    "Total Universities": "/master/university",
    "Total Colleges": "/master/college",
    "Total Departments": "/master/department",
    "Total Events": "/events/list",
    "Current Events": "/events/list/current",
    "Upcoming Events": "/events/list/upcoming",
    "Total Volunteer": "/volunteering/students",
    "Closed Events": "/events/list/closed"

  };
const [appliedFilters, setAppliedFilters] = useState({
  university: "",
  college: "",
  department: ""
});

  // Dynamic user access values
  const userRole = user?.id_role || "";
  const id_adminuser = user?.id || "";
  const role_name = user.role_name || "User";
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Filters
  const [selectedFilterUniversity, setSelectedFilterUniversity] = useState("");
  const [selectedFilterCollege, setSelectedFilterCollege] = useState("");
  const [selectedFilterDepartment, setSelectedFilterDepartment] = useState("");
  const [filterUniversity, setFilterUniversity] = useState([]);
  const [filterCollege, setFilterCollege] = useState([]);

  // Dashboard counts
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [currentEvents, setCurrentEvents] = useState(0);
  const [closedEvents, setClosedEvents] = useState(0);
  const [totalUniversities, setTotalUniversities] = useState(0);
  const [totalColleges, setTotalColleges] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalVolunteer, setTotalVolunteer] = useState(0);

  const [allEventsList, setAllEventsList] = useState([]);
const [allPage, setAllPage] = useState(1);
const [allTotalEntries, setAllTotalEntries] = useState(0);

  // Locations Modal State
  const [showLocationsModal, setShowLocationsModal] = useState(false);
  const [selectedEventForLocations, setSelectedEventForLocations] = useState(null);
  const [eventLocations, setEventLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

    // QR Modal State
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrValue, setQrValue] = useState("");
    const [qrLocationName, setQrLocationName] = useState("");


  // Event tab state
  const [activeEventTab, setActiveEventTab] = useState('all');

  // Event data states
  const [currentEventsList, setCurrentEventsList] = useState([]);
  const [upcomingEventsList, setUpcomingEventsList] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTotalEntries, setCurrentTotalEntries] = useState(0);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [upcomingTotalEntries, setUpcomingTotalEntries] = useState(0);
  const pageSize = 10;
  const totalAllPages = Math.ceil(allTotalEntries / pageSize) || 0;
  const allStartIndex = (allPage - 1) * pageSize + 1;
  const allEndIndex = Math.min(allPage * pageSize, allTotalEntries);
  // -------------------------------
  // API – Load Universities
  // -------------------------------
  const getUniversity = async () => {
    try {
          const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await ApiService.getAllUniversities();
      if (res.data?.status === "success") {
        setFilterUniversity(res.data.data || []);
      }
    } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
                  toast.error("Session expired. Please login again.", { autoClose: 1000 });
                  handleLogout();
                  return;
                }
      console.error("Failed: Universities", err);
    }
  };

  // -------------------------------
  // API – Load Colleges by University
  // -------------------------------
  const getCollege = async (univId) => {
    try {
      if (!univId) return;
          const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await ApiService.getUniversityByCollege(univId);
      if (res.data?.status === "success") {
        setFilterCollege(res.data.data || []);
      }
    } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
                  toast.error("Session expired. Please login again.", { autoClose: 1000 });
                  handleLogout();
                  return;
                }
      console.error("Failed: Colleges", err);
    }
  };

  // -------------------------------
  // INITIAL LOAD
  // -------------------------------
  useEffect(() => {
    getUniversity();
    if (userUniv !== "0") {
      setSelectedFilterUniversity(userUniv);
      getCollege(userUniv);
    }
    if (userCollege !== "0") {
      setSelectedFilterCollege(userCollege);
    }
  }, []);

  // -------------------------------
  // Format Date
  // -------------------------------
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // -------------------------------
  // Dashboard Counts
  // -------------------------------
  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try {
          const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await ApiService.getDashboardCounts({
      id_university: appliedFilters.university || user.id_university,
      id_college: appliedFilters.college || user.id_college,
      id_department: appliedFilters.department || user.id_department,
         id_role : userRole,
        id_adminuser: id_adminuser
      });

      const d = res?.data?.data || {};
      setTotalStudents(d.total_users || 0);
      setTotalEvents(d.total_events || 0);
      setUpcomingEvents(d.upcoming_events || 0);
      setCurrentEvents(d.current_events || 0);
      setClosedEvents(d.closed_events || 0);
      setTotalUniversities(d.total_universities || 0);
      setTotalColleges(d.total_colleges || 0);
      setTotalDepartments(d.total_departments || 0);
      setTotalVolunteer(d.total_volunteer || 0);
    } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
                  toast.error("Session expired. Please login again.", { autoClose: 1000 });
                  handleLogout();
                  return;
                }
      toast.error("Dashboard Load Failed");
    } finally {
      setDashboardLoading(false);
    }
  };

  // useEffect(() => {
   
  // }, [selectedFilterUniversity, selectedFilterCollege, selectedFilterDepartment]);

const handleApplyFilter = () => {
  // Validate: university dropdown is visible but nothing selected
  if (userUniv === "0" && !selectedFilterUniversity) {
    toast.warning("Please select a University before applying the filter.");
    return;
  }
  // Validate: college dropdown is visible but nothing selected
  if (userCollege === "0" && !selectedFilterCollege) {
    toast.warning("Please select a College before applying the filter.");
    return;
  }

  setAppliedFilters({
    university: selectedFilterUniversity,
    college: selectedFilterCollege,
    department: selectedFilterDepartment
  });

  setAllPage(1);
  setCurrentPage(1);
  setUpcomingPage(1);
};



  const fetchAllEvents = async () => {
       setLoading(true);
  try {
    const token = localStorage.getItem("accessToken");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const res = await ApiService.getEventDataTable({
      id_university: appliedFilters.university || user.id_university,
      id_college: appliedFilters.college || user.id_college,
      id_department: appliedFilters.department || user.id_department,
      page: allPage,
      length: pageSize
    });

       setLoading(false);
    setAllEventsList(res?.data?.data || []);
    setAllTotalEntries(res?.data?.total_records || 0);
  } catch (err) {
    if (err.response?.data?.code === "token_not_valid") {
      toast.error("Session expired. Please login again.", { autoClose: 1000 });
      handleLogout();
      return;
    }
    toast.error("All Events Load Failed");
  }
};

useEffect(() => {
  fetchDashboardData();
}, [appliedFilters]);


  // -------------------------------
  // Pagination helpers
  // -------------------------------
  const generatePageNumbers = (current, totalPages) => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l > 2) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  
  // ------------------- LOCATIONS MODAL -------------------
  const handleViewLocations = async (event) => {
    setSelectedEventForLocations(event);
    setShowLocationsModal(true);
    setLocationsLoading(true);
    
    console.log("Fetching locations for event:", event.challengeID, event);
    
    try {
      const res = await ApiService.getEventLocationsByEvent({ event_id: event.challengeID });
      if (res.data?.status === "success") {
        setEventLocations(res.data.data || []);
      } else {
        setEventLocations([]);
        toast.error("Failed to load locations");
      }
    } catch (err) {
      console.error("Failed to fetch locations:", err);
      setEventLocations([]);
      toast.error("Failed to load locations");
    } finally {
      setLocationsLoading(false);
    }
  };

  const handleShowQR = (location) => {
    setQrValue(String(location.id));
    setQrLocationName(location.eventLocation || "Location");
    setShowQRModal(true);
  };
  const toTitleCase = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };
  return (
    <div className={styles.container}>
      {dashboardLoading && <DashboardLoader />}
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Dashboard</h2>
         <p className={styles.subtitle}>
                   <span className={styles.highlightText}>{getWelcomeText()}</span>
                 </p>
        </div>
        {/* <div className={styles.headerActions}>
          <span className={styles.userBadge}>{role_name}</span>
        </div> */}
      </div>

      {/* Filters */}
      {(userRole === "1" || userRole === "2") && (
        <div className="row g-3 align-items-end mb-3">
          {userUniv === "0" && (
            <div className="col-md-4">
              <label className={styles.dateLabel}>University</label>
              <select
                className="form-select"
                value={selectedFilterUniversity}
                onChange={(e) => {
                  setSelectedFilterUniversity(e.target.value);
                  setSelectedFilterCollege("");
                  getCollege(e.target.value);
                }}
              >
                <option value="">-- Select University --</option>
                {filterUniversity.map(u => (
                  <option key={u.id_university} value={u.id_university}>{u.name}</option>
                ))}
              </select>
            </div>
          )}
          {userCollege === "0" && (
            <div className="col-md-4">
              <label className={styles.dateLabel}>College</label>
              <select
                className="form-select"
                value={selectedFilterCollege}
                onChange={(e) => setSelectedFilterCollege(e.target.value)}
              >
                <option value="">-- Select College --</option>
                {filterCollege.map(c => (
                  <option key={c.id} value={c.id}>{c.college_name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="col-md-4 d-flex gap-2 align-items-end">
            <button className={styles.applyFilterBtn} onClick={handleApplyFilter}>
              <FontAwesomeIcon icon={faFilter} /> Apply Filter
            </button>
            <button
              className={styles.clearFilterBtn}
              onClick={() => {
                setSelectedFilterUniversity("");
                setSelectedFilterCollege("");
                setSelectedFilterDepartment("");
                setFilterCollege([]);
                setAppliedFilters({
                  university: "",
                  college: "",
                  department: ""
                });
                setAllPage(1);
                setCurrentPage(1);
                setUpcomingPage(1);
              }}
            >
              <FontAwesomeIcon icon={faCircleXmark} /> Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className={styles.overviewSection}>
        <div className={styles.statsGrid}>
          {[
            { icon: faUsers, value: totalStudents, label: "Total Student" },
              { icon: faCalendarAlt, value: totalEvents, label: "Total Events" },      
              { icon: faCalendarPlus, value: currentEvents, label: "Current Events" },
              { icon: faClock, value: upcomingEvents, label: "Upcoming Events" },
              { icon: faTimesCircle, value: closedEvents, label: "Closed Events" },
                    
              { icon: faCheckCircle, value: totalVolunteer, label: "Total Volunteer" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={styles.statCard}
              onClick={() => navigate(cardRoutes[item.label])}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.statIcon}>
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statNumber}>{formatNumber(item.value)}</div>
                <div className={styles.statLabel}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>
  {/* Locations & QR Modal */}
      {showLocationsModal && selectedEventForLocations && (
        <div className={styles.modalOverlay} >
           <div className={styles.locationsModal}  ref={locationsModalRef}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Locations & QR - {toTitleCase(selectedEventForLocations.eventTitle)}
              </h3>
              <button className={styles.closeButton} onClick={() => setShowLocationsModal(false)}>×</button>
            </div>
            <div className={styles.locationsTableWrapper}>
              {locationsLoading ? (
                <PageLoader message="Loading locations..." />
              ) : (
                <table className="table table-bordered table-hover mb-0">
                  <thead>
                    <tr>
                      <th className={styles.table_head}>S.No</th>
                      <th className={styles.table_head}>Location</th>
                      <th className={styles.table_head}>Address</th>
                      <th className={styles.table_head}>Map</th>
                      <th className={styles.table_head}>POC</th>
                       <th className={styles.table_head} style={{ textAlign: 'center' }}>No.of Volunteer</th>
                      <th className={styles.table_head}>QR Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventLocations.length > 0 ? eventLocations.map((loc, index) => (
                      <tr key={loc.id}>
                        <td>{index + 1}</td>
                        <td>{toTitleCase(loc.eventLocation)}</td>
                        <td>{loc.address || "-"}</td>
                        <td>
                          {loc.locationMap ? (
                            <button
                              className={styles.iconButton}
                              onClick={() => window.open(loc.locationMap, "_blank")}
                              title="Open Map"
                            >
                              <FontAwesomeIcon icon={faMapMarkedAlt} />
                            </button>
                          ) : "-"}
                        </td>
                        <td>{loc.POC || "-"}</td>
                        <td style={{ textAlign: 'center' }}> <span className={loc.total_volunteer>0 ? styles.badgeGreen: styles.badgeRed}>{loc.total_volunteer||0}</span></td>
                        <td>
                          <button 
                            className={styles.qrButton} 
                            onClick={() => handleShowQR(loc)} 
                            title="Show QR Code"
                          >
                            <FontAwesomeIcon icon={faQrcode} /> QR: {loc.id}
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className={styles.noData}>No locations found for this event</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.qrModal} ref={qrModalRef}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>QR Code - {qrLocationName}</h3>
              <button className={styles.closeButton} onClick={() => setShowQRModal(false)}>×</button>
            </div>
            <div className={styles.qrContainer}>
              <QRCode value={qrValue} size={250} />
              <p className={styles.qrCode}>Location ID: {qrValue}</p>
            </div>
          </div>
        </div>
      )}
   
        <div className={styles.systemSection} style={{display:'none'}}>
          <div className={styles.sectionHeaderRow}>
            <h3 className={styles.sectionTitle}>Event Activity</h3>
          
          </div>

          <div className={styles.tableWrapper}>
             {loading ? (
                    <PageLoader message="Loading Event List..." />
                  ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className={styles.table_head}>Sno</th>
                  <th className={styles.table_head}>Event Name</th>
                  <th className={styles.table_head}>Start Date</th>
                  <th className={styles.table_head}>End Date</th>    
                  <th className={styles.table_head} style={{ textAlign: 'center' }}>No.of Volunteer</th>  
                  <th className={styles.table_head}>Category</th>            
                  <th className={styles.table_head}>View Details </th>
                </tr>
              </thead>
             <tbody>
                {(() => {
                  const tableData =
                    activeEventTab === "all"
                      ? allEventsList
                      : activeEventTab === "current"
                      ? currentEventsList
                      : upcomingEventsList;

                  if (tableData.length === 0) {
                    return (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", padding: "20px 0" }}>
                          No {activeEventTab.charAt(0).toUpperCase() + activeEventTab.slice(1)} Events
                        </td>
                      </tr>
                    );
                  }

                  const pageIndex =
                    activeEventTab === "all"
                      ? allPage
                      : activeEventTab === "current"
                      ? currentPage
                      : upcomingPage;

                  return tableData.map((e, i) => {
                    const sno = (pageIndex - 1) * pageSize + i + 1;

                    return (
                      <tr key={e.id}>
                        <td>{sno}</td>
                        <td>{e.eventTitle}</td>
                        <td>{formatDateTime(e.startDate)}</td>
                        <td>{formatDateTime(e.endDate)}</td>
                        <td style={{ textAlign: 'center' }}> <span className={e.total_volunteer>0 ? styles.badgeGreen: styles.badgeRed}>{e.total_volunteer||0}</span></td>
                        <td>{toTitleCase(e.categoryName)}</td>
                        <td>
                          <button 
                            className={styles.locationsButton} 
                            onClick={() => handleViewLocations(e)}
                            title="View Locations & QR"
                          >
                            <FontAwesomeIcon icon={faQrcode} /> Locations & QR
                          </button>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
             
            </table>
             )}
          </div>

          {/* Pagination */}
         {activeEventTab === "all" && totalAllPages > 0 && (
            <div className={styles.tableFooter}>
              <div>Showing {allStartIndex} to {allEndIndex} of {allTotalEntries} entries</div>
              <div className={styles.paginationContainer}>
                <button
                  className={`${styles.paginationBtn} ${allPage === 1 ? styles.disabledBtn : ""}`}
                  onClick={() => allPage > 1 && setAllPage(allPage - 1)}
                >
                  Prev
                </button>
          
                {generatePageNumbers(allPage, totalAllPages).map((p, i) =>
                  p === "..." ? (
                    <span key={i} className={styles.paginationBtn}>...</span>
                  ) : (
                    <button
                      key={p}
                      className={`${styles.paginationBtn} ${allPage === p ? styles.activePage : ""}`}
                      onClick={() => setAllPage(p)}
                    >
                      {p}
                    </button>
                  )
                )}
          
                <button
                  className={`${styles.paginationBtn} ${allPage === totalAllPages ? styles.disabledBtn : ""}`}
                  onClick={() => allPage < totalAllPages && setAllPage(allPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
