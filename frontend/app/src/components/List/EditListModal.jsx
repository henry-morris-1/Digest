/** React imports */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Editable list of, where items can be re-ordered or deleted
 */
function EditList({ posterPrepend, items, setItems }) {
    /**
     * Moves the shifted item into its new position and organizes the other
     * items around it.
     * @param {Number} from Starting index
     * @param {Number} to Ending index
     */
    function sortItems (from, to) {
        // Don't allow shifting outside of the bounds of the array
        if (to < 0 || to >= items.length) {
            return;
        }

        const itemsClone = [...items];
        if (to >= itemsClone.length) {
            var k = to - itemsClone.length + 1;
            while (k--) {
                itemsClone.push(undefined);
            }
        }
        itemsClone.splice(to, 0, itemsClone.splice(from, 1)[0]);
        setItems(itemsClone);
    }

    /**
     * Deletes an item from the list. Will not delete the final item.
     */
    function deleteItem (i) {
        if (items.length > 1) {
            setItems(items.toSpliced(i, 1));
        }
    }

    /**
     * Poster within the edit list
     */
    function EditListPoster ({ item }) {
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
                alt={item.title} 
                className="poster"
                ref={posterRef}
                onLoad={() => {if (!loaded) { setLoaded(true) }}}
            />
        );
    }

    return (
        <div className="edit-list">
            {items && items.map((item, i) => (
                <div key={i} className="item">
                    <div className="move">
                        <button className="button up"><img src="/assets/up_arrow.svg" alt="^" className="icon" onClick={() => {sortItems(i, i-1)}} /></button>
                        <button className="button down"><img src="/assets/down_arrow.svg" alt="V" className="icon" onClick={() => {sortItems(i, i+1)}} /></button>
                    </div>
                    <div className="details">
                        <EditListPoster item={ item } />
                        <h1 className="title"><span>{i+1} </span>{item.title}</h1>
                    </div>
                    <button className="button delete"><img src="/assets/x.svg" alt="X" className="icon" onClick={() => {deleteItem(i)}} /></button>
                </div>
            ))}
        </div>
    );
}

/**
 * Modal for editing a list
 */
export default function EditListModal({ api, posterPrepend, id, title, items, setTitle, setItems, setDisplayEditModal }) {
    const navigate = useNavigate(); // Use the navagation hook
    const [newListTitle, setNewListTitle] = useState(title); // Keep track of the new list title given
    const [newListItems, setNewListItems] = useState([...items]); // Keep a copy of the list to store editing changes
    const modal = useRef(); // Keep a reference to the modal element
    let regex = /\S+/; // Keep a regex for valid list titles

    // Add listeners for clicking out of the modal
    useEffect(() => {
        const event = document.addEventListener('mousedown', () => {
            setDisplayEditModal(false);
        });
        
        let modalEvent;
        if (modal.current) {
            modalEvent = modal.current.addEventListener('mousedown', (event) => event.stopPropagation());
        }

        return () => {
            document.removeEventListener('mousedown', event);
            modalEvent && modalEvent.removeEventListener('mousedown', modalEvent);
        }
    }, []);

    /**
     * Submits a new version of the list to update it
     */
    function submitList() {
        // Test then new list title against the regex
        if (!regex.test(newListTitle)) {
            return;
        }

        api.updateList(id, newListTitle, newListItems).then(res => {
            setTitle(newListTitle);
            setItems(newListItems);
            setDisplayEditModal(false);
        });
    }

    /**
     * Deletes the list, then sends the user to the previous page
     */
    function deleteList() {
        api.deleteList(id).then(res => {
            setDisplayEditModal(false); 
            navigate(-1);
        });
    }

    return (
        <div className="modal-wrapper">
            <div ref={modal} className="modal">
                <label className="title">Edit <span>{title}</span></label>

                <hr className="divider" />

                <div className="text-input">
                        <label>Change the title</label>
                        <input type="text" maxLength={75} onChange={(e) => setNewListTitle(e.target.value)} value={newListTitle} />
                </div>

                <hr className="divider" />

                <EditList posterPrepend={ posterPrepend } items={ newListItems } setItems={ setNewListItems } />

                <div className="actions">
                    <button className="submit" onClick={submitList}>Submit</button>
                    <button className="delete" onClick={deleteList}>Delete</button>
                    <button className="cancel" onClick={() => {setDisplayEditModal(false)}}>Cancel</button>
                </div>
            </div>
        </div>
    );
}