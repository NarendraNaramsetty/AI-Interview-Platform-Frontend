import React, { useEffect, useState } from "react";
import styles from "./Permission.module.css";
import ApiService from "../../../service/Apiservice.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt, faSave, faUserShield, faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";

const Permission = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userRole = user?.id_role || "";
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [submenuPermissions, setSubmenuPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all roles
  const loadRoles = async () => {
    try {
      const res = await ApiService.getRolesList(userRole);
      const list = res?.data?.data || [];
      setRoles(list);

      if (list.length > 0) {
        setSelectedRole(list[0].id_role);
      }
    } catch (error) {
      console.error("Error loading roles:", error);
      toast.error("Failed to load roles");
    }
  };

  // Load permissions for selected role
  const loadRolePermissions = async (roleId) => {
    setLoading(true);
    try {
      const res = await ApiService.getSubmenuRoleUpdateList({
        id_role: roleId,
      });
      setSubmenuPermissions(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching submenu permissions:", error);
      toast.error("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      loadRolePermissions(selectedRole);
    }
  }, [selectedRole]);

  // Update permission
  const updatePermission = async (submenuId, field, currentValue) => {
    const newValue = currentValue ? 0 : 1;
    const currentRow = submenuPermissions.find((i) => i.id_submenu === submenuId);

    const payload = {
      id_role: selectedRole,
      submenu_id: submenuId,
      view: field === "view_permit" ? newValue : (currentRow?.view_permit ? 1 : 0),
      add: field === "add_permit" ? newValue : (currentRow?.add_permit ? 1 : 0),
      edit: field === "edit_permit" ? newValue : (currentRow?.edit_permit ? 1 : 0),
      delete: field === "delete_permit" ? newValue : (currentRow?.delete_permit ? 1 : 0),
    };

    try {
      // Instantly update local state for fast UI feedback
      setSubmenuPermissions((prev) =>
        prev.map((item) =>
          item.id_submenu === submenuId
            ? { ...item, [field]: !currentValue }
            : item
        )
      );

      const res = await ApiService.updateMenuPermission(payload);
      toast.success(res?.data?.message || "Permission updated successfully!");
    } catch (error) {
      console.error("Permission update failed:", error);
      toast.error("Failed to update permission");
      // Rollback on error
      setSubmenuPermissions((prev) =>
        prev.map((item) =>
          item.id_submenu === submenuId
            ? { ...item, [field]: currentValue }
            : item
        )
      );
    }
  };

  // Toggle all permissions for a row
  const toggleRowAllPermissions = async (submenuId, currentAllChecked) => {
    const newValue = currentAllChecked ? 0 : 1;
    const newValueBool = !currentAllChecked;

    const payload = {
      id_role: selectedRole,
      submenu_id: submenuId,
      view: newValue,
      add: newValue,
      edit: newValue,
      delete: newValue,
    };

    const previousRowState = submenuPermissions.find((i) => i.id_submenu === submenuId);

    try {
      // Instantly update local state for fast UI feedback
      setSubmenuPermissions((prev) =>
        prev.map((item) =>
          item.id_submenu === submenuId
            ? {
                ...item,
                view_permit: newValueBool,
                add_permit: newValueBool,
                edit_permit: newValueBool,
                delete_permit: newValueBool,
              }
            : item
        )
      );

      const res = await ApiService.updateMenuPermission(payload);
      toast.success(res?.data?.message || "Permissions updated successfully!");
    } catch (error) {
      console.error("Permission update failed:", error);
      toast.error("Failed to update permissions");
      // Rollback on error
      if (previousRowState) {
        setSubmenuPermissions((prev) =>
          prev.map((item) =>
            item.id_submenu === submenuId ? { ...previousRowState } : item
          )
        );
      }
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <FontAwesomeIcon icon={faShieldAlt} className={styles.headerIcon} />
          <div>
            <h2 className={styles.title}>Role & Permissions Management</h2>
            <p className={styles.subtitle}>Configure access levels, menus, and CRUD operations for user roles</p>
          </div>
        </div>
      </div>

      <div className={styles.layoutGrid}>
        {/* Left Sidebar: Roles Selection */}
        <div className={styles.roleCard}>
          <h3 className={styles.cardTitle}>
            <FontAwesomeIcon icon={faUserShield} className={styles.cardTitleIcon} /> Select Role
          </h3>
          <div className={styles.roleList}>
            {roles.map((role) => {
              const isActive = selectedRole === role.id_role;
              return (
                <button
                  key={role.id_role}
                  className={`${styles.roleItem} ${isActive ? styles.roleItemActive : ""}`}
                  onClick={() => setSelectedRole(role.id_role)}
                >
                  <span className={styles.roleIndicator}></span>
                  <span className={styles.roleName}>{role.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Permissions Matrix */}
        <div className={styles.matrixCard}>
          <div className={styles.matrixHeader}>
            <span>Permission Matrix – <strong>{roles.find((r) => r.id_role === selectedRole)?.name || "N/A"}</strong></span>
          </div>

          <div className={styles.matrixBody}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Loading permission access...</p>
              </div>
            ) : (
              <div className={styles.tableResponsive}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.thMenu}>Menu/Submenu Option</th>
                      <th className={styles.thCell}>All</th>
                      <th className={styles.thCell}>View</th>
                      <th className={styles.thCell}>Add</th>
                      <th className={styles.thCell}>Edit</th>
                      <th className={styles.thCell}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submenuPermissions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className={styles.emptyRow}>
                          No submenu permissions available for this role.
                        </td>
                      </tr>
                    ) : (
                      submenuPermissions.map((menu) => {
                        const isAllChecked = !!(
                          menu.view_permit &&
                          menu.add_permit &&
                          menu.edit_permit &&
                          menu.delete_permit
                        );
                        return (
                          <tr key={menu.id_submenu} className={styles.tr}>
                            <td className={styles.tdMenu}>{menu.submenuname}</td>
                            
                            {/* ALL */}
                            <td className={styles.tdCell}>
                              <label className={styles.checkboxWrapper}>
                                <input
                                  type="checkbox"
                                  checked={isAllChecked}
                                  onChange={() =>
                                    toggleRowAllPermissions(menu.id_submenu, isAllChecked)
                                  }
                                  className={styles.hiddenCheckbox}
                                />
                                <div className={`${styles.customCheckbox} ${isAllChecked ? styles.checked : ""}`}>
                                  <FontAwesomeIcon icon={isAllChecked ? faCheckSquare : faSquare} />
                                </div>
                              </label>
                            </td>

                            {/* VIEW */}
                            <td className={styles.tdCell}>
                              <label className={styles.checkboxWrapper}>
                                <input
                                  type="checkbox"
                                  checked={menu.view_permit}
                                  onChange={() =>
                                    updatePermission(menu.id_submenu, "view_permit", menu.view_permit)
                                  }
                                  className={styles.hiddenCheckbox}
                                />
                                <div className={`${styles.customCheckbox} ${menu.view_permit ? styles.checked : ""}`}>
                                  <FontAwesomeIcon icon={menu.view_permit ? faCheckSquare : faSquare} />
                                </div>
                              </label>
                            </td>

                            {/* ADD */}
                            <td className={styles.tdCell}>
                              <label className={styles.checkboxWrapper}>
                                <input
                                  type="checkbox"
                                  checked={menu.add_permit}
                                  onChange={() =>
                                    updatePermission(menu.id_submenu, "add_permit", menu.add_permit)
                                  }
                                  className={styles.hiddenCheckbox}
                                />
                                <div className={`${styles.customCheckbox} ${menu.add_permit ? styles.checked : ""}`}>
                                  <FontAwesomeIcon icon={menu.add_permit ? faCheckSquare : faSquare} />
                                </div>
                              </label>
                            </td>

                            {/* EDIT */}
                            <td className={styles.tdCell}>
                              <label className={styles.checkboxWrapper}>
                                <input
                                  type="checkbox"
                                  checked={menu.edit_permit}
                                  onChange={() =>
                                    updatePermission(menu.id_submenu, "edit_permit", menu.edit_permit)
                                  }
                                  className={styles.hiddenCheckbox}
                                />
                                <div className={`${styles.customCheckbox} ${menu.edit_permit ? styles.checked : ""}`}>
                                  <FontAwesomeIcon icon={menu.edit_permit ? faCheckSquare : faSquare} />
                                </div>
                              </label>
                            </td>

                            {/* DELETE */}
                            <td className={styles.tdCell}>
                              <label className={styles.checkboxWrapper}>
                                <input
                                  type="checkbox"
                                  checked={menu.delete_permit}
                                  onChange={() =>
                                    updatePermission(menu.id_submenu, "delete_permit", menu.delete_permit)
                                  }
                                  className={styles.hiddenCheckbox}
                                />
                                <div className={`${styles.customCheckbox} ${menu.delete_permit ? styles.checked : ""}`}>
                                  <FontAwesomeIcon icon={menu.delete_permit ? faCheckSquare : faSquare} />
                                </div>
                              </label>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className={styles.matrixFooter}>
            <FontAwesomeIcon icon={faSave} className={styles.footerIcon} /> Changes are saved automatically upon selection.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permission;
