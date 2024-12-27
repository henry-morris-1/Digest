/** React imports */
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';

/** Import components */
import { HeaderBackButton } from '../Header';
import MediaDetails from './MediaDetails';
import { ActionButtons, LogModal, ListModal } from './MediaForm';
import MediaLog from './MediaLog';

/**
 * Header for the page, includes a back button
 */
function MediaHeader() {
    return (
        <header>
            <div id="header-wrapper">
                <HeaderBackButton />
            </div>
        </header>
    );
}

/**
 * Body for the page, includes details, action buttons, previous logs, 
 * and modals for lists/logs
 */
function MediaBody({ type, api, item, posterPrepend }) {
    const [userData, setUserData] = useState({}); // track of whether the movie has been logged or bookmarked by the user
    const [activeLog, setActiveLog] = useState(null); // Current log being updated
    const [displayLogModal, setDisplayLogModal] = useState(false); // Boolean for whether or not to display the log modal
    const [displayListModal, setDisplayListModal] = useState(false); // Boolean for whether or not to display the list modal

    // Get user data which exists for the item
    useEffect(() => {
        // Get any logs for the item
        api.getLogsById(item.id).then(userLogs => {
            setUserData(prevUserData => ({...prevUserData, logs: userLogs}));
        });

        // Check if the item is bookmarked
        api.isBookmarked(item.id).then(res => {
            let bookmarked = res.bookmarked;
            setUserData(prevUserData=> ({...prevUserData, bookmarked}));
        });
    }, []);

    return (
        <main id="mediapage">
            {displayLogModal && <LogModal 
                type={ type }
                api={ api }
                item={ item } 
                log={ activeLog } 
                userData={ userData } 
                setUserData={ setUserData } 
                setDisplayLogModal={ setDisplayLogModal } 
            />}

            {displayListModal && <ListModal 
                api={ api }
                item={ item } 
                setDisplayListModal={ setDisplayListModal } 
            />}

            <div id="mediapage-wrapper">
                <MediaDetails type={ type } item={ item } posterPrepend={ posterPrepend } />

                <ActionButtons 
                    api={ api }
                    item={ item }
                    userData={ userData }
                    setUserData={ setUserData }
                    setDisplayLogModal={ setDisplayLogModal }
                    setActiveLog={ setActiveLog }
                    setDisplayListModal={ setDisplayListModal }
                />

                <MediaLog 
                    type={ type }
                    api={ api }
                    userData={ userData }
                    setUserData={ setUserData }
                    setActiveLog={ setActiveLog }
                    setDisplayLogModal={ setDisplayLogModal }
                />
            </div>
        </main>
    );
}

/**
 * Media page contains details, action buttons, and forms
 */
export default function Media({ type, api, posterPrepend }) {
    const params = useParams();
    const [item, setItem] = useState(null);

    // Get the id from the path
    let id = params.id;

    // Call to the API to get the item to load on the page
    useEffect(() => {
        api.getById(id)
            .then(response => {
                return api.toStandardObject(response);
            })
            .then(response => {
                setItem(response);
            });
    }, [id]);
      

    return (
        <>
            <MediaHeader />
            {item && <MediaBody type={ type } api={ api } item={ item } posterPrepend={ posterPrepend } />}
        </>
    );
}