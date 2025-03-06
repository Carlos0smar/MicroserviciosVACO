const express = require('express');
const app = express();
const path=require('path');
const port = 3002;

/// Configuramos EJS como motor de plantillas
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

// Rutas 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});
app.post('/', (req, res) => {
    const { num, inicio, fin, operacion} = req.body;
    
    const iniciof = parseFloat(inicio);
    const numf = parseFloat(num);
    const finf = parseFloat(fin);

    const tabla = [];
    for (let i = iniciof; i <= finf; i++) {
        let resultado;
        switch (operacion) {
        case 'suma':
            opeSimbol = '+';
            resultado = numf + i;
            break;
        case 'resta':
            opeSimbol = '-';
            resultado = numf - i;
            break;
        case 'multiplicacion':
            opeSimbol = '*';
            resultado = numf * i;
            break;
        case 'division':
            opeSimbol = '/';
            resultado = numf / i;
            break;
        default:
            return res.status(400).send('Operación no válida.');
        }

        tabla.push({ valor: i, num, opeSimbol, resultado });
    }

    res.render('index', { numf, iniciof, finf, operacion, tabla });
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
  

