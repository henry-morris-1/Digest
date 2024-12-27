module.exports = class List {
    id = null;
    title = null;
    games = null;
  
    constructor(data) {
        this.id = data.list_id;
        this.title = data.title;
        this.games = [];
    }
};