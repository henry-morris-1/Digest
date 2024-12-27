/** React imports */
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";

/** Import components */
import { HeaderSearchBar } from '../Header';
import UserHome from './UserHome';
import MediaHome from './MediaHome';

/** Global user context */
import { UserContext } from '../../App';

/** API controllers */
import movieAPI from '../../api/movieAPI';
import musicAPI from '../../api/musicAPI';
import gameAPI from '../../api/gameAPI';
import userAPI from '../../api/userAPI';


/**
 * Header for the home page, includes a search button
 * @param {Number} medium Medium selected to search for
 */
function HomeHeader({ medium }) {
    return (
        <header>
            <div id="header-wrapper">
                <img src="assets/logo.svg" alt="digest" className="logo left" />
                {medium === 0 && <HeaderSearchBar type={'movie'} />}
                {medium === 1 && <HeaderSearchBar type={'music'} />}
                {medium === 2 && <HeaderSearchBar type={'game'} />}
            </div>
        </header>
    );
}

/**
 * Body of the home page, currently comprised of carousels
 * of recently watched and watchlisted movies
 * @param {Object} user Current user context
 * @param {Function} setUser Function to set the current user context
 * @param {Number} medium Medium selected to display
 * @param {Function} setMedium Function to set which of movies, music, or games is displayed
 */
function HomeBody({ user, setUser, medium, setMedium }) {
    return (
        <main id="homepage">
            <div id="homepage-wrapper">
                <MediaButtons medium={ medium } setMedium={ setMedium } />

                <div className={medium === 0 ? "show section-wrapper" : "hide section-wrapper"}>
                    <MediaHome mediaType={ 'movie' } api={ movieAPI } posterPrepend={ 'https://image.tmdb.org/t/p/w780' } />
                </div>

                <div className={medium === 1 ? "show section-wrapper" : "hide section-wrapper"}>
                    <MediaHome mediaType={ 'music' } api={ musicAPI } posterPrepend={ '' } />
                </div>

                <div className={medium === 2 ? "show section-wrapper" : "hide section-wrapper"}>
                    <MediaHome mediaType={ 'game' } api={ gameAPI } posterPrepend={ '' } />
                </div>

                <div className={medium === 3 ? "show section-wrapper" : "hide section-wrapper"}>
                    <UserHome user={ user } setUser={ setUser } />
                </div>
            </div>
        </main>
    );
}

/**
 * Buttons to switch the view between movies, music, and games
 * @param {Number} medium Medium selected
 * @param {Function} setMedium Function to set the medium state value
 */
function MediaButtons({ medium, setMedium }) {
    const movieButton = useRef(null);
    const musicButton = useRef(null); // Keep references to each of the buttons
    const gameButton = useRef(null);
    const userButton = useRef(null);
    const arr = [movieButton, musicButton, gameButton, userButton];

    /** 
     * Sets classes to select the button for the current medium and sets
     * the medium state value.
     * @param {Number} i Index of the medium to set
     */
    function setClick (i) {
        if (medium === i) {
            return;
        }
        arr[medium].current.classList.remove('selected');
        arr[i].current.classList.add('selected');
        setMedium(i);
    }

    return (
        <div className="media-button-wrapper">
            <button className="media-button movies selected" ref={movieButton} onClick={() => { setClick(0) }}>
                <img src="assets/movies.svg" alt="movies" />
                <span>Movies</span>
            </button>
            <button className="media-button music" ref={musicButton} onClick={() => { setClick(1) }}>
                <img src="assets/music.svg" alt="music" />
                <span>Music</span>
            </button>
            <button className="media-button games" ref={gameButton} onClick={() => { setClick(2) }}>
                <img src="assets/games.svg" alt="games" />
                <span>Games</span>
            </button>
            <button className="media-button user" ref={userButton} onClick={() => { setClick(3) }}>
                <img src="assets/user.svg" alt="user" />
                <span>User</span>
            </button>
        </div>
    );
}

/**
 * Renders a home page
 */
export default function Home() {
    const navigate = useNavigate(); // Get navigation hook
    const { user, setUser } = useContext(UserContext); // Get the global user context
    const [medium, setMedium] = useState(0); // Keep track of which medium to show

    // Attempt to get the current user, and redirect to the login page if not autheticated
    useEffect(() => {
        userAPI.getCurrentUser()
            .then(res => {
                setUser(res.user);
            })
            .catch(err => {
                navigate('/login');
            });
    }, []);

    return (
        <>
            <HomeHeader medium={ medium } />
            <HomeBody user={ user } setUser={ setUser } medium={ medium } setMedium={ setMedium } />
        </>
    );
}