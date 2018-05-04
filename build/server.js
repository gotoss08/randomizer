'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var uniqid = require('uniqid');

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    return res.sendFile('index.html');
});

var resetRandomizedItems = function resetRandomizedItems() {
    items.forEach(function (item) {
        return item.randomized = false;
    });
};

var items = [];

io.on('connection', function (socket) {
    console.log('Socket connected');

    socket.emit('update', items);

    socket.on('disconnect', function () {
        console.log('Socket disconnected');
    });

    socket.on('add', function (text) {
        resetRandomizedItems();
        var item = {
            id: uniqid(),
            text: text,
            randomized: false
        };
        items.push(item);
        io.emit('update', items);
    });

    socket.on('remove', function (id) {
        resetRandomizedItems();
        items = items.filter(function (item) {
            return item.id != id;
        });
        io.emit('update', items);
    });

    socket.on('randomize', function () {
        resetRandomizedItems();
        var randomIndex = Math.round(Math.random() * (items.length - 1));
        if (!items[randomIndex]) return;
        items[randomIndex].randomized = true;
        io.emit('update', items);
    });
});

server.listen(port, function () {
    return console.log('listening on port ' + port);
});