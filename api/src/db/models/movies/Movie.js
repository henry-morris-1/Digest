module.exports = class Movie {
    id = null;
    title = null;
    poster_path = null;
  
    constructor(data) {
        this.id = data.movie_id;
        this.title = data.movie_title;
        this.poster_path = data.movie_poster;
    }
};