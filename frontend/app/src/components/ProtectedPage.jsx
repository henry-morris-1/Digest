/** React imports */
import { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";

/** Global user context */
import { UserContext } from '../App';

/** User API controller */
import userAPI from '../api/userAPI';


export default function ProtectedPage({ children }) {
    const navigate = useNavigate(); // Get navigation hook
    const { user, setUser } = useContext(UserContext); // Get the global user context

    // Attempt to get the current user, and redirect to the login page if not autheticated
    useEffect(() => {
        userAPI.getCurrentUser()
            .then(res => {
                setUser(res.user);
            })
            .catch(err => {
                navigate('/login');
            });
    }, []);

    return (
        <>{children}</>
    );
}