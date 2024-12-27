/** React imports */
import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

/** Import components */
import { HeaderBackButton, HeaderSearchBar } from '../Header';

/**
 * Header for the search page, includes a back button and search bar
 */
function SearchHeader({ mediaType }) {
    return (
        <header>
            <div id="header-wrapper">
                <HeaderBackButton />
                <HeaderSearchBar type={mediaType} />
            </div>
        </header>
    );
}

/**
 * Creates a body of search result elements given the returned search
 * result array.
 */
function SearchBody({ mediaType, api, posterPrepend, query, results }) {
    // Inform the user if there were no results found and also what query is being evaluated
    function ResultsHeading() {
        if (results.length === 0) {
            return (
                <h2 id="heading">No results found for "{query}"</h2>
            );
        } else {
            return (
                <h2 id="heading">Showing results for "{query}"</h2>
            );
        }
    }

    return (
        <main id="searchpage">
            <div id="searchpage-wrapper">
                <ResultsHeading />
                <div id="results">
                    {results && results.map((item, i) => (
                        <SearchResult key={ i } rawItem={ item } api={ api } mediaType={ mediaType } posterPrepend={ posterPrepend } />
                    ))}
                </div>
            </div>
        </main>
    );
}

/**
 * Creates a single search result
 */
function SearchResult({ api, mediaType, posterPrepend, rawItem }) {
    const [item, setItem] = useState(rawItem); // Item loaded in the search result
    const [loaded, setLoaded] = useState(false); // Flag to track whether the poster image is loaded
    const posterRef = useRef(null); // Reference to the poster element

    // Call to the API to get the standard object from the 
    // raw API object
    useEffect(() => {
        api.toStandardObject(rawItem).then(response => {
            setItem(response);
        });
    }, [rawItem]);

    // Set the border radius of the poster, triggered when the poster is loaded
    useEffect(() => {
        let poster = posterRef.current;
        if (poster) {
            let radius = window.getComputedStyle(document.documentElement).getPropertyValue('--border-radius');
            let ratio = radius / (poster.clientHeight + poster.clientWidth);
            poster.style.borderRadius = (ratio * poster.clientHeight) + '% /' + (ratio * poster.clientWidth) + '%';
        }
    }, [loaded]);

    // Get the verb for the created-by line
    function getVerb() {
        if (mediaType === 'movie') {
            return 'directed ';
        } else if (mediaType === 'music') {
            return '';
        } else if (mediaType === 'game') {
            return 'developed ';
        }
    }

    return (
        <>{item && item.poster_path && item.id &&
        <Link to={'/' + mediaType + '/' + item.id} id={item.id} className="item">
            <img 
                src={posterPrepend + item.poster_path} 
                alt={item.title}
                className="poster"
                ref={posterRef}
                onLoad={() => {if (!loaded) { setLoaded(true) }}}
            />
            <div className="details">
                <span className="title">{item.title}</span>
                {item.year && <span className="year">{' ' + item.year + ', '}</span>}
                <span className="created-by">{getVerb()}by </span>
                <span className="creator">{item.creators}</span>
                <span className="summary">{item.summary}</span>
            </div>
            <span className="overlay"></span>
        </Link>
        }</>
    );
}

/**
 * Takes in a query as a URL parameter and renders the given search results
 */
export default function Search({ mediaType, api, posterPrepend }) {
    const params = useParams();
    const [results, setResults] = useState(null);

    let query = params.query;

    // Get the search results
    useEffect(() => {
        api.getSearch(query).then(response => {
            setResults(response);
        });
      }, [query]);

    return (
        <>
            <SearchHeader mediaType={ mediaType } />
            {results && <SearchBody mediaType={ mediaType } api={ api } posterPrepend={ posterPrepend } query={ query } results={ results } />}
        </>
    );
}