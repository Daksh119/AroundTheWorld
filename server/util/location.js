const axios = require("axios");
const HttpError = require("../models/http-error");

const getCoordinatesFromAddress = async (address) => {
  console.log("in");
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
  );
  const data = response.data;
  if (!data || data.length === 0) {
    throw new HttpError(
      "Couldn't find coordinates for the specified address!",
      422
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
