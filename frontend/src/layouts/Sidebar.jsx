import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, Settings, LogOut, FileUp } from 'lucide-react';
import clsx from 'clsx';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const navItems = {
    STUDENT: [
      { path: '/student', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/student/recommendations', label: 'Recommendations', icon: Users },
      { path: '/student/upload', label: 'Upload Report', icon: FileUp },
    ],
    FACULTY: [
      { path: '/faculty', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/faculty/requests', label: 'Student Requests', icon: Users },
      { path: '/faculty/profile', label: 'Profile Settings', icon: Settings },
    ],
    ADMIN: [
      { path: '/admin', label: 'Overview', icon: LayoutDashboard },
      { path: '/admin/users', label: 'User Management', icon: Users },
      { path: '/admin/settings', label: 'System Settings', icon: Settings },
    ]
  };

  const currentNav = navItems[user?.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar} />}
      
      <aside className={clsx(styles.sidebar, isOpen && styles.open)}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>SA</div>
            <h2>Smart Alloc</h2>
          </div>
        </div>

        <nav className={styles.nav}>
          {currentNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/${user?.role.toLowerCase()}`}
              className={({ isActive }) => clsx(styles.navItem, isActive && styles.active)}
              onClick={() => window.innerWidth < 768 && toggleSidebar()}
            >
              <item.icon className={styles.icon} size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
          </div>
          <button onClick={logout} className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
