import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Visitlogs.module.css";
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Visitlogs = () => {
  const navigate = useNavigate();

  /* -------------------- AUTH -------------------- */
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.info("You have been logged out", { autoClose: 1000 });
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userRole = user?.id_role || "";

  /* -------------------- STATES -------------------- */
  const [visitlogs, setVisitlogs] = useState([]);
  const [totalVisitlogs, setTotalVisitlogs] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  /* -------------------- FETCH VISIT LOGS -------------------- */
  const fetchVisitlogs = async () => {
    setLoading(true);

    try {
      const payload = {
        page: currentPage,
        length: entriesPerPage,
        search: searchTerm,
        is_active: filter === "all" ? null : filter === "active",
        id_role: userRole,
        whichapp: "campuslife",
      };

      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await ApiService.getVisitlogsDataTable(payload);
      const data = response.data;

      if (data.status === "success") {
        setVisitlogs(
          (data.data || []).map((log) => ({
            id: log.id,
            full_name: log.full_name,
            mobile: log.mobile,
            email: log.email,
            college_name: log.college_name || "-",
            department_name: log.department_name || "-",
            action: log.action,
            details: log.details,
            login: log.login,
          }))
        );
        setTotalVisitlogs(data.total_records);
      } else {
        toast.error(data.message || "Failed to load Visitlogs");
      }
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        toast.error("Session expired. Please login again.", { autoClose: 1000 });
        handleLogout();
        return;
      }
      console.error(error);
      toast.error("❌ Error fetching Visitlogs data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitlogs();
  }, [filter, searchTerm, currentPage, entriesPerPage]);

  /* -------------------- PAGINATION -------------------- */
  const totalPages = Math.ceil(totalVisitlogs / entriesPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 10;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  /* -------------------- UI -------------------- */
  return (
    <div className={styles.container}>
      <ToastContainer />

      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Logs List</h2>
      </div>

      {/* Filters */}
      <div className={styles.actions}>
        <input
          type="text"
          placeholder="Search by name..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className={styles.filterButtons}>
      
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.loadingText}>Loading Visitlogs...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className="table table-bordered table-hover">
            <thead className="bg-primary text-white">
              <tr>
                <th className={styles.table_head}>S.No</th>
                <th className={styles.table_head}>Full Name</th>
                <th className={styles.table_head}>Mobile</th>
                <th className={styles.table_head}>Email</th>
                <th className={styles.table_head}>College</th>
                <th className={styles.table_head}>Department</th>
                <th className={styles.table_head}>Action</th>
                <th className={styles.table_head}>Details</th>
                <th className={styles.table_head}>Login Time</th>
              </tr>
            </thead>
            <tbody>
              {visitlogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className={styles.emptyRow}>
                    No Record Data found
                  </td>
                </tr>
              ) : (
                visitlogs.map((log, index) => (
                  <tr key={log.id}>
                    <td>
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td>{log.full_name}</td>
                    <td>{log.mobile}</td>
                    <td>{log.email}</td>
                    <td>{log.college_name}</td>
                    <td>{log.department_name}</td>
                    <td>
                      <span className={styles.actionBadge}>
                        {log.action}
                      </span>
                    </td>
                      <td>{log.details}</td>
                    <td>
                      {log.login
                        ? new Date(log.login).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.tableFooter}>
            <div className={styles.pageInfo}>
              Showing{" "}
              {visitlogs.length
                ? (currentPage - 1) * entriesPerPage + 1
                : 0}{" "}
              to {Math.min(currentPage * entriesPerPage, totalVisitlogs)} of{" "}
              {totalVisitlogs} entries
            </div>

            <div className={styles.pagination}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  className={currentPage === p ? styles.pageButtonActive : ""}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>

            <div className={styles.entriesControl}>
              <label>Show</label>
              <select value={entriesPerPage} onChange={handleEntriesChange}>
                {[10, 25, 50, 100, 1000].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visitlogs;
