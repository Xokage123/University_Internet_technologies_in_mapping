"use stcrict";

// Результаты последней игры
const lastListHTML = document.querySelector(".last-game");
const lastList = document.createElement("div");
lastListHTML.innerHTML = localStorage.getItem("lastList");
// Cписок всех лбъектов
const listObject = document.querySelector(".headet_list-object_spoiler");


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
let testCollection = null;
// Функция отвечающая за добавление контролера и активных слоев на карту
function creatingAndAddingCollection(map, activeLayer, collection = false) {
    if (collection) {
        testCollection = L.control.layers(collection);
        testCollection.addTo(map);
    }
    map.addLayer(activeLayer);
}
// Функция отвечающая за удаление контролера и активных слоев с карты
function deleteCollection(map) {
    if (!(testCollection == null)) {
        map.removeControl(testCollection);
    }
}
// Функция удаляющая слои все слои с карты
function deleteLayer(map) {
    map.eachLayer(function(layer) {
        map.removeLayer(layer);
    })
}
// Функция сброса режимов 
function resetMode() {
    test[0].checked = false;
    game[0].checked = false;
    start[0].checked = false;
}
// Функция отвечающая за передключение режимов
function controlMode(elem) {
    $(".test-mode").hide();
    $(".game-mode").hide();
    $(".start-info").hide();
    $(elem).show();
    resetMode();
}
// Инициализация карты
let mymap = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13,
});
// Есле в хранилище есть координаты то перемещаемся на последнее место
if (localStorage.getItem("center") != null) {
    const newCoordinate = localStorage.getItem('center').split(' ');
    mymap.setView(newCoordinate, localStorage.getItem('zoom'));
}

const myMarker = L.marker([0, 0]);
let availableTags = [];

// Инициализирупем массиы со значениями
if (localStorage.getItem('arrayCountryUser') == null) {
    availableTags = [
        { label: "Сочи", value: this.label, coord: { let: 43.582579, lng: 39.722246 } },
        { label: "Москва", value: this.label, coord: { let: 55.752004, lng: 37.622774 } },
        { label: "Екатеренбруг", value: this.label, coord: { let: 56.833949, lng: 60.619748 } },
        { label: "Рязань", value: this.label, coord: { let: 54.622978, lng: 39.737421 } },
        { label: "Саратов", value: this.label, coord: { let: 51.525834, lng: 45.982168 } },
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
                $(".ui-autocomplete-input")[0].value = '';
            },
        });
    },
    minLength: 1,
});

// Переключение режимов
const $controlMode = $(".control_mode_form_button");
const test = document.querySelectorAll("input[value='test']");
const game = document.querySelectorAll("input[value='game']");
const start = document.querySelectorAll("input[value='start']");

$controlMode.click((ev) => {
    ev.preventDefault();

    if (test[0].checked) {
        if ($(".test-mode").css("display") === "none") {
            creatingAndAddingCollection(mymap, baseMap['Карта с подписями'], baseMap);
        }
        controlMode(".test-mode");
    } else if (game[0].checked) {
        controlMode(".game-mode");
        deleteCollection(mymap);
        $(".control_mode").hide();
        deleteLayer(mymap);
        creatingAndAddingCollection(mymap, baseMap["Карта без подписей"]);
        startUserGame();
    } else if (start[0].checked) {
        controlMode(".start-info");
        deleteCollection(mymap);
        deleteLayer(mymap);
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
                let arrayCountryUser = JSON.parse(localStorage.getItem('arrayCountryUser'));
                const nameCountry = data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
                const coordinateArray = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').reverse();
                // Проверка на принадлежность объекта в нп и неповторяемость
                let testvalueCountry = true;
                arrayCountryUser.forEach((element) => {
                    if (element.label === nameCountry || nameCountry.split(' ')[0] === 'река') {
                        testvalueCountry = false;
                        if (element.label === nameCountry) {
                            alert("Такой город уже есть у вас в списке!");
                        } else if (nameCountry.split(' ')[0] === 'река') {
                            alert("Первое что нашлось по этому запросу была река =)");
                        }
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
                    });
                    $(".additionalUserOptions_container_info_input-delete").autocomplete({
                        source: arrayCountryUser
                    });
                    alert(`${nameCountry} успешно добавлен(а) в список`);
                }
            }
        },
    });
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
    let counter = 0;
    for (element of arrauCountyNow) {
        // Проверяем есть ли такой объект в списке
        if (element.label == $deleteCountry_input.value) {
            // Собираем новый массив без удаляемого элемента
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
            alert(`Город: ${$deleteCountry_input.value} успешно удален!`);
            // Очищаем поле
            $deleteCountry_input.value = ' ';
            return;
        }
        counter++;
        if (counter === arrauCountyNow.length) {
            alert("Такого объекта в списке нет!");
            // Очищаем поле
            $deleteCountry_input.value = ' ';
            return;
        }
    }
});

