import React, { useState, useEffect } from 'react';
import styles from './City.module.css';
import Swal from 'sweetalert2';

const API_BASE = "http://127.0.0.1:8000/api/setting/city/";

const City = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [formData, setFormData] = useState({
    id_state: '',
    name: '',
  });

  // ==========================
  // 🔹 Fetch Cities (Datatable API)
  // ==========================
  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}datatable/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: currentPage,
          length: entriesPerPage,
          search: searchTerm,
          is_active: true
        })
      });

      const data = await response.json();
      if (response.ok) {
        // Assuming response.data contains list of cities
        setCities(data.data || []);
      } else {
        console.error("Error fetching cities:", data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [currentPage, entriesPerPage, searchTerm]);

  // ==========================
  // 🔹 Handle Form Input Change
  // ==========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ==========================
  // 🔹 Add / Update City
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCity ? `${API_BASE}${editingCity.id}/` : API_BASE;
      const method = editingCity ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire('Success', editingCity ? "City updated successfully!" : "City added successfully!", 'success');
        fetchCities();
        handleCloseForm();
      } else {
        Swal.fire('Error', "Error: " + (data?.message || "Failed to save city"), 'error');
      }
    } catch (error) {
      console.error("Error saving city:", error);
      Swal.fire('Error', "Something went wrong while saving the city.", 'error');
    }
  };

  // ==========================
  // 🔹 Delete City
  // ==========================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this city?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE}delete/${id}/`, {
          method: "DELETE",
        });

        if (response.ok) {
          Swal.fire('Deleted!', "City deleted successfully!", 'success');
          fetchCities();
        } else {
          const data = await response.json();
          Swal.fire('Error', "Failed to delete city: " + (data?.message || ""), 'error');
        }
      } catch (error) {
        console.error("Error deleting city:", error);
        Swal.fire('Error', "Something went wrong while deleting the city.", 'error');
      }
    }
  };

  // ==========================
  // 🔹 Toggle Active/Inactive
  // ==========================
  const toggleActive = async (id) => {
    try {
      const response = await fetch(`${API_BASE}toggle-active/${id}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      if (response.ok) {
        Swal.fire('Success', "City status updated!", 'success');
        fetchCities();
      } else {
        const data = await response.json();
        Swal.fire('Error', "Failed to toggle status: " + (data?.message || ""), 'error');
      }
    } catch (error) {
      console.error("Error toggling city status:", error);
      Swal.fire('Error', "Something went wrong while toggling city status.", 'error');
    }
  };

  // ==========================
  // 🔹 Edit City
  // ==========================
  const handleEdit = (city) => {
    setEditingCity(city);
    setFormData({
      id_state: city.id_state,
      name: city.name
    });
    setShowForm(true);
  };

  // ==========================
  // 🔹 Close Form
  // ==========================
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCity(null);
    setFormData({ id_state: '', name: '' });
  };

  // ==========================
  // 🔹 Pagination Helper
  // ==========================
  const handleEntriesChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>City Management</h2>
        <button className={styles.primaryButton} onClick={() => setShowForm(true)}>+ Add City</button>
      </div>

      {/* Search Box */}
      <div className={styles.actions}>
        <input
          type="text"
          placeholder="Search city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingCity ? "Edit City" : "Create City"}</h3>
              <button className={styles.closeButton} onClick={handleCloseForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label>State ID *</label>
              <input
                type="number"
                name="id_state"
                value={formData.id_state}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />

              <label>City Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseForm}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingCity ? "Update City" : "Add City"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <p>Loading cities...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>State ID</th>
                <th>City Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.length > 0 ? (
                cities.map((city) => (
                  <tr key={city.id}>
                    <td>{city.id}</td>
                    <td>{city.id_state}</td>
                    <td>{city.name}</td>
                    <td>
                      <button
                        className={city.is_active ? styles.activeButton : styles.inactiveButton}
                        onClick={() => toggleActive(city.id)}
                      >
                        {city.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td>
                      <button className={styles.editButton} onClick={() => handleEdit(city)}>Edit</button>
                      <button className={styles.deleteButton} onClick={() => handleDelete(city.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No cities found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <label>Show</label>
        <select value={entriesPerPage} onChange={handleEntriesChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
        <span>entries</span>
      </div>
    </div>
  );
};

export default City;
