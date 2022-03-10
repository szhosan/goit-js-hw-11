import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.css';
import PhotoApiService from './js/photo-service';
import SimpleLightbox from 'simplelightbox';

const axios = require('axios');

const photoApiService = new PhotoApiService();

let lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBut: document.querySelector('.loadMoreBut'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBut.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  clearGallery();
  photoApiService.query = e.currentTarget.elements.searchQuery.value;
  photoApiService.resetPage();
  createMarkup(await photoApiService.getPhotos());
  lightbox.refresh();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function createMarkup({ data }) {
  console.log(data);
  let markup = data.hits
    .map(photoInfo => {
      return `<a class="gallery__item" href='${photoInfo.largeImageURL}'>
    <img class="gallery__image" src="${photoInfo.webformatURL}" alt="${photoInfo.tags}" loading="lazy" />
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
    </a>`;
    }).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

async function onLoadMore() {
  createMarkup(await photoApiService.getPhotos());
  lightbox.refresh();
}