// Работа с игровым режимом
// Сохраняем кнопки и инпуты в объекты
function startUserGame() {
    let $maxCountry = $(".game-mode_step-1_form_input-numberOfCities");
    let $infoMaxCountry = $(".game-mode_step-1_form_text-numberOfCities");
    let $SRandomCountry = $(".game-mode_step-2_randomCountry");
    const $startGame = $(".game-mode_step-1_form_start-button");
    const $endGame = $(".game-mode_end-button");
    const $step_1 = $(".game-mode_step-1");
    const $step_2 = $(".game-mode_step-2");
    const listCountry = document.querySelector(".game-mode_list");
    let arrayUserCountry = JSON.parse(localStorage.getItem('arrayCountryUser'));
    $infoMaxCountry.text(
        `Сколько объектов вы хотите искать? (Максимум ${arrayUserCountry.length >= 20 ? 20 : arrayUserCountry.length})`
    );
    $maxCountry.attr("max", arrayUserCountry.length >= 20 ? 20 : arrayUserCountry.length);

    new window.JustValidate('.game-mode_step-1_form', {
            rules: {
                number: {
                    function: (name, value) => {
                        if (value > (arrayUserCountry.length >= 20 ? 20 : arrayUserCountry.length)) {
                            return false;
                        }
                        return true;
                    }
                },
            },
            messages: {
                number: {
                    function: 'Вы ввели неположенное значение!!',
                }
            }
        })
        // Начинаем игру
    $startGame.on("click", (ev) => {
        if ($maxCountry[0].value == '' || (Number($maxCountry[0].value) > (arrayUserCountry.length >= 20 ? 20 : arrayUserCountry.length))) {
            return;
        }
        // Возвращает новый массивы без excess
        function createNewArrayNotExcess(array, excess) {
            let newArray = [];
            array.forEach((element) => {
                if (element.label != excess) {
                    newArray.push(element);
                }
            })
            return newArray;
        };

        function updateCountry(control) {
            if (control != false) {
                arrayUserCountry = createNewArrayNotExcess(arrayUserCountry, randomCountry.label);
            }
            randomCountry = arrayUserCountry[Math.floor(Math.random() * arrayUserCountry.length)];
            $SRandomCountry.text(randomCountry.label);
        }

        function addCountryList(name, value) {
            const listItem = document.createElement('li');
            const nameCountry = document.createElement('span');
            const valueAnswer = document.createElement('span');
            listItem.classList.add("game-mode_list-item");
            nameCountry.innerHTML = `${name}  `;
            valueAnswer.innerHTML = value ? 'Правильно' : 'Неправильно';
            valueAnswer.classList.add(value ? 'green' : 'red');
            listItem.append(nameCountry);
            listItem.append(valueAnswer);
            listCountry.append(listItem);
        }

        //Функция проверки правильности нахождения объекта
        function searchObject(ev) {
            // Координаты маркера, на который кликнул пользователь
            const coordinateMarker = this._latlng;
            if (coordinateMarker.lat == randomCountry.coord.let && coordinateMarker.lng == randomCountry.coord.lng) {
                alert("Правильно!");
                addCountryList(randomCountry.label, true);
                count--;
                if (count != 0) {
                    updateCountry();
                }
                this.remove();
            } else {
                alert("Вы не угадали!");
                addCountryList(randomCountry.label, false);
                count--;
                updateCountry(false);
            }
            setTimeout(() => {
                if (count === 0 || count === JSON.parse(localStorage.getItem("arrayCountryUser").length)) {
                    alert("Попытки закончились");
                    lastList.innerHTML = document.querySelector(".game-mode_list").innerHTML;
                    localStorage.setItem("lastList", lastList.innerHTML);
                    lastListHTML.innerHTML = localStorage.getItem("lastList");
                    endGame();
                }
            }, 1000)
        }
        // Создаем пустой массив для хранения всех марок объектов
        let arrayMark = [];
        // Генерируем случайный город (как объект)
        let randomCountry = arrayUserCountry[Math.round(Math.random() * arrayUserCountry.length)];
        // Количество сколько раз нужно дать пользователю угадать
        let count = $maxCountry[0].value;
        // Выводим все марки на карту
        arrayUserCountry.forEach((element) => {
            let markerElement = null;
            markerElement = L.marker([element.coord.let, element.coord.lng]).addTo(mymap);
            arrayMark.push(markerElement);
        })

        arrayMark.forEach((el) => {
            el.on("click", searchObject);
        });
        //Добавляем его в секцию для поиска
        $SRandomCountry.text(randomCountry.label);
        $step_1.hide();
        $step_2.show();
        mymap.fitWorld();
        $maxCountry[0].value = '';
    })

    function endGame(ev) {
        controlMode(".start-info");
        deleteLayer(mymap);
        $(".control_mode").show();
        $step_1.show();
        $step_2.hide();
        $maxCountry[0].value = '';
        listCountry.innerHTML = ' ';
        arrayUserCountry = JSON.parse(localStorage.getItem('arrayCountryUser'));
    }

    $endGame.on("click", endGame)
}