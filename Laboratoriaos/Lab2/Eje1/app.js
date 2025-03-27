const express = require('express');
const app = express();
const path = require('path');
const port = 8080

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/', (req, res) => {
    const { a, b, operacion } = req.body;
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    let resultado;

    switch (operacion) {
        case 'sumar':
            resultado = numA + numB;
            break;
        case 'restar':
            resultado = numA - numB;
            break;
        case 'multiplicar':
            resultado = numA * numB;
            break;
        case 'dividir':
            resultado = numA / numB;
            break;
        default:
            resultado = 'Operación no válida';
    }

    res.send(`El resultado es: ${resultado}`);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});