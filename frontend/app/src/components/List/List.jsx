/** React imports */
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

/** Import components */
import { HeaderBackButton, HeaderEditButton } from '../Header';
import EditListModal from './EditListModal';

/**
 * Header for the list page, includes a back button
 * @param {Boolean} edit Determines whether the list is editable
 */
function ListHeader({ edit, setDisplayEditModal }) {
    return (
        <header>
            <div id="header-wrapper">
                <HeaderBackButton />
                {edit && <HeaderEditButton setDisplayEditModal={ setDisplayEditModal } />}
            </div>
        </header>
    );
}

/**
 * Body for the List page, includes the items in the list
 */
function ListBody({ mediaType, api, posterPrepend, id, title, setTitle, items, setItems, displayEditModal, setDisplayEditModal }) {
    /**
     * Poster element within the carousel
     */
    function ListPoster({ item }) {
        const [loaded, setLoaded] = useState(false); // Flag to track whether the poster image is loaded
        const posterRef = useRef(null); // Reference to the poster element

        // Set the border radius of the poster, triggered when the poster is loaded
        useEffect(() => {
            let poster = posterRef.current;
            if (poster) {
                let radius = window.getComputedStyle(document.documentElement).getPropertyValue('--border-radius');
                let ratio = radius / (poster.clientHeight + poster.clientWidth);
                poster.style.borderRadius = (ratio * poster.clientHeight) + '% /' + (ratio * poster.clientWidth) + '%';
            }
        }, [loaded]);

        return (
            <div className="poster" ref={posterRef}>
                <img
                    src={posterPrepend + item.poster_path} 
                    alt={item.title ?? "poster"}
                    className="image"
                    onLoad={() => {if (!loaded) { setLoaded(true) }}}
                />
                <span className="overlay" title={item.title ?? "poster"}></span>
            </div>
        );
    }

    function getTitleType() {
        if (mediaType === 'movie') {
            return 'movies';
        } else if (mediaType === 'music') {
            return 'albums';
        } else if (mediaType === 'game') {
            return 'games';
        }
    }

    return(
        <main id="listpage">
            {displayEditModal && 
            <EditListModal 
                mediaType={ mediaType }
                api={ api }
                posterPrepend={ posterPrepend }
                id={ id }
                title={ title }
                items={ items }
                setTitle={ setTitle }
                setItems={ setItems }
                setDisplayEditModal={ setDisplayEditModal }
            />}

            {title && items && <div id="listbody">
                <h1>{title}</h1>
                <h2>{items.length + ' ' + getTitleType()}</h2>
                <ol>
                    {items && items.map((item, i) => (
                        <li key={i}>
                            <Link to={'/' + mediaType + '/' + item.id} id={item.id} className="item">
                                <ListPoster item={ item } />
                                <span className="number">{i + 1}</span>
                            </Link>
                        </li>
                    ))}
                </ol>
            </div>}
        </main>
    );
}

/**
 * Fetches a list from the API and renders it
 * @param {String} id List id to load
 */
export default function List({ mediaType, api, posterPrepend }) {
    const params = useParams();
    const [title, setTitle] = useState(null); // List title
    const [items, setItems] = useState(null); // List items
    const [edit, setEdit] = useState(false); // Boolean flag for editable lists
    const [displayEditModal, setDisplayEditModal] = useState(false); // Boolean flag for the edit modal display state

    // Get the id from the path
    let id = params.id;

    function getTitleType() {
        if (mediaType === 'movie') {
            return 'Movies';
        } else if (mediaType === 'music') {
            return 'Albums';
        } else if (mediaType === 'game') {
            return 'Games';
        }
    }

    // Call to the API to get the list
    useEffect(() => {
        let ignore = false;

        if (id === 'log') {
            api.getLogItems().then(response => {
                if (!ignore) {
                    setTitle('Logged ' + getTitleType());
                    setItems(response);
                }
            });

        } else if (id === 'bookmarks') {
            api.getBookmarks().then(response => {
                if (!ignore) {
                    setTitle('Bookmarked ' + getTitleType());
                    setItems(response);
                }
            });

        } else {
            api.getListById(id).then(response => {
                if (!ignore) {
                    setTitle(response.title);
                    if (response.movies) {
                        setItems(response.movies);
                    } else if (response.albums) {
                        setItems(response.albums);
                    } else if (response.games) {
                        setItems(response.games);
                    }
                    setEdit(true);
                }
            });
        }
        return () => {
            ignore = true;
        };
    }, [id]);

    return (
        <>
            <ListHeader edit={ edit } setDisplayEditModal={ setDisplayEditModal } />
            <ListBody 
                mediaType={ mediaType }
                api={ api }
                posterPrepend={ posterPrepend }
                id={ id }
                title={ title } 
                setTitle={ setTitle } 
                items={ items } 
                setItems={ setItems } 
                displayEditModal={ displayEditModal } 
                setDisplayEditModal={ setDisplayEditModal } 
            />
        </>
    );
}