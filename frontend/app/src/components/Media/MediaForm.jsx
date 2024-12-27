/** React imports */
import { useState, useEffect, useRef } from 'react';


/**
 * Buttons to log, bookmark, or add to a list
 */
export function ActionButtons({ api, item, userData, setUserData, setDisplayLogModal, setActiveLog, setDisplayListModal }) {
    /**
     * Sets the active log to null to clear the modal and reveals it
     */
    function logAction() {
        setActiveLog(null);
        setDisplayLogModal(true);
    }

    /**
     * Makes a POST or DELETE request to update the bookmark
     * status of the item
     */
    function bookmarkAction() {
        // Send a POST request if it isn't bookmarked, DELETE if it is
        if (userData.bookmarked) {
            api.deleteBookmark(item.id);
            setUserData(prevUserData => ({...prevUserData, bookmarked: false}));

        } else {
            api.createBookmark({
                id: item.id,
                title: item.title,
                poster_path: item.poster_path
            });
            setUserData(prevUserData => ({...prevUserData, bookmarked: true}));
        }
    }

    return (
        <div id="action-buttons">
            <div className="wrapper">
                <button className={"button log " + (userData.log && "")} onClick={logAction}>
                    <img src="/assets/plus.svg" alt="Log" className="icon" />
                    <span className="label">Log</span>
                </button>

                <button className={"button bookmark " + (userData.bookmarked ? "true" : "false")} onClick={bookmarkAction}>
                    <img src="/assets/bookmark.svg" alt="Bookmark" className="icon" />
                    <span className="label">
                        {userData.bookmarked ?
                                <>Remove Bookmark</>
                            :
                                <>Bookmark</>
                        }
                    </span>
                </button>

                <button className="button list" onClick={() => setDisplayListModal(true)}>
                    <img src="/assets/list.svg" alt="Add to a List" className="icon" />
                    <span className="label">Add to a List</span>
                </button>
            </div>
        </div>
    );
}

/**
 * Buttons representing user input for the rating in a log.
 */
function RatingButton({ fill, onClick }) {
    return (
        <button className="icon" onClick={onClick}>
            { fill ? <img src="/assets/circle_closed.svg" alt="X" /> :  <img src="/assets/circle_open.svg" alt="O" /> }
        </button>
    );
}

/**
 * Modal for creating, editing, or deleting logs.
 */
