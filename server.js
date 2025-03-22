const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

// Cargar variables de entorno
require('dotenv').config();

// Inicializar Express
const app = express();
const port = process.env.PORT || 5000;

// Configuración de Firebase usando variables de entorno
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
    }),
  });
} else {
  admin.app();
}

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const profileRouter = require('./routes/profile');

app.get('/', (req, res) => {
  res.send('¡Backend desplegado!');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', profileRouter);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});