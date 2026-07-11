import React, { useState, useEffect } from 'react';
import styles from './Country.module.css';
import Swal from 'sweetalert2';

const Country = () => {
  const [countries, setCountries] = useState([]); // current page rows returned by server
  const [totalRecords, setTotalRecords] = useState(0); // total records on server (for pagination)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCountry, setNewCountry] = useState({
    name: '',
    code: '',
    isoCode: '',
    phonecode: '',
    is_active: 1,
    is_deleted: false,
  });
  const [editingCountryId, setEditingCountryId] = useState(null);

  // Pagination (these drive server-side datatable requests)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const statusOptions = ['All', 'Active', 'Inactive'];
  const itemsPerPageOptions = [10, 50, 100, 500, 2000, 5000];

  // Fetch whenever paging / filtering / searching changes
  useEffect(() => {
    fetchCountries(currentPage, itemsPerPage, searchTerm, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, searchTerm, statusFilter]);

  /**
   * Fetch countries from datatable endpoint using server-side paging.
   * It sends: page, length, search, is_active
   * Tries to detect several datatable response shapes:
   * - { data: [...], recordsFiltered: N }
   * - { results: [...], count: N }
   * - an array [...] (then totalRecords = array.length)
   */
  const fetchCountries = async (page = 1, length = 10, search = '', status = 'All') => {
    try {
      const payload = {
        page,
        length,
        search: (search ?? '').toString(),
      };
      if (status !== 'All') {
        payload.is_active = status === 'Active' ? 1 : 0; // send as number 1/0
      }

      const response = await fetch('http://127.0.0.1:8000/api/setting/country/datatable/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Failed to fetch countries:', response.status, await response.text());
        setCountries([]);
        setTotalRecords(0);
        return;
      }

      const data = await response.json();

      // Common shapes:
      // 1) { data: [...], recordsFiltered: N }  <-- DataTables-like
      // 2) { results: [...], count: N }         <-- DRF paginated
      // 3) { data: [...] }                      <-- some custom
      // 4) [...] array directly
      // we'll try these in order:

      let rows = [];
      let total = 0;

      if (data == null) {
        rows = [];
        total = 0;
      } else if (Array.isArray(data)) {
        rows = data;
        total = data.length;
      } else if (Array.isArray(data.data)) {
        rows = data.data;
        // recordsFiltered / recordsTotal are common
        total = data.recordsFiltered ?? data.recordsTotal ?? data.total ?? rows.length;
      } else if (Array.isArray(data.results)) {
        rows = data.results;
        total = data.count ?? rows.length;
      } else if (Array.isArray(data.data?.data)) {
        // sometimes nested
        rows = data.data.data;
        total = data.data.recordsFiltered ?? data.data.total ?? rows.length;
      } else {
        // fallback: try to find first array property
        const firstArrayProp = Object.values(data).find((v) => Array.isArray(v));
        if (firstArrayProp) {
          rows = firstArrayProp;
          total = data.count ?? data.total ?? data.recordsFiltered ?? rows.length;
        } else {
          // unknown shape: if it has 'results' as object or single object, wrap it
          rows = [];
          total = 0;
        }
      }

      // Normalize each row to have consistent field names we use (iso_code)
      const normalized = rows.map((r) => ({
        id: r.id ?? r.pk ?? r.country_id ?? null,
        name: r.name ?? r.country_name ?? '',
        code: r.code ?? r.country_code ?? '',
        iso_code: r.iso_code ?? r.isoCode ?? r.iso ?? '',
        phonecode: r.phonecode ?? r.phone_code ?? r.phone ?? '',
        is_active: Number((r.is_active === true || r.is_active === 1 || r.active === true) ? 1 : 0),
        is_deleted: r.is_deleted ?? false,
        // keep original raw object in case other fields are needed later
        __raw: r,
      }));

      setCountries(normalized);
      setTotalRecords(Number(total) || normalized.length);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
      setTotalRecords(0);
    }
  };

  // Add (POST)
  const addCountryToApi = async (countryData) => {
    try {
      const payload = {
        name: countryData.name,
        code: countryData.code,
        iso_code: countryData.isoCode,
        phonecode: countryData.phonecode,
      };

      const response = await fetch('http://127.0.0.1:8000/api/setting/country/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // refresh current page (server will return current page based on params)
        fetchCountries(currentPage, itemsPerPage, searchTerm, statusFilter);
      } else {
        console.error('Error adding country:', await response.text());
      }
    } catch (error) {
      console.error('Error adding country:', error);
    }
  };

  // Update (PUT)
  const updateCountryInApi = async (id, countryData) => {
    try {
      const payload = {
        name: countryData.name,
        code: countryData.code,
        iso_code: countryData.isoCode,
        phonecode: countryData.phonecode,
      };

      const response = await fetch(`http://127.0.0.1:8000/api/setting/country/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchCountries(currentPage, itemsPerPage, searchTerm, statusFilter);
      } else {
        console.error('Error updating country:', await response.text());
      }
    } catch (error) {
      console.error('Error updating country:', error);
    }
  };

  // Delete (DELETE) - then refresh current page
  const deleteCountryInApi = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/setting/country/delete/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // backend returns {"status":"success","message":"Country deleted successfully"}
        const json = await response.json().catch(() => null);
        if (json?.status === 'success') {
          // If deleting the last item on the last page, move back a page if needed
          const newTotal = Math.max(0, totalRecords - 1);
          const lastPage = Math.max(1, Math.ceil(newTotal / itemsPerPage));
          if (currentPage > lastPage) {
            setCurrentPage(lastPage);
            // fetch will be triggered by useEffect because currentPage changes
          } else {
            // refresh same page
            fetchCountries(currentPage, itemsPerPage, searchTerm, statusFilter);
          }
        } else {
          // even if backend didn't return success flag, refresh to get authoritative state
          fetchCountries(currentPage, itemsPerPage, searchTerm, statusFilter);
        }
      } else {
        console.error('Error deleting country:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting country:', error);
    }
  };

  // Toggle country active status with optimistic UI and server persistence
  const handleToggleStatus = async (country, newStatus) => {
    const desired = newStatus === 'active' ? 1 : 0;
    const prevVal = country.is_active;

    // optimistic update
    setCountries(prev => prev.map(c => (
      c.id === country.id ? { ...c, is_active: desired } : c
    )));

    try {
      const resp = await fetch(`http://127.0.0.1:8000/api/setting/country/toggle-active/${country.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ is_active: desired })
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || err.message || 'Failed to toggle status');
      }

      // refresh to sync with server
      await fetchCountries(currentPage, itemsPerPage, searchTerm, statusFilter);
    } catch (e) {
      // rollback on error
      setCountries(prev => prev.map(c => (
        c.id === country.id ? { ...c, is_active: prevVal } : c
      )));
      Swal.fire('Error', e.message || 'Unable to toggle country status', 'error');
    }
  };

  // Filtering logic used only for client-side search fallback (not primary)
  const clientFilteredCountries = countries.filter((country) => {
    const q = searchTerm?.toLowerCase() ?? '';
    const matchesSearch =
      !q ||
      (country.name && country.name.toLowerCase().includes(q)) ||
      (country.code && country.code.toLowerCase().includes(q)) ||
      (country.iso_code && country.iso_code.toLowerCase().includes(q));
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && country.is_active === 1) ||
      (statusFilter === 'Inactive' && country.is_active === 0);
    return matchesSearch && matchesStatus && !country.is_deleted;
  });

  // Current page's rows are exactly "countries" (server returned page). But in case server returned
  // a larger set, we slice client-side as a fallback:
  const displayedCountries =
    countries.length <= itemsPerPage ? clientFilteredCountries.slice(0, itemsPerPage) : countries;

  // Handlers (edit/delete/add)
  const handleEdit = (id) => {
    const countryToEdit = countries.find((c) => c.id === id) ?? countries.find((c) => c.__raw?.id === id);
    if (!countryToEdit) return;
    setNewCountry({
      name: countryToEdit.name ?? '',
      code: countryToEdit.code ?? '',
      isoCode: countryToEdit.iso_code ?? countryToEdit.isoCode ?? '',
      phonecode: countryToEdit.phonecode ?? '',
      is_active: countryToEdit.is_active ?? 1,
      is_deleted: countryToEdit.is_deleted ?? false,
      status: (countryToEdit.is_active ?? 1) === 1 ? 'Active' : 'Inactive',
    });
    setEditingCountryId(id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this country? This action cannot be undone.",
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
      deleteCountryInApi(id);
    }
  };

  const handleAddOrUpdateCountry = (e) => {
    e.preventDefault();
    if (newCountry.name && newCountry.code && newCountry.phonecode) {
      const countryData = {
        name: newCountry.name,
        code: newCountry.code,
        isoCode: newCountry.isoCode,
        phonecode: newCountry.phonecode,
        is_active: newCountry.is_active,
        is_deleted: false,
      };

      if (editingCountryId) {
        updateCountryInApi(editingCountryId, countryData);
      } else {
        addCountryToApi(countryData);
      }

      resetForm();
      setShowAddForm(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'status') {
      setNewCountry((prev) => ({
        ...prev,
        is_active: value === 'Active' ? 1 : 0,
        status: value,
      }));
    } else {
      setNewCountry((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setNewCountry({
      name: '',
      code: '',
      isoCode: '',
      phonecode: '',
      is_active: 1,
      is_deleted: false,
      status: 'Active',
    });
    setEditingCountryId(null);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page < 1) return;
    const last = Math.max(1, Math.ceil(totalRecords / itemsPerPage) || 1);
    if (page > last) page = last;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    const val = Number(e.target.value) || 10;
    setItemsPerPage(val);
    setCurrentPage(1);
  };

  // Render pagination buttons (uses server totalRecords to determine pages)
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    buttons.push(
      <li key="prev" className={styles.pageItem}>
        <button
          className={styles.pageButton}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
      </li>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li key={i} className={`${styles.pageItem} ${currentPage === i ? styles.active : ''}`}>
          <button
            className={`${styles.pageButton} ${currentPage === i ? styles.pageButtonActive : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    buttons.push(
      <li key="next" className={styles.pageItem}>
        <button
          className={styles.pageButton}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </li>
    );

    return buttons;
  };

  // Compute S.No base for server-side pagination
  const snoBase = (currentPage - 1) * itemsPerPage;

  // Status Toggle Component (UI/behavior aligned with Submenu)
  const StatusToggle = ({ country }) => {
    const [localStatus, setLocalStatus] = useState(country.is_active === 1 ? 'active' : 'inactive');

    useEffect(() => {
      setLocalStatus(country.is_active === 1 ? 'active' : 'inactive');
    }, [country.is_active]);

    const handleClick = () => {
      const newStatus = localStatus === 'active' ? 'inactive' : 'active';
      setLocalStatus(newStatus); // optimistic UI
      handleToggleStatus(country, newStatus);
    };

    return (
      <div className={styles.statusToggle} onClick={handleClick}>
        <div className={`${styles.toggleSwitch} ${styles[localStatus]}`}>
          <div className={styles.toggleKnob}></div>
        </div>
        <span className={`${styles.statusText} ${styles[localStatus]}`}>
          {localStatus === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>
    );
  };

  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Country Management</h2>
          <p className={styles.subtitle}>Manage countries and related information</p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!showAddForm) resetForm();
          }}
        >
          {showAddForm ? 'Cancel' : 'Create Country'}
        </button>
      </div>

      {showAddForm && (
        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>
            {editingCountryId ? 'Edit Country' : 'Create Country'}
          </h3>
          <form onSubmit={handleAddOrUpdateCountry} className={styles.countryForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Country Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newCountry.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., United States"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Country Code *</label>
                <input
                  type="text"
                  name="code"
                  value={newCountry.code}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., US"
                  maxLength="2"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>ISO Code</label>
                <input
                  type="text"
                  name="isoCode"
                  value={newCountry.isoCode}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., USA"
                  maxLength="3"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Code *</label>
                <input
                  type="text"
                  name="phonecode"
                  value={newCountry.phonecode}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., +1"
                  required
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {editingCountryId ? 'Update Country' : 'Add Country'}
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.controlsSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search countries..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset page when searching
            }}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.filterSelect}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option} Status
              </option>
            ))}
          </select>
        </div>

        <div className={styles.summary}>
          <span className={styles.summaryText}>
            Showing {totalRecords === 0 ? 0 : Math.min(totalRecords, (currentPage - 1) * itemsPerPage + displayedCountries.length)} of {totalRecords} countries
          </span>
        </div>
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.th}>S.No</th>
                <th className={styles.th}>Country</th>
                <th className={styles.th}>Codes</th>
                <th className={styles.th}>Phone</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {displayedCountries.map((country, index) => (
                <tr key={country.id ?? index} className={styles.tableRow}>
                  <td className={styles.td}>{snoBase + index + 1}</td>
                  <td className={styles.td}>{country.name}</td>
                  <td className={styles.td}>
                    <div>
                      <div>Code: {country.code}</div>
                      <div>ISO: {country.iso_code}</div>
                    </div>
                  </td>
                  <td className={styles.td}>{country.phonecode}</td>
                  <td className={styles.td}>
                    <StatusToggle country={country} />
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(country.id)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(country.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {displayedCountries.length === 0 && (
                <tr>
                  <td className={styles.td} colSpan={6} style={{ textAlign: 'center' }}>
                    No countries found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalRecords > 0 && (
          <div className={styles.tableFooter}>
            <div className={styles.entriesControl}>
              <span className={styles.entriesLabel}>Show:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className={styles.entriesSelect}
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className={styles.entriesText}>entries</span>
            </div>

            <div className={styles.tableInfo}>
              <span className={styles.pageInfo}>
                Showing {snoBase + 1} to {snoBase + displayedCountries.length} of {totalRecords} entries
              </span>
            </div>

            <nav>
              <ul className={styles.pagination}>{renderPaginationButtons()}</ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Country;
