//Carga de API
let urlApi = "https://mindhub-xj03.onrender.com/api/amazing";

//Re-escritura de código guiado por compañeros debido a múltiples errores con mi metodología
//de separar la búsqueda de fechas en desde past y upcoming events

//Creación de plantillas y cartas en formato de texto
function createCards(dataArray) {
    let cardString = ``;
        for (let event of dataArray) {
            cardString += `<div class="card">
    <img src="${event.image}">
    <h3>${event.name}</h3>
    <p class="desc">${event.description}</p>
    <div class="card-foot">
        <p>Price: $${event.price}.-</p>
        <a href="./details.html?id=${event._id}">Details</a>
    </div>
</div>`
    }
return cardString;
}

//Creación del array de categorías a cargar
function filterArrayCat(dataArray){
    let aECategoriesArray = [];
    dataArray.forEach(event => {
        if (!aECategoriesArray.includes(event.category)) {
        aECategoriesArray.push(event.category)
        }
    })
    return aECategoriesArray.sort();
}

//Creación de checkboxes que pasa por el array de categorías filtradas
function createCategoriesCheckBox(categoriesArray){
    let categoriesString = "";
    for (const category of categoriesArray){
        categoriesString += `
    <div>
        <input type="checkbox" name="category" id="${category.toLowerCase()}" value="${category.toLowerCase()}">
        <label for="${category.toLowerCase()}">${category}</label>
    </div> `
    }
    return categoriesString;
}

//Creación de cards por elementos encontrados:
function createFoundedCards(foundedDataArray){
    let cardString = ``;
    if (foundedDataArray.length > 0) {
        for (let event of foundedDataArray) {
            cardString += `<div class="card">
    <img src="${event.image}">
    <h3>${event.name}</h3>
    <p>Description: ${event.description} </p>
    <div class="card-foot">
        <p>Price: ${event.price}</p>
        <a href="./details.html?id=${event._id}">Details</a>
    </div>
</div>`
    }
}
else {
    cardString += `
    <img class="notFound" src="https://cdn.discordapp.com/attachments/1066019385652822147/1083253573632147516/AmazingNotFound.png" alt="Not found" width="300px" height="300px">
    <p>ERROR 404. Search not founded, try again with other filters!</p>`
}
    return cardString;
}

//Captura de elementos HTML
//Donde poner las cards:
const box = document.getElementById("box");
//Donde poner las cat:
const form = document.querySelector(".category");

//Fetch a la API
fetch(urlApi)
    .then(response => response.json())
    .then(data => {
//Filtra cards por fecha:
let futureEvents = data.events.filter((event) => event.date >= data.currentDate);
//Crea las cards y las mete en el elemento HTML:
box.innerHTML = createCards(futureEvents);
//Crea las categorías y las mete en el elemento HTML:
form.innerHTML = createCategoriesCheckBox(filterArrayCat(data.events));

//Búsqueda
const searchBar = document.getElementById("search-bar")
let searchBarEvents = [];
let checkedCats = [];
let searchCheckedEvents = [];
let bufferEvents = [];

//Verificación de entrada
searchBar.addEventListener("keyup", () => {
    if (checkedCats.length == 0) {
        searchBarEvents = futureEvents.filter((evento) =>
        evento.name.toLowerCase().includes(searchBar.value.toLowerCase()))
    }
    else {
        searchBarEvents = bufferEvents.filter((evento) =>
            evento.name.toLowerCase().includes(searchBar.value.toLowerCase()))
        }
    box.innerHTML = createFoundedCards(searchBarEvents);
})

 //Los checkboxes
form.addEventListener("click", (e) => {//ok
    if (e.target.checked != undefined) {
        if (e.target.checked) {
            checkedCats.push(e.target.value)
        }
        else {
            let index = checkedCats.indexOf(e.target.value)
            if (index != -1) {
                checkedCats.splice(index, 1)
            }
        }
    }
    let checkedEvents = [];
    for (let cat of checkedCats) {
        for (let event of futureEvents) {
            if (event.category.toLowerCase().includes(cat)) {
                checkedEvents.push(event);
            }
        }
    }
    if (searchBar.value == 0) {
        box.innerHTML = createFoundedCards(checkedEvents);
    }
    else {
        searchCheckedEvents = checkedEvents.filter((evento) =>
            evento.name.toLowerCase().includes(searchBar.value.toLowerCase()))
            box.innerHTML = createFoundedCards(searchCheckedEvents);
    }
    bufferEvents = checkedEvents.map((evento) => evento);
    if (checkedCats.length === 0 && searchBar.value == 0) {
        box.innerHTML = createCards(futureEvents);
    }
    else if (checkedCats.length === 0 && searchBar.value != 0) {
        searchBarEvents = futureEvents.filter((evento) =>
                evento.name.toLowerCase().includes(searchBar.value.toLowerCase()))
                box.innerHTML = createFoundedCards(searchBarEvents);
    }
})
})
.catch(error => {
    console.log(`Mi error: ${error}`);
})