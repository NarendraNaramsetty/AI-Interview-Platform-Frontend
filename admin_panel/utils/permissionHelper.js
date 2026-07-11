/**
 * Utility helper to get CRUD permissions for the current page path.
 */
export const getPermissions = (path) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    // Super Admin role bypasses normal role restriction checks
    if (user.role_name === "Super Admin" || user.id_role === 2 || user.id_role === "2") {
      return { add: true, edit: true, delete: true, view: true };
    }

    const menuData = JSON.parse(localStorage.getItem("sidebarMenu")) || [];
    let perm = { add: false, edit: false, delete: false, view: false };

    for (const menu of menuData) {
      // Direct menu match (e.g. Dashboard)
      if (menu.menu_path === path) {
        perm = { add: true, edit: true, delete: true, view: true };
        break;
      }

      if (!menu.submenus) continue;

      // Submenu path match
      const sub = menu.submenus.find(sm => sm.path === path);
      if (sub) {
        perm = {
          add: !!sub.add,
          edit: !!sub.edit,
          delete: !!sub.delete,
          view: !!sub.view
        };
        break;
      }
    }
    return perm;
  } catch (error) {
    console.error("Error reading page permissions:", error);
    return { add: false, edit: false, delete: false, view: false };
  }
};
