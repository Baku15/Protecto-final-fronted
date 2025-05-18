import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Registro.module.css';

const Registro = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData);
            setMensaje('✅ Registro exitoso. Redirigiendo...');
            setFormData({ name: '', email: '', password: '' });
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error(error);
            setMensaje('❌ Error al registrar. Verifica los campos o el correo.');
        }
    };

    return (
        <div className={styles.background}>
            {/* NAVBAR */}
            <nav className={`navbar navbar-expand-lg navbar-dark bg-dark fixed-top`}>
                <div className="container">
                    <Link className="navbar-brand" to="/">Gestor de Tareas</Link>
                    <div className="d-flex">
                        <Link to="/" className="btn btn-outline-light">Iniciar sesión</Link>
                    </div>
                </div>
            </nav>

            {/* FORMULARIO */}
            <div className={`container mt-5 pt-4 ${styles.containerForm}`}>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className={`card shadow bg-light bg-opacity-75 ${styles.card}`}>
                            <div className="card-body">
                                <h3 className="text-center mb-4">Registro de Usuario</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre completo</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="Nombre"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Correo electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Correo"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            placeholder="Contraseña"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">
                                        Registrarse
                                    </button>
                                </form>
                                {mensaje && (
                                    <div className="alert alert-info mt-3 text-center">
                                        {mensaje}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;
