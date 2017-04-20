
import { Html5Entities } from 'html-entities'
const entities = new Html5Entities()

export async function searchForStops(partialName) {
    const response = await fetch('http://www.ttss.krakow.pl/internetservice/services/lookup/autocomplete/json?query=' + partialName)
    const stops = await response.json()
    stops.shift()
    console.log('stops', stops)
    return stops.map(i => ({id: i.id,name: decode(i.name)}))
}

function decode( name ) {
    return entities.decode(name);
}

