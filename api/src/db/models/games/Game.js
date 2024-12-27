module.exports = class Game {
    id = null;
    title = null;
    poster_path = null;
  
    constructor(data) {
        this.id = data.game_id;
        this.title = data.game_title;
        this.poster_path = data.game_cover;
    }
};