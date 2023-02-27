
const currentDate = data.currentDate;
const dataEvents = data.events;
const info = dataEvents
const containerDescription = document.getElementById("container-details")
const containerImage = document.getElementById("image-details")
const queryString = location.search
const params = new URLSearchParams(queryString).get("id")
const idNumber = parseInt(params) 


const events = dataEvents.find(item => item._id === idNumber)


containerDescription.innerHTML = `
            <h1>${events.name}</h1>
            <p>${events.category}</p>
            <p>${events.description}</p>
            <p>Place: ${events.place}</p>
            <p>Capacity: ${events.capacity}</p>
            <p>Price: $${events.price}</p>
    `



containerImage.innerHTML = `
            <div class="d-flex w-100 h-100" >
                <img class="" src="${events.image}" alt="this an image of ${events.name}"/>      
            </div>
    `
