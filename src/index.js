import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.css';
import PhotoApiService from './js/photo-service';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios');

const photoApiService = new PhotoApiService();

let lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();
  clearGallery();
  photoApiService.query = e.currentTarget.elements.searchQuery.value;
  photoApiService.resetPage();
  try {
    createMarkup(await photoApiService.getPhotos());
    Notify.success(`Hooray! We found ${photoApiService.totalHits} images.`);
  } catch (error) {
    Notify.failure(error);
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function createMarkup({ data }) {
  let markup = data.hits
    .map(photoInfo => {
      return `<div class="photo-card"><a class="gallery__item" href='${photoInfo.largeImageURL}'>
    <img class="gallery__image" src="${photoInfo.webformatURL}" alt="${photoInfo.tags}" loading="lazy" /></a>
    <div class="info">
    <p class="info-item">
      <b>Likes</b>${photoInfo.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${photoInfo.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${photoInfo.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${photoInfo.downloads}
    </p>
  </div>
    </div>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  observer.observe(refs.gallery.lastElementChild);
}

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && photoApiService.query !== '') {
        if (photoApiService.areAllRequestedPhotosShown()) {
        Notify.failure(`We're sorry, but you've reached the end of search results.`);
        return;
      }
      try {
        photoApiService.getPhotos().then(createMarkup);
        observer.unobserve(entry.target);
      } catch (error) {
        Notify.failure(error);
      }
    }
  });
}