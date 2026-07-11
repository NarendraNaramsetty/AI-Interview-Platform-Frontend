import React, { useState, useEffect } from 'react';
import styles from './Roomserviceorders.module.css';
import ApiService from '../../service/Apiservice.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STATUS_COLORS = {
  Pending:   '#ffc107',
  Preparing: '#17a2b8',
  Served:    '#6f42c1',
  Completed: '#28a745',
  Cancelled: '#dc3545',
  Paid:      '#28a745',
  'Charged to Room': '#007bff',
};

const ORDER_STATUS_OPTIONS = ['Pending', 'Preparing', 'Served', 'Completed', 'Cancelled'];

// ── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ order, onClose }) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>Order #{order.order_id} Details</h3>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.detailGrid}>
          <div className={styles.detailRow}><span className={styles.detailLabel}>Order ID</span><span>#{order.order_id}</span></div>
          <div className={styles.detailRow}><span className={styles.detailLabel}>Guest Name</span><span>{order.guest_name || 'Walk-in Guest'}</span></div>
          <div className={styles.detailRow}><span className={styles.detailLabel}>Phone</span><span>{order.guest_phone || '—'}</span></div>
          <div className={styles.detailRow}><span className={styles.detailLabel}>Room</span><span>{order.room_number ? `Room ${order.room_number}` : '—'}</span></div>
          <div className={styles.detailRow}><span className={styles.detailLabel}>Order Date</span><span>{order.order_date ? new Date(order.order_date).toLocaleString() : '—'}</span></div>
          <div className={styles.detailRow}><span className={styles.detailLabel}>Total Amount</span><strong>₹{Number(order.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Order Status</span>
            <span className={styles.statusBadge}
              style={{ background: (STATUS_COLORS[order.order_status] || '#6c757d') + '22', color: STATUS_COLORS[order.order_status] || '#6c757d' }}>
              {order.order_status}
            </span>
          </div>
          <div className={styles.detailRow}><span className={styles.detailLabel}>Payment Status</span><span>{order.payment_status || '—'}</span></div>
        </div>

        {order.order_details?.length > 0 && (
          <>
            <h4 className={styles.sectionHeading}>Items Ordered</h4>
            <div className={styles.itemsTableWrapper}>
              <table className="table table-sm table-striped mb-0">
                <thead>
                  <tr>
                    <th>Food Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_details.map((item) => (
                    <tr key={item.order_detail_id}>
                      <td>{item.food_name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{Number(item.price).toLocaleString()}</td>
                      <td>₹{Number(item.amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Roomserviceorders = () => {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(false);
  const [search, setSearch]               = useState('');
  const [currentPage, setCurrentPage]     = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords]   = useState(0);
  const [detailOrder, setDetailOrder]     = useState(null);

  const totalPages = Math.ceil(totalRecords / entriesPerPage);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ApiService.getFoodOrderDataTable({
        page: currentPage,
        length: entriesPerPage,
        search,
        order_type: 'Room Service',
      });
      if (res.data.status === 'success') {
        // Filter to room service only (backend may not support filter param)
        const all = res.data.data;
        const roomService = all.filter(o => o.order_type === 'Room Service');
        setOrders(roomService);
        setTotalRecords(res.data.total_records);
      }
    } catch {
      toast.error('Failed to load room service orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [currentPage, entriesPerPage, search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await ApiService.updateFoodOrderStatus(id, { order_status: newStatus });
      if (res.data.status === 'success') {
        toast.success('Status updated');
        fetchOrders();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await ApiService.getFoodOrderById(id);
      if (res.data.status === 'success') setDetailOrder(res.data.data);
    } catch {
      toast.error('Failed to load order details');
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end   = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) if (i > 0) pages.push(i);
    return pages;
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Room Service Orders</h2>
          <p className={styles.subtitle}>Manage in-room food and beverage orders from guests</p>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tabContent}>
        <div className={styles.actions}>
          <input
            type="text"
            placeholder="Search by guest name, room number, status..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {loading ? (
          <div className={styles.loadingText}>Loading room service orders...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className="table table-bordered table-hover mb-0">
              <thead>
                <tr>
                  <th className={styles.table_head}>Order ID</th>
                  <th className={styles.table_head}>Guest</th>
                  <th className={styles.table_head}>Room</th>
                  <th className={styles.table_head}>Total (₹)</th>
                  <th className={styles.table_head}>Order Date</th>
                  <th className={styles.table_head}>Order Status</th>
                  <th className={styles.table_head}>Payment</th>
                  <th className={styles.table_head}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="8" className={styles.emptyRow}>No room service orders found.</td></tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.order_id}>
                      <td><strong>#{o.order_id}</strong></td>
                      <td>
                        <strong>{o.guest_name || 'Walk-in Guest'}</strong>
                        {o.guest_phone && <div className={styles.subText}>{o.guest_phone}</div>}
                      </td>
                      <td>{o.room_number ? `Room ${o.room_number}` : '—'}</td>
                      <td>₹{Number(o.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>{o.order_date ? new Date(o.order_date).toLocaleDateString() : '—'}</td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{ background: (STATUS_COLORS[o.order_status] || '#6c757d') + '22', color: STATUS_COLORS[o.order_status] || '#6c757d' }}
                        >
                          {o.order_status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{ background: (STATUS_COLORS[o.payment_status] || '#ffc107') + '22', color: STATUS_COLORS[o.payment_status] || '#ffc107' }}
                        >
                          {o.payment_status || 'Pending'}
                        </span>
                      </td>
                      <td className={styles.actionsCell}>
                        <button className={styles.viewButton} onClick={() => openDetail(o.order_id)}>View Items</button>
                        <select
                          className={styles.statusSelect}
                          value={o.order_status}
                          onChange={(e) => handleStatusChange(o.order_id, e.target.value)}
                        >
                          {ORDER_STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.tableFooter}>
              <div className={styles.pageInfo}>
                Showing {orders.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} entries
              </div>
              <div className={styles.pagination}>
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={styles.pageButton}>Prev</button>
                {getPageNumbers().map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`${styles.pageButton} ${currentPage === p ? styles.pageButtonActive : ''}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0} className={styles.pageButton}>Next</button>
              </div>
              <div className={styles.entriesControl}>
                <label>Show</label>
                <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className={styles.entriesSelect}>
                  {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailOrder && (
        <DetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />
      )}
    </div>
  );
};

export default Roomserviceorders;
