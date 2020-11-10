"use stcrict";

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
    'Карта с подписями': mapWithCaptions,
    "Карта без подписей": mapWithoutSignatures,
};
// Моя коллекция для тестового режима
const testCollection = L.control.layers(baseMap);
let mymap = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13,
});
if (localStorage.getItem("center") != null) {
    const newCoordinate = localStorage.getItem('center').split(' ');
    mymap.setView(newCoordinate, localStorage.getItem('zoom'));
}
// Меню со слоями на карте

const myMarker = L.marker([0, 0]);

let availableTags = [];

// Инициализирупем массиы со значениями
if (localStorage.getItem('arrayCountryUser') == null) {
    availableTags = [
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
    localStorage.setItem('arrayCountryUser', JSON.stringify(availableTags));
} else {
    availableTags = JSON.parse(localStorage.getItem('arrayCountryUser'));
}

// Работа с автозаполнением
$("#tags").autocomplete({
    source: availableTags,
    select: function(event, ui) {
        $.ajax({
            url: `https://geocode-maps.yandex.ru/1.x?geocode=${ui.item.label}&apikey=c7b62e03-9fea-4ba7-b339-4e5b9719688e&format=json&lang=ru_RU`,
            success: function(data) {
                function saveZoomAndName(zoom, center, name) {
                    const coordinateSting = `${center.lat} ${center.lng}`;
                    localStorage.setItem('zoom', zoom);
                    localStorage.setItem('center', coordinateSting);
                    localStorage.setItem('name', name)
                }

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
                    .bindPopup(`<h2>Этот объект ${ui.item.label}</h2>`)
                    .openPopup()
                    .addTo(mymap);
                mymap.on('moveend', (ev) => {
                    saveZoomAndName(mymap.getZoom(), mymap.getCenter(), ui.item.label);
                })
                mymap.on('mouseup', (ev) => {
                    localStorage.setItem('center', localStorage.getItem('center'));
                })
            },
        });
    },
    minLength: 1,
});

let count = 0;

function countingRabbits(ev) {
    mymap.fitWorld();
}

// Переключение режимов
const $controlMode = $(".control_mode_form_button");
$controlMode.click((ev) => {
    ev.preventDefault();

    // Функция сброса режимов 
    function resetMode() {
        test[0].checked = false;
        game[0].checked = false;
    }

    const test = document.querySelectorAll("input[name='testMode'");
    const game = document.querySelectorAll("input[name='gameMode'");

    if (test[0].checked && game[0].checked) {
        alert("Нельзя выбрать 2 режима!!!");
        $(".start-info").show();
        $(".game-mode").hide();
        $(".test-mode").hide();
        resetMode();
    } else if (test[0].checked) {
        $(".test-mode").show();
        $(".game-mode").hide();
        $(".start-info").hide();
        testCollection.addTo(mymap);
        mymap.addLayer(mapWithCaptions);
        resetMode();
    } else if (game[0].checked) {
        $(".game-mode").show();
        $(".test-mode").hide();
        $(".start-info").hide();
        resetMode();
    } else if (test[0].checked === false && game[0].checked === false) {
        alert("Вы ничего не выбрали!");
        if (mymap) {
            mymap.remove();
        }
        $(".start-info").show();
        $(".test-mode").hide();
        $(".game-mode").hide();
    }
})

// Кнопка отвечающая за добавление нового горда 
const $addNewCountry_button = $(".additionalUserOptions_container_info_button-add");
// Поле где вводится город, который нужно добавить в список
const $addNewCountry_input = $(".additionalUserOptions_container_info_input-add")[0];
// Кнопка отвечающая за удаление города из списка
const $deleteCountry_button = $(".additionalUserOptions_container_info_button-delete");
// Поле где вводится город, который нужно удалть
const $deleteCountry_input = $(".additionalUserOptions_container_info_input-delete")[0];
// Союытие при добавление нового города в список
$addNewCountry_button.click((ev) => {
    if ($addNewCountry_input.value == '') {
        alert("Вы ничего не ввели");
        return;
    }
    $.ajax(`https://geocode-maps.yandex.ru/1.x?geocode=${$addNewCountry_input.value}&apikey=c7b62e03-9fea-4ba7-b339-4e5b9719688e&format=json&lang=ru_RU`, {
            // Обрабатываем успешное получение ответа
            success(data) {
                if (data.response.GeoObjectCollection.featureMember.length == 0) {
                    alert("Извините! Мы не смогли добавить данный город к вам в список !");
                } else {
                    console.log(data);
                    let arrayCountryUser = JSON.parse(localStorage.getItem('arrayCountryUser'));
                    const nameCountry = data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
                    const coordinateArray = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').reverse();
                    let testvalueCountry = true;
                    console.log(arrayCountryUser);
                    arrayCountryUser.forEach((element) => {
                        if (element.label === nameCountry || nameCountry.split(' ')[0] === 'река') {
                            testvalueCountry = false;
                            alert("Ты что дурак?");
                        }
                    })
                    if (testvalueCountry) {
                        const coordinateObject = {
                                let: coordinateArray[0],
                                lng: coordinateArray[1]
                            }
                            // Добавляем новый элемент в массив
                        arrayCountryUser.push({
                            label: nameCountry,
                            value: nameCountry,
                            coord: coordinateObject
                        });
                        localStorage.setItem('arrayCountryUser', JSON.stringify(arrayCountryUser));
                        $("#tags").autocomplete({
                            source: arrayCountryUser
                        })

                    }
                }
            },
        })
        // Очищаем поле
    $addNewCountry_input.value = '';
})

$(".additionalUserOptions_container_info_input-delete").autocomplete({
    source: JSON.parse(localStorage.getItem('arrayCountryUser')),
})

$deleteCountry_button.click((ev) => {
    if ($deleteCountry_input.value == '') {
        alert("Вы ничего не ввели");
        return;
    }
    let arrauCountyNow = JSON.parse(localStorage.getItem('arrayCountryUser'));
    let newArray = [];
    for (element of arrauCountyNow) {
        if (element.label != $deleteCountry_input.value) {
            newArray.push(element);
        }
    }
    $(".additionalUserOptions_container_info_input-delete").autocomplete({
        source: newArray
    });
    $("#tags").autocomplete({
        source: newArray
    });
    localStorage.setItem('arrayCountryUser', JSON.stringify(newArray));
})