'use strict';

var socket = io();

var items = $('.items');
var input = $('#add-new-input');
var button = $('#add-new-button');
var itemTemplate = $($('#item-template').html());

var sendAddItemRequest = function sendAddItemRequest() {
    var name = input.val().trim();
    if (name) socket.emit('add', name);
    input.val('');
    input.focus();
};

var sendRemoveItemRequest = function sendAddItemRequest(id) {
    socket.emit('remove', id);
};

var sendRandomizeRequest = function sendRandomizeItemsRequest() {
    socket.emit('randomize');
};

var addNewItem = function addNewItem(id, text) {
    var item = itemTemplate.clone();
    item.attr('id', id);
    item.find('.item-text').text(text);
    item.find('.item-button').click(function () {
        sendRemoveItemRequest(id);
    });
    items.append(item);
    items.children().removeClass('result result-other');
};

var removeItem = function removeItem(id) {
    var itemToRemove = $('#' + id);
    itemToRemove.remove();
    items.children().removeClass('result result-other');
};

var updateRandomizedItem = function updateRandomizedItem(id) {
    items.children().removeClass('result').addClass('result-other');
    var randomItem = $('#' + id);
    setTimeout(function () {
        randomItem.removeClass('result-other').addClass('result');
    }, 150);
};

button.click(function () {
    return sendAddItemRequest();
});

input.keypress(function (e) {
    if (e.which == 13) sendAddItemRequest();
});

var randomizeButton = $('.randomize');
randomizeButton.click(function () {
    sendRandomizeRequest();
});

socket.on('update', function (_items) {
    items.empty();
    _items.forEach(function (item) {
        return addNewItem(item.id, item.text);
    });

    var randomizedItem = _items.find(function (item) {
        return item.randomized;
    });
    if (!randomizedItem) return;
    updateRandomizedItem(randomizedItem.id);
});