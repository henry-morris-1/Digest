/** React imports */
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

/** Import the user api client */
import movieAPI from '../../api/movieAPI';
import musicAPI from '../../api/musicAPI';
import gameAPI from '../../api/gameAPI';
import userAPI from '../../api/userAPI';

/**
 * Displays information about the current user
 * @param {Object} user Current user context
 * @param {Function} setUser Function to set the current user context
 */
export default function UserHome({ user, setUser }) {
    const [movieLogs, setMovieLogs] = useState(null);
    const [albumLogs, setAlbumLogs] = useState(null);
    const [gameLogs, setGameLogs] = useState(null);
    const [movieBookmarks, setMovieBookmarks] = useState(null);
    const [albumBookmarks, setAlbumBookmarks] = useState(null);
    const [gameBookmarks, setGameBookmarks] = useState(null);
    const navigate = useNavigate(); // Get navigation hook

    useEffect(() => {
        movieAPI.getLogItems()
        .then(res => {
            setMovieLogs(res);
        });
        musicAPI.getLogItems().then(res => {
            setAlbumLogs(res);
        });
        gameAPI.getLogItems().then(res => {
            setGameLogs(res);
        });
    }, []);

    useEffect(() => {
        movieAPI.getBookmarks()
        .then(res => {
            setMovieBookmarks(res);
        });
        musicAPI.getBookmarks().then(res => {
            setAlbumBookmarks(res);
        });
        gameAPI.getBookmarks().then(res => {
            setGameBookmarks(res);
        });
    }, []);

    // Send a logout request and naviage back to the login page
    function logout () {
        userAPI.logout().then(res => {
            setUser(null);
            navigate('/login');
        });
    }

    return (
        <>
            {user && <div className="user-wrapper">
                <h1 className="heading">Hello, {user.username}</h1>

                <button className="button" onClick={logout}>Log out <img src="/assets/logout.svg" alt="logout" className="icon" /></button>

                <h2 className="subheading">
                    You've logged 
                    {movieLogs && <><> </><a href="/movie/list/log">{movieLogs.length} movies,</a></>}
                    {albumLogs && <><> </><a href="/music/list/log">{albumLogs.length} albums,</a></>}
                    {gameLogs && <><> and </><a href="/game/list/log">{gameLogs.length} games</a></>}
                </h2>
                <h2 className="subheading">
                    You've bookmarked 
                    {movieBookmarks && <><> </><a href="/movie/list/log">{movieBookmarks.length} movies,</a></>}
                    {albumBookmarks && <><> </><a href="/music/list/log">{albumBookmarks.length} albums,</a></>}
                    {gameBookmarks && <><> and </><a href="/game/list/log">{gameBookmarks.length} games</a></>}
                </h2>
            </div>}
        </>
    );
}