const express = require('express');
const app = express();
const fs = require('fs');
const jsdom = require('jsdom');
var path = require('path')

const { JSDOM } = jsdom;
const uri = 'random_en_sugus.html';
var document;

// con el paquete jsdom podemos manipular la DOM igual que si el
// archivo html estuviera en el navegador
JSDOM.fromFile(uri).then( dom => {
    const window = dom.window;
    document = window.document;
}).catch( err => {
    console.error(err);
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'random_en_sugus.html'));
})

app.get('/who', (req, res) => {
    let macs = req.headers.macs;
    let people = [];
    // cada dirección MAC en la cadena iría separada por comas
    macs = macs.split(',');

    fs.readFile('random_en_sugus.html', (err, data) => {
        if (err) throw err;
        macs.forEach( mac => {
            if ( data.indexOf(mac) >= 0 ) {
                
                let cells = document.querySelectorAll('td');
                cells = Array.from(cells);

                cells.forEach( (cell, index) => {
                    if ( cell.innerHTML === mac ) {
                        people.push(cells[index - 1].innerHTML);
                    }
                });
            } else {
                res.send('Parece que no hay nadie');
            }
        })
        res.send(people);
    });
})

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})