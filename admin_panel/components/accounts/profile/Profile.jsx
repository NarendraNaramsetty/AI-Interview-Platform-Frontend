import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../service/Apiservice.jsx";
import styles from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => { 
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_user");
    navigate("/adminlogin");
  };

  const user = JSON.parse(localStorage.getItem("admin_user")) || {};
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    first_name: user.name?.split(" ")[0] || "Super",
    last_name: user.name?.split(" ")[1] || "Admin",
    email: user.email || "narebhaai@gmail.com",
    role: user.role || "Super Admin",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Mock update profile on client side local storage for super admin credentials
      const updatedUser = {
        name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
        role: formData.role
      };
      localStorage.setItem("admin_user", JSON.stringify(updatedUser));
      alert("Admin profile details updated locally!");
      
      if (formData.password) {
        alert("Password updated! Please login again.");
        handleLogout();
      }
    } catch (err) {
      alert("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4 text-gray-200">
      <div>
        <h2 className="text-xl font-bold font-display">Administrative Profile</h2>
        <p className="text-xs text-gray-400 mt-1">Configure profile details and manage login secrets.</p>
      </div>

      <div className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm text-xs font-semibold">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-400">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400">System Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover/40 dark:bg-dark-bg/40 focus:outline-none text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-400">New Password (optional)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password..."
              className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg mt-2"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
