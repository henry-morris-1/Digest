import { useState, useEffect, useRef } from 'react';

/**
 * Displays an item's poster, title, and other details.
 */
export default function MediaDetails({ type, item, posterPrepend }) {
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

    /**
     * Gets the correct verb for the type in the creator line
     */
    function getVerb () {
        if (type === 'movie') {
            return 'Directed ';
        } else if (type === 'game') {
            return 'Developed ';
        } else {
            return '';
        }
    }

    return (
        <div id="details">
            <img 
                src={posterPrepend + item.poster_path}
                alt={item.title}
                id="poster"
                ref={posterRef}
                onLoad={() => {if (!loaded) { setLoaded(true) }}}
            />
            <span id="title">{item.title}</span>
            <span id="creator-wrapper">{getVerb()}By<br /><span id="creator">{item.creators}</span></span>
            <div id="year-wrapper">
                <span id="year">{item.year}</span>
                {item.runtime && <>
                    <span className="separator">&bull;</span>
                    <span id="runtime">{item.runtime + ' mins'}</span>
                </>}
            </div>
            <p id="summary">{item.summary}</p>
        </div>
    );
}