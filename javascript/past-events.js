const cardsContainer = document.getElementById("cardsContainer");
const currentDate = data.currentDate;
const dataEvents = data.events;

function createCard() {
    let card = "";
    for (const event of dataEvents) {
        const dataEventsDate = event.date;
        if (dataEventsDate <= currentDate) {
            card += `<div id="eventCard" class="card m-2" style="width: 16rem;">
            <img src=${event.image} class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title fs-4 text-center">${event.name}</h5>
                <p class="card-text text-center">${event.description}</p>
            </div>
            <div class="d-flex justify-content-end">
                <a href="./details.html?id=${event._id}" class="btn btn-sm btn-card me-3 mb-3">Show More</a>
            </div>
        </div>`;
        }
    }
    return card;
}

let cardElement = createCard(dataEvents);
cardsContainer.innerHTML = cardElement;