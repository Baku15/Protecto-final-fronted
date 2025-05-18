import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${apiUrl}/api/auth/login`, formData);            login(response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setMensaje('❌ Error al iniciar sesión. Verifica tus datos.');
        }
    };

    return (
        <div className={styles.fondo}>
            {/* NAVBAR */}
            <nav className={styles.navbar}>
                <Link className={styles.navbarBrand} to="/">
                    Gestor de Tareas
                </Link>
                <div>
                    <Link to="/registro" className={styles.btnOutlineLight}>
                        Registrarse
                    </Link>
                </div>
            </nav>

            {/* FORMULARIO */}
            <div className={styles.container}>
                <div className={styles.rowCenter}>
                    <div className={styles.colMd6}>
                        <div className={styles.card}>
                            <h3 className={`${styles.textCenter} ${styles.mb4}`}>Iniciar sesión</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className={styles.formLabel}>Correo electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className={styles.formControl}
                                        placeholder="Correo"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className={styles.formLabel}>Contraseña</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className={styles.formControl}
                                        placeholder="Contraseña"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className={styles.btnSuccess}>
                                    Ingresar
                                </button>
                            </form>
                            {mensaje && <div className={styles.alertDanger}>{mensaje}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