export function LogModal({ type, api, log, item, setUserData, setDisplayLogModal }) {
    // Use the rating, data, and review define the state. Load them from the log if it exists.
    const [rating, setRating] = useState(log ? log.rating : 0);
    const [date, setDate] = useState(log && log.date);
    const [dateStart, setDateStart] = useState(log && log.date_start);
    const [dateEnd, setDateEnd] = useState(log && log.date_end);
    const [review, setReview] = useState(log ? log.review : '');

    // Keep a reference to the modal element
    const modal = useRef();

    /**
     * Creates a log object from the current state of the form, submits it to the API,
     * and updates the userData state.
     */
    function submitLog() {
        // New log with rating, review, and date
        let newLog = {
            rating: rating,
            review: review
        }

        // Check the type to see whether to use a date or date range
        if (type === 'game') {
            newLog.date_start = dateStart;
            newLog.date_end = dateEnd;
        } else {
            newLog.date = date;
        }

        // If the item has been logged, use PUT. If not, use POST.
        if (log) {
            api.updateLog(log.id, item, newLog).then(res => {
                // Hide the log modal
                setDisplayLogModal(false);

                // Update the user data to include the new log
                api.getLogsById(item.id).then(userLogs => {
                    setUserData(prevUserData => ({...prevUserData, logs: userLogs}));
                });
            }).catch(err => {});
        } else {
            api.createLog(item, newLog).then(res => {
                // Hide the log modal
                setDisplayLogModal(false);

                // Update the user data to include the new log
                api.getLogsById(item.id).then(userLogs => {
                    setUserData(prevUserData => ({...prevUserData, logs: userLogs}));
                });
            }).catch(err => {});
        }
    }

    /**
     * Requests the log be deleted by the API and updates the userData state.
     */
    function deleteLog() {
        // Call to the API to delete the log and update the user data state to have no log
        api.deleteLog(log.id);
        api.getLogsById(item.id).then(userLogs => {
            setUserData(prevUserData => ({...prevUserData, logs: userLogs}));
        });
    }

    // Add listeners for clicking out of the modal
    useEffect(() => {
        const event = document.addEventListener('mousedown', () => {
            setDisplayLogModal(false);
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

    // Get the verb for the modal title
    function getVerb() {
        if (type === 'movie') {
            return 'Watched';
        } else if (type === 'music') {
            return 'Listened to';
        } else {
            return 'Played';
        }
    }

    // Create rating icons and assign them a click listener to set the rating to their corresponding
    // value (1-10)
    const RatingButtons = [];
    for (let i = 1; i <= 10; i++) {
        const fill = i <= rating;
        RatingButtons.push(<RatingButton key={i} fill={fill} onClick={() => setRating(i)} />)
    }

    return (
        <div className="modal-wrapper">
            <div ref={modal} className="modal">
                <label className="title">I {getVerb()} <span>{item.title}</span></label>

                <hr className="divider" />

                {type === 'game' && 
                <>
                    <div className="date">
                        <label>From</label>
                        <input type="date" value={dateStart || ''} onChange={(event) => setDateStart(event.target.value)} max={dateEnd}></input>
                    </div>
                    <div className="date">
                        <label>To</label>
                        <input type="date" value={dateEnd || ''} onChange={(event) => setDateEnd(event.target.value)} min={dateStart}></input>
                    </div>
                </>}
                
                {(type === 'movie' || type === 'music') && 
                <>
                    <div className="date">
                        <label>Date</label>
                        <input type="date" value={date || ''} onChange={(event) => setDate(event.target.value)}></input>
                    </div>
                </>}

                <div className="rating">
                    { RatingButtons }
                </div>

                <div className="review">
                    <textarea
                        maxLength={500} 
                        placeholder="Add review..." 
                        value={review || ''} 
                        onChange={(event) => setReview(event.target.value)} 
                        onInput={(e) => {
                            e.target.style.height = 0;
                            e.target.style.height = (e.target.scrollHeight - 17) + "px";
                        }}
                        onFocus={(e) => {
                            e.target.style.height = 0;
                            e.target.style.height = (e.target.scrollHeight - 17) + "px";
                        }}
                    ></textarea>
                </div>

                <div className="actions">
                    <button className="submit" onClick={submitLog}>Submit</button>
                    {log && <button className="delete" onClick={() => {setDisplayLogModal(false); deleteLog();}}>Delete</button>}
                    <button className="cancel" onClick={() => {setDisplayLogModal(false)}}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

/**
 * Modal for creating or adding onto lists.
 */
export function ListModal({ api, item, setDisplayListModal }) {
    const [lists, setLists] = useState(null); // Keep the user's existing lists
    const [selectedList, setSelectedList] = useState(null); // Keep track of which list has been selected
    const [newListTitle, setNewListTitle] = useState(''); // Keep track of the new list title given
    const modal = useRef(); // Keep a reference to the modal element
    let regex = /\S+/; // Keep a regex for valid list titles

    /**
     * Puts the item into an existing/new list based on the user's input
     */
    function submitList() {
        // If there was an existing list selected, use PUT
        if (selectedList) {
            api.addToList(selectedList, {
                id: item.id,
                title: item.title,
                poster_path: item.poster_path
            }).then(res => {
                setDisplayListModal(false);
            }).catch(err => {});
            
        } else if (newListTitle && regex.test(newListTitle)) {
            // Otherwise, POST a new list wit the given title, as long as it exists and isn't
            // empty
            api.createList(newListTitle, {
                    id: item.id,
                    title: item.title,
                    poster_path: item.poster_path
            }).then(res => {
                setDisplayListModal(false);
            }).catch(err => {});
        }
    }

    // Get the user's lists
    useEffect(() => {
        api.getLists().then(userLists => {
            setLists(userLists);
        });
    }, []);

    // Add listeners for clicking out of the modal
    useEffect(() => {
        const event = document.addEventListener('mousedown', () => {
            setDisplayListModal(false);
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

    return (
        <div className="modal-wrapper">
            <div ref={modal} className="modal">
                <label className="title">Add <span>{item.title}</span> to a List</label>

                <hr className="divider" />

                <div className="select">
                    <label>Add to an existing list</label>
                    <select onChange={({ target: { value } }) => setSelectedList(value)}>
                        <option value=""></option>
                        {lists && lists.map((list, i) => (
                            <option key={i} value={list.id}>{list.title}</option>
                        ))}
                    </select>
                </div>

                {!selectedList && <>
                    <div className="or">
                        <span className="divider"></span>
                        <span>or</span>
                        <span className="divider"></span>
                    </div>

                    <div className="text-input">
                        <label>Create a new list</label>
                        <input type="text" maxLength={75} onChange={(e) => setNewListTitle(e.target.value)} />
                    </div>
                </>}

                <div className="actions">
                    <button className="submit" onClick={submitList}>Submit</button>
                    <button className="cancel" onClick={() => {setDisplayListModal(false)}}>Cancel</button>
                </div>
            </div>
        </div>
    );
}