const socket = io();

const items = $('.items');
const input = $('#add-new-input');
const button = $('#add-new-button');
const itemTemplate = $($('#item-template').html());

const sendAddItemRequest = function sendAddItemRequest() {
    const name = input.val().trim();
    if (name) socket.emit('add', name);
    input.val('');
    input.focus();
};

const sendRemoveItemRequest = function sendAddItemRequest(id) {
    socket.emit('remove', id);
};

const sendRandomizeRequest = function sendRandomizeItemsRequest() {
    socket.emit('randomize');
};

const addNewItem = function addNewItem(text, id) {
    let item = itemTemplate.clone();
    item.attr('id', id);
    item.find('.item-text').text(text);
    item.find('.item-button').click(() => {
        sendRemoveItemRequest(id);
    });
    items.append(item);
    items.children().removeClass('result result-other');
};

const removeItem = function removeItem(id) {
    const itemToRemove = $(`#${id}`);
    itemToRemove.remove();
    items.children().removeClass('result result-other');
};

const randomize = function randomize(id) {
    items.children().removeClass('result').addClass('result-other');
    let randomItem = $(`#${id}`);
    setTimeout(() => {
        randomItem.removeClass('result-other').addClass('result');
    }, 150);
};

button.click(() => sendAddItemRequest());

input.keypress((e) => {
    if (e.which == 13) sendAddItemRequest();
});

let randomizeButton = $('.randomize');
randomizeButton.click(() => {
    sendRandomizeRequest();
});

socket.on('update', (_items) => {
    items.empty();
    _items.forEach((item) => {
        addNewItem(item.text, item.id);
    });
});

socket.on('randomize', (id) => randomize(id));
