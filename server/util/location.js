let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
  global.fetch = fetch;
})();
const HttpError = require("../models/http-error");

const getCoordinatesFromAddress = async (address) => {
  console.log("in");
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
  );
  
  const data = await response.json();
  console.log(data);
  if (!data || data.length === 0) {
    throw new HttpError(
      "Couldn't find coordinates for the specified address!",
      404
    );
  }
  console.log("in1");
  const coordinates = {
    lat: data[0].lat,
    lng: data[0].lon
  };

  return coordinates;
}

module.exports = getCoordinatesFromAddress;
