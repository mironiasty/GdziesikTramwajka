
import { Html5Entities } from 'html-entities'
const entities = new Html5Entities()

export async function searchForStops(partialName) {
    if (!partialName) return;
    const response = await fetch(`http://www.ttss.krakow.pl/internetservice/services/lookup/autocomplete/json?query=${partialName}`)
    const stops = await response.json()
    stops.shift()
    return stops.map(i => ({ id: i.id, name: decode(i.name) }))
}

export async function getStopDepartures(stopId) {
    const response = await fetch(`http://www.ttss.krakow.pl/internetservice/services/passageInfo/stopPassages/stop?stop=${stopId}&mode=departure`)
    const departures = await response.json()
    const act = departures.actual;
    return { departures: departures.actual, stopName: departures.stopName };
}

export async function getTripInfo(tripId){
    console.log(tripId)
    const response = await fetch(`http://www.ttss.krakow.pl/internetservice/services/tripInfo/tripPassages?tripId=${tripId}`);
    const lineStop = await response.json();
    console.log('ohhh', lineStop)
    return lineStop.actual;
}

function decode(name) {
    return entities.decode(name);
}

