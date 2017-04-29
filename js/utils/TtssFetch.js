import { Html5Entities } from "html-entities";
import { AsyncStorage } from "react-native";
const entities = new Html5Entities();

export async function searchForStops(partialName) {
  if (!partialName) return;
  const stops = await fetchTtssData(
    "services/lookup/autocomplete/json",
    { query: partialName }
  );
  stops.shift();
  return stops.map(i => ({ id: i.id, name: decode(i.name) }));
}

export async function getStopDepartures(stopId) {
  const departures = await fetchTtssData(
    "services/passageInfo/stopPassages/stop",
    { stop: stopId, mode: "departure" }
  );
  const act = departures.actual;
  return { departures: departures.actual, stopName: departures.stopName };
}

export async function getTripInfo(tripId) {
  const lineStop = await fetchTtssData(
    "services/tripInfo/tripPassages",
    { tripId }
  );
  return lineStop.actual;
}

export async function getStopLocation(stopId) {
  const stopData = await fetchTtssData(
    "/geoserviceDispatcher/services/stopinfo/stop",
    { stopId: stopId }
  );
  return convertCoordinates(stopData);
}

export async function getAllStops() {
  const cached = await AsyncStorage.getItem("allStops");
  const allStopsCached = JSON.parse(cached);
  let yesterday = Date.now() - 1000 * 60 * 60 * 24;
  if (allStopsCached && allStopsCached.cacheTime > yesterday)
    return allStopsCached.stops;

  const allStopsResult = await fetchTtssData(
    "geoserviceDispatcher/services/stopinfo/stops",
    { left: -648000000, bottom: -324000000, right: 648000000, top: 324000000 }
  );

  const stops = allStopsResult.stops
    .filter(stop => stop.category === "tram")
    .map(convertCoordinates);
  await AsyncStorage.setItem(
    "allStops",
    JSON.stringify({
      cacheTime: Date.now(),
      stops: stops
    })
  );
  return stops;
}

let lastUpdate = 0;
const tramPositions = {};

function getTramPositionQueryParams() {
  const queryParams = {
    positionType: "CORRECTED",
    colorType: "ROUTE_BASED"
  };
  if (lastUpdate) {
    queryParams.lastUpdate = lastUpdate;
  }
  return queryParams;
}
function removeDeletedTramPositions(vehicles) {
  vehicles.forEach(function(vehicle) {
    if (vehicle.isDeleted && tramPositions[vehicle.id]) {
      delete tramPositions[vehicle.id];
    }
  });
}
function updateTramPositions(vehicles) {
  vehicles
    .filter(veh => !(veh.isDeleted == true))
    .map(convertCoordinates)
    .forEach(
      veh =>
        tramPositions[veh.id] = {
          id: veh.id,
          latitude: veh.latitude,
          longitude: veh.longitude,
          name: veh.name
        }
    );
}

export async function getTramsPosition() {
  const queryParams = getTramPositionQueryParams();
  const allTrams = await fetchTtssData(
    "geoserviceDispatcher/services/vehicleinfo/vehicles",
    queryParams
  );
  lastUpdate = allTrams.lastUpdate;
  const vehicles = allTrams.vehicles;

  removeDeletedTramPositions(vehicles);
  updateTramPositions(vehicles);
  return Object.keys(tramPositions).map(key => tramPositions[key]);
}

function convertCoordinates(coordinateObject) {
  coordinateObject.latitude = coordinateObject.latitude / 3600000.0;
  coordinateObject.longitude = coordinateObject.longitude / 3600000.0;
  return coordinateObject;
}

const ttssFetchBase = "http://www.ttss.krakow.pl/internetservice/";

async function fetchTtssData(path, params) {
  let additionalParams = "?";
  for (var param in params) {
    if (params.hasOwnProperty(param)) {
      additionalParams += `${param}=${params[param]}&`;
    }
  }
  const uri = `${ttssFetchBase}${path}${additionalParams}`;
  console.log("ttss query", uri);
  const response = await fetch(uri);
  return await response.json();
}

function decode(name) {
  return entities.decode(name);
}
