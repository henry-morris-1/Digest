module.exports = class Log {
    id = null;
    movie = null;
    date = null;
    rating = null;
    review = null;
  
    constructor(data) {
        this.id = data.log_id;
        this.movie = {
            id: data.movie_id,
            title: data.movie_title,
            poster_path: data.movie_poster
        };
        this.date = data.date;
        this.rating = data.rating;
        this.review = data.review;
    }
};