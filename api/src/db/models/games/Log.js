module.exports = class Log {
    id = null;
    game = null;
    date_start = null;
    date_end = null;
    rating = null;
    review = null;
  
    constructor(data) {
        this.id = data.log_id;
        this.game = {
            id: data.game_id,
            title: data.game_title,
            poster_path: data.game_cover
        };
        this.date_start = data.date_start;
        this.date_end = data.date_end;
        this.rating = data.rating;
        this.review = data.review;
    }
};