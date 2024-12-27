module.exports = class Album {
    id = null;
    title = null;
    poster_path = null;
  
    constructor(data) {
        this.id = data.album_id;
        this.title = data.album_title;
        this.poster_path = data.album_cover;
    }
};