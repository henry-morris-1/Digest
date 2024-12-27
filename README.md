# Digest
## Group J: Final


### Features

- Searching for movies, albums, and video games
- Logging movies, albums, and video games
- Bookmarking movies, albums, and video games
- Creating lists of movies, albums, and video games
- Installable from the browser


### Authentication

- Implemented secure user authentication using JWTs
- Authentication includes endpoints:
   - /api/signup Create a new user with username and password
   - /api/login Authenticate as a existing user with username and password
   - /api/logout Log out the user
   - /api/currentUser Get current user associated with token

### Pages

- Login page to sign in or create a new account
- Home page displaying logs, bookmarks, and lists for each media type
   - Each media type has its own tab
- Page showing search results for movies, albums, and games
   - Accessed by entering a query in the search bar
   - Each media type has its own search function accessed by selecting the media type on the homepage, then searching
- List pages
   - Accessed from the homepage
   - Show all items in a given list and allows editing user-made lists
- Pages for each movie, album, and game
   - Accessed by selecting an item from the home page, list page, or search page
   - Allows for logging, bookmarking, and adding to lists
   
   
### Caching Strategy and Offline Capabilities

- Registration of Service Worker that caches and provides offline functionality:
   - Uses Cache API to cache predefined resources / assets
   - Uses Cache API to cache GET requests
   - Uses a network-first approach when caching and returning cache results
   - Returns an offline HTML file when network failure and cache miss.

### Schema ER diagram

- ❌!❌!❌!❌ TODO ❌!❌!❌!❌


### API Endpoint Table
Method   | Route                               | Description
-------- | ----------------------------------- | ---------
`GET`    | `/users/movies/log`                 | Fetches a user's movie logs
`POST`   | `/users/movies/log`                 | Adds a new movie log to a user
`PUT`    | `/users/movies/log/[movieId]`       | Updates a user's existing movie log
`DELETE` | `/users/movies/log/[movieId]`       | Deletes a user's existing movie log
`GET`    | `/users/movies/bookmarks`           | Fetches a user's movie bookmarks
`POST`   | `/users/movies/bookmarks`           | Adds a new movie bookmark to a user
`DELETE` | `/users/movies/bookmarks/[movieId]` | Deletes a user's existing movie bookmark
`GET`    | `/users/movies/lists`               | Fetches a user's movie lists
`POST`   | `/users/movies/lists`               | Adds a new movie list for a user
`POST`   | `/users/movies/lists/[listId]`      | Adds a new movie to an existing list
`PUT`    | `/users/movies/lists/[listId]`      | Updates a user's existing list
`DELETE` | `/users/movies/lists/[listId]`      | Deletes an existing list

Ditto for /users/music/... and /users/games/...


### Team Member Contributions

#### Henry Morris

* Implemented video game API integration
   * Connected to Giantbomb API and added schema for games
* Overhauled pages to generalize for all media types (instead of having pages for each type of media)
   * Refactored pages and routes on the frontend to work with a general object containting title, poster, etc.
   * Added API controller functions to convert responses from connected APIs (TMDb, Musicbrainz, Last.fm, Giantbomb) to create these objects
* Added user statistics to the user tab on the homepage
   * Shows and links the number of logs and bookmarks for each media type

#### Julian Madrigal

* 

#### Kennedy Tate

* 

#### Milestone Effort Contribution

Milestone   | Henry Morris | Julian Madrigal | Kennedy Tate
----------- | ------------ | --------------- | ------------
Milestone 1 | 65%          | 30%             | 5%
Milestone 2 | 92.5%        | 7.5%            | 0%
Final       | 70%          | 30%             | 0%
----------- | ------------ | --------------- | ------------
TOTAL:      | 227.5%       | 67.5%           | 5%
