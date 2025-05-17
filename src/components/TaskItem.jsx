import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import styles from './TaskItem.module.css'; // Import CSS Module

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
                {
                    ...formData,
                    status: 'progreso',
                },
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
        try {
            let nuevoEstado = tarea.status;

            const hoy = dayjs().startOf('day');
            const fechaLimite = tarea.dueDate ? dayjs(tarea.dueDate).startOf('day') : null;

            if (tarea.status === 'progreso') {
                if (fechaLimite && fechaLimite.isBefore(hoy)) {
                    setError('No puedes completar una tarea que ya venció.');
                    return;
                }
                nuevoEstado = 'completada';
            } else if (tarea.status === 'pendiente') {
                nuevoEstado = 'progreso';
            } else if (tarea.status === 'completada') {
                nuevoEstado = 'progreso';
            }

            if (nuevoEstado !== tarea.status) {
                await axios.put(
                    `http://localhost:3000/api/tasks/${tarea.id}`,
                    { status: nuevoEstado },
                    { headers }
                );
                onUpdate();
            }
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
            {error && <div className={styles.alertError}>{error}</div>}
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
            <li className={styles.listItem}>
                <div className={styles.flexContainer}>
                    <div className={styles.flexGrow}>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className={`form-check-input ${styles.formCheckInput}`}
                                id={`check-${tarea.id}`}
                                checked={tarea.status === 'completada'}
                                onChange={alternarEstado}
                            />
                            <label
                                htmlFor={`check-${tarea.id}`}
                                className={`form-check-label ${
                                    tarea.status === 'progreso'
                                        ? styles.titleProgreso
                                        : tarea.status === 'pendiente'
                                            ? styles.titlePendiente
                                            : styles.titleCompletada
                                }`}
                            >
                                {tarea.title}
                            </label>
                        </div>
                        {tarea.description && <div className={styles.descriptionText}>{tarea.description}</div>}
                        {tarea.dueDate && (
                            <>
                                <small className={`${styles.fechaEntrega} ${vencida ? styles.textDanger : styles.textInfo}`}>
                                    <i className="bi bi-calendar-event"></i>{' '}
                                    <strong>Fecha de entrega:</strong>{' '}
                                    {dayjs(tarea.dueDate).format('D [de] MMMM [de] YYYY')}
                                </small>
                                <small className={`${styles.estado} ${
                                    tarea.status === 'progreso' ? styles.titleProgreso :
                                        tarea.status === 'pendiente' ? styles.titlePendiente :
                                            styles.titleCompletada
                                }`}>
                                    <i className="bi bi-info-circle"></i>{' '}
                                    <strong>Estado:</strong>{' '}
                                    {tarea.status.charAt(0).toUpperCase() + tarea.status.slice(1)}
                                </small>
                            </>
                        )}
                    </div>
                    <div className={styles.btnGroup}>
                        {tarea.status !== 'completada' && (
                            <button
                                className={styles.btnWarning}
                                title="Editar"
                                onClick={() => setModoEdicion(true)}
                            >
                                <i className="bi bi-pencil-fill"></i>
                            </button>
                        )}

                        {tarea.status === 'completada' && (
                            <button
                                className={styles.btnDanger}
                                title="Eliminar"
                                onClick={() => onDelete(tarea.id)}
                            >
                                <i className="bi bi-trash-fill"></i>
                            </button>
                        )}
                    </div>
                </div>
            </li>
        );
    };

    return modoEdicion ? renderModoEdicion() : renderVistaNormal();
};

export default TaskItem;
