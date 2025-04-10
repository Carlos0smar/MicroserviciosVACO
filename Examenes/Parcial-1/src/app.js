require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const libroRoutes = require('./routes/libroRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/libro', libroRoutes);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Error conectando a MongoDB:', err));