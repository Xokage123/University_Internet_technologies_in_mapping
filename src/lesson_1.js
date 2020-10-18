"use stcrict";

function init() {
    const myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 7,
    }, {
        // searchControlProvider: 'yandex#search',
    });
}
ymaps.ready(init);