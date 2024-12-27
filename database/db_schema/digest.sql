---------------------
--      USERS      --
---------------------

-- 
-- Users
-- 
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `username` varchar(100) NOT NULL,
    `password` varchar(128) NOT NULL,
    `salt` varchar(32) NOT NULL,
    UNIQUE KEY (`username`),
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `users`;
INSERT INTO `users` (`user_id`, `username`, `password`, `salt`) VALUES
        (1, 'admin', 'dde9ec383ba847976c673fc42350f6eb61c5f95cd70d0f56a795fe7979b7aad0df6c28d85b9a44af682be60e49ab7a0ae0e93c0d6f36b3daba06060cb082fb0c', '4489cc746c3ebce4ded1f3727c091105'),
        (2, 'jmadrig', '314a62056fab3584921896542575dd807e587d4a74d6e4ee3f8d23b51f62ee019c09cd44db9807e002efc411aaf36ff34acc845701e8d69a5b7ccb3c2af09b92', '3c3ce795cff14ebfd733b1e22fc1f6f5');




----------------------
--      MOVIES      --
----------------------

-- 
-- Movies referenced in other tables
-- 
CREATE TABLE IF NOT EXISTS `movies` (
    `movie_id` int(10) unsigned NOT NULL,
    `movie_title` varchar(200) NOT NULL,
    `movie_poster` varchar(50) NOT NULL,
    PRIMARY KEY (`movie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `movies`;
INSERT INTO `movies` (`movie_id`, `movie_title`, `movie_poster`) VALUES
        (3175, 'Barry Lyndon', '/dOJtBSyI30wWc08UmyEKLsu4Rfk.jpg'),
        (7345, 'There Will Be Blood', '/fa0RDkAlCec0STeMNAhPaF89q6U.jpg'),
        (334, 'Magnolia', '/uq2u8HgtLFJkjNq2kHb2jvipIPT.jpg'),
        (829, 'Chinatown', '/mQJz8J4naOA7RmCtypTPjgXZIMY.jpg'),
        (8461, 'Funny Games', '/vq7XV1KT6ix94GDgMfufZ0Qzamd.jpg'),
        (503919, 'The Lighthouse', '/4SC4cyzHWWzDEdszdxHYPWd32YH.jpg'),
        (11645, 'Ran', '/jQnUtWaHYfqnXPOIf77K7Ycqk4M.jpg'),
        (12493, 'High and Low', '/tgNjemQPG96uIezpiUiXFcer5ga.jpg'),
        (1091, 'The Thing', '/tzGY49kseSE9QAKk47uuDGwnSCu.jpg'),
        (655, 'Paris, Texas', '/7G6ea5djDvCxfqfoMAX8479T4UB.jpg'),
        (262, 'The King of Comedy', '/3BM78deUfeZfShqPTblZuamgC8a.jpg'),
        (27274, 'Frankenhooker', '/s8Oubzkc2pPdOdj4D23ljZSKRbg.jpg'),
        (607, 'Men in Black', '/uLOmOF5IzWoyrgIF5MfUnh5pa1X.jpg'),
        (4723, 'Southland Tales', '/7dbIDQ80z4bxiDlAvxRwc5TI44C.jpg'),
        (141, 'Donnie Darko', '/fhQoQfejY1hUcwyuLgpBrYs6uFt.jpg'),
        (1056360, 'American Fiction', '/57MFWGHarg9jid7yfDTka4RmcMU.jpg'),
        (814776, 'Bottoms', '/jeyTQrNEpyE1LZIgVlswYh3sc34.jpg'),
        (467244, 'The Zone of Interest', '/hUu9zyZmDd8VZegKi1iK1Vk0RYS.jpg'),
        (814340, 'Cha Cha Real Smooth', '/iUvoVhvwTlP8DofoqeIu7QAGLAe.jpg'),
        (1139829, 'Orion and the Dark', '/uHiXFLMlnl5jBjtfOliapN16yBD.jpg'),
        (34207, 'Duck Season', '/mgjRbhmHq3n1xqjLPzMjdZzG4it.jpg'),
        (915935, 'Anatomy of a Fall', '/kQs6keheMwCxJxrzV83VUwFtHkB.jpg'),
        (10377, 'My Cousin Vinny', '/z5RexWgSjQxa008MkAmi6LLZbjq.jpg'),
        (8952, 'I Love You Phillip Morris', '/qtAuWLGQ7N4PNQ6boZeqqoUY2l9.jpg'),
        (346698, 'Barbie', '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg'),
        (693134, 'Dune: Part Two', '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'),
        (31417, 'Eyes Without a Face', '/8y7Z9Gvcq52uOlJlUWyn2epGGRd.jpg'),
        (9388, 'Thank You for Smoking', '/xIlQYkRjpGBMXDkZoS3IRcckScA.jpg'),
        (994108, 'All of Us Strangers', '/aviJMFZSnnCAsCVyJGaPNx4Ef3i.jpg'),
        (19494, 'Nine to Five', '/34cDJ8DMVb0RuIg5zDuotCGdNKb.jpg'),
        (11826, 'Sexy Beast', '/9OlmWIEuSec27HiOPuMJASnff6f.jpg'),
        (10653, 'The Seven Year Itch', '/4oLqx0QbjWFzWtkxRmDLGH47CUJ.jpg'),
        (599, 'Sunset Boulevard', '/sC4Dpmn87oz9AuxZ15Lmip0Ftgr.jpg'),
        (39939, 'Super Troopers', '/yJyxPItcLNVfYr7idOphQTmQ9hK.jpg'),
        (520023, 'Bodies Bodies Bodies', '/hSuTjDmqRdy7Dii8ymnF2WILTeP.jpg'),
        (1847, 'The Long Goodbye', '/oBhUK54yBJ0aH6u9zCzSV5iV7OP.jpg'),
        (592, 'The Conversation', '/leZtiWJXHEp2x7jVW7djhcSboSJ.jpg'),
        (17365, 'The Parallax View', '/5ClPRox438lwK2Eze7X5xySDaYC.jpg'),
        (1548, 'Ghost World', '/uwKqnUPE4dSM0kKuMW0vXpURh2T.jpg'),
        (11974, "The 'Burbs", '/vrVPAcv2njVdnkqhBwGBc7UxCjz.jpg');

-- 
-- Movie logs
-- 
CREATE TABLE IF NOT EXISTS `movie_log` (
    `log_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `user_id_fk` int(10) unsigned NOT NULL,
    `movie_id_fk` int(10) unsigned NOT NULL,
    `date` varchar(10) NOT NULL,
    `rating` int(10) unsigned,
    `review` varchar(500),
    PRIMARY KEY (`log_id`),
    CONSTRAINT `FK_USER_ID_MOVIE_LOG` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`),
    CONSTRAINT `FK_MOVIE_ID_LOG` FOREIGN KEY (`movie_id_fk`) REFERENCES `movies` (`movie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `movie_log`;
INSERT INTO `movie_log` (`log_id`, `user_id_fk`, `movie_id_fk`, `date`, `rating`, `review`) VALUES
        (1, 1, 262, '2024-01-06', 8, NULL),
        (2, 1, 27274, '2024-01-06', 5, NULL),
        (3, 1, 607, '2024-01-12', 7, NULL),
        (4, 1, 4723, '2024-01-14', 8, NULL),
        (5, 1, 141, '2024-01-15', 7, NULL),
        (6, 1, 1056360, '2024-01-15', 6, NULL),
        (7, 1, 814776, '2024-01-15', 8, NULL),
        (8, 1, 467244, '2024-01-27', 9, NULL),
        (9, 1, 814340, '2024-02-02', 5, NULL),
        (10, 1, 1139829, '2024-02-02', 6, NULL),
        (11, 1, 34207, '2024-03-09', 5, NULL),
        (12, 1, 915935, '2024-03-09', 8, NULL),
        (13, 1, 10377, '2024-03-10', 7, NULL),
        (14, 1, 8952, '2024-03-11', 6, NULL),
        (15, 1, 346698, '2024-03-11', 7, NULL),
        (16, 1, 693134, '2024-03-12', 8, NULL),
        (17, 1, 31417, '2024-03-14', 7, NULL),
        (18, 1, 9388, '2024-03-14', 5, NULL),
        (19, 1, 994108, '2024-03-15', 9, NULL),
        (20, 1, 19494, '2024-03-15', 4, NULL),
        (21, 1, 11826, '2024-03-16', 7, NULL),
        (22, 1, 10653, '2024-03-19', 6, NULL),
        (23, 1, 599, '2024-03-20', 8, NULL),
        (24, 1, 39939, '2024-03-20', 5, NULL),
        (25, 1, 520023, '2024-03-22', 4, NULL),
        (26, 1, 1847, '2024-03-23', 6, NULL),
        (27, 1, 592, '2024-03-25', 8, NULL),
        (28, 1, 17365, '2024-03-25', 6, NULL),
        (29, 1, 1548, '2024-03-27', 7, NULL),
        (30, 1, 11974, '2024-03-29', 6, NULL);

-- 
-- Movie bookmarks
-- 
CREATE TABLE IF NOT EXISTS `movie_bookmarks` (
    `bookmark_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `user_id_fk` int(10) unsigned NOT NULL,
    `movie_id_fk` int(10) unsigned NOT NULL,
    KEY (`bookmark_id`),
    PRIMARY KEY (`user_id_fk`, `movie_id_fk`),
    CONSTRAINT `FK_USER_ID_MOVIE_BOOKMARK` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`),
    CONSTRAINT `FK_MOVIE_ID_BOOKMARK` FOREIGN KEY (`movie_id_fk`) REFERENCES `movies` (`movie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `movie_bookmarks`;
INSERT INTO `movie_bookmarks` (`bookmark_id`, `user_id_fk`, `movie_id_fk`) VALUES
        (1, 1, 262),
        (2, 1, 27274),
        (3, 1, 607),
        (4, 1, 4723),
        (5, 1, 141),
        (6, 1, 1056360),
        (7, 1, 814776),
        (8, 1, 467244),
        (9, 1, 814340),
        (10, 1, 1139829);

-- 
-- Movie lists
-- 
CREATE TABLE IF NOT EXISTS `movie_lists` (
    `list_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `user_id_fk` int(10) unsigned NOT NULL,
    `title` varchar(100) NOT NULL,
    PRIMARY KEY (`list_id`),
    CONSTRAINT `FK_USER_ID_MOVIE_LIST` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `movie_lists`;
INSERT INTO `movie_lists` (`list_id`, `user_id_fk`, `title`) VALUES
        (1, 1, 'Favorites');

-- 
-- Movie list items
-- 
CREATE TABLE IF NOT EXISTS `movie_list_items` (
    `list_id_fk` int(10) unsigned NOT NULL,
    `list_index` int(10) unsigned NOT NULL,
    `movie_id_fk` int(10) unsigned NOT NULL,
    PRIMARY KEY (`list_id_fk`, `movie_id_fk`),
    CONSTRAINT `FK_LIST_ID_MOVIE_LIST_ITEM` FOREIGN KEY (`list_id_fk`) REFERENCES `movie_lists` (`list_id`),
    CONSTRAINT `FK_MOVIE_ID_LIST_ITEM` FOREIGN KEY (`movie_id_fk`) REFERENCES `movies` (`movie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `movie_list_items`;
INSERT INTO `movie_list_items` (`list_id_fk`, `list_index`, `movie_id_fk`) VALUES
        (1, 1, 3175),
        (1, 2, 7345),
        (1, 3, 334),
        (1, 4, 829),
        (1, 5, 8461),
        (1, 6, 503919),
        (1, 7, 11645),
        (1, 8, 12493),
        (1, 9, 1091),
        (1, 10, 655);




---------------------
--      MUSIC      --
---------------------

-- 
-- Albums referenced in other tables
-- 
CREATE TABLE IF NOT EXISTS `albums` (
    `album_id` varchar(50) NOT NULL,
    `album_title` varchar(200) NOT NULL,
    `album_cover` varchar(100) NOT NULL,
    PRIMARY KEY (`album_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `albums`;

-- 
-- Album logs
-- 
CREATE TABLE IF NOT EXISTS `album_log` (
    `log_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `user_id_fk` int(10) unsigned NOT NULL,
    `album_id_fk` varchar(50) NOT NULL,
    `date` varchar(10) NOT NULL,
    `rating` int(10) unsigned,
    `review` varchar(500),
    PRIMARY KEY (`log_id`),
    CONSTRAINT `FK_USER_ID_ALBUM_LOG` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`),
    CONSTRAINT `FK_ALBUM_ID_LOG` FOREIGN KEY (`album_id_fk`) REFERENCES `albums` (`album_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `album_log`;

-- 
-- Album bookmarks
-- 
CREATE TABLE IF NOT EXISTS `album_bookmarks` (
    `bookmark_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `user_id_fk` int(10) unsigned NOT NULL,
    `album_id_fk` varchar(50) NOT NULL,
    KEY (`bookmark_id`),
    PRIMARY KEY (`user_id_fk`, `album_id_fk`),
    CONSTRAINT `FK_USER_ID_ALBUM_BOOKMARK` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`),
    CONSTRAINT `FK_ALBUM_ID_BOOKMARK` FOREIGN KEY (`album_id_fk`) REFERENCES `albums` (`album_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `album_bookmarks`;

-- 
-- Album lists
-- 
CREATE TABLE IF NOT EXISTS `album_lists` (
    `list_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `user_id_fk` int(10) unsigned NOT NULL,
    `title` varchar(100) NOT NULL,
    PRIMARY KEY (`list_id`),
    CONSTRAINT `FK_USER_ID_ALBUM_LIST` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `album_lists`;

-- 
-- Album list items
-- 
CREATE TABLE IF NOT EXISTS `album_list_items` (
    `list_id_fk` int(10) unsigned NOT NULL,
    `list_index` int(10) unsigned NOT NULL,
    `album_id_fk` varchar(50)  NOT NULL,
    PRIMARY KEY (`list_id_fk`, `album_id_fk`),
    CONSTRAINT `FK_LIST_ID_ALBUM_LIST_ITEM` FOREIGN KEY (`list_id_fk`) REFERENCES `album_lists` (`list_id`),
    CONSTRAINT `FK_ALBUM_ID_LIST_ITEM` FOREIGN KEY (`album_id_fk`) REFERENCES `albums` (`album_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `album_list_items`;




---------------------
--      GAMES      --
---------------------

-- 
-- Games referenced in other tables
-- 
CREATE TABLE IF NOT EXISTS `games` (
    `game_id` int(10) unsigned NOT NULL,
    `game_title` varchar(200) NOT NULL,
    `game_cover` varchar(100) NOT NULL,
    PRIMARY KEY (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `games`;

-- 
-- Game logs
-- 
CREATE TABLE IF NOT EXISTS `game_log` (
    `log_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `user_id_fk` int(10) unsigned NOT NULL,
    `game_id_fk` int(10) unsigned NOT NULL,
    `date_start` varchar(10) NOT NULL,
    `date_end` varchar(10) NOT NULL,
    `rating` int(10) unsigned,
    `review` varchar(500),
    PRIMARY KEY (`log_id`),
    CONSTRAINT `FK_USER_ID_GAME_LOG` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`),
    CONSTRAINT `FK_GAME_ID_LOG` FOREIGN KEY (`game_id_fk`) REFERENCES `games` (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `game_log`;

-- 
-- Game bookmarks
-- 
CREATE TABLE IF NOT EXISTS `game_bookmarks` (
    `bookmark_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `user_id_fk` int(10) unsigned NOT NULL,
    `game_id_fk` int(10) unsigned NOT NULL,
    KEY (`bookmark_id`),
    PRIMARY KEY (`user_id_fk`, `game_id_fk`),
    CONSTRAINT `FK_USER_ID_GAME_BOOKMARK` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`),
    CONSTRAINT `FK_GAME_ID_BOOKMARK` FOREIGN KEY (`game_id_fk`) REFERENCES `games` (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `game_bookmarks`;

-- 
-- Album lists
-- 
CREATE TABLE IF NOT EXISTS `game_lists` (
    `list_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `user_id_fk` int(10) unsigned NOT NULL,
    `title` varchar(100) NOT NULL,
    PRIMARY KEY (`list_id`),
    CONSTRAINT `FK_USER_ID_GAME_LIST` FOREIGN KEY (`user_id_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `game_lists`;

-- 
-- Album list items
-- 
CREATE TABLE IF NOT EXISTS `game_list_items` (
    `list_id_fk` int(10) unsigned NOT NULL,
    `list_index` int(10) unsigned NOT NULL,
    `game_id_fk` int(10) unsigned NOT NULL,
    PRIMARY KEY (`list_id_fk`, `game_id_fk`),
    CONSTRAINT `FK_LIST_ID_GAME_LIST_ITEM` FOREIGN KEY (`list_id_fk`) REFERENCES `game_lists` (`list_id`),
    CONSTRAINT `FK_GAME_ID_LIST_ITEM` FOREIGN KEY (`game_id_fk`) REFERENCES `games` (`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `game_list_items`;