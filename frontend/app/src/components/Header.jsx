import { useRef } from "react";
import {  useNavigate } from "react-router-dom";

/**
 * Back button for the header, currently returns to '/'
 * @returns Back button element for the header
 */
export function HeaderBackButton() {
    // Get navigation hook
    const navigate = useNavigate();

    return (
        <button className="back-button" onClick={() => {navigate(-1) || navigate('/')}}>
            <img src="/assets/back.svg" alt="back" className="icon" draggable="false" />
        </button>
    );
}

/**
 * Search button/field with listeners and animations for the header
 * @param {String} type Defines the type of search (movie, music, game)
 * @returns Search button/field for the header
 */
export function HeaderSearchBar({ type }) {
    // Keep references to the search field and button for event listeners
    const searchField = useRef(null);
    const searchButton = useRef(null);

    // Open the search field when the search button is clicked
    function searchButtonClick() {
        searchField.current.style.visibility = 'visible'; // Make the search field visible
        searchField.current.style.width = '200px'; // Width to make the search field
        searchField.current.focus(); // Put the cursor in the search field
    }

    // Collapse the search field if it is empty and unfocused
    function searchFieldBlur() {
        if (searchField.current.value === '') {
            searchField.current.style.width = '30px'; // Collapse the search field width
            setTimeout(() => {
                searchField.current.style.visibility = 'hidden';
            }, 250); // After waiting for the collapse animation, hide the search field
        }
    }

    // Validate and make the search when enter is pressed on the search field
    const navigate = useNavigate(); // Get navigation hook
    function searchFieldSubmit(k) {
        if (k.key === 'Enter') {
            // Verify the search query is at least one non-whitespace character
            let regex = /[\s\S]*\S[\s\S]*/gm;
            if (regex.test(searchField.current.value)) {
                if (type === 'movie') {
                    navigate('/movie/search/' + encodeURIComponent(searchField.current.value));
                } else if (type === 'music') {
                    navigate('/music/search/' + encodeURIComponent(searchField.current.value));
                } else if (type === 'game') {
                    navigate('/game/search/' + encodeURIComponent(searchField.current.value));
                }
            }
        }
    }

    return (
        <>
            <input type="search" name="search" placeholder="Search" className="search-field" ref={searchField} onBlur={searchFieldBlur} onKeyDown={searchFieldSubmit} />
            <button className="search-button" ref={searchButton} onClick={searchButtonClick}>
                <img src="/assets/search.svg" alt="search" className="icon" draggable="false" />
            </button>
        </>
    );
}

/**
 * Button to open the edit modal
 * @param {Function} setDisplayEditModal Function to display the edit modal
 */
export function HeaderEditButton({ setDisplayEditModal }) {
    return(
        <button className="edit-button" onClick={() => {setDisplayEditModal(true)}}>
            <img src="/assets/pencil.svg" alt="back" className="icon" draggable="false" />
        </button>
    );
}