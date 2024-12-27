module.exports = class List {
    id = null;
    title = null;
    movies = null;
  
    constructor(data) {
        this.id = data.list_id;
        this.title = data.title;
        this.movies = [];
    }
};