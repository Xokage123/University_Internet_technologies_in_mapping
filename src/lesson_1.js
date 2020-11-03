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

//Мой ключ
const myToken = 'pk.eyJ1IjoibWFrc2dvZGtpbmciLCJhIjoiY2thZ3I3MHJvMDljczJ5bjdra3ZpcnNxeiJ9.RZEz8XBxMBS1zTPemFnfRQ';
//Моя карта с mapbox без подписей
const myCardOne = 'maksgodking/ckh0p06z605ao19qqfxvw5yna';
//Моя карта mapbox с подписями
const myCardTwo = `maksgodking/ckh0z5o3i085p19qrogcxkjtb`;
//Инициализация карты без подписей
let mapWithoutSignatures = L.tileLayer(`https://api.mapbox.com/styles/v1/${myCardOne}/tiles/{z}/{x}/{y}?fresh=true&title=copy&access_token=${myToken}`, {
    id: myCardOne,
    accessToken: myToken,
});
//Подгружаем карту их mapbox с подписями
const mapWithCaptions = L.tileLayer(`https://api.mapbox.com/styles/v1/${myCardTwo}/tiles/{z}/{x}/{y}?fresh=true&title=copy&access_token=${myToken}`, {
    id: myCardTwo,
    accessToken: myToken,
});

const baseMap = {
    "Карта без подписей": mapWithoutSignatures,
    'Карта с подписями': mapWithCaptions,
}

const mymap = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13,
    layers: [mapWithoutSignatures]
});

const polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

L.control.layers(baseMap).addTo(mymap);

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
            $.ajax({
                url: `https://geocode-maps.yandex.ru/1.x?geocode=${ui.item.label}&apikey=c7b62e03-9fea-4ba7-b339-4e5b9719688e&format=json&lang=ru_RU`,
                success: function(data) {
                    console.log(data);
                    const arrayCoordinate = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').reverse();
                    const boudCoordinate = {
                        upperLimit: data.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope.upperCorner.split(' ').reverse(),
                        lowerLimit: data.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope.lowerCorner.split(' ').reverse()
                    };
                    const boundRegion = [
                        boudCoordinate.upperLimit,
                        boudCoordinate.lowerLimit
                    ]
                    mymap.flyToBounds(boundRegion);
                    myMarker
                        .setLatLng(arrayCoordinate)
                        .bindPopup(`<h2>Этот город ${ui.item.label}</h2>`)
                        .openPopup()
                        .addTo(mymap);
                },
            });
        },
        minLength: 1,
    });
});

let count = 0;

$(".menu_button-1").click(countingRabbits);
$(".menu_button-3").click(function(ev) {
    count += 1;
    alert(`Вы щелкнули на кнопку ${count} раз(а)`);
})

function countingRabbits(ev) {
    mymap.fitWorld();
}

$('.search-object_button').click(function(ev) {
    ev.preventDefault();
    const nameCity = document.querySelector('.search-object').value;
    if (!(parseInt(nameCity))) {
        $.ajax({
            url: `https://geocode-maps.yandex.ru/1.x?geocode=${nameCity}&apikey=c7b62e03-9fea-4ba7-b339-4e5b9719688e&format=json&lang=ru_RU`,
            success: function(data) {
                console.log(data);
                const arrayCoordinate = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').reverse();
                const boudCoordinate = {
                    upperLimit: data.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope.upperCorner.split(' ').reverse(),
                    lowerLimit: data.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope.lowerCorner.split(' ').reverse()
                };
                const boundRegion = [
                    boudCoordinate.upperLimit,
                    boudCoordinate.lowerLimit
                ]
                mymap.flyToBounds(boundRegion);
                myMarker
                    .setLatLng(arrayCoordinate)
                    .bindPopup(`<h2>Этот город ${nameCity}</h2>`)
                    .openPopup()
                    .addTo(mymap);
                document.querySelector('.search-object').value = "";
            },
        });
    } else if (parseInt(nameCity)) {
        alert(`Вы ввели число, а не город!! Попробуйте еще раз!`);
        document.querySelector('.search-object').value = ""
    }
})