/** React imports */
import { useState, useEffect } from 'react';

/**
 * List of logs, with an edit button to display the edit modal
 */
export default function MediaLog({ type, userData, setActiveLog, setDisplayLogModal }) {
    const [logs, setLogs] = useState(null); // Keep the list of logs

    // Get the list of logs from the user data object
    useEffect(() => {
        userData && setLogs(userData.logs);
    }, [userData]);

    /**
     * Set the log being worked on in the modal and reveal it
     * @param i Index of the log to edit
     */
    function editLog(i) {
        setActiveLog(logs[i]);
        setDisplayLogModal(true);
    }

    /**
     * Formats a YYYY-MM-DD date into Mon DD, YYYY
     * @param {String} date Date string to format
     * @returns Formatted date string
     */
    function formatDate(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateArr = date.split('-');
        return months[parseInt(dateArr[1]) - 1] + ' ' + dateArr[2].replace(/^[0]/g, '') + ', ' + dateArr[0];
    }

    return (
        <div id="logs">
            {logs && logs.map((log, i) => (
                <div key={i} className="item">
                    <div className="wrapper">
                        {type === 'game' &&
                        <>
                            <span className="date">{formatDate(log.date_start)}</span>
                            <span className="date">{formatDate(log.date_end)}</span>
                        </>}

                        {(type === 'movie' || type === 'music') &&
                        <>
                            <span className="date">{formatDate(log.date)}</span>
                        </>}
                        
                        {log.rating && <span className="rating">{log.rating}/10</span>}
                        <button className="button" onClick={() => editLog(i)}>
                            <img src="/assets/pencil.svg" alt="edit log" className="icon" />
                        </button>
                    </div>
                    {log.review && 
                        <>
                            <span className="spacer"></span>
                            <span className="review">{log.review}</span>
                        </>
                    }
                </div>
            ))}
        </div>
    );
}