import './css/styles.css';
import PhotoApiService from './js/photo-service';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const axios = require('axios');

const photoApiService = new PhotoApiService();

let lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250});

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
}

function clearGallery(){
    refs.gallery.innerHTML = '';
}

function createMarkup({ data }) {
  console.log(data);
  let markup = '';
  data.hits.map(photoInfo => {
    markup += `<a href='${photoInfo.largeImageURL}'>
    <img src="${photoInfo.webformatURL}" alt="${photoInfo.tags}" loading="lazy" />
    
  </a>`;
  });
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function onLoadMore() {
  photoApiService.getPhotos();
}


{/* <div class="info">
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
    </div> */}