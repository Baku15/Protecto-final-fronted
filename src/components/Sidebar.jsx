import React, { useState } from 'react';
import { FaSignOutAlt, FaBars, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav
            style={{
                width: collapsed ? '60px' : '200px',
                transition: 'width 0.3s ease',
                backgroundColor: '#343a40',
                color: 'white',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '10px',
            }}
        >
            {/* Botón de colapsar/expandir */}
            <div
                style={{
                    padding: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: collapsed ? 'center' : 'flex-end',
                }}
                onClick={toggleSidebar}
            >
                <FaBars size={20} />
            </div>

            {/* Ícono de Home */}
            <ul
                style={{
                    listStyleType: 'none',
                    padding: 0,
                    marginTop: '20px',
                    flexGrow: 1,
                }}
            >
                <li style={{ margin: '10px 0' }}>
                    <Link
                        to="/dashboard"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'white',
                            textDecoration: 'none',
                            padding: '8px 15px',
                        }}
                    >
                        <FaHome size={18} />
                        {!collapsed && <span style={{ marginLeft: '15px' }}>Inicio</span>}
                    </Link>
                </li>
            </ul>

            {/* Logout */}
            <div
                onClick={handleLogout}
                style={{
                    cursor: 'pointer',
                    padding: '10px 15px',
                    display: 'flex',
                    alignItems: 'center',
                    borderTop: '1px solid #495057',
                    marginTop: 'auto',
                    color: 'white',
                }}
            >
                <FaSignOutAlt size={18} />
                {!collapsed && <span style={{ marginLeft: '15px' }}>Cerrar sesión</span>}
            </div>
        </nav>
    );
};

export default Sidebar;
