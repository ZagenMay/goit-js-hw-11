import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchGallery } from './fetchGallery';
import throttle from 'lodash.throttle';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

let imageValue = '';
hideButton(refs.loadMoreButton);

refs.form.addEventListener('submit', throttle(onSearch, 2000));
refs.loadMoreButton.addEventListener('click', onLoadMore);

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function hideButton(item) {
  item.classList.add('visually-hidden');
}

function showButton(item) {
  item.classList.remove('visually-hidden');
}

function onSearch(e) {
  e.preventDefault();
  imageValue = e.currentTarget.searchQuery.value;

  hideButton(refs.loadMoreButton);
  fetchGallery(imageValue).then(images => {
    const arrayImages = images.data.hits;
    const totalImages = images.data.totalHits;

    if (arrayImages.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    } else {
      clearGallery();
      markupGallery(arrayImages);
      new SimpleLightbox('.gallery a', { captionDelay: 250, showCounter: false });
      Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
      showButton(refs.loadMoreButton);
    }
  });
}

function onLoadMore() {
  fetchGallery(imageValue)
    .then(images => {
      const arrayImages = images.data.hits;
      if (arrayImages.length === 0) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        hideButton(refs.loadMoreButton);
        return;
      }
      markupGallery(arrayImages);
      new SimpleLightbox('.gallery a', { captionDelay: 250, showCounter: false });
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      hideButton(refs.loadMoreButton);
    });
}

function markupGallery(images) {
  const markup = images
    .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
      return `
        <a class="gallery__item" href="${largeImageURL}">
          <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="description-box">
              <p class="info-item">
                <b>Likes</b>
                ${likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${downloads}
              </p>
            </div>
          </div>
        </a>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
