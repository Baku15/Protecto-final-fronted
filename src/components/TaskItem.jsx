import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const TaskItem = ({ tarea, onUpdate, onDelete }) => {
    const [modoEdicion, setModoEdicion] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: tarea.title,
        description: tarea.description,
        dueDate: tarea.dueDate ? tarea.dueDate.substring(0, 10) : '',
    });

    const token = localStorage.getItem('token');

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const actualizarTarea = async () => {
        setError(null);

        if (formData.dueDate) {
            const hoy = dayjs().startOf('day');
            const fechaSeleccionada = dayjs(formData.dueDate);
            if (fechaSeleccionada.isBefore(hoy)) {
                setError('La fecha límite no puede ser anterior a hoy.');
                return;
            }
        }

        try {
            await axios.put(
                `http://localhost:3000/api/tasks/${tarea.id}`,
                formData,
                { headers }
            );
            setModoEdicion(false);
            onUpdate();
        } catch (error) {
            const mensajeError = error.response?.data?.mensaje || 'Error al actualizar la tarea. Intenta de nuevo.';
            setError(mensajeError);
        }
    };

    const alternarEstado = async () => {
        const nuevoEstado = tarea.status === 'completada' ? 'pendiente' : 'completada';

        try {
            await axios.put(
                `http://localhost:3000/api/tasks/${tarea.id}`,
                { status: nuevoEstado },
                { headers }
            );
            onUpdate();
        } catch (error) {
            console.error('❌ Error al cambiar estado:', error.response?.data || error.message);
            setError('Error al cambiar estado. Intenta de nuevo.');
        }
    };

    const renderModoEdicion = () => (
        <div>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">Título</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Descripción</label>
                <textarea
                    name="description"
                    id="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="dueDate" className="form-label">Fecha límite</label>
                <input
                    type="date"
                    name="dueDate"
                    id="dueDate"
                    className="form-control"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    min={dayjs().format('YYYY-MM-DD')}
                />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="text-end">
                <button className="btn btn-success me-2" onClick={actualizarTarea}>
                    <i className="bi bi-check-circle me-1"></i>Guardar
                </button>
                <button className="btn btn-secondary" onClick={() => { setModoEdicion(false); setError(null); }}>
                    <i className="bi bi-x-circle me-1"></i>Cancelar
                </button>
            </div>
        </div>
    );

    const renderVistaNormal = () => {
        const vencida = tarea.dueDate && dayjs(tarea.dueDate).isBefore(dayjs(), 'day');

        return (
            <div className="d-flex justify-content-between gap-3">
                <div className="flex-grow-1">
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input me-2"
                            id={`check-${tarea.id}`}
                            checked={tarea.status === 'completada'}
                            onChange={alternarEstado}
                        />
                        <label
                            htmlFor={`check-${tarea.id}`}
                            className={`form-check-label ${
                                tarea.status === 'completada'
                                    ? 'text-decoration-line-through text-muted'
                                    : 'fw-bold'
                            }`}
                        >
                            {tarea.title}
                        </label>
                    </div>
                    {tarea.description && <div className="text-secondary">{tarea.description}</div>}
                    {tarea.dueDate && (
                        <>
                            <small className={`d-block mt-1 ${vencida ? 'text-danger' : 'text-info'}`}>
                                <i className="bi bi-calendar-event"></i>{' '}
                                <strong>Fecha de entrega:</strong>{' '}
                                {dayjs(tarea.dueDate).format('D [de] MMMM [de] YYYY')}
                            </small>
                            <small className={`d-block ${vencida ? 'text-warning' : 'text-secondary'}`}>
                                <i className="bi bi-hourglass-split"></i>{' '}
                                <strong>Límite:</strong>{' '}
                                {dayjs(tarea.dueDate).format('DD/MM/YYYY')}
                            </small>
                        </>
                    )}

                    <span
                        className={`badge mt-2 ${
                            tarea.status === 'completada' ? 'bg-success' : 'bg-warning text-dark'
                        }`}
                    >
                        <i
                            className={`bi ${
                                tarea.status === 'completada' ? 'bi-check2-circle' : 'bi-exclamation-circle'
                            }`}
                        ></i>{' '}
                        {tarea.status}
                    </span>
                </div>
                <div className="d-flex flex-column justify-content-start align-items-end gap-1">
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setModoEdicion(true)}
                        title="Editar"
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(tarea.id)}
                        title="Eliminar"
                    >
                        <i className="bi bi-trash3"></i>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <li className="list-group-item mb-3 rounded-4 shadow-sm border border-1 p-3 animate__animated animate__fadeIn">
            {modoEdicion ? renderModoEdicion() : renderVistaNormal()}
        </li>
    );
};

export default TaskItem;
