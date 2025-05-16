import React from 'react';

const Footer = () => {
    return (
        <footer style={footerStyle}>
            <p>© 2025 Gestor de Tareas. Todos los derechos reservados.</p>
        </footer>
    );
};

const footerStyle = {
    backgroundColor: '#222',
    color: '#fff',
    textAlign: 'center',
    padding: '15px 10px',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    fontSize: '14px',
    boxShadow: '0 -1px 5px rgba(0,0,0,0.3)',
};

export default Footer;
