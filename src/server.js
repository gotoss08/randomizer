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

const resetRandomizedItems = function resetRandomizedItems() {
    items.forEach((item) => item.randomized = false);
};

let items = [];

io.on('connection', (socket) => {
    console.log('Socket connected');

    socket.emit('update', items);

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    socket.on('add', (text) => {
        resetRandomizedItems();
        const item = {
            id: uniqid(),
            text,
            randomized: false,
        };
        items.push(item);
        io.emit('update', items);
    });

    socket.on('remove', (id) => {
        resetRandomizedItems();
        items = items.filter((item) => item.id != id);
        io.emit('update', items);
    });

    socket.on('randomize', () => {
        resetRandomizedItems();
        const randomIndex = Math.round(Math.random() * (items.length - 1));
        if (!items[randomIndex]) return;
        items[randomIndex].randomized = true;
        io.emit('update', items);
    });
});

server.listen(port, () => console.log('listening on port ' + port));
