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
// Собираем подгруженные карты в объект
const baseMap = {
    "Карта без подписей": mapWithoutSignatures,
    'Карта с подписями': mapWithCaptions,
};
// Стартовая загрузка карту
const mymap = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13,
    layers: [mapWithoutSignatures]
});
// Показывает последнюю территорию куда вы перемещались
if (localStorage.key('zoom') && localStorage.key('center') && localStorage.key('name')) {
    const newCoordinate = localStorage.getItem('center').split(' ');
    mymap.setView(newCoordinate, localStorage.getItem('zoom'));
    if (localStorage.getItem('name')) {
        alert(`Последняя территори куда вы перемещались была: ${localStorage.getItem('name')}`)
    }
}
let GBoundMoscow = '';
// Проверка подгружения карты geoJson с границами Москва
$.ajax({
    url: 'https://raw.githubusercontent.com/trolleway/geodata/master/osm/%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0.geojson',
    success: function(data) {
        GBoundMoscow = JSON.parse(data);
        console.log(JSON.parse(data));
        let testObj = {
            "type": "Feature",
            "properties": {
                "name": "Москва",
            },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": GBoundMoscow.features[0].geometry.coordinates,
            }
        };
        console.log(testObj);
        L.geoJSON(testObj, {
            style: function(feature) {
                console.log(feature);
            },
        }).addTo(mymap);
    }
});
// Меню со слоями на карте
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
                    mymap.on('moveend', (ev) => {
                        saveZoomAndCenter(mymap.getZoom(), mymap.getCenter(), ui.item.label);
                    })
                    mymap.on('mouseup', (ev) => {
                        localStorage.setItem('center', localStorage.getItem('center'));
                    })
                },
            });
        },
        minLength: 1,
    });
});

function saveZoomAndCenter(zoom, center, name) {
    const coordinateSting = `${center.lat} ${center.lng}`;
    localStorage.setItem('zoom', zoom);
    localStorage.setItem('center', coordinateSting);
    localStorage.setItem('name', name)
}

let count = 0;

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