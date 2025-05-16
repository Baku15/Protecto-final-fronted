import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import debounce from 'lodash.debounce'; // <- Asegúrate de instalar lodash.debounce

const Dashboard = () => {
    const [tareas, setTareas] = useState([]);
    const [filtros, setFiltros] = useState({
        titulo: '',
        estado: '',
        order: '',
        fecha: '',
        fechaInicio: '',
        fechaFin: '',
        dueDateDesde: '',
        dueDateHasta: ''
    });

    const token = localStorage.getItem('token');

    const obtenerTareas = useCallback(async () => {
        try {
            const params = {};
            const {
                titulo,
                estado,
                order,
                fecha,
                fechaInicio,
                fechaFin,
                dueDateDesde,
                dueDateHasta
            } = filtros;

            if (titulo) params.title = titulo;
            if (estado) params.status = estado;
            if (order) params.orden = order;
            if (fecha) params.dueDate = fecha;
            if (fechaInicio && fechaFin) {
                params.fechaInicio = fechaInicio;
                params.fechaFin = fechaFin;
            }
            if (dueDateDesde && dueDateHasta) {
                params.dueDateDesde = dueDateDesde;
                params.dueDateHasta = dueDateHasta;
            }

            const response = await axios.get('http://localhost:3000/api/tasks/filter', {
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
            await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            obtenerTareas();
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
        }
    };

    // Función para limpiar filtros de fecha
    const limpiarFiltrosFecha = () => {
        setFiltros((prev) => ({
            ...prev,
            fecha: '',
            fechaInicio: '',
            fechaFin: ''
        }));
    };

    // Ejecutar la carga inicial
    useEffect(() => {
        obtenerTareas();
    }, [obtenerTareas]);

    // Debounce para evitar muchas peticiones al backend al filtrar por título
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

    // Limpieza del debounce al desmontar el componente
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

    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <h2 className="mb-4 text-center">Gestor de Tareas</h2>

                <div className="row mb-4">
                    {/* Formulario nueva tarea */}
                    <div className="col-md-4">
                        <div className="card p-3 shadow-sm border-info h-100">
                            <h5 className="mb-3 text-info">Nueva Tarea</h5>
                            <TaskForm onTaskCreated={obtenerTareas} />
                        </div>
                    </div>

                    {/* Filtros generales */}
                    <div className="col-md-4">
                        <div className="card p-3 shadow-sm bg-light border-success h-100">
                            <h5 className="mb-3 text-success">Filtros generales</h5>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="titulo"
                                    className="form-control"
                                    placeholder="Buscar por título"
                                    defaultValue={filtros.titulo}
                                    onChange={handleFiltroChange}
                                />
                            </div>
                            <div className="mb-3">
                                <select
                                    name="estado"
                                    className="form-select"
                                    value={filtros.estado}
                                    onChange={handleFiltroChange}
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="completada">Completada</option>
                                </select>
                            </div>
                            <div className="mb-3">
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
                    </div>

                    {/* Filtros por fecha */}
                    <div className="col-md-4">
                        <div className="card p-3 shadow-sm bg-light border-primary h-100">
                            <h5 className="mb-3 text-primary">Filtros por fecha</h5>
                            <div className="mb-3">
                                <label className="form-label">Fecha exacta</label>
                                <input
                                    type="date"
                                    name="fecha"
                                    className="form-control"
                                    value={filtros.fecha}
                                    onChange={handleFiltroChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Fecha desde (creación)</label>
                                <input
                                    type="date"
                                    name="fechaInicio"
                                    className="form-control"
                                    value={filtros.fechaInicio}
                                    onChange={handleFiltroChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Fecha hasta (creación)</label>
                                <input
                                    type="date"
                                    name="fechaFin"
                                    className="form-control"
                                    value={filtros.fechaFin}
                                    onChange={handleFiltroChange}
                                />
                            </div>

                            {/* Botón para limpiar filtros de fecha */}
                            <div className="d-grid">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={limpiarFiltrosFecha}
                                >
                                    Limpiar filtros de fecha
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de tareas */}
                <h5 className="mb-3 text-secondary">Listado de tareas</h5>
                <ul className="list-group mb-5">
                    {tareas.length ? (
                        tareas.map((tarea) => (
                            <TaskItem
                                key={tarea.id}
                                tarea={tarea}
                                onUpdate={obtenerTareas}
                                onDelete={eliminarTarea}
                            />
                        ))
                    ) : (
                        <li className="list-group-item text-center text-muted">
                            No se encontraron tareas
                        </li>
                    )}
                </ul>
            </main>
        </div>
    );
};

export default Dashboard;
