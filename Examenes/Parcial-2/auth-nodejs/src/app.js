require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Error conectando a MySQL:', err));