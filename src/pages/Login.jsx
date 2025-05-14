import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password,
            });

            const { token } = respuesta.data;
            localStorage.setItem('token', token); // Guardar JWT
            navigate('/dashboard'); // Redirigir al panel
        } catch (error) {
            console.error(error);
            setMensaje('Credenciales incorrectas');
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />
                <button type="submit">Ingresar</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
};

export default Login;
