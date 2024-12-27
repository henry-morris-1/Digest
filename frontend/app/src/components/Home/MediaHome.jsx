/** React imports */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/**
 * Creates Carousel elements with a displayed title, fetches posters
 * based on the given type. Displays the first 10 of each list.
 * @param {String} title Title of the Carousel, to be loaded on the page
 * @param {String} type Type of Carousel, determinig what data is fetched
 */
function Carousel({ api, mediaType, posterPrepend, title, type }) {
    // Get the content in the carousel
    const [data, setData] = useState(null);
    useEffect(() => {
        if (type === 'log') {
            api.getLogItems().then(response => {
                setData(response);
            });

        } else if (type === 'bookmarks') {
            api.getBookmarks().then(response => {
                setData(response);
            });
        }
    }, [type]);

    /**
     * Poster element within the carousel
     */
    function CarouselPoster({ item }) {
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
            <Link to={'/' + mediaType + '/' + item.id} id={item.id} className="poster" ref={posterRef}>
                <img
                    src={posterPrepend + item.poster_path} 
                    alt={item.title ?? "poster"}
                    className="image"
                    onLoad={() => {if (!loaded) { setLoaded(true) }}}
                />
                <span className="overlay" title={item.title ?? "poster"}></span>
            </Link>
        );
    }

    return (
        <section className="section">
            <div className="section-title">
                <h2>{title}</h2>
                {data && data.length > 10 && <button><Link to={'/' + mediaType + '/list/' + type}>MORE &rarr;</Link></button>}
            </div>
            <div className="carousel">
                {data && data.slice(0, 10).map((item, i) => (
                    <CarouselPoster item={ item } key={ i } />
                ))}
            </div>
        </section>
    );
}

/**
 * Creates List elements with a displayed title. Fetches all user lists and
 * renders them with their title, size, and a preview of included items.
 * @param {String} title Title of the list, to be loaded on the page
 */
function List({ api, mediaType, posterPrepend, title }) {
    // Get the data for the lists
    const [data, setData] = useState(null);
    useEffect(() => {
        api.getLists().then(response => {
            setData(response);
        });
    }, []);

    /**
     * Poster element within the list preview
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
            <img
                src={posterPrepend + item.poster_path}
                alt={item.title ?? "poster"}
                title={item.title ?? "poster"}
                className="image"
                ref={posterRef}
                onLoad={() => {if (!loaded) { setLoaded(true) }}}
            />
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

    return (
        <section className="section">
            <div className="section-title">
                <h2>{title}</h2>
            </div>
            <div className="list">
                {data && data.map((list, i) => (
                    <Link to={'/' + mediaType + '/list/' + list.id} key={i} id={list.id} className="item">
                        <div className="preview">
                            {list[getTitleType()] && list[getTitleType()].slice(0, 5).map((item, j) => (
                                <ListPoster item={ item } key={ j } />
                            ))}
                        </div>
                        <div className="details">
                            <span className="title">{list.title}</span>
                            <span className="size">{list[getTitleType()].length + ' ' + getTitleType()}</span>
                        </div>
                        <span className="overlay"></span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

/**
 * Creates a homepage tab with log, bookmarks, and lists for a specific medium
 */
export default function MediaHome({ mediaType, api, posterPrepend }) {
    return (
        <>
            <Carousel api={ api } mediaType={  mediaType } posterPrepend={ posterPrepend } title={ 'RECENTLY LOGGED' } type={ 'log' } />
            <Carousel api={ api } mediaType={ mediaType } posterPrepend={ posterPrepend } title={ 'BOOKMARKED' } type={ 'bookmarks' } />
            <List api={ api } mediaType={ mediaType } posterPrepend={ posterPrepend } title={ 'LISTS' } />
        </>
    );
}