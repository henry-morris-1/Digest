import React, { createContext, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

/** Import API controllers */
import movieAPI from './api/movieAPI';
import musicAPI from './api/musicAPI';
import gameAPI from './api/gameAPI';

/** Import page components */
import ProtectedPage from "./components/ProtectedPage";
import Home from "./components/Home/Home";
import Login from "./components/Login";
import Media from "./components/Media/Media";
import List from "./components/List/List";
import Search from "./components/Search/Search";

/** Import css style */
import "./App.css";

/** Export the current user context */
export const UserContext = createContext(null);

/** Site for TMDb posters */
const TMDB_POSTER_PREFIX = 'https://image.tmdb.org/t/p/w780';
 
/**
 * Route pages
 */
const App = () => {
    const [user, setUser] = useState(null); // Global user state

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
            <Router>
                    <Routes>
                        <Route exact path="/login" element={<Login />}></Route>
                        <Route exact path="/" element={<ProtectedPage><Home /></ProtectedPage>}></Route>

                        <Route exact path="/movie/:id" element={<ProtectedPage><Media type={ 'movie' } api={ movieAPI } posterPrepend={ TMDB_POSTER_PREFIX } /></ProtectedPage>}></Route>
                        <Route exact path="/game/:id" element={<ProtectedPage><Media type={ 'game' } api={ gameAPI } posterPrepend={ '' } /></ProtectedPage>}></Route>
                        <Route exact path="/music/:id" element={<ProtectedPage><Media type={ 'music' } api={ musicAPI } posterPrepend={ '' } /></ProtectedPage>}></Route>

                        <Route exact path="/movie/list/:id" element={<ProtectedPage><List mediaType={ 'movie' } api={ movieAPI } posterPrepend={ TMDB_POSTER_PREFIX } /></ProtectedPage>}></Route>
                        <Route exact path="/game/list/:id" element={<ProtectedPage><List mediaType={ 'game' } api={ gameAPI } posterPrepend={ '' } /></ProtectedPage>}></Route>
                        <Route exact path="/music/list/:id" element={<ProtectedPage><List mediaType={ 'music' } api={ musicAPI } posterPrepend={ '' } /></ProtectedPage>}></Route>

                        <Route exact path="/movie/search/:query" element={<ProtectedPage><Search mediaType={ 'movie' } api={ movieAPI } posterPrepend={ TMDB_POSTER_PREFIX } /></ProtectedPage>}></Route>
                        <Route exact path="/game/search/:query" element={<ProtectedPage><Search mediaType={ 'game' } api={ gameAPI } posterPrepend={ '' } /></ProtectedPage>}></Route>
                        <Route exact path="/music/search/:query" element={<ProtectedPage><Search mediaType={ 'music' } api={ musicAPI } posterPrepend={ '' } /></ProtectedPage>}></Route>
                        
                        <Route path="*" element={<Navigate to="/" replace />}/>
                    </Routes>
            </Router>
        </UserContext.Provider>
    );
}
 
export default App;