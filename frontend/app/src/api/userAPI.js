/** HTTP Client */
import HTTPClient from './HTTPClient';

// Log a user in
const login = (username, password) => {
    // Get the url
    const url = '/api/users/login';

    // Make the fetch request
    return HTTPClient.post(url, {
        username: username,
        password: password
    });
}

// Log the current user out
const logout = () => {
    // Get the url
    const url = '/api/users/logout';

    // Make the fetch request
    return HTTPClient.post(url, {});
}

// Get the currently logged in user
const getCurrentUser = () => {
    // Get the url
    const url = '/api/users/current';

    // Make the fetch request
    return HTTPClient.get(url);
}

// Create a new account
const createAccount = (username, password) => {
    // Get the url
    const url = '/api/users/register';

    // Make the fetch request
    return HTTPClient.post(url, {
        username: username,
        password: password
    });
}

const api = {
    login,
    logout,
    getCurrentUser,
    createAccount
}
export default api;