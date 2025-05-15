import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setMensaje('❌ Error al iniciar sesión. Verifica tus datos.');
        }
    };

    return (
        <div
            style={{
                backgroundImage: 'url("/ucb-logo.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                paddingTop: '60px',
            }}
        >
            {/* NAVBAR */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container">
                    <Link className="navbar-brand" to="/">Gestor de Tareas</Link>
                    <div className="d-flex">
                        <Link to="/registro" className="btn btn-outline-light">Registrarse</Link>
                    </div>
                </div>
            </nav>

            {/* FORMULARIO */}
            <div className="container mt-5 pt-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow bg-light bg-opacity-75">
                            <div className="card-body">
                                <h3 className="text-center mb-4">Iniciar sesión</h3>
                                <form onSubmit={handleSubmit}>
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
                                    <button type="submit" className="btn btn-success w-100">
                                        Ingresar
                                    </button>
                                </form>
                                {mensaje && (
                                    <div className="alert alert-danger mt-3 text-center">
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

export default Login;
