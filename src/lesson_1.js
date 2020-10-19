"use stcrict";

// Инициализация карты
function init() {
    const myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 11,
    }, {
        searchControlProvider: 'yandex#search',
    });
}
ymaps.ready(init);
// Работа с автозаполнением
$(() => {
    const availableTags = [
        { label: "Сочи", value: this.label },
        { label: "Москва", value: this.label },
        { label: "Дмитров", value: this.label },
        { label: "Екатеренбруг", value: this.label },
        { label: "Рязань", value: this.label },
        { label: "Орёл", value: this.label },
        { label: "Иваново", value: this.label },
        { label: "Коломна", value: this.label },
        { label: "Анапа", value: this.label },
        { label: "Тамбов", value: this.label },
        { label: "Самара", value: this.label },
        { label: "Саратов", value: this.label },
        { label: "Липецк", value: this.label },
        { label: "Пенза", value: this.label },
        { label: "Краснодар", value: this.label },
    ];
    $("#tags").autocomplete({
        source: availableTags,
        select: function(event, ui) {
            alert(`Вы выбрали город: ${ui.item.label}`);
        },
        minLength: 1,
    });
});

let count = 0;
let countR = 0;
let countChicken = 0;

$(".menu_button-1").click(countingRabbits);
$(".menu_button-2").click(countingChicken);
$(".menu_button-3").click(function(ev) {
    count += 1;
    alert(`Вы щелкнули на кнопку ${count} раз(а)`);
})

function countingRabbits(ev) {
    countR += 1;
    alert(`${countR} кролик`);
}

function countingChicken(ev) {
    countChicken += 1;
    alert(`${countChicken} курица`);
}