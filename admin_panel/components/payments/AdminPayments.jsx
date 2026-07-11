import React, { useState, useEffect } from 'react';
import ApiService from '../../service/Apiservice';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaCoins, FaListUl, FaEdit } from 'react-icons/fa';

const AdminPayments = () => {
  const [plans, setPlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans');
  
  // Create/Edit plan modal
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [interval, setIntervalVal] = useState('monthly');
  const [features, setFeatures] = useState('');

  const fetchPayments = () => {
    setLoading(true);
    ApiService.getPayments()
      .then(res => {
        const data = res.data || res;
        setPlans(data.plans || []);
        setTransactions(data.transactions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert("Name and Price are required.");
      return;
    }
    
    // Parse features from newline string to JSON array/object
    let parsedFeatures = {};
    if (features) {
      features.split('\n').forEach((f, idx) => {
        parsedFeatures[`feat_${idx}`] = f.trim();
      });
    }
    
    const payload = {
      name,
      price: parseFloat(price),
      billing_interval: interval,
      features: parsedFeatures
    };

    try {
      if (editPlan) {
        await ApiService.updatePlan({ id: editPlan.id, ...payload });
      } else {
        await ApiService.createPlan(payload);
      }
      setShowModal(false);
      setEditPlan(null);
      fetchPayments();
    } catch (err) {
      alert("Failed to save plan.");
    }
  };

  const handleTogglePlan = async (id, is_active) => {
    try {
      await ApiService.updatePlan({ id, is_active });
      fetchPayments();
    } catch (err) {
      alert("Failed to toggle plan status.");
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscription plan?")) return;
    try {
      await ApiService.deletePlan({ id });
      fetchPayments();
    } catch (err) {
      alert("Failed to delete plan.");
    }
  };

  const openCreateModal = () => {
    setEditPlan(null);
    setName('');
    setPrice('');
    setIntervalVal('monthly');
    setFeatures('');
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditPlan(p);
    setName(p.name);
    setPrice(p.price);
    setIntervalVal(p.billing_interval);
    
    // Format features back to newline string
    const fStr = p.features ? Object.values(p.features).join('\n') : '';
    setFeatures(fStr);
    setShowModal(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-gray-200">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-display">Subscription & Billings</h2>
          <p className="text-xs text-gray-400 mt-1">Configure premium pricing levels, check payouts, and verify invoicing status.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
        >
          <FaPlus /> Add Plan
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-light-border dark:border-dark-border gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'plans' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400'
          }`}
        >
          <FaListUl /> Pricing plans
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'history' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400'
          }`}
        >
          <FaCoins /> Purchases history
        </button>
      </div>

      {/* Main lists */}
      {loading ? (
        <div className="text-center py-12 text-xs text-gray-400">Loading ledger data...</div>
      ) : activeTab === 'plans' ? (
        /* Plan Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(p => (
            <div key={p.id} className="p-6 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-bold font-display">{p.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                    p.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {p.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="text-2xl font-bold font-display text-indigo-400">${p.price} <span className="text-xs text-gray-400 font-normal">/ {p.billing_interval}</span></div>
                <div className="pt-2 border-t border-light-border dark:border-dark-border text-xs space-y-1.5 text-gray-300">
                  {p.features && Object.values(p.features).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✔</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-light-border dark:border-dark-border flex gap-2 justify-end">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded text-gray-400 hover:text-indigo-400 text-xs"
                  title="Modify Plan details"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleTogglePlan(p.id, !p.is_active)}
                  className={`p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded text-xs ${
                    p.is_active ? 'text-rose-400 hover:text-rose-500' : 'text-emerald-400 hover:text-emerald-500'
                  }`}
                  title={p.is_active ? 'Disable Plan' : 'Enable Plan'}
                >
                  {p.is_active ? <FaTimes /> : <FaCheck />}
                </button>
                <button
                  onClick={() => handleDeletePlan(p.id)}
                  className="p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded text-gray-400 hover:text-rose-400 text-xs"
                  title="Delete Plan"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Payouts list */
        <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border text-xs text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3.5 px-2">Txn ID</th>
                    <th className="pb-3.5 px-2">Account</th>
                    <th className="pb-3.5 px-2">Payout Amount</th>
                    <th className="pb-3.5 px-2">Gateway reference</th>
                    <th className="pb-3.5 px-2">Status</th>
                    <th className="pb-3.5 px-2">Date Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-light-hover/10 dark:hover:bg-dark-hover/10">
                      <td className="py-3.5 px-2 font-mono">{t.id}</td>
                      <td className="py-3.5 px-2 font-bold">{t.email}</td>
                      <td className="py-3.5 px-2 font-bold text-indigo-400">${t.amount}</td>
                      <td className="py-3.5 px-2 font-mono text-gray-400 text-xs">{t.stripe_charge_id || "Stripe invoice"}</td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          t.status === 'succeeded' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-400 text-xs">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">No transactions recorded.</div>
          )}
        </div>
      )}

      {/* Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-2xl p-6 relative text-gray-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-md font-bold font-display mb-4">{editPlan ? 'Modify Billing Plan' : 'Add New Tier Plan'}</h3>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-gray-400 block">Plan name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 block">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 block">Billing Interval</label>
                  <select
                    value={interval}
                    onChange={(e) => setIntervalVal(e.target.value)}
                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none text-gray-300"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 block">Features (One per line)</label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg bg-light-hover dark:bg-dark-bg focus:outline-none font-mono"
                  placeholder="Unlimited AI Interviews&#10;Premium ATS Scanning&#10;Real-time coach Advisor..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg mt-2"
              >
                Save configurations
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
