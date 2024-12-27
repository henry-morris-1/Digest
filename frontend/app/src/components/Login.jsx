/** React imports */
import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

/** Global user context */
import { UserContext } from '../App';

/** Import the user api client */
import api from '../api/userAPI';

/**
 * Login page, contains a modal to login or create a new user
 */
export default function Login() {
    const { user, setUser } = useContext(UserContext); // Global user context
    const [existing, setExisting] = useState(false); // Track whether to log in or create an account
    const [username, setUsername] = useState(''); // Current username
    const [password, setPassword] = useState(''); // Current password
    const [passwordReenter, setPasswordReenter] = useState(''); // Password re-entered when creating an account
    const navigate = useNavigate(); // Get navigation hook
    const modalRef = useRef(null); // Keep a reference to the modal element
    const [oldHeight, setOldHeight] = useState(0); // Track the changing height of the modal

    /**
     * Update the bottom margin of the modal to keep it from shifting up and down when the
     * checkbox is clicked
     */
    useEffect(() => {
        if (oldHeight === 0) {
            setOldHeight(modalRef.current.clientHeight);
        } else {
            let margin = oldHeight - modalRef.current.clientHeight;
            if (margin > 0) {
                modalRef.current.style.margin = '0 5px calc(10vh + ' + margin + 'px)';
            } else {
                modalRef.current.style.margin = '0 5px 10vh';
            }
            setOldHeight(modalRef.current.clientHeight);
        }
    }, [existing]);

    /**
     * Call to the API to validate the entered credentials and naviagate to the homepage
     */
    function login () {
        if (username === '' ||password === '') {
            return;
        }

        api.login(username, password)
            .then(res => {
                setUser(res.user);
                navigate('/');
            })
            .catch(err => {
                console.log(err);
            });
    }

    /**
     * Call to the API to create a new account and navigate to the homepage
     */
    function createAccount () {
        if (username === '' || password === '' || password !== passwordReenter) {
            return;
        }

        api.createAccount(username, password)
            .then(res => {
                setUser(res.user);
                navigate('/');
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <>
            <div className="modal-wrapper">
                <div className="modal" ref={modalRef}>
                    <label className="title"><img src="/assets/logo.svg" alt="Digest" className="logo" /></label>

                    <hr className="divider" />

                    <div className="checkbox">
                        <label>
                            <input type="checkbox" onInput={(e) => { setExisting(e.target.checked) }}/>
                            <svg viewBox="0,0,50,50">
                                <path d="M5 30 L 20 45 L 45 10"></path>
                            </svg>
                            <span>I already have an account</span>
                        </label>
                    </div>

                    <div className="text-input">
                        <input type="text" maxLength={50} placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username} />
                    </div>

                    <div className="text-input">
                        <input type="password" maxLength={50} placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    </div>

                    {!existing && <div className="text-input">
                        <input type="password" maxLength={50} placeholder="Re-enter password" onChange={(e) => setPasswordReenter(e.target.value)} value={passwordReenter} />
                    </div>}

                    <div className="actions">
                        {existing ?
                            <button className="submit" onClick={login}>Log in</button>
                            :
                            <button className="submit" onClick={createAccount}>Create a new account</button>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}