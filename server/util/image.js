const HttpError = require("../models/http-error");
const { createApi } = require('unsplash-js');
let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
  global.fetch = fetch;
})();


const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS,
});

const getImage = async(query) =>  {
  try {
    const response = await unsplash.search.getPhotos({
      query,
      page: 1,
      perPage: 1,
    });

    if (response.response.results.length > 0) {
      return response.response.results[0].urls.regular;
    } else {
      throw new HttpError('No images found');
    }
  } catch (error) {
    console.error('Error fetching image URL:', error);
    throw new HttpError('Could not fetch image URL');
  }
}

module.exports = getImage;
