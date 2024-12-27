const crypto = require('crypto');
const db = require('./DBConnection');
const User = require('./models/User');

/**
 * Validates and gets a filtered user object from a username and password
 * @param {String} username Username to validate
 * @param {String} password Password to validate
 * @returns Filtered user object for the matching user
 */
function getUserByCredentials(username, password) {
    return db.query('SELECT * FROM users WHERE username = ?', [username]).then(({results}) => {
        const user = new User(results[0]);
        if (user) {
            return user.validatePassword(password);
        } else {
            throw new Error("No such user");
        }
    });
}

/**
 * Creates a new user with the given username and password
 * @param {String} username Username for the new user
 * @param {String} password Password for the new user
 * @returns Filtered version of the newly created user
 */
function createUser(username, password) {
    // Generate a random salt
    return generateSalt().then(res => {
        const salt = res;

        // Generate the hashed password
        return hashPassword(password, salt).then(res => {
            const hashedPassword = res;

            // Insert the credentials into the db, then get the new user
            return db.query('INSERT INTO users (username, password, salt) VALUES (?, ?, ?)', [username, hashedPassword, salt]).then(() => {
                return getUserByCredentials(username, password);
            });
        });
    });
}

/**
 * Generates a random salt to store with passwords
 * @param {Number} length Salt length
 * @returns Promise containing the salt
 */
function generateSalt(length = 16) {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(length, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer.toString('hex'));
            }
        });
    });
}

/**
 * Hashes a password and hash together
 * @param {String} password Password for the hash
 * @param {String} salt Salt for the hash
 * @returns Promise containing the hash
 */
function hashPassword(password, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) {
              resolve(null);
            };
    
            const hashResult = derivedKey.toString('hex');
            resolve(hashResult);
        });
    });
}

module.exports = {
    getUserByCredentials: getUserByCredentials,
    createUser: createUser
};