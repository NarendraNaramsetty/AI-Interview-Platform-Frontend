import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import ApiService from "../../../service/Apiservice.jsx";
import styles from "./Login.module.css";
import { FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setNotification({ type: "error", message: "Please fill in all fields." });
      return;
    }
    setIsLoading(true);
    setNotification(null);

    try {
      const res = await ApiService.accountlogin({ email, password });
      const data = res.data || res;
      
      if (data?.success && data?.tokens?.access) {
        localStorage.setItem("admin_access_token", data.tokens.access);
        localStorage.setItem("admin_refresh_token", data.tokens.refresh);
        
        const name = [data.user?.first_name, data.user?.last_name].filter(Boolean).join(" ") || "Super Admin";
        login(name, data.user?.role, data.user?.email);
        
        setNotification({ type: "success", message: "Successfully Authenticated!" });
        setTimeout(() => navigate("/admin/dashboard"), 1000);
      } else {
        setNotification({ type: "error", message: data?.message || "Invalid credentials." });
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Connection error to admin API.";
      setNotification({ type: "error", message: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {notification && (
        <div className={`${styles.notif} ${notification.type === 'error' ? styles.notifError : ''}`}>
          {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-2.5 rounded-xl text-white inline-block mb-3 shadow-md shadow-indigo-500/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className={styles.panelTitle}>PrepAI Admin Portal</h2>
          <p className="text-xs text-gray-400 mt-1">Please authenticate with Super Admin credentials</p>
        </div>

        <form onSubmit={handleLogin} className={styles.formStack}>
          <div className={styles.fieldGroup}>
            <input
              className={styles.classicInput}
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className={styles.classicLabel}>Admin Email</label>
          </div>

          <div className={styles.fieldGroup}>
            <input
              className={styles.classicInput}
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className={styles.classicLabel}>Secret Key / Password</label>
            <div className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button type="submit" className={styles.luxuryBtn} disabled={isLoading}>
            {isLoading ? "Validating Session..." : "SECURE LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;