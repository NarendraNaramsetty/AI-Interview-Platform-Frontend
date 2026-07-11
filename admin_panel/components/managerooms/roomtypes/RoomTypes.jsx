import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RoomTypes.module.css';
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import Swal from 'sweetalert2';
import "react-toastify/dist/ReactToastify.css";

// ─── Import Modal Component ──────────────────────────────────────────────────
const ImportModal = ({ onClose, onImportDone }) => {
  const [step, setStep] = useState(1);
  const [excelFile, setExcelFile] = useState(null);
  const [validRows, setValidRows] = useState([]);
  const [errorRows, setErrorRows] = useState([]);
  const [result, setResult]       = useState(null);
  const [previewTab, setPreviewTab] = useState("valid");
  const excelRef = useRef(null);

  // ── Sample downloads ─────────────────────────────────────────────
  const downloadSample = async () => {
    try {
      const res = await ApiService.downloadRoomTypeSample();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a"); a.href = url;
      a.download = "room_types_sample.xlsx"; a.click();
      window.URL.revokeObjectURL(url);
    } catch { toast.error("Failed to download sample Excel"); }
  };

  // ── File handlers ─────────────────────────────────────────────────
  const handleExcelFile = (f) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Please upload a .xlsx Excel file"); return;
    }
    setExcelFile(f);
  };

  // ── Validate ──────────────────────────────────────────────────────
  const handleValidate = async () => {
    if (!excelFile) { toast.warning("Please select the Excel file"); return; }
    setStep(2);
    try {
      const fd = new FormData();
      fd.append("excel_file", excelFile);
      fd.append("step", "validate");
      const res = await ApiService.importRoomTypes(fd);
      const d = res.data;
      if (d.status === "success") {
        setValidRows(d.valid_rows || []);
        setErrorRows(d.error_rows || []);
        setPreviewTab(d.error_count > 0 ? "errors" : "valid");
        setStep(3);
      } else { toast.error(d.message || "Validation failed"); setStep(1); }
    } catch (e) { toast.error(e?.response?.data?.message || "Validation error"); setStep(1); }
  };

  // ── Import ────────────────────────────────────────────────────────
  const handleImport = async () => {
    if (validRows.length === 0) { toast.warning("No valid rows to import"); return; }
    setStep(4);
    try {
      const fd = new FormData();
      fd.append("excel_file", excelFile);
      fd.append("step", "import");
      const res = await ApiService.importRoomTypes(fd);
      const d = res.data;
      if (d.status === "success") { setResult(d); setStep(5); onImportDone(); }
      else { toast.error(d.message || "Import failed"); setStep(3); }
    } catch (e) { toast.error(e?.response?.data?.message || "Import error"); setStep(3); }
  };

  // ── Drag helpers ──────────────────────────────────────────────────
  const [excelDrag, setExcelDrag] = useState(false);

  return (
    <div className={styles.importOverlay}>
      <div className={styles.importModal}>

        {/* Header */}
        <div className={styles.importHeader}>
          <div className={styles.importHeaderLeft}>
            <span className={styles.importHeaderIcon}>📥</span>
            <div>
              <h3 className={styles.importHeaderTitle}>Bulk Import Room Types</h3>
              <p className={styles.importHeaderSub}>Upload Excel file</p>
            </div>
          </div>
          <button className={styles.importClose} onClick={onClose}>✕</button>
        </div>

        {/* Step bar */}
        <div className={styles.importSteps}>
          {["Upload Files","Validate","Preview","Import","Done"].map((label,i) => (
            <div key={i} className={`${styles.importStep} ${step > i+1 ? styles.importStepDone : step === i+1 ? styles.importStepActive : ""}`}>
              <div className={styles.importStepCircle}>{step > i+1 ? "✓" : i+1}</div>
              <span className={styles.importStepLabel}>{label}</span>
              {i < 4 && <div className={`${styles.importStepLine} ${step > i+1 ? styles.importStepLineDone : ""}`} />}
            </div>
          ))}
        </div>

        <div className={styles.importBody}>

          {/* ── STEP 1 — Upload Excel file ─────────────────── */}
          {step === 1 && (
            <div>
              {/* Sample downloads */}
              <div className={styles.importSampleRow}>
                <span className={styles.importSampleText}>📄 Download template to get started</span>
                <div className={styles.importSampleBtns}>
                  <button className={styles.importSampleBtn} onClick={downloadSample} title="Excel template only">
                    📊 Sample Excel
                  </button>
                </div>
              </div>

              {/* Upload zone */}
              <div className={styles.importUploadGrid}>

                {/* Excel zone */}
                <div className={styles.importUploadCard} style={{ width: '100%' }}>
                  <div className={styles.importUploadCardLabel}>
                    <span className={styles.importUploadCardIcon}>📊</span>
                    <div>
                      <p className={styles.importUploadCardTitle}>Excel File <span className={styles.importRequired}>*</span></p>
                      <p className={styles.importUploadCardSub}>Room data</p>
                    </div>
                  </div>
                  <div
                    className={`${styles.importDropZoneSm} ${excelDrag ? styles.importDropZoneActive : ""} ${excelFile ? styles.importDropZoneSelected : ""}`}
                    onDragOver={e => { e.preventDefault(); setExcelDrag(true); }}
                    onDragLeave={() => setExcelDrag(false)}
                    onDrop={e => { e.preventDefault(); setExcelDrag(false); handleExcelFile(e.dataTransfer.files[0]); }}
                    onClick={() => excelRef.current?.click()}
                  >
                    <input ref={excelRef} type="file" accept=".xlsx" style={{display:"none"}} onChange={e => handleExcelFile(e.target.files[0])} />
                    {excelFile ? (
                      <div className={styles.importFileChip}>
                        <span>📊</span>
                        <div className={styles.importFileChipInfo}>
                          <p className={styles.importFileName}>{excelFile.name}</p>
                          <p className={styles.importFileSize}>{(excelFile.size/1024).toFixed(1)} KB</p>
                        </div>
                        <button className={styles.importFileRemove} onClick={e => { e.stopPropagation(); setExcelFile(null); }}>✕</button>
                      </div>
                    ) : (
                      <>
                        <div className={styles.importDropIconSm}>☁️</div>
                        <p className={styles.importDropTitleSm}>Drag & drop or click</p>
                        <p className={styles.importDropSubSm}>.xlsx only</p>
                      </>
                    )}
                  </div>
                  <p className={styles.importUploadHint}>
                    Columns: Room Type Name, Price, Capacity, Bed Type, Room Dimensions, Taxes,
                    Available Rooms, Available Dates, Description, Room Features
                  </p>
                </div>

              </div>{/* end grid */}

              <div className={styles.importFooter}>
                <button className={styles.importCancelBtn} onClick={onClose}>Cancel</button>
                <button className={styles.importPrimaryBtn} onClick={handleValidate} disabled={!excelFile}>
                  Validate →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Validating */}
          {step === 2 && (
            <div className={styles.importCenterState}>
              <div className={styles.importSpinner} />
              <p className={styles.importStateTitle}>Validating your data…</p>
              <p className={styles.importStateSub}>Checking rows and matching image filenames</p>
            </div>
          )}

          {/* STEP 3 — Preview */}
          {step === 3 && (
            <div>
              <div className={styles.importSummaryCards}>
                <div className={`${styles.importSummaryCard} ${styles.importSummaryTotal}`}>
                  <span className={styles.importSummaryNum}>{validRows.length + errorRows.length}</span>
                  <span className={styles.importSummaryLabel}>Total Rows</span>
                </div>
                <div className={`${styles.importSummaryCard} ${styles.importSummaryValid}`}>
                  <span className={styles.importSummaryNum}>{validRows.length}</span>
                  <span className={styles.importSummaryLabel}>✓ Ready to Import</span>
                </div>
                <div className={`${styles.importSummaryCard} ${styles.importSummaryError}`}>
                  <span className={styles.importSummaryNum}>{errorRows.length}</span>
                  <span className={styles.importSummaryLabel}>✗ Has Errors</span>
                </div>
              </div>

              <div className={styles.importTabs}>
                <button className={`${styles.importTab} ${previewTab === "valid" ? styles.importTabActive : ""}`} onClick={() => setPreviewTab("valid")}>
                  ✓ Valid Rows ({validRows.length})
                </button>
                <button className={`${styles.importTab} ${styles.importTabError} ${previewTab === "errors" ? styles.importTabErrorActive : ""}`} onClick={() => setPreviewTab("errors")}>
                  ✗ Error Rows ({errorRows.length})
                </button>
              </div>

              <div className={styles.importPreviewTable}>
                {previewTab === "valid" ? (
                  validRows.length === 0 ? <div className={styles.importEmpty}>No valid rows found</div> : (
                    <table className={styles.importTable}>
                      <thead>
                        <tr><th>#</th><th>Room Type Name</th><th>Price</th><th>Capacity</th><th>Bed Type</th><th>Rooms</th></tr>
                      </thead>
                      <tbody>
                        {validRows.map(r => (
                          <tr key={r.row}>
                            <td className={styles.importRowNum}>{r.row}</td>
                            <td className={styles.importRowName}>{r.name}</td>
                            <td>₹{parseFloat(r.price).toLocaleString("en-IN")}</td>
                            <td>{r.capacity}</td>
                            <td>{r.bed_type || "—"}</td>
                            <td>{r.no_of_rooms_available}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                ) : (
                  errorRows.length === 0 ? <div className={styles.importEmpty}>No errors 🎉</div> : (
                    <table className={styles.importTable}>
                      <thead><tr><th>#</th><th>Row Name</th><th>Errors</th></tr></thead>
                      <tbody>
                        {errorRows.map(r => (
                          <tr key={r.row} className={styles.importErrorRow}>
                            <td className={styles.importRowNum}>{r.row}</td>
                            <td>{r.name || "(empty)"}</td>
                            <td>{r.errors.map((err,i) => <div key={i} className={styles.importErrorItem}>⚠ {err}</div>)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}
              </div>

              <div className={styles.importFooter}>
                <button className={styles.importCancelBtn} onClick={() => setStep(1)}>← Back</button>
                <button className={styles.importPrimaryBtn} onClick={handleImport} disabled={validRows.length === 0}>
                  Import {validRows.length} Row{validRows.length !== 1 ? "s" : ""} →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Importing */}
          {step === 4 && (
            <div className={styles.importCenterState}>
              <div className={styles.importSpinner} />
              <p className={styles.importStateTitle}>Importing room types…</p>
              <p className={styles.importStateSub}>Uploading images to S3 and saving records</p>
            </div>
          )}

          {/* STEP 5 — Done */}
          {step === 5 && result && (
            <div className={styles.importCenterState}>
              <div className={styles.importSuccessIcon}>✅</div>
              <p className={styles.importStateTitle}>Import Complete!</p>
              <div className={styles.importResultCards}>
                <div className={`${styles.importResultCard} ${styles.importResultGreen}`}>
                  <span className={styles.importResultNum}>{result.imported_count}</span>
                  <span>Imported</span>
                </div>
                <div className={`${styles.importResultCard} ${styles.importResultRed}`}>
                  <span className={styles.importResultNum}>{result.skipped_count}</span>
                  <span>Skipped</span>
                </div>
              </div>
              {result.skipped?.length > 0 && (
                <div className={styles.importSkippedList}>
                  <p className={styles.importSkippedTitle}>Skipped rows:</p>
                  {result.skipped.map((s,i) => <div key={i} className={styles.importSkippedItem}>Row {s.row}: {s.name} — {s.error}</div>)}
                </div>
              )}
              <button className={styles.importPrimaryBtn} onClick={onClose} style={{marginTop:"20px"}}>Done</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ─── Main RoomTypes Component ────────────────────────────────────────────────
const RoomTypes = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); sessionStorage.clear();
    toast.info("Logged out", { autoClose: 1000 });
    navigate("/adminlogin");
  };

  const [roomTypes, setRoomTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRoomTypes, setTotalRoomTypes] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);


  const [formData, setFormData] = useState({
    name:"",description:"",price:"",capacity:"",bed_type:"",
    room_dimensions:"",taxes:"",no_of_rooms_available:"",
    room_images:"",room_features:"",available_dates:""
  });

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await ApiService.getRoomTypeDataTable({ page: currentPage, length: entriesPerPage, search: searchTerm });
      const d = res.data;
      if (d.status === "success") { setRoomTypes(d.data || []); setTotalRoomTypes(d.total_records); }
      else toast.error(d.message || "Failed to load room types");
    } catch (e) {
      if (e.response?.data?.code === "token_not_valid") { handleLogout(); return; }
      toast.error("Error fetching room types");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoomTypes();
  }, [searchTerm, currentPage, entriesPerPage]);

  // Add/Update room type
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description || '');
    data.append('price', parseFloat(formData.price) || 0);
    data.append('capacity', parseInt(formData.capacity) || 1);
    data.append('bed_type', formData.bed_type || '');
    data.append('room_dimensions', formData.room_dimensions || '');
    data.append('taxes', formData.taxes || '');
    data.append('no_of_rooms_available', parseInt(formData.no_of_rooms_available) || 0);
    data.append('room_features', formData.room_features || '');
    data.append('available_dates', formData.available_dates || '');

    try {
      const res = editingRoomType
        ? await ApiService.updateRoomType(editingRoomType.id, data)
        : await ApiService.addRoomType(data);
      if (res.data.status === "success") {
        toast.success(editingRoomType ? "Room type updated!" : "Room type created!");
        fetchRoomTypes(); handleCloseForm();
      } else toast.error(res.data.message || "Failed to save");
    } catch (e) {
      if (e.response?.data?.code === "token_not_valid") { handleLogout(); return; }
      toast.error("Something went wrong while saving");
    }
  };

  const handleEdit = (rt) => {
    setFormData({ name:rt.name||"",description:rt.description||"",price:rt.price||"",capacity:rt.capacity||"",bed_type:rt.bed_type||"",room_dimensions:rt.room_dimensions||"",taxes:rt.taxes||"",no_of_rooms_available:rt.no_of_rooms_available||"",room_images:rt.room_images||"",room_features:rt.room_features||"",available_dates:rt.available_dates||"" });
    setEditingRoomType(rt); setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Delete this room type? This also removes all associated room units.",
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
        const res = await ApiService.deleteRoomType(id);
        if (res.data.status === "success") {
          toast.success("Room type deleted!");
          fetchRoomTypes();
        } else {
          toast.error(res.data.message || "Failed to delete");
        }
      } catch (e) {
        if (e.response?.data?.code === "token_not_valid") {
          handleLogout();
          return;
        }
        toast.error(e.response?.data?.message || "Error deleting");
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      toast.info("Deletion cancelled");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false); setEditingRoomType(null);
    setFormData({name:"",description:"",price:"",capacity:"",bed_type:"",room_dimensions:"",taxes:"",no_of_rooms_available:"",room_images:"",room_features:"",available_dates:""});
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const res = await ApiService.exportRoomTypes();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a"); a.href = url;
      a.download = "room_types_export.xlsx"; a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Exported successfully!");
    } catch { toast.error("Export failed"); }
    setExportLoading(false);
  };

  const totalPages = Math.ceil(totalRoomTypes / entriesPerPage);
  const getPageNumbers = () => {
    const pages=[]; const max=10;
    let start=Math.max(1,currentPage-Math.floor(max/2));
    let end=Math.min(totalPages,start+max-1);
    if(end-start+1<max) start=Math.max(1,end-max+1);
    for(let i=start;i<=end;i++) pages.push(i);
    return pages;
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {showImportModal && (
        <ImportModal onClose={() => setShowImportModal(false)} onImportDone={fetchRoomTypes} />
      )}

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Room Types</h2>
          <p className={styles.subtitle}>Manage room categories and pricing</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportButton} onClick={handleExport} disabled={exportLoading}>
            {exportLoading ? "Exporting…" : "⬇ Export"}
          </button>
          <button className={styles.importButton} onClick={() => setShowImportModal(true)}>
            📥 Bulk Import
          </button>
          <button className={styles.primaryButton} onClick={() => setShowForm(true)}>
            <span className={styles.buttonIcon}>+</span> Add Room Type
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Search room types…" className={styles.searchInput}
            value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <div className={styles.tableStats}>Total: <strong>{totalRoomTypes}</strong> room types</div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading room types…</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className="table table-bordered table-hover mb-0">
            <thead>
              <tr>
                <th className={styles.table_head}>S.No</th>
                <th className={styles.table_head}>Name</th>
                <th className={styles.table_head}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.length === 0 ? (
                <tr>
                  <td colSpan="3" className={styles.emptyRow}>No room types found.</td>
                </tr>
              ) : (
                roomTypes.map((roomType, index) => (
                  <tr key={roomType.id}>
                    <td className={styles.serialNumber}>
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className={styles.nameCell}>
                      <div>
                        <strong>{roomType.name}</strong>
                        {roomType.description && (
                          <div className={styles.description}>{roomType.description}</div>
                        )}
                      </div>
                    </td>
                    <td className={styles.actionsCell}>
                      <button 
                        className={styles.editButton} 
                        onClick={() => handleEdit(roomType)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton} 
                        onClick={() => handleDelete(roomType.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          



          <div className={styles.tableFooter}>
            <div className={styles.pageInfo}>
              Showing {roomTypes.length>0 ? (currentPage-1)*entriesPerPage+1 : 0} to {Math.min(currentPage*entriesPerPage,totalRoomTypes)} of {totalRoomTypes} entries
            </div>
            <div className={styles.pagination}>
              <button onClick={() => setCurrentPage(p=>p-1)} disabled={currentPage===1} className={styles.pageButton}>Previous</button>
              {getPageNumbers().map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`${styles.pageButton} ${currentPage===p ? styles.pageButtonActive : ""}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p=>p+1)} disabled={currentPage===totalPages} className={styles.pageButton}>Next</button>
            </div>
            <div className={styles.entriesControl}>
              <label>Show</label>
              <select value={entriesPerPage} onChange={e => { setEntriesPerPage(parseInt(e.target.value)); setCurrentPage(1); }} className={styles.entriesSelect}>
                {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>entries</span>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingRoomType ? "Edit Room Type" : "Add Room Type"}</h3>
              <button className={styles.closeButton} onClick={handleCloseForm}>×</button>
            </div>
            <form id="roomTypeForm" onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.formGrid}>
                <div className={styles.formGroup} style={{ width: '100%', gridColumn: 'span 2' }}>
                  <label className={styles.formLabel}>Room Type Name *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Deluxe Suite"
                  />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseForm}>Cancel</button>
                <button type="submit" className={styles.submitButton}>{editingRoomType ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypes;
