// TaskForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const TaskForm = ({ onTaskCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
    });

    const [mensaje, setMensaje] = useState(null);
    const [tipoMensaje, setTipoMensaje] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (mensaje) {
            const timer = setTimeout(() => {
                setMensaje(null);
                setTipoMensaje(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [mensaje]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const crearTarea = async (e) => {
        e.preventDefault();

        if (formData.dueDate) {
            const hoy = dayjs().startOf('day');
            const fechaSeleccionada = dayjs(formData.dueDate);
            if (fechaSeleccionada.isBefore(hoy)) {
                setMensaje('No puedo seleccionar esta fecha.');
                setTipoMensaje('error');
                return;
            }
        }

        try {
            await axios.post(
                'http://localhost:3000/api/tasks',
                {
                    title: formData.title,
                    description: formData.description,
                    dueDate: formData.dueDate,
                    status: 'pendiente', // status pendiente al crear
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMensaje('Tarea creada con éxito');
            setTipoMensaje('exito');
            setFormData({ title: '', description: '', dueDate: '' });
            onTaskCreated();
        } catch (error) {
            console.error('Error al crear tarea:', error);
            setMensaje('Error al crear tarea. Intenta de nuevo.');
            setTipoMensaje('error');
        }
    };

    return (
        <form onSubmit={crearTarea} className="mb-3">
            <div className="mb-3">
                <label className="form-label fs-6 fw-bold">Título</label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Título"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label fs-6 fw-bold">Descripción</label>
                <textarea
                    name="description"
                    className="form-control"
                    placeholder="Descripción"
                    value={formData.description}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="mb-3">
                <label className="form-label fs-6 fw-bold">Fecha de entrega</label>
                <input
                    type="date"
                    name="dueDate"
                    className="form-control"
                    value={formData.dueDate}
                    onChange={handleChange}
                />
            </div>

            {mensaje && (
                <div
                    className={`alert ${
                        tipoMensaje === 'error' ? 'alert-danger' : 'alert-success'
                    }`}
                    role="alert"
                >
                    {mensaje}
                </div>
            )}

            <button
                type="submit"
                className="btn btn-success"
                style={{ width: '100%' }}
            >
                Crear tarea
            </button>
        </form>
    );
};

export default TaskForm;
