import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('El servidor está funcionando!');
});

// Ruta para el registro de nuevos usuarios
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ message: 'Registro exitoso.', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
  }
});

// Ruta para el inicio de sesión de usuarios
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso.', user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
  }
});

// Ruta para manejar la solicitud de "Olvidaste tu contraseña"
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Falta el campo de email.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Devolver un mensaje genérico para no dar pistas a atacantes
      return res.status(200).json({ message: 'Si el email está registrado, recibirás un correo electrónico con instrucciones para restablecer tu contraseña.' });
    }

    // Aquí, en una aplicación real, se generaría un token único y se enviaría un email.
    console.log(`Simulando envío de email para restablecer la contraseña a: ${email}`);
    
    res.status(200).json({ message: 'Si el email está registrado, recibirás un correo electrónico con instrucciones para restablecer tu contraseña.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});