import React, { useState, useEffect, useRef } from "react";
import ApiService, { api } from "../../../service/Apiservice.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const configsetup = () => {
  // ================= AUTH =================
  const setAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // ================= STATE =================
  const [activeTab, setActiveTab] = useState("email");
  const [loading, setLoading] = useState(false);

  // ---------- EMAIL ----------
  const [emailForm, setEmailForm] = useState({
    id: "",
    email_host: "",
    email_port: 587,
    email_host_user: "",
    email_host_password: "",
    default_from_email: "",
    is_active: true,
    id_busness: "",
  });

  // ---------- SMS ----------
  const [smsForm, setSmsForm] = useState({
    id: "",
    sms_path: "",
    sender_id: "",
    api_key: "",
    user_name: "",
    password: "",
    is_active: true,
    id_busness: "",
  });

  // ---------- S3 ----------
  const [s3Form, setS3Form] = useState({
    id: "",
    s3_bucket_name: "",
    s3_access_key_id: "",
    s3_secret_access_key: "",
    s3_region_name: "",
    s3_base_url: "",
    is_active: true,
    id_busness: "",
  });

  const [businesses, setBusinesses] = useState([]);

  // ---------- GENERAL ----------
  const [generalForm, setGeneralForm] = useState({
    id: "",
    otp_seconds: 120,
    force_logout: 120,
    id_busness: "",
    payment_mode: "both",
  });

  // ---------- PAYMENT ----------
  const [paymentForm, setPaymentForm] = useState({
    id: "",
    key_secret: "",
    webhook_secret: "",
    key_id: "",
    id_business: "",
    is_active: true,
    payment_url: "",
    payment_way: "default",
  });

  const fileInputRef = useRef(null);
  const [generalFile, setGeneralFile] = useState(null);
  const [generalPreview, setGeneralPreview] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    fetchEmailConfig();
    fetchSmsConfig();
    fetchS3Config();
    fetchGeneralConfig();
    fetchPaymentConfig();
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setAuthHeader();
      const res = await ApiService.getAllBusinesss();
      if (res.data?.status === "success") {
        setBusinesses(res.data.data || []);
      }
    } catch {
      toast.error("❌ Failed to load businesses list");
    }
  };

  // ---------- FETCH EMAIL ----------
  const fetchEmailConfig = async () => {
    try {
      setAuthHeader();
      const res = await ApiService.getEmailList();
      if (res.data?.status === "success" && res.data.data?.length) {
        const d = res.data.data[0];
        setEmailForm({
          id: d.id || "",
          email_host: d.email_host || "",
          email_port: d.email_port || 587,
          email_host_user: d.email_host_user || "",
          email_host_password: d.email_host_password || "",
          default_from_email: d.default_from_email || "",
          is_active: d.is_active ?? true,
          id_busness: d.id_busness || "",
        });
      }
    } catch {
      toast.error("❌ Failed to load email configuration");
    }
  };

  // ---------- FETCH SMS ----------
  const fetchSmsConfig = async () => {
    try {
      setAuthHeader();
      const res = await ApiService.getSMSList();
      if (res.data?.status === "success" && res.data.data?.length) {
        const d = res.data.data[0];
        setSmsForm({
          id: d.id || "",
          sms_path: d.sms_path || "",
          sender_id: d.sender_id || "",
          api_key: d.api_key || "",
          user_name: d.user_name || "",
          password: d.password || "",
          is_active: d.is_active ?? true,
          id_busness: d.id_busness || "",
        });
      }
    } catch {
      toast.error("❌ Failed to load SMS configuration");
    }
  };

  // ---------- FETCH S3 ----------
  const fetchS3Config = async () => {
    try {
      setAuthHeader();
      const res = await ApiService.getS3BucketSetupList();

      if (res.data?.status === "success" && res.data.data) {
        const d = res.data.data;

        setS3Form({
          id: d.id || "",
          s3_bucket_name: d.s3_bucket_name || "",
          s3_access_key_id: d.s3_access_key_id || "",
          s3_secret_access_key: d.s3_secret_access_key || "",
          s3_region_name: d.s3_region_name || "",
          s3_base_url: d.s3_base_url || "",
          is_active: d.is_active ?? true,
          id_busness: d.id_busness || "",
        });
      }
    } catch {
      toast.error("❌ Failed to load S3 configuration");
    }
  };

  // ---------- FETCH GENERAL ----------
  const fetchGeneralConfig = async () => {
    try {
      setAuthHeader();
      const res = await ApiService.getGeneralList();

      if (res.data?.status === "success" && res.data.data) {
        const d = res.data.data;

        setGeneralForm({
          id: d.id || "",
          otp_seconds: d.otp_seconds || 0,
          force_logout: d.force_logout || 0,
          id_busness: d.id_busness || "",
          payment_mode: d.payment_mode || "both",
        });

        // ✅ THIS WAS NEVER RUNNING BEFORE
        if (d.certificate_url) {
          setGeneralPreview(d.certificate_url);
        }
      }
    } catch {
      toast.error("❌ Failed to load general configuration");
    }
  };

  // ---------- FETCH PAYMENT ----------
  const fetchPaymentConfig = async () => {
    try {
      setAuthHeader();
      const res = await ApiService.getPaymentConfigList();
      if (res.data?.status === "success" && res.data.data?.length) {
        const d = res.data.data[0];
        setPaymentForm({
          id: d.id || "",
          key_secret: d.key_secret || "",
          webhook_secret: d.webhook_secret || "",
          key_id: d.key_id || "",
          id_business: d.id_business || "",
          is_active: d.is_active ?? true,
          payment_url: d.payment_url || "",
          payment_way: d.payment_way || "default",
        });
      }
    } catch {
      toast.error("❌ Failed to load payment configuration");
    }
  };


  // ================= SAVE =================
  const saveEmailConfig = async () => {
    try {
      setLoading(true);
      setAuthHeader();
      const res = await ApiService.addOrUpdateEmail(emailForm);
      res.data?.status === "success"
        ? toast.success("✅ Email configuration saved")
        : toast.error(res.data?.message || "Save failed");
    } catch {
      toast.error("❌ Error saving email configuration");
    } finally {
      setLoading(false);
    }
  };

  const saveS3Config = async () => {
    try {
      setLoading(true);
      setAuthHeader();
      const payload = { ...s3Form };
      const res = await ApiService.addOrUpdateS3BucketSetup(payload);
      res.data?.status === "success"
        ? toast.success("✅ S3 configuration saved")
        : toast.error(res.data?.message || "Save failed");
    } catch {
      toast.error("❌ Error saving S3 configuration");
    } finally {
      setLoading(false);
    }
  };

  const saveSmsConfig = async () => {
    try {
      setLoading(true);
      setAuthHeader();
      const res = await ApiService.addOrUpdateSMS(smsForm);
      res.data?.status === "success"
        ? toast.success("✅ SMS configuration saved")
        : toast.error(res.data?.message || "Save failed");
    } catch {
      toast.error("❌ Error saving SMS configuration");
    } finally {
      setLoading(false);
    }
  };

  const saveGeneralConfig = async () => {
    try {
      setLoading(true);
      setAuthHeader();

      const formData = new FormData();

      // ✅ SEND ID FOR UPDATE
      if (generalForm.id) {
        formData.append("id", generalForm.id);
      }

      formData.append("otp_seconds", generalForm.otp_seconds);
      formData.append("force_logout", generalForm.force_logout);
      formData.append("payment_mode", generalForm.payment_mode || "both");

      if (generalForm.id_busness) {
        formData.append("id_busness", generalForm.id_busness);
      }

      if (generalFile) {
        formData.append("certificate", generalFile); // match backend field name
      }

      const res = await ApiService.addOrUpdateGeneral(formData);

      res.data?.status === "success"
        ? toast.success("✅ General configuration saved")
        : toast.error(res.data?.message || "Save failed");
    } catch {
      toast.error("❌ Error saving general configuration");
    } finally {
      setLoading(false);
    }
  };

  const savePaymentConfig = async () => {
    try {
      setLoading(true);
      setAuthHeader();
      const res = await ApiService.addOrUpdatePaymentConfig(paymentForm);
      res.data?.status === "success"
        ? toast.success("✅ Payment configuration saved")
        : toast.error(res.data?.message || "Save failed");
    } catch {
      toast.error("❌ Error saving payment configuration");
    } finally {
      setLoading(false);
    }
  };


  // ---------- GENERAL FILE HANDLER ----------
  const handleGeneralFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("❌ Only image files are allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("❌ Image size must be under 2MB");
      return;
    }
    setGeneralFile(file);
    setGeneralPreview(URL.createObjectURL(file));
  };

  // ================= UI =================
  return (
    <div className="container-fluid py-3">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* HEADER */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-1">Configuration</h4>
          <p className="text-muted mb-0">Manage email, S3 bucket, and general settings</p>
        </div>
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs mb-4">
        {["email", "sms", "s3", "general", "payment"].map((tab) => {
          let label = "";
          let isActive = false;
          let showStatus = false;

          if (tab === "email") {
            label = "📧 Email";
            isActive = emailForm.is_active;
            showStatus = true;
          } else if (tab === "sms") {
            label = "💬 SMS";
            isActive = smsForm.is_active;
            showStatus = true;
          } else if (tab === "s3") {
            label = "☁️ S3 Bucket";
            isActive = s3Form.is_active;
            showStatus = true;
          } else if (tab === "general") {
            label = "⚙️ General";
          } else if (tab === "payment") {
            label = "💳 Payment Config";
            isActive = paymentForm.is_active;
            showStatus = true;
          }

          return (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""} d-flex align-items-center`}
                onClick={() => setActiveTab(tab)}
                style={{ gap: "8px" }}
              >
                <span>{label}</span>
                {showStatus && (
                  <span
                    className="badge rounded-circle p-1"
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: isActive ? "#28a745" : "#6c757d",
                      boxShadow: isActive ? "0 0 6px #28a745" : "none",
                      display: "inline-block",
                      transition: "all 0.3s ease"
                    }}
                    title={isActive ? "Active" : "Inactive"}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* EMAIL TAB */}
      {activeTab === "email" && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="mb-3">SMTP Configuration</h5>
            <div className="row g-3">
              {[
                ["SMTP Host", "email_host"],
                ["Port", "email_port", "number"],
                ["Username", "email_host_user"],
                ["Password", "email_host_password", "password"],
                ["Default From Email", "default_from_email"],
              ].map(([label, key, type = "text"]) => (
                <div className="col-md-3" key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    className="form-control"
                    value={emailForm[key]}
                    onChange={(e) => setEmailForm({ ...emailForm, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div className="row g-3 mt-2 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Associated Business</label>
                <select
                  className="form-select"
                  value={emailForm.id_busness}
                  onChange={(e) => setEmailForm({ ...emailForm, id_busness: e.target.value })}
                >
                  <option value="">-- Select Business --</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.business_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label d-block">Configuration Status</label>
                <div className="d-flex align-items-center mt-2">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="emailActiveSwitch"
                      checked={emailForm.is_active}
                      onChange={(e) => setEmailForm({ ...emailForm, is_active: e.target.checked })}
                      style={{
                        width: "2.8rem",
                        height: "1.4rem",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <span
                    className={`ms-2 fw-bold ${emailForm.is_active ? "text-success" : "text-secondary"}`}
                    style={{ fontSize: "1rem" }}
                  >
                    {emailForm.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-end mt-4">
              <button className="btn btn-primary" onClick={saveEmailConfig} disabled={loading}>
                Save Email Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* S3 TAB */}
      {activeTab === "s3" && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="mb-3">S3 Bucket Configuration</h5>
            <div className="row g-3">
              {[
                ["Bucket Name", "s3_bucket_name"],
                ["Access Key ID", "s3_access_key_id"],
                ["Secret Access Key", "s3_secret_access_key", "password"],
                ["Region", "s3_region_name"],
                ["Base URL / CDN", "s3_base_url"],
              ].map(([label, key, type = "text"]) => (
                <div className="col-md-3" key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    className="form-control"
                    value={s3Form[key]}
                    onChange={(e) => setS3Form({ ...s3Form, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div className="row g-3 mt-2 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Associated Business</label>
                <select
                  className="form-select"
                  value={s3Form.id_busness}
                  onChange={(e) => setS3Form({ ...s3Form, id_busness: e.target.value })}
                >
                  <option value="">-- Select Business --</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.business_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Which App / System</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Admin App, Front Desk App"
                  value={s3Form.whichapp || ""}
                  onChange={(e) => setS3Form({ ...s3Form, whichapp: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label d-block">Configuration Status</label>
                <div className="d-flex align-items-center mt-2">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="s3ActiveSwitch"
                      checked={s3Form.is_active}
                      onChange={(e) => setS3Form({ ...s3Form, is_active: e.target.checked })}
                      style={{
                        width: "2.8rem",
                        height: "1.4rem",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <span
                    className={`ms-2 fw-bold ${s3Form.is_active ? "text-success" : "text-secondary"}`}
                    style={{ fontSize: "1rem" }}
                  >
                    {s3Form.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-end mt-4">
              <button className="btn btn-primary" onClick={saveS3Config} disabled={loading}>
                Save S3 Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS TAB */}
      {activeTab === "sms" && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="mb-3">SMS Configuration</h5>
            <div className="row g-3">
              {[
                ["SMS API URL", "sms_path"],
                ["Sender ID", "sender_id"],
                ["API Key", "api_key", "password"],
                ["Username", "user_name"],
                ["Password", "password", "password"],
              ].map(([label, key, type = "text"]) => (
                <div className="col-md-4" key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    className="form-control"
                    value={smsForm[key]}
                    onChange={(e) => setSmsForm({ ...smsForm, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div className="row g-3 mt-2 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Associated Business</label>
                <select
                  className="form-select"
                  value={smsForm.id_busness}
                  onChange={(e) => setSmsForm({ ...smsForm, id_busness: e.target.value })}
                >
                  <option value="">-- Select Business --</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.business_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label d-block">Configuration Status</label>
                <div className="d-flex align-items-center mt-2">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="smsActiveSwitch"
                      checked={smsForm.is_active}
                      onChange={(e) => setSmsForm({ ...smsForm, is_active: e.target.checked })}
                      style={{
                        width: "2.8rem",
                        height: "1.4rem",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <span
                    className={`ms-2 fw-bold ${smsForm.is_active ? "text-success" : "text-secondary"}`}
                    style={{ fontSize: "1rem" }}
                  >
                    {smsForm.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-end mt-4">
              <button className="btn btn-primary" onClick={saveSmsConfig} disabled={loading}>
                Save SMS Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERAL TAB */}
      {activeTab === "general" && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="mb-3">General Settings</h5>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">OTP Seconds</label>
                <input
                  type="number"
                  className="form-control"
                  value={generalForm.otp_seconds}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, otp_seconds: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Force Logout Seconds</label>
                <input
                  type="number"
                  className="form-control"
                  value={generalForm.force_logout}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, force_logout: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-select"
                  value={generalForm.payment_mode || "both"}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, payment_mode: e.target.value })
                  }
                >
                  <option value="both">Both</option>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </select>
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <label className="form-label">Associated Business</label>
                <select
                  className="form-select"
                  value={generalForm.id_busness}
                  onChange={(e) => setGeneralForm({ ...generalForm, id_busness: e.target.value })}
                >
                  <option value="">-- Select Business --</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.business_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-end mt-4">
              <button className="btn btn-primary" onClick={saveGeneralConfig} disabled={loading}>
                {loading ? "Saving..." : "Save General Configuration"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT TAB */}
      {activeTab === "payment" && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="mb-3">Payment Configuration</h5>



  <div className="col-md-3">
                    <label className="form-label">Payment Way</label>
                    <select
                      className="form-select"
                      value={paymentForm.payment_way || "default"}
                      onChange={(e) => setPaymentForm({ ...paymentForm, payment_way: e.target.value })}
                    >
                      <option value="default">Default</option>
                      <option value="thirdparty">Third Party</option>
                    </select>
                  </div>



            {/* Conditional Rendering of Fields */}
            <div className="row g-3">
              {paymentForm.payment_way === "default" ? (
                <>
                
                  <div className="col-md-4">
                    <label className="form-label">Key ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={paymentForm.key_id}
                      onChange={(e) => setPaymentForm({ ...paymentForm, key_id: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Key Secret</label>
                    <input
                      type="password"
                      className="form-control"
                      value={paymentForm.key_secret}
                      onChange={(e) => setPaymentForm({ ...paymentForm, key_secret: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Webhook Secret</label>
                    <input
                      type="password"
                      className="form-control"
                      value={paymentForm.webhook_secret}
                      onChange={(e) => setPaymentForm({ ...paymentForm, webhook_secret: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <div className="col-md-4">
                  <label className="form-label">Payment URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentForm.payment_url}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_url: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="row g-3 mt-3 align-items-end">


              <div className="col-md-3">
                <label className="form-label">Associated Business</label>
                <select
                  className="form-select"
                  value={paymentForm.id_business}
                  onChange={(e) => setPaymentForm({ ...paymentForm, id_business: e.target.value })}
                >
                  <option value="">-- Select Business --</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.business_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label d-block">Configuration Status</label>
                <div className="d-flex align-items-center mt-2">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="paymentActiveSwitch"
                      checked={paymentForm.is_active}
                      onChange={(e) => setPaymentForm({ ...paymentForm, is_active: e.target.checked })}
                      style={{
                        width: "2.8rem",
                        height: "1.4rem",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <span
                    className={`ms-2 fw-bold ${paymentForm.is_active ? "text-success" : "text-secondary"}`}
                    style={{ fontSize: "1rem" }}
                  >
                    {paymentForm.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-end mt-4">
              <button className="btn btn-primary" onClick={savePaymentConfig} disabled={loading}>
                Save Payment Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default configsetup;
