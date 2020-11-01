"use stcrict";

// Инициализация карты
// function init() {
//     const myMap = new ymaps.Map("map", {
//         center: [55.76, 37.64],
//         zoom: 11,
//     }, {
//         searchControlProvider: 'yandex#search',
//     });
// }
// ymaps.ready(init);

//Лефлет подключение

const mymap = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 19
}).addTo(mymap);

// Создание события щелчка по карте
const popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("Координаты куда вы кликнули " + e.latlng.toString())
        .openOn(mymap);
}

const myMarker = L.marker([0, 0]);

mymap.on('click', onMapClick);
// Работа с автозаполнением
$(() => {
    const availableTags = [
        { label: "Сочи", value: this.label, coord: { lat: 43.582579, lng: 39.722246 } },
        { label: "Москва", value: this.label, coord: { lat: 55.752004, lng: 37.622774 } },
        { label: "Дмитров", value: this.label, coord: { lat: 56.344516, lng: 37.519808 } },
        { label: "Екатеренбруг", value: this.label, coord: { lat: 56.833949, lng: 60.619748 } },
        { label: "Рязань", value: this.label, coord: { lat: 54.622978, lng: 39.737421 } },
        { label: "Орёл", value: this.label, coord: { lat: 52.955588, lng: 36.066987 } },
        { label: "Иваново", value: this.label, coord: { lat: 56.998418, lng: 40.97201 } },
        { label: "Коломна", value: this.label, coord: { lat: 55.087171, lng: 38.770441 } },
        { label: "Анапа", value: this.label, coord: { lat: 44.893434, lng: 37.314993 } },
        { label: "Тамбов", value: this.label, coord: { lat: 52.703352, lng: 41.451951 } },
        { label: "Самара", value: this.label, coord: { lat: 53.193529, lng: 50.156867 } },
        { label: "Саратов", value: this.label, coord: { lat: 51.525834, lng: 45.982168 } },
        { label: "Липецк", value: this.label, coord: { lat: 51.646317, lng: 39.201803 } },
        { label: "Пенза", value: this.label, coord: { lat: 53.209158, lng: 45.004057 } },
        { label: "Краснодар", value: this.label, coord: { lat: 45.032386, lng: 38.979773 } },
    ];
    $("#tags").autocomplete({
        source: availableTags,
        select: function(event, ui) {
            mymap.flyTo([ui.item.coord.lat, ui.item.coord.lng], 12);

            myMarker
                .setLatLng([ui.item.coord.lat, ui.item.coord.lng])
                .bindPopup(`<h2>Этот город ${ui.item.label}</h2>`)
                .openPopup()
                .addTo(mymap);
            console.log(myMarker.getContent());
        },
        minLength: 1,
    });
});

let count = 0;

$(".menu_button-1").click(countingRabbits);
$(".menu_button-2").click(countingChicken);
$(".menu_button-3").click(function(ev) {
    count += 1;
    alert(`Вы щелкнули на кнопку ${count} раз(а)`);
})

function countingRabbits(ev) {
    mymap.fitWorld();
}

function countingChicken(ev) {
    mymap.flyTo([55.756136, 37.63593], 18);
}