import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [tareas, setTareas] = useState([]);
    const [nuevaTarea, setNuevaTarea] = useState('');
    const token = localStorage.getItem('token');

    const obtenerTareas = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTareas(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const agregarTarea = async () => {
        try {
            await axios.post('http://localhost:3000/api/tasks', { descripcion: nuevaTarea }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNuevaTarea('');
            obtenerTareas();
        } catch (error) {
            console.error(error);
        }
    };

    const eliminarTarea = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            obtenerTareas();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        obtenerTareas();
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Gestor de Tareas</h2>

            <div className="input-group mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nueva tarea..."
                    value={nuevaTarea}
                    onChange={(e) => setNuevaTarea(e.target.value)}
                />
                <button onClick={agregarTarea} className="btn btn-primary">Agregar</button>
            </div>

            <ul className="list-group">
                {tareas.map((tarea) => (
                    <li key={tarea.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {tarea.descripcion}
                        <button
                            onClick={() => eliminarTarea(tarea.id)}
                            className="btn btn-sm btn-danger"
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
