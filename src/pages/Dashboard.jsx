import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirige si no hay token
        }
    }, [navigate]);

    return (
        <div>
            <h2>Panel de Tareas</h2>
            <p>Bienvenido. Aquí verás tus tareas.</p>
        </div>
    );
};

export default Dashboard;
