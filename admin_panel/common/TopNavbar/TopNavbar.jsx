import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router-dom";
import { 
  faSearch, 
  faUser, 
  faSignOutAlt,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import styles from './TopNavbar.module.css';
import ApiService from '../../service/Apiservice';

const TopNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("admin_user")) || {};
  const userName = user.name || "Super Admin";
  const userEmail = user.email || "narebhaai@gmail.com";
  const userRole = user.role || "Super Admin";
  
  const handleLogout = async () => { 
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
    navigate("/admin/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Inactivity Auto Logout (2 hours)
  useEffect(() => {
    const TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours
    let logoutTimer;

    const doLogout = () => {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_user');
      navigate("/admin/login");
    };

    const resetTimers = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(doLogout, TIMEOUT_MS);
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach(e => window.addEventListener(e, resetTimers));

    resetTimers();

    return () => {
      clearTimeout(logoutTimer);
      activityEvents.forEach(e => window.removeEventListener(e, resetTimers));
    };
  }, [navigate]);

  return (
    <header className={styles.topNavbar}>
      <div className={styles.navbarLeft}>
        <h3 className={styles.navbarTitle}>
          PrepAI <span className={styles.adminBadge}>Admin Cockpit</span>
        </h3>
      </div>

      <div className={styles.navbarRight}>
        <div className={styles.navIcons}>
          <div className={styles.profileDropdown} ref={profileRef}>
            <button 
              className={styles.profileBtn}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className={styles.profileAvatar}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>{userName}</span>
                <span className={styles.profileRole}>{userRole}</span>
              </div>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`${styles.dropdownArrow} ${isProfileOpen ? styles.rotated : ''}`} 
              />
            </button>
            
            {isProfileOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownAvatar}>
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className={styles.dropdownUserInfo}>
                    <div className={styles.dropdownUserName}>{userName}</div>
                    <div className={styles.dropdownUserEmail}>{userEmail}</div>
                  </div>
                </div>
                
                <div className={styles.dropdownDivider}></div>
                
                <a href="/admin/profile" className={styles.dropdownItem}>
                  <FontAwesomeIcon icon={faUser} className={styles.dropdownIcon} />
                  <span>My account</span>
                </a>
                
                <div className={styles.dropdownDivider}></div>
                
                <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className={styles.dropdownIcon} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
