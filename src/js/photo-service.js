const axios = require('axios').default;

export default class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getPhotos() {
    //console.log(this);
    const instance = axios.create({
      baseURL: 'https://pixabay.com/api/',
      url: '',
      params: {
        key: '26076685-78cd58b795bf8e518af2b4a8a',
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: 40,
      },
    });

    try {
      const response = await instance.get();
      this.incrementPage();
      return response;      
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
