import React, { useState, useEffect } from 'react';
import styles from './State.module.css';
import Swal from 'sweetalert2';

const State = () => {
  const [states, setStates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newState, setNewState] = useState({
    name: '',
    code: '',
    country: '',
    countryCode: '',
    capital: '',
    population: '',
    area: '',
    timezone: '',
    region: '',
    cities: '',
    languages: [],
    status: 'Active'
  });
  const [countriesList, setCountriesList] = useState([]);

  // Function to fetch countries
  const fetchCountries = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/setting/country/list/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        setCountriesList(data.data);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };
    // Toggle state active status (Submenu-style)
    const handleToggleStatus = async (row, newStatus) => {
      const desiredBool = newStatus === 'active';
  
      // optimistic update
      setStates(prev => prev.map(s => (
        s.id === row.id ? { ...s, status: desiredBool ? 'Active' : 'Inactive' } : s
      )));
  
      try {
        const resp = await fetch(`http://127.0.0.1:8000/api/setting/state/toggle-active/${row.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ is_active: desiredBool })
        });
  
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.detail || err.message || 'Failed to toggle status');
        }
  
        // refresh current list to sync with server selections
        await fetchStates();
      } catch (e) {
        // rollback on error
        setStates(prev => prev.map(s => (
          s.id === row.id ? { ...s, status: row.status } : s
        )));
        console.error('Error toggling state status:', e);
        Swal.fire('Error', e.message || 'Unable to toggle state status', 'error');
      }
    };
  
    // Status Toggle Component (mirrors Submenu)
    const StatusToggle = ({ row }) => {
      const [localStatus, setLocalStatus] = useState(row.status === 'Active' ? 'active' : 'inactive');
  
      useEffect(() => {
        setLocalStatus(row.status === 'Active' ? 'active' : 'inactive');
      }, [row.status]);
  
      const onClick = () => {
        const ns = localStatus === 'active' ? 'inactive' : 'active';
        setLocalStatus(ns);
        handleToggleStatus(row, ns);
      };
  
      return (
        <div className={styles.statusToggle} onClick={onClick}>
          <div className={`${styles.toggleSwitch} ${styles[localStatus]}`}>
            <div className={styles.toggleKnob}></div>
          </div>
          <span className={`${styles.statusText} ${styles[localStatus]}`}>
            {localStatus === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      );
    };

  // Function to fetch states with server-side pagination
  const fetchStates = async (page = 1, pageSize = 10, search = "") => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/setting/state/datatable/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: page,
          length: pageSize,
          search: search,
          is_active: statusFilter === 'All' ? undefined : statusFilter === 'Active'
        }),
      });

      if (!response.ok) throw new Error(`Failed: ${response.status}`);

      const data = await response.json();

      if (data.status === "success") {
        const mappedStates = data.data.map((item) => ({
          id: item.id,
          name: item.name,
          country: item.country_name || "N/A",
          code: item.country_code || "—",
          phonecode: item.phonecode || "—",
          status: item.is_active ? "Active" : "Inactive",
        }));

        setStates(mappedStates);
        setTotalItems(data.recordsFiltered || data.data.length);
        setCurrentPage(page);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when filters or pagination changes
  useEffect(() => {
    fetchCountries();
    fetchStates(currentPage, itemsPerPage, searchTerm);
  }, [currentPage, itemsPerPage, statusFilter, searchTerm]);


  const countries = ["All", ...countriesList.map(c => c.name)];
  const regions = ["All", "West", "South", "Northeast", "Southeast", "Central Canada", "Northwest", "Midwest"];
  const statusOptions = ["All", "Active", "Inactive"];
  const timezones = ["PST", "MST", "CST", "EST", "AST", "AKST", "HST", "AEST", "IST", "CET", "GMT"];
  const itemsPerPageOptions = [10, 50, 100, 1000,5000];

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Current states are already paginated from the server
  const currentStates = states;

const handleEdit = (id) => {
  const stateToEdit = states.find((s) => s.id === id);
  if (!stateToEdit) return;

  setNewState({
    country: stateToEdit.country,
    name: stateToEdit.name,
  });

  setEditId(id);
  setIsEditing(true);
  setShowAddForm(true);
};

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this state? This action cannot be undone.",
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
        const response = await fetch(`http://127.0.0.1:8000/api/setting/state/delete/${id}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
          // Only update the UI after successful backend deletion
          setStates(prevStates => prevStates.filter((state) => state.id !== id));

          // Show success message
          Swal.fire('Deleted!', "State deleted successfully!", 'success');

          // Refresh the states list to ensure UI is in sync with the database
          await fetchStates();
        } else {
          const errorMessage = data.message || response.statusText || "Unknown error";
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error("Error deleting state:", error);
        Swal.fire('Error', `Failed to delete state: ${error.message}`, 'error');

        // Refresh the states list to ensure UI is in sync with the database
        await fetchStates();
      }
    }
  };

   const handleUpdateState = async (e) => {
  e.preventDefault();

  const selectedCountry = countriesList.find(
    (c) => c.name === newState.country
  );
  const countryId = selectedCountry ? selectedCountry.id : null;

  if (!countryId || !newState.name) {
    Swal.fire('Warning', "Please select a country and enter a state name.", 'warning');
    return;
  }

  try {
    const payload = {
      id_country: countryId,
      name: newState.name.trim(),
    };

    const response = await fetch(`http://127.0.0.1:8000/api/setting/state/${editId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      Swal.fire('Success', "State updated successfully!", 'success');
      await fetchStates(currentPage, itemsPerPage, searchTerm);

      // Reset form
      setNewState({ name: "", country: "" });
      setShowAddForm(false);
      setIsEditing(false);
      setEditId(null);
    } else {
      Swal.fire('Error', `Failed to update state: ${data.message || "Unknown error"}`, 'error');
    }
  } catch (error) {
    console.error("Error updating state:", error);
    Swal.fire('Error', "Something went wrong while updating the state.", 'error');
  }
};


  const handleAddState = async (e) => {
    e.preventDefault();

    // Find selected country ID based on dropdown value
    const selectedCountry = countriesList.find(
      (c) => c.name === newState.country
    );
    const countryId = selectedCountry ? selectedCountry.id : null;

    if (!countryId || !newState.name) {
      Swal.fire('Warning', "Please select a country and enter a state name.", 'warning');
      return;
    }

    try {
      // Prepare payload for Django API
      const payload = {
        id_country: countryId,
        name: newState.name.trim(),
      };

      const response = await fetch("http://127.0.0.1:8000/api/setting/state/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        Swal.fire('Success', "State added successfully!", 'success');

        // Update state list UI
        setStates((prev) => [
          ...prev,
          { id_country: countryId, name: newState.name },
        ]);

        // Reset form
        setNewState({
          country: "",
          name: "",
        });

        setShowAddForm(false);
      } else {
        Swal.fire('Error', `Failed to add state: ${data.message || "Unknown error"}`, 'error');
      }
    } catch (error) {
      console.error("Error adding state:", error);
      Swal.fire('Error', "Something went wrong while adding the state.", 'error');
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (e) => {
    const languages = e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang);
    setNewState(prev => ({
      ...prev,
      languages
    }));
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchStates(page, itemsPerPage, searchTerm);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    fetchStates(1, newItemsPerPage, searchTerm);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Reset to first page when searching
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    fetchStates(1, itemsPerPage, value);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCountryFilter('All');
    setRegionFilter('All');
    setCurrentPage(1);
    fetchStates(1, itemsPerPage, '');
  };



  const getStatusColor = (status) => {
    return status === 'Active' ? '#27ae60' : '#e74c3c';
  };

  const getCountryColor = (country) => {
    const colors = {
      'United States': '#3498db',
      'Canada': '#e74c3c',
      'Australia': '#f39c12',
      'India': '#27ae60',
      'Germany': '#2c3e50',
      'United Kingdom': '#9b59b6',
      'France': '#1abc9c'
    };
    return colors[country] || '#95a5a6';
  };
  

  const getRegionColor = (region) => {
    const colors = {
      'West': '#3498db',
      'South': '#e74c3c',
      'Northeast': '#27ae60',
      'Southeast': '#f39c12',
      'Central Canada': '#9b59b6',
      'Northwest': '#1abc9c',
      'Midwest': '#34495e'
    };
    return colors[region] || '#95a5a6';
  };

  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>State Management</h2>
          <p className={styles.subtitle}>Manage states, provinces, and territories across countries</p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Create State'}
        </button>
      </div>

      {/* Add State Form */}
      {showAddForm && (
        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>Create State</h3>
          <form
              onSubmit={isEditing ? handleUpdateState : handleAddState}
              className={styles.stateForm}
            >
            <div className={styles.formGrid}>
              {/* Country Select */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Country *</label>
                <select
                  name="country"
                  value={newState.country}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Select Country</option>
                  {countriesList.map(country => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* State Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>State Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newState.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., California"
                  required
                />
              </div>
            </div>

            <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              {isEditing ? "Update State" : "Add State"}
            </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => {
                  setShowAddForm(false);
                  setNewState({ name: "", country: "" });
                  setIsEditing(false);
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}




      {/* Controls Section */}
      <div className={styles.controlsSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search states..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.summary}>
          <span className={styles.summaryText}>
            Showing {states.length} of {totalItems} states
            {isLoading && ' (Loading...)'}
          </span>
        </div>
      </div>

      {/* States Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
           <thead className={styles.tableHeader}>
                      <tr>
                        <th className={styles.th}>s.no</th>
                        <th className={styles.th}>Country</th>
                        <th className={styles.th}>State</th>
                        <th className={styles.th}>Country Phone Code</th>
                        <th className={styles.th}>Code</th>
                        <th className={styles.th}>Status</th>
                        <th className={styles.th}>Actions</th>
                      </tr>
                    </thead>

            <tbody className={styles.tableBody}>
              {currentStates.map((state, index) => {
                // Find the country details from countriesList to get the phone code
                const countryInfo = countriesList.find(c => c.name === state.country);
                const phoneCode = countryInfo ? countryInfo.phonecode || 'N/A' : 'N/A';

                return (
                  <tr key={state.id || index} className={styles.tableRow}>
                    <td className={styles.td}>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Serial No */}
                    <td className={styles.td}>{state.country}</td>
                    <td className={styles.td}>{state.name}</td>
                    <td className={styles.td}>{phoneCode}</td>
                   
                    <td className={styles.td}>{state.code || '—'}</td>
                     <td className={styles.td}><StatusToggle row={state} /></td>
                    <td className={styles.td}>
                      <div className={styles.actionButtons}>
                        <button
                          className={`${styles.actionLink} ${styles.editLink}`}
                          onClick={() => handleEdit(state.id)}
                          title="Edit State"
                        >
                          Edit
                        </button>
                        <span className={styles.actionSeparator}>|</span>
                        <button
                          className={`${styles.actionLink} ${styles.deleteLink}`}
                          onClick={() => handleDelete(state.id)}
                          title="Delete State"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>

          {!isLoading && states.length === 0 && (
            <div className={styles.noResults}>
              <p>No states found matching your criteria.</p>
            </div>
          )}

          {/* Table Footer with Pagination */}
          {!isLoading && (
            <div className={styles.tableFooter}>
              <div className={styles.entriesControl}>
                <span className={styles.entriesLabel}>Show</span>
                <select
                  className={styles.entriesSelect}
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  disabled={isLoading}
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className={styles.entriesLabel}>entries</span>
              </div>

              <div className={styles.tableInfo}>
                <span className={styles.pageInfo}>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                </span>
              </div>

              <div className={styles.pagination}>

                <button
                  className={styles.pageButton}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    className={`${styles.pageButton} ${currentPage === page ? styles.pageButtonActive : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className={styles.pageButton}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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

export default State;