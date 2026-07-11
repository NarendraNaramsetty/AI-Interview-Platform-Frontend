import React, { useState, useEffect, useCallback } from 'react';
import styles from './RoomCheckout.module.css';
import ApiService from '../../../service/Apiservice.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtD = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtDT = (d) => d ? new Date(d).toLocaleString('en-IN') : '—';

const PAYMENT_STATUS_COLOR = { Pending: '#ffc107', Partial: '#0d6efd', Paid: '#28a745' };
const CHECKOUT_STATUS_COLOR = { Pending: '#ffc107', Completed: '#28a745' };
const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Bank Transfer'];

// ── Dashboard Stats Cards ────────────────────────────────────────────────────
const StatsCards = ({ stats, loading }) => {
  const cards = [
    { label: "Today's Checkouts", value: stats.todays_checkouts, icon: '🏨', color: '#0d6efd' },
    { label: 'Pending Checkouts', value: stats.pending_checkouts, icon: '⏳', color: '#ffc107' },
    { label: 'Completed Checkouts', value: stats.completed_checkouts, icon: '✅', color: '#28a745' },
    { label: 'Pending Payments', value: stats.pending_payments, icon: '💰', color: '#dc3545' },
    { label: "Today's Revenue", value: `₹${fmt(stats.today_revenue)}`, icon: '📊', color: '#6f42c1', wide: true },
  ];
  return (
    <div className={styles.statsGrid}>
      {cards.map((c, i) => (
        <div key={i} className={`${styles.statsCard} ${c.wide ? styles.statsCardWide : ''}`} style={{ borderTopColor: c.color }}>
          <div className={styles.statsIcon}>{c.icon}</div>
          <div>
            <div className={styles.statsValue} style={{ color: c.color }}>
              {loading ? '…' : c.value}
            </div>
            <div className={styles.statsLabel}>{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Invoice Modal ────────────────────────────────────────────────────────────
const InvoiceModal = ({ checkoutId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getCheckoutInvoice(checkoutId)
      .then(r => { if (r.data.status === 'success') setData(r.data.data); })
      .catch(() => toast.error('Failed to load invoice'))
      .finally(() => setLoading(false));
  }, [checkoutId]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>🧾 Invoice {data?.invoice_number || ''}</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        {loading ? <div className={styles.modalLoading}>Loading…</div> : !data ? <div className={styles.modalLoading}>Not found</div> : (
          <div className={styles.invoiceBody}>
            <div className={styles.invoiceSection}>
              <h4 className={styles.sectionTitle}>Guest Information</h4>
              <div className={styles.infoGrid}>
                <span className={styles.infoLabel}>Name</span><span>{data.guest.name}</span>
                <span className={styles.infoLabel}>Phone</span><span>{data.guest.phone || '—'}</span>
                <span className={styles.infoLabel}>Email</span><span>{data.guest.email || '—'}</span>
                <span className={styles.infoLabel}>Booking ID</span><span>#{data.booking_id}</span>
                <span className={styles.infoLabel}>Room</span><span>{data.room.number} — {data.room.type}</span>
              </div>
            </div>
            <div className={styles.invoiceSection}>
              <h4 className={styles.sectionTitle}>Stay Information</h4>
              <div className={styles.infoGrid}>
                <span className={styles.infoLabel}>Check-In</span><span>{fmtD(data.stay.check_in)}</span>
                <span className={styles.infoLabel}>Check-Out</span><span>{fmtD(data.stay.check_out)}</span>
                <span className={styles.infoLabel}>Actual Out</span><span>{fmtDT(data.stay.actual_checkout)}</span>
                <span className={styles.infoLabel}>Duration</span><span>{data.stay.nights} night{data.stay.nights !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className={styles.invoiceSection}>
              <h4 className={styles.sectionTitle}>Billing Summary</h4>
              <div className={styles.billTable}>
                <div className={styles.billRow}><span>Room Charges</span><span>₹{fmt(data.billing.room_charges)}</span></div>
                <div className={styles.billRow}><span>Dining Charges</span><span>₹{fmt(data.billing.dining_charges)}</span></div>
                <div className={styles.billRow}><span>Taxes</span><span>₹{fmt(data.billing.taxes)}</span></div>
                <div className={styles.billRow}><span>Discount</span><span>-₹{fmt(data.billing.discount)}</span></div>
                <div className={`${styles.billRow} ${styles.billTotal}`}><span>Total Amount</span><span>₹{fmt(data.billing.total)}</span></div>
                <div className={styles.billRow} style={{ color: '#28a745' }}><span>Paid Amount</span><span>₹{fmt(data.billing.paid)}</span></div>
                <div className={styles.billRow} style={{ color: data.billing.due > 0 ? '#dc3545' : '#28a745', fontWeight: 700 }}>
                  <span>Due Amount</span><span>₹{fmt(data.billing.due)}</span>
                </div>
              </div>
            </div>
            <div className={styles.invoiceSection}>
              <h4 className={styles.sectionTitle}>Payment History</h4>
              {data.payments.length === 0 ? <p style={{ color: '#888' }}>No payments recorded</p> : (
                <table className={styles.payTable}>
                  <thead><tr><th>#</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {data.payments.map((p, i) => (
                      <tr key={p.id}>
                        <td>{i + 1}</td><td>₹{fmt(p.amount)}</td>
                        <td className={styles.capitalize}>{p.method}</td>
                        <td><span className={styles.badge} style={{ background: p.status === 'completed' ? '#d4edda' : '#fff3cd', color: p.status === 'completed' ? '#155724' : '#856404' }}>{p.status}</span></td>
                        <td>{fmtDT(p.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>Close</button>
          <button className={styles.submitButton} onClick={() => window.print()}>🖨 Print</button>
        </div>
      </div>
    </div>
  );
};

// ── Checkout Modal (complete checkout + payment) ──────────────────────────────
const CheckoutModal = ({ checkout, onClose, onDone }) => {
  const [form, setForm] = useState({ amount: checkout.due_amount || 0, payment_method: 'Cash', transaction_id: '', notes: '' });
  const [step, setStep] = useState('form');   // form | confirm | done
  const [saving, setSaving] = useState(false);
  const inv = checkout;

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const res = await ApiService.completeCheckout(checkout.id, form);
      if (res.data.status === 'success') {
        setStep('done');
        onDone();
        toast.success('Checkout completed successfully!');
      } else toast.error(res.data.message || 'Failed to complete checkout');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error completing checkout');
    } finally { setSaving(false); }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader} style={{ background: step === 'done' ? 'linear-gradient(135deg,#28a745,#1e7e34)' : undefined }}>
          <h3 className={styles.modalTitle}>
            {step === 'done' ? '✅ Checkout Complete' : step === 'confirm' ? '⚠️ Confirm Checkout' : '🏁 Complete Checkout'}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        {step === 'done' ? (
          <div className={styles.doneBody}>
            <div className={styles.doneIcon}>✅</div>
            <h3>Checkout Completed!</h3>
            <p>Guest <strong>{inv.guest_name}</strong> has been checked out successfully.</p>
            <p>Invoice: <strong>{inv.invoice_number}</strong></p>
            <div className={styles.modalFooter}>
              <button className={styles.submitButton} onClick={onClose}>Close</button>
            </div>
          </div>
        ) : step === 'confirm' ? (
          <div className={styles.modalBody}>
            <div className={styles.confirmBox}>
              <div className={styles.confirmIcon}>⚠️</div>
              <p>Are you sure you want to complete checkout for</p>
              <p><strong>{inv.guest_name}</strong> — Room {inv.room_number}?</p>
              {Number(form.amount) > 0 && (
                <p className={styles.confirmPayInfo}>
                  Payment of <strong>₹{fmt(form.amount)}</strong> via <strong>{form.payment_method}</strong> will be recorded.
                </p>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={() => setStep('form')}>← Back</button>
              <button className={styles.submitButton} onClick={handleConfirm} disabled={saving}>
                {saving ? 'Processing…' : 'Confirm Checkout'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.modalBody}>
              {/* Guest summary */}
              <div className={styles.checkoutSummary}>
                <div className={styles.summaryRow}><span>Guest</span><strong>{inv.guest_name}</strong></div>
                <div className={styles.summaryRow}><span>Room</span><strong>{inv.room_number} — {inv.room_type}</strong></div>
                <div className={styles.summaryRow}><span>Stay</span><strong>{fmtD(inv.check_in)} → {fmtD(inv.check_out)} ({inv.nights}N)</strong></div>
                <div className={styles.summaryRow}><span>Total</span><strong>₹{fmt(inv.total_amount)}</strong></div>
                <div className={styles.summaryRow}><span>Paid</span><span style={{ color: '#28a745' }}>₹{fmt(inv.paid_amount)}</span></div>
                <div className={styles.summaryRow}><span>Due</span><strong style={{ color: Number(inv.due_amount) > 0 ? '#dc3545' : '#28a745' }}>₹{fmt(inv.due_amount)}</strong></div>
              </div>

              {/* Payment section */}
              {Number(inv.due_amount) > 0 && (
                <div className={styles.paySection}>
                  <h4 className={styles.paySectionTitle}>💳 Receive Payment</h4>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Amount (₹)</label>
                    <input type="number" className={styles.formInput} value={form.amount} min="0" step="0.01"
                      onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Payment Method</label>
                    <div className={styles.methodGrid}>
                      {PAYMENT_METHODS.map(m => (
                        <button key={m} type="button"
                          className={`${styles.methodBtn} ${form.payment_method === m ? styles.methodBtnActive : ''}`}
                          onClick={() => setForm(p => ({ ...p, payment_method: m }))}>
                          {m === 'Cash' ? '💵' : m === 'UPI' ? '📱' : m === 'Card' ? '💳' : '🏦'} {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(form.payment_method === 'UPI' || form.payment_method === 'Bank Transfer') && (
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Transaction ID</label>
                      <input type="text" className={styles.formInput} value={form.transaction_id}
                        onChange={e => setForm(p => ({ ...p, transaction_id: e.target.value }))}
                        placeholder="Enter transaction / UTR reference" />
                    </div>
                  )}
                  {form.payment_method === 'UPI' && (
                    <div className={styles.qrPlaceholder}>
                      <div className={styles.qrBox}>📲 QR Code Placeholder</div>
                      <p className={styles.qrHint}>Scan & pay, then enter transaction ID above</p>
                    </div>
                  )}
                </div>
              )}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Notes (optional)</label>
                <textarea className={styles.formTextarea} rows={2} value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any remarks…" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
              <button className={styles.submitButton} onClick={() => setStep('confirm')}>
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ checkout, onClose }) => (
  <div className={styles.modalOverlay} onClick={onClose}>
    <div className={styles.modal} style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>🔍 Checkout #{checkout.id} Details</h3>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      <div className={styles.detailGrid}>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Checkout ID</span><span>#{checkout.id}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Invoice #</span><span>{checkout.invoice_number || '—'}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Guest</span><strong>{checkout.guest_name}</strong></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Phone</span><span>{checkout.guest_phone || '—'}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Booking ID</span><span>#{checkout.booking_id}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Room</span><span>{checkout.room_number}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Room Type</span><span>{checkout.room_type}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Check-In</span><span>{fmtD(checkout.check_in)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Check-Out (expected)</span><span>{fmtD(checkout.check_out)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Actual Check-Out</span><span>{fmtDT(checkout.actual_checkout_date)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Nights</span><span>{checkout.nights}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Total Amount</span><strong>₹{fmt(checkout.total_amount)}</strong></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Paid Amount</span><span style={{ color: '#28a745' }}>₹{fmt(checkout.paid_amount)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Due Amount</span><span style={{ color: Number(checkout.due_amount) > 0 ? '#dc3545' : '#28a745' }}>₹{fmt(checkout.due_amount)}</span></div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Payment Status</span>
          <span className={styles.badge} style={{ background: (PAYMENT_STATUS_COLOR[checkout.payment_status] || '#6c757d') + '22', color: PAYMENT_STATUS_COLOR[checkout.payment_status] || '#6c757d' }}>{checkout.payment_status}</span>
        </div>
        <div className={styles.detailRow}><span className={styles.detailLabel}>Checkout Status</span>
          <span className={styles.badge} style={{ background: (CHECKOUT_STATUS_COLOR[checkout.checkout_status] || '#6c757d') + '22', color: CHECKOUT_STATUS_COLOR[checkout.checkout_status] || '#6c757d' }}>{checkout.checkout_status}</span>
        </div>
        {checkout.payment_method && <div className={styles.detailRow}><span className={styles.detailLabel}>Payment Method</span><span>{checkout.payment_method}</span></div>}
        {checkout.transaction_id && <div className={styles.detailRow}><span className={styles.detailLabel}>Transaction ID</span><span className={styles.txnId}>{checkout.transaction_id}</span></div>}
        {checkout.notes && <div className={styles.detailRow}><span className={styles.detailLabel}>Notes</span><span>{checkout.notes}</span></div>}
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.cancelButton} onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

// ── Receive Payment Modal ─────────────────────────────────────────────────────
const ReceivePaymentModal = ({ checkout, onClose, onDone }) => {
  const [form, setForm] = useState({ amount: checkout.due_amount || '', payment_method: 'Cash', transaction_id: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) { toast.warning('Enter a valid amount'); return; }
    setSaving(true);
    try {
      const res = await ApiService.receiveCheckoutPayment(checkout.id, form);
      if (res.data.status === 'success') {
        toast.success('Payment recorded!');
        onDone();
        onClose();
      } else toast.error(res.data.message || 'Failed');
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader} style={{ background: 'linear-gradient(135deg,#0d6efd,#0a58ca)' }}>
          <h3 className={styles.modalTitle}>💳 Receive Payment — #{checkout.id}</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <p className={styles.payDue}>Due: <strong style={{ color: '#dc3545' }}>₹{fmt(checkout.due_amount)}</strong></p>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Amount (₹) *</label>
              <input type="number" className={styles.formInput} required min="0.01" step="0.01"
                value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Payment Method *</label>
              <div className={styles.methodGrid}>
                {PAYMENT_METHODS.map(m => (
                  <button key={m} type="button"
                    className={`${styles.methodBtn} ${form.payment_method === m ? styles.methodBtnActive : ''}`}
                    onClick={() => setForm(p => ({ ...p, payment_method: m }))}>
                    {m === 'Cash' ? '💵' : m === 'UPI' ? '📱' : m === 'Card' ? '💳' : '🏦'} {m}
                  </button>
                ))}
              </div>
            </div>
            {(form.payment_method === 'UPI' || form.payment_method === 'Bank Transfer') && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Transaction / UTR ID</label>
                <input type="text" className={styles.formInput} value={form.transaction_id}
                  onChange={e => setForm(p => ({ ...p, transaction_id: e.target.value }))} placeholder="Reference number" />
              </div>
            )}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Notes</label>
              <input type="text" className={styles.formInput} value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional" />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={saving}>
              {saving ? 'Recording…' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const RoomCheckout = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals
  const [detailItem, setDetailItem] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [paymentItem, setPaymentItem] = useState(null);
  const [initiating, setInitiating] = useState(null); // booking_id being initiated

  const totalPages = Math.ceil(totalRecords / entriesPerPage);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const r = await ApiService.getCheckoutStats();
      if (r.data.status === 'success') setStats(r.data.data);
    } catch { /* non-fatal */ }
    finally { setStatsLoading(false); }
  }, []);

  const fetchCheckouts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ApiService.getCheckoutDataTable({
        page: currentPage, length: entriesPerPage,
        search, filter_type: filterType,
        date_from: dateFrom, date_to: dateTo,
      });
      if (res.data.status === 'success') {
        setCheckouts(res.data.data);
        setTotalRecords(res.data.total_records);
      }
    } catch { toast.error('Failed to load checkouts'); }
    finally { setLoading(false); }
  }, [currentPage, entriesPerPage, search, filterType, dateFrom, dateTo]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchCheckouts(); }, [fetchCheckouts]);

  const refresh = () => { fetchCheckouts(); fetchStats(); };

  // Initiate checkout from a confirmed booking
  const initiateCheckout = async (bookingId) => {
    setInitiating(bookingId);
    try {
      const res = await ApiService.createCheckout({ booking_id: bookingId });
      if (res.data.status === 'success') {
        toast.success('Checkout initiated!');
        setCheckoutItem(res.data.data);
        refresh();
      } else toast.error(res.data.message || 'Failed to initiate checkout');
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    finally { setInitiating(null); }
  };

  const getPageNumbers = () => {
    const pages = []; const max = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Room Checkouts</h2>
          <p className={styles.subtitle}>Manage guest checkouts, payments and invoices</p>
        </div>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} loading={statsLoading} />

      {/* Filters */}
      <div className={styles.filterBar} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className={styles.filterRight}>
          <input type="text" placeholder="Search guest, room, booking ID…" className={styles.searchInput}
            value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
          <input type="date" className={styles.dateInput} value={dateFrom}
            onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }} title="From date" />
          <input type="date" className={styles.dateInput} value={dateTo}
            min={dateFrom}
            onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }} title="To date" />
          {(dateFrom || dateTo) && (
            <button className={styles.clearDateBtn} onClick={() => { setDateFrom(''); setDateTo(''); }}>✕</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingText}>⏳ Loading checkouts…</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className="table table-bordered table-hover mb-0">
              <thead>
                <tr>
                  <th className={styles.th}>#</th>
                  <th className={styles.th}>Guest</th>
                  <th className={styles.th}>Room</th>
                  <th className={styles.th}>Check-In</th>
                  <th className={styles.th}>Check-Out</th>
                  {/* <th className={styles.th}>Actual Out</th> */}
                  <th className={styles.th}>Total</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {checkouts.length === 0 ? (
                  <tr><td colSpan="7" className={styles.emptyRow}>No checkout records found.</td></tr>
                ) : checkouts.map(c => (
                  <tr key={c.id}>
                    <td><strong>#{c.id}</strong><div className={styles.subText}>{c.invoice_number}</div></td>
                    <td>
                      <strong>{c.guest_name}</strong>
                      {c.guest_phone && <div className={styles.subText}>{c.guest_phone}</div>}
                    </td>
                    <td><strong>{c.room_number}</strong><div className={styles.subText}>{c.room_type}</div></td>
                    <td>{fmtD(c.check_in)}</td>
                    <td>{fmtD(c.check_out)}</td>
                    {/* <td>{fmtDT(c.actual_checkout_date)}</td> */}
                    <td className={styles.amtCell}>₹{fmt(c.total_amount)}</td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button className={styles.viewButton} onClick={() => setDetailItem(c)}>View</button>
                        <button className={styles.invoiceButton} onClick={() => setInvoiceId(c.id)}>Invoice</button>
                        {c.checkout_status !== 'Completed' && (
                          <button className={styles.checkoutButton} onClick={() => setCheckoutItem(c)}>Complete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.tableFooter}>
              <div className={styles.pageInfo}>
                Showing {checkouts.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords}
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
                Show <select value={entriesPerPage} onChange={e => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className={styles.entriesSelect}>
                  {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                </select> entries
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {detailItem && <DetailModal checkout={detailItem} onClose={() => setDetailItem(null)} />}
      {invoiceId && <InvoiceModal checkoutId={invoiceId} onClose={() => setInvoiceId(null)} />}
      {paymentItem && <ReceivePaymentModal checkout={paymentItem} onClose={() => setPaymentItem(null)} onDone={refresh} />}
      {checkoutItem && <CheckoutModal checkout={checkoutItem} onClose={() => setCheckoutItem(null)} onDone={refresh} />}
    </div>
  );
};

export default RoomCheckout;
