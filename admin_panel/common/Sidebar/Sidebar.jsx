import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ApiService from "../../service/Apiservice";
import {
  faTachometerAlt,
  faUsers,
  faCog,
  faSignOutAlt,
  faSitemap,
  faBook,
  faUserCheck,
  faUserShield,
  faList,
  faSlidersH,
  faEnvelope,
  faBell,
  faClipboardList,
  faHistory,
  faChevronDown,
  faChevronUp,
  faBars,
  faFolderOpen,
  faCrown,
  faTools,
  faChartBar,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Sidebar.module.css";

const iconMap = {
  faTachometerAlt,
  faUsers,
  faCog,
  faSignOutAlt,
  faBars,
  faSitemap,
  faBook,
  faUserCheck,
  faUserShield,
  faList,
  faSlidersH,
  faEnvelope,
  faBell,
  faClipboardList,
  faHistory,
  faChevronDown,
  faChevronUp,
  faCrown,
  faTools,
  faChartBar,
  faBriefcase,
};

const getIcon = (iconName) => {
  if (!iconName) return faFolderOpen;
  return iconMap[iconName] || faFolderOpen;
};

const Sidebar = () => {
  const [menuList, setMenuList] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  useEffect(() => {
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  const isMobile = window.innerWidth < 768;
  const [mobileOpen, setMobileOpen] = useState(!isMobile);

  useEffect(() => {
    ApiService.getsidebarmenu({})
      .then((response) => {
        if (response?.data?.status || response?.data) {
          const list = response.data.data || response.data || [];
          const fullMenu = [
            {
              id_menu: 0,
              menu_name: "Dashboard",
              menu_icon: "faTachometerAlt",
              menu_path: "/admin/dashboard",
              submenus: [],
            },
            ...list,
          ];
          setMenuList(fullMenu);
        }
      })
      .catch((error) => {
        console.error("Error fetching sidebar menu:", error);
      });
  }, [navigate]);

  useEffect(() => {
    menuList.forEach((menu) => {
      if (menu.submenus && menu.submenus.some((s) => s.path === location.pathname)) {
        setOpenMenu(menu.id_menu);
      }
    });
  }, [location.pathname, menuList]);

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  return (
    <div className={`${styles.sidebar} ${mobileOpen ? styles.sidebarMobileOpen : ""}`}>
      <div className={styles.sidebarHeader}>
        <div className="flex items-center gap-2 font-display font-extrabold text-xl tracking-tight px-4 text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
            PrepAI Admin
          </span>
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <div className={styles.sidebarNav}>
        {menuList.map((menu) => {
          const hasSubmenu = menu.submenus && menu.submenus.length > 0;
          const isMenuActive =
            location.pathname === menu.menu_path ||
            (menu.submenus && menu.submenus.some((s) => {
              const baseS = s.path.split('?')[0];
              const queryS = s.path.includes('?') ? s.path.substring(s.path.indexOf('?')) : '';
              return location.pathname === baseS && (!queryS || location.search === queryS);
            }));

          return (
            <div key={menu.id_menu} className={styles.navItemGroup}>
              {!hasSubmenu && (
                <NavLink
                  to={menu.menu_path}
                  className={`${styles.navItem} ${isMenuActive ? styles.navItemActive : ""}`}
                >
                  <span className={styles.navIcon}>
                    <FontAwesomeIcon icon={getIcon(menu.menu_icon)} />
                  </span>
                  <span className={styles.navLabel}>{menu.menu_name}</span>
                </NavLink>
              )}

              {hasSubmenu && (
                <>
                  <button
                    className={`${styles.navItem} ${isMenuActive ? styles.navItemActive : ""}`}
                    onClick={() => toggleMenu(menu.id_menu)}
                  >
                    <span className={styles.navIcon}>
                      <FontAwesomeIcon icon={getIcon(menu.menu_icon)} />
                    </span>
                    <span className={styles.navLabel}>{menu.menu_name}</span>
                    <span
                      className={styles.arrow}
                      style={{
                        transform:
                          openMenu === menu.id_menu ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      ▼
                    </span>
                  </button>

                  {openMenu === menu.id_menu && (
                    <div className={styles.submenu}>
                      {menu.submenus.map((sub) => {
                        const baseSub = sub.path.split('?')[0];
                        const querySub = sub.path.includes('?') ? sub.path.substring(sub.path.indexOf('?')) : '';
                        const isActive = location.pathname === baseSub && (!querySub || location.search === querySub);
                        return (
                          <NavLink
                            key={sub.id_submenu}
                            to={sub.path}
                            className={`${styles.submenuItem} ${isActive ? styles.submenuItemActive : ""}`}
                          >
                            <span className={styles.submenuIcon}>
                              <FontAwesomeIcon icon={getIcon(sub.icon)} />
                            </span>
                            {sub.name}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.logoutSection}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className={styles.navIcon} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
