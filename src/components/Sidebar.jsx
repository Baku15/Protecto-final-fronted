import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaBars, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileView, setMobileView] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setMobileView(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setMobileSidebarOpen(false);
                setCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        if (mobileView) {
            setMobileSidebarOpen(!mobileSidebarOpen);
        } else {
            setCollapsed(!collapsed);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <>
            {/* Botón hamburguesa fijo en móvil */}
            {mobileView && (
                <button
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        top: 15,
                        left: 15,
                        zIndex: 1200,
                        backgroundColor: '#343a40',
                        border: 'none',
                        padding: '8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'white',
                    }}
                    aria-label="Toggle sidebar"
                >
                    <FaBars size={20} />
                </button>
            )}

            {/* Overlay para móvil */}
            {mobileView && mobileSidebarOpen && (
                <div
                    onClick={() => setMobileSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        zIndex: 1100,
                    }}
                />
            )}

            <nav
                style={{
                    position: mobileView ? 'fixed' : 'sticky',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: mobileView ? '200px' : collapsed ? '60px' : '200px',
                    backgroundColor: '#343a40',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: '10px',
                    paddingLeft: mobileView && !mobileSidebarOpen ? 0 : '10px',
                    overflowX: 'hidden',
                    transition: 'transform 0.3s ease',
                    zIndex: 1150,
                    boxShadow: mobileView && mobileSidebarOpen ? '2px 0 5px rgba(0,0,0,0.5)' : 'none',

                    // Usamos transform para mostrar/ocultar el sidebar en móvil
                    transform: mobileView
                        ? mobileSidebarOpen
                            ? 'translateX(0)'
                            : 'translateX(-100%)'
                        : 'none',
                }}
            >
                {/* Botón hamburguesa para desktop (toggle collapse) */}
                {!mobileView && (
                    <div
                        onClick={toggleSidebar}
                        style={{
                            padding: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: collapsed ? 'center' : 'flex-end',
                        }}
                        aria-label="Toggle sidebar"
                    >
                        <FaBars size={20} />
                    </div>
                )}

                {/* Menú */}
                <ul
                    style={{
                        listStyleType: 'none',
                        padding: 0,
                        marginTop: '20px',
                        flexGrow: 1,
                        display: mobileView && !mobileSidebarOpen ? 'none' : 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                >
                    <li>
                        <Link
                            to="/dashboard"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'white',
                                textDecoration: 'none',
                                padding: '8px 15px',
                                whiteSpace: 'nowrap',
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
                        display: mobileView && !mobileSidebarOpen ? 'none' : 'flex',
                        alignItems: 'center',
                        borderTop: '1px solid #495057',
                        marginTop: 'auto',
                        color: 'white',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <FaSignOutAlt size={18} />
                    {!collapsed && <span style={{ marginLeft: '15px' }}>Cerrar sesión</span>}
                </div>
            </nav>
        </>
    );
};

export default Sidebar;
