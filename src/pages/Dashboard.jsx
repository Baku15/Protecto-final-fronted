import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import debounce from 'lodash.debounce';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [tareas, setTareas] = useState([]);
    const [filtros, setFiltros] = useState({
        titulo: '',
        estado: '',
        order: '',
        fechaInicio: '',
        fechaFin: '',
        dueDateDesde: '',
        dueDateHasta: ''
    });

    const token = localStorage.getItem('token');

    const obtenerTareas = useCallback(async () => {
        try {
            const params = {};
            const { titulo, estado, order, fechaInicio, fechaFin, dueDateDesde, dueDateHasta } = filtros;

            if (titulo) params.title = titulo;
            if (estado) params.status = estado;
            if (order) params.orden = order;
            if (fechaInicio && fechaFin) {
                params.fechaInicio = fechaInicio;
                params.fechaFin = fechaFin;
            }
            if (dueDateDesde && dueDateHasta) {
                params.dueDateDesde = dueDateDesde;
                params.dueDateHasta = dueDateHasta;
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/filter`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            setTareas(response.data);
        } catch (error) {
            console.error('Error al obtener tareas:', error);
        }
    }, [filtros, token]);

    const eliminarTarea = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            obtenerTareas();
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
        }
    };

    const limpiarFiltrosFecha = () => {
        setFiltros((prev) => ({
            ...prev,
            fechaInicio: '',
            fechaFin: ''
        }));
    };

    useEffect(() => {
        obtenerTareas();
    }, [obtenerTareas]);

    const debouncedTituloChange = useMemo(
        () =>
            debounce((value) => {
                setFiltros((prev) => ({
                    ...prev,
                    titulo: value
                }));
            }, 500),
        []
    );

    useEffect(() => {
        return () => {
            debouncedTituloChange.cancel();
        };
    }, [debouncedTituloChange]);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;

        if (name === 'titulo') {
            debouncedTituloChange(value);
        } else {
            setFiltros((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const tareasPendientes = tareas.filter(t => t.status === 'pendiente');
    const tareasEnProgreso = tareas.filter(t => t.status === 'progreso');
    const tareasCompletadas = tareas.filter(t => t.status === 'completada');

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.main}>
                <h2 className={styles.title}>Gestor de Tareas</h2>

                <div className={styles.row}>
                    <div className={styles.column}>
                        <div className={`${styles.card} ${styles.cardInfo}`}>
                            <h5 className={styles.filtersTitle}>Nueva Tarea</h5>
                            <TaskForm onTaskCreated={obtenerTareas} />
                        </div>
                    </div>

                    <div className={styles.column}>
                        <div className={`${styles.card} ${styles.cardSuccess}`}>
                            <h5 className={styles.filtersTitle}>Filtros generales</h5>
                            <input
                                type="text"
                                name="titulo"
                                className="form-control mb-2"
                                placeholder="Buscar por título"
                                defaultValue={filtros.titulo}
                                onChange={handleFiltroChange}
                            />
                            <select
                                name="estado"
                                className="form-select mb-2"
                                value={filtros.estado}
                                onChange={handleFiltroChange}
                            >
                                <option value="">Todos los estados</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="progreso">En Progreso</option>
                                <option value="completada">Completada</option>
                            </select>
                            <select
                                name="order"
                                className="form-select"
                                value={filtros.order}
                                onChange={handleFiltroChange}
                            >
                                <option value="">Ordenar por</option>
                                <option value="recientes">Más recientes</option>
                                <option value="antiguos">Más antiguos</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <div className={`${styles.card} ${styles.cardPrimary}`}>
                            <h5 className={styles.filtersTitle}>Filtros por fecha</h5>
                            <label>Desde (creación)</label>
                            <input
                                type="date"
                                name="fechaInicio"
                                className="form-control mb-2"
                                value={filtros.fechaInicio}
                                onChange={handleFiltroChange}
                            />
                            <label>Hasta (creación)</label>
                            <input
                                type="date"
                                name="fechaFin"
                                className="form-control mb-2"
                                value={filtros.fechaFin}
                                onChange={handleFiltroChange}
                            />
                            <button
                                type="button"
                                className={styles.btnOutlineDanger}
                                onClick={limpiarFiltrosFecha}
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                </div>

                <h5 className="text-secondary">Listado de tareas por estado</h5>
                <div className={styles.row}>
                    <div className={styles.column}>
                        <h5 className={styles.textWarning}>Pendientes</h5>
                        <ul className={styles.listGroup}>
                            {tareasPendientes.length ? tareasPendientes.map(tarea => (
                                <TaskItem key={tarea.id} tarea={tarea} onUpdate={obtenerTareas} onDelete={eliminarTarea} />
                            )) : <li className={styles.listItem}>No hay tareas pendientes</li>}
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h5 className={styles.textPrimary}>En Progreso</h5>
                        <ul className={styles.listGroup}>
                            {tareasEnProgreso.length ? tareasEnProgreso.map(tarea => (
                                <TaskItem key={tarea.id} tarea={tarea} onUpdate={obtenerTareas} onDelete={eliminarTarea} />
                            )) : <li className={styles.listItem}>No hay tareas en progreso</li>}
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h5 className={styles.textSuccess}>Completadas</h5>
                        <ul className={styles.listGroup}>
                            {tareasCompletadas.length ? tareasCompletadas.map(tarea => (
                                <TaskItem key={tarea.id} tarea={tarea} onUpdate={obtenerTareas} onDelete={eliminarTarea} />
                            )) : <li className={styles.listItem}>No hay tareas completadas</li>}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
