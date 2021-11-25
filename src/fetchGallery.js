import axios from 'axios';
export { fetchGallery };

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = `24482751-f2e307ee4ecf632cba86f721f`;
let page = 1;

async function fetchGallery(imageValue) {
  const FULL_URL = `${BASE_URL}?key=${API_KEY}&q=${imageValue}
    &image_type=photo&orientation=horizontal&safesearch=true&page=${page}
    &per_page=${40}`;

  try {
    const images = await axios.get(FULL_URL);
    page += 1;

    return await images;
  } catch (error) {
    console.log(error);
  }
}
