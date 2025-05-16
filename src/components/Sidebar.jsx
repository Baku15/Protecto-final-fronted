import React, { useState } from 'react';
import { FaPlus, FaList, FaEdit, FaSignOutAlt, FaBars } from 'react-icons/fa';
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

    // Definimos las opciones del sidebar
    const menuItems = [
        { name: 'Crear', icon: <FaPlus />, path: '/dashboard/create' },
        { name: 'Listar', icon: <FaList />, path: '/dashboard' },
        { name: 'Editar', icon: <FaEdit />, path: '/dashboard/edit' },
    ];

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
            {/* Botón para colapsar/expandir */}
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

            {/* Menú */}
            <ul
                style={{
                    listStyleType: 'none',
                    padding: 0,
                    marginTop: '20px',
                    flexGrow: 1,
                }}
            >
                {menuItems.map((item) => (
                    <li key={item.name} style={{ margin: '10px 0' }}>
                        <Link
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'white',
                                textDecoration: 'none',
                                padding: '8px 15px',
                                whiteSpace: 'nowrap',
                            }}
                            className="sidebar-link"
                        >
                            <span style={{ fontSize: '18px', minWidth: '24px' }}>{item.icon}</span>
                            {!collapsed && <span style={{ marginLeft: '15px' }}>{item.name}</span>}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Logout abajo */}
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
                className="sidebar-logout"
            >
                <FaSignOutAlt size={18} />
                {!collapsed && <span style={{ marginLeft: '15px' }}>Cerrar sesión</span>}
            </div>
        </nav>
    );
};

export default Sidebar;
