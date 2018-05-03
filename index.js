const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    return res.sendFile('index.html');
});

let items = [];

io.on('connection', (socket) => {
    console.log('Socket connected');

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    socket.on('add', (text) => {
        const item = {
            id: uniqid(),
            text,
        };
        items.push(item);
        io.emit('update', items);
    });

    socket.on('remove', (id) => {
        items = items.filter((item) => item.id != id);
        io.emit('update', items);
    });

    socket.on('randomize', () => {
        const randomIndex = Math.round(Math.random() * (items.length - 1));
        let id = items[randomIndex].id;
        io.emit('randomize', id);
    });
});

server.listen(port, () => console.log('listening on port ' + port));
