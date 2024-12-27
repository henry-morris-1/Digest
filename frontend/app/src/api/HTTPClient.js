import fetchJsonp from 'fetch-jsonp';

/**
 * Validates that an HTTP response was OK
 * @param {HTTPResponse} res Response to check
 * @returns The passed response if it was ok
 */
function checkResponse (res) {
    if (!res.ok) {
        throw new Error("There was an error in fetch");
    }
    return res;
}

/**
 * Returns a response as a JSON object
 * @param {HTTPResonse} res Response to return
 * @returns The response as JSON
 */
function returnJSON (res) {
    return res.json();
}

/**
 * Prints and re-throws the given error
 * @param {Error} error Error to handle
 */
function handleError (error) {
    console.log("ERROR", error);
    throw error;
}

const HTTPClient = {
    getJsonp: (url, callback) => {
        return fetchJsonp(url, {
                    jsonpCallbackFunction: callback
                })
                .then (checkResponse)
                .then (returnJSON)
                .catch (handleError);
    },

    get: (url) => {
        return fetch(url)
                .then (checkResponse)
                .then (returnJSON)
                .catch (handleError);
    },

    post: (url, data) => {
        return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then (checkResponse)
                .then (returnJSON)
                .catch (handleError);
    },

    put: (url, data) => {
        return fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then (checkResponse)
                .then (returnJSON)
                .catch (handleError);
    },

    delete: (url) => {
        return fetch(url, {
                    method: 'DELETE'
                })
                .then (checkResponse)
                .then (returnJSON)
                .catch (handleError);
    }
}
export default HTTPClient;