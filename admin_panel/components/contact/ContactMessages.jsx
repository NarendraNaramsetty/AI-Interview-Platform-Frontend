import React, { useState, useEffect } from 'react';
import styles from './ContactMessages.module.css';
import { contactAPI } from '../../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faEye, 
  faEnvelope, 
  faPhone, 
  faCalendar, 
  faFileExport, 
  faTimes 
} from "@fortawesome/free-solid-svg-icons";
import PageLoader from '../common/PageLoader.jsx';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getInquiries();
      if (response.data?.status === 'success') {
        setMessages(response.data.data);
      } else {
        setMessages(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages based on search term
  const filteredMessages = messages.filter(msg => {
    const fullName = `${msg.first_name} ${msg.last_name || ''}`.toLowerCase();
    const email = (msg.email || '').toLowerCase();
    const phone = (msg.phone_number || '').toLowerCase();
    const message = (msg.message || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    return fullName.includes(term) || email.includes(term) || phone.includes(term) || message.includes(term);
  });

  // Export data to Excel file
  const handleExportExcel = () => {
    if (filteredMessages.length === 0) return;

    const dataToExport = filteredMessages.map((msg, index) => ({
      "S.No": index + 1,
      "Name": `${msg.first_name} ${msg.last_name || ''}`,
      "Email": msg.email,
      "Phone": msg.phone_number,
      "Message": msg.message,
      "Sent Date": new Date(msg.created_at).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Messages");

    // Buffer output
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Contact_Messages_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Contact Us Inquiries</h2>
          <p className={styles.subtitle}>Manage and view all incoming inquiries and feedback sent from the website</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.exportBtn}
            onClick={handleExportExcel}
            disabled={filteredMessages.length === 0}
          >
            <FontAwesomeIcon icon={faFileExport} /> Export to Excel
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name, email, phone, or message keywords..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className={styles.tableContainer}>
        {filteredMessages.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message Snippet</th>
                <th>Date Received</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg, index) => (
                <tr key={msg.id || index}>
                  <td>{index + 1}</td>
                  <td className={styles.boldText}>{`${msg.first_name} ${msg.last_name || ''}`}</td>
                  <td>
                    <span className={styles.iconSpan}>
                      <FontAwesomeIcon icon={faEnvelope} className={styles.rowIcon} /> {msg.email}
                    </span>
                  </td>
                  <td>
                    <span className={styles.iconSpan}>
                      <FontAwesomeIcon icon={faPhone} className={styles.rowIcon} /> {msg.phone_number || 'N/A'}
                    </span>
                  </td>
                  <td className={styles.messageSnippet}>
                    {msg.message.length > 60 ? `${msg.message.substring(0, 60)}...` : msg.message}
                  </td>
                  <td>
                    <span className={styles.iconSpan}>
                      <FontAwesomeIcon icon={faCalendar} className={styles.rowIcon} /> {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className={styles.actionBtn} 
                      onClick={() => handleOpenMessage(msg)}
                      title="View Full Message"
                    >
                      <FontAwesomeIcon icon={faEye} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.noData}>
            <h3>No messages found</h3>
            <p>We couldn't find any inquiries matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Full Message Details Modal */}
      {showModal && selectedMessage && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Inquiry Details</h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <label>Sender Name</label>
                  <p>{`${selectedMessage.first_name} ${selectedMessage.last_name || ''}`}</p>
                </div>
                <div className={styles.metaItem}>
                  <label>Email Address</label>
                  <p>{selectedMessage.email}</p>
                </div>
                <div className={styles.metaItem}>
                  <label>Phone Number</label>
                  <p>{selectedMessage.phone_number || 'N/A'}</p>
                </div>
                <div className={styles.metaItem}>
                  <label>Received At</label>
                  <p>{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              <div className={styles.messageContentBlock}>
                <label>Customer Message</label>
                <div className={styles.messageTextBody}>
                  {selectedMessage.message}
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCloseBtn} onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
