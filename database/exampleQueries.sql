-- 
-- USERS
-- 

-- Get a user
SELECT * FROM users WHERE username = 1;

-- Create a user
INSERT INTO users (username, password, salt) VALUES 
	(hrmorri5, <hashed password>, <salt>);




-- 
-- MOVIES
-- 

-- Add a new movie, ingore if there is already a record for it
INSERT IGNORE INTO movies (movie_id, movie_title, movie_poster) VALUES
	(11, 'Star Wars', '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg');




-- 
-- LOGS
-- 

-- Get all movie logs for a given user
SELECT * 
FROM movie_log 
WHERE user_id_fk = 1
ORDER BY date;

-- Get the movie logs for a given user joined with the movie object
SELECT log_id, date, rating, review, movie_id, movie_title, movie_poster
FROM movie_log 
INNER JOIN movies ON 
	movie_log.movie_id_fk = movies.movie_id 
	AND 
	movie_log.user_id_fk = 1
ORDER BY date;

-- Get movie logs for a given movie from a given user
SELECT log_id, date, rating, review, movie_id, movie_title, movie_poster
FROM movie_log 
INNER JOIN movies ON 
	movie_log.movie_id_fk = movies.movie_id 
	AND 
	movie_log.movie_id_fk = 262
	AND 
	movie_log.user_id_fk = 1
ORDER BY date;

-- Add a new movie log
INSERT INTO movie_log (user_id_fk, movie_id_fk, date, rating, review) VALUES
	(1, 11, '2024-03-30', 8, NULL);

-- Update a movie log
UPDATE movie_log SET 
	date = '2024-01-01', 
	rating = 1, 
	review = NULL
WHERE
	user_id_fk = 1
	AND
	log_id = 1;

-- Delete a movie log
DELETE FROM movie_log WHERE 
	user_id_fk = 1 
	AND
	log_id = 31;



-- 
-- BOOKMARKS
-- 

-- Get the bookmarks for a given user joined with the movie object
SELECT movie_id, movie_title, movie_poster 
FROM movie_bookmarks 
INNER JOIN movies ON
	movie_bookmarks.movie_id_fk = movies.movie_id
	AND
	movie_bookmarks.user_id_fk = 1
ORDER BY movie_bookmarks.bookmark_id;

-- Get the bookmark for a specific movie from a given user
SELECT * 
FROM movie_bookmarks 
WHERE 
	user_id_fk = 1 
	AND 
	movie_id_fk = 141;

-- Create a bookmark
INSERT IGNORE INTO movie_bookmarks (user_id_fk, movie_id_fk) VALUES
	(1, 11);

-- Delete a bookmark
DELETE FROM movie_bookmarks WHERE 
	user_id_fk = 1 
	AND
	movie_id_fk = 141;



-- 
-- LISTS
-- 

-- Get every list for a specific user
SELECT * FROM movie_lists WHERE user_id_fk = 1;


-- Get the details of a given list
SELECT * FROM movie_lists WHERE list_id = 1;

-- Get the ordered list elements for a given list with movie elements
SELECT list_index, movie_id, movie_title, movie_poster 
FROM movie_list_items
INNER JOIN movies ON 
	movie_list_items.movie_id_fk = movies.movie_id
	AND
	movie_list_items.list_id_fk = 1
ORDER BY movie_list_items.list_index;

-- Create a new list
INSERT INTO movie_lists (user_id_fk, title) VALUES 
	(1, 'New List');
SET @ListID = LAST_INSERT_ID();
INSERT IGNORE INTO movies (movie_id, movie_title, movie_poster) VALUES 
	(11, 'Star Wars', '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg');
INSERT INTO movie_list_items (list_id_fk, list_index, movie_id_fk) VALUES 
	(@ListID, 1, 11);

-- Add a movie to a list
SET @NewIndex = (SELECT MAX(list_index) 
				 FROM movie_list_items 
				 WHERE list_id_fk = 1) + 1;
INSERT IGNORE INTO movies (movie_id, movie_title, movie_poster) VALUES 
	(11, 'Star Wars', '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg');
INSERT INTO movie_list_items (list_id_fk, list_index, movie_id_fk) VALUES 
	(1, @NewIndex, 11);

-- Edit a list
UPDATE movie_lists 
SET title = ? 
WHERE 
	user_id_fk = ? 
	AND 
	list_id = ?;
DELETE FROM movie_list_items 
WHERE list_id_fk = ?;
-- For each movie in the list:
INSERT IGNORE INTO movies (movie_id, movie_title, movie_poster) VALUES 
	(?, ?, ?);
INSERT INTO movie_list_items (list_id_fk, list_index, movie_id_fk) VALUES 
	(?, ?, ?);

-- Delete a list
DELETE FROM movie_list_items WHERE
	list_id_fk = 9;
DELETE FROM movie_lists WHERE
	user_id_fk = 1
	AND
	list_id = 9;

