//Carga de API
let urlApi = "https://mindhub-xj03.onrender.com/api/amazing";

//Función de orden y filtrado de categorías existentes:
function filterArrayCat(dataArray) {
    let aECategoriesArray = [];
    dataArray.forEach(event => {
        if (!aECategoriesArray.includes(event.category)) {
            aECategoriesArray.push(event.category)
        }
    })
    return aECategoriesArray.sort();
}
function orderLowAtt(a, b) {
    if (a.percentageOfAtt < b.percentageOfAtt) { return -1; }
    if (a.percentageOfAtt > b.percentageOfAtt) { return 1; }
    return 0;
}
function orderHiAtt(a, b) {
    if (a.percentageOfAtt > b.percentageOfAtt) { return -1; }
    if (a.percentageOfAtt < b.percentageOfAtt) { return 1; }
    return 0;
}
function orderCapacity(a, b) {
    if (a.capacity > b.capacity) { return -1; }
    if (a.capacity < b.capacity) { return 1; }
    return 0;
}
//Fetch a la API
fetch(urlApi)
    .then(response => response.json())
    .then(data => {
let categories = filterArrayCat(data.events);
let pastEvents = data.events.filter((event) => event.date < data.currentDate);
let futureEvents = data.events.filter((event) => event.date >= data.currentDate);

//Agrega la propiedad Porcentaje de asistencia a cada evento en pastEvents:
        pastEvents.forEach((event) => {
            event.percentageOfAtt = parseFloat((event.assistance * 100 / event.capacity).toFixed(2));
        })
//Agrega la propiedad Porcentaje estimado a cada evento en upcomingEvents:
        futureEvents.forEach((event) => {
            event.percentageEst = parseFloat((event.estimate * 100 / event.capacity).toFixed(2));
        })
//Array ordenado de mayor a menor:
        let eventsOrderHigh = pastEvents.map((event) => event);
        eventsOrderHigh.sort(orderHiAtt);
//Array ordenado de menor a mayor:
        let eventsOrderLow = pastEvents.map((event) => event);
        eventsOrderLow.sort(orderLowAtt);
//Array ordenado por capacidad:
        let eventsOrderCapacity = pastEvents.map((event) => event);
        eventsOrderCapacity.sort(orderCapacity);
//Estadísticas de Upcoming-events por categoría:
        let futureEventsByCat = [];
        for (let cat of categories) {
            let totalRevenues = 0;
            let percentageSum = 0;
            let eventCount = 0;
            let eventObj = {};
            eventObj.category = cat;
            for (let event of futureEvents) {
                if (event.category.toLowerCase() == cat.toLowerCase()) {
                    totalRevenues += event.price * event.estimate;
                    percentageSum += event.percentageEst; 
                    eventCount ++;
                }
            }
            eventObj.totalRevenues = totalRevenues;
            if(percentageSum != 0){
                eventObj.mediaPercentage = (percentageSum / eventCount).toFixed(2);
            }
            else{
                eventObj.mediaPercentage = 0;
            }
            futureEventsByCat.push(eventObj);
        }
//Estadísticas de pastevents por categoría:
        let pastEventsByCat = [];
        for (let cat of categories) {
            let totalRevenues = 0;
            let percentageSum = 0;
            let eventCount = 0;
            let eventObj = {};
            eventObj.category = cat;
            for (let event of pastEvents) {
                if (event.category.toLowerCase() == cat.toLowerCase()) {
                    totalRevenues += event.price * event.assistance;
                    percentageSum += event.percentageOfAtt; 
                    eventCount ++;
                }
            }
            eventObj.totalRevenues = totalRevenues;
            if(percentageSum != 0){
                eventObj.mediaPercentage = (percentageSum / eventCount).toFixed(2);
            }
            else{
                eventObj.mediaPercentage = 0;
            }
            pastEventsByCat.push(eventObj);
        }
        console.log("pastEventsByCat: ", pastEventsByCat);
        let tHead = `<table>
        <thead>
            <tr class="table-stats">
                <th colspan="3">Events Statistics</th>
            </tr>
        </thead>`
        let tBodyHeaders1 = `<tbody id="stats">
            <tr class="table-column">
                <th>Events with the highest percentage of attendance</th>
                <th>Events with the lowest percentage of attendance</th>
                <th>Events with larger capacity</th>
            </tr>`
        let tInfoTop3 = ``;
        const rowsToRender = 3;
        for(let i = 0; i < rowsToRender; i++){
            tInfoTop3 += `
            <tr>
                <td> ${eventsOrderHigh[i].name}: ${eventsOrderHigh[i].percentageOfAtt} % </td>
                <td> ${eventsOrderLow[i].name}: ${eventsOrderLow[i].percentageOfAtt} % </td>
                <td> ${eventsOrderCapacity[i].name}: ${eventsOrderCapacity[i].capacity}  </td>
            </tr>`
        }
        let tBodyHeaders2 = `
            <tr class="table-stats">
                <th colspan="3">Upcoming events statistics by category</th>
            </tr>
            <tr class="table-column">
                <th>Categories</th>
                <th>Revenues</th>
                <th>Percentage of attendance</th>
            </tr>`
        let upcomigInfo = ``;
        for(let i = 0; i < futureEventsByCat.length; i++){
            upcomigInfo += `
            <tr>
                <td> ${futureEventsByCat[i].category} </td>
                <td> $ ${futureEventsByCat[i].totalRevenues}.- </td>
                <td> ${futureEventsByCat[i].mediaPercentage} %</td>
            </tr>`
        }
        let tBodyHeaders3 = `
            <tr class="table-stats">
                <th colspan="3">Past events statistics by category</th>
            </tr>
            <tr class="table-column">
                <th>Categories</th>
                <th>Revenues</th>
                <th>Percentage of attendance</th>
            </tr>`;
        let pastInfo = ``;
        for(let i = 0; i < pastEventsByCat.length; i++){
            pastInfo += `
            <tr>
                <td> ${pastEventsByCat[i].category} </td>
                <td> $ ${pastEventsByCat[i].totalRevenues}.- </td>
                <td> ${pastEventsByCat[i].mediaPercentage} %</td>
            </tr>`
        }
        pastInfo += `
        </tbody>
    </table>
        `
    let box = document.getElementById("box");
    box.innerHTML = tHead + tBodyHeaders1 + tInfoTop3 + tBodyHeaders2 + upcomigInfo + tBodyHeaders3 + pastInfo;
    })


.catch(error => {
    console.log(`Mi error: ${error}`);
})

    //No sé qué hago con mi vida