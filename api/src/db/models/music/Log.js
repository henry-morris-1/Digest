module.exports = class Log {
    id = null;
    album = null;
    date = null;
    rating = null;
    review = null;
  
    constructor(data) {
        this.id = data.log_id;
        this.album = {
            id: data.album_id,
            title: data.album_id,
            poster_path: data.album_cover
        };
        this.date = data.date;
        this.rating = data.rating;
        this.review = data.review;
    }
};