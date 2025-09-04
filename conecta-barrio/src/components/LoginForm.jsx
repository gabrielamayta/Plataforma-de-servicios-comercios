import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.email || !formData.password) {
      setMessage('Por favor, ingresa tu email y contraseña.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('¡Inicio de sesión exitoso!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      setMessage('Ocurrió un error en la conexión.');
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt('Por favor, ingresa tu email para restablecer tu contraseña:');
    if (!email) {
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al intentar restablecer la contraseña.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Iniciar Sesión
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', color: message.includes('Error') ? 'red' : 'green', textAlign: 'center' }}>{message}</p>}
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        <a href="#" onClick={handleForgotPassword}>¿Olvidaste tu contraseña?</a>
      </p>
    </div>
  );
}

export default LoginForm;