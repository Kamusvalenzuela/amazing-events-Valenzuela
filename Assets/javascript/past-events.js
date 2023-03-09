let $pastEventsCard = document.getElementById("past-event-card")
let $containerCategory = document.getElementById("category-container")
const $containerCategorySelect = document.getElementById("index-category-select") 
let $searchPastEvent = document.getElementById("search-input-past")
let events = datos.map(event => event)
let categoriesOnly = new Set(datos.map(category => category.category))

//cards//
function createCards(event){
    let card = document.createElement("div")
    card.classList.add('card', 'mb-3', 'mb-md-0')
    card.innerHTML = `
        <img src="${event.image}" class="card-img-top" alt="this is an ${event.name}">
        <div class="card-body d-flex flex-column gap-3 ">
            <div class="d-flex flex-column align-items-center text-card">
                <h5 class="card-title d-flex text-align-center">${event.name}</h5>
                <p class="card-text">${event.description}</p>
            </div>
            <div class="d-flex flex-row justify-content-between">
                <div class="d-flex flex-row gap-1">
                    <h5>Price: </h5>
                    <p>$${event.price}</p>
                </div>
                <div>
                <a href="./details.html?id=${event._id}" class="btn">View More</a>
                </div>
            </div>
        </div>
    `
    
        return card
    
}

function printCard(events, container){
    container.innerHTML = ''
    let $fragmentpastEvents = document.createDocumentFragment()
    let filtradosEvents = events.filter(event => event.date < "2022-09-01")
    filtradosEvents.forEach(event => $fragmentpastEvents.appendChild(createCards(event)))

    container.appendChild($fragmentpastEvents)

}

printCard(datos, $pastEventsCard)

function createCategory(category, container){
    let template = '' 
    category.forEach(categories => {
        template += `
        <div class="d-flex padding-left">
            <input class="form-check-input" type="checkbox" value="${categories}" checked id="${categories}">
            <label class="form-check-label" for="${categories}">
                ${categories}
            </label>
        </div>     
        `
    })
    container.innerHTML = template
}

createCategory(categoriesOnly, $containerCategory )


let filterEventsGlobal = []

$containerCategory.addEventListener("change", (event) => {
    let checked =Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(valor => valor.value)
    let filterEvents = filterCards(events, checked)
    filterEvents.length !== 0
    ?   printCard(filterEvents, $pastEventsCard)
    :   $pastEventsCard.innerHTML = `<h2>Select a category</h2>` 
    filterEventsGlobal = filterEvents.map(e => e)
})


function filterCards(events, condition) {
    let filter = events.filter(event => condition.includes(event.category))
    return filter
}


function filterText(array, text){
    if (text === ""){
        return array
    } else {
        return array.filter(element => element.name.toLowerCase().includes(text))
    }
}




$searchPastEvent.addEventListener("keyup", e => {
    const valorInput = Array.from(document.querySelectorAll('input[type="search"]')).map(element => element.value)
    const cadenaInput = valorInput.toString().toLowerCase()
    filterEventsGlobal = valorEventGlobal()
    const cardsFilter = filterSearch(filterEventsGlobal, cadenaInput)
    printCard(cardsFilter, $pastEventsCard)  
})


function filterSearch(events, valorInput) {
    let filter = events.filter(e => e.name.toLowerCase().includes(valorInput)) 
    console.log(filter)
    return filter
}



function printCategorySlct(category, where) {
    let template = `
    <option selected>Select Category</option>
    `
    category.forEach( element => {
        template += `
            <option value="">${element}</option>      
        `
    })
    where.innerHTML = template
}


printCategorySlct(categoriesOnly, $containerCategorySelect)

$containerCategorySelect.addEventListener("change", e => {
    let select = Array.from(document.querySelectorAll('option')).filter(elemento => elemento.selected).map(element => element.textContent)
    let filterCategory = filterCategoriesSelect(events, select)
    select.includes("Select Category")
    ? printCard(events, $pastEventsCard)
    : printCard(filterCategory, $pastEventsCard)
    
})

function filterCategoriesSelect(category, condition){
    const filter = category.filter(categories => condition.includes(categories.category))
    return filter
}

function valorEventGlobal(){
    if (filterEventsGlobal.length === 0) {
        return datos
    }
    return filterEventsGlobal
}