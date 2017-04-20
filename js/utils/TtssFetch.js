


export async function searchForStops(partialName) {
  const response = await fetch('http://www.ttss.krakow.pl/internetservice/services/lookup/autocomplete/json?query=' + partialName)
  const stops = await response.json()
  stops.shift()
  return stops
}

