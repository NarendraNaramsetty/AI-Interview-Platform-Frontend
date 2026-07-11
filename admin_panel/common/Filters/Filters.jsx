import React, { useState } from "react";
import styles from "./Filters.module.css";

const Filters = ({ filters }) => {
  const [staff, setStaff] = useState("All Staff");
  const [university, setUniversity] = useState("All Universities");
  const [college, setCollege] = useState("All Colleges");
  const [department, setDepartment] = useState("All Departments");
  const [startDate, setStartDate] = useState(""); // New state for Start Date
  const [endDate, setEndDate] = useState("");     // New state for End Date
  const [userRole, setUserRole] = useState("All Roles");
  const [status, setStatus] = useState("All status");
  const [event, setEvent] = useState("All Events");
  const [post, setPost] = useState("All Posts");

  const staffOptions = ["All Staff", "John Smith", "Sarah Johnson", "Mike Chen", "Emily Davis", "Robert Wilson"];
  const universityOptions = ["All Universities", "Harvard University", "Stanford University", "MIT", "Oxford University", "Cambridge University"];
  const collegeOptions = ["All Colleges", "Engineering College", "Arts College", "Business School", "Medical College"];
  const departmentOptions = ["All Departments", "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Mathematics", "Physics"];
  const roleOptions = ["All Roles", "Admin", "Faculty", "Staff", "Student", "Guest"];
  const statusOptions = ["All status", "Active", "Inactive", "Pending", "Suspended"];
  const eventOptions = ["All Events", "Orientation", "Workshop", "Seminar", "Hackathon", "Meetup"];
  const postOptions = ["All Posts", "Announcements", "News", "Updates", "Opportunities"];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle filter submission logic here
    const filterData = {
      staff,
      university,
      college,
      department,
      startDate, // Use new startDate
      endDate,   // Use new endDate
      userRole,
      status,
      event,
      post,
    };

    console.log("Filter Data:", filterData);
    // You can pass this data to parent component or use it as needed
  };

  const handleReset = () => {
    setStaff("All Staff");
    setUniversity("All Universities");
    setCollege("All Colleges");
    setDepartment("All Departments");
    setStartDate(""); // Reset new startDate
    setEndDate("");   // Reset new endDate
    setUserRole("All Roles");
    setStatus("All status");
    setEvent("All Events");
    setPost("All Posts");
  };

  const order = filters && filters.length
    ? filters
    : [
      "staff", "university", "college", "department",
      "startDate", "endDate", "userRole", "status", "event", "post"
    ];

  const renderers = {
    staff: () => (
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Staff</label>
        <select
          value={staff}
          onChange={(e) => setStaff(e.target.value)}
          className={styles.filterSelect}
        >
          {staffOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    ),
    university: () => (
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>University</label>
        <select
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          className={styles.filterSelect}
        >
          {universityOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    ),
    college: () => (
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>College</label>
        <select
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          className={styles.filterSelect}
        >
          {collegeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    ),
    department: () => (
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Department</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className={styles.filterSelect}
        >
          {departmentOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    ),
    startDate: () => (
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={styles.datePickerInput} // New class for date pickers
        />
      </div>
    ),
    endDate: () => (
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>End Date</label>
        <input
          type="date"
          value={endDate}
          min={startDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={styles.datePickerInput} // New class for date pickers
        />
      </div>
    ),
    userRole: () => (
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>User Role</label>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className={styles.filterSelect}
        >
          {roleOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    ),
    status: () => (
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.filterSelect}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    ),
    event: () => (
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Event</label>
        <select
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          className={styles.filterSelect}
        >
          {eventOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    ),
    post: () => (
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Post</label>
        <select
          value={post}
          onChange={(e) => setPost(e.target.value)}
          className={styles.filterSelect}
        >
          {postOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    ),
  };


};

export default Filters;